import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useNavigate } from 'react-router-dom';

export function CartIcon() {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate('/cart')}
      className="relative h-9 w-9"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}
