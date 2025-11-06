import React, { useState } from 'react'
import { ArrowLeft, Shield, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginScreen = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      // Simulate admin login
      if (email === 'admin@school.edu' && password === 'admin123') {
        await login(email, 'lostfound_admin')
      } else if (email === 'system@school.edu' && password === 'system123') {
        await login(email, 'system_admin')
      } else {
        setError('Invalid credentials. Try admin@school.edu / admin123')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-8 focus-ring rounded-md p-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </button>

        {/* Login Card */}
        <div className="bg-surface rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Admin Login
            </h1>
            <p className="text-text-muted">
              Sign in to manage lost and found items
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-lg p-3">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-bg rounded-lg">
            <p className="text-xs font-medium text-text-secondary mb-2">Demo Credentials:</p>
            <div className="text-xs text-text-muted space-y-1">
              <div>Lost & Found Admin: admin@school.edu / admin123</div>
              <div>System Admin: system@school.edu / system123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen