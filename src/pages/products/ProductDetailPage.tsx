import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '@/features/products/hooks/useProduct';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useProduct(id!);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${product.name} (${quantity}x) added to cart!`);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.inventory) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Skeleton className="mb-6 h-10 w-32" />
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <p className="mb-4 text-lg font-semibold text-destructive">
                Product not found
              </p>
              <Button onClick={() => navigate('/products')}>
                Back to Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const inStock = product.inventory > 0;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        {/* Product Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {!inStock && (
              <Badge
                variant="destructive"
                className="absolute right-4 top-4 text-base"
              >
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <Link
              to={`/products?category=${product.category}`}
              className="mb-2 text-sm text-muted-foreground uppercase tracking-wide hover:text-foreground"
            >
              {product.category}
            </Link>

            {/* Product Name */}
            <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.stats.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {product.stats.rating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Description */}
            <p className="mb-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {inStock ? (
                <p className="text-sm text-muted-foreground">
                  {product.inventory < 10 ? (
                    <span className="text-yellow-600 dark:text-yellow-500">
                      Only {product.inventory} left in stock
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-500">
                      In Stock ({product.inventory} available)
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-destructive">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="min-w-[60px] text-center text-lg font-semibold">
                    {quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.inventory}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full gap-2 text-base"
            >
              <ShoppingCart className="h-5 w-5" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
