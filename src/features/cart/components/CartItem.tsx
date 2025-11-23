import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CartItem as CartItemType } from '@/types/api.types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      updateQuantity(product._id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product._id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(product._id);
  };

  const itemTotal = product.price * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <Link
              to={`/products/${product._id}`}
              className="flex-shrink-0"
            >
              <div className="h-24 w-24 overflow-hidden rounded-md bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  to={`/products/${product._id}`}
                  className="font-semibold hover:text-primary"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.category}
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Quantity Controls - Mobile */}
              <div className="mt-2 flex items-center gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="min-w-[40px] text-center text-sm font-semibold">
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8 text-destructive"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quantity Controls - Desktop */}
            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="min-w-[40px] text-center font-semibold">
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Item Total */}
              <div className="min-w-[100px] text-right font-semibold">
                {formatPrice(itemTotal)}
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Item Total */}
            <div className="flex items-start sm:hidden">
              <span className="font-semibold">{formatPrice(itemTotal)}</span>
            </div>
          </div>

          {/* Stock Warning */}
          {quantity >= product.stock && (
            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-500">
              Maximum quantity available: {product.stock}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
