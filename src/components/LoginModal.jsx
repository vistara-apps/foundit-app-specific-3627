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
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-surface rounded-2xl max-w-md w-full p-8 animate-slide-up shadow-modal">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Check Your Email
            </h3>
            <p className="text-text-muted mb-4 leading-relaxed">
              We've sent a magic link to <strong className="text-text-primary">{email}</strong>. 
              Click the link to complete your login.
            </p>
            <div className="text-sm text-text-muted bg-bg p-3 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
              Simulating magic link click...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-2xl max-w-md w-full p-8 animate-slide-up shadow-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Login to Claim Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-border focus-ring rounded-lg transition-all"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
              required
            />
          </div>

          <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-xl p-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              We'll send you a secure magic link to complete your login. 
              No password required! 🔒
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover active:scale-98 focus-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-button"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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