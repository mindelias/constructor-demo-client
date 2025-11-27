import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProductListPage } from '@/pages/products/ProductListPage';
import { ProductDetailPage } from '@/pages/products/ProductDetailPage';
import { CartPage } from '@/pages/cart/CartPage';
import { CheckoutPage } from '@/pages/checkout/CheckoutPage';
import { OrderHistoryPage } from '@/pages/orders/OrderHistoryPage';
import { OrderDetailPage } from '@/pages/orders/OrderDetailPage';
import { PaymentVerifyPage } from '@/pages/PaymentVerifyPage';
import { AuthProvider } from '@/features/auth/context/AuthContext';

// Placeholder components - will be built in next steps
const HomePage = () => (
  <MainLayout>
    <div className="container py-12">
      <h1 className="text-4xl font-bold">Home Page - Coming Soon</h1>
    </div>
  </MainLayout>
);

const ProfilePage = () => (
  <MainLayout>
    <div className="container py-12">
      <h1 className="text-4xl font-bold">Profile - Coming Soon</h1>
    </div>
  </MainLayout>
);

const PreferencesPage = () => (
  <MainLayout>
    <div className="container py-12">
      <h1 className="text-4xl font-bold">Preferences - Coming Soon</h1>
    </div>
  </MainLayout>
);

export const router = createBrowserRouter([
  {
    // Root route - wraps everything with AuthProvider
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      // Public routes
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },

      // Protected routes
      {
        index: true, // This is the '/' route
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute>
            <ProductListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment/verify/:orderId',
        element: (
          <ProtectedRoute>
            <PaymentVerifyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'preferences',
        element: (
          <ProtectedRoute>
            <PreferencesPage />
          </ProtectedRoute>
        ),
      },

      // Catch all - redirect to home
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
