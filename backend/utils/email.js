import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"DreamNex" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to DreamNex!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;
  return sendEmail(email, 'Verify Your DreamNex Account', html);
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail(email, 'Reset Your DreamNex Password', html);
};

export const sendOtpEmail = async (email, name, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi ${name || 'there'},</h2>
      <p>Your DreamNex verification code is:</p>
      <div style="font-size: 32px; letter-spacing: 6px; font-weight: bold; margin: 20px 0;">${otp}</div>
      <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      <p>Thanks,<br/>DreamNex Team</p>
    </div>
  `;
  return sendEmail(email, 'Your DreamNex Verification Code', html);
};

