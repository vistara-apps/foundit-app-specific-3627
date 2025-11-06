import React, { useState, useMemo } from 'react'
import { 
  Upload, 
  ClipboardList, 
  Package, 
  BarChart3, 
  Camera, 
  LogOut, 
  Check, 
  X, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Download,
  Filter,
  Search,
  Tag,
  Clock,
  User,
  Mail
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import ItemCard from './ItemCard'
import StatusBadge from './StatusBadge'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { 
    items, 
    claims, 
    addItem, 
    approveClaim, 
    denyClaim, 
    getPendingClaims,
    getExpiringItems 
  } = useData()
  
  const [activeTab, setActiveTab] = useState('upload')
  const [uploadForm, setUploadForm] = useState({
    imageUrl: '',
    category: 'jacket',
    tags: '',
    description: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'claims', label: 'Claims', icon: ClipboardList, badge: getPendingClaims().length },
    { id: 'items', label: 'Items', icon: Package, badge: items.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const categories = [
    { value: 'jacket', label: 'Jacket' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'water_bottle', label: 'Water Bottle' },
    { value: 'lunch_box', label: 'Lunch Box' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' }
  ]

  // Simulate AI category detection
  const simulateAIDetection = () => {
    const suggestedTags = {
      jacket: ['blue', 'nike', 'zip-up'],
      sweatshirt: ['gray', 'adidas', 'hoodie'],
      water_bottle: ['blue', 'hydroflask', 'insulated'],
      lunch_box: ['red', 'insulated', 'pokemon'],
      electronics: ['white', 'airpods', 'case'],
      other: ['misc', 'found']
    }
    
    const tags = suggestedTags[uploadForm.category] || []
    setUploadForm(prev => ({
      ...prev,
      tags: tags.join(', ')
    }))
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const tagsArray = uploadForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      addItem({
        imageUrl: uploadForm.imageUrl || 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=300&fit=crop',
        thumbnailUrl: uploadForm.imageUrl || 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=200&h=150&fit=crop',
        category: uploadForm.category,
        tags: tagsArray,
        description: uploadForm.description,
        uploadedBy: user.id
      })

      setUploadSuccess(true)
      setTimeout(() => {
        setUploadSuccess(false)
        setUploadForm({
          imageUrl: '',
          category: 'jacket',
          tags: '',
          description: ''
        })
      }, 2000)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleApproveClaim = (claimId) => {
    approveClaim(claimId)
  }

  const handleDenyClaim = (claimId) => {
    const reason = prompt('Enter reason for denial (optional):')
    denyClaim(claimId, reason || 'No reason provided')
  }

  // Filter items for Items tab
  const filteredItems = useMemo(() => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    return filtered
  }, [items, searchTerm, filterCategory, filterStatus])

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalItems = items.length
    const availableItems = items.filter(i => i.status === 'available').length
    const claimedItems = items.filter(i => i.status === 'claimed').length
    const pendingClaims = getPendingClaims().length
    const expiringItems = getExpiringItems().length

    // Category breakdown
    const categoryBreakdown = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Calculate average claim time
    const claimedWithTime = claims.filter(c => c.status === 'approved' && c.reviewedAt)
    const avgClaimTime = claimedWithTime.length > 0
      ? claimedWithTime.reduce((sum, claim) => {
          const submitted = new Date(claim.submittedAt)
          const reviewed = new Date(claim.reviewedAt)
          return sum + (reviewed - submitted) / (1000 * 60 * 60)
        }, 0) / claimedWithTime.length
      : 0

    const claimRate = totalItems > 0 ? (claimedItems / totalItems * 100).toFixed(1) : 0

    return {
      totalItems,
      availableItems,
      claimedItems,
      pendingClaims,
      expiringItems,
      topCategories,
      avgClaimTime: avgClaimTime.toFixed(1),
      claimRate
    }
  }, [items, claims, getPendingClaims, getExpiringItems])

  const renderUploadTab = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-lg shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Upload New Item</h2>
            <p className="text-sm text-text-muted">Add a lost item to the system</p>
          </div>
        </div>

        {uploadSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Item Published!
            </h3>
            <p className="text-text-muted">
              The item is now visible in the public gallery
            </p>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={uploadForm.imageUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg (or leave empty for placeholder)"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-text-muted mt-1">
                In production, this would open your camera to take a photo
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Category
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => {
                  setUploadForm({ ...uploadForm, category: e.target.value })
                  simulateAIDetection()
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={simulateAIDetection}
                className="text-xs text-primary mt-1 hover:underline"
              >
                🤖 AI Suggest Tags
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                placeholder="blue, nike, size-medium"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Description
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Brief description of the item..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !uploadForm.description.trim()}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover focus-ring transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Publish Item
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )

  const renderClaimsTab = () => {
    const pendingClaims = getPendingClaims()
    const allClaims = claims.sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    )

    return (
      <div className="space-y-6">
        {/* Pending Claims Section */}
        {pendingClaims.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold text-text-primary">
                Pending Claims ({pendingClaims.length})
              </h2>
            </div>
            
            <div className="space-y-4">
              {pendingClaims.map(claim => {
                const item = items.find(i => i.id === claim.itemId)
                if (!item) return null

                return (
                  <div key={claim.id} className="bg-surface rounded-lg shadow-card p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.thumbnailUrl || item.imageUrl}
                          alt={item.description}
                          className="w-full md:w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Claim Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-text-primary mb-1">
                            {item.description}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-bg px-2 py-1 rounded-md text-text-muted">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-bg rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-text-muted" />
                            <span className="font-medium text-text-secondary">Child:</span>
                            <span className="text-text-primary">{claim.childName}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <Mail className="h-4 w-4 text-text-muted mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-text-secondary">Reason:</span>
                              <p className="text-text-primary mt-1">{claim.claimReason}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Calendar className="h-3 w-3" />
                            Submitted {new Date(claim.submittedAt).toLocaleString()}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveClaim(claim.id)}
                            className="flex-1 bg-success text-white py-2 px-4 rounded-lg hover:bg-green-600 focus-ring transition-colors duration-150 font-medium flex items-center justify-center gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Approve Claim
                          </button>
                          <button
                            onClick={() => handleDenyClaim(claim.id)}
                            className="flex-1 bg-danger text-white py-2 px-4 rounded-lg hover:bg-red-600 focus-ring transition-colors duration-150 font-medium flex items-center justify-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Deny Claim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All Claims History */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            All Claims History
          </h2>
          
          {allClaims.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-card p-12 text-center">
              <ClipboardList className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No claims submitted yet</p>
            </div>
          ) : (
            <div className="bg-surface rounded-lg shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Child Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allClaims.map(claim => {
                      const item = items.find(i => i.id === claim.itemId)
                      return (
                        <tr key={claim.id} className="hover:bg-bg transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-text-primary">
                              {item?.description || 'Unknown Item'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-text-primary">{claim.childName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={claim.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                            {new Date(claim.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderItemsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-surface rounded-lg shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="claimed">Claimed</option>
              <option value="donated">Donated</option>
              <option value="disposed">Disposed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-surface rounded-lg shadow-card p-12 text-center">
          <Package className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              showAdminActions={true}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-text-muted">Total Items</div>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{analytics.totalItems}</div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-text-muted">Available</div>
            <Clock className="h-5 w-5 text-success" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{analytics.availableItems}</div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-text-muted">Pending Claims</div>
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{analytics.pendingClaims}</div>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-text-muted">Expiring Soon</div>
            <TrendingUp className="h-5 w-5 text-danger" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{analytics.expiringItems}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Top Lost Item Categories
          </h3>
          <div className="space-y-4">
            {analytics.topCategories.map(([category, count]) => {
              const percentage = (count / analytics.totalItems * 100).toFixed(0)
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-text-muted">{count} items</span>
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

        {/* Performance Metrics */}
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-muted">Claim Rate</span>
                <span className="text-2xl font-bold text-primary">{analytics.claimRate}%</span>
              </div>
              <div className="w-full bg-bg rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analytics.claimRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-muted">Avg. Claim Time</span>
                <span className="text-2xl font-bold text-primary">{analytics.avgClaimTime}h</span>
              </div>
              <p className="text-xs text-text-muted">
                Average time from claim submission to approval
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-muted">Items Claimed</span>
                <span className="text-2xl font-bold text-success">{analytics.claimedItems}</span>
              </div>
              <p className="text-xs text-text-muted">
                Successfully reunited with owners
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-text-primary mb-2">
              Data-Driven Recommendations
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                • <strong>{analytics.claimRate}% claim rate:</strong> Consider sending reminders to parents about labeling items
              </li>
              <li>
                • <strong>{analytics.expiringItems} items expiring soon:</strong> Review and prepare for donation
              </li>
              {analytics.topCategories[0] && (
                <li>
                  • <strong>Most lost: {analytics.topCategories[0][0].replace('_', ' ')}</strong> - Focus parent communication on this category
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-lg hover:bg-surface-hover focus-ring transition-colors duration-150 shadow-card">
          <Download className="h-4 w-4" />
          Export Report (PDF)
        </button>
      </div>
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
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm text-text-primary font-medium">{user?.email}</div>
                  <div className="text-xs text-text-muted capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </div>
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

      {/* Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
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
