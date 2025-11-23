import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Providers } from './providers';

/**
 * Main App Component
 * Sets up all providers and routing
 */
function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
