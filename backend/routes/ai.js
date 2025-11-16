import express from 'express';
import {
  generateBrandLogo,
  generateProductDesign,
  generateBrandStyle,
  generateBrandStory,
  generateMockup,
  generateMarketingAds,
  generateProductDescription,
  chat,
  recommend,
} from '../controllers/aiController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/brand-logo', generateBrandLogo);
router.post('/product-design', generateProductDesign);
router.post('/brand-style', generateBrandStyle);
router.post('/brand-story', generateBrandStory);
router.post('/mockup', generateMockup);
router.post('/marketing-ads', generateMarketingAds);
router.post('/product-description', generateProductDescription);
router.post('/chat', protect, chat);
router.post('/recommend', protect, recommend);

export default router;

