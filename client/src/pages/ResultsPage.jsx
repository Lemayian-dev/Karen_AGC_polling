import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Trophy, Users, TrendingUp, Activity, Download, Share2 } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { api } from '../utils/api'

const ResultsPage = () => {
  const { pollId } = useParams()
  const { socket, joinPoll, leavePoll } = useSocket()
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState('bar') // 'bar' or 'pie'

  const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#14b8a6']

  useEffect(() => {
    loadPoll()
    joinPoll(pollId)

    if (socket) {
      socket.on('poll:updated', (updatedPoll) => {
        if (updatedPoll.id === pollId) {
          setPoll(updatedPoll)
        }
      })

      socket.on('poll:closed', (closedPoll) => {
        if (closedPoll.id === pollId) {
          setPoll(closedPoll)
        }
      })

      socket.on('poll:started', (startedPoll) => {
        if (startedPoll.id === pollId) {
          setPoll(startedPoll)
        }
      })

      socket.on('waitingRoom:updated', (data) => {
        if (data.pollId === pollId) {
          // Update participant count in poll
          setPoll(prev => ({ ...prev, participantCount: data.count }))
        }
      })
    }

    return () => {
      leavePoll(pollId)
      if (socket) {
        socket.off('poll:updated')
        socket.off('poll:closed')
        socket.off('poll:started')
        socket.off('waitingRoom:updated')
      }
    }
  }, [pollId, socket])

  const loadPoll = async () => {
    try {
      const response = await api.getPollById(pollId)
      if (response.success) {
        setPoll(response.poll)
      }
    } catch (error) {
      console.error('Error loading poll:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartPoll = async () => {
    if (window.confirm(`Start poll "${poll.title}"? All participants in the waiting room will begin voting.`)) {
      try {
        await api.startPoll(pollId)
        await loadPoll()
      } catch (error) {
        console.error('Error starting poll:', error)
        alert('Failed to start poll')
      }
    }
  }

  const handleClosePoll = async () => {
    if (window.confirm('Are you sure you want to close this poll? This cannot be undone.')) {
      try {
        await api.closePoll(pollId)
        await loadPoll()
      } catch (error) {
        console.error('Error closing poll:', error)
        alert('Failed to close poll')
      }
    }
  }

  const exportResults = () => {
    const csvContent = [
      ['Option', 'Votes', 'Percentage'],
      ...poll.options.map(opt => [
        opt.text,
        opt.votes,
        `${getPercentage(opt.votes)}%`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poll-results-${poll.code}.csv`
    a.click()
  }

  const shareResults = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Results link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-church-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Poll not found</p>
      </div>
    )
  }

  const getPercentage = (votes) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  const chartData = poll.options.map((option, index) => ({
    name: option.text,
    votes: option.votes,
    percentage: getPercentage(option.votes),
    fill: COLORS[index % COLORS.length]
  }))

  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)
  const winner = sortedOptions[0]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{poll.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                poll.status === 'waiting'
                  ? 'bg-yellow-100 text-yellow-700'
                  : poll.status === 'active' 
                    ? 'bg-green-100 text-green-700 animate-pulse' 
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {poll.status === 'waiting' ? '⏳ Waiting' : poll.status === 'active' ? '🔴 Live' : 'Closed'}
              </span>
            </div>
            <p className="text-gray-600">
              Poll Code: <span className="font-mono font-bold">{poll.code}</span>
              {poll.status === 'waiting' && poll.participantCount !== undefined && (
                <span className="ml-4 text-sm">
                  👥 {poll.participantCount} {poll.participantCount === 1 ? 'participant' : 'participants'} waiting
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={shareResults} className="btn-secondary flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button onClick={exportResults} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            {poll.status === 'waiting' && (
              <button 
                onClick={handleStartPoll} 
                className="text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: '#10b981' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                ▶️ Start Poll
              </button>
            )}
            {poll.status === 'active' && (
              <button 
                onClick={handleClosePoll} 
                className="text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#E74C3C' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E74C3C'}
              >
                Close Poll
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-church-50 to-purple-50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Votes</p>
                <p className="text-3xl font-bold text-church-700">{poll.totalVotes}</p>
              </div>
              <Users className="h-12 w-12 text-church-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Options</p>
                <p className="text-3xl font-bold text-blue-700">{poll.options.length}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Leading Option</p>
                <p className="text-lg font-bold text-yellow-700 truncate">{winner.text}</p>
              </div>
              <Trophy className="h-12 w-12 text-yellow-400" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-church-600" />
              Vote Distribution
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Percentage Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="votes"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Results</h2>
        <div className="space-y-4">
          {sortedOptions.map((option, index) => {
            const percentage = getPercentage(option.votes)
            const isWinner = index === 0 && option.votes > 0

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {isWinner && <Trophy className="h-5 w-5 text-yellow-600" />}
                    <span className="font-semibold text-gray-800">{option.text}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({option.votes} {option.votes === 1 ? 'vote' : 'votes'})
                    </span>
                  </div>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default ResultsPage
