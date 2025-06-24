import { NextRequest, NextResponse } from 'next/server';
import { CampaignGenerator, CampaignGenerationRequest } from '@/services/engines/campaign-generator';
import { z } from 'zod';

const campaignRequestSchema = z.object({
  brandId: z.string(),
  brandName: z.string(),
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
    
    const generator = new CampaignGenerator();
    const campaign = await generator.generateCampaign(validatedRequest);
    
    return NextResponse.json({
      success: true,
      campaign,
      message: 'Campaign generated successfully',
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