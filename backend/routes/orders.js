import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  confirmPayment,
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/:id/confirm-payment', confirmPayment);
router.put('/:id/status', admin, updateOrderStatus); // Admin only

export default router;

