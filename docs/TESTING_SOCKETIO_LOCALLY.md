# Testing Socket.IO Locally - Complete Guide

## Quick Answer

**Can you test Socket.IO in Postman?**
⚠️ Postman has limited WebSocket support (beta feature). It's better to use other tools.

**Best ways to test locally:**
1. ✅ **Browser DevTools** - Easiest for quick checks
2. ✅ **Frontend Application** - Most realistic testing
3. ✅ **Simple Node.js Client** - Best for automated testing
4. ✅ **Firecamp/Hopscotch** - GUI tools for WebSocket testing
5. ⚠️ **Postman** - Limited, requires manual WebSocket setup

---

## Method 1: Browser DevTools (Easiest)

### Step 1: Open Your Frontend
```bash
# Start your frontend
npm run dev
```

### Step 2: Open Chrome DevTools
1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Your Socket.IO connection logs should appear

### Step 3: Monitor Socket.IO Events

Add temporary logging to your frontend:

```typescript
// In PaymentVerifyPage.tsx or wherever you use Socket.IO
useEffect(() => {
  const socket = getSocket();

  console.log('🔌 Socket connected:', socket.connected);
  console.log('🆔 Socket ID:', socket.id);

  // Log all events
  socket.onAny((eventName, ...args) => {
    console.log('📨 Received event:', eventName, args);
  });

  socket.on(`order:${orderId}:updated`, (data) => {
    console.log('✅ Order updated event:', data);
    // ... your handler
  });

  return () => {
    socket.offAny();
  };
}, []);
```

### Step 4: Trigger Events

1. Create an order through your UI
2. Navigate to payment verification page
3. Watch the Console for Socket.IO events:

```
🔌 Socket connected: true
🆔 Socket ID: abc123xyz
📨 Received event: order:69258fc2cb6b2737df490a7d:updated { orderId: '...', status: 'processing', ... }
✅ Order updated event: { orderId: '...', paymentStatus: 'completed', ... }
```

---

## Method 2: Simple Node.js Test Client

Create a standalone test script to connect and listen for events.

### Create Test File: `test-socket.js`

```javascript
const io = require('socket.io-client');

// Connect to your backend
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_AUTH_TOKEN_HERE'  // Get from localStorage after login
  }
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server');
  console.log('🆔 Socket ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from Socket.IO server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

// Listen to specific order updates
const orderId = '69258fc2cb6b2737df490a7d'; // Replace with your order ID
socket.on(`order:${orderId}:updated`, (data) => {
  console.log('📦 Order updated:', JSON.stringify(data, null, 2));
});

// Listen to all order events (wildcard)
socket.onAny((eventName, ...args) => {
  if (eventName.startsWith('order:')) {
    console.log('📨 Event received:', eventName);
    console.log('📄 Data:', JSON.stringify(args, null, 2));
  }
});

// Keep script running
console.log('👂 Listening for Socket.IO events...');
console.log('📡 Subscribed to: order:' + orderId + ':updated');
console.log('Press Ctrl+C to exit\n');
```

### Run the Test Client:

```bash
# Install socket.io-client if not already installed
npm install socket.io-client

# Run the test script
node test-socket.js
```

### Get Your Auth Token:

1. Login through your frontend
2. Open DevTools → Application → Local Storage
3. Copy the `auth_token` value
4. Paste it in the test script

---

## Method 3: Testing with cURL + Node.js Client

### Terminal 1: Start Socket.IO Listener

```bash
node test-socket.js
```

### Terminal 2: Trigger Payment with cURL

```bash
# Replace with your actual order ID and token
ORDER_ID="69258fc2cb6b2737df490a7d"
TOKEN="your_auth_token_here"

curl -X PATCH "http://localhost:5000/api/orders/${ORDER_ID}/payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"success": true}'
```

### What You Should See:

**Terminal 1 (Socket.IO listener):**
```
👂 Listening for Socket.IO events...
✅ Connected to Socket.IO server
🆔 Socket ID: abc123xyz

📨 Event received: order:69258fc2cb6b2737df490a7d:updated
📄 Data: {
  "orderId": "69258fc2cb6b2737df490a7d",
  "status": "processing",
  "paymentStatus": "completed",
  "message": "Payment confirmed!",
  "timestamp": "2025-11-25T11:20:00.000Z"
}
```

**Terminal 2 (cURL response):**
```json
{
  "success": true,
  "message": "Payment processing..."
}
```

---

## Method 4: Browser-Based Testing Tools

### Option A: Firecamp (Recommended)

1. Download: https://firecamp.io/
2. Create new Socket.IO connection
3. URL: `http://localhost:5000`
4. Add auth header/query param
5. Subscribe to events and send test messages

### Option B: Hopscotch

1. Install: https://hoppscotch.io/
2. Go to Realtime → Socket.IO
3. Connect to `http://localhost:5000`
4. Subscribe to `order:${orderId}:updated`

### Option C: Socket.IO Admin UI

Add to your backend for visual monitoring:

```typescript
// In your server setup
import { instrument } from '@socket.io/admin-ui';

const io = new Server(server, {
  cors: { origin: '*' }
});

// Add admin UI
instrument(io, {
  auth: false, // Set to true in production
  mode: 'development',
});

console.log('Socket.IO Admin UI: http://localhost:5000/admin');
```

Then visit: `http://localhost:5000/admin`

---

## Method 5: Chrome DevTools Network Tab

### Step 1: Open Network Tab
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Filter by **WS** (WebSocket)

### Step 2: Find Socket.IO Connection
Look for connection like: `ws://localhost:5000/socket.io/?EIO=4&transport=websocket`

### Step 3: Monitor Messages
- Click on the WebSocket connection
- Go to **Messages** tab
- You'll see all Socket.IO frames:

```
⬆️ 42["order:69258fc2cb6b2737df490a7d:updated",{"orderId":"..."}]
⬇️ 2
⬆️ 3
```

**Decoding:**
- `42[...]` = Socket.IO event with data
- `2` = Ping
- `3` = Pong

---

## Complete Local Testing Workflow

### Setup (One Time)

1. **Start your backend:**
```bash
cd /path/to/constructor-demo-server
npm run dev
```

2. **Start your frontend:**
```bash
cd /path/to/constructor-demo-client
npm run dev
```

3. **Open browser:** http://localhost:5173 (or your frontend port)

### Testing Flow:

#### Test 1: Order Creation + Payment

1. **Login** to your app
2. **Add items** to cart
3. **Proceed to checkout**
4. **Fill form** and submit
5. **Watch Console** for Socket.IO events
6. **Watch Network → WS** tab for WebSocket messages
7. **Verify** payment page receives real-time update

**Expected Console Output:**
```
🔌 Socket connecting...
✅ Socket connected
🆔 Socket ID: abc123xyz
📨 Subscribed to: order:69258fc2cb6b2737df490a7d:updated
⏳ Triggering payment simulation...
📨 Received event: order:69258fc2cb6b2737df490a7d:updated
✅ Payment confirmed!
🎉 Redirecting to order page...
```

#### Test 2: Real-time Status Updates

1. **Open order detail page** in Browser Tab 1
2. **Use cURL or Postman** to update order status:
```bash
curl -X PATCH "http://localhost:5000/api/orders/${ORDER_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"status": "shipped", "note": "Order shipped via FedEx"}'
```
3. **Watch Browser Tab 1** - should update in real-time without refresh!

---

## Testing Checklist

### ✅ Connection Testing
- [ ] Socket connects successfully on page load
- [ ] Socket ID is logged in console
- [ ] Connection survives across page navigation
- [ ] Reconnects automatically if disconnected

### ✅ Event Testing
- [ ] `order:updated` event fires when payment completes
- [ ] Event data contains all required fields
- [ ] Multiple subscribers receive the same event
- [ ] Events fire within 2-3 seconds of trigger

### ✅ Room Testing
- [ ] Events only reach intended recipients
- [ ] Order-specific room `order_${orderId}` works
- [ ] User-specific room `user_${userId}` works
- [ ] Other users don't receive private events

### ✅ Error Cases
- [ ] Connection fails gracefully if backend is down
- [ ] Events don't crash app if malformed
- [ ] Auth failures are handled properly
- [ ] Reconnection works after backend restart

---

## Postman WebSocket Testing (Limited)

Postman has beta WebSocket support, but it's clunky for Socket.IO:

1. Create new **WebSocket Request**
2. URL: `ws://localhost:5000/socket.io/?EIO=4&transport=websocket`
3. Click **Connect**
4. Manually send Socket.IO frames:
   - `0` = OPEN
   - `2` = PING
   - `40` = CONNECT to namespace
   - `42["event_name", {...}]` = EVENT

**Not recommended** - Socket.IO has complex handshake protocol that's tedious to do manually.

---

## Recommended Approach

**For quick testing:** Use Browser DevTools Console + Network tab

**For development:** Add comprehensive logging to your frontend Socket.IO code

**For automated testing:** Create Node.js test client script

**For visual debugging:** Install Socket.IO Admin UI on your backend

---

## Example: Full Test Script

Save as `test-order-socketio.js`:

```javascript
#!/usr/bin/env node
const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:5000';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'your_token_here';
const ORDER_ID = process.argv[2] || '69258fc2cb6b2737df490a7d';

console.log('🚀 Socket.IO Test Client');
console.log('📡 Server:', SERVER_URL);
console.log('📦 Order ID:', ORDER_ID);
console.log('---\n');

const socket = io(SERVER_URL, {
  auth: { token: AUTH_TOKEN },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('✅ Connected');
  console.log('🆔 Socket ID:', socket.id);
  console.log('👂 Listening for order updates...\n');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});

socket.on(`order:${ORDER_ID}:updated`, (data) => {
  console.log('📨 ORDER UPDATE RECEIVED:');
  console.log(JSON.stringify(data, null, 2));
  console.log('---\n');
});

socket.onAny((event, ...args) => {
  console.log(`📬 Event: ${event}`);
  console.log('Data:', args);
  console.log('---\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting...');
  socket.close();
  process.exit(0);
});

console.log('Press Ctrl+C to exit\n');
```

**Run it:**
```bash
AUTH_TOKEN="your_token" node test-order-socketio.js 69258fc2cb6b2737df490a7d
```

---

## Common Issues & Solutions

### Issue: "Connection Refused"
**Cause:** Backend not running or wrong port
**Fix:** Check backend is running on correct port

### Issue: "401 Unauthorized"
**Cause:** Invalid or missing auth token
**Fix:** Get fresh token from localStorage after login

### Issue: "Events not received"
**Cause:** Not subscribed to correct room/event name
**Fix:** Verify event name matches exactly: `order:${orderId}:updated`

### Issue: "CORS Error"
**Cause:** Socket.IO CORS not configured
**Fix:** Update backend Socket.IO setup:
```typescript
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
  }
});
```

---

## Summary

**For your current local testing:**

1. **Use Browser Console** - Add `console.log` to your PaymentVerifyPage component
2. **Watch Network → WS** - Monitor WebSocket frames in real-time
3. **Create test script** - Use the Node.js example above for repeatable testing
4. **Skip Postman** - Not ideal for Socket.IO testing

The frontend is the best place to test since that's where your users will experience the real-time updates!
