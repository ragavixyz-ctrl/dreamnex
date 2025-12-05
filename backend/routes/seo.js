import express from 'express';
import {
  generateSEOTitle,
  generateMetaDescription,
  generateKeywords,
  generateBlogPost,
} from '../controllers/seoController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/title', protect, generateSEOTitle);
router.post('/meta-description', protect, generateMetaDescription);
router.post('/keywords', protect, generateKeywords);
router.post('/blog-post', protect, generateBlogPost);

export default router;

