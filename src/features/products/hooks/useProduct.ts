import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { getProduct } from '../api/productsApi';

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id, // Only run if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
