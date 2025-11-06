import React, { useState } from 'react'
import { 
  Upload, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut,
  Menu,
  X as CloseIcon,
  Camera,
  Tag as TagIcon,
  AlertCircle,
  TrendingUp,
  Package,
  Users,
  Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from './ItemCard'
import StatusBadge from './StatusBadge'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { items, claims, addItem, approveClaim, denyClaim, getPendingClaims, getExpiringItems } = useData()
  const [activeTab, setActiveTab] = useState('upload')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Upload form state
  const [uploadImage, setUploadImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const categories = [
    { value: 'jacket', label: 'Jacket' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'water_bottle', label: 'Water Bottle' },
    { value: 'lunch_box', label: 'Lunch Box' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' }
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!imagePreview || !category) return

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      addItem({
        imageUrl: imagePreview,
        thumbnailUrl: imagePreview,
        category,
        tags,
        description: description || `${category.replace('_', ' ')} found`,
        uploadedBy: user.id
      })

      // Reset form
      setUploadImage(null)
      setImagePreview(null)
      setCategory('')
      setTags([])
      setDescription('')
      
      // Show success message (you could add a toast notification here)
      alert('Item uploaded successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload item')
    } finally {
      setIsUploading(false)
    }
  }

  const handleApproveClaim = async (claimId) => {
    if (window.confirm('Approve this claim? The item will be marked as claimed.')) {
      approveClaim(claimId)
    }
  }

  const handleDenyClaim = async (claimId) => {
    const reason = window.prompt('Reason for denial (will be sent to parent):')
    if (reason) {
      denyClaim(claimId, reason)
    }
  }

  const pendingClaims = getPendingClaims()
  const expiringItems = getExpiringItems()

  // Stats
  const stats = {
    totalItems: items.length,
    availableItems: items.filter(i => i.status === 'available').length,
    claimedItems: items.filter(i => i.status === 'claimed').length,
    pendingClaims: pendingClaims.length,
    expiringItems: expiringItems.length
  }

  const renderUploadTab = () => (
    <div className="max-w-2xl">
      <div className="bg-surface rounded-lg border border-border shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload New Item
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Camera className="inline h-4 w-4 mr-1" />
              Item Photo
            </label>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-bg hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="h-12 w-12 text-text-muted mb-3" />
                  <p className="mb-2 text-sm text-text-secondary">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-text-muted">PNG, JPG or JPEG (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setUploadImage(null)
                  }}
                  className="absolute top-2 right-2 p-2 bg-danger text-white rounded-full hover:bg-red-600 focus-ring"
                  aria-label="Remove image"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <TagIcon className="inline h-4 w-4 mr-1" />
              Tags (color, brand, size, etc.)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                placeholder="e.g., blue, nike, medium"
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-danger"
                      aria-label={`Remove ${tag}`}
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Found in gym locker area, has name written inside"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isUploading || !imagePreview || !category}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Publishing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Publish Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )

  const renderClaimsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Pending Claims
          {pendingClaims.length > 0 && (
            <span className="px-2 py-1 bg-warning text-white text-sm rounded-full">
              {pendingClaims.length}
            </span>
          )}
        </h2>
      </div>

      {pendingClaims.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border shadow-card p-12 text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            All caught up!
          </h3>
          <p className="text-text-muted">
            No pending claims to review at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingClaims.map((claim) => {
            const item = items.find(i => i.id === claim.itemId)
            if (!item) return null

            return (
              <div
                key={claim.id}
                className="bg-surface rounded-lg border border-border shadow-card p-6 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.description}
                      className="w-full lg:w-48 h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Claim Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {item.description}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-bg rounded-lg p-4">
                      <p className="text-sm font-medium text-text-secondary mb-2">
                        Claim Details:
                      </p>
                      <p className="text-sm text-text-primary mb-2">
                        <strong>Child's Name:</strong> {claim.childName}
                      </p>
                      <p className="text-sm text-text-primary">
                        <strong>Reason:</strong> {claim.claimReason}
                      </p>
                    </div>

                    <div className="text-xs text-text-muted">
                      Submitted {new Date(claim.submittedAt).toLocaleString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 focus-ring transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Claim
                      </button>
                      <button
                        onClick={() => handleDenyClaim(claim.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 focus-ring transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Deny Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderItemsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        All Items
      </h2>

      {items.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border shadow-card p-12 text-center">
          <ImageIcon className="h-16 w-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No items yet
          </h3>
          <p className="text-text-muted mb-4">
            Start by uploading your first lost item
          </p>
          <button
            onClick={() => setActiveTab('upload')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring"
          >
            Upload Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              showAdminActions={false}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Analytics
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Total Items</p>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.totalItems}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Available</p>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.availableItems}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Claimed</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.claimedItems}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Pending Claims</p>
            <Bell className="h-5 w-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.pendingClaims}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Expiring Soon</p>
            <Clock className="h-5 w-5 text-danger" />
          </div>
          <p className="text-3xl font-bold text-text-primary">{stats.expiringItems}</p>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Claim Rate</p>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {stats.totalItems > 0 
              ? Math.round((stats.claimedItems / stats.totalItems) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Expiring Items Alert */}
      {expiringItems.length > 0 && (
        <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-text-primary mb-2">
                Items Expiring Within 30 Days
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {expiringItems.length} item(s) will expire soon and may need to be donated or disposed of.
              </p>
              <div className="space-y-2">
                {expiringItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-surface rounded p-2">
                    <span className="text-sm text-text-primary">{item.description}</span>
                    <span className="text-xs text-warning">
                      {Math.ceil((new Date(item.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">FoundIt Admin</h1>
              <span className="text-sm text-text-muted hidden sm:block">
                Center Elementary School
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-text-primary focus-ring rounded-md"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'upload', label: 'Upload Item', icon: Upload },
              { id: 'claims', label: 'Claims', icon: Bell, badge: pendingClaims.length },
              { id: 'items', label: 'All Items', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  transition-colors duration-150
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-warning text-white text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && renderUploadTab()}
        {activeTab === 'claims' && renderClaimsTab()}
        {activeTab === 'items' && renderItemsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </main>
    </div>
  )
}

export default AdminDashboard
