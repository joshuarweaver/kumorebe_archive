import { NextRequest, NextResponse } from 'next/server';
import { sql, generateSlug } from '@/src/lib/db/neon';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to get by ID first (if it's a valid UUID), then by slug
    let campaigns;
    
    // Check if the id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(id)) {
      // It's a UUID, search by both id and slug
      campaigns = await sql`
        SELECT * FROM campaigns 
        WHERE id = ${id}::uuid OR slug = ${id}
        LIMIT 1
      `;
    } else {
      // It's not a UUID, only search by slug
      campaigns = await sql`
        SELECT * FROM campaigns 
        WHERE slug = ${id}
        LIMIT 1
      `;
    }
    
    if (campaigns.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    const campaign = campaigns[0];
    
    // Increment view count asynchronously
    sql`
      UPDATE campaigns 
      SET viewed_count = viewed_count + 1 
      WHERE id = ${campaign.id}
    `.catch(console.error);
    
    // Log analytics
    const headers = request.headers;
    sql`
      INSERT INTO campaign_analytics 
      (campaign_id, event_type, ip_address, user_agent, referrer)
      VALUES (
        ${campaign.id}, 
        'view',
        ${headers.get('x-forwarded-for') || headers.get('x-real-ip')},
        ${headers.get('user-agent')},
        ${headers.get('referer')}
      )
    `.catch(console.error);
    
    return NextResponse.json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error('Error retrieving campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve campaign' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignData = await request.json();
    
    // Generate a slug for the campaign
    const slug = generateSlug(campaignData.campaign_name || 'campaign');
    
    // Insert or update campaign
    const result = await sql`
      INSERT INTO campaigns (
        id,
        brand_id,
        brand_name,
        industry,
        campaign_name,
        tagline,
        big_idea,
        strategic_rationale,
        expected_impact,
        target_audience,
        objectives,
        brand_values,
        brand_archetype,
        risk_tolerance,
        summary_data,
        audience_data,
        kpi_data,
        media_strategy_data,
        creative_data,
        slug
      ) VALUES (
        ${id},
        ${campaignData.brand_id},
        ${campaignData.brand_name},
        ${campaignData.industry},
        ${campaignData.campaign_name},
        ${campaignData.tagline},
        ${campaignData.big_idea},
        ${campaignData.strategic_rationale},
        ${campaignData.expected_impact},
        ${campaignData.target_audience},
        ${JSON.stringify(campaignData.objectives)},
        ${JSON.stringify(campaignData.brand_values)},
        ${campaignData.brand_archetype},
        ${campaignData.risk_tolerance},
        ${JSON.stringify(campaignData.summary_data)},
        ${JSON.stringify(campaignData.audience_data)},
        ${JSON.stringify(campaignData.kpi_data)},
        ${JSON.stringify(campaignData.media_strategy_data)},
        ${JSON.stringify(campaignData.creative_data)},
        ${slug}
      )
      ON CONFLICT (id) DO UPDATE SET
        brand_id = EXCLUDED.brand_id,
        brand_name = EXCLUDED.brand_name,
        industry = EXCLUDED.industry,
        campaign_name = EXCLUDED.campaign_name,
        tagline = EXCLUDED.tagline,
        big_idea = EXCLUDED.big_idea,
        strategic_rationale = EXCLUDED.strategic_rationale,
        expected_impact = EXCLUDED.expected_impact,
        target_audience = EXCLUDED.target_audience,
        objectives = EXCLUDED.objectives,
        brand_values = EXCLUDED.brand_values,
        brand_archetype = EXCLUDED.brand_archetype,
        risk_tolerance = EXCLUDED.risk_tolerance,
        summary_data = EXCLUDED.summary_data,
        audience_data = EXCLUDED.audience_data,
        kpi_data = EXCLUDED.kpi_data,
        media_strategy_data = EXCLUDED.media_strategy_data,
        creative_data = EXCLUDED.creative_data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, slug
    `;
    
    return NextResponse.json({
      success: true,
      id: result[0].id,
      slug: result[0].slug,
      message: 'Campaign stored successfully'
    });
  } catch (error) {
    console.error('Error storing campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to store campaign' },
      { status: 500 }
    );
  }
}