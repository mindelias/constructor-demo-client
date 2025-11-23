import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />

      <CardContent className="p-4">
        {/* Category Skeleton */}
        <Skeleton className="mb-2 h-3 w-16" />

        {/* Title Skeleton */}
        <Skeleton className="mb-2 h-6 w-3/4" />

        {/* Rating Skeleton */}
        <Skeleton className="mb-2 h-4 w-24" />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        {/* Price Skeleton */}
        <Skeleton className="h-8 w-20" />

        {/* Button Skeleton */}
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </>
  );
}
