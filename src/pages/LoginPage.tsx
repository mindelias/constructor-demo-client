import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { PageTransition } from '@/components/common/PageTransition';
import { APP_NAME } from '@/lib/utils/constants';

export function LoginPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{APP_NAME}</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Login to your account to continue shopping</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
