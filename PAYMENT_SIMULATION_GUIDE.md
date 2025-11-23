# 💳 Payment Gateway Simulation Guide

## Overview

This document outlines how to simulate payment gateway functionality for the e-commerce application without integrating actual payment processors (Stripe, PayPal, etc.).

---

## 🎯 Current Status

### What's Implemented
- ✅ Checkout page with shipping form
- ✅ Order creation API integration
- ✅ Payment placeholder section in checkout
- ✅ Order type supports `paymentMethod` and `paymentStatus` fields

### What's Missing
- ❌ Payment method selection UI
- ❌ Payment processing logic
- ❌ Payment status tracking
- ❌ Payment confirmation screen

---

## 🛠️ Recommended Implementation

### Option 1: Simple Payment Method Selection (Recommended for Demo)

**Add to CheckoutPage:**

1. **Payment Method Radio Buttons**
   ```tsx
   // In CheckoutPage.tsx, add to schema:
   const checkoutSchema = z.object({
     shippingAddress: z.object({...}),
     paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery'], {
       required_error: 'Please select a payment method',
     }),
   });
   ```

2. **UI Component**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle className="flex items-center gap-2">
         <CreditCard className="h-5 w-5" />
         Payment Method
       </CardTitle>
     </CardHeader>
     <CardContent className="space-y-3">
       <div className="space-y-3">
         {/* Credit Card Option */}
         <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-muted">
           <input
             type="radio"
             value="credit_card"
             {...register('paymentMethod')}
           />
           <CreditCard className="h-5 w-5" />
           <div className="flex-1">
             <p className="font-medium">Credit / Debit Card</p>
             <p className="text-sm text-muted-foreground">
               Visa, Mastercard, AmEx
             </p>
           </div>
         </label>

         {/* PayPal Option */}
         <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-muted">
           <input
             type="radio"
             value="paypal"
             {...register('paymentMethod')}
           />
           <Wallet className="h-5 w-5" />
           <div className="flex-1">
             <p className="font-medium">PayPal</p>
             <p className="text-sm text-muted-foreground">
               Pay with PayPal account
             </p>
           </div>
         </label>

         {/* Cash on Delivery */}
         <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-muted">
           <input
             type="radio"
             value="cash_on_delivery"
             {...register('paymentMethod')}
           />
           <Banknote className="h-5 w-5" />
           <div className="flex-1">
             <p className="font-medium">Cash on Delivery</p>
             <p className="text-sm text-muted-foreground">
               Pay when you receive
             </p>
           </div>
         </label>
       </div>

       {/* Show validation error */}
       {errors.paymentMethod && (
         <p className="text-sm text-destructive">
           {errors.paymentMethod.message}
         </p>
       )}

       {/* Demo Notice */}
       <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-900 dark:text-blue-100">
         <p className="font-medium">Demo Mode</p>
         <p className="text-xs mt-1">
           No actual payment will be processed. This is for demonstration purposes only.
         </p>
       </div>
     </CardContent>
   </Card>
   ```

3. **Update Order Creation**
   ```tsx
   const onSubmit = async (data: CheckoutFormData) => {
     try {
       const orderItems = items.map((item) => ({
         productId: item.product._id,
         quantity: item.quantity,
       }));

       await createOrderMutation.mutateAsync({
         items: orderItems,
         shippingAddress: data.shippingAddress,
         paymentMethod: data.paymentMethod, // ✅ Include payment method
       });

       toast.success('Order placed successfully!');
     } catch (error) {
       toast.error('Failed to place order');
     }
   };
   ```

---

### Option 2: Mock Payment Processing Flow

**Simulate credit card payment:**

1. **Add Credit Card Form (Conditional Rendering)**
   ```tsx
   {selectedPaymentMethod === 'credit_card' && (
     <div className="space-y-4 mt-4">
       <div className="space-y-2">
         <Label>Card Number</Label>
         <Input
           placeholder="1234 5678 9012 3456"
           maxLength={19}
           disabled={isSubmitting}
         />
       </div>

       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label>Expiry Date</Label>
           <Input
             placeholder="MM/YY"
             maxLength={5}
             disabled={isSubmitting}
           />
         </div>

         <div className="space-y-2">
           <Label>CVV</Label>
           <Input
             placeholder="123"
             maxLength={3}
             type="password"
             disabled={isSubmitting}
           />
         </div>
       </div>

       <p className="text-xs text-muted-foreground">
         💡 Use any test card number (e.g., 4242 4242 4242 4242) - no validation
       </p>
     </div>
   )}
   ```

2. **Simulate Processing Delay**
   ```tsx
   const onSubmit = async (data: CheckoutFormData) => {
     try {
       // Show "processing payment" state
       setIsProcessing(true);

       // Simulate payment processing delay
       if (data.paymentMethod === 'credit_card') {
         await new Promise(resolve => setTimeout(resolve, 2000));
         toast.info('Processing payment...');
       }

       // Create order
       await createOrderMutation.mutateAsync({
         items: orderItems,
         shippingAddress: data.shippingAddress,
         paymentMethod: data.paymentMethod,
       });

       toast.success('Payment successful! Order placed.');
     } catch (error) {
       toast.error('Payment failed. Please try again.');
     } finally {
       setIsProcessing(false);
     }
   };
   ```

---

### Option 3: Full Payment Confirmation Flow

**Create separate payment confirmation page:**

1. **Route:** `/checkout/payment/:orderId`
2. **Show:**
   - Order summary
   - Selected payment method
   - "Confirm Payment" button
   - Simulated payment processing animation
   - Success/failure message

**Flow:**
```
Checkout → Place Order → Navigate to /checkout/payment/:orderId
→ User clicks "Confirm Payment" → Simulate 2s delay → Update order status
→ Navigate to /orders/:orderId
```

---

## 🗄️ Backend Integration

### Update Backend Order Model

**Add payment fields to Order schema:**

```javascript
// In backend: models/Order.js
const orderSchema = new mongoose.Schema({
  // ... existing fields
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
    default: 'credit_card',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentDetails: {
    // For storing simulated payment info
    cardLast4: String,
    transactionId: String,
    paymentDate: Date,
  },
  // Add statusHistory for timeline
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
});

// Initialize statusHistory when order is created
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
```

### Update Order Creation API

```javascript
// In backend: controllers/orderController.js
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Calculate total
    const totalAmount = calculateTotal(items);

    const order = await Order.create({
      userId: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: 'pending', // Will be updated in payment simulation
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed',
      }],
    });

    // Populate product details
    await order.populate('items.productId');

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

### Add Payment Simulation Endpoint

```javascript
// Backend: routes/orders.js
router.patch('/:id/payment', protect, simulatePayment);

// Backend: controllers/orderController.js
exports.simulatePayment = async (req, res) => {
  try {
    const { success, cardLast4 } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Simulate payment processing
    if (success) {
      order.paymentStatus = 'completed';
      order.status = 'processing'; // Move to processing after payment
      order.paymentDetails = {
        cardLast4,
        transactionId: `DEMO-${Date.now()}`,
        paymentDate: new Date(),
      };
      order.statusHistory.push({
        status: 'processing',
        timestamp: new Date(),
        note: 'Payment received, order is being processed',
      });
    } else {
      order.paymentStatus = 'failed';
      order.statusHistory.push({
        status: 'pending',
        timestamp: new Date(),
        note: 'Payment failed',
      });
    }

    await order.save();

    // Emit Socket.IO event for real-time update
    io.to(`order_${order._id}`).emit('order:updated', {
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      message: success ? 'Payment successful' : 'Payment failed',
      timestamp: new Date(),
    });

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

## 📱 Frontend Implementation

### Update CheckoutFormData Type

```typescript
// src/types/api.types.ts
export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  // Optional for credit card simulation
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}
```

### Add Payment Simulation Hook

```typescript
// src/features/orders/hooks/useSimulatePayment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';

interface SimulatePaymentData {
  orderId: string;
  success: boolean;
  cardLast4?: string;
}

export function useSimulatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, success, cardLast4 }: SimulatePaymentData) => {
      const { data } = await apiClient.patch(`/orders/${orderId}/payment`, {
        success,
        cardLast4,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

---

## 🎨 UI Components Needed

### Payment Method Icons

```bash
# Add lucide-react icons
import {
  CreditCard,    # Credit/Debit cards
  Wallet,        # PayPal
  Banknote,      # Cash on Delivery
  Lock,          # Secure payment badge
  CheckCircle2,  # Payment success
  XCircle,       # Payment failed
} from 'lucide-react';
```

### Payment Status Badge

```tsx
// src/components/ui/payment-status-badge.tsx
export function PaymentStatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Payment Pending', variant: 'secondary', icon: Clock },
    completed: { label: 'Paid', variant: 'success', icon: CheckCircle2 },
    failed: { label: 'Payment Failed', variant: 'destructive', icon: XCircle },
  };

  const { label, variant, icon: Icon } = config[status] || config.pending;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
```

---

## 🔄 Complete User Flow

### Simple Flow (Recommended for Demo)
```
1. Add items to cart
2. Navigate to /checkout
3. Fill shipping form
4. Select payment method (radio button)
5. Click "Place Order"
6. Order created with paymentStatus: 'pending'
7. Redirect to /orders
8. (Optional) Later "complete" payment via admin panel
```

### Advanced Flow (More Realistic)
```
1. Add items to cart
2. Navigate to /checkout
3. Fill shipping form
4. Select payment method
5. If credit card:
   - Show card form (non-functional, demo only)
   - Enter fake card details
6. Click "Place Order"
7. Show "Processing payment..." animation (2s)
8. Call payment simulation API
9. Show success/failure message
10. Redirect to /orders/:id with payment status
```

---

## 🎯 Testing Checklist

### Payment Method Selection
- [ ] Can select credit card
- [ ] Can select PayPal
- [ ] Can select cash on delivery
- [ ] Validation error if no method selected
- [ ] Selected method saved in order

### Credit Card Simulation (if implemented)
- [ ] Card form only shows for credit card
- [ ] Can enter test card number
- [ ] Processing animation shows
- [ ] 2-second delay simulates processing
- [ ] Success message after processing
- [ ] Order created with payment details

### Order Display
- [ ] Payment method shown in order detail
- [ ] Payment status badge displays correctly
- [ ] Can see payment details (transaction ID, etc.)
- [ ] Status timeline includes payment events

### Edge Cases
- [ ] Cannot checkout with empty cart
- [ ] Cannot proceed without payment method
- [ ] Handles payment failure gracefully
- [ ] Can retry failed payment
- [ ] Cash on delivery doesn't show card form

---

## 🚀 Quick Start

### Minimal Implementation (5 minutes)

1. **Add payment method to form:**
   ```tsx
   // In CheckoutPage schema
   paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery'])
   ```

2. **Add radio buttons in Payment card section**

3. **Include in order creation:**
   ```tsx
   paymentMethod: data.paymentMethod
   ```

4. **Update backend to accept paymentMethod**

5. **Test:** Select payment method → Place order → Verify in database

---

## 💡 Recommendations

### For Demo/Testing (Fastest)
✅ **Use Option 1** - Simple payment method selection
- Minimal code changes
- No complex UI
- Works immediately
- Good for demos

### For More Realistic Demo
✅ **Use Option 2** - Mock payment with card form
- Shows payment UX
- Simulates processing
- Better user experience
- Still fast to implement

### For Production-Like Demo
✅ **Use Option 3** - Full payment confirmation flow
- Separate payment page
- Real-feeling payment flow
- Proper status tracking
- Best UX but more work

---

## 📊 Implementation Priority

1. **Phase 1** (Now): Simple payment method selection
2. **Phase 2** (Optional): Add payment status tracking
3. **Phase 3** (If needed): Full payment confirmation flow
4. **Phase 4** (Future): Actual Stripe/PayPal integration

---

## ⚠️ Important Notes

1. **Never store actual card data** - even in demo mode
2. **Always show "Demo Mode" notice** - make it clear no real payment
3. **Don't validate card numbers** - use fake data
4. **Payment status** should be "pending" until simulated payment
5. **Use environment variables** for payment mode (demo vs real)

---

## 🔗 Related Documentation

- `TESTING.md` - Test all payment scenarios
- `ISSUES_AND_IMPROVEMENTS.md` - Known payment limitations
- Backend API docs - Payment endpoints

---

**Current Status:** Payment method field added to types, ready for UI implementation
**Recommended Next Step:** Implement Option 1 (Simple payment method selection)
