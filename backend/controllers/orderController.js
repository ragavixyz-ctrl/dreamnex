import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import Stripe from 'stripe';

const stripeClient = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Create order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'stripe' } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Verify stock and calculate totals
    const orderItems = [];
    let subtotal = 0;
    
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.status !== 'active') {
        return res.status(400).json({ message: `Product ${product?.name || 'Unknown'} is unavailable` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
        store: product.store,
      });
    }
    
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
    });
    
    // Create payment intent if using Stripe
    let paymentIntentId = null;
    if (paymentMethod === 'stripe' && stripeClient) {
      try {
        const paymentIntent = await stripeClient.paymentIntents.create({
          amount: Math.round(total * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            orderId: order._id.toString(),
            userId: req.user.id.toString(),
          },
        });
        paymentIntentId = paymentIntent.id;
        order.paymentIntentId = paymentIntentId;
        await order.save();
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
      }
    }
    
    // Clear cart
    cart.items = [];
    cart.total = 0;
    await cart.save();
    
    // Update product stock and sales
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sales: item.quantity },
      });
    }
    
    await order.populate('items.product');
    await order.populate('items.store');
    
    res.status(201).json({
      success: true,
      order,
      clientSecret: paymentIntentId ? (await stripeClient.paymentIntents.retrieve(paymentIntentId)).client_secret : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get user orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .populate('items.store')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate('items.product')
      .populate('items.store');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    await order.save();
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

// Confirm payment (webhook handler)
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (stripeClient && paymentIntentId) {
      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status === 'succeeded') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        await order.save();
      }
    }
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
  }
};

