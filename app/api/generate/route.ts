import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CulturalStrategyEngine } from '@/src/services/engines/cultural-strategy';
import { ConventionViolationEngine } from '@/src/services/engines/convention-violation';
import { randomUUID } from 'crypto';

const campaignRequestSchema = z.object({
  brandId: z.string(),
  brandName: z.string(),
  campaignBrief: z.string().optional(), // Full campaign brief from user
  industry: z.string(),
  targetAudience: z.string(),
  objectives: z.array(z.string()),
  brandValues: z.array(z.string()),
  brandArchetype: z.string(),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = campaignRequestSchema.parse(body);
    
    console.log('Starting campaign generation with brief:', validatedRequest.campaignBrief || 'No brief provided');
    
    // Phase 1: Cultural Analysis (optional, for context)
    let culturalInsights, conventionViolations;
    try {
      const culturalEngine = new CulturalStrategyEngine();
      const conventionEngine = new ConventionViolationEngine();
      
      [culturalInsights, conventionViolations] = await Promise.all([
        culturalEngine.analyzeCulturalTensions(
          validatedRequest.brandName,
          validatedRequest.industry,
          validatedRequest.targetAudience
        ),
        conventionEngine.mapIndustryConventions(validatedRequest.industry)
      ]);
    } catch (error) {
      console.log('Cultural analysis skipped:', error);
    }
    
    // Phase 2: Generate Campaign Components
    const campaignId = randomUUID();
    const baseUrl = `${request.nextUrl.origin}/api/campaign`;
    
    // 2.1 Executive Summary
    const summaryResponse = await fetch(`${baseUrl}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validatedRequest,
        campaignBrief: validatedRequest.campaignBrief,
        culturalInsights,
        conventionViolations
      })
    });
    const summaryData = await summaryResponse.json();
    
    if (!summaryData.success) {
      throw new Error('Failed to generate campaign summary');
    }
    
    // 2.2 Audience Development
    const audienceResponse = await fetch(`${baseUrl}/audience`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandName: validatedRequest.brandName,
        targetAudience: validatedRequest.targetAudience,
        campaignName: summaryData.summary.campaignName,
        bigIdea: summaryData.summary.bigIdea,
        culturalInsights
      })
    });
    const audienceData = await audienceResponse.json();
    
    // 2.3 KPIs & Success Metrics
    const kpiResponse = await fetch(`${baseUrl}/kpis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignName: summaryData.summary.campaignName,
        objectives: validatedRequest.objectives,
        budget: validatedRequest.budget,
        timeline: validatedRequest.timeline,
        bigIdea: summaryData.summary.bigIdea
      })
    });
    const kpiData = await kpiResponse.json();
    
    // 2.4 Media Strategy
    const mediaResponse = await fetch(`${baseUrl}/media-strategy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignName: summaryData.summary.campaignName,
        bigIdea: summaryData.summary.bigIdea,
        targetAudience: validatedRequest.targetAudience,
        budget: validatedRequest.budget,
        timeline: validatedRequest.timeline,
        platforms: ['TikTok', 'Instagram', 'X/Twitter']
      })
    });
    const mediaData = await mediaResponse.json();
    
    // 2.5 Creative Concepts
    const creativeResponse = await fetch(`${baseUrl}/creative`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignName: summaryData.summary.campaignName,
        bigIdea: summaryData.summary.bigIdea,
        tagline: summaryData.summary.tagline,
        brandValues: validatedRequest.brandValues,
        conventionViolations,
        platforms: ['TikTok', 'Instagram', 'X/Twitter']
      })
    });
    const creativeData = await creativeResponse.json();
    
    // Compose Full Campaign
    const campaign = {
      id: campaignId,
      brandId: validatedRequest.brandId,
      brandName: validatedRequest.brandName,
      industry: validatedRequest.industry,
      summary: summaryData.summary,
      audience: audienceData.audience,
      kpis: kpiData.kpis,
      mediaStrategy: mediaData.mediaStrategy,
      creative: creativeData.creative,
      metadata: {
        culturalInsights,
        conventionViolations,
        generatedAt: new Date().toISOString()
      }
    };
    
    // Store campaign in database
    const storeCampaignResponse = await fetch(`${baseUrl}s/${campaignId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id: validatedRequest.brandId,
        brand_name: summaryData.summary.campaignName || 'Campaign',
        industry: validatedRequest.industry,
        campaign_name: summaryData.summary.campaignName,
        tagline: summaryData.summary.tagline,
        big_idea: summaryData.summary.bigIdea,
        strategic_rationale: summaryData.summary.strategicRationale,
        expected_impact: summaryData.summary.expectedImpact,
        target_audience: validatedRequest.targetAudience,
        objectives: validatedRequest.objectives,
        brand_values: validatedRequest.brandValues,
        brand_archetype: validatedRequest.brandArchetype,
        risk_tolerance: validatedRequest.riskTolerance,
        summary_data: summaryData.summary,
        audience_data: audienceData.audience,
        kpi_data: kpiData.kpis,
        media_strategy_data: mediaData.mediaStrategy,
        creative_data: creativeData.creative
      })
    });
    
    const storeResult = await storeCampaignResponse.json();
    
    return NextResponse.json({
      success: true,
      campaign,
      campaignId: storeResult.id,
      campaignSlug: storeResult.slug,
      message: 'Full campaign generated successfully',
    });
    
  } catch (error) {
    console.error('Campaign generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request format',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate campaign',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate',
    method: 'POST',
    description: 'Generate a breakthrough marketing campaign using Kumorebe AI',
    requiredFields: {
      brandId: 'Unique identifier for the brand',
      brandName: 'Name of the brand',
      industry: 'Industry category (e.g., "technology", "fashion", "food & beverage")',
      targetAudience: 'Target audience description',
      objectives: 'Array of campaign objectives',
      brandValues: 'Array of core brand values',
      brandArchetype: 'Brand archetype (e.g., "rebel", "hero", "creator")',
      riskTolerance: 'Risk tolerance level: "low", "medium", or "high"',
    },
    optionalFields: {
      budget: 'Campaign budget range',
      timeline: 'Campaign timeline',
    },
    exampleRequest: {
      brandId: 'brand-123',
      brandName: 'TechDisruptor',
      industry: 'technology',
      targetAudience: 'Gen Z digital natives who value authenticity',
      objectives: ['Increase brand awareness', 'Drive app downloads'],
      brandValues: ['Innovation', 'Transparency', 'Community'],
      brandArchetype: 'rebel',
      riskTolerance: 'high',
      budget: '$50k-$100k',
      timeline: '3 months',
    },
  });
}