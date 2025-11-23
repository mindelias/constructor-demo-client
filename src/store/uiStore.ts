import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types/common.types';

interface UIState {
  theme: Theme;
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  setCartDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      isMobileMenuOpen: false,
      isCartDrawerOpen: false,

      setTheme: (theme) => set({ theme }),

      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      toggleCartDrawer: () =>
        set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
    }),
    {
      name: 'ui-storage', // localStorage key
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
