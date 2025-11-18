# DreamNex - AI-Powered E-Commerce Platform

DreamNex is a complete AI-powered e-commerce platform where AI builds brands, products, and online stores for users.

## 🚀 Features

- **AI Brand Generation**: Logos, color palettes, typography, brand stories
- **AI Product Design**: Generate product images and descriptions
- **AI Store Creation**: Complete online stores with AI-generated content
- **AI Marketing**: Generate ads, posters, and social media content
- **AI Shopping Assistant**: Chatbot for product recommendations
- **Advanced Authentication**:
  - Email/password with OTP verification & resend flow
  - Google Sign-In (OAuth 2.0, ID-token verification)
  - JWT session handling with protected APIs
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

1. **Install dependencies**
   ```bash
   npm run install:all
   ```
2. **Configure environment variables**
   - Backend: copy `backend/env.example` to `backend/.env` (dotfiles are blocked in repo root, so we provide `env.example`)
   - Frontend: copy `frontend/env.local.example` to `frontend/.env.local`
   - Fill in the values described below. See [`SETUP_AUTH.md`](./SETUP_AUTH.md) for detailed Google/Gmail steps.
3. **Run development servers**
   ```bash
   npm run dev
   ```
4. **Seed (optional)** — creates an admin user
   ```bash
   cd backend
   npm run seed
   ```

## 🔧 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/dreamnex
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
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

👉 Detailed walkthroughs for Gmail App Passwords, Google OAuth credentials, and OTP email configuration live in [`SETUP_AUTH.md`](./SETUP_AUTH.md).

## 📁 Project Structure

```
dreamnex/
├── frontend/          # Next.js application
├── backend/           # Express API server
└── package.json       # Root package.json
```

## 🎯 Authentication & API Guides

### Auth Endpoints (email/password + OTP + Google OAuth)
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/auth/signup` | Register with name/email/password, send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP `{ userId, otp }` and receive JWT |
| POST | `/api/auth/resend-otp` | Resend OTP via `{ email }` or `{ userId }` (30s cooldown) |
| POST | `/api/auth/login` | Email/password login (only after emailVerified) |
| POST | `/api/auth/google` | Google ID-token login (`{ idToken }`) |
| GET | `/api/auth/ping` | Health check `{ success:true, message:"pong" }` |
| POST | `/api/auth/register` | _Legacy_ registration (email verification link) |
| POST | `/api/auth/verify-email` | _Legacy_ email verification |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password via token |
| GET | `/api/auth/me` | Get current user (JWT required) |

#### Sample cURL Flow

```bash
# 1. Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"Pass1234"}'

# 2. Verify OTP (replace USER_ID + OTP)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","otp":"123456"}'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"Pass1234"}'

# 4. Google login (ID token obtained on frontend)
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<GOOGLE_ID_TOKEN>"}'
```

### AI & Store APIs (unchanged)
- `POST /api/ai/brand-logo` – Generate brand logo
- `POST /api/ai/product-design` – Generate product designs
- `POST /api/ai/brand-style` – Generate brand color palette
- `POST /api/ai/brand-story` – Generate brand story
- `POST /api/ai/mockup` – Generate website mockups
- `POST /api/ai/marketing-ads` – Generate marketing ads
- `POST /api/ai/product-description` – Generate product descriptions
- `POST /api/ai/chat` – AI shopping assistant
- `POST /api/ai/recommend` – Product recommendations

### Store APIs
- `POST /api/stores/create` – Create AI store
- `GET /api/stores` – List stores
- `GET /api/stores/:id` – Store details
- `GET /api/stores/:id/analytics` – Store analytics (auth required)

👉 See `PROJECT_SUMMARY.md` for a complete architecture & file tree overview.

## ✅ Testing

Backend tests (Jest + Supertest + mongodb-memory-server):
```bash
cd backend
npm test
```

The suite covers signup/OTP/login, Google auth, and health checks. Feel free to extend `backend/tests` with more cases.

## 📚 Additional Docs

- [`SETUP.md`](./SETUP.md) – project-wide setup guide
- [`SETUP_AUTH.md`](./SETUP_AUTH.md) – Gmail App Passwords, Google OAuth credentials, OTP email troubleshooting
- [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) – architecture & feature map

## 🛟 Security Notes

- Passwords (and OTP codes) are hashed via bcrypt before storage.
- OTP codes expire after 10 minutes and resend is rate limited (30s).
- Google ID tokens are verified server-side with `google-auth-library`.
- JWT secrets must never be exposed to the frontend — keep them in the backend `.env` only.
- Rotate Gmail App Passwords / Google OAuth credentials if compromised.

## 📝 License

MIT

