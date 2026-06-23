# SocialBoost Deployment Guide

## Overview

This guide covers deploying the SocialBoost platform to production environments, including cloud deployment, Docker setup, and monitoring configuration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Database Setup](#database-setup)
6. [SSL Configuration](#ssl-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling](#scaling)
9. [Security](#security)
10. [Backup & Recovery](#backup--recovery)

---

## Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 100Mbps
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2

#### Recommended Requirements
- **CPU**: 8 cores
- **RAM**: 16GB
- **Storage**: 100GB SSD
- **Network**: 1Gbps
- **OS**: Ubuntu 22.04 LTS

### Software Requirements

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.25+
- **Nginx**: 1.18+
- **PostgreSQL**: 14+
- **Redis**: 6+

### Domain & SSL

- **Domain Name**: Registered domain (e.g., socialboost.com)
- **SSL Certificate**: Valid SSL certificate (Let's Encrypt recommended)
- **DNS**: A records pointing to server IP

---

## Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Add Docker repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Or using iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/your-org/socialboost-platform.git
cd socialboost-platform

# Create production environment files
cp .env.example .env.production
cp apps/web/.env.example apps/web/.env.production
cp apps/api/.env.example apps/api/.env.production
cp apps/ai-engine/.env.example apps/ai-engine/.env.production
```

---

## Docker Deployment

### 1. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: socialboost-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - web
      - api
    restart: unless-stopped
    networks:
      - socialboost-network

  # Frontend
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.prod
    container_name: socialboost-web
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=${DOMAIN}
      - API_URL=${API_URL}
    volumes:
      - ./logs/web:/var/log/nginx
    restart: unless-stopped
    networks:
      - socialboost-network

  # Backend API
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.prod
    container_name: socialboost-api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./logs/api:/var/log/app
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - socialboost-network

  # AI Engine
  ai-engine:
    build:
      context: ./apps/ai-engine
      dockerfile: Dockerfile.prod
    container_name: socialboost-ai
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    volumes:
      - ./logs/ai:/var/log/app
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - socialboost-network

  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    container_name: socialboost-postgres
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - socialboost-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: socialboost-redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - socialboost-network

  # Redis Commander (Admin UI)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: socialboost-redis-ui
    environment:
      - REDIS_HOSTS=local:redis:6379:0:${REDIS_PASSWORD}
    ports:
      - "8081:8081"
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - socialboost-network

volumes:
  postgres_data:
  redis_data:

networks:
  socialboost-network:
    driver: bridge
```

### 2. Production Dockerfiles

#### Frontend Dockerfile.prod
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/types/package*.json ./packages/types/
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build types
RUN cd packages/types && npm run build

# Build application
RUN cd apps/web && npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/apps/web/next.config.js ./

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

#### Backend Dockerfile.prod
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/types/package*.json ./packages/types/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build types
RUN cd packages/types && npm run build

# Build application
RUN cd apps/api && npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/node_modules ./node_modules

# Set permissions
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
```

### 3. Environment Configuration

Create `.env.production`:

```bash
# Domain Configuration
DOMAIN=https://socialboost.com
API_URL=https://api.socialboost.com

# Database Configuration
POSTGRES_DB=socialboost_prod
POSTGRES_USER=socialboost_user
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://socialboost_user:your-secure-password@postgres:5432/socialboost_prod

# Redis Configuration
REDIS_PASSWORD=your-redis-password
REDIS_URL=redis://:your-redis-password@redis:6379

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=24h

# Social Platform API Keys
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORG_ID=org-your-openai-org-id

# Payment Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
INSTAPAY_API_KEY=your-instapay-api-key
STC_PAY_API_KEY=your-stc-pay-api-key
KNET_API_KEY=your-knet-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@socialboost.com

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=me-south-1
AWS_S3_BUCKET=socialboost-uploads

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

---

## Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Create EC2 instance (Ubuntu 22.04)
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.large \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --user-data file://user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=socialboost-prod}]'
```

#### 2. User Data Script (user-data.sh)

```bash
#!/bin/bash
yum update -y
yum install -y docker git nginx

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker
systemctl start docker
systemctl enable docker

# Clone repository
cd /opt
git clone https://github.com/your-org/socialboost-platform.git
cd socialboost-platform

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier socialboost-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username socialboost \
  --master-user-password your-secure-password \
  --allocated-storage 100 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --storage-encrypted \
  --tags Key=Name,Value=socialboost-rds
```

#### 4. ElastiCache Redis

```bash
# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-id socialboost-redis \
  --replication-group-description "SocialBoost Redis Cluster" \
  --num-cache-clusters 2 \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --cache-parameter-group default.redis6.x \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-group-name default \
  --automatic-failover-enabled \
  --multi-az-enabled
```

### Google Cloud Platform

#### 1. Compute Engine Instance

```bash
# Create VM instance
gcloud compute instances create socialboost-prod \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=100GB \
  --boot-disk-type=pd-balanced \
  --zone=us-central1-a \
  --tags=socialboost,http-server,https-server
```

#### 2. Cloud SQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create socialboost-prod \
  --database-version=POSTGRES_14 \
  --tier=db-custom-4-16384 \
  --region=us-central1 \
  --storage-size=100GB \
  --storage-type=SSD \
  --backup-start-time=02:00 \
  --enable-binary-log
```

### Azure Deployment

#### 1. Virtual Machine

```bash
# Create VM
az vm create \
  --resource-group socialboost-rg \
  --name socialboost-prod \
  --image UbuntuLTS \
  --size Standard_D4s_v3 \
  --admin-username azureuser \
  --ssh-key-values ~/.ssh/id_rsa.pub \
  --nsg socialboost-nsg \
  --subnet socialboost-subnet
```

#### 2. Azure Database

```bash
# Create PostgreSQL
az postgres server create \
  --resource-group socialboost-rg \
  --name socialboost-db \
  --location eastus \
  --admin-user socialboost \
  --admin-password your-secure-password \
  --sku-name GP_Gen5_2 \
  --version 14
```

---

## Database Setup

### 1. PostgreSQL Configuration

#### Production PostgreSQL Configuration

```sql
-- postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
max_connections = 200
```

#### Database Initialization

```bash
# Connect to database
docker-compose exec postgres psql -U socialboost_user -d socialboost_prod

# Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

# Create indexes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX CONCURRENTLY idx_posts_user_id ON posts(user_id);
CREATE INDEX CONCURRENTLY idx_stream_sessions_user_id ON stream_sessions(user_id);

# Full-text search indexes
CREATE INDEX CONCURRENTLY idx_posts_content_fts ON posts USING gin(to_tsvector('arabic', content));
CREATE INDEX CONCURRENTLY idx_users_full_text ON users USING gin(to_tsvector('arabic', username || ' ' || first_name || ' ' || last_name));
```

### 2. Redis Configuration

#### Production Redis Configuration

```redis
# redis.conf
save 900 1
save 300 10
save 60 10000

# Memory management
maxmemory 512mb
maxmemory-policy allkeys-lru

# Persistence
appendonly yes
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# Security
requirepass your-redis-password
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command KEYS ""
rename-command CONFIG ""

# Performance
tcp-keepalive 300
timeout 0
tcp-backlog 511
```

---

## SSL Configuration

### 1. Let's Encrypt Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d socialboost.com -d www.socialboost.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Nginx SSL Configuration

```nginx
# nginx/nginx.conf
server {
    listen 80;
    server_name socialboost.com www.socialboost.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name socialboost.com www.socialboost.com;

    ssl_certificate /etc/letsencrypt/live/socialboost.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/socialboost.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://web:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring & Logging

### 1. Application Monitoring

#### Health Checks

```bash
# API Health Check
curl -f http://localhost:3001/api/health || exit 1

# AI Engine Health Check
curl -f http://localhost:8000/api/ai/health || exit 1

# Frontend Health Check
curl -f http://localhost:3000/api/health || exit 1
```

#### Docker Health Monitoring

```yaml
# Add to docker-compose.prod.yml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  ai-engine:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/ai/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 2. Log Management

#### Log Rotation

```bash
# /etc/logrotate.d/socialboost
/var/log/socialboost/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart api web ai-engine
    endscript
}
```

#### Centralized Logging

```yaml
# Add to docker-compose.prod.yml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

### 3. Performance Monitoring

#### Prometheus & Grafana

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
```

---

## Scaling

### 1. Horizontal Scaling

#### Load Balancer Configuration

```nginx
# nginx/nginx.conf
upstream api_backend {
    least_conn;
    server api_1:3001 max_fails=3 fail_timeout=30s;
    server api_2:3001 max_fails=3 fail_timeout=30s;
    server api_3:3001 max_fails=3 fail_timeout=30s;
}

upstream web_backend {
    least_conn;
    server web_1:3000 max_fails=3 fail_timeout=30s;
    server web_2:3000 max_fails=3 fail_timeout=30s;
}

server {
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://web_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Docker Compose Scaling

```bash
# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api=3 --scale web=2

# Auto-scaling script
#!/bin/bash
# scale-services.sh

CPU_THRESHOLD=80
MEMORY_THRESHOLD=80

while true; do
    CPU=$(docker stats --no-stream --format "table {{.CPUPerc}}" | grep -v CPU | awk '{print $1}' | sed 's/%//')
    MEMORY=$(docker stats --no-stream --format "table {{.MemPerc}}" | grep -v MEM | awk '{print $1}' | sed 's/%//')
    
    if (( $(echo "$CPU > $CPU_THRESHOLD" | bc -l) )); then
        echo "High CPU usage: $CPU%. Scaling up..."
        docker-compose -f docker-compose.prod.yml up -d --scale api=$(docker-compose -f docker-compose.prod.yml ps -q api | wc -l)
    fi
    
    sleep 60
done
```

### 2. Database Scaling

#### Read Replicas

```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier socialboost-prod-replica \
  --source-db-instance-identifier socialboost-prod \
  --instance-class db.t3.medium
```

#### Connection Pooling

```typescript
// apps/api/src/config/database.config.ts
export const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  extra: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },
};
```

---

## Security

### 1. Network Security

#### Firewall Rules

```bash
# UFW configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# IP whitelisting for admin access
sudo ufw allow from 203.0.113.0/24 to any port 22
sudo ufw allow from 198.51.100.0/24 to any port 22
```

#### Docker Security

```yaml
# docker-compose.prod.yml
services:
  api:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    user: "1001:1001"
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### 2. Application Security

#### Environment Variables Security

```bash
# Encrypt sensitive environment variables
echo "JWT_SECRET=your-secret" | gpg --symmetric --cipher-algo AES256 > .env.production.gpg

# Decrypt at runtime
gpg --quiet --batch --yes --decrypt --passphrase="your-passphrase" .env.production.gpg > .env.production
```

#### API Security

```typescript
// apps/api/src/common/guards/rate-limit.guard.ts
@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = `rate_limit:${request.ip}`;
    
    // Implement rate limiting logic
    return this.checkRateLimit(key);
  }
}
```

### 3. Data Security

#### Database Encryption

```sql
-- Enable encryption at rest
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/var/lib/postgresql/server.crt';
ALTER SYSTEM SET ssl_key_file = '/var/lib/postgresql/server.key';

-- Column-level encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
ALTER TABLE users ADD COLUMN encrypted_email TEXT;
UPDATE users SET encrypted_email = pgp_sym_encrypt(email, 'encryption-key');
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN encrypted_email TO email;
```

---

## Backup & Recovery

### 1. Database Backup

#### Automated Backups

```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/socialboost_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
docker-compose exec postgres pg_dump -U socialboost_user socialboost_prod > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (AWS S3)
aws s3 cp $BACKUP_FILE.gz s3://socialboost-backups/database/

echo "Backup completed: $BACKUP_FILE.gz"
```

#### Cron Job

```bash
# Add to crontab
0 2 * * * /opt/socialboost-platform/scripts/backup-database.sh
```

### 2. File Backup

#### Application Files Backup

```bash
#!/bin/bash
# backup-files.sh

BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/socialboost_files_$DATE.tar.gz"

# Create backup
tar -czf $BACKUP_FILE \
  /opt/socialboost-platform/apps/web/public/uploads \
  /opt/socialboost-platform/nginx/ssl \
  /opt/socialboost-platform/.env.production

# Upload to cloud storage
aws s3 cp $BACKUP_FILE s3://socialboost-backups/files/

echo "Files backup completed: $BACKUP_FILE"
```

### 3. Recovery Procedures

#### Database Recovery

```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Download backup from cloud storage
aws s3 cp s3://socialboost-backups/database/$BACKUP_FILE.gz /tmp/

# Extract backup
gunzip /tmp/$BACKUP_FILE.gz

# Stop application
docker-compose stop api ai-engine

# Restore database
docker-compose exec -T postgres psql -U socialboost_user -d socialboost_prod < /tmp/$BACKUP_FILE

# Start application
docker-compose start api ai-engine

echo "Database restored from: $BACKUP_FILE"
```

#### Disaster Recovery

```bash
#!/bin/bash
# disaster-recovery.sh

# 1. Provision new server
# 2. Install Docker and dependencies
# 3. Clone repository
# 4. Restore database from latest backup
# 5. Restore application files
# 6. Update DNS to point to new server
# 7. Test all services

echo "Disaster recovery completed"
```

---

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs api
docker-compose logs web
docker-compose logs postgres

# Check resource usage
docker stats

# Restart services
docker-compose restart
```

#### 2. Database Connection Issues

```bash
# Check database status
docker-compose exec postgres pg_isready

# Test connection
docker-compose exec postgres psql -U socialboost_user -d socialboost_prod -c "SELECT 1;"

# Check network connectivity
docker network ls
docker network inspect socialboost_socialboost-network
```

#### 3. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect socialboost.com:443
```

#### 4. Performance Issues

```bash
# Check system resources
top
htop
iotop

# Check database performance
docker-compose exec postgres psql -U socialboost_user -d socialboost_prod -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
"

# Check application logs for errors
docker-compose logs api | grep ERROR
```

### Monitoring Commands

```bash
# Service status
docker-compose ps

# Resource usage
docker stats --no-stream

# Health checks
curl -f http://localhost:3001/api/health
curl -f http://localhost:8000/api/ai/health

# Log monitoring
docker-compose logs -f --tail=100 api
```

---

## Maintenance

### Regular Tasks

#### Daily
- Check application health
- Review error logs
- Monitor resource usage

#### Weekly
- Update security patches
- Review backup logs
- Performance analysis

#### Monthly
- SSL certificate renewal check
- Database maintenance
- Security audit

#### Quarterly
- Disaster recovery testing
- Performance optimization
- Capacity planning

---

*Last updated: April 12, 2026*
