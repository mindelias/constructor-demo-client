// ===========================
// UI Component Types
// ===========================

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// ===========================
// Layout Types
// ===========================

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  separator?: boolean;
  disabled?: boolean;
}

// ===========================
// Loading & Error States
// ===========================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// ===========================
// Pagination Types
// ===========================

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===========================
// Filter Types
// ===========================

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  search?: string;
  category?: string;
  priceRange?: PriceRange;
  sort?: string;
}

// ===========================
// Modal Types
// ===========================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// ===========================
// Toast Types
// ===========================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// ===========================
// Theme Types
// ===========================

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark';
}
