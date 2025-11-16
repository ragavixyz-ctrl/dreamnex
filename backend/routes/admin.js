import express from 'express';
import {
  approveStore,
  rejectStore,
  getUsers,
  getAnalytics,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

router.put('/stores/:id/approve', approveStore);
router.put('/stores/:id/reject', rejectStore);
router.get('/users', getUsers);
router.get('/analytics', getAnalytics);
router.put('/users/:id/role', updateUserRole);

export default router;

