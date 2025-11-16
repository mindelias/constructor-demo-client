import type { Product } from '@/features/products/types/product.types';

/**
 * Normalizes product data from API to ensure backward compatibility
 */
export function normalizeProduct(product: Product): Product & {
  id: string;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
} {
  return {
    ...product,
    id: product._id,
    stock: product.inventory,
    rating: product.stats?.rating || 0,
    reviewCount: product.stats?.reviewCount || 0,
    imageUrl: product.images?.[0] || '',
  };
}

export function normalizeProducts(products: Product[]) {
  return products.map(normalizeProduct);
}
