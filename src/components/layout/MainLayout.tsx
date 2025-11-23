import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main Layout Component
 * Wraps all pages with header, footer, and mobile navigation
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MobileNav />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
