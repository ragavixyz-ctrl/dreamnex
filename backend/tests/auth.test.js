import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import User from '../models/User.js';

jest.mock('../utils/email.js', () => ({
  sendOtpEmail: jest.fn().mockResolvedValue(true),
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

const mockVerifyIdToken = jest.fn().mockResolvedValue({
  getPayload: () => ({
    sub: 'google-123',
    email: 'google@example.com',
    name: 'Google Tester',
    picture: 'https://example.com/avatar.png',
  }),
});

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
  };
});

describe('Auth Routes', () => {
  it('POST /api/auth/ping should return pong', async () => {
    const res = await request(app).get('/api/auth/ping');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, message: 'pong' });
  });

  it('should handle signup -> verify OTP -> login', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(signupRes.status).toBe(201);
    expect(signupRes.body.success).toBe(true);
    const { userId } = signupRes.body;

    const user = await User.findById(userId);
    user.otp = await bcrypt.hash('123456', 10);
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    const verifyRes = await request(app).post('/api/auth/verify-otp').send({
      userId,
      otp: '123456',
    });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toHaveProperty('token');
    expect(verifyRes.body.user.emailVerified).toBe(true);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body.user.emailVerified).toBe(true);
  });

  it('should authenticate via Google id token', async () => {
    const res = await request(app).post('/api/auth/google').send({
      idToken: 'fake-token',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('google@example.com');
  });
});

