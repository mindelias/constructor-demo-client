# Fix: StatusHistory Not Appearing in API Responses

## The Problem

Your `statusHistory` field is completely missing from API responses, even though it's defined in your schema and you have a pre-save hook.

---

## Root Cause Analysis

Looking at your code, the setup is correct but the hook might not be firing. Here's why:

**Your current hook location:**
```typescript
// In models/Order.ts - AFTER importing schema
orderSchema.pre('save', function(next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order placed',
    }];
  }
  next();
});
```

**Issue:** You're adding the hook in `models/Order.ts` AFTER importing the schema from `schema/order.schema.ts`. This should work, but there might be a race condition.

---

## Solution 1: Move Hook to Schema File (Recommended)

**File: `schema/order.schema.ts`**

```typescript
import { IOrder } from "@/types";
import { Schema } from "mongoose";

export const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "cash_on_delivery", "simulated"],
      default: "simulated",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    paidAt: Date,
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ ADD PRE-SAVE HOOK HERE IN SCHEMA FILE
orderSchema.pre('save', function(next) {
  console.log('🔍 Order pre-save hook triggered');
  console.log('📝 Is new:', this.isNew);
  console.log('📊 Current statusHistory:', this.statusHistory);

  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    console.log('✅ Initializing statusHistory');
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order placed',
    }];
  }

  console.log('📋 Final statusHistory:', this.statusHistory);
  next();
});

// Add indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
```

**Then update your model file:**

**File: `models/Order.ts`**

```typescript
import { orderSchema } from "@/schema/order.schema";
import { IOrder } from "@/types";
import mongoose from "mongoose";

// Remove the hook from here since it's now in the schema file
const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
```

---

## Solution 2: Initialize Directly in Controller (Guaranteed Fix)

If the hook still doesn't work, bypass it completely by initializing in your controller:

**File: `controllers/orderController.ts`**

```typescript
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // ... your validation code

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      paymentReference,
      statusHistory: [{  // ✅ Initialize directly here
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed',
      }]
    });

    await order.save();

    // Populate product details
    await order.populate('items.productId', 'name price images');

    console.log('📦 Order created with statusHistory:', order.statusHistory);

    res.status(201).json({
      success: true,
      data: order,
      paymentReference,
    });
  }
  // ...
};
```

---

## Debugging Steps

### 1. Check Server Logs

After moving the hook to schema file, create a new order and check your server console:

**Expected output:**
```
🔍 Order pre-save hook triggered
📝 Is new: true
📊 Current statusHistory: undefined
✅ Initializing statusHistory
📋 Final statusHistory: [ { status: 'pending', timestamp: ..., note: 'Order placed' } ]
```

**If you DON'T see this:**
- Hook is not registered properly
- Server wasn't restarted
- Using wrong model instance

### 2. Restart Your Server

```bash
# Make sure you restart after schema changes!
# Ctrl+C to stop, then:
npm run dev
```

### 3. Check Database Directly

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use your_database_name

# Find the order
db.orders.findOne({ _id: ObjectId("69258fc2cb6b2737df490a7d") })
```

**If statusHistory is in the database but not in API response:**
- Your query is excluding it somehow
- Check if you're using `.select('-statusHistory')`

**If statusHistory is NOT in database:**
- Pre-save hook is not firing
- Use Solution 2 (initialize in controller directly)

---

## Quick Fix to Try RIGHT NOW

**Add this to your createOrder controller temporarily:**

```typescript
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // ... validation code

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      paymentReference,
    });

    // ✅ FORCE initialize statusHistory BEFORE saving
    if (!order.statusHistory || order.statusHistory.length === 0) {
      order.statusHistory = [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed',
      }];
    }

    console.log('📝 About to save order with statusHistory:', order.statusHistory);

    await order.save();

    console.log('✅ Order saved. StatusHistory:', order.statusHistory);

    // Populate and return
    await order.populate('items.productId', 'name price images');

    console.log('📦 Final order to return:', JSON.stringify(order, null, 2));

    res.status(201).json({
      success: true,
      data: order,
      paymentReference,
    });
  } catch (error) {
    // ... error handling
  }
};
```

### Test Again:

1. **Restart server** (important!)
2. **Create new order** via API
3. **Check console logs** - you should see statusHistory in logs
4. **Check API response** - should now include statusHistory

---

## Why This Might Be Happening

### Possible Cause 1: Schema Not Defaulting to Empty Array

Your schema defines `statusHistory: [...]` but doesn't set a default:

```typescript
statusHistory: [
  {
    status: { type: String, ... },
    timestamp: { type: Date, default: Date.now },
    note: String,
  },
],
// ❌ No default: [] specified
```

**Try adding default:**

```typescript
statusHistory: {
  type: [
    {
      status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      note: String,
    },
  ],
  default: [],  // ✅ Add this
}
```

### Possible Cause 2: TypeScript vs Mongoose Mismatch

Your TypeScript interface marks `statusHistory` as required:

```typescript
statusHistory: Array<{...}>;  // Required in TypeScript
```

But your schema doesn't have `required: true`:

```typescript
statusHistory: [...],  // Not marked as required in Mongoose
```

**This shouldn't cause it to be excluded**, but for consistency:

```typescript
statusHistory: {
  type: [...],
  required: true,  // ✅ Make it required
  default: [],
}
```

---

## Expected Result After Fix

```json
{
  "success": true,
  "data": {
    "_id": "69258fc2cb6b2737df490a7d",
    "userId": "69258b5e268895aeb4557a56",
    "items": [...],
    "totalAmount": 259.98,
    "status": "pending",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2025-11-25T11:15:14.358Z",
        "note": "Order placed",
        "_id": "..."
      }
    ],
    "shippingAddress": {...},
    "createdAt": "2025-11-25T11:15:14.358Z",
    "updatedAt": "2025-11-25T11:15:14.358Z",
    "__v": 0
  }
}
```

---

## Action Items

1. ✅ Move pre-save hook from `models/Order.ts` to `schema/order.schema.ts`
2. ✅ Add `default: []` to statusHistory schema definition
3. ✅ Add console logs to debug hook execution
4. ✅ Restart your server
5. ✅ Create new order and check logs
6. ✅ If still not working, initialize directly in controller

Let me know what you see in the console logs after trying these fixes!
