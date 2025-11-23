import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/api.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<OrderStatus, { variant: any; label: string }> = {
    pending: {
      variant: 'secondary',
      label: 'Pending',
    },
    processing: {
      variant: 'default',
      label: 'Processing',
    },
    shipped: {
      variant: 'default',
      label: 'Shipped',
    },
    delivered: {
      variant: 'default',
      label: 'Delivered',
    },
    cancelled: {
      variant: 'destructive',
      label: 'Cancelled',
    },
  };

  const { variant, label } = variants[status] || variants.pending;

  return <Badge variant={variant}>{label}</Badge>;
}
