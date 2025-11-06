import React from 'react'
import { Calendar, Tag, Clock } from 'lucide-react'
import StatusBadge from './StatusBadge'

const ItemCard = ({ item, onClaimClick, showAdminActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilExpiration = () => {
    const now = new Date()
    const expiration = new Date(item.expiresAt)
    const diffTime = expiration - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilExpiration()
  const isExpiringSoon = daysLeft <= 30

  return (
    <div className="bg-surface rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg">
        <img
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.description}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
            item.status === 'claimed' ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} daysLeft={daysLeft} />
        </div>

        {/* Claimed Overlay */}
        {item.status === 'claimed' && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-success text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Claimed
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Category and Tags */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-primary bg-primary bg-opacity-10 px-2.5 py-1 rounded-full">
            {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          {isExpiringSoon && item.status === 'available' && (
            <div className="flex items-center text-xs font-medium text-warning bg-warning bg-opacity-10 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft}d
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-text-primary font-semibold mb-3 line-clamp-2 leading-snug">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs text-text-muted bg-bg px-2 py-1 rounded-md font-medium"
              >
                <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-text-muted font-medium bg-bg px-2 py-1 rounded-md">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-xs text-text-muted mb-4">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span className="font-medium">Found {formatDate(item.uploadedAt)}</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {item.status === 'available' && !showAdminActions && (
            <button
              onClick={onClaimClick}
              className="w-full bg-primary text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-primary-hover active:scale-98 focus-ring transition-all duration-150 font-semibold shadow-button hover:shadow-card text-sm sm:text-base"
            >
              Claim This Item
            </button>
          )}

          {showAdminActions && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(item)}
                className="flex-1 bg-surface-hover text-text-primary py-2 px-4 rounded-lg hover:bg-border focus-ring transition-colors duration-150 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(item)}
                className="flex-1 bg-danger text-white py-2 px-4 rounded-lg hover:bg-red-600 focus-ring transition-colors duration-150 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemCard