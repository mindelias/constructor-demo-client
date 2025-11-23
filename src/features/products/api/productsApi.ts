import api from '@/lib/api/axios';
import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductFilters,
} from '@/types/api.types';

/**
 * Product API functions
 */

// Get all products with optional filters
export const getProducts = async (
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams();

  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await api.get<PaginatedResponse<Product>>(
    `/products?${params.toString()}`
  );
  return response.data;
};

// Get single product by ID
export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
};

// Get product categories
export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<ApiResponse<string[]>>('/products/categories');
  return response.data.data;
};
