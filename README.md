# DreamNex - AI-Powered E-Commerce Platform

DreamNex is a complete AI-powered e-commerce platform where AI builds brands, products, and online stores for users.

## 🚀 Features

- **AI Brand Generation**: Logos, color palettes, typography, brand stories
- **AI Product Design**: Generate product images and descriptions
- **AI Store Creation**: Complete online stores with AI-generated content
- **AI Marketing**: Generate ads, posters, and social media content
- **AI Shopping Assistant**: Chatbot for product recommendations
- **User Authentication**: JWT-based auth with email verification
- **Admin Panel**: Store approval and user management
- **Store Dashboard**: Analytics and product management

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- OpenAI API

## 📦 Installation

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
- Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories
- Fill in your API keys and configuration

3. Run development servers:
```bash
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dreamnex
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
dreamnex/
├── frontend/          # Next.js application
├── backend/           # Express API server
└── package.json       # Root package.json
```

## 🎯 API Endpoints

### AI Features
- `POST /api/ai/brand-logo` - Generate brand logo
- `POST /api/ai/product-design` - Generate product designs
- `POST /api/ai/brand-style` - Generate brand color palette
- `POST /api/ai/brand-story` - Generate brand story
- `POST /api/ai/mockup` - Generate website mockups
- `POST /api/ai/marketing-ads` - Generate marketing ads
- `POST /api/ai/product-description` - Generate product descriptions
- `POST /api/ai/chat` - AI shopping assistant
- `POST /api/ai/recommend` - Product recommendations

### Store Features
- `POST /api/stores/create` - Create AI store
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store details

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

## 📝 License

MIT

