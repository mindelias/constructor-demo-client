# Backend Order Controller Refactoring Guide

## Overview

This guide documents the complete refactoring of order route handlers into a clean controller architecture. All business logic has been extracted from inline route handlers into dedicated controller functions.

---

## Complete Order Controller Implementation

### File: `controllers/orderController.ts`

```typescript
import { Request, Response } from 'express';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { validationResult } from 'express-validator';

// Type for authenticated request
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const userId = req.user?.userId;
    const { items, shippingAddress, paymentMethod = 'simulated' } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.productId} not found`
        });
      }

      if (product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient inventory for ${product.name}. Available: ${product.inventory}`
        });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Generate unique payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

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

    await order.save();

    // Update product inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          inventory: -item.quantity,
          'stats.purchases': 1
        }
      });
    }

    // Update user purchase history
    await User.findByIdAndUpdate(userId, {
      $push: {
        purchaseHistory: {
          orderId: order._id,
          purchasedAt: new Date()
        }
      }
    });

    // Populate product details for response
    await order.populate('items.productId', 'name price images');

    // Emit order event for real-time dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', {
        orderId: order._id,
        userId,
        totalAmount,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      data: order,
      paymentReference,
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
};

/**
 * Get user's orders (paginated)
 * GET /api/orders/my-orders
 */
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .populate('items.productId', 'name price images')
        .lean(),
      Order.countDocuments({ userId })
    ]);

    res.json({
      success: true,
      data: orders,
      metadata: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
};

/**
 * Get all orders (for current user)
 * GET /api/orders
 */
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const orders = await Order.find({ userId })
      .sort('-createdAt')
      .populate('items.productId', 'name price images')
      .lean();

    res.json({
      success: true,
      data: orders,
    });

  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const order = await Order.findOne({ _id: id, userId })
      .populate('items.productId')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error: any) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
};

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update status
    order.status = status;

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status changed to ${status}`,
    });

    await order.save();

    // Emit status update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Emit to user's room
      io.to(`user_${order.userId}`).emit('order_status_updated', {
        orderId: id,
        status,
        timestamp: new Date()
      });

      // Also emit to order-specific room
      io.to(`order_${order._id}`).emit('order:updated', {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        message: `Order status updated to ${status}`,
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      message: error.message
    });
  }
};

/**
 * Simulate payment webhook (for testing)
 * PATCH /api/orders/:id/payment
 */
export const simulatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { success = true } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if already paid
    if (order.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this order'
      });
    }

    // Simulate webhook delay (like real payment gateway)
    setTimeout(async () => {
      try {
        if (success) {
          // Payment successful
          order.paymentStatus = 'completed';
          order.status = 'processing';
          order.paidAt = new Date();

          order.statusHistory.push({
            status: 'processing',
            timestamp: new Date(),
            note: 'Payment confirmed (simulated)',
          });

          await order.save();

          // Emit Socket.IO event for real-time update
          const io = req.app.get('io');
          if (io) {
            io.to(`order_${order._id}`).emit('order:updated', {
              orderId: order._id,
              status: order.status,
              paymentStatus: order.paymentStatus,
              message: 'Payment confirmed!',
              timestamp: new Date(),
            });
          }

          console.log(`✅ Payment simulated successfully for order ${order._id}`);
        } else {
          // Payment failed
          order.paymentStatus = 'failed';

          order.statusHistory.push({
            status: 'pending',
            timestamp: new Date(),
            note: 'Payment failed (simulated)',
          });

          await order.save();

          // Emit failure event
          const io = req.app.get('io');
          if (io) {
            io.to(`order_${order._id}`).emit('order:updated', {
              orderId: order._id,
              status: order.status,
              paymentStatus: order.paymentStatus,
              message: 'Payment failed. Please try again.',
              timestamp: new Date(),
            });
          }

          console.log(`❌ Payment simulation failed for order ${order._id}`);
        }
      } catch (error) {
        console.error('Webhook simulation error:', error);
      }
    }, 2000); // 2-second delay to simulate webhook

    // Respond immediately (like real webhook)
    res.json({
      success: true,
      message: 'Payment processing...'
    });

  } catch (error: any) {
    console.error('Simulate payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cancel order
 * PATCH /api/orders/:id/cancel
 */
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Order cancelled by user',
    });

    await order.save();

    // Restore product inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          inventory: item.quantity,
          'stats.purchases': -1
        }
      });
    }

    // Emit cancellation event
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('order:updated', {
        orderId: order._id,
        status: order.status,
        message: 'Order cancelled',
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });

  } catch (error: any) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      message: error.message
    });
  }
};

export const orderController = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  simulatePayment,
  cancelOrder,
};
```

---

## Integration Steps

### 1. Update Your Routes File

Replace inline handlers with controller functions:

**File: `routes/orders.ts` (or wherever your order routes are defined)**

```typescript
import { Router } from 'express';
import { orderController } from '@/controllers/orderController';
import { authMiddleware } from '@/middleware/auth';
import { validateOrder } from '@/middleware/validation';

const router = Router();

// Create order
router.post(
  '/',
  authMiddleware,
  validateOrder,
  orderController.createOrder
);

// Get all orders for current user
router.get(
  '/',
  authMiddleware,
  orderController.getOrders
);

// Get paginated orders
router.get(
  '/my-orders',
  authMiddleware,
  orderController.getMyOrders
);

// Get single order by ID
router.get(
  '/:id',
  authMiddleware,
  orderController.getOrderById
);

// Update order status
router.patch(
  '/:id/status',
  authMiddleware,
  orderController.updateOrderStatus
);

// Simulate payment (for testing)
router.patch(
  '/:id/payment',
  authMiddleware,
  orderController.simulatePayment
);

// Cancel order
router.patch(
  '/:id/cancel',
  authMiddleware,
  orderController.cancelOrder
);

export default router;
```

### 2. Verify Imports

Ensure your import paths match your project structure:

```typescript
// Adjust these based on your actual file locations
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
```

### 3. Test All Endpoints

After integration, test each endpoint:

- ✅ **POST /api/orders** - Create order
- ✅ **GET /api/orders** - Get all orders
- ✅ **GET /api/orders/my-orders** - Get paginated orders
- ✅ **GET /api/orders/:id** - Get single order
- ✅ **PATCH /api/orders/:id/status** - Update status
- ✅ **PATCH /api/orders/:id/payment** - Simulate payment
- ✅ **PATCH /api/orders/:id/cancel** - Cancel order

---

## Benefits of This Refactoring

### ✅ Clean Separation of Concerns
- Routes handle routing logic only
- Controllers handle business logic
- Models handle data structure

### ✅ Improved Testability
- Controller functions can be unit tested independently
- Easy to mock dependencies

### ✅ Better Code Organization
- All order-related logic in one file
- Easy to find and maintain

### ✅ Reusability
- Controller functions can be called from multiple places
- Easier to add new routes using existing logic

### ✅ Consistent Error Handling
- Centralized error handling patterns
- Consistent response formats

---

## Socket.IO Events

The controller emits the following real-time events:

### `new_order`
Emitted when a new order is created.
```typescript
{
  orderId: string;
  userId: string;
  totalAmount: number;
  timestamp: Date;
}
```

### `order_status_updated`
Emitted to user's room when order status changes.
```typescript
{
  orderId: string;
  status: string;
  timestamp: Date;
}
```

### `order:updated`
Emitted to order-specific room for real-time updates.
```typescript
{
  orderId: string;
  status: string;
  paymentStatus: string;
  message: string;
  timestamp: Date;
}
```

---

## Next Steps

1. Copy the `orderController.ts` code to your server repository
2. Update your routes file to use the controller
3. Test all endpoints to ensure everything works
4. Verify Socket.IO events are firing correctly
5. Update any tests to use the new controller structure

---

## Related Documentation

- See `PAYMENT_IMPLEMENTATION.md` for payment flow details
- See Order model schema for field definitions
- See Socket.IO setup in your server's main file

