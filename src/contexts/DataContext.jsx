import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Mock data
const mockItems = [
  {
    id: '1',
    schoolId: 'school-1',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=150&fit=crop',
    category: 'jacket',
    tags: ['blue', 'nike', 'size-medium'],
    description: 'Blue Nike jacket found in gym area',
    status: 'available',
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    schoolId: 'school-1',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=150&fit=crop',
    category: 'water_bottle',
    tags: ['blue', 'hydroflask', 'stickers'],
    description: 'Blue Hydro Flask with unicorn stickers',
    status: 'available',
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    schoolId: 'school-1',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=150&fit=crop',
    category: 'lunch_box',
    tags: ['red', 'pokemon', 'insulated'],
    description: 'Red Pokemon lunch box',
    status: 'available',
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 87 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    schoolId: 'school-1',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=150&fit=crop',
    category: 'electronics',
    tags: ['white', 'airpods', 'case'],
    description: 'White AirPods with charging case',
    status: 'available',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    schoolId: 'school-1',
    imageUrl: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=200&h=150&fit=crop',
    category: 'sweatshirt',
    tags: ['gray', 'adidas', 'hoodie'],
    description: 'Gray Adidas hoodie, size large',
    status: 'claimed',
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    claimedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState(mockItems)
  const [claims, setClaims] = useState([])
  const [savedSearches, setSavedSearches] = useState([])

  const addItem = (itemData) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      schoolId: 'school-1',
      status: 'available',
      uploadedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      ...itemData
    }
    setItems(prev => [newItem, ...prev])
    return newItem
  }

  const submitClaim = (itemId, claimData) => {
    const newClaim = {
      id: Math.random().toString(36).substr(2, 9),
      itemId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...claimData
    }
    setClaims(prev => [...prev, newClaim])
    return newClaim
  }

  const approveClaim = (claimId) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { ...claim, status: 'approved', reviewedAt: new Date().toISOString() }
        : claim
    ))
    
    const claim = claims.find(c => c.id === claimId)
    if (claim) {
      setItems(prev => prev.map(item => 
        item.id === claim.itemId 
          ? { ...item, status: 'claimed', claimedAt: new Date().toISOString() }
          : item
      ))
    }
  }

  const denyClaim = (claimId, reason) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            status: 'denied', 
            reviewedAt: new Date().toISOString(),
            reviewNotes: reason 
          }
        : claim
    ))
  }

  const addSavedSearch = (searchData) => {
    const newSearch = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      notifyOnMatch: true,
      ...searchData
    }
    setSavedSearches(prev => [...prev, newSearch])
    return newSearch
  }

  const getAvailableItems = () => {
    return items.filter(item => item.status === 'available')
  }

  const getPendingClaims = () => {
    return claims.filter(claim => claim.status === 'pending')
  }

  const getExpiringItems = () => {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return items.filter(item => 
      item.status === 'available' && 
      new Date(item.expiresAt) <= thirtyDaysFromNow
    )
  }

  const value = {
    items,
    claims,
    savedSearches,
    addItem,
    submitClaim,
    approveClaim,
    denyClaim,
    addSavedSearch,
    getAvailableItems,
    getPendingClaims,
    getExpiringItems
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}