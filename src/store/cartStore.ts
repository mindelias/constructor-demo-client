import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types/api.types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  getSubtotal: () => number;
  getTax: () => number;
}

const TAX_RATE = 0.1; // 10% tax

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart or update quantity if already exists
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item?.product?._id === product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        }),

      // Remove item from cart
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),

      // Update item quantity
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product._id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.product._id === productId ? { ...item, quantity } : item
            ),
          };
        }),

      // Clear cart
      clearCart: () => set({ items: [] }),

      // Get total number of items
      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get subtotal (before tax)
      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      // Get tax amount
      getTax: () => {
        const { getSubtotal } = get();
        return getSubtotal() * TAX_RATE;
      },

      // Get total (subtotal + tax)
      getTotal: () => {
        const { getSubtotal, getTax } = get();
        return getSubtotal() + getTax();
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
