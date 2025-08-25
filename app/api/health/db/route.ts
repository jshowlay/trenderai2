import { NextRequest, NextResponse } from 'next/server'
import { healthCheck } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const health = await healthCheck()
    
    if (health.ok) {
      return NextResponse.json(health, { status: 200 })
    } else {
      return NextResponse.json(health, { status: 503 })
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json(
      {
        ok: false,
        now: new Date().toISOString(),
        version: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
