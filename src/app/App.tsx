import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';
import { AuthProvider } from '@/features/auth/context/AuthContext';

/**
 * Main App Component
 * Sets up all providers and routing
 */
function AppContent() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
