# SocialBoost API Reference

## Overview

This document provides comprehensive API documentation for the SocialBoost platform. The API is RESTful and uses JSON for data exchange.

## Base URLs

- **Development**: `http://localhost:3001/api`
- **Staging**: `https://staging.socialboost.com/api`
- **Production**: `https://api.socialboost.com/api`

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "user"
  },
  "expires_in": 3600
}
```

## Rate Limiting

- **Standard endpoints**: 100 requests per 15 minutes
- **Streaming endpoints**: 10 requests per minute
- **AI endpoints**: 20 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2026-04-12T10:00:00Z",
  "requestId": "uuid"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2026-04-12T10:00:00Z",
  "requestId": "uuid"
}
```

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and return JWT tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "user": {
      "id": "uuid",
      "email": "string",
      "username": "string",
      "role": "user|admin",
      "profile": {
        "firstName": "string",
        "lastName": "string",
        "avatar": "string",
        "country": "EG|SA|KW|AE",
        "currency": "EGP|SAR|KWD|AED"
      }
    }
  }
}
```

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "string",
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "country": "EG|SA|KW|AE",
  "currency": "EGP|SAR|KWD|AED"
}
```

#### POST /api/auth/refresh
Refresh JWT tokens using refresh token.

**Request Body:**
```json
{
  "refresh_token": "string"
}
```

#### POST /api/auth/logout
Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <token>
```

---

### Users

#### GET /api/users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "profile": {
      "firstName": "string",
      "lastName": "string",
      "avatar": "string",
      "bio": "string",
      "country": "EG|SA|KW|AE",
      "currency": "EGP|SAR|KWD|AED",
      "timezone": "string",
      "language": "ar|en"
    },
    "settings": {
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      },
      "privacy": {
        "profileVisibility": "public|private",
        "showEmail": false,
        "showPhone": false
      }
    },
    "subscription": {
      "plan": "free|pro|elite",
      "status": "active|cancelled|expired",
      "expiresAt": "2026-05-12T10:00:00Z"
    }
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "timezone": "string",
  "language": "ar|en"
}
```

#### GET /api/users/settings
Get user settings.

#### PUT /api/users/settings
Update user settings.

**Request Body:**
```json
{
  "notifications": {
    "email": true,
    "push": true,
    "sms": false,
    "marketing": false
  },
  "privacy": {
    "profileVisibility": "public|private",
    "showEmail": false,
    "showPhone": false
  },
  "preferences": {
    "theme": "light|dark|auto",
    "language": "ar|en",
    "timezone": "string"
  }
}
```

---

### Social Accounts

#### GET /api/social-accounts
Get connected social accounts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "platform": "facebook|instagram|twitter|tiktok|youtube|linkedin",
      "platformUserId": "string",
      "username": "string",
      "displayName": "string",
      "avatar": "string",
      "followers": 1000,
      "isActive": true,
      "lastSyncAt": "2026-04-12T10:00:00Z",
      "metrics": {
        "followers": 1000,
        "following": 500,
        "posts": 150,
        "engagement": 8.5
      }
    }
  ]
}
```

#### POST /api/social-accounts/connect
Connect a social media account.

**Request Body:**
```json
{
  "platform": "facebook|instagram|twitter|tiktok|youtube|linkedin",
  "authCode": "string",
  "redirectUri": "string"
}
```

#### DELETE /api/social-accounts/:id
Disconnect a social media account.

#### GET /api/social-accounts/:id/analytics
Get analytics for a specific social account.

**Query Parameters:**
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `metrics`: Comma-separated list of metrics (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2026-04-01T00:00:00Z",
      "endDate": "2026-04-12T23:59:59Z"
    },
    "metrics": {
      "followers": {
        "current": 1000,
        "change": 50,
        "changePercent": 5.2
      },
      "engagement": {
        "rate": 8.5,
        "change": 0.3,
        "changePercent": 3.6
      },
      "reach": {
        "total": 5000,
        "average": 416
      },
      "impressions": {
        "total": 15000,
        "average": 1250
      }
    },
    "topPosts": [
      {
        "id": "uuid",
        "content": "string",
        "platform": "instagram",
        "publishedAt": "2026-04-10T15:30:00Z",
        "metrics": {
          "likes": 100,
          "comments": 20,
          "shares": 10,
          "reach": 500,
          "engagement": 13.0
        }
      }
    ]
  }
}
```

---

### Posts

#### GET /api/posts
Get user posts.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Number of posts per page (default: 20)
- `platform`: Filter by platform (optional)
- `status`: Filter by status (draft|scheduled|published|failed)
- `startDate`: Filter by start date (optional)
- `endDate`: Filter by end date (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "content": "string",
        "mediaUrls": ["string"],
        "platforms": ["instagram", "facebook"],
        "hashtags": ["#socialmedia", "#marketing"],
        "mentions": ["@username"],
        "status": "published",
        "scheduledAt": "2026-04-12T15:00:00Z",
        "publishedAt": "2026-04-12T15:01:00Z",
        "analytics": {
          "totalReach": 1000,
          "totalEngagement": 85,
          "platformMetrics": {
            "instagram": {
              "likes": 50,
              "comments": 10,
              "shares": 5,
              "reach": 600
            },
            "facebook": {
              "likes": 30,
              "comments": 5,
              "shares": 5,
              "reach": 400
            }
          }
        },
        "createdAt": "2026-04-12T10:00:00Z",
        "updatedAt": "2026-04-12T15:01:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### POST /api/posts
Create a new post.

**Request Body:**
```json
{
  "content": "string",
  "mediaUrls": ["string"],
  "platforms": ["instagram", "facebook"],
  "hashtags": ["#socialmedia", "#marketing"],
  "mentions": ["@username"],
  "scheduledAt": "2026-04-12T15:00:00Z",
  "settings": {
    "allowComments": true,
    "allowSharing": true,
    "location": {
      "name": "string",
      "latitude": 30.0444,
      "longitude": 31.2357
    }
  }
}
```

#### GET /api/posts/:id
Get a specific post.

#### PUT /api/posts/:id
Update a post.

#### DELETE /api/posts/:id
Delete a post.

#### POST /api/posts/:id/publish
Publish a post immediately.

#### POST /api/posts/:id/schedule
Schedule a post for later publishing.

#### POST /api/posts/:id/unpublish
Unpublish a post.

---

### Streaming

#### POST /api/streaming/start
Start a new live stream.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "platforms": ["facebook", "youtube", "instagram"],
  "settings": {
    "quality": "360p|720p|1080p|4k",
    "privacy": "public|private|unlisted",
    "enableChat": true,
    "enableDVR": true,
    "autoStart": false
  },
  "scheduledTime": "2026-04-12T15:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "streamKey": "string",
    "rtmpUrl": "rtmp://live.socialboost.com/live",
    "platforms": [
      {
        "platform": "facebook",
        "streamUrl": "rtmp://facebook-live-api.facebook.com/rtmp",
        "streamKey": "facebook-stream-key",
        "status": "ready"
      }
    ],
    "websocketUrl": "ws://localhost:3001/streaming",
    "settings": {
      "quality": "1080p",
      "bitrate": 5000,
      "fps": 30
    }
  }
}
```

#### POST /api/streaming/:sessionId/stop
Stop a live stream.

#### GET /api/streaming/sessions/:userId
Get user's streaming sessions.

**Query Parameters:**
- `status`: Filter by status (idle|live|ended|failed)
- `startDate`: Filter by start date (optional)
- `endDate`: Filter by end date (optional)
- `page`: Page number (default: 1)
- `limit`: Number of sessions per page (default: 20)

#### GET /api/streaming/session/:sessionId
Get streaming session details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "status": "live",
    "quality": "1080p",
    "platforms": [
      {
        "platform": "facebook",
        "isActive": true,
        "streamUrl": "string",
        "viewerCount": 150,
        "platformStreamId": "string",
        "lastHeartbeat": "2026-04-12T15:30:00Z"
      }
    ],
    "analytics": {
      "totalViewers": 500,
      "peakViewers": 150,
      "averageViewers": 120,
      "totalDuration": 1800,
      "engagement": {
        "likes": 100,
        "comments": 25,
        "shares": 15
      }
    },
    "startTime": "2026-04-12T15:00:00Z",
    "duration": 1800,
    "createdAt": "2026-04-12T15:00:00Z",
    "updatedAt": "2026-04-12T15:30:00Z"
  }
}
```

#### POST /api/streaming/:sessionId/control
Control streaming session.

**Request Body:**
```json
{
  "action": "start|stop|pause|resume|quality_change",
  "data": {
    "quality": "720p",
    "bitrate": 2500
  }
}
```

#### GET /api/streaming/stats/:userId
Get streaming statistics for a user.

#### GET /api/streaming/health/:sessionId
Get stream health status.

---

### AI Services

#### POST /api/ai/generate-content
Generate AI-powered content.

**Request Body:**
```json
{
  "topic": "string",
  "platform": "facebook|instagram|twitter|tiktok|youtube|linkedin",
  "tone": "professional|casual|funny|inspirational",
  "dialect": "egyptian|gulf|levantine|modern",
  "length": "short|medium|long",
  "hashtags": true,
  "mentions": ["@username"],
  "targetAudience": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Generated content text...",
    "hashtags": ["#socialmedia", "#marketing", "#digital"],
    "mentions": ["@relevant_user"],
    "suggestedMedia": [
      {
        "type": "image|video",
        "description": "Description of suggested media",
        "prompt": "AI prompt for media generation"
      }
    ],
    "confidence": 0.85,
    "model": "gpt-4",
    "tokensUsed": 150
  }
}
```

#### POST /api/ai/generate-hashtags
Generate hashtags for content.

**Request Body:**
```json
{
  "content": "string",
  "platform": "facebook|instagram|twitter|tiktok|youtube|linkedin",
  "country": "EG|SA|KW|AE",
  "language": "ar|en",
  "count": 10
}
```

#### POST /api/ai/analyze-trends
Analyze trending topics.

**Request Body:**
```json
{
  "country": "EG|SA|KW|AE",
  "platform": "facebook|instagram|twitter|tiktok|youtube|linkedin",
  "timeRange": "1h|6h|24h|7d|30d",
  "category": "general|entertainment|sports|business|technology"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "topic": "string",
        "hashtag": "#trending",
        "volume": 10000,
        "growth": 25.5,
        "posts": [
          {
            "content": "string",
            "author": "string",
            "engagement": 1000,
            "url": "string"
          }
        ]
      }
    ],
    "insights": [
      {
        "type": "opportunity",
        "title": "string",
        "description": "string",
        "confidence": 0.8
      }
    ]
  }
}
```

#### POST /api/ai/analyze-sentiment
Analyze text sentiment.

**Request Body:**
```json
{
  "text": "string",
  "language": "ar|en|auto",
  "includeEmojis": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "sentiment": "positive|negative|neutral",
      "score": 0.75,
      "confidence": 0.85
    },
    "emotions": {
      "joy": 0.6,
      "anger": 0.1,
      "sadness": 0.1,
      "fear": 0.05,
      "surprise": 0.15
    },
    "language": "ar",
    "emojiSentiment": {
      "positive": 0.8,
      "negative": 0.1,
      "neutral": 0.1
    }
  }
}
```

---

### Payments

#### POST /api/payments/create
Create a new payment.

**Request Body:**
```json
{
  "amount": 199.00,
  "currency": "EGP|SAR|KWD|USD",
  "method": "card|instapay|vodafone_cash|stc_pay|knet",
  "plan": "pro|elite",
  "duration": "monthly|yearly",
  "callbackUrl": "string",
  "metadata": {
    "userId": "uuid",
    "description": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "amount": 199.00,
    "currency": "EGP",
    "status": "pending",
    "paymentUrl": "https://payment.socialboost.com/pay/uuid",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expiresAt": "2026-04-12T16:00:00Z",
    "instructions": {
      "instapay": "Scan QR code with InstaPay app",
      "vodafone_cash": "Dial *925# and follow instructions"
    }
  }
}
```

#### GET /api/payments/qr/:paymentId
Get payment QR code.

#### POST /api/payments/verify
Verify payment status.

**Request Body:**
```json
{
  "paymentId": "uuid",
  "transactionId": "string"
}
```

#### GET /api/payments/history
Get payment history.

**Query Parameters:**
- `status`: Filter by status (pending|completed|failed|cancelled)
- `startDate`: Filter by start date (optional)
- `endDate`: Filter by end date (optional)
- `page`: Page number (default: 1)
- `limit`: Number of payments per page (default: 20)

#### POST /api/payments/webhook
Handle payment webhooks (for payment providers).

---

### Notifications

#### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `type`: Filter by type (info|warning|error|success)
- `read`: Filter by read status (true|false)
- `page`: Page number (default: 1)
- `limit`: Number of notifications per page (default: 20)

#### POST /api/notifications/mark-read
Mark notifications as read.

**Request Body:**
```json
{
  "notificationIds": ["uuid"],
  "markAll": false
}
```

#### PUT /api/notifications/settings
Update notification preferences.

**Request Body:**
```json
{
  "email": {
    "marketing": true,
    "updates": true,
    "security": true
  },
  "push": {
    "marketing": false,
    "updates": true,
    "security": true
  },
  "sms": {
    "marketing": false,
    "updates": false,
    "security": true
  }
}
```

---

### Admin

#### GET /api/admin/users
Get all users (admin only).

#### GET /api/admin/analytics
Get platform analytics (admin only).

#### POST /api/admin/broadcast
Send broadcast notification (admin only).

---

## WebSocket Events

### Streaming WebSocket

Connect to `ws://localhost:3001/streaming` for real-time streaming updates.

#### Events

##### Join Session
```javascript
socket.emit('join_session', {
  sessionId: 'uuid'
});
```

##### Leave Session
```javascript
socket.emit('leave_session', {
  sessionId: 'uuid'
});
```

##### Viewer Count Update
```javascript
socket.on('viewer_count_update', (data) => {
  console.log('Viewer count:', data);
  // {
  //   sessionId: 'uuid',
  //   platform: 'facebook',
  //   viewerCount: 150,
  //   timestamp: '2026-04-12T15:30:00Z'
  // }
});
```

##### Platform Health
```javascript
socket.on('platform_health', (data) => {
  console.log('Platform health:', data);
  // {
  //   sessionId: 'uuid',
  //   platform: 'facebook',
  //   status: 'healthy|warning|error',
  //   bitrate: 5000,
  //   fps: 30,
  //   droppedFrames: 5,
  //   timestamp: '2026-04-12T15:30:00Z'
  // }
});
```

##### Stream Status Change
```javascript
socket.on('stream_status_change', (data) => {
  console.log('Stream status:', data);
  // {
  //   sessionId: 'uuid',
  //   status: 'idle|live|ended|failed',
  //   timestamp: '2026-04-12T15:30:00Z'
  // }
});
```

##### Chat Message
```javascript
socket.on('chat_message', (data) => {
  console.log('Chat message:', data);
  // {
  //   sessionId: 'uuid',
  //   platform: 'facebook',
  //   message: {
  //     id: 'uuid',
  //     user: 'username',
  //     message: 'Hello!',
  //     timestamp: '2026-04-12T15:30:00Z'
  //   }
  // }
});
```

---

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| VALIDATION_ERROR | Invalid input data | 400 |
| UNAUTHORIZED | Invalid or missing authentication | 401 |
| FORBIDDEN | Insufficient permissions | 403 |
| NOT_FOUND | Resource not found | 404 |
| CONFLICT | Resource conflict | 409 |
| RATE_LIMITED | Too many requests | 429 |
| INTERNAL_ERROR | Server error | 500 |
| SERVICE_UNAVAILABLE | Service temporarily unavailable | 503 |
| SOCIAL_ACCOUNT_ERROR | Social platform API error | 502 |
| STREAMING_ERROR | Streaming service error | 502 |
| AI_SERVICE_ERROR | AI service error | 502 |
| PAYMENT_ERROR | Payment processing error | 502 |

---

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @socialboost/sdk
```

```javascript
import { SocialBoostAPI } from '@socialboost/sdk';

const api = new SocialBoostAPI({
  baseURL: 'https://api.socialboost.com/api',
  apiKey: 'your-api-key'
});

// Generate content
const content = await api.ai.generateContent({
  topic: 'social media marketing',
  platform: 'instagram',
  tone: 'professional'
});

// Start streaming
const stream = await api.streaming.start({
  title: 'Live Q&A Session',
  platforms: ['facebook', 'youtube']
});
```

### Python
```bash
pip install socialboost-python
```

```python
from socialboost import SocialBoostAPI

api = SocialBoostAPI(
    base_url='https://api.socialboost.com/api',
    api_key='your-api-key'
)

# Generate content
content = api.ai.generate_content(
    topic='social media marketing',
    platform='instagram',
    tone='professional'
)

# Analyze trends
trends = api.ai.analyze_trends(
    country='EG',
    platform='twitter',
    time_range='24h'
)
```

---

## Testing

### API Testing with Postman

Import the Postman collection from `docs/socialboost-api.postman_collection.json`.

### Example cURL Commands

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get user profile
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer <token>"

# Generate content
curl -X POST http://localhost:3001/api/ai/generate-content \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"topic":"social media","platform":"instagram","tone":"professional"}'
```

---

## Changelog

### v1.0.0 (2026-04-12)
- Initial API release
- Authentication endpoints
- User management
- Social account integration
- Content generation
- Live streaming
- Payment processing
- Analytics endpoints

---

*Last updated: April 12, 2026*
