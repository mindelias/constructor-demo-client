import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductSearch } from '@/features/products/components/ProductSearch';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: searchParams.get('sortBy') as any || 'newest',
    inStock: searchParams.get('inStock') === 'true' || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const { data, isLoading, error, refetch } = useProducts(filters);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            {data?.metadata.total
              ? `Discover our collection of ${data.metadata.total} products`
              : 'Discover our collection'}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mb-8">
          <ProductSearch />

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <ProductFilters onClose={() => setIsFilterOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <EmptyState
            title="Failed to load products"
            description="Please try again later"
            action={<Button onClick={() => refetch()}>Retry</Button>}
          />
        )}

        {/* Products Grid */}
        {data && (
          <>
            {data.data.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search term"
              />
            ) : (
              <ProductGrid products={data.data} />
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
