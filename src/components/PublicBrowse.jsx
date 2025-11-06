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
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">FoundIt</h1>
              <span className="text-sm text-text-muted hidden sm:block">
                Center Elementary School
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-secondary hidden sm:block">
                    {user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-text-muted hover:text-text-primary focus-ring rounded-md"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">Login</span>
                </button>
              )}
              
              <a
                href="#admin"
                className="text-sm text-text-muted hover:text-primary focus-ring rounded px-2 py-1"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {availableItems.length > 0 && !searchTerm && selectedCategory === 'all' && (
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-block bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-medium">
                  🎯 {availableItems.length} Items Available
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Reunite Kids With Their Lost Stuff
              </h2>
              <p className="text-lg sm:text-xl text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Browse photos of lost items remotely and claim them in seconds, not days.
                No more trips to the school office!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📸</span>
                  <span>Visual Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>Instant Claims</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Verified Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        {/* Active Filters Display */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-text-muted">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:bg-primary hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Search className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm">
                Category: {categories.find(c => c.value === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:bg-primary hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <Filter className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Items Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredItems.length === 0 ? (
          <div className="bg-surface rounded-lg shadow-card p-12 text-center">
            <div className="text-6xl mb-4">
              {searchTerm || selectedCategory !== 'all' ? '🔍' : '📦'}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No items match your search'
                : 'No lost items yet'
              }
            </h3>
            <p className="text-text-muted mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search terms or clearing filters to see all items'
                : 'Check back later - items will appear here when they are uploaded by the Lost & Found admin'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring"
              >
                View All Items
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-text-muted">
                Showing <span className="font-semibold text-text-primary">{filteredItems.length}</span> 
                {' '}{filteredItems.length === 1 ? 'item' : 'items'}
              </div>
              <div className="text-xs text-text-muted">
                Sort: <span className="font-medium text-text-secondary">
                  {sortBy === 'newest' ? 'Newest First' : sortBy === 'oldest' ? 'Oldest First' : 'Expiring Soon'}
                </span>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClaimClick={() => handleClaimClick(item)}
                />
              ))}
            </div>
          </>
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