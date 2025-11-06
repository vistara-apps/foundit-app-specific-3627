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
      <header className="bg-surface border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">F</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">FoundIt</h1>
              </div>
              <span className="text-xs sm:text-sm text-text-muted hidden md:block">
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
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover active:scale-95 focus-ring transition-all duration-200 font-medium shadow-button"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
              
              <a
                href="#admin"
                className="text-sm text-text-muted hover:text-primary focus-ring rounded px-2 py-1"
                aria-label="Go to admin login"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

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
      </div>

      {/* Items Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-5xl sm:text-6xl">🔍</div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
              No items found
            </h3>
            <p className="text-base sm:text-lg text-text-muted max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters to find what you are looking for'
                : 'No lost items have been uploaded yet. Check back soon!'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="mt-6 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring transition-all duration-200 font-medium shadow-button"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-text-muted">
                Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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