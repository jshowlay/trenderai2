#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database configuration
function parseDatabaseUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432'),
    database: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
    ssl: {
      rejectUnauthorized: false
    }
  };
}

// Get database connection
function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return new Pool(parseDatabaseUrl(databaseUrl));
}

// Get all migration files
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir);
    process.exit(1);
  }

  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      filename: file,
      path: path.join(migrationsDir, file),
      version: file.replace('.sql', '')
    }));
}

// Get applied migrations from database
async function getAppliedMigrations(pool) {
  try {
    const result = await pool.query('SELECT version FROM schema_migrations ORDER BY version');
    return result.rows.map(row => row.version);
  } catch (error) {
    // If schema_migrations table doesn't exist, return empty array
    if (error.code === '42P01') { // undefined_table
      return [];
    }
    throw error;
  }
}

// Apply a single migration
async function applyMigration(pool, migration) {
  const client = await pool.connect();
  
  try {
    console.log(`🔄 Applying migration: ${migration.filename}`);
    
    // Read migration file
    const sql = fs.readFileSync(migration.path, 'utf8');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Apply migration
    await client.query(sql);
    
    // Record migration as applied
    await client.query(
      'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
      [migration.version]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`✅ Applied migration: ${migration.filename}`);
    return true;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to apply migration ${migration.filename}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Main migration function
async function runMigrations() {
  const pool = getPool();
  
  try {
    console.log('🚀 Starting database migrations...\n');
    
    // Get migration files and applied migrations
    const migrationFiles = getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(pool);
    
    console.log(`📋 Found ${migrationFiles.length} migration files`);
    console.log(`📋 Applied ${appliedMigrations.length} migrations\n`);
    
    // Find pending migrations
    const pendingMigrations = migrationFiles.filter(
      migration => !appliedMigrations.includes(migration.version)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations are up to date!');
      return;
    }
    
    console.log(`🔄 Found ${pendingMigrations.length} pending migrations:`);
    pendingMigrations.forEach(migration => {
      console.log(`   - ${migration.filename}`);
    });
    console.log('');
    
    // Apply pending migrations
    let appliedCount = 0;
    for (const migration of pendingMigrations) {
      try {
        await applyMigration(pool, migration);
        appliedCount++;
      } catch (error) {
        console.error(`\n❌ Migration failed. Stopping execution.`);
        console.error(`Last successful migration: ${appliedCount > 0 ? pendingMigrations[appliedCount - 1].filename : 'None'}`);
        process.exit(1);
      }
    }
    
    console.log(`\n🎉 Successfully applied ${appliedCount} migrations!`);
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// CLI commands
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'status':
      await showStatus();
      break;
    case 'up':
    case undefined:
      await runMigrations();
      break;
    default:
      console.log('Usage: node scripts/migrate.js [command]');
      console.log('Commands:');
      console.log('  up     - Apply pending migrations (default)');
      console.log('  status - Show migration status');
      process.exit(1);
  }
}

// Show migration status
async function showStatus() {
  const pool = getPool();
  
  try {
    const migrationFiles = getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(pool);
    
    console.log('📊 Migration Status\n');
    console.log(`Total migration files: ${migrationFiles.length}`);
    console.log(`Applied migrations: ${appliedMigrations.length}`);
    console.log(`Pending migrations: ${migrationFiles.length - appliedMigrations.length}\n`);
    
    console.log('Migration Details:');
    migrationFiles.forEach(migration => {
      const status = appliedMigrations.includes(migration.version) ? '✅ Applied' : '⏳ Pending';
      console.log(`  ${migration.filename} - ${status}`);
    });
    
  } catch (error) {
    console.error('❌ Error getting migration status:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations, showStatus };
