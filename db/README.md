# TrenderAI Database Schema

## Overview

This directory contains the complete database schema and migration system for the TrenderAI trend analytics platform. The schema is designed for PostgreSQL with optimized performance for real-time trend analysis.

## Schema Design

### Core Tables

#### `cards` - Trend Cards
Stores trend cards with 7 signal scores and a generated trend score.

**Key Features:**
- UUID primary keys using `gen_random_uuid()`
- 7 signal scores (0-100 range) with CHECK constraints
- Generated `trend_score` column (average of all 7 signals)
- JSONB metadata for flexible data storage
- Array tags for categorization
- Unique constraint on (title, source)

**Signal Scores:**
- `velocity_score` - Speed of trend growth
- `acceleration_score` - Rate of acceleration
- `convergence_score` - Cross-platform convergence
- `search_intent_score` - Search volume and intent
- `creator_score` - Creator engagement and influence
- `engagement_efficiency_score` - Engagement quality
- `geo_demo_spread_score` - Geographic and demographic spread

#### `counts` - Time-Series Metrics
Stores time-bucketed metrics for each card/source/metric combination.

**Key Features:**
- Time-bucketed data with configurable intervals
- Unique constraint prevents duplicate metrics
- Optimized for time-series queries
- Supports multiple metric types (mentions, engagement, sentiment, etc.)

#### `saved` - User Saved Cards
Tracks user-saved cards with notes and timestamps.

**Key Features:**
- One save per user per card
- CASCADE deletion when cards are removed
- Notes field for user annotations

#### `alerts` - Alert Rules
Supports threshold-based alert rules with flexible operators.

**Key Features:**
- Multiple operators: `>`, `>=`, `<`, `<=`, `crosses_above`, `crosses_below`
- Source, category, and tag filtering
- Active/inactive status tracking
- Trigger count and last triggered tracking

#### `tti` - Time-to-Insight Telemetry
Measures pipeline performance and timing.

**Key Features:**
- Generated duration columns in seconds
- Pipeline and stage tracking
- Status tracking (running, completed, failed, cancelled)
- Error message storage

### Views

#### `trending_cards`
Shows high-trending cards (trend_score >= 70) with save counts and average metrics.

#### `alert_violations`
Shows current alert violations for active alerts.

## Database Features

### Constraints
- **CHECK constraints** on all score fields (0-100 range)
- **UNIQUE constraints** to prevent duplicates
- **FOREIGN KEY constraints** with CASCADE deletion
- **NOT NULL constraints** on required fields

### Indexes
- **Performance indexes** on frequently queried columns
- **Composite indexes** for complex queries
- **GIN indexes** for JSONB and array fields
- **Time-series indexes** for efficient temporal queries

### Triggers
- **Automatic `updated_at` timestamps** on all tables
- **Generated columns** for calculated values

## Migration System

### Migration Runner (`scripts/migrate.js`)

**Features:**
- Transaction-safe migrations
- Migration tracking via `schema_migrations` table
- Rollback protection
- Status reporting
- Error handling with detailed logging

**Usage:**
```bash
# Apply pending migrations
npm run db:migrate

# Check migration status
npm run db:migrate:status

# Direct usage
node scripts/migrate.js
node scripts/migrate.js status
```

### Seed Runner (`scripts/seed.js`)

**Features:**
- Development data seeding
- Force seeding option
- Data reset capabilities
- Data summary reporting
- Transaction safety

**Usage:**
```bash
# Seed development data
npm run db:seed

# Force seed (overwrite existing data)
npm run db:seed:force

# Reset all data
npm run db:seed:reset

# Reset and seed
npm run db:seed:reset:seed

# Show data summary
npm run db:seed:summary
```

## Setup Commands

### Complete Setup
```bash
# Run migrations and seed data
npm run db:setup
```

### Step-by-Step Setup
```bash
# 1. Apply database schema
npm run db:migrate

# 2. Seed development data
npm run db:seed

# 3. Verify setup
npm run db:seed:summary
```

## Environment Requirements

### Required Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

### Database Requirements
- PostgreSQL 12+ (for generated columns)
- `pgcrypto` extension (for UUID generation)
- `uuid-ossp` extension (for UUID functions)

## Performance Optimizations

### Query Optimization
- **Composite indexes** for common query patterns
- **Partial indexes** for filtered queries
- **Covering indexes** for frequently accessed data
- **Time-series optimization** for temporal queries

### Storage Optimization
- **JSONB compression** for metadata
- **Array storage** for tags
- **Generated columns** for calculated values
- **Efficient data types** (SMALLINT for scores)

## Monitoring and Maintenance

### Health Checks
```bash
# Check database health
npm run db:health

# Check migration status
npm run db:migrate:status

# View data summary
npm run db:seed:summary
```

### Performance Monitoring
- Monitor query performance on indexed columns
- Track TTI metrics for pipeline performance
- Monitor alert trigger rates
- Watch for constraint violations

## Development Workflow

### Adding New Migrations
1. Create new SQL file in `db/migrations/`
2. Use timestamp prefix: `0002_feature_name.sql`
3. Test migration locally
4. Commit and deploy

### Adding New Seeds
1. Create new SQL file in `db/seeds/`
2. Use descriptive names: `0002_additional_data.sql`
3. Test with `npm run db:seed:reset:seed`
4. Commit and deploy

### Schema Changes
1. Create migration for schema changes
2. Update seed data if needed
3. Test with full reset and seed
4. Update documentation

## Troubleshooting

### Common Issues

**Migration Fails:**
- Check PostgreSQL version compatibility
- Verify DATABASE_URL is correct
- Check for syntax errors in migration files

**Seed Data Issues:**
- Ensure migrations are applied first
- Check for constraint violations
- Verify foreign key relationships

**Performance Issues:**
- Check index usage with EXPLAIN ANALYZE
- Monitor slow query logs
- Consider adding missing indexes

### Recovery Procedures

**Reset Everything:**
```bash
npm run db:seed:reset:seed
```

**Check Migration Status:**
```bash
npm run db:migrate:status
```

**Manual Database Reset:**
```sql
-- Drop and recreate schema (DANGEROUS - backup first!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## Security Considerations

- **UUID primary keys** prevent enumeration attacks
- **CHECK constraints** ensure data integrity
- **CASCADE deletion** maintains referential integrity
- **Transaction safety** prevents partial updates
- **Environment variable** protection for credentials
