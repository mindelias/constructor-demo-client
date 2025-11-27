import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/features/products/components/ProductSkeleton';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategories } from '@/features/products/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import type { ProductFilters as Filters } from '@/types/api.types';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 12,
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
  });

  // Debounce search to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300);

  // Fetch products and categories
  const { data: productsData, isLoading, error } = useProducts(debouncedFilters);
  const { data: categories } = useCategories();

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sort) params.set('sort', filters.sort);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="mt-2 text-muted-foreground">
              {productsData
                ? `${productsData.metadata.total} products found`
                : 'Browse our collection'}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  categories={categories}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          </aside>

          {/* Products Grid */}
          <div>
            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
                <p className="font-semibold">Error loading products</p>
                <p className="text-sm">{(error instanceof Error ? error.message : 'Please try again later')}</p>
              </div>
            )}

            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ProductGridSkeleton count={12} />
              </div>
            )}

            {!isLoading && productsData && productsData.data.length === 0 && (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-lg font-semibold">No products found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}

            {!isLoading && productsData && productsData.data.length > 0 && (
              <>
                {/* Products Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productsData.data.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {productsData.metadata.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(filters.page! - 1)}
                      disabled={filters.page === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: productsData.metadata.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          const current = filters.page || 1;
                          return (
                            page === 1 ||
                            page === productsData.metadata.totalPages ||
                            (page >= current - 1 && page <= current + 1)
                          );
                        })
                        .map((page, index, array) => {
                          const prevPage = array[index - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;

                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={page === filters.page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="min-w-[40px]"
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(filters.page! + 1)}
                      disabled={filters.page === productsData.metadata.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
