# SocialBoost Platform

A comprehensive social media management platform powered by AI, designed for the Arab market with local payment methods and dialect-specific content generation.

## Overview

SocialBoost is a Progressive Web App (PWA) that enables users to manage and grow their social media presence across Facebook, Instagram, Twitter, and TikTok with AI-powered content generation, local trend analysis, and multi-currency payment processing.

## Features

### Core Features
- **Multi-Platform Management**: Connect and manage 4 social media platforms from one dashboard
- **AI Content Generation**: Create posts, captions, and bios in Arabic dialects (Egyptian, Gulf, Levantine)
- **Local Trend Detection**: Real-time hashtag and topic trends for Egypt, Saudi Arabia, Kuwait, and UAE
- **Smart Scheduling**: Post at optimal times based on peak engagement hours for each country
- **Competitor Analysis**: Monitor competitors and get strategic recommendations

### Payment System
- **Multi-Currency Support**: EGP, SAR, KWD, USD
- **Local Payment Methods**:
  - Egypt: InstaPay, Vodafone Cash, Meza
  - Saudi Arabia: STC Pay, Urpay, Mada
  - Kuwait: K-Net
  - International: Credit Cards, Apple Pay
- **Dynamic QR Codes**: Generate payment QR codes for instant transactions

### Analytics & Insights
- **Growth Analytics**: Track followers, engagement, and reach
- **Sentiment Analysis**: Analyze audience sentiment and emotions
- **Content Performance**: Identify best-performing content types and formats
- **Competitor Intelligence**: Compare performance against competitors

## Architecture

### Frontend (Next.js PWA)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with RTL support
- **State Management**: Zustand
- **UI Components**: Headless UI, Heroicons
- **PWA Features**: Offline support, push notifications, app-like experience

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis for performance optimization
- **Queue System**: Bull for background jobs
- **Authentication**: JWT with OAuth integrations

### AI Engine (Python/FastAPI)
- **Framework**: FastAPI with async support
- **ML Libraries**: Transformers, PyTorch, scikit-learn
- **NLP**: Arabic text processing, sentiment analysis
- **Content Generation**: GPT-4 integration with fallback models

## Project Structure

```
socialboost-platform/
apps/
  web/                  # Next.js frontend PWA
  api/                  # NestJS backend API
  ai-engine/            # Python AI services
packages/
  types/                # Shared TypeScript types
  ui/                   # Shared UI components
  config/               # Shared configuration
  utils/                # Shared utilities
```

## Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd socialboost-platform
```

2. **Install dependencies**
```bash
# Install all workspace dependencies
npm install

# Or install individually
cd apps/web && npm install
cd ../api && npm install
cd ../ai-engine && pip install -r requirements.txt
```

3. **Environment Setup**
```bash
# Copy environment files
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp apps/ai-engine/.env.example apps/ai-engine/.env

# Update with your API keys and configurations
```

4. **Database Setup**
```bash
# Run database migrations
cd apps/api
npm run migration:run

# Seed database (optional)
npm run seed:run
```

## Development

### Running the Application

1. **Start all services**
```bash
npm run dev
```

2. **Start individual services**
```bash
# Frontend
cd apps/web && npm run dev

# Backend API
cd apps/api && npm run start:dev

# AI Engine
cd apps/ai-engine && python main.py
```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- AI Engine: http://localhost:8000
- API Documentation: http://localhost:3001/api/docs

## Deployment

### Production Build
```bash
# Build all applications
npm run build

# Start production servers
npm run start
```

### Environment Variables

#### Frontend (.env)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
API_URL=http://localhost:3001
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/socialboost
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret

# OAuth Keys
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# Payment Gateway Keys
STRIPE_SECRET_KEY=your-stripe-secret-key
INSTAPAY_API_KEY=your-instapay-key
STC_PAY_API_KEY=your-stc-pay-key
KNET_API_KEY=your-knet-key
```

#### AI Engine (.env)
```env
OPENAI_API_KEY=your-openai-api-key
TWITTER_API_KEY=your-twitter-api-key
INSTAGRAM_API_KEY=your-instagram-api-key
TIKTOK_API_KEY=your-tiktok-api-key
FACEBOOK_API_KEY=your-facebook-api-key
```

## API Documentation

### Authentication
- JWT-based authentication
- OAuth 2.0 for social platform connections
- Role-based access control (User, Admin, Super Admin)

### Key Endpoints

#### Users
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Social Accounts
- `POST /api/social-accounts/connect` - Connect social platform
- `GET /api/social-accounts` - List connected accounts
- `DELETE /api/social-accounts/:id` - Disconnect account

#### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts` - List posts
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post

#### AI Services
- `POST /api/ai/generate-content` - Generate AI content
- `POST /api/ai/analyze-trends` - Analyze trends
- `POST /api/ai/analyze-competitor` - Analyze competitors
- `POST /api/ai/generate-hashtags` - Generate hashtags

#### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/qr/:id` - Get QR code
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

## Subscription Plans

### Free Tier (0 EGP/month)
- 1 social account
- 10 posts per month
- Basic analytics
- Community support

### Pro Tier (199 EGP/month)
- 4 social accounts
- Unlimited posts
- Advanced analytics
- AI content generation
- Trend analysis
- Email support

### Elite Tier (499 EGP/month)
- Everything in Pro
- Advanced AI features
- Competitor analysis
- Priority support
- Custom integrations
- Personal consultations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@socialboost.com
- Website: https://socialboost.com/support
- Documentation: https://docs.socialboost.com

## Roadmap

### Phase 1 (Current)
- [x] Basic platform setup
- [x] AI content generation
- [x] Multi-platform integration
- [x] Payment system

### Phase 2 (Q2 2026)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced AI models

### Phase 3 (Q3 2026)
- [ ] White-label solutions
- [ ] API marketplace
- [ ] Advanced automation
- [ ] Enterprise features

---

Built with  for the Arab market
