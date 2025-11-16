import express from 'express';
import {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
  getStoreAnalytics,
} from '../controllers/storeController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', protect, createStore);
router.get('/', getStores);
router.get('/:id', getStore);
router.put('/:id', protect, updateStore);
router.delete('/:id', protect, deleteStore);
router.get('/:id/analytics', protect, getStoreAnalytics);

export default router;

