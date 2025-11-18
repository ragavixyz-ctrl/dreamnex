import express from 'express';
import { protect } from '../middlewares/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        interests: user.interests,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, interests } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (interests) user.interests = interests;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Track product view
router.post('/track-view', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add to browsing history
    user.browsingHistory.unshift({
      productId: product._id,
      viewedAt: new Date(),
    });

    // Keep only last 50 items
    if (user.browsingHistory.length > 50) {
      user.browsingHistory = user.browsingHistory.slice(0, 50);
    }

    await user.save();

    // Update product views
    product.views = (product.views || 0) + 1;
    await product.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to track view', error: error.message });
  }
});

// Get personalized homepage data
router.get('/homepage', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('browsingHistory.productId');

    // Get recommended products
    const interests = user.interests || [];
    const recentCategories = [...new Set(
      user.browsingHistory
        .map(h => h.productId?.category)
        .filter(Boolean)
    )];

    let recommendedProducts = [];

    if (interests.length > 0) {
      const interestProducts = await Product.find({
        $or: [
          { tags: { $in: interests } },
          { category: { $in: interests } },
        ],
        status: 'active',
      }).limit(10);
      recommendedProducts.push(...interestProducts);
    }

    if (recentCategories.length > 0) {
      const categoryProducts = await Product.find({
        category: { $in: recentCategories },
        status: 'active',
        _id: { $nin: recommendedProducts.map(p => p._id) },
      }).limit(10);
      recommendedProducts.push(...categoryProducts);
    }

    // Get trending products
    const trendingProducts = await Product.find({
      status: 'active',
      _id: { $nin: recommendedProducts.map(p => p._id) },
    })
      .sort({ views: -1 })
      .limit(10);

    // Get all active stores
    const stores = await Store.find({ status: 'approved' })
      .populate('owner', 'name')
      .limit(10);

    res.json({
      success: true,
      data: {
        recommended: recommendedProducts.slice(0, 20),
        trending: trendingProducts,
        stores,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch homepage data', error: error.message });
  }
});

export default router;

