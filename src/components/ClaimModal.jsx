import React, { useState } from 'react'
import { X, User, MessageSquare, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

const ClaimModal = ({ item, onClose }) => {
  const { user } = useAuth()
  const { submitClaim } = useData()
  const [childName, setChildName] = useState(user?.childName || '')
  const [claimReason, setClaimReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!childName.trim() || !claimReason.trim()) return

    setIsSubmitting(true)
    
    try {
      await submitClaim(item.id, {
        parentId: user.id,
        childName: childName.trim(),
        claimReason: claimReason.trim()
      })
      
      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Failed to submit claim:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-surface rounded-2xl max-w-md w-full p-8 animate-slide-up shadow-modal">
          <div className="text-center">
            <div className="w-20 h-20 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">✓</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Claim Submitted!
            </h3>
            <p className="text-text-secondary leading-relaxed">
              The Lost & Found admin will review your claim within 24 hours. 
              You'll receive an email notification when it's approved.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up shadow-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-bg">
          <h2 className="text-2xl font-bold text-text-primary">
            Claim This Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover focus-ring rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Item Preview */}
          <div className="flex gap-4 mb-6 p-4 bg-bg rounded-xl border border-border">
            <img
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.description}
              className="w-24 h-24 object-cover rounded-lg shadow-sm"
            />
            <div className="flex-1">
              <h3 className="font-medium text-text-primary mb-1">
                {item.description}
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Claim Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Child Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Child's Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter your child's full name"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Claim Reason */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Why do you believe this belongs to your child?
              </label>
              <textarea
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                placeholder="Please provide details like where it was lost, unique identifiers, or distinguishing features..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-secondary">
                  <p className="font-medium text-text-primary mb-1">
                    Verification Process
                  </p>
                  <p>
                    Our Lost & Found admin will review your claim and may ask for 
                    additional verification before approving. Please provide as much 
                    detail as possible to help speed up the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface-hover focus-ring transition-all duration-150 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !childName.trim() || !claimReason.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg focus-ring transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </span>
                ) : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClaimModal