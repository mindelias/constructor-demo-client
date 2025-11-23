import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { getProducts } from '../api/productsApi';
import type { ProductFilters } from '@/types/api.types';

/**
 * Hook to fetch products with filters
 * Automatically caches and refetches data
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => getProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
