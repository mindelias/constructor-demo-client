# 💳 Payment Simulation Implementation Guide

## Overview

This guide implements a **realistic payment simulation** that mimics Paystack/Stripe flow:
- Order created with `pending` payment status
- User redirected to simulated payment page
- Backend auto-confirms payment after delay (simulating webhook)
- Socket.IO pushes real-time update to frontend
- **No polling! Pure real-time updates!**

---

## 🎯 Architecture

```
Frontend              Backend               Socket.IO
   │                     │                     │
   │  1. Place Order     │                     │
   ├────────────────────>│                     │
   │  Status: pending    │                     │
   │  paymentStatus: pending                   │
   │<────────────────────┤                     │
   │                     │                     │
   │  2. Redirect to     │                     │
   │  /payment/:orderId  │                     │
   │                     │                     │
   │  3. User clicks     │                     │
   │  "Confirm Payment"  │                     │
   ├────────────────────>│                     │
   │                     │                     │
   │                     │  4. Simulate webhook│
   │                     │  (2-3s delay)       │
   │                     │                     │
   │                     │  5. Update order    │
   │                     │  paymentStatus:     │
   │                     │  'completed'        │
   │                     │                     │
   │                     │  6. Emit Socket event
   │                     ├────────────────────>│
   │                     │                     │
   │  7. Real-time update via WebSocket        │
   │<──────────────────────────────────────────┤
   │  Toast: "Payment successful!"             │
   │  Navigate to /orders/:id                  │
   │                     │                     │
```

---

## 📦 Backend Implementation

### 1. Update Order Model

```javascript
// backend/models/Order.js
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery', 'simulated'],
    default: 'simulated',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
    unique: true,
    sparse: true,
  },
  paidAt: Date,
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
  }],
}, {
  timestamps: true,
});

// Initialize statusHistory on creation
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.statusHistory.length) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order placed',
    }];
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

---

### 2. Update Order Creation Endpoint

```javascript
// backend/controllers/orderController.js
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }
      totalAmount += product.price * item.quantity;
    }

    // Generate unique payment reference
    const paymentReference = `PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || 'simulated',
      paymentStatus: 'pending',
      paymentReference,
      status: 'pending',
    });

    // Populate product details
    await order.populate('items.productId');

    res.status(201).json({
      success: true,
      data: order,
      paymentReference,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

### 3. Add Payment Simulation Endpoint

```javascript
// backend/controllers/orderController.js

exports.simulatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { success = true } = req.body; // Allow simulating failures

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if already paid
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed',
      });
    }

    // Simulate webhook delay (2 seconds)
    setTimeout(async () => {
      try {
        if (success) {
          // Update order
          order.paymentStatus = 'completed';
          order.status = 'processing';
          order.paidAt = new Date();
          order.statusHistory.push({
            status: 'processing',
            timestamp: new Date(),
            note: 'Payment confirmed (simulated)',
          });
          await order.save();

          // ✨ Emit Socket.IO event
          const io = req.app.get('io');
          io.to(`order_${order._id}`).emit('order:updated', {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            message: 'Payment confirmed!',
            timestamp: new Date(),
          });

          console.log(`✅ Payment simulated for order ${order._id}`);
        } else {
          // Simulate payment failure
          order.paymentStatus = 'failed';
          order.statusHistory.push({
            status: 'pending',
            timestamp: new Date(),
            note: 'Payment failed (simulated)',
          });
          await order.save();

          // Emit failure event
          const io = req.app.get('io');
          io.to(`order_${order._id}`).emit('order:updated', {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            message: 'Payment failed. Please try again.',
            timestamp: new Date(),
          });

          console.log(`❌ Payment failed for order ${order._id}`);
        }
      } catch (error) {
        console.error('Simulated webhook error:', error);
      }
    }, 2000); // 2-second delay simulates webhook

    // Respond immediately (like real webhook)
    res.json({
      success: true,
      message: 'Payment processing...',
    });
  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

### 4. Add Routes

```javascript
// backend/routes/orders.js
router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.patch('/:id/payment', protect, orderController.simulatePayment); // New
```

---

### 5. Ensure Socket.IO is Set Up

```javascript
// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Make io accessible in controllers
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Join order-specific room
  socket.on('subscribe:order', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`📦 Client subscribed to order: ${orderId}`);
  });

  socket.on('unsubscribe:order', (orderId) => {
    socket.leave(`order_${orderId}`);
    console.log(`📦 Client unsubscribed from order: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 🎨 Frontend Implementation

### 1. Create Payment Verification Page

```tsx
// src/pages/PaymentVerifyPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/axios';
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
    const token = localStorage.getItem('auth_token');
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
        await apiClient.patch(`/orders/${orderId}/payment`, {
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
```

---

### 2. Update Checkout Page

```tsx
// src/pages/checkout/CheckoutPage.tsx - Update onSubmit

const onSubmit = async (data: CheckoutFormData) => {
  try {
    const orderItems = items.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    const response = await createOrderMutation.mutateAsync({
      items: orderItems,
      shippingAddress: data.shippingAddress,
      paymentMethod: 'simulated', // or data.paymentMethod if you have selection
    });

    // Clear cart
    clearCart();

    // Redirect to payment verification page
    toast.success('Order created! Processing payment...');
    navigate(`/payment/verify/${response.data._id}`);
  } catch (error: unknown) {
    const err = error as unknown as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message ??
      (error instanceof Error ? error.message : 'Failed to place order');
    toast.error(message);
  }
};
```

---

### 3. Add Route

```tsx
// src/app/router.tsx
import { PaymentVerifyPage } from '@/pages/PaymentVerifyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      // ... existing routes
      {
        path: 'payment/verify/:orderId',
        element: (
          <ProtectedRoute>
            <PaymentVerifyPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

---

### 4. Ensure Socket.IO Connects on Order Detail Page

```tsx
// src/pages/orders/OrderDetailPage.tsx - Already implemented!
// Just make sure Socket.IO is initialized

useEffect(() => {
  const token = localStorage.getItem('auth_token');
  initializeSocket(token);
  connectSocket();

  const socket = getSocket();
  if (!socket || !id) return;

  const handleUpdate = (data: OrderUpdateEvent) => {
    queryClient.invalidateQueries({ queryKey: ['order', id] });
    toast.success(data.message);
  };

  subscribeToOrderUpdates(id, handleUpdate);

  return () => {
    unsubscribeFromOrderUpdates(id, handleUpdate);
  };
}, [id]);
```

---

## 🧪 Testing the Simulation

### Test Success Flow
```bash
# 1. Add items to cart
# 2. Go to checkout
# 3. Fill shipping form
# 4. Click "Place Order"
# Expected: Redirect to /payment/verify/:orderId
# Expected: See "Processing Payment..." spinner
# Expected: After 2 seconds, status changes to "Success"
# Expected: Toast notification appears
# Expected: Auto-redirect to /orders/:orderId
# Expected: Order status is "processing"
# Expected: Payment status is "completed"
```

### Test Failure Flow
```javascript
// In PaymentVerifyPage.tsx, change:
success: false  // Simulate payment failure

// Expected: Status changes to "Failed"
// Expected: Shows retry button
```

---

## 🎯 Summary

### ✅ What We've Built
1. **Backend webhook simulation** - Auto-confirms payment after 2s delay
2. **Socket.IO real-time updates** - No polling!
3. **Payment verification page** - Shows processing → success/failure
4. **Order status tracking** - Updates in real-time
5. **Realistic flow** - Mimics Paystack/Stripe exactly

### 🚀 How It Works
1. User places order → `paymentStatus: 'pending'`
2. Redirected to `/payment/verify/:orderId`
3. Frontend subscribes to Socket.IO updates
4. Backend simulates webhook (2s delay)
5. Backend updates order → emits Socket.IO event
6. Frontend receives update in real-time
7. Shows success → auto-redirects to order page

### 💡 Why This is Better Than Polling
- ✅ **Instant updates** (no 1-minute delay)
- ✅ **No unnecessary API calls** (polling wastes resources)
- ✅ **Scalable** (WebSocket connections are cheap)
- ✅ **Real-time** (exactly like real payment gateways)

---

Ready to implement? I can create all the files for you! 🚀
