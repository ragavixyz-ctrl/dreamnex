import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOtpEmail,
} from '../utils/email.js';
import { generateToken } from '../utils/jwt.js';
import { generateOtp, getOtpCooldownRemaining } from '../utils/otp.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  emailVerified: user.emailVerified,
  isEmailVerified: user.emailVerified,
  avatarUrl: user.avatarUrl,
  googleId: user.googleId,
});

const handleSendOtp = async (user) => {
  const otp = generateOtp();
  await user.setOtp(otp);
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.lastOtpSentAt = new Date();
  await user.save();
  await sendOtpEmail(user.email, user.name, otp);
  return otp;
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    
    // If user exists but not verified, resend OTP instead of error
    if (existing) {
      if (!existing.emailVerified) {
        try {
          await handleSendOtp(existing);
          return res.status(200).json({
            success: true,
            message: 'OTP resent to email',
            userId: existing._id.toString(),
          });
        } catch (emailError) {
          console.error('OTP resend error:', emailError);
          return res.status(500).json({
            success: false,
            message: 'User exists but failed to send OTP. Please try again or contact support.',
          });
        }
      } else {
        return res.status(409).json({ success: false, message: 'User already exists and is verified. Please login instead.' });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      emailVerified: false,
    });

    // Try to send OTP, but don't fail signup if email fails
    try {
      await handleSendOtp(user);
      return res.status(201).json({
        success: true,
        message: 'OTP sent to email',
        userId: user._id.toString(),
      });
    } catch (emailError) {
      console.error('OTP email error:', emailError);
      // User is created, but email failed - still return success with userId
      // User can use resend OTP later
      return res.status(201).json({
        success: true,
        message: 'Account created but OTP email failed. Please use resend OTP.',
        userId: user._id.toString(),
        emailFailed: true,
      });
    }
  } catch (error) {
    console.error('Signup error', error);
    // Check if it's a duplicate key error (user was created in a race condition)
    if (error.code === 11000 || error.message?.includes('duplicate')) {
      const existing = await User.findOne({ email: req.body.email });
      if (existing && !existing.emailVerified) {
        try {
          await handleSendOtp(existing);
          return res.status(200).json({
            success: true,
            message: 'OTP resent to email',
            userId: existing._id.toString(),
          });
        } catch (emailError) {
          return res.status(500).json({
            success: false,
            message: 'Account exists but failed to send OTP. Please try resend OTP.',
          });
        }
      }
    }
    return res.status(500).json({ success: false, message: 'Failed to sign up: ' + (error.message || 'Unknown error') });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId).select('+otp');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }
    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired, please resend' });
    }
    const isValid = await user.verifyOtp(otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const token = generateToken(user);
    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Verify OTP error', error);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email, userId } = req.body;
    const user = email
      ? await User.findOne({ email })
      : await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }
    const remaining = getOtpCooldownRemaining(user.lastOtpSentAt);
    if (remaining > 0) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(remaining)}s before requesting another OTP`,
      });
    }
    await handleSendOtp(user);
    return res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error', error);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.emailVerified) {
      return res
        .status(403)
        .json({ success: false, message: 'Please verify your email before logging in' });
    }
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please continue with Google.',
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Missing Google ID token' });
    }
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.given_name || 'DreamNex User';
    const avatarUrl = payload.picture;

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    }).select('+password');

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      user.emailVerified = true;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      if (!user.name && name) user.name = name;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatarUrl,
        emailVerified: true,
      });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Google auth error', error);
    return res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

export const ping = (req, res) => {
  res.json({ success: true, message: 'pong' });
};

// Legacy endpoints for backwards compatibility
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email exists, a password reset link has been sent' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({ message: 'If that email exists, a password reset link has been sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        interests: user.interests,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please change your password through Google.',
      });
    }

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error', error);
    return res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin account deletion
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be deleted',
      });
    }

    // Import models dynamically to avoid circular dependencies
    const Cart = (await import('../models/Cart.js')).default;
    const Wishlist = (await import('../models/Wishlist.js')).default;
    const Order = (await import('../models/Order.js')).default;
    const Store = (await import('../models/Store.js')).default;
    const Product = (await import('../models/Product.js')).default;

    // Delete user's cart
    await Cart.deleteOne({ user: userId });

    // Delete user's wishlist
    await Wishlist.deleteOne({ user: userId });

    // Get all stores owned by user
    const userStores = await Store.find({ owner: userId });

    // Delete all products in user's stores
    for (const store of userStores) {
      await Product.deleteMany({ store: store._id });
    }

    // Delete user's stores
    await Store.deleteMany({ owner: userId });

    // Note: We keep orders for business records, but they will have orphaned user references
    // You could anonymize them if needed:
    // await Order.updateMany({ user: userId }, { $unset: { user: 1 } });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    return res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error', error);
    return res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};
