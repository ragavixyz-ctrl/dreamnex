import openai from '../config/openai.js';

// Generate SEO-friendly title
export const generateSEOTitle = async (req, res) => {
  try {
    const { productName, category, description } = req.body;
    
    const prompt = `Generate an SEO-optimized page title for this product:

Product: ${productName}
Category: ${category}
Description: ${description || 'Not provided'}

Requirements:
- 50-60 characters max
- Include primary keyword
- Compelling and click-worthy
- Include brand/product name

Provide 3 title options. Format as JSON with key "titles" as an array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO specialist. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    const data = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      titles: data.titles || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate SEO title', error: error.message });
  }
};

// Generate meta description
export const generateMetaDescription = async (req, res) => {
  try {
    const { productName, category, description } = req.body;
    
    const prompt = `Generate an SEO-optimized meta description for this product:

Product: ${productName}
Category: ${category}
Description: ${description || 'Not provided'}

Requirements:
- 150-160 characters
- Include primary keyword naturally
- Compelling call-to-action
- Highlight key benefits

Provide 3 meta description options. Format as JSON with key "descriptions" as an array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO specialist. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    const data = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      descriptions: data.descriptions || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate meta description', error: error.message });
  }
};

// Generate keywords
export const generateKeywords = async (req, res) => {
  try {
    const { productName, category, description } = req.body;
    
    const prompt = `Generate SEO keywords for this product:

Product: ${productName}
Category: ${category}
Description: ${description || 'Not provided'}

Provide:
1. Primary keyword (1)
2. Secondary keywords (5-7)
3. Long-tail keywords (3-5)
4. Related terms (5-7)

Format as JSON with keys: primary, secondary, longTail, related.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO specialist. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    const data = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      keywords: {
        primary: data.primary || '',
        secondary: data.secondary || [],
        longTail: data.longTail || [],
        related: data.related || [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate keywords', error: error.message });
  }
};

// Generate blog post
export const generateBlogPost = async (req, res) => {
  try {
    const { topic, category, targetAudience, length = 'medium' } = req.body;
    
    const lengthMap = {
      short: '300-500 words',
      medium: '800-1200 words',
      long: '1500-2000 words',
    };
    
    const prompt = `Write an SEO-optimized blog post for an e-commerce platform.

Topic: ${topic}
Category: ${category}
Target Audience: ${targetAudience || 'General consumers'}
Length: ${lengthMap[length] || lengthMap.medium}

Requirements:
- SEO-friendly structure with headings
- Include relevant keywords naturally
- Engaging and informative
- Include a call-to-action
- Proper formatting with H2, H3 headings

Format as JSON with keys: title, introduction, sections (array of {heading, content}), conclusion, metaTitle, metaDescription.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer and SEO specialist. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    const data = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      blogPost: {
        title: data.title || '',
        introduction: data.introduction || '',
        sections: data.sections || [],
        conclusion: data.conclusion || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate blog post', error: error.message });
  }
};

