import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder } from '@/features/orders/hooks/useCreateOrder';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { CheckoutFormData } from '@/types/api.types';

// Validation schema
const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters').optional(),
    street: z.string().min(2, 'Street must be at least 2 characters'),
    state: z.string().min(2, 'State is required'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    postalCode: z.string().min(3, 'Postal code is required').optional(),
    zipCode: z.string().min(3, 'Zip code is required'),
    country: z.string().min(2, 'Country is required'),
    phone: z.string().optional(),
  }),
});

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getTotal, getItemCount } = useCartStore();
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Convert cart items to order items format
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const order = await createOrderMutation.mutateAsync({
        items: orderItems,
        shippingAddress: data.shippingAddress,
        paymentMethod: 'simulated', // Simulated payment
      });

      // Note: useCreateOrder hook will clear cart automatically
      // Redirect to payment verification page (overrides hook's navigation)
      toast.success('Order created! Processing payment...');
      navigate(`/payment/verify/${order._id}`);
    } catch (error: unknown) {
      // Safely extract error message from various error shapes
      const err = error as unknown as { response?: { data?: { message?: string } } };
      const message =
        err?.response?.data?.message ??
        (error instanceof Error ? error.message : 'Failed to place order');
      toast.error(message);
    }
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Complete your order
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>Shipping Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name (Optional)</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      {...register('shippingAddress.fullName')}
                      disabled={isSubmitting}
                    />
                    {errors.shippingAddress?.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="123 Main St"
                      {...register('shippingAddress.street')}
                      disabled={isSubmitting}
                    />
                    {errors.shippingAddress?.street && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.street.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="California"
                      {...register('shippingAddress.state')}
                      disabled={isSubmitting}
                    />
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-destructive">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        {...register('shippingAddress.city')}
                        disabled={isSubmitting}
                      />
                      {errors.shippingAddress?.city && (
                        <p className="text-sm text-destructive">
                          {errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        {...register('shippingAddress.zipCode')}
                        disabled={isSubmitting}
                      />
                      {errors.shippingAddress?.zipCode && (
                        <p className="text-sm text-destructive">
                          {errors.shippingAddress.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        {...register('shippingAddress.country')}
                        disabled={isSubmitting}
                      />
                      {errors.shippingAddress?.country && (
                        <p className="text-sm text-destructive">
                          {errors.shippingAddress.country.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        {...register('shippingAddress.phone')}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information (Placeholder) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle>Payment Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
                    Payment processing will be implemented in production.
                    <br />
                    For now, orders are placed without payment.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <CardTitle>Order Summary</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product._id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({itemCount} items)
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

                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
