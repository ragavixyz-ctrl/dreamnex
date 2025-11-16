import Store from '../models/Store.js';
import Product from '../models/Product.js';
import openai from '../config/openai.js';
import cloudinary from '../config/cloudinary.js';

// Create AI Store
export const createStore = async (req, res) => {
  try {
    const { storeName, niche, description } = req.body;
    const userId = req.user.id;

    if (!storeName) {
      return res.status(400).json({ message: 'Store name is required' });
    }

    // Generate store details using AI
    const storePrompt = `Create a complete online store concept for "${storeName}" in the ${niche || 'general e-commerce'} niche.
    Provide:
    1. Store description (2-3 sentences)
    2. Store tagline (one catchy sentence)
    3. Theme colors (primary, secondary, accent - hex codes)
    4. Font suggestions (2-3 modern fonts)
    
    Format as JSON with keys: description, tagline, primaryColor, secondaryColor, accentColor, fonts.`;

    const storeCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional e-commerce store designer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: storePrompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const storeData = JSON.parse(storeCompletion.choices[0].message.content);

    // Generate logo
    let logoUrl = '';
    try {
      const logoResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Modern, professional logo for "${storeName}" e-commerce store. Clean, scalable design.`,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      const logoUpload = await cloudinary.uploader.upload(logoResponse.data[0].url, {
        folder: 'dreamnex/stores/logos',
      });
      logoUrl = logoUpload.secure_url;
    } catch (error) {
      console.error('Logo generation error:', error);
    }

    // Generate banner
    let bannerUrl = '';
    try {
      const bannerResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `E-commerce store hero banner for "${storeName}". Modern, professional design with ${storeData.primaryColor || 'brand colors'}.`,
        n: 1,
        size: '1792x1024',
        response_format: 'url',
      });

      const bannerUpload = await cloudinary.uploader.upload(bannerResponse.data[0].url, {
        folder: 'dreamnex/stores/banners',
      });
      bannerUrl = bannerUpload.secure_url;
    } catch (error) {
      console.error('Banner generation error:', error);
    }

    // Create store
    const store = await Store.create({
      name: storeName,
      owner: userId,
      description: storeData.description || description || '',
      logo: logoUrl,
      banner: bannerUrl,
      theme: {
        primaryColor: storeData.primaryColor || '#4F46E5',
        secondaryColor: storeData.secondaryColor || '#818CF8',
        accentColor: storeData.accentColor || '#F59E0B',
        fontFamily: storeData.fonts?.[0] || 'Inter',
      },
      isAIGenerated: true,
      aiGeneratedData: {
        tagline: storeData.tagline || '',
        brandStory: '',
        mission: '',
        vision: '',
        colorPalette: {
          primary: [storeData.primaryColor || '#4F46E5'],
          secondary: [storeData.secondaryColor || '#818CF8'],
          accent: [storeData.accentColor || '#F59E0B'],
        },
        typography: storeData.fonts || ['Inter'],
      },
    });

    // Generate products for the store
    await generateStoreProducts(store._id, storeName, niche);

    res.status(201).json({
      success: true,
      store: {
        id: store._id,
        name: store.name,
        description: store.description,
        logo: store.logo,
        banner: store.banner,
        theme: store.theme,
        status: store.status,
      },
    });
  } catch (error) {
    console.error('Store creation error:', error);
    res.status(500).json({ message: 'Failed to create store', error: error.message });
  }
};

// Helper function to generate store products
const generateStoreProducts = async (storeId, storeName, niche) => {
  try {
    const productCount = 7; // Generate 7 products

    for (let i = 0; i < productCount; i++) {
      try {
        // Generate product concept
        const productPrompt = `Create a product concept for "${storeName}" store in the ${niche || 'e-commerce'} niche.
        Provide:
        1. Product name
        2. Product description (2-3 sentences)
        3. Price (realistic number)
        4. Category
        5. Key features (3-5 bullet points)
        
        Format as JSON with keys: name, description, price, category, features.`;

        const productCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a product creator. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: productPrompt,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const productData = JSON.parse(productCompletion.choices[0].message.content);

        // Generate product image
        let productImageUrl = '';
        try {
          const imageResponse = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `Professional product photography of ${productData.name}. High quality, e-commerce style, white background.`,
            n: 1,
            size: '1024x1024',
            response_format: 'url',
          });

          const imageUpload = await cloudinary.uploader.upload(imageResponse.data[0].url, {
            folder: 'dreamnex/stores/products',
          });
          productImageUrl = imageUpload.secure_url;
        } catch (error) {
          console.error('Product image generation error:', error);
        }

        // Create product
        await Product.create({
          name: productData.name || `Product ${i + 1}`,
          store: storeId,
          description: productData.description || '',
          shortDescription: productData.description?.substring(0, 150) || '',
          price: parseFloat(productData.price) || 29.99,
          images: productImageUrl ? [{ url: productImageUrl }] : [],
          category: productData.category || 'General',
          tags: productData.features || [],
          isAIGenerated: true,
          aiGeneratedData: {
            designPrompt: `Product for ${storeName}`,
            description: {
              seo: productData.description || '',
              bullets: productData.features || [],
              highlights: productData.features?.slice(0, 3) || [],
            },
          },
          stock: Math.floor(Math.random() * 100) + 10,
        });
      } catch (error) {
        console.error(`Error generating product ${i + 1}:`, error);
      }
    }
  } catch (error) {
    console.error('Store products generation error:', error);
  }
};

// Get all stores
export const getStores = async (req, res) => {
  try {
    const { status, owner } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (owner) {
      query.owner = owner;
    }

    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stores,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
  }
};

// Get single store
export const getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('products');

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch store', error: error.message });
  }
};

// Update store
export const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check ownership
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      store: updatedStore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update store', error: error.message });
  }
};

// Delete store
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check ownership or admin
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Store.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store', error: error.message });
  }
};

// Get store analytics
export const getStoreAnalytics = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check ownership
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const products = await Product.find({ store: req.params.id });
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);

    res.json({
      success: true,
      analytics: {
        storeViews: store.analytics.views,
        totalProductViews: totalViews,
        totalSales,
        productCount: products.length,
        activeProducts: products.filter(p => p.status === 'active').length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

