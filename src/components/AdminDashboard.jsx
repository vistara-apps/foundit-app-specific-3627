import React, { useState } from 'react'
import { 
  Upload, 
  Camera, 
  LogOut, 
  Home,
  CheckCircle,
  XCircle,
  BarChart3,
  Bell,
  Clock,
  TrendingUp,
  Package,
  Users,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from './ItemCard'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { items, claims, addItem, approveClaim, denyClaim, getPendingClaims, getExpiringItems } = useData()
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedClaim, setSelectedClaim] = useState(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    imageUrl: '',
    category: 'jacket',
    tags: '',
    description: ''
  })
  const [isUploading, setIsUploading] = useState(false)

  const pendingClaims = getPendingClaims()
  const expiringItems = getExpiringItems()

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!uploadForm.imageUrl.trim() || !uploadForm.description.trim()) return

    setIsUploading(true)
    
    try {
      const tags = uploadForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      await addItem({
        imageUrl: uploadForm.imageUrl,
        thumbnailUrl: uploadForm.imageUrl,
        category: uploadForm.category,
        tags,
        description: uploadForm.description,
        uploadedBy: user.id
      })

      // Reset form
      setUploadForm({
        imageUrl: '',
        category: 'jacket',
        tags: '',
        description: ''
      })

      // Show success feedback
      alert('Item uploaded successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleApproveClaim = async (claimId) => {
    await approveClaim(claimId)
    setSelectedClaim(null)
    alert('Claim approved! Parent will be notified.')
  }

  const handleDenyClaim = async (claimId) => {
    const reason = prompt('Please provide a reason for denying this claim:')
    if (reason) {
      await denyClaim(claimId, reason)
      setSelectedClaim(null)
      alert('Claim denied. Parent will be notified.')
    }
  }

  const getStats = () => {
    const totalItems = items.length
    const availableItems = items.filter(i => i.status === 'available').length
    const claimedItems = items.filter(i => i.status === 'claimed').length
    const pendingClaimsCount = pendingClaims.length
    const expiringCount = expiringItems.length

    return {
      totalItems,
      availableItems,
      claimedItems,
      pendingClaimsCount,
      expiringCount
    }
  }

  const stats = getStats()

  const getItemForClaim = (claim) => {
    return items.find(item => item.id === claim.itemId)
  }

  const tabs = [
    { id: 'upload', label: 'Upload Items', icon: Upload },
    { id: 'claims', label: 'Review Claims', icon: CheckCircle, badge: stats.pendingClaimsCount },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

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
              <a
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-primary focus-ring rounded-lg"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:block">Public View</span>
              </a>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary hidden sm:block">
                  {user?.email}
                </span>
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
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-sm">Total Items</span>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.totalItems}</div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-sm">Available</span>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.availableItems}</div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-sm">Claimed</span>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.claimedItems}</div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-warning border-opacity-30 bg-warning bg-opacity-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-sm">Pending Claims</span>
              <Bell className="h-4 w-4 text-warning" />
            </div>
            <div className="text-2xl font-bold text-warning">{stats.pendingClaimsCount}</div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-danger border-opacity-30 bg-danger bg-opacity-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-sm">Expiring Soon</span>
              <Clock className="h-4 w-4 text-danger" />
            </div>
            <div className="text-2xl font-bold text-danger">{stats.expiringCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-warning text-white text-xs rounded-full px-2 py-0.5">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Upload Lost Item
                </h2>
                <p className="text-text-muted">
                  Take a photo and add details to help parents find their items
                </p>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* Image URL (simulating file upload) */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Item Photo URL
                  </label>
                  <input
                    type="url"
                    value={uploadForm.imageUrl}
                    onChange={(e) => setUploadForm({...uploadForm, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    In production, this would be a camera button for mobile photo capture
                  </p>
                </div>

                {/* Preview */}
                {uploadForm.imageUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                    <img 
                      src={uploadForm.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="jacket">Jacket</option>
                    <option value="sweatshirt">Sweatshirt</option>
                    <option value="water_bottle">Water Bottle</option>
                    <option value="lunch_box">Lunch Box</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    placeholder="e.g., blue, nike, size-medium"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    Add colors, brands, sizes, and other identifying details
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    placeholder="Brief description of the item..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isUploading || !uploadForm.imageUrl.trim() || !uploadForm.description.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover focus-ring transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
        )}

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <div>
            {pendingClaims.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  All caught up!
                </h3>
                <p className="text-text-muted">
                  No pending claims to review at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                  Pending Claims ({pendingClaims.length})
                </h2>
                
                {pendingClaims.map((claim) => {
                  const item = getItemForClaim(claim)
                  if (!item) return null

                  return (
                    <div key={claim.id} className="bg-surface rounded-lg border border-border p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Item Preview */}
                        <div className="w-full md:w-48 flex-shrink-0">
                          <img
                            src={item.thumbnailUrl || item.imageUrl}
                            alt={item.description}
                            className="w-full aspect-video object-cover rounded-lg border border-border"
                          />
                          <div className="mt-2">
                            <div className="text-sm font-medium text-text-primary">{item.description}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Claim Details */}
                        <div className="flex-1">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                              Claim Details
                            </h3>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium text-text-secondary">Child's Name:</span>
                                <span className="ml-2 text-sm text-text-primary">{claim.childName}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-text-secondary">Submitted:</span>
                                <span className="ml-2 text-sm text-text-muted">
                                  {new Date(claim.submittedAt).toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-text-secondary">Reason:</span>
                                <p className="mt-1 text-sm text-text-primary bg-bg p-3 rounded-lg">
                                  {claim.claimReason}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApproveClaim(claim.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600 focus-ring transition-colors duration-150"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve Claim
                            </button>
                            <button
                              onClick={() => handleDenyClaim(claim.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-danger text-danger rounded-lg hover:bg-danger hover:text-white focus-ring transition-colors duration-150"
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
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                All Items ({items.length})
              </h2>
            </div>

            {expiringItems.length > 0 && (
              <div className="bg-warning bg-opacity-10 border border-warning border-opacity-30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary mb-1">
                      {expiringItems.length} item{expiringItems.length !== 1 ? 's' : ''} expiring within 30 days
                    </p>
                    <p className="text-sm text-text-secondary">
                      Review these items and prepare for donation if unclaimed
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
                />
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Analytics & Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item Categories */}
              <div className="bg-surface rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Items by Category
                </h3>
                <div className="space-y-3">
                  {['jacket', 'water_bottle', 'lunch_box', 'electronics', 'sweatshirt', 'other'].map(category => {
                    const count = items.filter(i => i.category === category).length
                    const percentage = items.length > 0 ? (count / items.length * 100).toFixed(0) : 0
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-text-secondary capitalize">
                            {category.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-medium text-text-primary">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-bg rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-surface rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Status Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success bg-opacity-5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success bg-opacity-20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <div className="text-sm text-text-muted">Claimed Items</div>
                        <div className="text-xl font-bold text-text-primary">{stats.claimedItems}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-success">
                      {items.length > 0 ? Math.round(stats.claimedItems / items.length * 100) : 0}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary bg-opacity-5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-text-muted">Available Items</div>
                        <div className="text-xl font-bold text-text-primary">{stats.availableItems}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {items.length > 0 ? Math.round(stats.availableItems / items.length * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-surface rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Total Claims</span>
                    <span className="text-sm font-medium text-text-primary">{claims.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Pending Reviews</span>
                    <span className="text-sm font-medium text-warning">{stats.pendingClaimsCount}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Items Expiring Soon</span>
                    <span className="text-sm font-medium text-danger">{stats.expiringCount}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-text-secondary">Claim Success Rate</span>
                    <span className="text-sm font-medium text-success">
                      {claims.length > 0 ? Math.round(claims.filter(c => c.status === 'approved').length / claims.length * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-surface rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Action Items
                </h3>
                <div className="space-y-3">
                  {stats.pendingClaimsCount > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-warning bg-opacity-5 rounded-lg border border-warning border-opacity-20">
                      <Bell className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">Review Pending Claims</div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {stats.pendingClaimsCount} claim{stats.pendingClaimsCount !== 1 ? 's' : ''} awaiting review
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('claims')}
                        className="text-xs text-warning hover:text-orange-600 font-medium"
                      >
                        Review
                      </button>
                    </div>
                  )}
                  
                  {stats.expiringCount > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-danger bg-opacity-5 rounded-lg border border-danger border-opacity-20">
                      <Clock className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">Items Expiring Soon</div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {stats.expiringCount} item{stats.expiringCount !== 1 ? 's' : ''} expiring within 30 days
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('inventory')}
                        className="text-xs text-danger hover:text-red-700 font-medium"
                      >
                        View
                      </button>
                    </div>
                  )}

                  {stats.pendingClaimsCount === 0 && stats.expiringCount === 0 && (
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                      <div className="text-sm text-text-muted">No urgent actions required</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
