# Church Polling Software - Setup Guide

## 🚀 Quick Start

Follow these steps to get your polling software up and running:

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

#### 1. Install Backend Dependencies

Open a terminal in the project root directory and run:

```bash
npm install
```

#### 2. Install Frontend Dependencies

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
cd ..
```

#### 3. Start the Application

From the root directory, start both backend and frontend:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend application on http://localhost:5173

### Alternative: Install and Start Separately

**Terminal 1 (Backend):**
```bash
npm install
npm run server
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

## 📱 Using the Application

### Creating a Poll

1. Navigate to http://localhost:5173
2. Click "Create New Poll"
3. Enter poll title (e.g., "Vote for Best Church Choir 2024")
4. Add at least 2 options
5. Configure settings:
   - **Multiple Choice**: Allow voters to select multiple options
   - **Show Results**: Display results to voters after voting
   - **Allow Re-voting**: Let voters change their vote
6. Click "Create Poll"
7. Share the QR code or 6-character code with participants

### Joining a Poll

**Method 1: Using Code**
1. Click "Join Poll"
2. Select "Enter Code"
3. Type the 6-character code
4. Click "Join Poll"

**Method 2: Using QR Code**
1. Click "Join Poll"
2. Select "Scan QR Code"
3. Allow camera access
4. Point camera at the QR code
5. Automatically redirected to voting page

### Voting

1. Join a poll using code or QR
2. Select your choice(s)
3. Click "Submit Vote"
4. See confirmation and results (if enabled)

### Viewing Results

1. Click on "View Results Dashboard" after voting, or
2. Navigate to Admin Dashboard
3. Click "Results" on any poll
4. Watch real-time updates as votes come in

### Admin Dashboard

1. Navigate to http://localhost:5173/admin
2. View all polls and their statistics
3. Monitor active polls
4. Access results for any poll
5. Create new polls

## 🎨 Features Overview

### Real-time Updates
- Votes appear instantly on results dashboards
- Live vote counts and percentages
- WebSocket-powered real-time communication

### QR Code Integration
- Auto-generated QR codes for each poll
- Downloadable QR codes for printing
- Mobile-friendly QR scanning

### Beautiful Analytics
- Interactive bar and pie charts
- Percentage breakdowns
- Vote distribution visualization
- Winner highlighting

### User Experience
- Smooth animations and transitions
- Confetti celebration on vote submission
- Responsive design for all devices
- Intuitive navigation

## 🔧 Configuration

### Port Configuration

**Backend Port** (Default: 3001)
Edit `server/index.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

**Frontend Port** (Default: 5173)
Edit `client/vite.config.js`:
```javascript
server: {
  port: 5173
}
```

### CORS Configuration

If hosting frontend and backend on different domains, update CORS settings in `server/index.js`:
```javascript
const io = socketIo(server, {
  cors: {
    origin: "http://your-frontend-domain.com",
    methods: ["GET", "POST"]
  }
});
```

## 📊 Use Cases

### Church Choir Competition
1. Create poll: "Best Church Choir 2024"
2. Add options: Each choir name
3. Enable "Show Results" for live leaderboard
4. Project results on screen during event
5. Watch real-time voting unfold

### Leadership Elections
1. Create poll: "Youth Ministry Leader"
2. Add candidate names
3. Disable "Show Results" for privacy
4. Close poll after voting period
5. Share results with congregation

### Service Feedback
1. Create poll: "Sunday Service Experience"
2. Add rating options
3. Enable "Multiple Choice" for aspects
4. Collect instant feedback
5. Review analytics dashboard

## 🛠️ Troubleshooting

### Camera Not Working for QR Scanning
- Ensure browser has camera permissions
- Use HTTPS in production (required for camera access)
- Try using code input as alternative

### Real-time Updates Not Working
- Check both servers are running
- Verify WebSocket connection in browser console
- Ensure firewall allows WebSocket connections

### Port Already in Use
Change the port in configuration files or stop the conflicting process:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

## 📦 Production Deployment

### Building for Production

1. Build the frontend:
```bash
cd client
npm run build
```

2. Serve static files from backend or deploy separately

### Environment Variables

Create a `.env` file in the root:
```
PORT=3001
NODE_ENV=production
```

### Database Integration (Optional)

For production, consider replacing in-memory storage with a database:
- MongoDB for NoSQL
- PostgreSQL for SQL
- Redis for caching

## 🎯 Tips for Best Experience

1. **Test Before Event**: Run a test poll to familiarize yourself
2. **Print QR Codes**: Print large QR codes for easy scanning
3. **Display Results**: Use a projector to show live results
4. **Backup Plan**: Have code input as backup to QR scanning
5. **Monitor Dashboard**: Keep admin dashboard open during voting

## 📱 Mobile Optimization

The application is fully responsive and works great on:
- Smartphones
- Tablets
- Desktop computers
- Large displays/projectors

## 🔐 Security Considerations

For production use:
- Add authentication for admin features
- Implement rate limiting
- Use HTTPS
- Add CSRF protection
- Validate all inputs
- Store data securely

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review browser console for errors
3. Verify all dependencies are installed
4. Ensure both servers are running

## 🎉 Enjoy!

You now have a fully functional, real-time polling system perfect for church events, competitions, and community engagement!
