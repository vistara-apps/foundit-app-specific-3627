# FoundIt Component Features & Specifications

## Component Architecture

### 1. AdminDashboard.jsx (657 lines)
**Route:** Shown when authenticated as admin (lostfound_admin or system_admin)

#### Features:
1. **Statistics Dashboard**
   - Total Items count with Package icon
   - Available Items with TrendingUp icon
   - Claimed Items with CheckCircle icon
   - Pending Claims with Bell icon (warning style)
   - Expiring Items with Clock icon (danger style)
   - All stats update in real-time based on data changes

2. **Upload Tab**
   - Photo URL input (simulating camera upload)
   - Live image preview
   - Category dropdown (6 categories)
   - Tag input (comma-separated)
   - Description textarea
   - Form validation
   - Success feedback
   - Auto-expires at 90 days

3. **Claims Review Tab**
   - List of pending claims
   - Side-by-side item preview and claim details
   - Child's name and submission timestamp
   - Claim reason displayed prominently
   - Approve/Deny buttons with instant feedback
   - Empty state: "All caught up!" message
   - Badge count on tab header

4. **Inventory Tab**
   - Grid view of all items (ItemCard components)
   - Warning banner for expiring items
   - Shows claimed and available items
   - Responsive grid layout
   - Item count display

5. **Analytics Tab**
   - Items by Category (bar chart visualization)
   - Status Overview (claimed vs available)
   - Quick Stats panel
   - Action Items panel with:
     - Pending claims notification
     - Expiring items notification
     - Quick navigation buttons
   - Percentage calculations
   - "No urgent actions" success state

#### User Flow:
1. Admin logs in → Dashboard loads with stats
2. Click "Upload Items" → Fill form → Publish → Item appears in public browse
3. Receive claim notification → Review tab → Approve/Deny → Parent notified
4. View analytics → Identify trends → Make data-driven decisions

---

### 2. PublicBrowse.jsx (210 lines)
**Route:** Default view (accessible to everyone)

#### Features:
1. **Header**
   - Branded logo (F icon + FoundIt text)
   - School name display
   - Login button (magic link modal)
   - Logout button (when authenticated)
   - Admin link
   - Sticky positioning with backdrop blur

2. **Search & Filter System**
   - Search bar (color, brand, description)
   - Category filter (7 options)
   - Sort options (newest, oldest, expiring)
   - Live filtering (no page reload)
   - Results count display

3. **Items Grid**
   - Responsive grid (1-4 columns)
   - ItemCard components
   - Lazy loading images
   - Hover effects
   - Click to claim

4. **Empty States**
   - No items: "Check back soon!" message
   - Filtered no results: "Try adjusting..." + Clear Filters button
   - Large icon in circular container
   - Contextual messaging

5. **Modals**
   - ClaimModal (authenticated users)
   - LoginModal (unauthenticated users)
   - Click outside to close
   - Backdrop blur

#### User Flow:
1. Parent visits site → Browse items → Find item
2. Click "Claim This Item" → Login (if needed) → Fill claim form
3. Submit → Success message → Email notification when approved

---

### 3. ItemCard.jsx (132 lines)
**Usage:** Display lost item in grid

#### Features:
1. **Image Display**
   - 4:3 aspect ratio
   - Lazy loading
   - Hover scale (110%)
   - Grayscale when claimed
   - Claimed overlay with backdrop blur

2. **Item Information**
   - Category badge (color-coded)
   - Description (h3, font-semibold)
   - Tags (up to 3 visible + count)
   - Upload date
   - Days until expiration

3. **Status Indicators**
   - StatusBadge component (top-right)
   - Color coding: green (60+ days), yellow (30-60 days), red (<7 days)
   - Expiration countdown

4. **Actions**
   - "Claim This Item" button (available items)
   - Edit/Delete buttons (admin view)
   - ARIA labels for accessibility
   - Active press feedback

#### Props:
- `item`: Item object
- `onClaimClick`: Callback for claim action
- `showAdminActions`: Boolean for admin buttons
- `onEdit`, `onDelete`: Admin callbacks
- `compact`: Boolean for compact mode

---

### 4. ClaimModal.jsx (183 lines)
**Purpose:** Claim item form for authenticated parents

#### Features:
1. **Item Preview**
   - Thumbnail image
   - Description
   - Tags display

2. **Claim Form**
   - Child's name input (autocomplete)
   - Claim reason textarea (4 rows)
   - Required field validation
   - Auto-saves to context

3. **User Guidance**
   - Verification process info box
   - AlertCircle icon
   - Clear expectations

4. **Feedback States**
   - Loading spinner during submission
   - Success state with checkmark
   - Auto-close after 2 seconds
   - Email notification message

5. **Actions**
   - Cancel button
   - Submit button (disabled when invalid)
   - ESC key to close
   - Click outside to close

#### User Flow:
1. Parent clicks "Claim This Item" → Modal opens
2. Pre-filled with child name (if available)
3. Add claim reason → Submit
4. See success message → Modal closes
5. Wait for admin approval

---

### 5. LoginModal.jsx (117 lines)
**Purpose:** Magic link authentication for parents

#### Features:
1. **Email Input**
   - Single field (email only)
   - Autocomplete enabled
   - Validation

2. **Magic Link Flow**
   - Submit email → "Check Your Email" state
   - Simulated 2-second delay
   - Auto-login for demo
   - In production: real email sent

3. **User Education**
   - Info box: "No password required!"
   - Clear messaging
   - Security explanation

4. **Visual States**
   - Input state (email form)
   - Waiting state (check email)
   - Loading state (processing)

#### User Flow:
1. Click "Login" → Modal opens
2. Enter email → Click "Send Magic Link"
3. Check email → Click link (simulated)
4. Auto-logged in → Return to previous action

---

### 6. LoginScreen.jsx (127 lines)
**Purpose:** Admin authentication (email + password)

#### Features:
1. **Full-Screen Layout**
   - Centered card
   - Back button
   - Branded header with Shield icon

2. **Login Form**
   - Email input
   - Password input
   - Both required
   - Autocomplete enabled

3. **Demo Credentials**
   - Displayed in card footer
   - Two roles available:
     - Lost & Found Admin
     - System Admin

4. **Error Handling**
   - Invalid credentials message
   - Clear error display
   - Retry capability

#### User Flow:
1. Click "Admin" link → Full screen login
2. Enter credentials → Submit
3. Success: Redirect to AdminDashboard
4. Failure: Show error message

---

### 7. SearchBar.jsx (71 lines)
**Purpose:** Reusable search and filter component

#### Features:
1. **Search Input**
   - Full-width with icon
   - Rounded-xl design
   - Live search (no submit button)
   - Placeholder text

2. **Category Filter**
   - Dropdown select
   - 7 categories + "All Items"
   - ARIA labeled

3. **Sort Options**
   - Dropdown select
   - 3 sort methods
   - ARIA labeled

4. **Responsive Layout**
   - Stacked on mobile
   - Side-by-side on desktop
   - Flex-1 for equal widths

#### Props:
- `searchTerm`, `onSearchChange`
- `selectedCategory`, `onCategoryChange`
- `categories` (array)
- `sortBy`, `onSortChange`

---

### 8. StatusBadge.jsx (48 lines)
**Purpose:** Visual status indicator for items

#### Features:
1. **Status Types**
   - Available (green/yellow/red based on expiration)
   - Claimed (gray)
   - Pending (yellow)

2. **Color Coding**
   - Green: 60+ days remaining
   - Yellow: 30-60 days
   - Red: <7 days (with pulse animation)

3. **Visual Design**
   - Small badge (text-xs)
   - Rounded corners
   - Contrasting text colors
   - Consistent padding

#### Props:
- `status`: Item status
- `daysLeft`: Days until expiration

---

### 9. AppRouter.jsx (31 lines)
**Purpose:** Route logic and authentication handling

#### Features:
1. **Loading State**
   - Spinner during auth check
   - Centered display

2. **Route Logic**
   - Admin: Show AdminDashboard
   - #admin hash: Show LoginScreen
   - Default: Show PublicBrowse

3. **User Roles**
   - lostfound_admin
   - system_admin
   - parent

#### Flow:
1. App loads → Check auth status
2. If loading: Show spinner
3. If admin: AdminDashboard
4. If #admin: LoginScreen
5. Else: PublicBrowse

---

## Context Providers

### AuthContext
- User management
- Login/logout functions
- Role checking helpers
- LocalStorage persistence

### DataContext
- Mock data management
- CRUD operations for items
- Claim management
- Search/filter helpers
- Statistics calculations

---

## Design Tokens

### Colors
```
Primary: hsl(202, 83%, 41%) - Blue
Success: hsl(142, 71%, 45%) - Green
Warning: hsl(38, 92%, 50%) - Orange
Danger: hsl(0, 84%, 60%) - Red
```

### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

### Border Radius
- sm: 0.25rem
- md: 0.375rem
- lg: 0.5rem
- xl: 0.75rem
- full: 9999px

### Shadows
- card: 0 2px 8px rgba(0,0,0,0.08)
- card-hover: 0 8px 24px rgba(0,0,0,0.12)
- modal: 0 20px 60px rgba(0,0,0,0.25)
- button: 0 1px 3px rgba(0,0,0,0.1)

---

## Responsive Breakpoints

- **sm:** 640px (tablets)
- **md:** 768px (small laptops)
- **lg:** 1024px (laptops)
- **xl:** 1280px (desktops)
- **2xl:** 1536px (large screens)

## Component Dependencies

```
App
├── AuthProvider
│   └── DataProvider
│       └── AppRouter
│           ├── AdminDashboard
│           │   ├── ItemCard
│           │   └── StatusBadge
│           ├── LoginScreen
│           └── PublicBrowse
│               ├── SearchBar
│               ├── ItemCard
│               ├── StatusBadge
│               ├── ClaimModal
│               └── LoginModal
```

## Total Component Stats

- **Total Components:** 9
- **Total Lines:** 1,576
- **Context Providers:** 2
- **Modal Components:** 2
- **Screen Components:** 3
- **UI Components:** 4
- **Routes:** 3

## Performance Metrics

- **Build Size:** 192.27 kB (56.73 kB gzipped)
- **Modules:** 1,261
- **Build Time:** ~1.2s
- **Dependencies:** 168 packages

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+
