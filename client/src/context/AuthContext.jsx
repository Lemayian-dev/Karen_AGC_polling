import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('kagc_admin')
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin)
        setAdmin(adminData)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('kagc_admin')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Simple authentication - In production, this should be against a backend API
    // For now, using hardcoded credentials stored in browser
    const validCredentials = [
      { username: 'admin', password: 'kagc2024', name: 'Admin' },
      { username: 'kagc', password: 'church123', name: 'KAGC Admin' }
    ]

    const validAdmin = validCredentials.find(
      cred => cred.username === username && cred.password === password
    )

    if (validAdmin) {
      const adminData = {
        username: validAdmin.username,
        name: validAdmin.name,
        loginTime: new Date().toISOString()
      }
      setAdmin(adminData)
      setIsAuthenticated(true)
      localStorage.setItem('kagc_admin', JSON.stringify(adminData))
      return { success: true }
    }

    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setAdmin(null)
    setIsAuthenticated(false)
    localStorage.removeItem('kagc_admin')
  }

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
