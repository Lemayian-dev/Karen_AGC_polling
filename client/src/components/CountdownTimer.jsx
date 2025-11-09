import { useState, useEffect } from 'react'
import { Clock, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CountdownTimer = ({ endTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!endTime) return

    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date()
      
      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onComplete) onComplete()
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onComplete])

  if (!endTime || !timeLeft) return null

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl md:text-4xl font-heading font-bold"
        style={{ color: isExpired ? '#10b981' : '#5B4A9D' }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="text-xs md:text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )

  if (isExpired) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-3 p-4 rounded-xl"
          style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
        >
          <CheckCircle className="h-6 w-6" />
          <div>
            <p className="font-heading font-bold">Voting Ended</p>
            <p className="text-sm">Results are now available</p>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2" style={{ borderColor: '#ddd6fe' }}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-5 w-5" style={{ color: '#5B4A9D' }} />
        <h3 className="font-heading font-semibold" style={{ color: '#5B4A9D' }}>
          Time Remaining
        </h3>
      </div>
      
      <div className="flex justify-center gap-4 md:gap-8">
        {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="Days" />}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <TimeUnit value={timeLeft.hours} label="Hours" />
        )}
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Sec" />
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              backgroundColor: '#5B4A9D',
              width: `${calculateProgress()}%`
            }}
            initial={{ width: '100%' }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </div>
  )

  function calculateProgress() {
    if (!endTime || isExpired) return 0
    const total = new Date(endTime) - new Date(endTime).setHours(0, 0, 0, 0)
    const remaining = new Date(endTime) - new Date()
    return Math.max(0, (remaining / total) * 100)
  }
}

export default CountdownTimer
