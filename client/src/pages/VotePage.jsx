import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCircle2, ArrowRight, Trophy, Eye, EyeOff } from 'lucide-react'
import Confetti from 'react-confetti'
import { useSocket } from '../context/SocketContext'
import { api } from '../utils/api'
import CountdownTimer from '../components/CountdownTimer'
import WaitingRoom from '../components/WaitingRoom'

const VotePage = () => {
  const { pollId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { socket, joinPoll, leavePoll } = useSocket()
  
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [voterId] = useState(() => {
    // Generate or retrieve voter ID from location state or localStorage
    if (location.state?.userId) {
      return location.state.userId
    }
    const stored = localStorage.getItem('userId')
    if (stored) return stored
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userId', newId)
    return newId
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [pollExpired, setPollExpired] = useState(false)

  useEffect(() => {
    loadPoll()
    joinPoll(pollId)

    // Listen for real-time updates
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
    }

    return () => {
      leavePoll(pollId)
      if (socket) {
        socket.off('poll:updated')
        socket.off('poll:closed')
        socket.off('poll:started')
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

  const handleOptionToggle = (optionId) => {
    if (poll.status !== 'active') return
    if (hasVoted && !poll.settings.allowRevote) return

    if (poll.settings.multipleChoice) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId))
      } else {
        setSelectedOptions([...selectedOptions, optionId])
      }
    } else {
      setSelectedOptions([optionId])
    }
  }

  const handleSubmitVote = async () => {
    if (poll.status !== 'active') {
      alert('Poll is not active')
      return
    }

    if (selectedOptions.length === 0) {
      alert('Please select at least one option')
      return
    }

    try {
      const response = await api.submitVote(pollId, {
        optionIds: selectedOptions,
        voterId
      })

      if (response.success) {
        setHasVoted(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
        
        // Refresh poll data
        await loadPoll()
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert(error.response?.data?.error || 'Failed to submit vote')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-church-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading poll...</p>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Poll not found</p>
          <button onClick={() => navigate('/join')} className="btn-primary">
            Join Another Poll
          </button>
        </div>
      </div>
    )
  }

  // Show waiting room if poll is in waiting state
  if (poll.status === 'waiting') {
    return (
      <WaitingRoom 
        pollId={poll.id}
        pollTitle={poll.title}
        onPollStarted={(startedPoll) => {
          setPoll(startedPoll)
        }}
      />
    )
  }

  const getPercentage = (votes) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  const maxVotes = Math.max(...poll.options.map(o => o.votes), 1)
  
  // Determine if we should show live results (vote counts during voting)
  const shouldShowLiveResults = () => {
    // Only show live results if poll is active and live results enabled
    if (poll.status === 'active' && !pollExpired) {
      if (poll.endTime && poll.settings.showResultsBeforeEnd) return true
    }
    return false
  }

  // Determine if we should show final results (with percentages and winner)
  const shouldShowFinalResults = () => {
    // Only show final results when poll is closed or timer expired
    if (poll.status === 'closed' || pollExpired) return true
    return false
  }

  const handleCountdownComplete = () => {
    setPollExpired(true)
    loadPoll() // Reload to get updated status
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Poll Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#f5f3ff' }}>
            <span className="font-semibold" style={{ color: '#5B4A9D' }}>
              Poll Code: {poll.code}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-800">
            {poll.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </span>
            <span className={`px-3 py-1 rounded-full ${
              poll.status === 'active' && !pollExpired
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {poll.status === 'active' && !pollExpired ? '🔴 Live' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        {poll.endTime && poll.status === 'active' && (
          <div className="mb-8">
            <CountdownTimer 
              endTime={poll.endTime} 
              onComplete={handleCountdownComplete}
            />
          </div>
        )}

        {/* Results Info Message */}
        {poll.status === 'active' && !pollExpired && !poll.settings.showResultsBeforeEnd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
          >
            <EyeOff className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Final results and winner will be revealed when the timer ends
            </p>
          </motion.div>
        )}

        {poll.status === 'active' && !pollExpired && poll.settings.showResultsBeforeEnd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
          >
            <Eye className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Live vote counts visible • Winner revealed when timer ends
            </p>
          </motion.div>
        )}

        {/* Final Results Banner */}
        {shouldShowFinalResults() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, #F39C12 0%, #E74C3C 100%)' }}
          >
            <Trophy className="h-12 w-12 mx-auto mb-3 text-white" />
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Final Results
            </h2>
            <p className="text-white text-sm opacity-90">
              Poll has ended • Winner and percentages revealed below
            </p>
          </motion.div>
        )}

        {/* Voting Status Message */}
        <AnimatePresence>
          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6 text-center"
            >
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-green-800 mb-1">
                Vote Recorded!
              </h3>
              <p className="text-green-700">
                {poll.settings.showResults 
                  ? 'Thank you for voting! See the results below.' 
                  : 'Thank you for voting!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {poll.options.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id)
            const percentage = getPercentage(option.votes)
            const isWinning = option.votes === maxVotes && option.votes > 0
            const showLive = shouldShowLiveResults()
            const showFinal = shouldShowFinalResults()

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => poll.status === 'active' && !pollExpired && handleOptionToggle(option.id)}
                className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                  poll.status === 'active' && !pollExpired ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isSelected
                    ? 'border-church-500 bg-church-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-church-300 hover:shadow-md'
                } ${showFinal && isWinning ? 'ring-4 ring-yellow-400' : ''}`}
              >
                {/* Progress Bar - Only show in final results */}
                {showFinal && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 ${
                      isWinning 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' 
                        : 'bg-gradient-to-r from-purple-50 to-purple-100'
                    }`}
                  />
                )}

                <div className="relative p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Checkbox/Radio */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-church-600 bg-church-600' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>

                    {/* Option Text */}
                    <span className="text-lg font-semibold text-gray-800 flex-1">
                      {option.text}
                    </span>

                    {/* Winner Badge - Only show in final results */}
                    {showFinal && isWinning && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </motion.div>
                    )}
                  </div>

                  {/* Live Vote Count - During voting */}
                  {showLive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-4 px-4 py-2 rounded-lg"
                      style={{ backgroundColor: '#f5f3ff', color: '#5B4A9D' }}
                    >
                      <div className="text-xl font-bold">
                        {option.votes}
                      </div>
                      <div className="text-xs">
                        {option.votes === 1 ? 'vote' : 'votes'}
                      </div>
                    </motion.div>
                  )}

                  {/* Final Results - After timer ends */}
                  {showFinal && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-right ml-4"
                    >
                      <div className={`text-3xl font-bold ${isWinning ? 'text-yellow-600' : 'text-gray-800'}`}>
                        {percentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        {poll.status === 'active' && !pollExpired && !hasVoted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitVote}
            disabled={selectedOptions.length === 0}
            className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Submit Vote
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        )}

        {poll.settings.allowRevote && hasVoted && poll.status === 'active' && !pollExpired && (
          <button
            onClick={() => setHasVoted(false)}
            className="btn-secondary w-full text-lg py-4 mt-4"
          >
            Change My Vote
          </button>
        )}

        {poll.settings.showResults && hasVoted && (
          <button
            onClick={() => navigate(`/poll/${pollId}/results`)}
            className="btn-secondary w-full text-lg py-4 mt-4"
          >
            View Full Results Dashboard
          </button>
        )}
      </motion.div>
    </div>
  )
}

export default VotePage
