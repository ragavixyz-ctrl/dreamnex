import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products.product');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    
    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    
    const exists = wishlist.products.some(
      item => item.product.toString() === productId
    );
    
    if (!exists) {
      wishlist.products.push({ product: productId });
      await wishlist.save();
    }
    
    await wishlist.populate('products.product');
    
    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to wishlist', error: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== productId
    );
    await wishlist.save();
    
    await wishlist.populate('products.product');
    
    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from wishlist', error: error.message });
  }
};

