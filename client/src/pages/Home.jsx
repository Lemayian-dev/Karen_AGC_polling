import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, LogIn, Vote, Users, Zap, QrCode, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      icon: Vote,
      title: 'Real-Time Voting',
      description: 'Live updates as votes come in'
    },
    {
      icon: QrCode,
      title: 'QR Codes',
      description: 'Scan to join instantly'
    },
    {
      icon: Zap,
      title: 'Live Results',
      description: 'Track results in real-time'
    },
    {
      icon: Users,
      title: 'Easy to Use',
      description: 'No registration required'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kagc-purple-600 to-kagc-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-kagc-gold-500 p-4 rounded-2xl shadow-2xl">
                <Vote className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
              Engage Your Congregation
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto font-light">
              Real-time polling made simple. Perfect for church events and community decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl flex items-center gap-2 transition-all"
                    style={{ backgroundColor: '#E74C3C' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E74C3C'}
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span>Create Poll</span>
                  </motion.button>
                </Link>
              ) : (
                <Link to="/admin/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl flex items-center gap-2 transition-all"
                    style={{ backgroundColor: '#F39C12' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F39C12'}
                  >
                    <Shield className="h-6 w-6" />
                    <span>Admin Login</span>
                  </motion.button>
                </Link>
              )}
              
              <Link to="/join">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 flex items-center gap-2 transition-all"
                >
                  <LogIn className="h-6 w-6" />
                  <span>Join Poll</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-kagc-purple-600">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              Simple, powerful, real-time polling
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-kagc-purple-100 rounded-lg mb-4">
                    <Icon className="h-7 w-7 text-kagc-purple-600" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-kagc-purple-600 mb-3">
              Perfect For
            </h2>
            <p className="text-gray-600">Choir competitions • Elections • Feedback • Events</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🎵', title: 'Choir Competitions' },
              { emoji: '🗳️', title: 'Leadership Elections' },
              { emoji: '📊', title: 'Event Feedback' },
              { emoji: '📅', title: 'Planning Polls' },
              { emoji: '💬', title: 'Quick Surveys' },
              { emoji: '🤝', title: 'Community Decisions' }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-kagc-purple-50 to-white p-6 rounded-xl border-2 border-kagc-purple-100 hover:border-kagc-purple-300 transition-colors"
              >
                <div className="text-4xl mb-2">{useCase.emoji}</div>
                <h3 className="text-lg font-heading font-semibold text-gray-800">{useCase.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-kagc-red-500 to-kagc-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Start?
            </h2>
            <p className="text-xl mb-8 text-white/95">
              Create engaging polls in seconds
            </p>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-kagc-red-600 px-10 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl inline-flex items-center gap-2"
              >
                <PlusCircle className="h-6 w-6" />
                <span>Create Your First Poll</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
