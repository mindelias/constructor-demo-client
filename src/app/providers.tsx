import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/api/queryClient';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Global providers wrapper
 * Wraps the app with all necessary providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Toast notifications */}
      <Toaster position="top-right" richColors closeButton />

      {/* React Query DevTools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
