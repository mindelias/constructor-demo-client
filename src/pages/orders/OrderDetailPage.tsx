import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  XCircle,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { useOrder } from '@/features/orders/hooks/useOrder';
import { formatPrice } from '@/lib/utils';
import { queryKeys } from '@/lib/api/queryClient';
import {
  subscribeToOrderUpdates,
  unsubscribeFromOrderUpdates,
  connectSocket,
} from '@/lib/api/socket';
import { toast } from 'sonner';
import type { OrderStatus } from '@/types/api.types';

const statusIcons: Record<OrderStatus, any> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: Home,
  cancelled: XCircle,
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'text-yellow-600',
  processing: 'text-blue-600',
  shipped: 'text-purple-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useOrder(id!);

  // Set up real-time order updates via Socket.IO
  useEffect(() => {
    if (!id) return;

    // Connect socket
    connectSocket();

    // Subscribe to order updates
    const handleOrderUpdate = (data: any) => {
      toast.info(`Order status updated to: ${data.status}`);

      // Invalidate query to refetch order
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    };

    subscribeToOrderUpdates(id, handleOrderUpdate);

    // Cleanup
    return () => {
      unsubscribeFromOrderUpdates(id, handleOrderUpdate);
    };
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Skeleton className="mb-6 h-10 w-32" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <p className="mb-4 text-lg font-semibold text-destructive">
                Order not found
              </p>
              <Button onClick={() => navigate('/orders')}>
                Back to Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-primary">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p className="mt-2 text-muted-foreground">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.country}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2 text-muted-foreground">
                      Phone: {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.statusHistory
                    .slice()
                    .reverse()
                    .map((history, index) => {
                      const Icon = statusIcons[history.status];
                      const color = statusColors[history.status];

                      return (
                        <div key={index} className="flex gap-4">
                          <div className={`flex-shrink-0 ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold capitalize">
                              {history.status}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(history.timestamp).toLocaleString()}
                            </p>
                            {history.note && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {history.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatPrice(order.tax)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {formatPrice(order.shippingCost)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Real-time updates enabled
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
