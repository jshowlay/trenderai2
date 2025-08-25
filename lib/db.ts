import { Pool, PoolClient, QueryResult } from 'pg'

// Database configuration interface
interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl: boolean | { rejectUnauthorized: boolean }
  max: number
  idleTimeoutMillis: number
  connectionTimeoutMillis: number
}

// Parse DATABASE_URL into configuration object
function parseDatabaseUrl(url: string): DatabaseConfig {
  const parsed = new URL(url)
  
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432'),
    database: parsed.pathname.slice(1), // Remove leading slash
    user: parsed.username,
    password: parsed.password,
    ssl: {
      rejectUnauthorized: false // Required for Neon
    },
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000 // Return an error after 2 seconds if connection could not be established
  }
}

// Global pool instance to prevent connection storms during hot reload
let pool: Pool | null = null

// Get or create the database pool
export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required')
    }

    const config = parseDatabaseUrl(databaseUrl)
    
    pool = new Pool(config)
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    
    // Log pool creation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Database pool created')
    }
  }
  
  return pool
}

// Query helper function with TypeScript support
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = await getPool().connect()
  
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Transaction helper function
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Health check function
export async function healthCheck(): Promise<{
  ok: boolean
  now: string
  version: string
  error?: string
}> {
  try {
    const result = await query('SELECT NOW() as now, version() as version')
    const { now, version } = result.rows[0]
    
    return {
      ok: true,
      now: now.toISOString(),
      version: version.split(' ')[0] // Extract just the version number
    }
  } catch (error) {
    return {
      ok: false,
      now: new Date().toISOString(),
      version: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Close the pool (useful for testing or graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log('📦 Database pool closed')
  }
}

// Export pool for direct access if needed
export { pool }
