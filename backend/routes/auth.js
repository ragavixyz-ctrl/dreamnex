import express from 'express';
import { body } from 'express-validator';
import {
  signup,
  verifyOtp,
  resendOtp,
  login,
  googleAuth,
  ping,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest,
  ],
  signup
);

router.post(
  '/verify-otp',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    validateRequest,
  ],
  verifyOtp
);

router.post(
  '/resend-otp',
  [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('userId').optional().notEmpty().withMessage('User ID is required when email missing'),
    body()
      .custom((value, { req }) => {
        if (!req.body.email && !req.body.userId) {
          throw new Error('Email or userId is required');
        }
        return true;
      })
      .withMessage('Email or userId is required'),
    validateRequest,
  ],
  resendOtp
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest,
  ],
  login
);

router.post(
  '/google',
  [body('idToken').notEmpty().withMessage('Google ID token is required'), validateRequest],
  googleAuth
);

router.get('/ping', ping);

// Legacy routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;

