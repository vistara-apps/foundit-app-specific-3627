import React, { useState } from 'react'
import { X, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginModal = ({ onClose, onSuccess }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    
    try {
      // Simulate magic link flow
      setMagicLinkSent(true)
      
      // Simulate clicking magic link after 2 seconds
      setTimeout(async () => {
        await login(email, 'parent')
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-surface rounded-2xl max-w-md w-full p-8 animate-slide-up shadow-modal">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Check Your Email
            </h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              We've sent a magic link to <strong className="text-primary">{email}</strong>. 
              Click the link to complete your login.
            </p>
            <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Simulating magic link click...
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-2xl max-w-md w-full p-8 animate-slide-up shadow-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Login to Claim Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover focus-ring rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-input" className="block text-sm font-semibold text-text-secondary mb-2">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-sm"
              required
              autoFocus
            />
          </div>

          <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              🔒 We'll send you a secure magic link to complete your login. 
              No password required!
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg focus-ring transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </div>
            ) : (
              <>
                Send Magic Link
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal