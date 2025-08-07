import { Order } from '../Models/Order_Mod.js';
import { Product } from '../Models/Product_Mod.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;

    // Validate input
    if (!productId || !quantity || !shippingAddress) {
      return res.status(400).json({ message: 'Product, quantity, and shipping address are required' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if enough stock is available
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      product: product._id,
      quantity,
      shippingAddress,
      totalAmount: product.price * quantity,
      status: 'pending',
    });

    // Reduce stock
    product.countInStock -= quantity;
    await product.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};


// Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email').populate('items.product');
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status || order.orderStatus;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//update Orders by users

export const updateMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not your order' });
    }

    // Only allow updates if still pending
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Cannot update after processing starts' });
    }

    // Allow updating shipping address
    const { shippingAddress, items } = req.body;
    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }

    // Handle items update
    if (items && items.length > 0) {
      // Validate and recalculate
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.product}` });
        }

        validatedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });

        totalAmount += product.price * item.quantity;
      }

      order.items = validatedItems;
      order.totalAmount = totalAmount;
    }

    await order.save();

    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.error('Update order error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Allow users to cancel oders
export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not your order' });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel after processing' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

