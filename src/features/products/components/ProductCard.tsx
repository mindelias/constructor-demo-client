import { memo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { useCartStore } from '@/features/cart/store/cartStore';
import { formatPrice } from '@/lib/utils/formatters';
import type { Product } from '../types/product.types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = memo<ProductCardProps>(({ product, className }) => {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl,
      productId: product.id,
    });
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn('group', className)}
    >
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Only {product.stock} left
            </Badge>
          )}

          {product.stock === 0 && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Out of Stock
            </Badge>
          )}

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute top-3 left-3">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>

          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating})</span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
