import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryKeys } from '@/lib/api/queryClient';
import { createOrder } from '../api/ordersApi';
import { useCartStore } from '@/store/cartStore';
import type { CreateOrderRequest } from '@/types/api.types';

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: (order) => {
      // Clear the cart
      clearCart();

      // Invalidate orders cache
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      // Navigate to order detail page
      navigate(`/orders/${order._id}`);
    },
  });
}
