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
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-surface rounded-2xl max-w-md w-full p-8 animate-slide-up shadow-modal">
          <div className="text-center">
            <div className="w-20 h-20 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Claim Submitted Successfully!
            </h3>
            <p className="text-text-muted leading-relaxed">
              The Lost & Found admin will review your claim within 24 hours. 
              You'll receive an email notification when it's approved.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up shadow-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-bg bg-opacity-50">
          <h2 className="text-xl font-bold text-text-primary">
            Claim This Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-border focus-ring rounded-lg transition-all"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Item Preview */}
          <div className="flex gap-4 mb-6 p-4 bg-bg bg-opacity-50 rounded-xl border border-border">
            <img
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.description}
              className="w-24 h-24 object-cover rounded-lg shadow-sm"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-2">
                {item.description}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-primary bg-opacity-10 text-primary px-2.5 py-1 rounded-full font-medium"
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
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Child's Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter your child's full name"
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>

            {/* Claim Reason */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Why do you believe this belongs to your child?
              </label>
              <textarea
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                placeholder="Please provide details like where it was lost, unique identifiers, or distinguishing features..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all"
                required
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-secondary">
                  <p className="font-semibold text-text-primary mb-1">
                    Verification Process
                  </p>
                  <p className="leading-relaxed">
                    Our Lost & Found admin will review your claim and may ask for 
                    additional verification before approving. Please provide as much 
                    detail as possible to help speed up the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-border text-text-secondary rounded-xl hover:bg-surface-hover focus-ring transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !childName.trim() || !claimReason.trim()}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover active:scale-98 focus-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClaimModal