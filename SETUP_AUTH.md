# DreamNex Auth Setup Guide

This guide walks through configuring Gmail SMTP, Google OAuth, and OTP email delivery for DreamNex.

---

## 1. Gmail SMTP (App Password)
DreamNex uses Nodemailer with Gmail SMTP. Google requires App Passwords when 2FA is enabled.

1. Enable **2-Step Verification** on your Google account (https://myaccount.google.com/security).
2. Visit **App Passwords** (https://myaccount.google.com/apppasswords).
3. Choose **Mail** for the app and **Other (Custom)** (e.g., “DreamNex”).
4. Generate the password, copy it, and store in `EMAIL_PASS`.
5. Set `EMAIL_USER` to your Gmail address.

> Never commit your App Password. Rotate it if credentials leak.

---

## 2. Google OAuth (ID Token Flow)
DreamNex uses Google Identity Services on the frontend and verifies ID tokens on the backend.

### Create OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or reuse an existing one).
3. Enable **Google Identity Services** (OAuth consent screen). Add `dreamnex.com` or your development domain as needed.
4. Create **OAuth Client ID** (Web application).
5. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
6. Add **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (for completeness even though we use ID-token flow).
7. Copy the **Client ID** and **Client Secret**.

### Environment Variables
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
```

---

## 3. OTP Email Flow
1. Users sign up with email/password → server generates a 6-digit OTP.
2. OTP is hashed + stored with a 10-minute expiry.
3. Nodemailer sends the OTP via Gmail SMTP.
4. Users submit OTP → server verifies and issues JWT.
5. `/api/auth/resend-otp` enforces a 30-second cooldown (`lastOtpSentAt`).

Troubleshooting:
- Ensure Gmail App Password is valid; double-check `EMAIL_HOST=smtp.gmail.com`, `EMAIL_PORT=465`.
- Less secure app access must be disabled (App Password handles the rest).
- If emails hit spam, add content or SPF/DKIM records on your domain.

---

## 4. Local Testing Checklist
1. `backend/.env` contains all variables from `backend/env.example`.
2. Run backend tests to verify auth flows:
   ```bash
   cd backend
   npm test
   ```
3. Run the app and try:
   - Signup + OTP verification
   - Resend OTP (observe cooldown)
   - Google Sign-In (requires valid client ID and HTTPS in production)

---

## 5. Production Notes
- Use a dedicated Gmail/Google Workspace account for DreamNex emails.
- Consider switching to a transactional email service (SendGrid, SES) if Gmail rate limits become an issue.
- Configure OAuth consent screen for production (verified domain, logo, privacy policy).
- Serve the frontend over HTTPS so Google Identity Services work without warnings.

Happy building!

