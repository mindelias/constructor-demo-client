import api from '@/lib/api/axios';
import type {
  ApiResponse,
  Order,
  CreateOrderRequest,
} from '@/types/api.types';

/**
 * Orders API functions
 */

// Create new order
export const createOrder = async (
  data: CreateOrderRequest
): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>('/orders', data);
  return response.data.data;
};

// Get user's orders
export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
  return response.data.data;
};

// Get single order by ID
export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
};
