# DreamNex Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- OpenAI API key
- Cloudinary account (for image storage)
- Email service credentials (Gmail or similar for email verification)

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Backend Setup

1. Navigate to `backend/` directory
2. Copy `env.example` to `.env` (the dotfile is ignored in git, so we keep the template without the dot):
   ```bash
   cp env.example .env
   ```
3. Fill in your environment variables in `backend/.env` (see README for full list). Key values:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dreamnex
   JWT_SECRET=change_this_secret
   JWT_EXPIRES_IN=7d
   OPENAI_API_KEY=sk-...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   EMAIL_USER=your_dreamnex_sender@gmail.com
   EMAIL_PASS=your_google_app_password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   ```
   👉 Follow [`SETUP_AUTH.md`](./SETUP_AUTH.md) for detailed Gmail App Password & Google OAuth instructions.

### 3. Frontend Setup

1. Navigate to `frontend/` directory
2. Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### 4. Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 5. Run the Application

From the root directory:
```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

Or run separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Getting API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and add to `OPENAI_API_KEY` in backend `.env`

### Cloudinary Setup
1. Go to https://cloudinary.com/
2. Sign up for a free account
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret
5. Add to backend `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Email Setup (Gmail)
1. Enable 2-Step Verification on your Google Account
2. Go to App Passwords: https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use this password in `EMAIL_PASS` in backend `.env`
5. Use your Gmail address in `EMAIL_USER`

## Features

### AI Features
- ✅ Brand Logo Generation
- ✅ Product Design Generation
- ✅ Brand Style Guide (Colors & Typography)
- ✅ Brand Story Generation
- ✅ Website Mockups
- ✅ Marketing Ads Generation
- ✅ Product Descriptions
- ✅ AI Shopping Assistant Chatbot
- ✅ Product Recommendations

### Store Features
- ✅ AI Store Creation
- ✅ Store Logo & Theme Generation
- ✅ AI Product Listings (5-10 products)
- ✅ Store Marketing Posts
- ✅ Social Media Ads

### User Features
- ✅ User Registration & Login
- ✅ Email Verification
- ✅ Password Reset
- ✅ Personalized Homepage
- ✅ Browsing History Tracking

### Admin Features
- ✅ Store Approval System
- ✅ User Management
- ✅ Analytics Dashboard

## Project Structure

```
dreamnex/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Express server
├── frontend/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities and API client
│   └── public/          # Static assets
└── package.json         # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register + send OTP
- `POST /api/auth/verify-otp` - Verify OTP & get JWT
- `POST /api/auth/resend-otp` - Resend OTP (30s cooldown)
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Login via Google ID token
- `GET /api/auth/ping` - Health check
- `POST /api/auth/register` - **Legacy** register with email verification link
- `POST /api/auth/verify-email` - **Legacy** verify email token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### AI Features
- `POST /api/ai/brand-logo` - Generate brand logo
- `POST /api/ai/product-design` - Generate product designs
- `POST /api/ai/brand-style` - Generate brand style guide
- `POST /api/ai/brand-story` - Generate brand story
- `POST /api/ai/mockup` - Generate website mockups
- `POST /api/ai/marketing-ads` - Generate marketing ads
- `POST /api/ai/product-description` - Generate product description
- `POST /api/ai/chat` - AI shopping assistant
- `POST /api/ai/recommend` - Get product recommendations

### Stores
- `POST /api/stores/create` - Create AI store
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store
- `GET /api/stores/:id/analytics` - Get store analytics

### Admin
- `PUT /api/admin/stores/:id/approve` - Approve store
- `PUT /api/admin/stores/:id/reject` - Reject store
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - Get platform analytics
- `PUT /api/admin/users/:id/role` - Update user role

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### OpenAI API Errors
- Verify your API key is correct
- Check you have sufficient credits
- Ensure you're using GPT-4 compatible models

### Cloudinary Upload Errors
- Verify all Cloudinary credentials are correct
- Check your Cloudinary account limits

### Email Not Sending
- Verify email credentials
- For Gmail, ensure you're using an App Password, not your regular password
- Check spam folder

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Use environment variables for all secrets
4. Deploy to services like:
   - Heroku
   - Railway
   - Render
   - AWS/DigitalOcean

### Frontend
1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy to:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify

3. Update `NEXT_PUBLIC_API_URL` to your production backend URL

## License

MIT

