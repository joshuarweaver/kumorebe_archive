import { NextRequest, NextResponse } from 'next/server';
import { analyzeRealTimeTrends } from '@/src/lib/ai/groq';
import { generateEmbedding } from '@/src/lib/ai/deepinfra';
import { upsertVector, queryVectors } from '@/src/lib/ai/vector';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/src/lib/cache/redis';
import { sql } from '@/src/lib/db/neon';

export async function POST(request: NextRequest) {
  try {
    const { query, industry, brandContext } = await request.json();

    const cacheKey = `${CACHE_KEYS.TRENDS}:${industry}:${query}`;
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const trendAnalysis = await analyzeRealTimeTrends(
      `Analyze trends for ${industry} industry. Brand context: ${brandContext}. Focus on: ${query}`
    );

    const parsedTrends = parseTrendAnalysis(trendAnalysis);

    for (const trend of parsedTrends) {
      const embedding = await generateEmbedding(trend.description);
      await upsertVector(
        `trend-${Date.now()}-${Math.random()}`,
        embedding,
        {
          type: 'trend',
          timestamp: Date.now(),
          source: 'groq-analysis',
          confidence: trend.confidence,
        }
      );
    }

    await setCachedData(cacheKey, parsedTrends, CACHE_TTL.TRENDS);

    return NextResponse.json({ trends: parsedTrends });
  } catch (error) {
    console.error('Trend analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze trends' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (query) {
      const embedding = await generateEmbedding(query);
      const results = await queryVectors(embedding, limit, { type: 'trend' });
      
      return NextResponse.json({ trends: results });
    }

    const cachedTrends = await getCachedData(`${CACHE_KEYS.TRENDS}:latest`);
    if (cachedTrends) {
      return NextResponse.json({ trends: cachedTrends });
    }

    return NextResponse.json({ trends: [] });
  } catch (error) {
    console.error('Trend fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}

function parseTrendAnalysis(analysis: string) {
  const trends = [];
  const lines = analysis.split('\n');
  
  for (const line of lines) {
    if (line.includes('Trend:') || line.includes('trend')) {
      trends.push({
        description: line.replace(/^.*?(Trend:|trend:)/i, '').trim(),
        confidence: 0.8,
        timestamp: new Date(),
      });
    }
  }

  return trends;
}