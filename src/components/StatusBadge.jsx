import React from 'react'

const StatusBadge = ({ status, daysLeft }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        if (daysLeft <= 7) {
          return {
            text: 'Expiring Soon',
            className: 'bg-danger text-white animate-pulse-slow'
          }
        } else if (daysLeft <= 30) {
          return {
            text: 'Available',
            className: 'bg-warning text-white'
          }
        }
        return {
          text: 'Available',
          className: 'bg-success text-white'
        }
      case 'claimed':
        return {
          text: 'Claimed',
          className: 'bg-text-muted text-white'
        }
      case 'pending':
        return {
          text: 'Pending',
          className: 'bg-warning text-white'
        }
      default:
        return {
          text: status,
          className: 'bg-text-muted text-white'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-md ${config.className}`}>
      {config.text}
    </span>
  )
}

export default StatusBadge