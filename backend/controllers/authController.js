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
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
      emailVerified: false,
    });
    await handleSendOtp(user);
    return res.status(201).json({
      success: true,
      message: 'OTP sent to email',
      userId: user._id,
    });
  } catch (error) {
    console.error('Signup error', error);
    return res.status(500).json({ success: false, message: 'Failed to sign up' });
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
