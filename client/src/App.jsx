import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import CreatePoll from './pages/CreatePoll'
import JoinPoll from './pages/JoinPoll'
import VotePage from './pages/VotePage'
import ResultsPage from './pages/ResultsPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/create" 
                  element={
                    <ProtectedRoute>
                      <CreatePoll />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/join" element={<JoinPoll />} />
                <Route path="/poll/:pollId/vote" element={<VotePage />} />
                <Route path="/poll/:pollId/results" element={<ResultsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
