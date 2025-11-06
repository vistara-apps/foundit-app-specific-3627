import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import PublicBrowse from './PublicBrowse'
import AdminDashboard from './AdminDashboard'
import LoginScreen from './LoginScreen'

const AppRouter = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show admin dashboard for authenticated admins
  if (user && (user.role === 'lostfound_admin' || user.role === 'system_admin')) {
    return <AdminDashboard />
  }

  // Show login screen for admin login attempts
  if (window.location.hash === '#admin') {
    return <LoginScreen />
  }

  // Default to public browse (works for both authenticated parents and anonymous users)
  return <PublicBrowse />
}

export default AppRouter