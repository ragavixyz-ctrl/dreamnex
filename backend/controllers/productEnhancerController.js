import openai from '../config/openai.js';
import cloudinary from '../config/cloudinary.js';

// Enhance product photo
export const enhanceProductPhoto = async (req, res) => {
  try {
    const { imageUrl, enhancements = [] } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    const enhancementPrompts = {
      quality: 'High quality, professional product photography, sharp focus, studio lighting',
      backgroundRemoval: 'Remove background, white or transparent background, product only',
      shadows: 'Add realistic shadows, professional lighting, depth',
      reflections: 'Add subtle reflections, glossy surface, premium look',
      colorCorrection: 'Vibrant colors, accurate color representation, professional color grading',
      mockup: 'Product mockup, lifestyle setting, contextual background',
    };
    
    let prompt = 'Professional product photography';
    if (enhancements.length > 0) {
      const selectedEnhancements = enhancements.map(e => enhancementPrompts[e] || '').filter(Boolean);
      prompt = selectedEnhancements.join(', ');
    }
    
    // Use DALL-E to enhance/recreate the image
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt}. High quality, e-commerce ready, professional product image.`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
    
    const enhancedImageUrl = response.data[0].url;
    
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(enhancedImageUrl, {
      folder: 'dreamnex/enhanced-products',
      resource_type: 'image',
    });
    
    res.json({
      success: true,
      originalUrl: imageUrl,
      enhancedUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Photo enhancement error:', error);
    res.status(500).json({ message: 'Failed to enhance product photo', error: error.message });
  }
};

// Generate product mockup
export const generateMockup = async (req, res) => {
  try {
    const { productName, productType, style = 'lifestyle' } = req.body;
    
    const stylePrompts = {
      lifestyle: 'Product in real-world setting, natural environment, lifestyle photography',
      studio: 'Professional studio setup, clean background, product-focused',
      minimalist: 'Minimalist design, simple background, elegant presentation',
      bold: 'Bold colors, dynamic composition, eye-catching design',
    };
    
    const prompt = `${stylePrompts[style] || stylePrompts.lifestyle}. ${productName || 'Product'} ${productType || ''}. High quality product mockup, e-commerce ready.`;
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
    
    const mockupUrl = response.data[0].url;
    
    const uploadResult = await cloudinary.uploader.upload(mockupUrl, {
      folder: 'dreamnex/product-mockups',
      resource_type: 'image',
    });
    
    res.json({
      success: true,
      mockupUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Mockup generation error:', error);
    res.status(500).json({ message: 'Failed to generate mockup', error: error.message });
  }
};

