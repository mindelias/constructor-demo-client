// ===========================
// Common Types
// ===========================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  metadata: PaginationMeta;
}

// ===========================
// User & Auth Types
// ===========================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// ===========================
// Product Types
// ===========================

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inventory: number;
  stats: ProductStats;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

 

export interface ProductStats {
  purchases: number;
  rating: number;
  reviewCount: number;
  views: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price' | '-price' | 'rating' | '-rating' | 'name' | '-name';
  page?: number;
  limit?: number;
}

// ===========================
// Cart Types
// ===========================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
}

// ===========================
// Order Types
// ===========================

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
}

// ===========================
// Preferences Types
// ===========================

export interface UserPreferences {
  _id: string;
  user: string;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  favoriteProducts: string[];
  viewHistory: Array<{
    product: string;
    viewedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePreferencesRequest {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  favoriteProducts?: string[];
}

// ===========================
// Recommendations Types
// ===========================

export interface Recommendation {
  _id: string;
  product: Product;
  score: number;
  reason: string;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  basedOn: 'preferences' | 'history' | 'collaborative' | 'content';
}

// ===========================
// Socket.IO Event Types
// ===========================

export interface OrderUpdateEvent {
  orderId: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface NotificationEvent {
  type: 'order' | 'system' | 'promotion';
  title: string;
  message: string;
  data?: unknown;
  timestamp: string;
}

// ===========================
// Form Types
// ===========================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
}

export interface PreferencesFormData {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
