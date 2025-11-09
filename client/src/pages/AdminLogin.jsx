import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(username, password)

    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #5B4A9D 0%, #3d3170 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#F39C12' }}>
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-2" style={{ color: '#5B4A9D' }}>
              Admin Login
            </h2>
            <p className="text-gray-600">
              Sign in to manage polls and view analytics
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f5f3ff' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#5B4A9D' }}>
              Demo Credentials:
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> kagc2024</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm hover:underline"
              style={{ color: '#5B4A9D' }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
