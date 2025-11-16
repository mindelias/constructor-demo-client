export const APP_NAME = 'Constructor Store';
export const APP_DESCRIPTION = 'Premium E-Commerce Platform';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const;

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  CART: 'cart',
  ORDERS: 'orders',
  ORDER: 'order',
  USER: 'user',
} as const;
