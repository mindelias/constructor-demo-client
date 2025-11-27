import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/api.types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking button
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };
  const productImage = product.imageUrl || product?.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/products/${product._id}`}>
        <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />

            {/* Stock Badge */}
            {product.inventory === 0 && (
              <Badge variant="destructive" className="absolute right-2 top-2">
                Out of Stock
              </Badge>
            )}

            {product.inventory > 0 && product.inventory < 10 && (
              <Badge variant="secondary" className="absolute right-2 top-2">
                Only {product.inventory} left
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            {/* Category */}
            <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>

            {/* Product Name */}
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{product.name}</h3>

            {/* Rating */}
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.stats.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.numReviews})</span>
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          </CardContent>

          <CardFooter className="flex items-center justify-between p-4 pt-0">
            {/* Price */}
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>

            {/* Add to Cart Button */}
            <Button size="sm" onClick={handleAddToCart} disabled={product.inventory === 0} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
