import { Package } from 'lucide-react';
import { PageTransition } from '@/components/common/PageTransition';
import { EmptyState } from '@/components/common/EmptyState';

export function OrdersPage() {
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
        />
      </div>
    </PageTransition>
  );
}
