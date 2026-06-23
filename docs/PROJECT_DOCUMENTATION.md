# SocialBoost Platform - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Frontend Documentation](#frontend-documentation)
8. [Backend Documentation](#backend-documentation)
9. [AI Engine Documentation](#ai-engine-documentation)
10. [Database Schema](#database-schema)
11. [Deployment](#deployment)
12. [Security](#security)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)

---

## Overview

SocialBoost is a comprehensive social media management platform designed specifically for the Arab market. It enables users to manage multiple social media platforms, create AI-powered content, stream live to multiple platforms simultaneously, and analyze performance across all channels.

### Key Objectives

- **Multi-Platform Management**: Connect and manage Facebook, Instagram, Twitter, TikTok, YouTube, and LinkedIn
- **AI Content Generation**: Create engaging content in Arabic dialects (Egyptian, Gulf, Levantine)
- **Live Streaming**: Stream simultaneously to multiple platforms from a single camera
- **Local Payment Methods**: Support for Egyptian, Saudi, Kuwaiti, and international payment methods
- **Arabic Market Focus**: RTL support, Arabic dialects, local trends, and regional analytics

### Target Audience

- Content creators and influencers
- Small and medium businesses
- Marketing agencies
- Social media managers
- Brands targeting the Arab market

---

## Architecture

### System Architecture

```
+-------------------+     +-------------------+     +-------------------+
|   Frontend (PWA) |     |   Backend (API)  |     |   AI Engine      |
|   Next.js 14      |<--->|   NestJS         |<--->|   FastAPI        |
|   TypeScript      |     |   TypeScript      |     |   Python         |
|   Tailwind CSS    |     |   TypeORM        |     |   OpenAI         |
+-------------------+     +-------------------+     +-------------------+
         |                       |                       |
         +-----------------------+-----------------------+
                         |               |
                     +-----------+-----------+
                     |   Infrastructure   |
                     |   Docker Compose  |
                     |   PostgreSQL       |
                     |   Redis           |
                     |   Nginx           |
                     +-------------------+
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with RTL support
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **PWA**: Service Workers, Web App Manifest

#### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Queue**: Bull
- **Real-time**: WebSockets (Socket.io)
- **Authentication**: JWT with OAuth

#### AI Engine
- **Framework**: FastAPI
- **Language**: Python
- **ML Libraries**: Transformers, PyTorch, scikit-learn
- **NLP**: Arabic text processing, sentiment analysis
- **AI Models**: OpenAI GPT-4, local Arabic models

#### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Monitoring**: Health checks, logging

---

## Features

### 1. Multi-Platform Management

Connect and manage multiple social media accounts from a single dashboard:

- **Facebook**: Pages, Groups, Profiles
- **Instagram**: Business accounts, Stories, Reels
- **Twitter**: Tweets, Spaces, Analytics
- **TikTok**: Videos, Live streams, Analytics
- **YouTube**: Channels, Live streams, Analytics
- **LinkedIn**: Company pages, Personal profiles

### 2. AI Content Generation

Generate content using advanced AI models:

- **Arabic Dialects**: Egyptian, Gulf, Levantine, Modern Standard
- **Content Types**: Posts, captions, bios, hashtags
- **Customization**: Tone, length, target audience
- **Hashtag Generation**: Platform-specific and trending hashtags
- **Content Suggestions**: Based on trends and analytics

### 3. Live Streaming Studio

Stream live to multiple platforms simultaneously:

- **Multi-Platform Streaming**: Stream to 6+ platforms at once
- **Camera Controls**: Switch between front/back cameras
- **Audio Controls**: Mute/unmute, noise cancellation
- **Quality Settings**: 360p to 4K streaming
- **Real-time Analytics**: Viewers, engagement, platform metrics
- **Stream Recording**: Save streams for later viewing

### 4. Advanced Analytics

Comprehensive analytics across all platforms:

- **Performance Metrics**: Views, engagement, reach, impressions
- **Audience Demographics**: Age, gender, location, language
- **Content Analysis**: Best performing posts, optimal times
- **Competitor Analysis**: Track competitor performance
- **Trend Analysis**: Local and global trends
- **Custom Reports**: Exportable analytics reports

### 5. Payment System

Multi-currency payment processing:

- **Currencies**: EGP, SAR, KWD, USD
- **Local Methods**: InstaPay, Vodafone Cash, STC Pay, Urpay, Mada, K-Net
- **International**: Credit cards, Apple Pay, Google Pay
- **Subscription Plans**: Free, Pro, Elite tiers
- **Dynamic QR Codes**: Generate payment QR codes

### 6. User Management

Complete user and account management:

- **Authentication**: JWT with social login options
- **User Profiles**: Personal and business profiles
- **Team Management**: Multiple users per account
- **Permissions**: Role-based access control
- **Settings**: Preferences, notifications, privacy

---

## Installation

### Prerequisites

- Node.js 18+ 
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd socialboost-platform
```

2. **Install dependencies**
```bash
# Install all workspace dependencies
npm install

# Install individual dependencies
cd apps/web && npm install
cd ../api && npm install
cd ../ai-engine && pip install -r requirements.txt
```

3. **Environment setup**
```bash
# Copy environment files
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp apps/ai-engine/.env.example apps/ai-engine/.env

# Update with your API keys and configurations
```

4. **Database setup**
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run database migrations
cd apps/api
npm run migration:run

# Seed database (optional)
npm run seed:run
```

5. **Start the application**
```bash
# Start all services
npm run dev

# Or start individually
cd apps/web && npm run dev
cd ../api && npm run start:dev
cd ../ai-engine && python main.py
```

### Docker Setup

1. **Build and start all services**
```bash
docker-compose up -d --build
```

2. **View logs**
```bash
docker-compose logs -f
```

3. **Stop services**
```bash
docker-compose down
```

---

## Configuration

### Environment Variables

#### Frontend (.env)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
API_URL=http://localhost:3001

# Social Platform OAuth Keys
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/socialboost
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret

# OAuth Configuration
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
INSTAGRAM_CLIENT_ID=your-instagram-app-id
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TIKTOK_CLIENT_ID=your-tiktok-app-id
TIKTOK_CLIENT_SECRET=your-tiktok-app-secret

# Payment Gateway Keys
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
INSTAPAY_API_KEY=your-instapay-key
STC_PAY_API_KEY=your-stc-pay-key
KNET_API_KEY=your-knet-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password
```

#### AI Engine (.env)
```env
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORG_ID=org-your-openai-org-id

# Social Platform API Keys
TWITTER_API_KEY=your-twitter-api-key
INSTAGRAM_API_KEY=your-instagram-api-key
TIKTOK_API_KEY=your-tiktok-api-key
FACEBOOK_API_KEY=your-facebook-api-key
YOUTUBE_API_KEY=your-youtube-api-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/socialboost
REDIS_URL=redis://localhost:6379
```

### Database Configuration

The application uses PostgreSQL as the primary database with the following configuration:

```typescript
// apps/api/src/config/database.config.ts
export const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'socialboost',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
```

---

## API Documentation

### Authentication

All API endpoints require authentication using JWT tokens:

```bash
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "access_token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### API Endpoints

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update user settings

#### Social Accounts
- `GET /api/social-accounts` - List connected accounts
- `POST /api/social-accounts/connect` - Connect social platform
- `DELETE /api/social-accounts/:id` - Disconnect account
- `GET /api/social-accounts/:id/analytics` - Get account analytics

#### Posts
- `GET /api/posts` - List posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post
- `POST /api/posts/:id/schedule` - Schedule post

#### Streaming
- `POST /api/streaming/start` - Start live stream
- `POST /api/streaming/:sessionId/stop` - Stop stream
- `GET /api/streaming/sessions/:userId` - Get user sessions
- `GET /api/streaming/session/:sessionId` - Get session details
- `GET /api/streaming/stats/:userId` - Get streaming statistics

#### AI Services
- `POST /api/ai/generate-content` - Generate AI content
- `POST /api/ai/generate-hashtags` - Generate hashtags
- `POST /api/ai/analyze-trends` - Analyze trends
- `POST /api/ai/analyze-sentiment` - Analyze sentiment

#### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/qr/:id` - Get QR code
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

### WebSocket Events

Connect to WebSocket for real-time updates:

```javascript
const socket = io('ws://localhost:3001/streaming');

// Join streaming session
socket.emit('join_session', { sessionId: 'session-id' });

// Listen for updates
socket.on('viewer_count_update', (data) => {
  console.log('Current viewers:', data);
});

socket.on('platform_health', (data) => {
  console.log('Platform health:', data);
});
```

---

## Frontend Documentation

### Project Structure

```
apps/web/src/
  app/                    # Next.js App Router pages
    layout.tsx           # Root layout
    page.tsx             # Home page
    dashboard/           # Dashboard pages
    streaming/           # Streaming pages
    pricing/             # Pricing pages
  components/           # Reusable components
    streaming/           # Streaming components
    ui/                  # UI components
    forms/               # Form components
  lib/                  # Utility functions
  hooks/                # Custom React hooks
  types/                # TypeScript types
  styles/               # Global styles
```

### Key Components

#### LiveStreamManager
Main component for managing live streams:

```typescript
interface LiveStreamManagerProps {
  onStreamStart?: (sessionId: string) => void;
  onStreamEnd?: (sessionId: string) => void;
  onPlatformConnected?: (platform: StreamingPlatform) => void;
}
```

#### StreamingDashboard
Dashboard for streaming analytics and management:

```typescript
interface StreamingDashboardProps {
  userId: string;
}
```

#### RTMPStreamer
Component for handling RTMP streaming:

```typescript
interface RTMPStreamerProps {
  sessionId: string;
  streamKey: string;
  rtmpUrl: string;
  platforms: StreamingPlatform[];
}
```

### State Management

Using Zustand for state management:

```typescript
// stores/streamingStore.ts
interface StreamingStore {
  isStreaming: boolean;
  currentSession: StreamSession | null;
  platforms: StreamingPlatform[];
  startStream: () => void;
  stopStream: () => void;
  updateSettings: (settings: StreamSettings) => void;
}
```

### Styling

Using Tailwind CSS with RTL support:

```css
/* RTL fixes */
[dir="rtl"] {
  .rounded-l-md {
    border-radius: 0 0.375rem 0.375rem 0;
  }
  
  .ml-2 {
    margin-left: 0;
    margin-right: 0.5rem;
  }
}
```

---

## Backend Documentation

### Project Structure

```
apps/api/src/
  main.ts                # Application entry point
  app.module.ts          # Root module
  config/                # Configuration files
    database.config.ts   # Database configuration
    redis.config.ts      # Redis configuration
  modules/               # Feature modules
    auth/                # Authentication
    users/               # User management
    social-accounts/     # Social media accounts
    posts/               # Post management
    streaming/           # Live streaming
    payments/            # Payment processing
    ai/                  # AI services
    notifications/       # Notifications
    admin/               # Admin panel
  entities/              # Database entities
  common/               # Common utilities
  guards/               # Authentication guards
  decorators/           # Custom decorators
  interceptors/         # Request interceptors
```

### Key Modules

#### Streaming Module
Handles live streaming functionality:

```typescript
// modules/streaming/streaming.service.ts
export class StreamingService {
  async startStream(userId: string, createStreamDto: CreateStreamDto);
  async stopStream(sessionId: string);
  async controlStream(sessionId: string, controlDto: StreamControlDto);
  async getUserSessions(userId: string);
  async getStreamHealth(sessionId: string);
}
```

#### AI Module
Handles AI-powered content generation:

```typescript
// modules/ai/ai.service.ts
export class AIService {
  async generateContent(request: AIContentRequest);
  async generateHashtags(topic: string, platforms: string[]);
  async analyzeSentiment(text: string);
  async analyzeTrends(country: string, platform: string);
}
```

#### Payment Module
Handles payment processing:

```typescript
// modules/payments/payment.service.ts
export class PaymentService {
  async createPayment(paymentDto: CreatePaymentDto);
  async verifyPayment(paymentId: string);
  async generateQRCode(paymentId: string);
  async processWebhook(event: StripeEvent);
}
```

### Database Entities

#### Stream Session
```typescript
@Entity('stream_sessions')
export class StreamSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  userId: string;
  
  @Column()
  title: string;
  
  @Column({
    type: 'enum',
    enum: StreamingStatus,
    default: StreamingStatus.IDLE,
  })
  status: StreamingStatus;
  
  @Column({ type: 'jsonb' })
  platforms: StreamPlatform[];
  
  @Column({ type: 'jsonb' })
  analytics: StreamAnalytics;
}
```

### Guards and Decorators

#### JWT Authentication Guard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
```

#### Rate Limiting Decorator
```typescript
export const RateLimit = (limit: number, windowMs: number) =>
  SetMetadata('rateLimit', { limit, windowMs });
```

---

## AI Engine Documentation

### Project Structure

```
apps/ai-engine/
  main.py               # FastAPI application
  requirements.txt      # Python dependencies
  services/             # AI services
    ai_content_generator.py  # Content generation
    trend_analyzer.py         # Trend analysis
    competitor_analyzer.py    # Competitor analysis
    sentiment_analyzer.py     # Sentiment analysis
    hashtag_generator.py      # Hashtag generation
  models/               # ML models
  utils/                # Utility functions
```

### Key Services

#### AI Content Generator
Generates content using OpenAI and local models:

```python
class AIContentGenerator:
    async def generate_content(
        topic: str,
        platform: str,
        tone: str,
        dialect: str,
        length: str
    ) -> AIContentResponse
    
    async def generate_bio(
        user_info: dict,
        platform: str,
        dialect: str
    ) -> str
```

#### Trend Analyzer
Analyzes social media trends:

```python
class TrendAnalyzer:
    async def analyze_trends(
        country: str,
        platform: str,
        time_range: str
    ) -> TrendAnalysis
    
    async def get_trending_hashtags(
        country: str,
        platform: str
    ) -> List[TrendingHashtag]
```

#### Sentiment Analyzer
Analyzes text sentiment with emoji support:

```python
class SentimentAnalyzer:
    async def analyze_sentiment(
        text: str,
        language: str = 'auto'
    ) -> SentimentResult
    
    async def analyze_emoji_sentiment(
        emojis: List[str]
    ) -> float
```

### API Endpoints

#### Content Generation
```python
@app.post("/api/ai/generate-content")
async def generate_content(request: ContentRequest):
    return await ai_generator.generate_content(
        topic=request.topic,
        platform=request.platform,
        tone=request.tone,
        dialect=request.dialect,
        length=request.length
    )
```

#### Trend Analysis
```python
@app.post("/api/ai/analyze-trends")
async def analyze_trends(request: TrendRequest):
    return await trend_analyzer.analyze_trends(
        country=request.country,
        platform=request.platform,
        time_range=request.time_range
    )
```

---

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    country VARCHAR(2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'active',
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Social Accounts
```sql
CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    platform social_platform NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stream Sessions
```sql
CREATE TABLE stream_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status streaming_status DEFAULT 'idle',
    quality stream_quality DEFAULT '720p',
    platforms JSONB NOT NULL,
    settings JSONB NOT NULL,
    analytics JSONB NOT NULL,
    viewer_count INTEGER DEFAULT 0,
    thumbnail_url VARCHAR(500),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Posts
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    media_urls TEXT[],
    platforms social_platform[] NOT NULL,
    hashtags TEXT[],
    mentions TEXT[],
    status post_status DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    analytics JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships

- Users have many Social Accounts
- Users have many Posts
- Users have many Stream Sessions
- Posts belong to multiple Platforms
- Stream Sessions stream to multiple Platforms

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_stream_sessions_user_id ON stream_sessions(user_id);
CREATE INDEX idx_stream_sessions_status ON stream_sessions(status);

-- Full-text search indexes
CREATE INDEX idx_posts_content_fts ON posts USING gin(to_tsvector('arabic', content));
CREATE INDEX idx_users_full_text ON users USING gin(to_tsvector('arabic', username || ' ' || first_name || ' ' || last_name));
```

---

## Deployment

### Production Deployment

#### 1. Server Requirements

- **CPU**: 4+ cores
- **RAM**: 8GB+ recommended
- **Storage**: 100GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Docker**: Latest version
- **Domain**: SSL certificate required

#### 2. Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd socialboost-platform

# Copy environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp apps/ai-engine/.env.example apps/ai-engine/.env

# Update environment variables
nano .env
```

#### 3. SSL Certificate

```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### 4. Docker Deployment

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale web=2 --scale api=2
```

#### 5. Database Migration

```bash
# Run migrations
docker-compose exec api npm run migration:run

# Seed database
docker-compose exec api npm run seed:run
```

### Monitoring and Logging

#### Health Checks

```bash
# Check service health
curl http://localhost:3001/api/health
curl http://localhost:8000/api/ai/health
```

#### Log Management

```bash
# View application logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f ai-engine

# Rotate logs
docker-compose exec api logrotate /etc/logrotate.d/socialboost
```

#### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# Database performance
docker-compose exec postgres psql -U postgres -d socialboost -c "SELECT * FROM pg_stat_activity;"
```

---

## Security

### Authentication & Authorization

#### JWT Implementation
```typescript
// JWT token payload
interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Middleware for token validation
export const validateToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
};
```

#### OAuth Implementation
```typescript
// Facebook OAuth
export const facebookAuth = new PassportStrategy('facebook', {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
});
```

### Data Protection

#### Encryption
```typescript
// Sensitive data encryption
export const encryptSensitiveData = (data: string): string => {
  return crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY)
    .update(data, 'utf8')
    .final('hex');
};
```

#### Input Validation
```typescript
// DTO validation
export class CreatePostDto {
  @IsString()
  @MaxLength(2000)
  content: string;

  @IsArray()
  @IsEnum(SocialPlatform, { each: true })
  platforms: SocialPlatform[];
}
```

### Rate Limiting

#### API Rate Limiting
```typescript
// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
};
```

#### Streaming Rate Limiting
```typescript
// Streaming-specific limits
export const streamingRateLimit = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 streams per hour per user
};
```

### Security Headers

```typescript
// Security middleware configuration
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

**Problem**: Cannot connect to PostgreSQL
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
```bash
# Check PostgreSQL status
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

#### 2. Redis Connection Issues

**Problem**: Redis connection refused
```
Error: Redis connection failed
```

**Solution**:
```bash
# Check Redis status
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

#### 3. Frontend Build Issues

**Problem**: Next.js build fails
```
Error: Module not found: @socialboost/types
```

**Solution**:
```bash
# Install dependencies
npm install

# Build types package
cd packages/types && npm run build

# Clean and rebuild
rm -rf .next && npm run build
```

#### 4. Streaming Issues

**Problem**: Cannot start live stream
```
Error: Camera access denied
```

**Solution**:
```bash
# Check browser permissions
# Ensure HTTPS is enabled in development
# Use localhost instead of IP address
```

#### 5. AI Engine Issues

**Problem**: OpenAI API errors
```
Error: Invalid API key
```

**Solution**:
```bash
# Check environment variables
echo $OPENAI_API_KEY

# Update AI engine .env file
# Restart AI engine service
```

### Debug Mode

#### Enable Debug Logging
```bash
# Backend debug mode
DEBUG=app:* npm run start:dev

# Frontend debug mode
NEXT_DEBUG=1 npm run dev

# AI engine debug mode
export PYTHONPATH=$PYTHONPATH:.
python main.py --debug
```

#### Database Debugging
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d socialboost

# Check tables
\dt

# Check connections
SELECT * FROM pg_stat_activity;
```

### Performance Issues

#### Slow API Responses
```bash
# Check database queries
docker-compose exec postgres psql -U postgres -d socialboost -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
"
```

#### Memory Issues
```bash
# Monitor memory usage
docker stats --no-stream

# Check Node.js memory
docker-compose exec api node -e "console.log(process.memoryUsage())"
```

---

## Contributing

### Development Guidelines

#### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add unit tests for new features

#### Branch Strategy
- `main`: Production branch
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Hotfix branches

#### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and add tests
3. Submit pull request to `develop`
4. Code review and approval
5. Merge to `develop`
6. Deploy to staging for testing
7. Merge to `main` for production

### Testing

#### Unit Tests
```bash
# Backend tests
cd apps/api && npm run test

# Frontend tests
cd apps/web && npm run test

# AI engine tests
cd apps/ai-engine && python -m pytest
```

#### Integration Tests
```bash
# End-to-end tests
npm run test:e2e

# API integration tests
cd apps/api && npm run test:integration
```

#### Performance Tests
```bash
# Load testing
npm run test:performance

# Streaming performance
npm run test:streaming
```

### Documentation

#### API Documentation
- Update Swagger annotations for new endpoints
- Include request/response examples
- Document error codes and messages

#### Code Comments
- Add JSDoc comments for functions
- Explain complex algorithms
- Document configuration options

---

## Support

### Getting Help

- **Documentation**: Check this documentation first
- **GitHub Issues**: Report bugs and feature requests
- **Discord Community**: Join our developer community
- **Email Support**: support@socialboost.com

### FAQ

#### Q: How do I add a new social platform?
A: Create a new platform enum value, update OAuth configuration, and add platform-specific API integration.

#### Q: Can I customize the AI models?
A: Yes, you can add custom models to the AI engine by implementing the `AIModel` interface.

#### Q: How do I scale the application?
A: Use Docker Compose scaling or Kubernetes for production scaling.

#### Q: Is the platform GDPR compliant?
A: Yes, the platform includes data protection features and user consent management.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0 (2026-04-12)
- Initial release
- Multi-platform social media management
- AI content generation
- Live streaming capabilities
- Payment processing
- Arabic market focus

---

*Last updated: April 12, 2026*
