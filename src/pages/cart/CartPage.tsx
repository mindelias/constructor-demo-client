import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/features/cart/components/CartItem';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCartStore } from '@/store/cartStore';

export function CartPage() {
  const navigate = useNavigate();
  const { items } = useCartStore();

  console.log('====================================');
  console.log('ITEMS', items);
  console.log('====================================');

  const isEmpty = items.length === 0;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-muted-foreground">
            {isEmpty
              ? 'Your cart is empty'
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {isEmpty ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Add some products to get started
            </p>

            <Button onClick={() => navigate('/products')} className="gap-2">
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          /* Cart with Items */
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item?.product?._id} item={item} />
                ))}
              </AnimatePresence>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/products">
                  <Button variant="outline" className="gap-2">
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
