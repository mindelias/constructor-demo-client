# Complete Payment & WebSocket Testing Guide

## You've Just Created an Order - Now What?

Follow these steps to test the payment simulation and WebSocket real-time updates.

---

## Step-by-Step Testing Instructions

### Step 1: Open Browser DevTools FIRST

**Before navigating to the payment page**, open DevTools:

1. **Press `F12`** or **Right-click → Inspect**
2. **Go to Console tab**
3. **Clear the console** (click the 🚫 icon or press Ctrl+L)

### Step 2: Navigate to Payment Verification Page

Your order was just created. You have two options:

**Option A: If CheckoutPage auto-redirects (recommended setup):**
- After clicking "Place Order", you should automatically be redirected to `/payment/verify/{orderId}`
- The payment page should load immediately

**Option B: If you need to navigate manually:**
- Copy the order ID from your order creation response
- Go to: `http://localhost:5173/payment/verify/{orderId}`
- Replace `{orderId}` with your actual order ID (e.g., `69270eca22a3412236301b0c`)

### Step 3: Watch the Console (This is Important!)

You should see logs appearing in this order:

#### **Immediately when page loads:**
```
🔧 Payment Verification Started
📦 Order ID: 69270eca22a3412236301b0c
🔑 Auth Token: ✅ Present
✅ Socket initialized
🆔 Socket ID: vJ3x7-KqP9aL2nM8AAAB
🔌 Socket connected: true
📡 Subscribed to order updates for: 69270eca22a3412236301b0c
👂 Listening for event: order:69270eca22a3412236301b0c:updated
```

#### **After ~1 second (payment API call):**
```
💳 Triggering payment simulation...
🌐 API Call: PATCH /orders/69270eca22a3412236301b0c/payment
✅ Payment API call successful: { success: true, message: 'Payment processing...' }
⏳ Waiting for WebSocket update (should arrive in ~2 seconds)...
```

#### **After ~2-3 seconds total (WebSocket event arrives):**
```
📬 Socket Event: order:69270eca22a3412236301b0c:updated [{...}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PAYMENT UPDATE RECEIVED!
📨 Data: {
  "orderId": "69270eca22a3412236301b0c",
  "status": "processing",
  "paymentStatus": "completed",
  "message": "Payment confirmed!",
  "timestamp": "2025-11-26T14:35:00.000Z"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Payment completed successfully
🔄 Redirecting to order page...
```

### Step 4: Watch the UI

While the console logs appear, you'll see the UI change:

1. **Spinner animation** (blue loading circle) → "Processing Payment"
2. **Green checkmark** appears → "Payment Successful"
3. **Toast notification** pops up → "Payment confirmed!"
4. **Auto-redirect** after 2 seconds → Order detail page

### Step 5: Verify on Order Detail Page

After redirect, check the order detail page:

- Order status should be **"Processing"** (changed from "Pending")
- Payment status should be **"Completed"**
- Status history should show two entries:
  - "Order placed" (when created)
  - "Payment confirmed (simulated)" (just now)

---

## What You're Actually Testing

### 1. **Socket.IO Connection** ✅
- Frontend connects to backend WebSocket
- Receives unique Socket ID
- Maintains persistent connection

### 2. **Room Subscription** ✅
- Frontend subscribes to order-specific room
- Backend knows to send updates to this connection

### 3. **Payment Simulation** ✅
- API call triggers payment processing
- Backend simulates 2-second webhook delay (like real payment gateways)
- Backend updates database

### 4. **Real-time Updates** ✅
- Backend emits Socket.IO event after payment completes
- Frontend receives event instantly (no polling!)
- UI updates without page refresh

---

## Expected Timeline

```
T=0s    → Page loads
        → Socket connects
        → Subscribe to room

T=1s    → Trigger payment API call
        → Backend receives request
        → Backend returns "processing..." immediately

T=3s    → Backend webhook simulation completes
        → Backend updates order in database
        → Backend emits Socket.IO event
        → Frontend receives event
        → UI shows success

T=5s    → Auto-redirect to order page
```

**Total time: ~5 seconds from page load to redirect**

---

## Monitoring WebSocket in Network Tab

### Step 1: Go to Network Tab

1. DevTools → **Network** tab
2. Filter by **WS** (WebSocket)

### Step 2: Find Socket.IO Connection

You should see:
- Name: `socket.io/?EIO=4&transport=websocket&token=...`
- Status: **101 Switching Protocols** (green)
- Type: `websocket`

### Step 3: View Messages

Click on the WebSocket connection → **Messages** sub-tab

You'll see Socket.IO frames:

```
⬆️ 2                    (client ping)
⬇️ 3                    (server pong)
⬆️ 42["subscribe:order","69270eca22a3412236301b0c"]
⬇️ 42["order:69270eca22a3412236301b0c:updated",{...}]
```

**Decoding:**
- `2` / `3` = Ping/pong (heartbeat)
- `42[...]` = Socket.IO event with data

---

## Testing Failure Scenario

Want to test payment failure? Update the API call:

**File: `src/pages/PaymentVerifyPage.tsx`**

Change line 90:
```typescript
// From:
success: true,

// To:
success: false,  // ✅ Test payment failure
```

**Expected behavior:**
- API call still succeeds
- After 2 seconds, WebSocket event arrives with `paymentStatus: 'failed'`
- UI shows red X icon
- Toast shows "Payment failed"
- Buttons appear: "Back to Cart" and "Retry Payment"

---

## Testing with Backend Logs

### Enable Backend Logging

In your backend `simulatePayment` controller, you should have logs:

```typescript
export const simulatePayment = async (req: AuthRequest, res: Response) => {
  console.log('💳 Payment simulation requested for order:', id);

  setTimeout(async () => {
    console.log('📡 Emitting Socket.IO event to room: order_' + order._id);

    io.to(`order_${order._id}`).emit('order:updated', {
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      message: 'Payment confirmed!',
      timestamp: new Date(),
    });

    console.log('✅ Event emitted successfully');
  }, 2000);
};
```

### Watch Both Consoles

**Terminal (Backend logs):**
```
💳 Payment simulation requested for order: 69270eca22a3412236301b0c
📡 Emitting Socket.IO event to room: order_69270eca22a3412236301b0c
✅ Event emitted successfully
```

**Browser Console (Frontend logs):**
```
💳 Triggering payment simulation...
⏳ Waiting for WebSocket update...
🎯 PAYMENT UPDATE RECEIVED!
✅ Payment completed successfully
```

**They should match up!** Backend emits → Frontend receives

---

## Common Issues & Solutions

### Issue: No WebSocket Event Received

**Symptoms:**
- Payment API call succeeds
- Console shows "⏳ Waiting for WebSocket update..."
- But no "🎯 PAYMENT UPDATE RECEIVED!" appears
- Spinner keeps spinning forever

**Causes & Fixes:**

1. **Backend not emitting event**
   - Check backend console logs
   - Verify `io.to('order_' + orderId).emit(...)` is called
   - Verify `io` instance is available: `req.app.get('io')`

2. **Wrong room name**
   - Backend emits to: `order_${orderId}`
   - Frontend listens to: `order:${orderId}:updated`
   - Event name must match EXACTLY (including colons)

3. **Socket not connected**
   - Check console for "🔌 Socket connected: false"
   - Verify backend Socket.IO server is running
   - Check CORS settings in backend

### Issue: Socket Connection Failed

**Symptoms:**
- Console shows "❌ Socket connection failed"
- Page shows "Connection error. Please try again."

**Fixes:**

1. **Check backend is running**
   ```bash
   # Should see:
   Server running on http://localhost:5000
   Socket.IO initialized
   ```

2. **Verify Socket.IO URL in frontend**

   **File: `src/lib/api/socket.ts`**
   ```typescript
   const socket = io('http://localhost:5000', {  // ✅ Check this URL
     auth: { token },
     transports: ['websocket', 'polling'],
   });
   ```

3. **Check CORS on backend**
   ```typescript
   const io = new Server(server, {
     cors: {
       origin: 'http://localhost:5173',  // Your frontend URL
       credentials: true,
     },
   });
   ```

### Issue: Auth Token Missing

**Symptoms:**
- Console shows "🔑 Auth Token: ❌ Missing"
- Socket connects but events may not work

**Fix:**
- Login first through the frontend
- Token is stored in localStorage after successful login
- Create order while logged in

---

## Quick Verification Checklist

Before testing, make sure:

- [ ] Backend server is running (`npm run dev`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] You're logged in (have auth token in localStorage)
- [ ] DevTools Console is open BEFORE navigating to payment page
- [ ] You've just created an order and have the order ID

**Then:**

1. Navigate to `/payment/verify/{orderId}`
2. Watch console logs appear in sequence
3. Watch UI change from spinner → checkmark
4. Verify auto-redirect after 2 seconds
5. Check order detail page shows updated status

---

## Success Criteria

You'll know it's working when:

✅ Console shows all expected logs in sequence
✅ Socket connects and receives unique ID
✅ Payment API call succeeds
✅ WebSocket event arrives ~2 seconds later
✅ UI updates from spinner to checkmark
✅ Toast notification appears
✅ Page auto-redirects to order detail
✅ Order status changed from "Pending" to "Processing"
✅ Payment status is "Completed"
✅ Status history shows payment confirmation

---

## What You Just Built

This is **exactly how real payment gateways work**:

1. **Initiate Payment** → API call to payment gateway
2. **Immediate Response** → "Processing..." (not completed yet)
3. **Webhook Callback** → Payment gateway calls your backend when done (2-30 seconds later)
4. **Real-time Update** → Socket.IO notifies user instantly
5. **No Polling** → User sees update without refreshing

**Payment Gateways that work this way:**
- Stripe
- Paystack
- Flutterwave
- PayPal
- Razorpay

You've built a production-ready payment flow simulation!

---

## Next Steps

After successful testing:

1. **Test failure scenario** (set `success: false`)
2. **Test with multiple browser tabs** - open same order in 2 tabs, both should update
3. **Test status updates** - Update order status via API, watch it update in real-time
4. **Remove debug logs** - Clean up console.log statements before production
5. **Add error boundaries** - Handle edge cases gracefully

Enjoy your real-time payment system! 🎉
