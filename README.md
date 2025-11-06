# FoundIt - Lost and Found Management System

> Reunite kids with their lost stuff in seconds, not days

A mobile-first lost and found management system for elementary schools that lets parents browse photos of lost items remotely and claim them through an admin-approved verification process.

## 🎯 Key Features

### For Parents
- **📸 Visual Browse & Search** - Browse high-quality photos of lost items in grid view
- **🔍 Smart Filtering** - Filter by category (outerwear, bottles, electronics, etc.)
- **⚡ Quick Claims** - Claim items with just a few taps using magic link authentication
- **✓ Verified Process** - Admin-approved verification ensures the right item goes to the right family
- **🔔 No Login Required** - Browse items without authentication, login only when claiming

### For Admins
- **📤 30-Second Upload** - Snap a photo, add tags, and publish instantly
- **🤖 AI-Assisted Tagging** - Smart category detection and tag suggestions
- **✅ One-Tap Claim Review** - Approve or deny claims with a single click
- **📊 Analytics Dashboard** - Track claim rates, top categories, and performance metrics
- **⏰ Auto-Expiration Tracking** - Color-coded expiration warnings (yellow/orange/red)
- **📦 Item Management** - Complete item lifecycle management with filtering

## 🎨 UI/UX Highlights

### Visual Design
- **Modern, Clean Interface** - Professional design with card-based layouts
- **Color-Coded Status System**:
  - 🟢 Green: Newly added (>60 days until expiration)
  - 🟡 Yellow: Available (31-60 days left)
  - 🟠 Orange: Expiring soon (8-30 days left)
  - 🔴 Red: Expiring very soon (≤7 days) with pulse animation
- **Responsive Grid Layout** - Adapts from mobile to desktop seamlessly
- **Smooth Animations** - Subtle transitions and hover effects

### User Experience
- **Hero Section** - Compelling value proposition on landing page
- **Active Filter Display** - Clear visibility of current filters with quick removal
- **Smart Empty States** - Contextual messages and clear calls-to-action
- **Results Counter** - Always know how many items match your search
- **Loading States** - Spinner indicators for all async actions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Credentials

**Lost & Found Admin:**
- Email: `admin@school.edu`
- Password: `admin123`

**System Admin:**
- Email: `system@school.edu`
- Password: `system123`

**Parent Login:**
- Use any email address
- Magic link authentication (auto-simulated in demo)

## 📱 Application Structure

### Public Browse View
- Hero section with value proposition
- Search bar with category and sort filters
- Grid view of available items
- Item detail modal with claim button
- Magic link authentication for parents

### Admin Dashboard
Four main tabs:

1. **Upload Tab**
   - Mobile-first camera interface
   - AI category detection simulation
   - Tag suggestions
   - Instant publishing

2. **Claims Tab**
   - Pending claims with full details
   - Side-by-side item and claim view
   - One-tap approve/deny actions
   - Complete claim history table

3. **Items Tab**
   - Search and filter interface
   - Multi-dimensional filtering (category, status)
   - Grid view with admin actions
   - Bulk management capabilities

4. **Analytics Tab**
   - Key metrics cards
   - Top categories breakdown
   - Performance metrics
   - Data-driven recommendations
   - Export functionality

## 🎨 Design System

### Color Palette
- **Primary**: `hsl(202, 83%, 41%)` - Professional blue
- **Success**: `hsl(142, 71%, 45%)` - Green for positive actions
- **Warning**: `hsl(38, 92%, 50%)` - Orange for attention
- **Danger**: `hsl(0, 84%, 60%)` - Red for critical items
- **Surface**: White with subtle shadows
- **Background**: `hsl(0, 0%, 98%)` - Soft gray

### Typography
- System font stack for optimal performance
- Clear hierarchy with font weights
- Readable line heights

### Shadows
- Subtle card shadows for depth
- Elevated shadows on hover
- Modal shadows for focus

## 🔧 Technical Details

### Tech Stack
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon set
- **Context API** - State management

### Data Model
The application uses a comprehensive data model with:
- **Items** - Lost items with photos, categories, tags, and expiration
- **Claims** - Parent claims with verification details
- **Users** - Parents, admins, and system admins
- **Saved Searches** - For future notification features

### File Structure
```
/workspace
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx     # Complete admin interface
│   │   ├── PublicBrowse.jsx       # Public item browser
│   │   ├── ItemCard.jsx           # Reusable item card
│   │   ├── ClaimModal.jsx         # Claim submission form
│   │   ├── LoginModal.jsx         # Magic link authentication
│   │   ├── LoginScreen.jsx        # Admin login page
│   │   ├── SearchBar.jsx          # Search and filter UI
│   │   ├── StatusBadge.jsx        # Color-coded status badges
│   │   └── AppRouter.jsx          # Route management
│   ├── contexts/
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── DataContext.jsx        # Application data
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 📊 Key Metrics & Analytics

The admin dashboard tracks:
- **Total Items** - All items in the system
- **Available Items** - Currently claimable
- **Pending Claims** - Awaiting admin review
- **Expiring Items** - Need attention within 30 days
- **Claim Rate** - Percentage of items successfully claimed
- **Average Claim Time** - Speed of admin review
- **Top Categories** - Most frequently lost items

## 🎯 Business Value

### Time Savings
- **Admins**: Process 20+ items in the time it took to log 3-4
- **Parents**: Save 30+ minutes per search (no school trips)
- **Claims**: Review reduced from 20 minutes to 30 seconds

### Features Alignment
✅ 30-Second Item Upload with AI detection  
✅ Visual Browse & Smart Search  
✅ Verified Claim System  
✅ Auto-Expiration Tracker with color coding  
✅ Admin Dashboard Analytics  
🔄 Parent Notification System (infrastructure ready)

## 🚦 Status Indicators

### Item Status Flow
1. **Available** (Green/Yellow/Orange) → Item is claimable
2. **Claimed** (Gray) → Item successfully claimed
3. **Donated** (Blue) → Item donated after expiration
4. **Disposed** (Gray) → Item disposed per policy

### Claim Status Flow
1. **Pending** (Orange) → Awaiting admin review
2. **Approved** (Green) → Ready for pickup
3. **Denied** (Red) → Claim rejected with reason

## 📱 Mobile-First Design

- Touch-friendly tap targets (44px minimum)
- Optimized image loading
- Responsive breakpoints (sm, md, lg, xl)
- Fast performance on 3G networks
- Progressive enhancement

## 🔐 Security Features

- Magic link authentication (passwordless)
- Admin role-based access control
- Claim verification process
- Audit trail for all actions
- Session management

## 🎓 User Flows

### Parent Claim Flow
1. Browse items without login
2. Find item using search/filters
3. Click "Claim This Item"
4. Enter email for magic link
5. Complete claim form
6. Wait for admin approval
7. Receive pickup notification

### Admin Upload Flow
1. Login with credentials
2. Navigate to Upload tab
3. Enter image URL (or use camera)
4. Select category (AI suggests tags)
5. Add description
6. Publish instantly
7. Item appears in public gallery

### Admin Review Flow
1. Receive claim notification
2. View item and claim side-by-side
3. Verify details
4. Approve or deny with one tap
5. Parent notified automatically

## 🌟 Future Enhancements

- Real camera integration
- SMS notifications
- Automated matching alerts
- QR code generation
- Multi-school support
- Mobile apps (iOS/Android)
- Batch operations
- Advanced reporting

## 📄 License

This project was built as part of the FoundIt app specifications for elementary school lost and found management.

## 🤝 Support

For issues or questions about implementation, refer to the Linear issue #ZAA-5204.

---

**Built with ❤️ for schools and families**
