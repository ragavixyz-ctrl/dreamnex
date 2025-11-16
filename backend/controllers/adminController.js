import Store from '../models/Store.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Approve store
export const approveStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.status = 'approved';
    await store.save();

    res.json({
      success: true,
      message: 'Store approved successfully',
      store,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve store', error: error.message });
  }
};

// Reject store
export const rejectStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.status = 'rejected';
    await store.save();

    res.json({
      success: true,
      message: 'Store rejected',
      store,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject store', error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Get analytics dashboard
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const approvedStores = await Store.countDocuments({ status: 'approved' });
    const pendingStores = await Store.countDocuments({ status: 'pending' });
    const totalProducts = await Product.countDocuments();

    const stores = await Store.find().populate('owner', 'name email');
    const totalStoreViews = stores.reduce((sum, s) => sum + (s.analytics.views || 0), 0);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalStores,
        approvedStores,
        pendingStores,
        totalProducts,
        totalStoreViews,
        stores: stores.map(s => ({
          id: s._id,
          name: s.name,
          owner: s.owner,
          status: s.status,
          views: s.analytics.views,
          createdAt: s.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

