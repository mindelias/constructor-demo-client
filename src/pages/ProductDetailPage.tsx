import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useProductDetail } from '@/features/products/hooks/useProducts';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { PageTransition } from '@/components/common/PageTransition';
import { formatPrice } from '@/lib/utils/formatters';
import { normalizeProduct } from '@/lib/utils/productHelpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useProductDetail(id!);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-20">
          <LoadingSpinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-20">
          <EmptyState
            title="Product not found"
            description="The product you're looking for doesn't exist"
            action={
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            }
          />
        </div>
      </PageTransition>
    );
  }

  const normalized = normalizeProduct(product);
  const inWishlist = isInWishlist(normalized.id);

  const handleAddToCart = () => {
    addItem({
      id: normalized.id,
      name: normalized.name,
      price: normalized.price,
      quantity,
      image: normalized.imageUrl,
      productId: normalized.id,
    });
    toast.success(`Added ${quantity} item(s) to cart`);
    openCart();
  };

  const handleToggleWishlist = () => {
    toggleItem(normalized.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4"
            >
              <img
                src={normalized.images[selectedImage] || normalized.imageUrl}
                alt={normalized.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            {normalized.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {normalized.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${normalized.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Tags */}
            <div className="flex items-center gap-2 mb-4">
              <Badge>{normalized.category}</Badge>
              {normalized.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {normalized.name}
            </h1>

            {/* Rating */}
            {normalized.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(normalized.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium">{normalized.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({normalized.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold">
                {formatPrice(normalized.price)}
              </span>
              {normalized.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    {formatPrice(normalized.originalPrice)}
                  </span>
                  <Badge variant="destructive">
                    {Math.round(
                      ((normalized.originalPrice - normalized.price) /
                        normalized.originalPrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            {normalized.stock > 0 ? (
              <p className="text-green-600 font-medium mb-6">
                In Stock ({normalized.stock} available)
              </p>
            ) : (
              <p className="text-destructive font-medium mb-6">Out of Stock</p>
            )}

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {normalized.description}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="font-semibold mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(normalized.stock, quantity + 1))
                  }
                  disabled={quantity >= normalized.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={normalized.stock === 0}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    inWishlist && 'fill-red-500 text-red-500'
                  )}
                />
              </Button>
            </div>

            {/* Product Stats */}
            {normalized.stats && (
              <Card className="mt-6 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {normalized.stats.views}
                    </p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {normalized.stats.purchases}
                    </p>
                    <p className="text-sm text-muted-foreground">Sold</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {normalized.stats.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
