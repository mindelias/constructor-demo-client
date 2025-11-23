import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export function CartSummary() {
  const navigate = useNavigate();
  const { getSubtotal, getTax, getTotal, getItemCount } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600 dark:text-green-500">
            FREE
          </span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={() => navigate('/checkout')}
        >
          <ShoppingCart className="h-5 w-5" />
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
