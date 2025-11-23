# 🧪 Complete E-Commerce Application Test Plan

## 📋 Table of Contents
1. [Frontend Features & Test Scenarios](#frontend-features)
2. [Backend API Endpoints](#backend-api)
3. [Test Execution Checklist](#test-checklist)
4. [Known Issues & Edge Cases](#edge-cases)

---

## 🎨 Frontend Features & Test Scenarios

### 1. **Homepage** (`/`)

#### Features:
- Hero section with CTA button
- Feature cards (Free Shipping, Secure Payment, Quality Products)
- Featured products grid (8 products)
- Responsive layout

#### Test Scenarios:
```
✅ TC-001: Homepage Loads
- Navigate to http://localhost:3000
- EXPECT: Hero section displays "Discover Amazing Products"
- EXPECT: 3 feature cards visible
- EXPECT: Featured products section shows up to 8 products
- EXPECT: "Shop Now" button redirects to /products

✅ TC-002: Featured Products Display
- Scroll to "Featured Products" section
- EXPECT: Product cards show images, names, prices, categories
- EXPECT: "Add to Cart" button on each card
- EXPECT: Heart icon for wishlist
- EXPECT: Stock badges (if low stock/out of stock)

✅ TC-003: Responsive Design
- Resize browser to mobile (< 640px)
- EXPECT: Products grid changes to 1 column
- Resize to tablet (641-1024px)
- EXPECT: Products grid shows 2 columns
- Desktop (> 1024px)
- EXPECT: Products grid shows 4 columns
```

---

### 2. **Product Listing Page** (`/products`)

#### Features:
- Search bar with autocomplete
- Advanced filters panel (category, price, sort, in-stock)
- Product grid with animations
- Wishlist integration
- Click to view product details

#### Test Scenarios:

```
✅ TC-004: Products Page Load
- Navigate to /products
- EXPECT: All products displayed in grid
- EXPECT: Search bar at top
- EXPECT: "Filters" button visible
- EXPECT: Product count shows "Discover our collection of X products"

✅ TC-005: Search with Autocomplete
- Click on search bar
- Type "headphones" (min 3 characters)
- EXPECT: Autocomplete dropdown appears after 300ms
- EXPECT: Shows up to 5 product suggestions
- EXPECT: Each suggestion shows image, name, category, price
- EXPECT: Shows total results count
- Click on a suggestion
- EXPECT: Navigates to product detail page

✅ TC-006: Search Submit
- Type search term in search bar
- Press Enter
- EXPECT: URL updates with ?search=TERM
- EXPECT: Products filter to match search
- EXPECT: Product count updates

✅ TC-007: Advanced Filters - Category
- Click "Filters" button
- EXPECT: Filters panel slides in from right
- Select category "Electronics"
- Click "Apply Filters"
- EXPECT: URL updates with ?category=Electronics
- EXPECT: Only electronics products shown
- EXPECT: Filters panel closes

✅ TC-008: Advanced Filters - Price Range
- Open filters panel
- Enter Min Price: 50
- Enter Max Price: 200
- Click "Apply Filters"
- EXPECT: URL updates with ?minPrice=50&maxPrice=200
- EXPECT: Only products in price range shown

✅ TC-009: Advanced Filters - Sort
- Open filters panel
- Select "Price: Low to High" from Sort dropdown
- Click "Apply Filters"
- EXPECT: Products sorted by price ascending
- VERIFY: First product has lowest price

✅ TC-010: Advanced Filters - In Stock Only
- Open filters panel
- Check "In Stock Only"
- Click "Apply Filters"
- EXPECT: Only in-stock products shown
- VERIFY: No "Out of Stock" badges visible

✅ TC-011: Clear All Filters
- Apply multiple filters
- EXPECT: Filter count badge shows number (e.g., "3")
- Open filters panel
- Click "Clear All"
- EXPECT: All filters reset
- EXPECT: All products shown
- EXPECT: URL cleared of filter params

✅ TC-012: Wishlist from Product Card
- Hover over a product card
- EXPECT: Eye and Heart icons appear
- Click Heart icon
- EXPECT: Heart fills with red color
- EXPECT: Toast notification: "Added to wishlist"
- Click Heart again
- EXPECT: Heart becomes outlined
- EXPECT: Toast: "Removed from wishlist"

✅ TC-013: Product Card Click
- Click anywhere on product card
- EXPECT: Navigates to /products/:id
- EXPECT: Product detail page loads
```

---

### 3. **Product Detail Page** (`/products/:id`)

#### Features:
- Image gallery with thumbnails
- Product information (name, price, description, rating)
- Quantity selector
- Add to cart
- Add to wishlist
- Product stats (views, purchases, rating)
- Back navigation

#### Test Scenarios:

```
✅ TC-014: Product Detail Load
- Navigate to /products/[valid-id]
- EXPECT: Product name displays
- EXPECT: Main product image shows
- EXPECT: Price, category, description visible
- EXPECT: Rating stars and review count
- EXPECT: "Add to Cart" and wishlist buttons

✅ TC-015: Image Gallery
- EXPECT: Main image displayed
- EXPECT: Thumbnail images below (if multiple images)
- Click different thumbnail
- EXPECT: Main image changes to selected thumbnail
- EXPECT: Selected thumbnail has blue border

✅ TC-016: Quantity Selector
- EXPECT: Quantity starts at 1
- Click "+" button
- EXPECT: Quantity increases to 2
- Click "-" button
- EXPECT: Quantity decreases to 1
- Try to go below 1
- EXPECT: "-" button disabled
- Increase to stock limit
- EXPECT: "+" button disabled at max stock

✅ TC-017: Add to Cart from Detail
- Set quantity to 2
- Click "Add to Cart"
- EXPECT: Toast: "Added 2 item(s) to cart"
- EXPECT: Cart drawer opens
- EXPECT: Product appears in cart with quantity 2

✅ TC-018: Wishlist Toggle
- Click wishlist heart button
- EXPECT: Heart fills red
- EXPECT: Toast notification
- Refresh page
- EXPECT: Heart still filled (persisted)

✅ TC-019: Out of Stock Product
- Navigate to out-of-stock product
- EXPECT: "Out of Stock" badge visible
- EXPECT: "Add to Cart" button disabled
- EXPECT: Quantity selector disabled

✅ TC-020: Product Stats
- Scroll to product stats section
- EXPECT: Views count displayed
- EXPECT: Purchases count displayed
- EXPECT: Rating displayed

✅ TC-021: Back Navigation
- Click "Back to Products" button
- EXPECT: Returns to /products page
- EXPECT: Previous filters/search preserved in URL
```

---

### 4. **Shopping Cart** (Drawer)

#### Features:
- Persistent cart (localStorage)
- Add/remove items
- Update quantities
- Price calculations
- Empty state
- Proceed to checkout

#### Test Scenarios:

```
✅ TC-022: Open Cart Drawer
- Click cart icon in header
- EXPECT: Cart drawer slides in from right
- EXPECT: Shows "Shopping Cart (X)" title
- EXPECT: Lists all cart items

✅ TC-023: Cart Item Display
- EXPECT: Each item shows image, name, price, quantity
- EXPECT: Subtotal per item
- EXPECT: Quantity controls (+/- buttons)
- EXPECT: Trash icon to remove

✅ TC-024: Update Quantity in Cart
- Click "+" on an item
- EXPECT: Quantity increases
- EXPECT: Item subtotal updates
- EXPECT: Cart total updates
- Click "-"
- EXPECT: Quantity decreases
- EXPECT: Totals update

✅ TC-025: Remove Item
- Click trash icon on item
- EXPECT: Item removed from cart
- EXPECT: Cart count badge updates
- EXPECT: Totals recalculate

✅ TC-026: Empty Cart State
- Remove all items
- EXPECT: Empty state displays
- EXPECT: Shows "Your cart is empty" message
- EXPECT: Icon and message visible
- EXPECT: No checkout button

✅ TC-027: Cart Persistence
- Add items to cart
- Refresh page
- EXPECT: Cart items still present
- Close browser, reopen
- EXPECT: Cart items persist

✅ TC-028: Cart Badge
- Add item to cart
- EXPECT: Cart icon shows badge with count
- Add another item
- EXPECT: Badge count increases
- Remove item
- EXPECT: Badge count decreases

✅ TC-029: Proceed to Checkout
- Have items in cart
- Click "Proceed to Checkout"
- EXPECT: Navigates to /checkout
- EXPECT: Cart drawer closes
```

---

### 5. **Checkout Page** (`/checkout`)

#### Features:
- Shipping address form with validation
- Payment method selection
- Order summary
- Form validation (React Hook Form + Zod)
- Place order functionality

#### Test Scenarios:

```
✅ TC-030: Checkout Page Access (Empty Cart)
- Clear cart completely
- Navigate to /checkout
- EXPECT: Empty state "Your cart is empty"
- EXPECT: "Continue Shopping" button
- Click button
- EXPECT: Redirects to /products

✅ TC-031: Checkout Form Display
- Add items to cart
- Navigate to /checkout
- EXPECT: "Shipping Information" card
- EXPECT: "Payment Method" card
- EXPECT: "Order Summary" sidebar

✅ TC-032: Form Validation - Empty Submit
- Leave all fields empty
- Click "Place Order"
- EXPECT: Validation errors show on all required fields
- EXPECT: Red error text under each field
- EXPECT: Order NOT submitted

✅ TC-033: Form Validation - Email
- Enter invalid email "notanemail"
- Submit form
- EXPECT: Error: "Invalid email address"
- Enter valid email
- EXPECT: Error clears

✅ TC-034: Form Validation - Phone
- Enter short phone "123"
- Submit
- EXPECT: Error: "Phone number is required"
- Enter valid phone
- EXPECT: Error clears

✅ TC-035: Form Validation - Address Fields
- Test each field:
  - Full Name (min 3 chars)
  - Address (min 10 chars)
  - City (min 2 chars)
  - Postal Code (min 5 chars)
  - Country (min 2 chars)
- EXPECT: Each shows appropriate error if too short

✅ TC-036: Payment Method Selection
- EXPECT: "Credit/Debit Card" selected by default
- Open dropdown
- EXPECT: Options: Card, PayPal, Cash on Delivery
- Select "PayPal"
- EXPECT: Selection updates

✅ TC-037: Order Summary Display
- EXPECT: All cart items shown with images
- EXPECT: Each item shows name, quantity, price
- EXPECT: Subtotal displayed
- EXPECT: Shipping: $10.00
- EXPECT: Tax (10%): calculated correctly
- EXPECT: Total = Subtotal + Shipping + Tax

✅ TC-038: Place Order Success
- Fill all required fields correctly
- Select payment method
- Click "Place Order"
- EXPECT: Button shows "Processing..."
- EXPECT: Button disabled during submission
- EXPECT: Toast: "Order placed successfully!"
- EXPECT: Redirects to /orders
- EXPECT: Cart cleared
- EXPECT: New order appears in orders list

✅ TC-039: Place Order API Error
- Fill form correctly
- Disconnect internet / use invalid data
- Submit
- EXPECT: Error toast displays
- EXPECT: Form still filled (data not lost)
- EXPECT: Can retry submission
```

---

### 6. **Orders Page** (`/orders`)

#### Features:
- Order history list
- Order status badges
- Order details (items, shipping, total)
- Date formatting
- Empty state

#### Test Scenarios:

```
✅ TC-040: Orders Page - No Orders
- Fresh account with no orders
- Navigate to /orders
- EXPECT: Empty state "No orders yet"
- EXPECT: "Start Shopping" button
- Click button
- EXPECT: Redirects to /products

✅ TC-041: Orders List Display
- Place at least one order
- Navigate to /orders
- EXPECT: Order count shown "X order(s)"
- EXPECT: Each order shows:
  - Order number (last 8 chars of ID)
  - Order date
  - Status badge
  - Order items (up to 3 shown)
  - Total price
  - Shipping address

✅ TC-042: Order Status Badges
- Check status badge colors:
  - Pending: Gray/Secondary
  - Processing: Blue/Default
  - Shipped: Blue with truck icon
  - Delivered: Green with checkmark
  - Cancelled: Red/Destructive
- EXPECT: Correct icon for each status

✅ TC-043: Order Items Display
- Order with 5+ items
- EXPECT: First 3 items shown
- EXPECT: "+2 more item(s)" text
- Each item shows image, name, quantity, price

✅ TC-044: Order Details
- EXPECT: Total price prominently displayed
- EXPECT: Shipping address shows:
  - Full name
  - Address
  - City, Postal Code
  - Country
- VERIFY: Matches checkout form data

✅ TC-045: Multiple Orders Sort
- Place multiple orders
- EXPECT: Newest orders at top
- EXPECT: Date formatting "Month Day, Year"
```

---

### 7. **Authentication** (`/login`, `/register`)

#### Features:
- Login form with validation
- Registration form with validation
- JWT token storage
- Protected routes (planned)
- User session persistence

#### Test Scenarios:

```
✅ TC-046: Login Page Display
- Navigate to /login
- EXPECT: App logo/icon
- EXPECT: "Welcome Back" heading
- EXPECT: Email and password fields
- EXPECT: "Login" button
- EXPECT: "Don't have an account? Register" link

✅ TC-047: Login Validation
- Leave email empty, submit
- EXPECT: Error: "Invalid email address"
- Enter invalid email "test"
- EXPECT: Error: "Invalid email address"
- Enter short password "123"
- EXPECT: Error: "Password must be at least 6 characters"

✅ TC-048: Login Success
- Enter valid credentials
- Click "Login"
- EXPECT: Toast: "Welcome back!"
- EXPECT: Redirects to homepage "/"
- EXPECT: User menu appears in header
- EXPECT: Header shows user name/email

✅ TC-049: Login Error
- Enter invalid credentials
- Submit
- EXPECT: Error toast displays
- EXPECT: Form still filled
- EXPECT: Can retry

✅ TC-050: Register Page Display
- Navigate to /register
- EXPECT: "Create Account" heading
- EXPECT: Name, email, password fields
- EXPECT: "Register" button
- EXPECT: "Already have an account? Login" link

✅ TC-051: Register Validation
- Test each field:
  - Name (min 2 chars)
  - Email (valid format)
  - Password (min 6 chars)
- EXPECT: Appropriate errors for each

✅ TC-052: Register Success
- Fill all fields correctly
- Submit
- EXPECT: Toast: "Account created successfully!"
- EXPECT: Redirects to homepage
- EXPECT: User logged in automatically

✅ TC-053: User Session Persistence
- Login successfully
- Refresh page
- EXPECT: User still logged in
- Close browser, reopen
- EXPECT: User still logged in (if within token expiry)

✅ TC-054: Logout
- Click user menu in header
- Click "Logout"
- EXPECT: User logged out
- EXPECT: Redirects to /login
- EXPECT: Header shows "Login" button
- EXPECT: Token removed from localStorage
```

---

### 8. **Header Navigation**

#### Features:
- Logo and app name
- Navigation links (Home, Products, Orders)
- Search integration
- Cart icon with badge
- User menu
- Responsive mobile menu

#### Test Scenarios:

```
✅ TC-055: Header Display
- EXPECT: Logo and "Constructor Store" visible
- EXPECT: Navigation links: Home, Products, Orders
- EXPECT: Cart icon with badge
- EXPECT: User menu or Login button

✅ TC-056: Navigation Links
- Click "Home"
- EXPECT: Navigates to "/"
- Click "Products"
- EXPECT: Navigates to "/products"
- Click "Orders"
- EXPECT: Navigates to "/orders"

✅ TC-057: Cart Icon Badge
- Empty cart
- EXPECT: No badge or badge shows "0"
- Add 2 items
- EXPECT: Badge shows "2"
- Add 3 more of same item
- EXPECT: Badge shows "5" (total quantity)

✅ TC-058: User Menu (Logged In)
- Login first
- Click user icon
- EXPECT: Dropdown shows:
  - User name
  - User email
  - "Orders" link
  - "Logout" button
- Click "Orders"
- EXPECT: Navigates to /orders

✅ TC-059: Responsive Header (Mobile)
- Resize to mobile (< 768px)
- EXPECT: Mobile-friendly layout
- EXPECT: All functions still work
```

---

### 9. **Wishlist Functionality**

#### Features:
- Persistent wishlist (localStorage)
- Toggle from product cards
- Toggle from product detail
- Toast notifications
- Visual indication (red heart)

#### Test Scenarios:

```
✅ TC-060: Add to Wishlist
- On products page, hover over product
- Click heart icon
- EXPECT: Heart fills red
- EXPECT: Toast: "Added to wishlist"
- EXPECT: localStorage updated

✅ TC-061: Remove from Wishlist
- Click filled heart
- EXPECT: Heart becomes outline
- EXPECT: Toast: "Removed from wishlist"

✅ TC-062: Wishlist Persistence
- Add 3 products to wishlist
- Refresh page
- EXPECT: Hearts still filled on those products
- Close browser, reopen
- EXPECT: Wishlist persists

✅ TC-063: Wishlist Across Pages
- Add to wishlist on products page
- Navigate to product detail
- EXPECT: Heart filled on detail page
- Remove from detail page
- Go back to products
- EXPECT: Heart no longer filled
```

---

### 10. **Animations & Transitions**

#### Features:
- Page transitions (Framer Motion)
- Product card hover effects
- Cart drawer slide-in
- Loading spinners
- Toast notifications

#### Test Scenarios:

```
✅ TC-064: Page Transitions
- Navigate between pages
- EXPECT: Smooth fade-in animation
- EXPECT: No jarring jumps
- EXPECT: 300ms transition duration

✅ TC-065: Product Card Animations
- Hover over product card
- EXPECT: Card lifts up (translateY -4px)
- EXPECT: Shadow intensifies
- EXPECT: Image scales up slightly
- EXPECT: Icons appear with fade-in

✅ TC-066: Cart Drawer Animation
- Open cart
- EXPECT: Slides in from right
- EXPECT: Backdrop fades in
- Close cart
- EXPECT: Slides out to right
- EXPECT: Backdrop fades out

✅ TC-067: Loading States
- Navigate to products page
- EXPECT: Spinner shows while loading
- EXPECT: Spinner centered on page
- Products load
- EXPECT: Spinner disappears
```

---

### 11. **Error Handling**

#### Features:
- Error boundaries
- API error handling
- Loading states
- Empty states
- 404 handling

#### Test Scenarios:

```
✅ TC-068: API Error - Products
- Stop backend server
- Navigate to /products
- EXPECT: Error state displays
- EXPECT: "Failed to load products" message
- EXPECT: "Retry" button
- Restart server, click Retry
- EXPECT: Products load

✅ TC-069: API Error - Checkout
- Fill checkout form
- Stop backend
- Submit
- EXPECT: Error toast
- EXPECT: Form data preserved
- EXPECT: Can retry

✅ TC-070: Invalid Product ID
- Navigate to /products/invalid-id-123
- EXPECT: "Product not found" message
- EXPECT: "Browse Products" button
- Click button
- EXPECT: Returns to products page

✅ TC-071: Network Error
- Disconnect internet
- Try to load products
- EXPECT: Appropriate error message
- Reconnect
- EXPECT: Can retry and succeed

✅ TC-072: Empty States
- Test each empty state:
  - Empty cart: Shows icon and message
  - No orders: Shows "Start Shopping" button
  - No products: Shows appropriate message
  - Search no results: Shows "No products found"
```

---

## 🔌 Backend API Endpoints

### Base URL
```
https://constructor-demo-server-production.up.railway.app/api
```

### Products Endpoints

```
GET /products
Description: Get all products with optional filters
Query Params:
  - search: string (search term)
  - category: string (filter by category)
  - minPrice: number
  - maxPrice: number
  - sortBy: string (newest, popular, rating, price-asc, price-desc, name)
  - page: number (default: 1)
  - limit: number (default: 10)
  - inStock: boolean

Response:
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "category": "string",
      "tags": ["string"],
      "images": ["url"],
      "inventory": number,
      "stats": {
        "views": number,
        "purchases": number,
        "rating": number,
        "reviewCount": number
      },
      "features": {},
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

---

GET /products/:id
Description: Get single product by ID
Response: Single product object

---

GET /products/search?q=searchTerm
Description: Search products
Response: Same as GET /products
```

### Auth Endpoints

```
POST /auth/register
Description: Create new user account
Body:
{
  "name": "string",
  "email": "string",
  "password": "string"
}
Response:
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "token": "JWT token"
}

---

POST /auth/login
Description: Login user
Body:
{
  "email": "string",
  "password": "string"
}
Response: Same as register

---

GET /auth/me
Description: Get current user
Headers: Authorization: Bearer {token}
Response: User object

---

POST /auth/logout
Description: Logout user
Headers: Authorization: Bearer {token}
```

### Orders Endpoints

```
POST /orders
Description: Create new order
Headers: Authorization: Bearer {token}
Body:
{
  "items": [
    {
      "product": "productId",
      "name": "string",
      "image": "url",
      "price": number,
      "quantity": number
    }
  ],
  "shippingAddress": {
    "fullName": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string",
    "phone": "string"
  },
  "paymentMethod": "card" | "paypal" | "cash",
  "totalPrice": number
}
Response:
{
  "success": true,
  "data": {
    "_id": "orderId",
    "user": "userId",
    "items": [...],
    "shippingAddress": {...},
    "paymentMethod": "string",
    "totalPrice": number,
    "status": "pending",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}

---

GET /orders
Description: Get all orders for current user
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "data": [order objects],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}

---

GET /orders/:id
Description: Get single order by ID
Headers: Authorization: Bearer {token}
Response: Single order object

---

PATCH /orders/:id/cancel
Description: Cancel an order
Headers: Authorization: Bearer {token}
Response: Updated order object
```

---

## ✅ Test Execution Checklist

### Pre-Testing Setup
- [ ] Backend server running and accessible
- [ ] Frontend dev server running (npm run dev)
- [ ] Clear browser cache and localStorage
- [ ] Test in Chrome/Firefox/Safari
- [ ] Test on mobile device or emulator

### Feature Testing Priority

**Critical Path (Must Work):**
- [ ] Homepage loads
- [ ] Products page displays all products
- [ ] Add to cart works
- [ ] Checkout form submits successfully
- [ ] Order appears in orders list

**High Priority:**
- [ ] Search with autocomplete
- [ ] Filters work correctly
- [ ] Product detail page
- [ ] Wishlist functionality
- [ ] Auth (login/register)

**Medium Priority:**
- [ ] Animations and transitions
- [ ] Empty states
- [ ] Error handling
- [ ] Responsive design

**Low Priority:**
- [ ] Loading spinners
- [ ] Toast notifications
- [ ] Badge counts

---

## 🐛 Known Issues & Edge Cases to Test

### Potential Issues:

```
⚠️ EDGE-001: Large Cart (50+ items)
- Add 50+ unique products to cart
- TEST: Cart drawer performance
- TEST: Checkout page performance
- TEST: Order creation

⚠️ EDGE-002: Very Long Product Names
- Product with 200+ character name
- TEST: Card display (should truncate)
- TEST: Cart display
- TEST: Checkout summary

⚠️ EDGE-003: Special Characters in Search
- Search for: "test@#$%"
- EXPECT: No crashes, appropriate handling

⚠️ EDGE-004: Negative Prices (if API allows)
- TEST: Display and calculation
- EXPECT: Validation or correct display

⚠️ EDGE-005: Multiple Rapid Clicks
- Click "Add to Cart" 10 times rapidly
- EXPECT: Quantity updates correctly
- EXPECT: No duplicate requests

⚠️ EDGE-006: Browser Back Button
- Navigate: Home > Products > Detail > Cart > Checkout
- Click back button multiple times
- EXPECT: Correct navigation
- EXPECT: State preserved

⚠️ EDGE-007: Expired Auth Token
- Login > Wait for token expiry
- Try to place order
- EXPECT: Redirect to login
- EXPECT: Error message

⚠️ EDGE-008: Concurrent Tab Updates
- Open 2 tabs
- Add to cart in tab 1
- Check tab 2
- EXPECT: Cart synced (if localStorage events handled)

⚠️ EDGE-009: Missing Product Images
- Product with no images
- EXPECT: Placeholder image shows
- EXPECT: No broken image icons

⚠️ EDGE-010: Offline Mode
- Go offline while browsing
- TEST: Error messages
- Go back online
- TEST: Recovery
```

---

## 📊 Performance Tests

```
PERF-001: Initial Page Load
- Measure: Time to interactive
- TARGET: < 3 seconds
- CHECK: Network tab in DevTools

PERF-002: Product List Load Time
- Navigate to /products
- Measure: Time to display products
- TARGET: < 2 seconds

PERF-003: Search Debounce
- Type in search bar
- VERIFY: Requests only sent after 300ms pause
- VERIFY: No request spam

PERF-004: Image Loading
- CHECK: Lazy loading works
- VERIFY: Images load as you scroll
- VERIFY: Placeholder until loaded

PERF-005: Bundle Size
- Run: npm run build
- CHECK: dist/assets/index-*.js size
- CURRENT: ~728KB (can be optimized)
```

---

## 🔒 Security Tests

```
SEC-001: XSS Prevention
- Try to inject script in search: <script>alert('xss')</script>
- EXPECT: Sanitized, no execution

SEC-002: Auth Token Storage
- Login
- CHECK: localStorage for token
- VERIFY: Token in Authorization header
- CHECK: Token format (JWT)

SEC-003: Protected Routes
- Logout
- Try to access /orders directly
- EXPECT: Redirect to login (if implemented)

SEC-004: Form Validation Bypass
- Open DevTools
- Remove HTML5 validation
- Try to submit invalid data
- EXPECT: Server-side validation catches it
```

---

## 📱 Responsive Design Tests

```
RESP-001: Mobile (< 640px)
- Products: 1 column grid
- Header: Compact layout
- Cart drawer: Full width
- Forms: Stack vertically

RESP-002: Tablet (641-1024px)
- Products: 2 column grid
- Filters: Sheet/drawer
- Navigation: All visible

RESP-003: Desktop (> 1024px)
- Products: 4 column grid
- All features accessible
- No horizontal scroll

RESP-004: Touch Interactions
- Test on mobile device
- Swipe gestures work
- Buttons are thumb-friendly (44px minimum)
```

---

## 🎯 Acceptance Criteria

### Must Have (MVP):
✅ Users can browse products
✅ Users can search products
✅ Users can filter products
✅ Users can add products to cart
✅ Users can complete checkout
✅ Users can view order history
✅ Basic auth (login/register)

### Should Have:
✅ Wishlist functionality
✅ Product detail page
✅ Advanced filters
✅ Search autocomplete
✅ Responsive design
✅ Loading states
✅ Error handling

### Nice to Have:
✅ Animations
✅ Toast notifications
✅ Empty states
✅ Product stats display

---

## 📝 Bug Report Template

```markdown
### Bug ID: BUG-XXX
**Title:** Brief description

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
What should happen

**Actual Result:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- URL: http://localhost:3000/products

**Screenshots:**
(if applicable)

**Console Errors:**
(if any)

**Additional Notes:**
Any other relevant information
```

---

## 🚀 Ready to Test!

Start with the Critical Path tests first, then work through each feature systematically. Document any issues using the bug report template.

Good luck with testing! 🎉
