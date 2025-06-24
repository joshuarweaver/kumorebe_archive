import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyze, generateStructured, systemPrompts } from '@/ai/client';

const analyzeRequestSchema = z.object({
  brand: z.string(),
  industry: z.string(),
  target: z.string(),
  context: z.string().optional(),
});

const culturalInsightSchema = z.object({
  tensions: z.array(z.object({
    description: z.string(),
    intensity: z.number().min(0).max(1),
    opportunity: z.string(),
  })),
  movements: z.array(z.object({
    name: z.string(),
    description: z.string(),
    trajectory: z.enum(['emerging', 'growing', 'peaking', 'declining']),
    relevance: z.number().min(0).max(1),
  })),
  ideologicalOpportunities: z.array(z.object({
    insight: z.string(),
    brandApplication: z.string(),
    risk: z.enum(['low', 'medium', 'high']),
  })),
  mythMarkets: z.array(z.object({
    orthodoxy: z.string(),
    challengerMyth: z.string(),
    sourceCode: z.string(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, industry, target, context } = analyzeRequestSchema.parse(body);

    const prompt = `
Analyze the cultural landscape for ${brand} in the ${industry} industry targeting ${target}.

${context ? `Additional context: ${context}` : ''}

Identify:
1. Cultural tensions and contradictions that create opportunity
2. Emerging cultural movements relevant to the brand
3. Ideological opportunities for brand positioning
4. Myth markets that could be disrupted

Focus on insights that could lead to breakthrough campaign strategies.
`;

    const culturalInsights = await generateStructured('cultural_analysis', {
      prompt,
      schema: culturalInsightSchema,
      systemPrompt: systemPrompts.cultural_analysis,
    });

    // Generate strategic summary
    const summaryPrompt = `
Based on these cultural insights, provide a strategic summary for ${brand}:

${JSON.stringify(culturalInsights, null, 2)}

Write a 2-3 paragraph strategic recommendation focusing on the most potent cultural opportunity.
`;

    const summary = await analyze('strategic_reasoning', {
      prompt: summaryPrompt,
      systemPrompt: systemPrompts.strategic_reasoning,
    });

    return NextResponse.json({
      success: true,
      brand,
      industry,
      target,
      insights: culturalInsights,
      strategicSummary: summary.content,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Cultural analysis error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Analysis failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/analyze',
    method: 'POST',
    description: 'Analyze cultural tensions and opportunities for a brand',
    requiredFields: {
      brand: 'Brand name',
      industry: 'Industry category', 
      target: 'Target audience description',
    },
    optionalFields: {
      context: 'Additional context about the brand or campaign goals',
    },
    example: {
      brand: 'Nike',
      industry: 'sportswear',
      target: 'Gen Z athletes who value authenticity over performance',
      context: 'Looking to launch a campaign that challenges traditional sports marketing',
    },
  });
}