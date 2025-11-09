import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Camera, Keyboard } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { api } from '../utils/api'

const JoinPoll = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('code') // 'code' or 'name'
  const [joinMethod, setJoinMethod] = useState('code') // 'code' or 'qr'
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)

  const handleJoinByCode = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!code.trim()) {
      setError('Please enter a poll code')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.getPollByCode(code.toUpperCase())
      
      if (response.success) {
        setPoll(response.poll)
        setStep('name') // Move to name input step
      }
    } catch (error) {
      console.error('Error joining poll:', error)
      setError('Poll not found. Please check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitName = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    
    setLoading(true)
    try {
      // Generate or get user ID
      let userId = localStorage.getItem('userId')
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('userId', userId)
      }
      
      // Join waiting room
      await api.joinWaitingRoom(poll.id, { name: name.trim(), userId })
      
      // Navigate to poll page (which will show waiting room or voting based on poll status)
      navigate(`/poll/${poll.id}/vote`, { state: { userName: name.trim(), userId } })
    } catch (error) {
      console.error('Error joining waiting room:', error)
      setError('Failed to join. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startQRScanner = async () => {
    setScanning(true)
    setError('')
    
    try {
      const html5QrCode = new Html5Qrcode("qr-reader")
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          // Stop scanning
          await html5QrCode.stop()
          setScanning(false)
          
          // Try to join the poll with the decoded code
          try {
            const response = await api.getPollByCode(decodedText.toUpperCase())
            if (response.success) {
              setPoll(response.poll)
              setCode(decodedText.toUpperCase())
              setStep('name') // Move to name input step
            }
          } catch (error) {
            setError('Invalid QR code. Please try again.')
          }
        },
        (errorMessage) => {
          // Handle scan errors silently
        }
      )
    } catch (error) {
      console.error('Error starting QR scanner:', error)
      setError('Unable to access camera. Please use code input instead.')
      setScanning(false)
    }
  }

  const stopQRScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader")
      await html5QrCode.stop()
    } catch (error) {
      // Scanner might not be running
    }
    setScanning(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-church-100 to-primary-100 rounded-full mb-4">
            <LogIn className="h-12 w-12 text-church-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-church-700 to-primary-700 bg-clip-text text-transparent">
            Join a Poll
          </h1>
          <p className="text-gray-600">
            Enter a poll code or scan a QR code to participate
          </p>
        </div>

        {/* Join Method Selector */}
        {step === 'code' && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setJoinMethod('code')
                if (scanning) stopQRScanner()
              }}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                joinMethod === 'code'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={joinMethod === 'code' ? { background: 'linear-gradient(135deg, #5B4A9D 0%, #764ba2 100%)' } : {}}
            >
              <Keyboard className="h-5 w-5" />
              Enter Code
            </button>
            <button
              onClick={() => {
                setJoinMethod('qr')
                setError('')
              }}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                joinMethod === 'qr'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={joinMethod === 'qr' ? { background: 'linear-gradient(135deg, #5B4A9D 0%, #764ba2 100%)' } : {}}
            >
              <Camera className="h-5 w-5" />
              Scan QR Code
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Name Input Step */}
        {step === 'name' && poll && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f5f3ff' }}>
              <h2 className="text-xl font-heading font-bold mb-2" style={{ color: '#5B4A9D' }}>
                {poll.title}
              </h2>
              <p className="text-sm text-gray-600">
                Code: {poll.code}
              </p>
            </div>

            <form onSubmit={handleSubmitName} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input-field text-lg"
                  autoFocus
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Your name will be visible to other participants
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('code')
                    setPoll(null)
                    setName('')
                  }}
                  className="btn-secondary flex-1 py-4"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="btn-primary flex-1 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join Poll'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Code Input */}
        {step === 'code' && joinMethod === 'code' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleJoinByCode}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poll Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                className="input-field text-center text-2xl tracking-widest font-bold uppercase"
                maxLength={6}
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Enter the 6-character code shared by the poll creator
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining...' : 'Join Poll'}
            </button>
          </motion.form>
        )}

        {/* QR Scanner */}
        {step === 'code' && joinMethod === 'qr' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div id="qr-reader" className={scanning ? '' : 'hidden'}></div>
              {!scanning && (
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-center p-8">
                    <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Camera preview will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {!scanning ? (
              <button
                onClick={startQRScanner}
                className="btn-primary w-full text-lg py-4"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopQRScanner}
                className="btn-secondary w-full text-lg py-4"
              >
                Stop Scanner
              </button>
            )}

            <p className="text-sm text-gray-500 text-center">
              Point your camera at the QR code to automatically join the poll
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default JoinPoll
