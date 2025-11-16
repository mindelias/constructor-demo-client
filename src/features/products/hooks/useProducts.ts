import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import type { ProductFilters } from '../types/product.types';
import { QUERY_KEYS } from '@/lib/utils/constants';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId,
  });
}

export function useProductSearch(searchTerm: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'search', searchTerm],
    queryFn: () => productsApi.search(searchTerm),
    enabled: searchTerm.length > 2,
    staleTime: 1000 * 30, // 30 seconds for search
  });
}
