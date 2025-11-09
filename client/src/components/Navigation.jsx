import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, PlusCircle, LogIn, BarChart3, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, admin, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/create', icon: PlusCircle, label: 'Create Poll', requiresAuth: true },
    { path: '/join', icon: LogIn, label: 'Join Poll' },
    { path: '/admin', icon: BarChart3, label: 'Dashboard', requiresAuth: true },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-md border-b-4 border-kagc-gold-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-kagc-purple-500 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold text-kagc-purple-600">
                KAGC Polling
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                Karen Africa Gospel Church
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              // Show all items if authenticated, or only non-auth items if not
              if (item.requiresAuth && !isAuthenticated) {
                return null
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-gray-700 hover:text-white'
                  }`}
                  style={isActive ? { backgroundColor: '#5B4A9D' } : {}}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#f5f3ff')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = '')}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Admin User Display & Logout */}
            {isAuthenticated && admin && (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg ml-2" style={{ backgroundColor: '#f5f3ff' }}>
                  <User className="h-4 w-4" style={{ color: '#5B4A9D' }} />
                  <span className="text-sm font-medium" style={{ color: '#5B4A9D' }}>
                    {admin.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-white"
                  style={{ backgroundColor: '#E74C3C' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E74C3C'}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50"
            style={{ color: '#5B4A9D' }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t overflow-hidden bg-white"
            style={{ borderColor: '#fde68a' }}
          >
            <div className="px-4 py-4 space-y-2">
              {/* Admin Info */}
              {isAuthenticated && admin && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-2" style={{ backgroundColor: '#f5f3ff' }}>
                  <User className="h-5 w-5" style={{ color: '#5B4A9D' }} />
                  <span className="font-medium" style={{ color: '#5B4A9D' }}>
                    {admin.name}
                  </span>
                </div>
              )}
              
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                // Hide auth-required items if not authenticated
                if (item.requiresAuth && !isAuthenticated) {
                  return null
                }
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-gray-700'
                    }`}
                    style={isActive ? { backgroundColor: '#5B4A9D' } : { backgroundColor: isActive ? '#5B4A9D' : '' }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Logout Button */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium text-white w-full"
                  style={{ backgroundColor: '#E74C3C' }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation
