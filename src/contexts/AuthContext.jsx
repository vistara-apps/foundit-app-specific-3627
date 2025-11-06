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
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('foundit_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, role = 'parent') => {
    // Simulate API call
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      childName: role === 'parent' ? 'Emma Rodriguez' : null,
      schoolId: 'school-1',
      createdAt: new Date().toISOString()
    }
    
    setUser(userData)
    localStorage.setItem('foundit_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('foundit_user')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isParent: user?.role === 'parent',
    isAdmin: user?.role === 'lostfound_admin',
    isSystemAdmin: user?.role === 'system_admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}