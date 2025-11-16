import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { CartDrawer } from '@/features/cart/components/CartDrawer';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  );
}
