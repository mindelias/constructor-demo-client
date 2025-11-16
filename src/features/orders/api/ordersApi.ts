import { apiClient } from '@/lib/api/client';
import type { Order, CreateOrderData, OrdersResponse } from '../types/order.types';

export const ordersApi = {
  create: async (orderData: CreateOrderData): Promise<Order> => {
    const { data } = await apiClient.post<Order>('/orders', orderData);
    return data;
  },

  getAll: async (): Promise<OrdersResponse> => {
    const { data } = await apiClient.get<OrdersResponse>('/orders');
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },

  cancel: async (id: string): Promise<Order> => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/cancel`);
    return data;
  },
};
