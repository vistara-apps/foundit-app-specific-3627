import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import PublicBrowse from './PublicBrowse'
import AdminDashboard from './AdminDashboard'
import LoginScreen from './LoginScreen'
import { FullPageLoader } from './LoadingSkeleton'

const AppRouter = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullPageLoader message="Loading FoundIt..." />
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