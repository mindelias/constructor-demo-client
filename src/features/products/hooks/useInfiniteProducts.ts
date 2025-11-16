import { useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';
import type { ProductFilters } from '../types/product.types';
import { QUERY_KEYS } from '@/lib/utils/constants';

export function useInfiniteProducts(filters?: Omit<ProductFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAll({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
}
