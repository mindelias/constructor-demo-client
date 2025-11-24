import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api/axios';
import { getSocket, connectSocket, initializeSocket } from '@/lib/api/socket';
import { toast } from 'sonner';

type PaymentStatus = 'verifying' | 'success' | 'failed';

export function PaymentVerifyPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    if (!orderId) return;

    // Initialize Socket.IO
    const token = localStorage.getItem('auth_token') || undefined;
    initializeSocket(token);
    connectSocket();

    const socket = getSocket();

    if (!socket) {
      setStatus('failed');
      setMessage('Connection error. Please try again.');
      return;
    }

    // Subscribe to order updates
    socket.emit('subscribe:order', orderId);

    // Listen for order updates
    const handleOrderUpdate = (data: any) => {
      console.log('📨 Payment update received:', data);

      if (data.paymentStatus === 'completed') {
        setStatus('success');
        setMessage('Payment successful!');
        toast.success('Payment confirmed!');

        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate(`/orders/${orderId}`);
        }, 2000);
      } else if (data.paymentStatus === 'failed') {
        setStatus('failed');
        setMessage('Payment failed. Please try again.');
        toast.error('Payment failed');
      }
    };

    socket.on(`order:${orderId}:updated`, handleOrderUpdate);

    // Trigger simulated payment
    const simulatePayment = async () => {
      try {
        await api.patch(`/orders/${orderId}/payment`, {
          success: true, // Can set to false to test failures
        });
      } catch (error) {
        console.error('Payment simulation error:', error);
        setStatus('failed');
        setMessage('Failed to process payment');
      }
    };

    // Simulate payment after 1 second
    const timer = setTimeout(() => {
      simulatePayment();
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      socket.off(`order:${orderId}:updated`, handleOrderUpdate);
      socket.emit('unsubscribe:order', orderId);
    };
  }, [orderId, navigate]);

  return (
    <MainLayout>
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Payment Verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            {/* Status Icon */}
            {status === 'verifying' && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
            {status === 'failed' && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}

            {/* Status Message */}
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {status === 'verifying' && 'Processing Payment'}
                {status === 'success' && 'Payment Successful'}
                {status === 'failed' && 'Payment Failed'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            </div>

            {/* Demo Notice */}
            {status === 'verifying' && (
              <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium">Demo Mode</p>
                <p className="text-xs mt-1">
                  Simulating payment gateway webhook (2-3s delay)
                </p>
              </div>
            )}

            {/* Actions */}
            {status === 'success' && (
              <Button onClick={() => navigate(`/orders/${orderId}`)}>
                View Order
              </Button>
            )}
            {status === 'failed' && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/cart')}>
                  Back to Cart
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
