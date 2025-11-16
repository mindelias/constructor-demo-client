import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';

export function ProductsPage() {
  const { data, isLoading, error, refetch } = useProducts();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            {data?.metadata.total ? `Discover our collection of ${data.metadata.total} products` : 'Discover our collection'}
          </p>
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
            action={
              <Button onClick={() => refetch()}>Retry</Button>
            }
          />
        )}

        {/* Products Grid */}
        {data && (
          <>
            {data.data.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Check back later for new products"
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
