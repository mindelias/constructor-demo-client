# Debugging: StatusHistory Not Appearing in Responses

## The Problem

Your API responses are missing the `statusHistory` field even though you've added it to the schema with a pre-save hook.

**Expected:** Order should include `statusHistory` array
**Actual:** Field is completely missing from response

---

## Common Causes & Solutions

### 1. Schema Field Not Defined ❌

**Check your Order schema has the field:**

```typescript
const orderSchema = new Schema({
  // ... other fields
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
});
```

### 2. Pre-Save Hook Not Firing ⚠️

**Your pre-save hook should look like this:**

```typescript
orderSchema.pre('save', function(next) {
  // IMPORTANT: Check if statusHistory exists AND is empty
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order placed'
    }];
  }
  next();
});
```

**Common mistakes:**
- ❌ Using arrow function: `orderSchema.pre('save', () => {})` - loses `this` context
- ❌ Checking only `this.isNew` without checking if array is empty
- ❌ Not calling `next()`

### 3. Using `.lean()` in Queries ⚠️

**Problem:** If your controller uses `.lean()`, the hook won't run on retrieval, but it should still be saved.

```typescript
// This will return plain JS object without statusHistory if it wasn't saved
const order = await Order.findById(id).lean();
```

**Fix:** Remove `.lean()` or ensure statusHistory was saved initially:

```typescript
// Option 1: Remove .lean()
const order = await Order.findById(id).populate('items.productId');

// Option 2: Keep .lean() but ensure field is included
const order = await Order.findById(id)
  .populate('items.productId')
  .lean();
// statusHistory should still be there if it was saved properly
```

### 4. Field Excluded in Query

**Check if you're using `.select()` to exclude fields:**

```typescript
// ❌ This excludes statusHistory
const order = await Order.findById(id).select('-statusHistory');

// ✅ This includes everything
const order = await Order.findById(id);
```

---

## Debugging Steps

### Step 1: Check the Database Directly

Connect to MongoDB and inspect a document:

```bash
# Using MongoDB shell
mongosh
use your_database_name
db.orders.findOne({ _id: ObjectId("69258fc2cb6b2737df490a7d") })
```

**Expected result:** Should see `statusHistory` array in the document.

**If missing:** Pre-save hook is not firing correctly.

### Step 2: Test the Pre-Save Hook

Add console logs to debug:

```typescript
orderSchema.pre('save', function(next) {
  console.log('🔍 PRE-SAVE HOOK FIRED');
  console.log('Is new document?', this.isNew);
  console.log('Current statusHistory:', this.statusHistory);

  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    console.log('✅ Initializing statusHistory');
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      note: 'Order placed'
    }];
  }

  console.log('Final statusHistory:', this.statusHistory);
  next();
});
```

Create a new order and check your server logs. You should see:
```
🔍 PRE-SAVE HOOK FIRED
Is new document? true
Current statusHistory: undefined
✅ Initializing statusHistory
Final statusHistory: [ { status: 'pending', timestamp: 2025-11-25T..., note: 'Order placed' } ]
```

### Step 3: Verify Schema Field Type

Make sure the schema field is properly defined. Try this explicit definition:

```typescript
const orderSchema = new Schema({
  // ... other fields

  statusHistory: {
    type: [{
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: String
    }],
    default: []  // Initialize as empty array
  }
});
```

### Step 4: Check Controller Code

In your `createOrder` controller function, verify you're not excluding the field:

```typescript
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // ... validation code

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      paymentReference,
      // Don't explicitly set statusHistory - let pre-save hook handle it
    });

    await order.save();  // This should trigger pre-save hook

    // Populate product details
    await order.populate('items.productId', 'name price images');

    // Return the full order - statusHistory should be included
    res.status(201).json({
      success: true,
      data: order,  // This should include statusHistory
      paymentReference,
    });
  }
  // ...
};
```

---

## Quick Fix to Try First

**Replace your pre-save hook with this:**

```typescript
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      // Initialize statusHistory if not set
      if (!this.statusHistory) {
        this.statusHistory = [];
      }

      // Add initial status if array is empty
      if (this.statusHistory.length === 0) {
        this.statusHistory.push({
          status: this.status,
          timestamp: new Date(),
          note: 'Order placed',
        });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
```

---

## Alternative: Initialize in Controller

If the hook still doesn't work, initialize it directly in the controller:

```typescript
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // ... validation code

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      paymentReference,
      statusHistory: [{  // ✅ Initialize directly
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed',
      }]
    });

    await order.save();

    // ... rest of code
  }
  // ...
};
```

---

## Expected Result

After fixing, your response should include:

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

## Need More Help?

If none of these solutions work, please share:
1. Your complete Order schema code
2. Your createOrder controller function
3. Server logs when creating an order
4. Result of checking the database directly

This will help pinpoint the exact issue.
