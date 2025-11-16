import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/common/PageTransition';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function HomePage() {
  const navigate = useNavigate();
  const { data, isLoading } = useProducts({ limit: 8 });

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: Star,
      title: 'Quality Products',
      description: 'Curated selection',
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Discover Amazing Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Shop the latest trends with confidence. Quality products, great prices, fast
              delivery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" onClick={() => navigate('/products')}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Check out our latest arrivals</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/products')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            data?.data && <ProductGrid products={data.data} />
          )}
        </div>
      </section>
    </PageTransition>
  );
}
