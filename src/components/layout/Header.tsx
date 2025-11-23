import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CartIcon } from '@/components/common/CartIcon';
import { UserMenu } from '@/components/common/UserMenu';
import { useUIStore } from '@/store/uiStore';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-lg font-bold">C</span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            Constructor Demo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6">
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="mr-1.5 h-4 w-4" />
            Home
          </Link>
          <Link
            to="/products"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Package className="mr-1.5 h-4 w-4" />
            Products
          </Link>
        </nav>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 md:flex md:max-w-sm"
        >
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <CartIcon />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
