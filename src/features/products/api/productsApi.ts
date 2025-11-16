import { apiClient } from '@/lib/api/client';
import type { Product, ProductFilters, ProductsResponse } from '../types/product.types';

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products', {
      params: filters,
    });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  search: async (searchTerm: string): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products/search', {
      params: { q: searchTerm },
    });
    return data;
  },
};
