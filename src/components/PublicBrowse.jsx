import React, { useState, useMemo } from 'react'
import { Search, Filter, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from './ItemCard'
import ClaimModal from './ClaimModal'
import LoginModal from './LoginModal'
import SearchBar from './SearchBar'

const PublicBrowse = () => {
  const { user, logout } = useAuth()
  const { getAvailableItems } = useData()
  const [selectedItem, setSelectedItem] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const availableItems = getAvailableItems()

  const filteredItems = useMemo(() => {
    let filtered = availableItems

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt) - new Date(a.uploadedAt)
        case 'oldest':
          return new Date(a.uploadedAt) - new Date(b.uploadedAt)
        case 'expiring':
          return new Date(a.expiresAt) - new Date(b.expiresAt)
        default:
          return 0
      }
    })

    return filtered
  }, [availableItems, searchTerm, selectedCategory, sortBy])

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'jacket', label: 'Jackets' },
    { value: 'sweatshirt', label: 'Sweatshirts' },
    { value: 'water_bottle', label: 'Water Bottles' },
    { value: 'lunch_box', label: 'Lunch Boxes' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' }
  ]

  const handleClaimClick = (item) => {
    if (!user) {
      setSelectedItem(item)
      setShowLoginModal(true)
    } else {
      setSelectedItem(item)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔍</div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">FoundIt</h1>
                <p className="text-xs text-text-muted hidden sm:block leading-none">
                  Center Elementary
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-text-secondary hidden md:block">
                    {user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-text-muted hover:text-text-primary focus-ring rounded-md transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring transition-all hover:shadow-button"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
              
              <a
                href="#admin"
                className="text-xs sm:text-sm text-text-muted hover:text-primary focus-ring rounded px-2 py-1 transition-colors font-medium"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary from-opacity-5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
              Find Your Lost Items
            </h2>
            <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto">
              Browse photos of found items and claim yours in seconds. No need to visit the school office!
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success bg-opacity-10 flex items-center justify-center">
                  <span className="text-success font-bold">{availableItems.length}</span>
                </div>
                <span>Items Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span>Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Items Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Results Count */}
        {filteredItems.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Showing <span className="font-semibold text-text-primary">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-sm text-primary hover:text-primary-hover font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-6xl sm:text-7xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
              No items found
            </h3>
            <p className="text-text-muted mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No lost items have been uploaded yet'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring transition-all"
              >
                View All Items
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClaimClick={() => handleClaimClick(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedItem && !showLoginModal && (
        <ClaimModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            setShowLoginModal(false)
            // Keep selectedItem to show claim modal after login
          }}
        />
      )}
    </div>
  )
}

export default PublicBrowse