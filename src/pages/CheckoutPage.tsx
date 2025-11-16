import { CreditCard } from 'lucide-react';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent } from '@/components/ui/card';

export function CheckoutPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center py-20">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Checkout Coming Soon</h3>
              <p className="text-muted-foreground">
                The checkout feature is currently under development
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
