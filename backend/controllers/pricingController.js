import openai from '../config/openai.js';
import Product from '../models/Product.js';

// AI Pricing Suggestion
export const suggestPrice = async (req, res) => {
  try {
    const { productName, category, cost, description } = req.body;
    
    if (!productName || !category) {
      return res.status(400).json({ message: 'Product name and category are required' });
    }
    
    // Get similar products for competitor analysis
    const similarProducts = await Product.find({
      category,
      status: 'active',
    })
      .select('name price category')
      .limit(10)
      .sort({ sales: -1 });
    
    const competitorPrices = similarProducts.map(p => ({
      name: p.name,
      price: p.price,
    }));
    
    const prompt = `Analyze pricing for a product and suggest the optimal price.

Product Name: ${productName}
Category: ${category}
Cost: ${cost ? `$${cost}` : 'Not provided'}
Description: ${description || 'Not provided'}

Competitor Analysis:
${competitorPrices.length > 0 
  ? competitorPrices.map(p => `- ${p.name}: $${p.price}`).join('\n')
  : 'No similar products found'
}

Based on:
1. Competitor pricing analysis
2. Product category trends
3. Cost structure (if provided)
4. Market demand indicators

Provide:
1. Suggested price (optimal price point)
2. Price range (min-max)
3. Pricing strategy (premium, competitive, budget)
4. Reasoning (2-3 sentences)
5. Market positioning

Format as JSON with keys: suggestedPrice, minPrice, maxPrice, strategy, reasoning, positioning.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a pricing analyst. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    const pricingData = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      pricing: {
        suggested: parseFloat(pricingData.suggestedPrice) || 0,
        min: parseFloat(pricingData.minPrice) || 0,
        max: parseFloat(pricingData.maxPrice) || 0,
        strategy: pricingData.strategy || 'competitive',
        reasoning: pricingData.reasoning || '',
        positioning: pricingData.positioning || '',
        competitorAnalysis: competitorPrices,
      },
    });
  } catch (error) {
    console.error('Pricing suggestion error:', error);
    res.status(500).json({ message: 'Failed to generate pricing suggestion', error: error.message });
  }
};

