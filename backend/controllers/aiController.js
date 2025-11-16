import openai from '../config/openai.js';
import cloudinary from '../config/cloudinary.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';

// Generate Brand Logo
export const generateBrandLogo = async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    // Generate logo using DALL-E
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Modern, professional logo for "${brandName}". Clean design, vector style, suitable for e-commerce brand. Minimalist, scalable logo design.`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageUrl = response.data[0].url;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dreamnex/logos',
      resource_type: 'image',
    });

    res.json({
      success: true,
      logoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Logo generation error:', error);
    res.status(500).json({ message: 'Failed to generate logo', error: error.message });
  }
};

// Generate Product Design
export const generateProductDesign = async (req, res) => {
  try {
    const { productIdea, count = 3 } = req.body;

    if (!productIdea) {
      return res.status(400).json({ message: 'Product idea is required' });
    }

    const images = [];
    const numImages = Math.min(parseInt(count), 5); // Max 5 images

    for (let i = 0; i < numImages; i++) {
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: `Professional product photography of ${productIdea}. High quality, e-commerce style, white background, studio lighting, product-focused.`,
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        });

        const imageUrl = response.data[0].url;
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
          folder: 'dreamnex/products',
          resource_type: 'image',
        });

        images.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error);
      }
    }

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('Product design generation error:', error);
    res.status(500).json({ message: 'Failed to generate product designs', error: error.message });
  }
};

// Generate Brand Style (Colors & Typography)
export const generateBrandStyle = async (req, res) => {
  try {
    const { brandName, niche } = req.body;

    const prompt = `Generate a complete brand style guide for "${brandName}" in the ${niche || 'e-commerce'} niche. 
    Provide:
    1. Primary colors (3-5 hex codes)
    2. Secondary colors (3-5 hex codes)
    3. Accent colors (2-3 hex codes)
    4. Font suggestions (3-5 modern, web-safe font combinations)
    5. Mood board description (2-3 sentences describing the brand aesthetic)
    
    Format as JSON with keys: primaryColors, secondaryColors, accentColors, fonts, moodBoard.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional brand designer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const styleData = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      style: {
        primaryColors: styleData.primaryColors || [],
        secondaryColors: styleData.secondaryColors || [],
        accentColors: styleData.accentColors || [],
        fonts: styleData.fonts || [],
        moodBoard: styleData.moodBoard || '',
      },
    });
  } catch (error) {
    console.error('Brand style generation error:', error);
    res.status(500).json({ message: 'Failed to generate brand style', error: error.message });
  }
};

// Generate Brand Story
export const generateBrandStory = async (req, res) => {
  try {
    const { brandName, niche } = req.body;

    const prompt = `Create a compelling brand story for "${brandName}" in the ${niche || 'e-commerce'} niche.
    Include:
    1. A catchy tagline (one sentence)
    2. Brand story (3-4 paragraphs)
    3. Mission statement (2-3 sentences)
    4. Vision statement (2-3 sentences)
    
    Format as JSON with keys: tagline, story, mission, vision.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional brand storyteller. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const storyData = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      brandStory: {
        tagline: storyData.tagline || '',
        story: storyData.story || '',
        mission: storyData.mission || '',
        vision: storyData.vision || '',
      },
    });
  } catch (error) {
    console.error('Brand story generation error:', error);
    res.status(500).json({ message: 'Failed to generate brand story', error: error.message });
  }
};

// Generate Website Mockups
export const generateMockup = async (req, res) => {
  try {
    const { brandDetails } = req.body;

    const mockups = [];

    // Generate hero banner
    try {
      const heroResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Modern e-commerce website hero banner for ${brandDetails.name || 'brand'}. Professional, clean design with ${brandDetails.colors || 'modern colors'}. Include placeholder for headline and CTA button.`,
        n: 1,
        size: '1792x1024',
        response_format: 'url',
      });

      const heroUrl = heroResponse.data[0].url;
      const heroUpload = await cloudinary.uploader.upload(heroUrl, {
        folder: 'dreamnex/mockups',
      });

      mockups.push({
        type: 'hero',
        url: heroUpload.secure_url,
        publicId: heroUpload.public_id,
      });
    } catch (error) {
      console.error('Hero banner generation error:', error);
    }

    // Generate homepage preview
    try {
      const homepageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `E-commerce homepage mockup design. Modern layout with header, product grid, and footer. Clean, professional design.`,
        n: 1,
        size: '1792x1024',
        response_format: 'url',
      });

      const homepageUrl = homepageResponse.data[0].url;
      const homepageUpload = await cloudinary.uploader.upload(homepageUrl, {
        folder: 'dreamnex/mockups',
      });

      mockups.push({
        type: 'homepage',
        url: homepageUpload.secure_url,
        publicId: homepageUpload.public_id,
      });
    } catch (error) {
      console.error('Homepage mockup generation error:', error);
    }

    // Generate product layout
    try {
      const productLayoutResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `E-commerce product listing page mockup. Grid layout showing multiple products with images, titles, and prices.`,
        n: 1,
        size: '1792x1024',
        response_format: 'url',
      });

      const productLayoutUrl = productLayoutResponse.data[0].url;
      const productLayoutUpload = await cloudinary.uploader.upload(productLayoutUrl, {
        folder: 'dreamnex/mockups',
      });

      mockups.push({
        type: 'product-layout',
        url: productLayoutUpload.secure_url,
        publicId: productLayoutUpload.public_id,
      });
    } catch (error) {
      console.error('Product layout generation error:', error);
    }

    res.json({
      success: true,
      mockups,
    });
  } catch (error) {
    console.error('Mockup generation error:', error);
    res.status(500).json({ message: 'Failed to generate mockups', error: error.message });
  }
};

// Generate Marketing Ads
export const generateMarketingAds = async (req, res) => {
  try {
    const { brand, product } = req.body;

    const ads = [];

    // Generate poster
    try {
      const posterResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Modern marketing poster for ${brand || 'brand'} featuring ${product || 'product'}. Eye-catching design with bold typography, vibrant colors, and clear call-to-action.`,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      const posterUrl = posterResponse.data[0].url;
      const posterUpload = await cloudinary.uploader.upload(posterUrl, {
        folder: 'dreamnex/ads',
      });

      ads.push({
        type: 'poster',
        url: posterUpload.secure_url,
        publicId: posterUpload.public_id,
      });
    } catch (error) {
      console.error('Poster generation error:', error);
    }

    // Generate banner
    try {
      const bannerResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Web banner ad for ${brand || 'brand'} - ${product || 'product'}. Horizontal format, professional design.`,
        n: 1,
        size: '1792x1024',
        response_format: 'url',
      });

      const bannerUrl = bannerResponse.data[0].url;
      const bannerUpload = await cloudinary.uploader.upload(bannerUrl, {
        folder: 'dreamnex/ads',
      });

      ads.push({
        type: 'banner',
        url: bannerUpload.secure_url,
        publicId: bannerUpload.public_id,
      });
    } catch (error) {
      console.error('Banner generation error:', error);
    }

    // Generate social media ad
    try {
      const socialResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Instagram-style social media ad for ${brand || 'brand'}. Square format, modern aesthetic, engaging design.`,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      const socialUrl = socialResponse.data[0].url;
      const socialUpload = await cloudinary.uploader.upload(socialUrl, {
        folder: 'dreamnex/ads',
      });

      ads.push({
        type: 'social',
        url: socialUpload.secure_url,
        publicId: socialUpload.public_id,
      });
    } catch (error) {
      console.error('Social ad generation error:', error);
    }

    res.json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error('Marketing ads generation error:', error);
    res.status(500).json({ message: 'Failed to generate marketing ads', error: error.message });
  }
};

// Generate Product Description
export const generateProductDescription = async (req, res) => {
  try {
    const { productName, productDetails } = req.body;

    const prompt = `Create a comprehensive product description for "${productName}".
    ${productDetails ? `Product details: ${productDetails}` : ''}
    
    Provide:
    1. SEO-optimized description (2-3 paragraphs)
    2. Key bullet points (5-7 points)
    3. Product highlights (3-5 highlights)
    
    Format as JSON with keys: seoDescription, bulletPoints, highlights.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional e-commerce copywriter. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const descriptionData = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      description: {
        seo: descriptionData.seoDescription || '',
        bullets: descriptionData.bulletPoints || [],
        highlights: descriptionData.highlights || [],
      },
    });
  } catch (error) {
    console.error('Product description generation error:', error);
    res.status(500).json({ message: 'Failed to generate product description', error: error.message });
  }
};

// AI Shopping Assistant Chat
export const chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user's browsing history and interests
    let userContext = '';
    if (userId) {
      const user = await User.findById(userId).populate('browsingHistory.productId');
      if (user) {
        userContext = `User interests: ${user.interests.join(', ') || 'none'}. `;
        if (user.browsingHistory.length > 0) {
          const recentProducts = user.browsingHistory.slice(0, 5).map(h => h.productId?.name).filter(Boolean);
          if (recentProducts.length > 0) {
            userContext += `Recently viewed: ${recentProducts.join(', ')}. `;
          }
        }
      }
    }

    // Get available products for context
    const products = await Product.find({ status: 'active' }).limit(10).select('name category price');
    const productContext = products.map(p => `${p.name} (${p.category}) - $${p.price}`).join(', ');

    const systemPrompt = `You are a helpful AI shopping assistant for DreamNex, an AI-powered e-commerce platform.
    Your role is to:
    - Help users find products
    - Answer questions about products and brands
    - Provide recommendations based on user interests
    - Assist with checkout and shopping decisions
    
    ${userContext}
    Available products: ${productContext}
    
    Be friendly, helpful, and concise.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...(context || []),
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    // Save chat message if user is authenticated
    if (userId) {
      await ChatMessage.create({
        user: userId,
        message,
        response,
        context: context || {},
      });
    }

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process chat', error: error.message });
  }
};

// AI Product Recommendations
export const recommend = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(userId).populate('browsingHistory.productId');

    // Build recommendation context
    const interests = user.interests || [];
    const recentProducts = user.browsingHistory.slice(0, 10).map(h => h.productId).filter(Boolean);
    const categories = [...new Set(recentProducts.map(p => p?.category).filter(Boolean))];

    // Get products based on interests and browsing history
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

    if (categories.length > 0) {
      const categoryProducts = await Product.find({
        category: { $in: categories },
        status: 'active',
        _id: { $nin: recommendedProducts.map(p => p._id) },
      }).limit(10);
      recommendedProducts.push(...categoryProducts);
    }

    // Get trending products (most viewed)
    const trendingProducts = await Product.find({
      status: 'active',
      _id: { $nin: recommendedProducts.map(p => p._id) },
    })
      .sort({ views: -1 })
      .limit(10);

    recommendedProducts.push(...trendingProducts);

    // Remove duplicates and limit
    const uniqueProducts = Array.from(
      new Map(recommendedProducts.map(p => [p._id.toString(), p])).values()
    ).slice(0, 20);

    res.json({
      success: true,
      products: uniqueProducts.map(p => ({
        id: p._id,
        name: p.name,
        description: p.shortDescription || p.description,
        price: p.price,
        images: p.images,
        category: p.category,
      })),
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
};

