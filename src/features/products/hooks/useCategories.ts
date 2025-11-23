import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/productsApi';

/**
 * Hook to fetch product categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });
}
