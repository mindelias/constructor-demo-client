import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import { getOrders } from '../api/ordersApi';

/**
 * Hook to fetch user's orders
 */
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: getOrders,
    staleTime: 60 * 1000, // 1 minute
  });
}
