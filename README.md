# 🛍️ Constructor Store - Production-Grade E-Commerce Application

A modern, production-ready e-commerce frontend application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. Features a fully-functional shopping cart, product browsing, authentication, and more.

## ✨ Features

- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui and Tailwind CSS
- 🛒 **Shopping Cart** - Full-featured cart with Zustand state management
- 🔐 **Authentication** - Login and registration with form validation
- 📦 **Product Catalog** - Browse and search products with filters
- 🎭 **Animations** - Smooth transitions with Framer Motion
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ⚡ **Performance** - Optimized with React Query for data fetching
- 🎯 **Type-Safe** - Full TypeScript coverage
- 🧪 **Error Handling** - Comprehensive error boundaries and states

## 🏗️ Tech Stack

### Core
- **React 18.3** - UI library with Concurrent Features
- **TypeScript 5** - Type safety and better DX
- **Vite 5** - Lightning-fast build tool
- **React Router v6** - Client-side routing

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components built on Radix UI
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set

### State Management
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management (cart, auth)

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**

   The `.env` file is already configured with the backend API:
   ```env
   VITE_API_URL=https://constructor-demo-server-production.up.railway.app/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎯 Key Features

### Shopping Cart
- Persistent cart state (localStorage)
- Add/remove/update items
- Real-time total calculation
- Slide-out drawer UI

### Authentication
- Form validation with Zod
- JWT token management
- Protected routes
- User session persistence

### Product Catalog
- Grid layout with animations
- Product cards with hover effects
- Stock status badges
- Price formatting

## 🔌 API Integration

Backend API: `https://constructor-demo-server-production.up.railway.app/api`

The app uses:
- Axios with interceptors for auth
- React Query for caching
- Comprehensive error handling
- Loading and empty states

## 📱 Responsive Design

- Mobile: < 640px
- Tablet: 641px - 1024px
- Desktop: > 1024px

---

**Built with ❤️ using modern React best practices**
