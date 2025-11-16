import { useNavigate } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { PageTransition } from '@/components/common/PageTransition';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { formatPrice, formatDate } from '@/lib/utils/formatters';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' as const },
  processing: { label: 'Processing', icon: Package, variant: 'default' as const },
  shipped: { label: 'Shipped', icon: Truck, variant: 'default' as const },
  delivered: { label: 'Delivered', icon: CheckCircle, variant: 'default' as const },
  cancelled: { label: 'Cancelled', icon: XCircle, variant: 'destructive' as const },
};

export function OrdersPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useOrders();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-20">
          <LoadingSpinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">View and track your orders</p>
          </div>

          <EmptyState
            title="No orders yet"
            description="Start shopping to see your orders here"
            icon={<Package className="h-10 w-10 text-muted-foreground" />}
            action={
              <Button onClick={() => navigate('/products')}>Start Shopping</Button>
            }
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            {data.metadata.total} {data.metadata.total === 1 ? 'order' : 'orders'}
          </p>
        </div>

        <div className="space-y-4">
          {data.data.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;

            return (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order._id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge variant={config.variant}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://via.placeholder.com/40'}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 3} more item(s)
                        </p>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-1">Shipping Address</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.fullName}
                        <br />
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        <br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
