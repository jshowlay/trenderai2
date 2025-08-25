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

// Get all seed files
function getSeedFiles() {
  const seedsDir = path.join(__dirname, '..', 'db', 'seeds');
  if (!fs.existsSync(seedsDir)) {
    console.error('❌ Seeds directory not found:', seedsDir);
    process.exit(1);
  }

  return fs.readdirSync(seedsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      filename: file,
      path: path.join(seedsDir, file),
      version: file.replace('.sql', '')
    }));
}

// Check if database has data
async function hasData(pool) {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM cards');
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    // If table doesn't exist, return false
    if (error.code === '42P01') { // undefined_table
      return false;
    }
    throw error;
  }
}

// Apply a single seed file
async function applySeed(pool, seed) {
  const client = await pool.connect();
  
  try {
    console.log(`🌱 Applying seed: ${seed.filename}`);
    
    // Read seed file
    const sql = fs.readFileSync(seed.path, 'utf8');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Apply seed
    await client.query(sql);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`✅ Applied seed: ${seed.filename}`);
    return true;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to apply seed ${seed.filename}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Main seed function
async function runSeeds() {
  const pool = getPool();
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Check if database already has data
    const hasExistingData = await hasData(pool);
    
    if (hasExistingData) {
      console.log('⚠️  Database already contains data!');
      
      if (process.argv.includes('--force')) {
        console.log('🔄 Force flag detected, proceeding with seeding...\n');
      } else {
        console.log('💡 Use --force flag to seed anyway, or --reset to clear data first');
        console.log('   Example: node scripts/seed.js --force');
        console.log('   Example: node scripts/seed.js --reset');
        return;
      }
    }
    
    // Get seed files
    const seedFiles = getSeedFiles();
    
    if (seedFiles.length === 0) {
      console.log('❌ No seed files found in db/seeds/');
      return;
    }
    
    console.log(`📋 Found ${seedFiles.length} seed files:`);
    seedFiles.forEach(seed => {
      console.log(`   - ${seed.filename}`);
    });
    console.log('');
    
    // Apply seed files
    let appliedCount = 0;
    for (const seed of seedFiles) {
      try {
        await applySeed(pool, seed);
        appliedCount++;
      } catch (error) {
        console.error(`\n❌ Seeding failed. Stopping execution.`);
        console.error(`Last successful seed: ${appliedCount > 0 ? seedFiles[appliedCount - 1].filename : 'None'}`);
        process.exit(1);
      }
    }
    
    console.log(`\n🎉 Successfully applied ${appliedCount} seed files!`);
    
    // Show summary of seeded data
    await showDataSummary(pool);
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Reset database data
async function resetData() {
  const pool = getPool();
  
  try {
    console.log('🗑️  Resetting database data...\n');
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Clear all data from tables (in reverse dependency order)
      const tables = ['tti', 'alerts', 'saved', 'counts', 'cards'];
      
      for (const table of tables) {
        console.log(`🗑️  Clearing ${table} table...`);
        await client.query(`DELETE FROM ${table}`);
      }
      
      await client.query('COMMIT');
      console.log('✅ Database reset completed!\n');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Reset error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Show summary of seeded data
async function showDataSummary(pool) {
  try {
    console.log('📊 Data Summary:');
    
    const tables = ['cards', 'counts', 'saved', 'alerts', 'tti'];
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      console.log(`   ${table}: ${count} records`);
    }
    
    // Show some sample data
    console.log('\n📋 Sample Cards:');
    const cardsResult = await pool.query(`
      SELECT title, trend_score, category 
      FROM cards 
      ORDER BY trend_score DESC 
      LIMIT 3
    `);
    
    cardsResult.rows.forEach(card => {
      console.log(`   - ${card.title} (Score: ${card.trend_score}, Category: ${card.category})`);
    });
    
    console.log('\n📋 Sample Alerts:');
    const alertsResult = await pool.query(`
      SELECT name, metric_name, operator, threshold_value 
      FROM alerts 
      LIMIT 3
    `);
    
    alertsResult.rows.forEach(alert => {
      console.log(`   - ${alert.name} (${alert.metric_name} ${alert.operator} ${alert.threshold_value})`);
    });
    
  } catch (error) {
    console.error('❌ Error getting data summary:', error.message);
  }
}

// CLI commands
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--reset')) {
    await resetData();
    if (args.includes('--seed')) {
      console.log('\n🌱 Running seeds after reset...\n');
      await runSeeds();
    }
  } else if (args.includes('--summary')) {
    const pool = getPool();
    await showDataSummary(pool);
    await pool.end();
  } else {
    await runSeeds();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { runSeeds, resetData, showDataSummary };
