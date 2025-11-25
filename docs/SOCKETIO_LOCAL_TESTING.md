# Testing Socket.IO Locally - Practical Guide

## Question: Can I Test Socket.IO in Postman?

**Short answer:** ⚠️ Postman has limited WebSocket support. For local testing, **use your browser DevTools instead** - it's easier and more reliable.

---

## Best Methods for Local Testing

### Method 1: Browser DevTools Console (Easiest) ✅

This is the **best way** to test Socket.IO during local development.

#### Step 1: Add Debug Logging to Frontend

**File: `src/pages/PaymentVerifyPage.tsx`**

Add this at the top of your component:

```typescript
useEffect(() => {
  const socket = getSocket();

  // Debug: Log connection status
  console.log('🔌 Socket Connected:', socket.connected);
  console.log('🆔 Socket ID:', socket.id);
  console.log('📡 Subscribing to: order:' + orderId + ':updated');

  // Debug: Log ALL incoming events
  socket.onAny((eventName, ...args) => {
    console.log('📨 SOCKET EVENT:', eventName);
    console.log('📄 Event Data:', JSON.stringify(args, null, 2));
  });

  // Your actual handler
  socket.on(`order:${orderId}:updated`, (data) => {
    console.log('✅ ORDER UPDATE RECEIVED:', data);

    if (data.paymentStatus === 'completed') {
      setStatus('success');
      toast.success('Payment confirmed!');
      setTimeout(() => navigate(`/orders/${orderId}`), 2000);
    } else if (data.paymentStatus === 'failed') {
      setStatus('failure');
      toast.error('Payment failed');
    }
  });

  // Cleanup
  return () => {
    socket.offAny();
    socket.off(`order:${orderId}:updated`);
  };
}, [orderId]);
```

#### Step 2: Test the Flow

1. **Start backend:** `npm run dev` in server repo
2. **Start frontend:** `npm run dev` in client repo
3. **Open browser:** http://localhost:5173
4. **Open DevTools:** Press `F12` → Console tab
5. **Login** and **create order**
6. **Watch Console:**

```
🔌 Socket Connected: true
🆔 Socket ID: vJ3x7-KqP9aL2nM8AAAB
📡 Subscribing to: order:69258fc2cb6b2737df490a7d:updated
⏳ Triggering payment simulation...

(After 2 seconds)
📨 SOCKET EVENT: order:69258fc2cb6b2737df490a7d:updated
📄 Event Data: {
  "orderId": "69258fc2cb6b2737df490a7d",
  "status": "processing",
  "paymentStatus": "completed",
  "message": "Payment confirmed!",
  "timestamp": "2025-11-25T11:20:00.000Z"
}
✅ ORDER UPDATE RECEIVED: {...}
🎉 Payment confirmed!
```

#### Step 3: Monitor WebSocket in Network Tab

1. DevTools → **Network** tab
2. Filter by **WS** (WebSocket)
3. Click on `socket.io/?EIO=4&transport=websocket`
4. Go to **Messages** sub-tab
5. See real-time Socket.IO frames

---

### Method 2: Simple Node.js Test Client ✅

Create a standalone script to test Socket.IO without the browser.

#### Create Test Script: `test-socket-events.js`

Put this in your **server repository root**:

```javascript
#!/usr/bin/env node
const io = require('socket.io-client');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const ORDER_ID = process.argv[2];

if (!ORDER_ID) {
  console.error('❌ Usage: node test-socket-events.js <ORDER_ID>');
  console.error('Example: node test-socket-events.js 69258fc2cb6b2737df490a7d');
  process.exit(1);
}

console.log('🚀 Socket.IO Test Client\n');
console.log('📡 Server:', SERVER_URL);
console.log('📦 Order ID:', ORDER_ID);
console.log('🔑 Auth Token:', AUTH_TOKEN ? '✅ Set' : '❌ Not set');
console.log('---\n');

// Connect to server
const socket = io(SERVER_URL, {
  auth: AUTH_TOKEN ? { token: AUTH_TOKEN } : {},
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ CONNECTED');
  console.log('🆔 Socket ID:', socket.id);
  console.log('👂 Listening for events...\n');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection Error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('⚠️  Disconnected:', reason);
});

// Listen for order-specific updates
socket.on(`order:${ORDER_ID}:updated`, (data) => {
  console.log('🎯 ORDER UPDATE EVENT RECEIVED!');
  console.log('━'.repeat(50));
  console.log(JSON.stringify(data, null, 2));
  console.log('━'.repeat(50));
  console.log('');
});

// Listen for all events (debugging)
socket.onAny((eventName, ...args) => {
  console.log(`📬 Event: ${eventName}`);
  console.log('Data:', JSON.stringify(args, null, 2));
  console.log('---\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  socket.close();
  process.exit(0);
});

console.log('ℹ️  Press Ctrl+C to exit\n');
```

#### Install Socket.IO Client:

```bash
cd /path/to/constructor-demo-server
npm install socket.io-client
```

#### Run the Test:

```bash
# Start the listener
AUTH_TOKEN="your_token_here" node test-socket-events.js 69258fc2cb6b2737df490a7d
```

#### Trigger Payment in Another Terminal:

```bash
curl -X PATCH "http://localhost:5000/api/orders/69258fc2cb6b2737df490a7d/payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{"success": true}'
```

**Expected Output in Test Script:**
```
✅ CONNECTED
🆔 Socket ID: xyz789
👂 Listening for events...

(After ~2 seconds)
🎯 ORDER UPDATE EVENT RECEIVED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "orderId": "69258fc2cb6b2737df490a7d",
  "status": "processing",
  "paymentStatus": "completed",
  "message": "Payment confirmed!",
  "timestamp": "2025-11-25T11:20:00.000Z"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Method 3: Using Postman (Limited) ⚠️

Postman has beta WebSocket support, but it's **not ideal for Socket.IO** because:
- Socket.IO uses custom protocol over WebSocket
- Requires manual handshake frames
- Hard to maintain authentication

**If you still want to try:**

1. Create new **WebSocket Request** (not HTTP!)
2. URL: `ws://localhost:5000/socket.io/?EIO=4&transport=websocket&token=YOUR_TOKEN`
3. Click **Connect**
4. You'll need to manually send Socket.IO frames:
   - Send: `0` (OPEN frame)
   - Send: `40` (CONNECT to default namespace)
   - Send: `42["order:69258fc2cb6b2737df490a7d:updated",{}]` (subscribe)

**This is tedious and error-prone. Not recommended!**

---

## Testing Workflow for Your Case

Since you're testing locally, here's the recommended flow:

### Setup:

```bash
# Terminal 1: Backend
cd /path/to/constructor-demo-server
npm run dev

# Terminal 2: Frontend
cd /path/to/constructor-demo-client
npm run dev

# Terminal 3: Socket.IO listener (optional)
cd /path/to/constructor-demo-server
node test-socket-events.js YOUR_ORDER_ID
```

### Test Scenario 1: Payment Flow

1. **Browser:** Create order, go to payment page
2. **Console:** Watch for Socket.IO events
3. **Network → WS:** See WebSocket frames
4. **Verify:** Payment status updates in real-time (no refresh needed!)

### Test Scenario 2: Status Updates

1. **Browser Tab 1:** Open order detail page for an order
2. **Terminal/Postman:** Update order status via API:
```bash
curl -X PATCH "http://localhost:5000/api/orders/ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "shipped", "note": "Package shipped"}'
```
3. **Browser Tab 1:** Should update instantly without refresh!

---

## Verifying Socket.IO is Working

### Backend Verification:

Add logging to your controller:

```typescript
export const simulatePayment = async (req: AuthRequest, res: Response) => {
  // ... your code

  setTimeout(async () => {
    // ... update order

    const io = req.app.get('io');
    if (io) {
      console.log('📡 Emitting Socket.IO event to room: order_' + order._id);

      io.to(`order_${order._id}`).emit('order:updated', {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        message: 'Payment confirmed!',
        timestamp: new Date(),
      });

      console.log('✅ Event emitted successfully');
    } else {
      console.error('❌ Socket.IO instance not found on app!');
    }
  }, 2000);
};
```

### Frontend Verification:

Check `src/lib/socket.ts` has correct server URL:

```typescript
const socket = io('http://localhost:5000', {  // ✅ Check this matches your backend port
  auth: {
    token: localStorage.getItem('auth_token') || undefined,
  },
  transports: ['websocket', 'polling'],
});
```

---

## Common Issues

### Issue: "Socket not connected"

**Cause:** Backend Socket.IO not initialized or CORS issue

**Fix backend:**
```typescript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Your frontend URL
    credentials: true,
  },
});

// Make io available to routes
app.set('io', io);
```

### Issue: "Events not received"

**Cause:** Not subscribed to correct room or event name

**Check:**
- Event name matches exactly: `order:${orderId}:updated`
- Backend emits to correct room: `io.to('order_' + orderId).emit(...)`
- Frontend subscribes before backend emits

### Issue: "401 Unauthorized" on WebSocket

**Cause:** Auth middleware blocking Socket.IO connection

**Fix:** Add Socket.IO auth middleware:

```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});
```

---

## Quick Test Script for Copy-Paste

Save this as `quick-socket-test.js` in your server repo:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5000');

socket.on('connect', () => console.log('✅ Connected:', socket.id));
socket.onAny((e, d) => console.log('📨', e, d));

const orderId = process.argv[2] || '69258fc2cb6b2737df490a7d';
socket.on(`order:${orderId}:updated`, (data) => {
  console.log('🎯 Order updated:', data);
});

console.log('Listening for order:', orderId);
```

**Run:** `node quick-socket-test.js YOUR_ORDER_ID`

---

## Summary

**For local testing, USE:**
1. ✅ **Browser DevTools Console** - Best for UI testing
2. ✅ **Node.js test script** - Best for automation
3. ✅ **Network → WS tab** - Best for debugging frames

**AVOID:**
- ❌ Postman - Too complex for Socket.IO
- ❌ Manual WebSocket clients - Socket.IO protocol is complicated

**Testing Socket.IO is actually easier through your frontend because:**
- Authentication is already set up
- Event subscriptions are already coded
- You can see the UI updates in real-time
- Console logs show everything you need

Just open your browser, open DevTools Console, and use your app normally. You'll see all Socket.IO events!
