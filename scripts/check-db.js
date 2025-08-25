#!/usr/bin/env node

const { Pool } = require('pg')

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logError(message) {
  console.error(`${colors.red}${colors.bold}ERROR:${colors.reset} ${message}`)
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bold}✓${colors.reset} ${message}`)
}

function logInfo(message) {
  console.log(`${colors.blue}${colors.bold}ℹ${colors.reset} ${message}`)
}

async function checkDatabase() {
  const startTime = Date.now()
  
  log('🔍 Checking database connectivity...', 'blue')
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    logError('DATABASE_URL environment variable is not set')
    logInfo('Please set your Neon database URL in your environment variables')
    logInfo('Example: export DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"')
    process.exit(1)
  }
  
  let pool = null
  
  try {
    // Parse DATABASE_URL
    const url = new URL(process.env.DATABASE_URL)
    logInfo(`Connecting to: ${url.hostname}:${url.port}/${url.pathname.slice(1)}`)
    
    // Create pool with Neon-specific configuration
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Neon
      },
      max: 1, // Use single connection for CLI check
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000
    })
    
    // Test connection
    const client = await pool.connect()
    
    try {
      // Get database information
      const versionResult = await client.query('SELECT version()')
      const nowResult = await client.query('SELECT NOW()')
      const userResult = await client.query('SELECT current_user, current_database()')
      
      const version = versionResult.rows[0].version
      const now = nowResult.rows[0].now
      const { current_user, current_database } = userResult.rows[0]
      
      const duration = Date.now() - startTime
      
      // Display results
      log('\n📊 Database Connection Results:', 'blue')
      logSuccess(`Connected successfully in ${duration}ms`)
      logInfo(`Server: ${version.split(' ')[0]}`)
      logInfo(`User: ${current_user}`)
      logInfo(`Database: ${current_database}`)
      logInfo(`Timestamp: ${now.toISOString()}`)
      
      // Check if using pooled connection (recommended for Neon)
      if (url.hostname.includes('pooler')) {
        logSuccess('Using pooled connection (recommended for Neon)')
      } else {
        log('⚠️  Consider using pooled connection for better performance', 'yellow')
        logInfo('Pooled URL format: postgresql://user:pass@pooler-host:port/db?sslmode=require')
      }
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    logError(`Connection failed after ${duration}ms`)
    logError(error.message)
    
    // Provide helpful error messages
    if (error.code === 'ENOTFOUND') {
      logInfo('Check your DATABASE_URL hostname and network connectivity')
    } else if (error.code === 'ECONNREFUSED') {
      logInfo('Check your DATABASE_URL port and firewall settings')
    } else if (error.message.includes('authentication')) {
      logInfo('Check your DATABASE_URL username and password')
    } else if (error.message.includes('database')) {
      logInfo('Check your DATABASE_URL database name')
    } else if (error.message.includes('SSL')) {
      logInfo('Ensure your DATABASE_URL includes sslmode=require')
    }
    
    process.exit(1)
    
  } finally {
    if (pool) {
      await pool.end()
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  log('\n👋 Shutting down...', 'yellow')
  process.exit(0)
})

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:')
  logError(`Promise: ${promise}`)
  logError(`Reason: ${reason}`)
  process.exit(1)
})

// Run the check
checkDatabase().catch((error) => {
  logError('Unexpected error:')
  logError(error.message)
  process.exit(1)
})
