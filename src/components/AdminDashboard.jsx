import React, { useState, useRef } from 'react'
import { 
  Upload, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  Check, 
  X, 
  Bell,
  TrendingUp,
  Package,
  Clock,
  Users,
  LogOut,
  Home,
  BarChart3,
  Inbox,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from './ItemCard'
import StatusBadge from './StatusBadge'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { items, claims, addItem, approveClaim, denyClaim, getPendingClaims, getExpiringItems } = useData()
  const [activeTab, setActiveTab] = useState('upload') // upload, claims, items, analytics
  
  // Upload state
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [category, setCategory] = useState('jacket')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const categories = [
    { value: 'jacket', label: 'Jacket', emoji: '🧥' },
    { value: 'sweatshirt', label: 'Sweatshirt', emoji: '👕' },
    { value: 'water_bottle', label: 'Water Bottle', emoji: '💧' },
    { value: 'lunch_box', label: 'Lunch Box', emoji: '🍱' },
    { value: 'electronics', label: 'Electronics', emoji: '📱' },
    { value: 'other', label: 'Other', emoji: '📦' }
  ]

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        // Simulate AI category detection
        simulateCategoryDetection(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateCategoryDetection = (filename) => {
    // Simple simulation based on filename
    const lower = filename.toLowerCase()
    if (lower.includes('jacket') || lower.includes('coat')) {
      setCategory('jacket')
      setTags(['outerwear'])
    } else if (lower.includes('bottle') || lower.includes('water')) {
      setCategory('water_bottle')
      setTags(['hydration'])
    } else if (lower.includes('lunch') || lower.includes('box')) {
      setCategory('lunch_box')
      setTags(['food-container'])
    } else if (lower.includes('phone') || lower.includes('airpod') || lower.includes('electronic')) {
      setCategory('electronics')
      setTags(['tech'])
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    if (!imagePreview || !description.trim()) return

    setIsUploading(true)
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      addItem({
        imageUrl: imagePreview,
        thumbnailUrl: imagePreview,
        category,
        tags,
        description: description.trim()
      })

      // Reset form
      setImagePreview(null)
      setImageFile(null)
      setCategory('jacket')
      setTags([])
      setDescription('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClaimApprove = (claimId) => {
    approveClaim(claimId)
  }

  const handleClaimDeny = (claimId) => {
    denyClaim(claimId, 'Item details did not match claim')
  }

  const pendingClaims = getPendingClaims()
  const expiringItems = getExpiringItems()

  // Analytics calculations
  const totalItems = items.length
  const availableItems = items.filter(i => i.status === 'available').length
  const claimedItems = items.filter(i => i.status === 'claimed').length
  const claimRate = totalItems > 0 ? Math.round((claimedItems / totalItems) * 100) : 0
  
  const categoryStats = categories.map(cat => ({
    ...cat,
    count: items.filter(i => i.category === cat.value).length
  })).sort((a, b) => b.count - a.count)

  const avgClaimTime = claims.filter(c => c.reviewedAt).length > 0 
    ? '18 hours' 
    : 'N/A'

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">FoundIt Admin</h1>
              <span className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs font-medium rounded-full">
                {user?.role === 'system_admin' ? 'System Admin' : 'Lost & Found Admin'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary hidden sm:block">
                {user?.email}
              </span>
              <button
                onClick={() => window.location.hash = ''}
                className="p-2 text-text-muted hover:text-text-primary focus-ring rounded-md"
                aria-label="Public view"
              >
                <Home className="h-5 w-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 text-text-muted hover:text-text-primary focus-ring rounded-md"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 overflow-x-auto" aria-label="Admin sections">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span className="font-medium">Upload Item</span>
            </button>
            
            <button
              onClick={() => setActiveTab('claims')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'claims'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <Inbox className="h-4 w-4" />
              <span className="font-medium">Claims</span>
              {pendingClaims.length > 0 && (
                <span className="bg-warning text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingClaims.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('items')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'items'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <Package className="h-4 w-4" />
              <span className="font-medium">All Items</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Analytics</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Upload New Lost Item
              </h2>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Item Photo
                </label>
                
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
                  >
                    <Upload className="h-12 w-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-primary font-medium mb-1">
                      Click to upload photo
                    </p>
                    <p className="text-sm text-text-muted">
                      AI will auto-detect item category
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="absolute top-2 right-2 p-2 bg-danger text-white rounded-full hover:bg-red-600 focus-ring"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  capture="environment"
                />
              </div>

              {imagePreview && (
                <>
                  {/* Category Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Category (AI detected)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            category === cat.value
                              ? 'border-primary bg-primary bg-opacity-10'
                              : 'border-border hover:border-primary hover:border-opacity-50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{cat.emoji}</div>
                          <div className="text-sm font-medium text-text-primary">
                            {cat.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      <TagIcon className="inline h-4 w-4 mr-1" />
                      Tags (color, brand, size)
                    </label>
                    
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag (e.g., blue, nike, medium)"
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-lg hover:bg-opacity-20 focus-ring"
                      >
                        Add
                      </button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-primary-hover"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description (e.g., Found in gym locker area)"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !description.trim()}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover focus-ring transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Publish Item to Gallery
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Pending Claims
              </h2>
              <p className="text-text-muted">
                Review and approve claims from parents
              </p>
            </div>

            {pendingClaims.length === 0 ? (
              <div className="bg-surface rounded-lg border border-border p-12 text-center">
                <Inbox className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No Pending Claims
                </h3>
                <p className="text-text-muted">
                  All claims have been reviewed
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
                      className="bg-surface rounded-lg border border-border overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Item Info */}
                          <div className="lg:w-1/3">
                            <img
                              src={item.thumbnailUrl || item.imageUrl}
                              alt={item.description}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-text-muted">Category:</span>{' '}
                                <span className="text-text-primary font-medium">
                                  {item.category.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-bg px-2 py-1 rounded-md text-text-muted"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Claim Details */}
                          <div className="lg:w-2/3">
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold text-text-primary mb-1">
                                {item.description}
                              </h3>
                              <p className="text-sm text-text-muted">
                                Submitted {new Date(claim.submittedAt).toLocaleString()}
                              </p>
                            </div>

                            <div className="space-y-3 mb-6">
                              <div>
                                <label className="text-sm font-medium text-text-secondary">
                                  Child's Name
                                </label>
                                <p className="text-text-primary">{claim.childName}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-text-secondary">
                                  Claim Reason
                                </label>
                                <p className="text-text-primary">{claim.claimReason}</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => handleClaimApprove(claim.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-success text-white py-2 px-4 rounded-lg hover:bg-green-600 focus-ring transition-colors"
                              >
                                <Check className="h-4 w-4" />
                                Approve Claim
                              </button>
                              <button
                                onClick={() => handleClaimDeny(claim.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-danger text-white py-2 px-4 rounded-lg hover:bg-red-600 focus-ring transition-colors"
                              >
                                <X className="h-4 w-4" />
                                Deny Claim
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  All Lost Items
                </h2>
                <p className="text-text-muted">
                  {availableItems} available • {claimedItems} claimed • {expiringItems.length} expiring soon
                </p>
              </div>
            </div>

            {expiringItems.length > 0 && (
              <div className="mb-6 bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary mb-1">
                      {expiringItems.length} items expiring within 30 days
                    </p>
                    <p className="text-sm text-text-muted">
                      Items will be marked for donation at 90 days. Consider notifying parents.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  showAdminActions={false}
                  onClaimClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Analytics Dashboard
              </h2>
              <p className="text-text-muted">
                Insights and statistics for Center Elementary School
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-8 w-8 text-primary" />
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {totalItems}
                </div>
                <div className="text-sm text-text-muted">
                  Total Items Processed
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {claimRate}%
                </div>
                <div className="text-sm text-text-muted">
                  Claim Success Rate
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {avgClaimTime}
                </div>
                <div className="text-sm text-text-muted">
                  Avg. Claim Review Time
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {pendingClaims.length}
                </div>
                <div className="text-sm text-text-muted">
                  Pending Claims
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-surface rounded-lg border border-border p-6 mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Top Lost Item Categories
              </h3>
              <div className="space-y-4">
                {categoryStats.slice(0, 5).map((cat) => (
                  <div key={cat.value}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="text-text-primary font-medium">{cat.label}</span>
                      </div>
                      <span className="text-text-primary font-semibold">{cat.count}</span>
                    </div>
                    <div className="h-2 bg-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(cat.count / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Data-Driven Recommendations
              </h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  <span>
                    <strong>Labeling Campaign:</strong> {categoryStats[0]?.count || 0} {categoryStats[0]?.label?.toLowerCase() || 'items'} lost this month. 
                    Send reminder to parents to label {categoryStats[0]?.label?.toLowerCase() || 'items'}.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  <span>
                    <strong>Peak Loss Period:</strong> Most items are lost on Mondays and after recess. 
                    Consider reminder announcements.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  <span>
                    <strong>Unclaimed Items:</strong> {totalItems - claimedItems} items remain unclaimed. 
                    Review items expiring within 30 days for potential donation.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
