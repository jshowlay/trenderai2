-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema_migrations table to track applied migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create cards table for trend cards
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100) NOT NULL,
    source_url TEXT,
    category VARCHAR(100),
    
    -- Signal scores (0-100 range)
    velocity_score SMALLINT NOT NULL CHECK (velocity_score >= 0 AND velocity_score <= 100),
    acceleration_score SMALLINT NOT NULL CHECK (acceleration_score >= 0 AND acceleration_score <= 100),
    convergence_score SMALLINT NOT NULL CHECK (convergence_score >= 0 AND convergence_score <= 100),
    search_intent_score SMALLINT NOT NULL CHECK (search_intent_score >= 0 AND search_intent_score <= 100),
    creator_score SMALLINT NOT NULL CHECK (creator_score >= 0 AND creator_score <= 100),
    engagement_efficiency_score SMALLINT NOT NULL CHECK (engagement_efficiency_score >= 0 AND engagement_efficiency_score <= 100),
    geo_demo_spread_score SMALLINT NOT NULL CHECK (geo_demo_spread_score >= 0 AND geo_demo_spread_score <= 100),
    
    -- Generated trend score (average of all 7 signals)
    trend_score SMALLINT GENERATED ALWAYS AS (
        (velocity_score + acceleration_score + convergence_score + search_intent_score + 
         creator_score + engagement_efficiency_score + geo_demo_spread_score) / 7
    ) STORED,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT cards_title_source_unique UNIQUE (title, source)
);

-- Create counts table for time-series metrics
CREATE TABLE counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    source VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL,
    bucket_start TIMESTAMP WITH TIME ZONE NOT NULL,
    bucket_end TIMESTAMP WITH TIME ZONE NOT NULL,
    bucket_size VARCHAR(20) NOT NULL CHECK (bucket_size IN ('1m', '5m', '15m', '1h', '6h', '1d')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint to prevent duplicate metrics for same card/source/metric/time
    CONSTRAINT counts_unique_metric UNIQUE (card_id, source, metric_name, bucket_start, bucket_end)
);

-- Create saved table for user-saved cards
CREATE TABLE saved (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL, -- Using VARCHAR for flexibility with different auth systems
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    -- Ensure one save per user per card
    CONSTRAINT saved_user_card_unique UNIQUE (user_id, card_id)
);

-- Create alerts table for threshold-based alert rules
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Alert configuration
    metric_name VARCHAR(100) NOT NULL,
    operator VARCHAR(20) NOT NULL CHECK (operator IN ('>', '>=', '<', '<=', 'crosses_above', 'crosses_below')),
    threshold_value NUMERIC(10,2) NOT NULL,
    
    -- Scope
    source_filter VARCHAR(100),
    category_filter VARCHAR(100),
    tags_filter TEXT[],
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tti table for time-to-insight telemetry
CREATE TABLE tti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_name VARCHAR(100) NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    
    -- Timing data
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Generated duration in seconds
    duration_seconds NUMERIC(10,3) GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (completed_at - started_at))
    ) STORED,
    
    -- Status and metadata
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for optimal query performance

-- Cards table indexes
CREATE INDEX idx_cards_trend_score ON cards(trend_score DESC);
CREATE INDEX idx_cards_source ON cards(source);
CREATE INDEX idx_cards_category ON cards(category);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);
CREATE INDEX idx_cards_tags ON cards USING GIN(tags);
CREATE INDEX idx_cards_metadata ON cards USING GIN(metadata);

-- Counts table indexes
CREATE INDEX idx_counts_card_id ON counts(card_id);
CREATE INDEX idx_counts_source ON counts(source);
CREATE INDEX idx_counts_metric_name ON counts(metric_name);
CREATE INDEX idx_counts_bucket_start ON counts(bucket_start);
CREATE INDEX idx_counts_bucket_end ON counts(bucket_end);
CREATE INDEX idx_counts_card_metric_time ON counts(card_id, metric_name, bucket_start);

-- Saved table indexes
CREATE INDEX idx_saved_user_id ON saved(user_id);
CREATE INDEX idx_saved_card_id ON saved(card_id);
CREATE INDEX idx_saved_saved_at ON saved(saved_at DESC);

-- Alerts table indexes
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_active ON alerts(is_active);
CREATE INDEX idx_alerts_metric_name ON alerts(metric_name);
CREATE INDEX idx_alerts_last_triggered ON alerts(last_triggered_at);

-- TTI table indexes
CREATE INDEX idx_tti_pipeline_name ON tti(pipeline_name);
CREATE INDEX idx_tti_stage_name ON tti(stage_name);
CREATE INDEX idx_tti_status ON tti(status);
CREATE INDEX idx_tti_started_at ON tti(started_at);
CREATE INDEX idx_tti_duration ON tti(duration_seconds);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_counts_updated_at BEFORE UPDATE ON counts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tti_updated_at BEFORE UPDATE ON tti
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries

-- View for high-trending cards
CREATE VIEW trending_cards AS
SELECT 
    c.*,
    COUNT(s.id) as save_count,
    AVG(COALESCE(cnt.metric_value, 0)) as avg_metric_value
FROM cards c
LEFT JOIN saved s ON c.id = s.card_id
LEFT JOIN counts cnt ON c.id = cnt.card_id
WHERE c.trend_score >= 70
GROUP BY c.id
ORDER BY c.trend_score DESC, save_count DESC;

-- View for alert violations
CREATE VIEW alert_violations AS
SELECT 
    a.id as alert_id,
    a.name as alert_name,
    a.user_id,
    a.metric_name,
    a.operator,
    a.threshold_value,
    c.id as card_id,
    c.title as card_title,
    cnt.metric_value,
    cnt.bucket_start
FROM alerts a
JOIN cards c ON (
    (a.source_filter IS NULL OR c.source = a.source_filter) AND
    (a.category_filter IS NULL OR c.category = a.category_filter) AND
    (a.tags_filter IS NULL OR c.tags && a.tags_filter)
)
JOIN counts cnt ON c.id = cnt.card_id AND cnt.metric_name = a.metric_name
WHERE a.is_active = true
AND (
    (a.operator = '>' AND cnt.metric_value > a.threshold_value) OR
    (a.operator = '>=' AND cnt.metric_value >= a.threshold_value) OR
    (a.operator = '<' AND cnt.metric_value < a.threshold_value) OR
    (a.operator = '<=' AND cnt.metric_value <= a.threshold_value)
);

-- Insert migration record
INSERT INTO schema_migrations (version, applied_at) VALUES ('0001_core', CURRENT_TIMESTAMP);
