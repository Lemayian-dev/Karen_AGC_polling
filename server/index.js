const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (consider using a database for production)
const polls = new Map();
const votes = new Map();
const activeSessions = new Map();
const waitingRooms = new Map(); // Track participants in waiting room

// Generate unique poll code
function generatePollCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a new poll
app.post('/api/polls', async (req, res) => {
  try {
    const { title, options, settings } = req.body;
    
    const pollId = uuidv4();
    const pollCode = generatePollCode();
    
    const poll = {
      id: pollId,
      code: pollCode,
      title,
      options: options.map((option, index) => ({
        id: index,
        text: option,
        votes: 0
      })),
      settings: {
        multipleChoice: settings?.multipleChoice || false,
        showResults: settings?.showResults !== false,
        allowRevote: settings?.allowRevote || false,
        duration: settings?.duration || null,
        showResultsBeforeEnd: settings?.showResultsBeforeEnd || false
      },
      createdAt: new Date().toISOString(),
      startedAt: null,
      endTime: null,
      status: 'waiting', // Poll starts in waiting state
      totalVotes: 0,
      participantCount: 0
    };
    
    polls.set(pollId, poll);
    votes.set(pollId, new Map());
    waitingRooms.set(pollId, []); // Initialize empty waiting room
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(`${pollCode}`);
    
    res.json({
      success: true,
      poll: {
        ...poll,
        qrCode: qrCodeUrl
      }
    });
    
    // Notify all connected clients about new poll
    io.emit('poll:created', { pollId, code: pollCode, title });
    
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get poll by code
app.get('/api/polls/code/:code', (req, res) => {
  const { code } = req.params;
  
  const poll = Array.from(polls.values()).find(p => p.code === code.toUpperCase());
  
  if (!poll) {
    return res.status(404).json({ success: false, error: 'Poll not found' });
  }
  
  res.json({ success: true, poll });
});

// Get poll by ID
app.get('/api/polls/:id', (req, res) => {
  const { id } = req.params;
  const poll = polls.get(id);
  
  if (!poll) {
    return res.status(404).json({ success: false, error: 'Poll not found' });
  }
  
  res.json({ success: true, poll });
});

// Get all polls
app.get('/api/polls', (req, res) => {
  const allPolls = Array.from(polls.values());
  res.json({ success: true, polls: allPolls });
});

// Submit a vote
app.post('/api/polls/:id/vote', (req, res) => {
  try {
    const { id } = req.params;
    const { optionIds, voterId } = req.body;
    
    const poll = polls.get(id);
    
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }
    
    if (poll.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Poll is not active' });
    }
    
    const pollVotes = votes.get(id);
    
    // Check if voter has already voted
    if (pollVotes.has(voterId) && !poll.settings.allowRevote) {
      return res.status(400).json({ success: false, error: 'You have already voted' });
    }
    
    // Remove previous vote if revoting
    if (pollVotes.has(voterId)) {
      const previousVote = pollVotes.get(voterId);
      previousVote.forEach(optionId => {
        const option = poll.options.find(o => o.id === optionId);
        if (option) option.votes--;
      });
      poll.totalVotes--;
    }
    
    // Add new vote
    optionIds.forEach(optionId => {
      const option = poll.options.find(o => o.id === optionId);
      if (option) option.votes++;
    });
    
    poll.totalVotes++;
    pollVotes.set(voterId, optionIds);
    
    res.json({ success: true, message: 'Vote recorded' });
    
    // Broadcast updated results to all connected clients
    io.to(`poll:${id}`).emit('poll:updated', poll);
    io.emit('poll:stats', {
      pollId: id,
      totalVotes: poll.totalVotes,
      options: poll.options
    });
    
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Join waiting room
app.post('/api/polls/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const { name, userId } = req.body;
    
    const poll = polls.get(id);
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }
    
    const waitingRoom = waitingRooms.get(id) || [];
    
    // Check if user already in waiting room
    const existingUser = waitingRoom.find(u => u.userId === userId);
    if (existingUser) {
      return res.json({ success: true, message: 'Already in waiting room', participant: existingUser });
    }
    
    // Add participant to waiting room
    const participant = {
      userId,
      name,
      joinedAt: new Date().toISOString()
    };
    
    waitingRoom.push(participant);
    waitingRooms.set(id, waitingRoom);
    poll.participantCount = waitingRoom.length;
    
    res.json({ success: true, participant });
    
    // Broadcast updated participant list to all clients in this poll
    io.to(`poll:${id}`).emit('waitingRoom:updated', {
      pollId: id,
      participants: waitingRoom,
      count: waitingRoom.length
    });
    
  } catch (error) {
    console.error('Error joining waiting room:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get waiting room participants
app.get('/api/polls/:id/participants', (req, res) => {
  const { id } = req.params;
  const waitingRoom = waitingRooms.get(id) || [];
  
  res.json({ 
    success: true, 
    participants: waitingRoom,
    count: waitingRoom.length
  });
});

// Start poll (Admin only)
app.post('/api/polls/:id/start', (req, res) => {
  try {
    const { id } = req.params;
    const poll = polls.get(id);
    
    if (!poll) {
      return res.status(404).json({ success: false, error: 'Poll not found' });
    }
    
    if (poll.status !== 'waiting') {
      return res.status(400).json({ success: false, error: 'Poll is not in waiting state' });
    }
    
    // Start the poll
    poll.status = 'active';
    poll.startedAt = new Date().toISOString();
    
    // Calculate end time if duration is set
    if (poll.settings.duration) {
      poll.endTime = new Date(Date.now() + poll.settings.duration * 60 * 1000).toISOString();
      
      // Schedule auto-close
      const timeUntilEnd = poll.settings.duration * 60 * 1000;
      setTimeout(() => {
        const currentPoll = polls.get(id);
        if (currentPoll && currentPoll.status === 'active') {
          currentPoll.status = 'closed';
          currentPoll.closedAt = new Date().toISOString();
          io.to(`poll:${id}`).emit('poll:closed', currentPoll);
          console.log(`Poll ${poll.code} auto-closed after duration`);
        }
      }, timeUntilEnd);
    }
    
    res.json({ success: true, poll });
    
    // Notify all participants that poll has started
    io.to(`poll:${id}`).emit('poll:started', poll);
    
  } catch (error) {
    console.error('Error starting poll:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Close a poll
app.post('/api/polls/:id/close', (req, res) => {
  const { id } = req.params;
  const poll = polls.get(id);
  
  if (!poll) {
    return res.status(404).json({ success: false, error: 'Poll not found' });
  }
  
  poll.status = 'closed';
  poll.closedAt = new Date().toISOString();
  
  res.json({ success: true, poll });
  
  // Notify all clients
  io.to(`poll:${id}`).emit('poll:closed', poll);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join a poll room
  socket.on('join:poll', (pollId) => {
    socket.join(`poll:${pollId}`);
    console.log(`Client ${socket.id} joined poll ${pollId}`);
    
    // Send current poll data
    const poll = polls.get(pollId);
    if (poll) {
      socket.emit('poll:data', poll);
    }
  });
  
  // Leave a poll room
  socket.on('leave:poll', (pollId) => {
    socket.leave(`poll:${pollId}`);
    console.log(`Client ${socket.id} left poll ${pollId}`);
  });
  
  // Request poll update
  socket.on('poll:refresh', (pollId) => {
    const poll = polls.get(pollId);
    if (poll) {
      socket.emit('poll:data', poll);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
