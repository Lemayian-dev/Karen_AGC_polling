import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Users, Eye, ExternalLink, Clock, CheckCircle } from 'lucide-react'
import { api } from '../utils/api'
import { useSocket } from '../context/SocketContext'

const AdminDashboard = () => {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()

  useEffect(() => {
    loadPolls()

    if (socket) {
      socket.on('poll:created', () => {
        loadPolls()
      })

      socket.on('poll:stats', () => {
        loadPolls()
      })
    }
  }, [socket])

  const loadPolls = async () => {
    try {
      const response = await api.getAllPolls()
      if (response.success) {
        setPolls(response.polls.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ))
      }
    } catch (error) {
      console.error('Error loading polls:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0)
  const activePolls = polls.filter(p => p.status === 'active').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-church-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-church-700 to-primary-700 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage and monitor all your polls in real-time</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-church-50 to-purple-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Polls</p>
              <p className="text-4xl font-bold text-church-700">{polls.length}</p>
            </div>
            <BarChart3 className="h-12 w-12 text-church-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-green-50 to-emerald-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Polls</p>
              <p className="text-4xl font-bold text-green-700">{activePolls}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-blue-50 to-cyan-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Votes</p>
              <p className="text-4xl font-bold text-blue-700">{totalVotes}</p>
            </div>
            <Users className="h-12 w-12 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Polls List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Polls</h2>
          <Link to="/create">
            <button className="btn-primary">
              Create New Poll
            </button>
          </Link>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No polls created yet</p>
            <Link to="/create">
              <button className="btn-primary">
                Create Your First Poll
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {polls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Poll Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{poll.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        poll.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {poll.status === 'active' ? '🔴 Live' : 'Closed'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(poll.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {poll.totalVotes} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        {poll.options.length} options
                      </span>
                      <span className="font-mono font-semibold text-church-600">
                        Code: {poll.code}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/poll/${poll.id}/vote`}>
                      <button className="btn-secondary flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Vote
                      </button>
                    </Link>
                    <Link to={`/poll/${poll.id}/results`}>
                      <button className="btn-primary flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Results
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                {poll.totalVotes > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {poll.options.map((option, idx) => {
                        const percentage = poll.totalVotes > 0 
                          ? Math.round((option.votes / poll.totalVotes) * 100) 
                          : 0
                        return (
                          <div key={idx} className="flex-shrink-0">
                            <div className="text-xs text-gray-600 mb-1 truncate max-w-[120px]">
                              {option.text}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-church-500 to-primary-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-700">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboard
