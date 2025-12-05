import express from 'express';
import {
  enhanceProductPhoto,
  generateMockup,
} from '../controllers/productEnhancerController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/enhance', protect, enhanceProductPhoto);
router.post('/mockup', protect, generateMockup);

export default router;

