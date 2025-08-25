-- Development seed data for TrenderAI platform
-- This file contains realistic test data for development and testing

-- Seed cards with various trend scores and categories
INSERT INTO cards (title, description, source, source_url, category, 
                   velocity_score, acceleration_score, convergence_score, 
                   search_intent_score, creator_score, engagement_efficiency_score, 
                   geo_demo_spread_score, tags, metadata) VALUES

-- High-trending AI topics
('AI Agents Revolutionizing Software Development', 
 'Autonomous AI agents are transforming how developers build and deploy applications, with tools like GitHub Copilot and Cursor leading the charge.',
 'tech_blog', 'https://example.com/ai-agents-dev', 'Technology',
 85, 92, 78, 88, 82, 79, 81,
 ARRAY['ai', 'development', 'automation', 'productivity'],
 '{"sentiment": "positive", "reach_estimate": 500000, "engagement_rate": 0.045}'),

('Quantum Computing Breakthrough in Cryptography',
 'Researchers achieve quantum supremacy in breaking RSA encryption, raising urgent questions about digital security.',
 'research_paper', 'https://example.com/quantum-crypto', 'Science',
 78, 85, 72, 91, 68, 75, 83,
 ARRAY['quantum', 'cryptography', 'security', 'research'],
 '{"sentiment": "neutral", "reach_estimate": 300000, "engagement_rate": 0.038}'),

-- Social media trends
('TikTok Algorithm Changes Impact Creator Economy',
 'Recent TikTok algorithm updates are dramatically affecting content reach and creator monetization strategies.',
 'social_media', 'https://example.com/tiktok-algorithm', 'Social Media',
 92, 88, 85, 79, 91, 87, 89,
 ARRAY['tiktok', 'algorithm', 'creators', 'social-media'],
 '{"sentiment": "negative", "reach_estimate": 800000, "engagement_rate": 0.052}'),

-- Business and finance
('Sustainable Finance Surges in European Markets',
 'ESG investment products see unprecedented growth as European regulators implement stricter sustainability reporting requirements.',
 'financial_news', 'https://example.com/sustainable-finance', 'Finance',
 76, 82, 79, 85, 74, 81, 77,
 ARRAY['esg', 'finance', 'sustainability', 'europe'],
 '{"sentiment": "positive", "reach_estimate": 400000, "engagement_rate": 0.041}'),

-- Entertainment and culture
('Virtual Reality Gaming Reaches Mainstream Adoption',
 'Meta Quest 3 and Apple Vision Pro drive unprecedented VR adoption, with gaming leading the charge.',
 'gaming_news', 'https://example.com/vr-gaming-mainstream', 'Entertainment',
 88, 85, 82, 76, 89, 84, 86,
 ARRAY['vr', 'gaming', 'meta', 'apple', 'entertainment'],
 '{"sentiment": "positive", "reach_estimate": 600000, "engagement_rate": 0.048}'),

-- Health and wellness
('Personalized Nutrition Based on Microbiome Analysis',
 'New AI-powered platforms are revolutionizing nutrition by analyzing individual gut microbiomes for personalized diet recommendations.',
 'health_tech', 'https://example.com/microbiome-nutrition', 'Health',
 81, 79, 76, 88, 75, 82, 78,
 ARRAY['nutrition', 'microbiome', 'ai', 'health', 'personalization'],
 '{"sentiment": "positive", "reach_estimate": 350000, "engagement_rate": 0.039}'),

-- Climate and environment
('Carbon Capture Technology Breakthrough',
 'Novel carbon capture materials show 3x efficiency improvement, potentially making carbon neutrality achievable by 2030.',
 'climate_news', 'https://example.com/carbon-capture-breakthrough', 'Environment',
 79, 83, 77, 82, 76, 80, 84,
 ARRAY['climate', 'carbon-capture', 'sustainability', 'innovation'],
 '{"sentiment": "positive", "reach_estimate": 450000, "engagement_rate": 0.043}'),

-- Education and learning
('AI Tutors Transforming Online Education',
 'Personalized AI tutors are achieving better learning outcomes than human teachers in controlled studies.',
 'education_tech', 'https://example.com/ai-tutors-education', 'Education',
 84, 87, 80, 86, 83, 85, 81,
 ARRAY['ai', 'education', 'tutoring', 'online-learning'],
 '{"sentiment": "positive", "reach_estimate": 550000, "engagement_rate": 0.046}'),

-- Politics and society
('Digital Democracy Platforms Gain Traction',
 'Blockchain-based voting systems are being adopted by local governments worldwide, increasing voter participation.',
 'political_tech', 'https://example.com/digital-democracy', 'Politics',
 72, 78, 75, 79, 71, 76, 73,
 ARRAY['blockchain', 'voting', 'democracy', 'politics'],
 '{"sentiment": "neutral", "reach_estimate": 250000, "engagement_rate": 0.035}'),

-- Sports and fitness
('Biometric Wearables Revolutionizing Athletic Training',
 'Advanced sensors and AI analysis are providing unprecedented insights into athlete performance and injury prevention.',
 'sports_tech', 'https://example.com/biometric-wearables', 'Sports',
 86, 84, 81, 77, 88, 83, 85,
 ARRAY['wearables', 'biometrics', 'sports', 'fitness', 'ai'],
 '{"sentiment": "positive", "reach_estimate": 700000, "engagement_rate": 0.049}');

-- Seed time-series metrics for the cards
INSERT INTO counts (card_id, source, metric_name, metric_value, bucket_start, bucket_end, bucket_size) 
SELECT 
    c.id,
    c.source,
    'mentions',
    FLOOR(RANDOM() * 10000 + 1000)::BIGINT,
    NOW() - INTERVAL '1 hour' * (ROW_NUMBER() OVER () - 1),
    NOW() - INTERVAL '1 hour' * (ROW_NUMBER() OVER () - 1) + INTERVAL '1 hour',
    '1h'
FROM cards c
CROSS JOIN generate_series(1, 24) AS hour_offset;

-- Add engagement metrics
INSERT INTO counts (card_id, source, metric_name, metric_value, bucket_start, bucket_end, bucket_size)
SELECT 
    c.id,
    c.source,
    'engagement',
    FLOOR(RANDOM() * 5000 + 500)::BIGINT,
    NOW() - INTERVAL '1 hour' * (ROW_NUMBER() OVER () - 1),
    NOW() - INTERVAL '1 hour' * (ROW_NUMBER() OVER () - 1) + INTERVAL '1 hour',
    '1h'
FROM cards c
CROSS JOIN generate_series(1, 24) AS hour_offset;

-- Add sentiment metrics
INSERT INTO counts (card_id, source, metric_name, metric_value, bucket_start, bucket_end, bucket_size)
SELECT 
    c.id,
    c.source,
    'sentiment_score',
    FLOOR(RANDOM() * 100 + 50)::BIGINT,
    NOW() - INTERVAL '1 hour' * (ROW_NUMBER() OVER () - 1),
    NOW() - INTERVAL '1 hour' * (ROW_NUMBER() OVER () - 1) + INTERVAL '1 hour',
    '1h'
FROM cards c
CROSS JOIN generate_series(1, 24) AS hour_offset;

-- Seed user saved cards
INSERT INTO saved (user_id, card_id, notes) VALUES
('user_001', (SELECT id FROM cards WHERE title LIKE '%AI Agents%' LIMIT 1), 'Interesting development in AI tools'),
('user_001', (SELECT id FROM cards WHERE title LIKE '%TikTok%' LIMIT 1), 'Need to research for content strategy'),
('user_002', (SELECT id FROM cards WHERE title LIKE '%Quantum%' LIMIT 1), 'Critical for security planning'),
('user_002', (SELECT id FROM cards WHERE title LIKE '%VR Gaming%' LIMIT 1), 'Potential investment opportunity'),
('user_003', (SELECT id FROM cards WHERE title LIKE '%Sustainable Finance%' LIMIT 1), 'ESG compliance research'),
('user_003', (SELECT id FROM cards WHERE title LIKE '%Carbon Capture%' LIMIT 1), 'Climate tech investment'),
('user_004', (SELECT id FROM cards WHERE title LIKE '%AI Tutors%' LIMIT 1), 'EdTech market analysis'),
('user_004', (SELECT id FROM cards WHERE title LIKE '%Biometric Wearables%' LIMIT 1), 'Health tech trends');

-- Seed alert rules
INSERT INTO alerts (user_id, name, description, metric_name, operator, threshold_value, 
                   source_filter, category_filter, tags_filter, metadata) VALUES

('user_001', 'High AI Engagement Alert', 
 'Alert when AI-related content gets high engagement',
 'engagement', '>', 5000, 'tech_blog', 'Technology', 
 ARRAY['ai'], '{"notification_email": "user1@example.com"}'),

('user_002', 'Crypto Security Breach Alert',
 'Monitor for quantum computing threats to cryptography',
 'mentions', '>', 10000, 'research_paper', 'Science',
 ARRAY['quantum', 'cryptography'], '{"notification_email": "user2@example.com"}'),

('user_003', 'Social Media Algorithm Changes',
 'Track significant changes in social media algorithms',
 'mentions', '>=', 8000, 'social_media', 'Social Media',
 ARRAY['algorithm'], '{"notification_email": "user3@example.com"}'),

('user_004', 'ESG Investment Surge',
 'Monitor sustainable finance growth',
 'engagement', '>', 3000, 'financial_news', 'Finance',
 ARRAY['esg'], '{"notification_email": "user4@example.com"}'),

('user_001', 'VR Gaming Trend Alert',
 'Track virtual reality gaming adoption',
 'mentions', '>', 6000, 'gaming_news', 'Entertainment',
 ARRAY['vr', 'gaming'], '{"notification_email": "user1@example.com"}');

-- Seed time-to-insight telemetry
INSERT INTO tti (pipeline_name, stage_name, started_at, completed_at, status, metadata) VALUES

-- Data ingestion pipeline
('data_ingestion', 'twitter_scraping', 
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '5 minutes',
 'completed', '{"records_processed": 15000, "errors": 0}'),

('data_ingestion', 'reddit_scraping',
 NOW() - INTERVAL '2 hours' + INTERVAL '5 minutes', NOW() - INTERVAL '2 hours' + INTERVAL '8 minutes',
 'completed', '{"records_processed": 8000, "errors": 2}'),

('data_ingestion', 'news_scraping',
 NOW() - INTERVAL '2 hours' + INTERVAL '8 minutes', NOW() - INTERVAL '2 hours' + INTERVAL '12 minutes',
 'completed', '{"records_processed": 5000, "errors": 0}'),

-- AI analysis pipeline
('ai_analysis', 'sentiment_analysis',
 NOW() - INTERVAL '1 hour 45 minutes', NOW() - INTERVAL '1 hour 45 minutes' + INTERVAL '3 minutes',
 'completed', '{"records_processed": 28000, "accuracy": 0.94}'),

('ai_analysis', 'trend_scoring',
 NOW() - INTERVAL '1 hour 42 minutes', NOW() - INTERVAL '1 hour 42 minutes' + INTERVAL '7 minutes',
 'completed', '{"records_processed": 28000, "signals_calculated": 7}'),

('ai_analysis', 'content_categorization',
 NOW() - INTERVAL '1 hour 35 minutes', NOW() - INTERVAL '1 hour 35 minutes' + INTERVAL '4 minutes',
 'completed', '{"records_processed": 28000, "categories_identified": 15}'),

-- Alert processing
('alert_processing', 'threshold_checking',
 NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes' + INTERVAL '1 minute',
 'completed', '{"alerts_checked": 5, "violations_found": 2}'),

('alert_processing', 'notification_sending',
 NOW() - INTERVAL '29 minutes', NOW() - INTERVAL '29 minutes' + INTERVAL '30 seconds',
 'completed', '{"notifications_sent": 2, "delivery_success": 2}'),

-- Failed pipeline example
('data_ingestion', 'tiktok_scraping',
 NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour' + INTERVAL '2 minutes',
 'failed', '{"error": "Rate limit exceeded", "retry_count": 3}'),

-- Running pipeline example
('ai_analysis', 'real_time_processing',
 NOW() - INTERVAL '5 minutes', NULL,
 'running', '{"records_processed": 1500, "estimated_completion": "2 minutes"}');

-- Create some additional metrics for trending analysis
INSERT INTO counts (card_id, source, metric_name, metric_value, bucket_start, bucket_end, bucket_size)
SELECT 
    c.id,
    c.source,
    'reach_estimate',
    FLOOR(RANDOM() * 1000000 + 100000)::BIGINT,
    NOW() - INTERVAL '1 day' * (ROW_NUMBER() OVER () - 1),
    NOW() - INTERVAL '1 day' * (ROW_NUMBER() OVER () - 1) + INTERVAL '1 day',
    '1d'
FROM cards c
CROSS JOIN generate_series(1, 7) AS day_offset;

-- Add viral coefficient metrics
INSERT INTO counts (card_id, source, metric_name, metric_value, bucket_start, bucket_end, bucket_size)
SELECT 
    c.id,
    c.source,
    'viral_coefficient',
    FLOOR(RANDOM() * 50 + 10)::BIGINT,
    NOW() - INTERVAL '6 hours' * (ROW_NUMBER() OVER () - 1),
    NOW() - INTERVAL '6 hours' * (ROW_NUMBER() OVER () - 1) + INTERVAL '6 hours',
    '6h'
FROM cards c
CROSS JOIN generate_series(1, 4) AS hour_offset;

-- Update some cards to have higher trend scores for testing
UPDATE cards 
SET 
    velocity_score = 95,
    acceleration_score = 92,
    convergence_score = 88,
    search_intent_score = 90,
    creator_score = 87,
    engagement_efficiency_score = 89,
    geo_demo_spread_score = 91
WHERE title LIKE '%AI Agents%';

UPDATE cards 
SET 
    velocity_score = 89,
    acceleration_score = 94,
    convergence_score = 86,
    search_intent_score = 88,
    creator_score = 92,
    engagement_efficiency_score = 85,
    geo_demo_spread_score = 90
WHERE title LIKE '%TikTok Algorithm%';

-- Add some high-engagement metrics for trending cards
INSERT INTO counts (card_id, source, metric_name, metric_value, bucket_start, bucket_end, bucket_size)
SELECT 
    c.id,
    c.source,
    'engagement',
    FLOOR(RANDOM() * 20000 + 15000)::BIGINT,
    NOW() - INTERVAL '30 minutes' * (ROW_NUMBER() OVER () - 1),
    NOW() - INTERVAL '30 minutes' * (ROW_NUMBER() OVER () - 1) + INTERVAL '30 minutes',
    '30m'
FROM cards c
WHERE c.trend_score >= 85
CROSS JOIN generate_series(1, 4) AS minute_offset;
