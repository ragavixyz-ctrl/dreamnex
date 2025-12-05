import express from 'express';
import { suggestPrice } from '../controllers/pricingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/suggest', protect, suggestPrice);

export default router;

