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
    <div className="bg-surface rounded-lg border border-border shadow-card hover:shadow-card-hover transition-all duration-150 overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.description}
          className={`w-full h-full object-cover transition-transform duration-150 group-hover:scale-105 ${
            item.status === 'claimed' ? 'grayscale' : ''
          }`}
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} daysLeft={daysLeft} />
        </div>

        {/* Claimed Overlay */}
        {item.status === 'claimed' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium">
              ✓ Claimed
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category and Tags */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary bg-primary bg-opacity-10 px-2 py-1 rounded-full">
            {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          {isExpiringSoon && item.status === 'available' && (
            <div className="flex items-center text-xs text-warning">
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft}d left
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-primary font-medium mb-2 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs text-text-muted bg-bg px-2 py-1 rounded-md"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-text-muted">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-xs text-text-muted mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          Found {formatDate(item.uploadedAt)}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {item.status === 'available' && !showAdminActions && (
            <button
              onClick={onClaimClick}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover focus-ring transition-colors duration-150 font-medium"
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