# Constructor Demo - E-Commerce Frontend

A production-ready React e-commerce application with real-time features, built with modern best practices.

## 🚀 Tech Stack

- **Framework**: React 18.3 with TypeScript 5 (strict mode)
- **Build Tool**: Vite 5 (10-100x faster than Webpack)
- **Routing**: React Router v6 with protected routes
- **State Management**:
  - TanStack Query v5 (server state)
  - Zustand 4.4 (client state with persistence)
  - React Context (auth state)
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **Forms**: React Hook Form 7 + Zod 3 (type-safe validation)
- **Animations**: Framer Motion 11
- **Real-time**: Socket.IO Client 4.6
- **HTTP Client**: Axios 1.6 with interceptors

## ✨ Features

### 🔐 Authentication
- JWT-based auth with auto token injection
- Protected routes with redirect
- Login & Register pages with validation
- Persistent sessions

### 🛍️ Product Browsing
- Product grid with pagination
- Advanced filters (category, price range, sort)
- Debounced search (300ms)
- Product detail pages
- Stock status indicators
- Rating system

### 🛒 Shopping Cart
- Add to cart from list or detail page
- Real-time cart badge
- Quantity controls with stock validation
- LocalStorage persistence
- Animations with Framer Motion

### 💳 Checkout
- Multi-step checkout form
- Shipping address validation (Zod)
- Order summary with live totals
- Toast notifications

### 📦 Order Management
- Order history page
- Order detail with timeline
- Real-time status updates (Socket.IO)
- Auto-refetch every 30 seconds
- Status tracking (pending → processing → shipped → delivered)

### 🎨 UI/UX
- Dark/Light mode with system detection
- Responsive design (mobile/desktop)
- Framer Motion animations
- Loading skeletons
- Empty states

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
VITE_API_BASE_URL=https://constructor-demo-server-production.up.railway.app/api
VITE_SOCKET_URL=https://constructor-demo-server-production.up.railway.app
VITE_APP_NAME=Constructor Demo
```

### Running Locally

```bash
# Development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Build Output

- **Bundle Size**: 847KB (263KB gzipped)
- **CSS**: 27KB (5.6KB gzipped)
- **Build Time**: ~13 seconds

## 🎯 Best Practices

- ✅ TypeScript strict mode for type safety
- ✅ Three-layer state management (TanStack Query + Zustand + Context)
- ✅ Automatic API caching and refetching
- ✅ Form validation with type inference
- ✅ Protected routes with auth guards
- ✅ Real-time updates via Socket.IO
- ✅ Responsive design with mobile-first approach

## 📄 License

MIT License - feel free to use this project for learning or production.
