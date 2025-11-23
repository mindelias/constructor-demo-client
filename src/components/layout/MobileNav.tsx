import { Link } from 'react-router-dom';
import { Home, Package } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUIStore } from '@/store/uiStore';

export function MobileNav() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col space-y-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeMenu}
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Package className="mr-3 h-5 w-5" />
            Products
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
