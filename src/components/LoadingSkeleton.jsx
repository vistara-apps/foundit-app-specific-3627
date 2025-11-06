import React from 'react'

export const ItemCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] skeleton"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 skeleton rounded-full"></div>
          <div className="h-5 w-12 skeleton rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 skeleton rounded"></div>
          <div className="h-4 w-3/4 skeleton rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 skeleton rounded-md"></div>
          <div className="h-6 w-16 skeleton rounded-md"></div>
        </div>
        <div className="h-4 w-32 skeleton rounded"></div>
        <div className="h-10 skeleton rounded-lg"></div>
      </div>
    </div>
  )
}

export const GridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  )
}

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  }

  return (
    <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]} ${className}`}></div>
  )
}

export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-text-muted text-lg">{message}</p>
      </div>
    </div>
  )
}

export default {
  ItemCardSkeleton,
  GridSkeleton,
  LoadingSpinner,
  FullPageLoader
}
