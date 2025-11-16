export interface Product {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string; // For backward compatibility
  images: string[];
  category: string;
  inventory: number;
  stock?: number; // For backward compatibility
  tags: string[];
  features?: Record<string, any>;
  stats: {
    views: number;
    purchases: number;
    rating: number;
    reviewCount: number;
  };
  rating?: number; // For backward compatibility
  reviewCount?: number; // For backward compatibility
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest' | 'popular' | 'rating';
  inStock?: boolean;
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
