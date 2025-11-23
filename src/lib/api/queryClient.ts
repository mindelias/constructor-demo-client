import { QueryClient } from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';

// Default options for all queries
const queryConfig: DefaultOptions = {
  queries: {
    // Refetch on window focus in production
    refetchOnWindowFocus: import.meta.env.PROD,

    // Retry failed requests
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },

    // Cache time: 5 minutes
    gcTime: 5 * 60 * 1000,

    // Stale time: 1 minute
    staleTime: 60 * 1000,

    // Refetch on reconnect
    refetchOnReconnect: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
  },
};

// Create query client instance
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query keys factory for consistent cache keys
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
  },

  // Products
  products: {
    all: ['products'] as const,
    list: (filters?: Record<string, any>) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    search: (query: string) => ['products', 'search', query] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: () => ['orders', 'list'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },

  // Recommendations
  recommendations: {
    forUser: () => ['recommendations', 'user'] as const,
    forProduct: (productId: string) => ['recommendations', 'product', productId] as const,
  },

  // User preferences
  preferences: {
    get: () => ['preferences'] as const,
  },
};
