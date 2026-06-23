-- SocialBoost Database Initialization Script

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_posts_content_fts ON posts USING gin(to_tsvector('arabic', content));
CREATE INDEX IF NOT EXISTS idx_users_full_text ON users USING gin(to_tsvector('arabic', username || ' ' || first_name || ' ' || last_name));

-- Set up database triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger functions for all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for pricing plans
INSERT INTO pricing_plans (tier, prices_egp, prices_sar, prices_kwd, prices_usd, features, limits_social_accounts, limits_scheduled_posts, limits_ai_suggestions, analytics_enabled, priority_support_enabled) VALUES
('free', 0, 0, 0, 0, ARRAY['1 social account', '10 posts per month', 'Basic analytics', 'Community support'], 1, 10, 5, false, false),
('pro', 199, 75, 18, 55, ARRAY['4 social accounts', 'Unlimited posts', 'Advanced analytics', 'AI content generation', 'Trend analysis', 'Email support'], 4, -1, -1, true, false),
('elite', 499, 185, 45, 135, ARRAY['Everything in Pro', 'Advanced AI features', 'Competitor analysis', 'Priority support', 'Custom integrations', 'Personal consultations'], 4, -1, -1, true, true)
ON CONFLICT (tier) DO NOTHING;

-- Create admin user
INSERT INTO users (id, email, username, first_name, last_name, country, currency, role, is_active, email_verified, created_at, updated_at)
VALUES (uuid_generate_v4(), 'admin@socialboost.com', 'admin', 'Admin', 'User', 'EG', 'EGP', 'super_admin', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Create sample advertisement data
INSERT INTO advertisements (id, title, description, image_url, target_url, is_active, impressions, clicks, start_date, targeting_countries, targeting_tiers, targeting_platforms, created_at, updated_at)
VALUES 
(uuid_generate_v4(), 'Upgrade to Pro', 'Unlock unlimited posts and advanced analytics', '/images/ads/pro-upgrade.jpg', '/pricing', true, 0, 0, CURRENT_TIMESTAMP, ARRAY['EG', 'SA', 'KW', 'AE'], ARRAY['free'], ARRAY['facebook', 'instagram', 'twitter', 'tiktok'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'AI Content Generator', 'Create engaging content with AI', '/images/ads/ai-content.jpg', '/dashboard/ai-generator', true, 0, 0, CURRENT_TIMESTAMP, ARRAY['EG', 'SA', 'KW', 'AE'], ARRAY['free', 'pro'], ARRAY['facebook', 'instagram', 'twitter', 'tiktok'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Create initial system settings
INSERT INTO system_settings (key, value, description, category, is_public, created_at, updated_at)
VALUES
('maintenance_mode', 'false', 'Enable maintenance mode', 'system', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('registration_enabled', 'true', 'Enable new user registration', 'auth', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ai_features_enabled', 'true', 'Enable AI content generation features', 'features', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('payment_features_enabled', 'true', 'Enable payment processing', 'features', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('analytics_features_enabled', 'true', 'Enable analytics dashboard', 'features', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('max_free_posts_per_month', '10', 'Maximum posts for free tier users', 'limits', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('trial_period_days', '7', 'Trial period for new subscriptions', 'billing', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (key) DO NOTHING;

-- Create notification templates
INSERT INTO notification_templates (id, type, title, content_template, variables, is_active, created_at, updated_at)
VALUES
(uuid_generate_v4(), 'welcome', 'Welcome to SocialBoost!', 'Welcome {{first_name}}! Thank you for joining SocialBoost. Start growing your social media presence with our AI-powered tools.', ARRAY['first_name'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'subscription_created', 'Subscription Activated', 'Your {{tier}} subscription has been activated! You now have access to all {{tier}} features.', ARRAY['tier'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'payment_successful', 'Payment Successful', 'Your payment of {{amount}} {{currency}} was successful. Your subscription is now active until {{next_billing_date}}.', ARRAY['amount', 'currency', 'next_billing_date'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'post_published', 'Post Published Successfully', 'Your post has been successfully published to all selected platforms. Check your analytics to track performance.', ARRAY[], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'ai_content_ready', 'AI Content Generated', 'Your AI-generated content is ready! Review and customize before publishing.', ARRAY[], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Create default peak hours for different countries
INSERT INTO peak_hours (country, platform, hour_of_day, engagement_score, day_of_week, created_at, updated_at)
VALUES
-- Egypt
('EG', 'instagram', 19, 8.5, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'instagram', 20, 9.2, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'instagram', 21, 8.8, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'facebook', 18, 7.8, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'facebook', 19, 8.4, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'facebook', 20, 8.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'twitter', 17, 7.2, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'twitter', 18, 7.8, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'twitter', 19, 8.1, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'tiktok', 20, 8.7, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'tiktok', 21, 9.1, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'tiktok', 22, 8.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Saudi Arabia
('SA', 'instagram', 20, 8.3, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'instagram', 21, 9.0, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'instagram', 22, 8.7, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'facebook', 19, 7.6, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'facebook', 20, 8.2, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'facebook', 21, 8.8, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'twitter', 18, 7.0, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'twitter', 19, 7.6, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'twitter', 20, 7.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'tiktok', 21, 8.5, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'tiktok', 22, 8.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'tiktok', 23, 8.6, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Kuwait
('KW', 'instagram', 19, 8.4, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'instagram', 20, 9.1, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'instagram', 21, 8.8, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'facebook', 18, 7.7, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'facebook', 19, 8.3, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'facebook', 20, 8.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'twitter', 17, 7.1, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'twitter', 18, 7.7, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'twitter', 19, 8.0, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'tiktok', 20, 8.6, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'tiktok', 21, 9.0, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'tiktok', 22, 8.7, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- UAE
('AE', 'instagram', 20, 8.6, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'instagram', 21, 9.3, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'instagram', 22, 8.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'facebook', 19, 7.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'facebook', 20, 8.5, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'facebook', 21, 9.1, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'twitter', 18, 7.3, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'twitter', 19, 7.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'twitter', 20, 8.2, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'tiktok', 21, 8.8, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'tiktok', 22, 9.2, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'tiktok', 23, 8.9, 'all', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (country, platform, hour_of_day, day_of_week) DO NOTHING;

-- Create sample trending hashtags for each country
INSERT INTO trending_hashtags (country, platform, hashtag, posts_count, growth_rate, category, sentiment_score, created_at, updated_at)
VALUES
-- Egypt
('EG', 'instagram', '#', 150000, 25.5, 'general', 0.8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'instagram', '#', 120000, 18.2, 'entertainment', 0.7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'twitter', '#', 80000, 32.1, 'sports', 0.6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EG', 'tiktok', '#', 200000, 45.8, 'music', 0.9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Saudi Arabia
('SA', 'instagram', '#', 180000, 22.3, 'general', 0.7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'twitter', '#', 100000, 28.7, 'business', 0.8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SA', 'tiktok', '#', 250000, 38.9, 'dance', 0.9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Kuwait
('KW', 'instagram', '#', 90000, 15.4, 'lifestyle', 0.6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KW', 'twitter', '#', 60000, 20.1, 'news', 0.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- UAE
('AE', 'instagram', '#', 220000, 30.2, 'luxury', 0.8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AE', 'twitter', '#', 110000, 24.6, 'technology', 0.7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (country, platform, hashtag) DO NOTHING;

COMMIT;
