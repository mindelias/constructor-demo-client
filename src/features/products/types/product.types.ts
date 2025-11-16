export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  images?: string[];
  category: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest';
}

export interface ProductsResponse {
  data: Product[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
