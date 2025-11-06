import React from 'react'

const StatusBadge = ({ status, daysLeft }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        // Red zone: <= 7 days (expiring very soon)
        if (daysLeft <= 7) {
          return {
            text: `${daysLeft}d left`,
            className: 'bg-danger text-white animate-pulse-slow'
          }
        } 
        // Orange zone: 8-30 days (expiring soon)
        else if (daysLeft <= 30) {
          return {
            text: `${daysLeft}d left`,
            className: 'bg-warning text-white'
          }
        }
        // Yellow zone: 31-60 days (available)
        else if (daysLeft <= 60) {
          return {
            text: 'Available',
            className: 'bg-yellow-500 text-white'
          }
        }
        // Green zone: > 60 days (newly added)
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
      case 'donated':
        return {
          text: 'Donated',
          className: 'bg-blue-500 text-white'
        }
      case 'disposed':
        return {
          text: 'Disposed',
          className: 'bg-gray-500 text-white'
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