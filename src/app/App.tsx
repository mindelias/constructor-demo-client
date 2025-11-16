import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Providers } from './providers';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
