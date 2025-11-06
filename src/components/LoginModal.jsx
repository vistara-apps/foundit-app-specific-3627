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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-surface rounded-lg max-w-md w-full p-6 animate-slide-up shadow-modal">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Check Your Email
            </h3>
            <p className="text-text-muted mb-4">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link to complete your login.
            </p>
            <div className="text-sm text-text-muted">
              Simulating magic link click in 2 seconds...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface rounded-lg max-w-md w-full p-6 animate-slide-up shadow-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Login to Claim Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary focus-ring rounded-md"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              autoComplete="email"
              required
            />
          </div>

          <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4">
            <p className="text-sm text-text-secondary">
              We'll send you a secure magic link to complete your login. 
              No password required!
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover active:scale-95 focus-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-button"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                Send Magic Link
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal