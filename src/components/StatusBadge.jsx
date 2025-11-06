import React from 'react'

const StatusBadge = ({ status, daysLeft }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        if (daysLeft <= 7) {
          return {
            text: 'Expiring Soon',
            className: 'bg-danger text-white animate-pulse-slow shadow-lg backdrop-blur-sm'
          }
        } else if (daysLeft <= 30) {
          return {
            text: 'Available',
            className: 'bg-warning text-white shadow-md backdrop-blur-sm'
          }
        }
        return {
          text: 'Available',
          className: 'bg-success text-white shadow-md backdrop-blur-sm'
        }
      case 'claimed':
        return {
          text: 'Claimed',
          className: 'bg-text-muted text-white shadow-md backdrop-blur-sm'
        }
      case 'pending':
        return {
          text: 'Pending',
          className: 'bg-warning text-white shadow-md backdrop-blur-sm'
        }
      default:
        return {
          text: status,
          className: 'bg-text-muted text-white shadow-md backdrop-blur-sm'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${config.className}`}>
      {config.text}
    </span>
  )
}

export default StatusBadge