import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Clock, User, Sparkles } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { api } from '../utils/api'

const WaitingRoom = ({ pollId, pollTitle, onPollStarted }) => {
  const [participants, setParticipants] = useState([])
  const [count, setCount] = useState(0)
  const { socket } = useSocket()

  useEffect(() => {
    loadParticipants()

    // Listen for real-time participant updates
    if (socket) {
      socket.on('waitingRoom:updated', (data) => {
        if (data.pollId === pollId) {
          setParticipants(data.participants)
          setCount(data.count)
        }
      })

      // Listen for poll start
      socket.on('poll:started', (poll) => {
        if (poll.id === pollId) {
          if (onPollStarted) {
            onPollStarted(poll)
          }
        }
      })
    }

    return () => {
      if (socket) {
        socket.off('waitingRoom:updated')
        socket.off('poll:started')
      }
    }
  }, [socket, pollId])

  const loadParticipants = async () => {
    try {
      const response = await api.getParticipants(pollId)
      if (response.success) {
        setParticipants(response.participants)
        setCount(response.count)
      }
    } catch (error) {
      console.error('Error loading participants:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="inline-block mb-4"
            >
              <div className="p-4 rounded-full" style={{ backgroundColor: '#f5f3ff' }}>
                <Clock className="h-12 w-12" style={{ color: '#5B4A9D' }} />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-heading font-bold mb-2 text-gray-800">
              {pollTitle}
            </h1>
            <p className="text-lg text-gray-600">
              Waiting for admin to start the poll...
            </p>
          </div>

          {/* Participant Count */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-8 p-6 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <div className="flex items-center justify-center gap-3 text-white">
              <Users className="h-8 w-8" />
              <div>
                <div className="text-4xl font-heading font-bold">{count}</div>
                <div className="text-sm opacity-90">
                  {count === 1 ? 'Participant' : 'Participants'} Joined
                </div>
              </div>
            </div>
          </motion.div>

          {/* Participants Display - Spread across page */}
          <div className="min-h-[300px] relative">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Sparkles className="h-5 w-5" style={{ color: '#5B4A9D' }} />
              <h3 className="font-heading font-semibold text-lg" style={{ color: '#5B4A9D' }}>
                Who's Here
              </h3>
            </div>

            <AnimatePresence>
              {participants.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-400"
                >
                  <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for participants to join...</p>
                </motion.div>
              ) : (
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  {participants.map((participant, index) => (
                    <motion.div
                      key={participant.userId}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        rotate: 0,
                        y: [0, -10, 0]
                      }}
                      exit={{ opacity: 0, scale: 0, rotate: 180 }}
                      transition={{ 
                        delay: index * 0.08,
                        y: {
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: Math.random() * 2,
                          delay: index * 0.3
                        }
                      }}
                      className="relative"
                    >
                      {/* Avatar */}
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-default"
                        style={{ 
                          backgroundColor: getAvatarColor(index),
                          boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                        }}
                        title={participant.name}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name Badge */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      >
                        <div className="px-2 py-1 rounded-full text-xs font-semibold bg-white shadow-md text-gray-700 border border-gray-200">
                          {participant.name.length > 12 
                            ? participant.name.substring(0, 10) + '...' 
                            : participant.name}
                        </div>
                      </motion.div>

                      {/* First Badge */}
                      {index === 0 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                          style={{ backgroundColor: '#F39C12', color: 'white' }}
                        >
                          🎉
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading Indicator */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <div className="flex gap-1">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#5B4A9D' }}
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#5B4A9D' }}
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#5B4A9D' }}
                />
              </div>
              <span className="text-sm">Waiting for admin to start</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// Helper function to get consistent avatar colors
const getAvatarColor = (index) => {
  const colors = [
    '#5B4A9D', // KAGC Purple
    '#E74C3C', // KAGC Red
    '#F39C12', // KAGC Gold
    '#3498db', // Blue
    '#2ecc71', // Green
    '#9b59b6', // Purple
    '#e67e22', // Orange
    '#1abc9c', // Teal
  ]
  return colors[index % colors.length]
}

// Helper function to format join time
const formatJoinTime = (timestamp) => {
  const now = new Date()
  const joined = new Date(timestamp)
  const seconds = Math.floor((now - joined) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

export default WaitingRoom
