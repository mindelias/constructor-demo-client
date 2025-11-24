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
  imageUrl?: string; // For backward compatibility
  images?: string[]; // Backend uses 'images' array
  inventory: number;
  tags?: string[]; // Backend includes tags
  features?: Record<string, unknown>; // Backend includes features
  stats: ProductStats;
  numReviews?: number; // Optional - may use stats.reviewCount instead
  createdAt: string;
  updatedAt: string;
  __v?: number; // MongoDB version key
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
  fullName?: string;
  address?: string;
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  productId: string | Product; // Backend uses 'productId', not 'product'
  product?: string | Product; // For backward compatibility
  name?: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  _id?: string; // Backend includes this
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  _id: string;
  userId?: string; // Backend uses 'userId', not 'user'
  user?: string | User; // For backward compatibility
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount?: number; // Backend uses 'totalAmount', not 'total'
  total?: number; // For backward compatibility
  subtotal?: number; // Optional - backend may not return
  tax?: number; // Optional - backend may not return
  shippingCost?: number; // Optional - backend may not return
  status: OrderStatus;
  statusHistory?: OrderStatusUpdate[]; // Optional - backend may not return!
  paymentMethod?: string; // For payment gateway simulation
  paymentStatus?: 'pending' | 'completed' | 'failed'; // For payment tracking
  createdAt: string;
  updatedAt: string;
  __v?: number; // MongoDB version key
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
  paymentMethod?: 'credit_card' | 'paypal' | 'cash_on_delivery'; // For payment simulation
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
