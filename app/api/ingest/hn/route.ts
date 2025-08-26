import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { generateSlug } from '@/lib/slug';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// HN API endpoint
const HN_API_URL = 'https://hn.algolia.com/api/v1/search?tags=front_page';

// Time bucketing configuration
const BUCKET_SIZE_MINUTES = 15;

interface HNStory {
  objectID: string;
  title: string;
  url?: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
  created_at_i: number;
  _tags: string[];
}

interface HNResponse {
  hits: HNStory[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
}

/**
 * Align timestamp to 15-minute bucket boundaries
 */
function alignToBucketBoundary(timestamp: Date): Date {
  const minutes = timestamp.getMinutes();
  const bucketStart = Math.floor(minutes / BUCKET_SIZE_MINUTES) * BUCKET_SIZE_MINUTES;
  
  const aligned = new Date(timestamp);
  aligned.setMinutes(bucketStart, 0, 0);
  return aligned;
}

/**
 * Get current 15-minute bucket window
 */
function getCurrentBucketWindow(): { start: Date; end: Date } {
  const now = new Date();
  const start = alignToBucketBoundary(now);
  const end = new Date(start.getTime() + BUCKET_SIZE_MINUTES * 60 * 1000);
  
  return { start, end };
}

/**
 * Fetch HN front page stories from Algolia API
 */
async function fetchHNStories(): Promise<HNStory[]> {
  try {
    const response = await fetch(HN_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TrenderAI-HN-Ingestion/1.0'
      },
      next: { revalidate: 0 } // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`HN API responded with status: ${response.status}`);
    }

    const data: HNResponse = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error fetching HN stories:', error);
    throw new Error(`Failed to fetch HN stories: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process and upsert HN stories into the database
 */
async function processHNStories(stories: HNStory[], bucketStart: Date, bucketEnd: Date): Promise<{
  upsertedCards: number;
  countsRows: number;
}> {
  let upsertedCards = 0;
  let countsRows = 0;

  for (const story of stories) {
    try {
      // Generate unique slug
      const slug = generateSlug(story.title, story.objectID);
      
      // Prepare card metadata
      const metadata = {
        hn_id: story.objectID,
        url: story.url || null,
        hn_url: `https://news.ycombinator.com/item?id=${story.objectID}`,
        author: story.author,
        created_at: new Date(story.created_at_i * 1000).toISOString(),
        source: 'hackernews',
        points: story.points,
        num_comments: story.num_comments,
        tags: story._tags || []
      };

      // Upsert card
      const cardResult = await query(`
        INSERT INTO cards (
          slug, title, description, source, source_url, category,
          velocity_score, acceleration_score, convergence_score,
          search_intent_score, creator_score, engagement_efficiency_score,
          geo_demo_spread_score, source_tags, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `, [
        slug,
        story.title,
        `Hacker News story by ${story.author}`,
        'hackernews',
        story.url || `https://news.ycombinator.com/item?id=${story.objectID}`,
        'Technology',
        // Default scores (can be updated by AI analysis later)
        50, 50, 50, 50, 50, 50, 50,
        ['hackernews'],
        JSON.stringify(metadata)
      ]);

      if (cardResult.rows.length > 0) {
        upsertedCards++;
        const cardId = cardResult.rows[0].id;

        // Insert time-bucketed counts for rank, points, and comments
        const countMetrics = [
          { name: 'rank', value: stories.indexOf(story) + 1 },
          { name: 'points', value: story.points },
          { name: 'comments', value: story.num_comments }
        ];

        for (const metric of countMetrics) {
          const countResult = await query(`
            INSERT INTO counts (
              card_id, source, metric_name, metric_value,
              bucket_start, bucket_end, bucket_size
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (card_id, source, metric_name, bucket_start, bucket_end) DO NOTHING
          `, [
            cardId,
            'hackernews',
            metric.name,
            metric.value,
            bucketStart,
            bucketEnd,
            '15m'
          ]);

          if (countResult.rowCount > 0) {
            countsRows++;
          }
        }
      }
    } catch (error) {
      console.error(`Error processing story ${story.objectID}:`, error);
      // Continue processing other stories
    }
  }

  return { upsertedCards, countsRows };
}

/**
 * Main ingestion handler
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting HN ingestion...');

    // Get current bucket window
    const { start: bucketStart, end: bucketEnd } = getCurrentBucketWindow();
    
    console.log(`📅 Bucket window: ${bucketStart.toISOString()} to ${bucketEnd.toISOString()}`);

    // Fetch HN stories
    const stories = await fetchHNStories();
    console.log(`📰 Fetched ${stories.length} HN stories`);

    if (stories.length === 0) {
      return NextResponse.json({
        ok: false,
        error: 'No stories fetched from HN API',
        upsertedCards: 0,
        countsRows: 0,
        windowStart: bucketStart.toISOString(),
        windowEnd: bucketEnd.toISOString()
      }, { status: 500 });
    }

    // Process stories in a transaction
    const result = await transaction(async (client) => {
      return await processHNStories(stories, bucketStart, bucketEnd);
    });

    console.log(`✅ HN ingestion completed: ${result.upsertedCards} cards upserted, ${result.countsRows} count rows inserted`);

    return NextResponse.json({
      ok: true,
      upsertedCards: result.upsertedCards,
      countsRows: result.countsRows,
      windowStart: bucketStart.toISOString(),
      windowEnd: bucketEnd.toISOString(),
      totalStories: stories.length,
      bucketSizeMinutes: BUCKET_SIZE_MINUTES
    });

  } catch (error) {
    console.error('❌ HN ingestion failed:', error);
    
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      upsertedCards: 0,
      countsRows: 0,
      windowStart: new Date().toISOString(),
      windowEnd: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * GET handler for testing and status
 */
export async function GET() {
  try {
    const { start: bucketStart, end: bucketEnd } = getCurrentBucketWindow();
    
    return NextResponse.json({
      ok: true,
      message: 'HN ingestion endpoint is ready',
      currentBucket: {
        start: bucketStart.toISOString(),
        end: bucketEnd.toISOString(),
        sizeMinutes: BUCKET_SIZE_MINUTES
      },
      usage: {
        method: 'POST',
        description: 'Trigger HN front page ingestion',
        response: {
          ok: 'boolean',
          upsertedCards: 'number',
          countsRows: 'number',
          windowStart: 'string (ISO)',
          windowEnd: 'string (ISO)'
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
