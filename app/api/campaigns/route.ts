import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { generateEmbedding } from '@/lib/ai/deepinfra';
import { upsertVector } from '@/lib/ai/vector';
import { Campaign } from '@/types/campaign';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, brandId, industry, strategyMetadata } = body;

    const result = await sql`
      INSERT INTO campaigns (title, brand_id, industry, strategy_metadata)
      VALUES (${title}, ${brandId}, ${industry}, ${JSON.stringify(strategyMetadata)})
      RETURNING *
    `;

    const campaign = result[0];

    const embeddingText = `${title} ${industry} ${strategyMetadata.culturalTension} ${strategyMetadata.ideologicalOpportunity}`;
    const embedding = await generateEmbedding(embeddingText);

    await sql`
      INSERT INTO campaign_vectors (campaign_id, embedding, model_version, metadata)
      VALUES (${campaign.id}, ${embedding}, 'bge-large-en-v1.5', ${JSON.stringify({ generated_at: new Date() })})
    `;

    await upsertVector(campaign.id, embedding, {
      campaignId: campaign.id,
      type: 'campaign',
      timestamp: Date.now(),
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brandId = searchParams.get('brandId');
    const limit = searchParams.get('limit') || '10';

    let query;
    if (brandId) {
      query = sql`
        SELECT * FROM campaigns 
        WHERE brand_id = ${brandId}
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)}
      `;
    } else {
      query = sql`
        SELECT * FROM campaigns 
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)}
      `;
    }

    const campaigns = await query;
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Campaign fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}