import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { z } from 'zod';

const kpiRequestSchema = z.object({
  campaignName: z.string(),
  objectives: z.array(z.string()),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  bigIdea: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = kpiRequestSchema.parse(body);
    
    const systemPrompt = `You are a performance strategist setting KPIs and success metrics for a breakthrough campaign.

Create comprehensive measurement framework including:

1. NORTH STAR METRIC:
   - The ONE metric that matters most
   - Why it captures campaign success
   - Target number with rationale

2. PRIMARY KPIs (3-5):
   - Specific, measurable metrics
   - Baseline → Target with % increase
   - Measurement methodology
   - Reporting cadence

3. ENGAGEMENT METRICS:
   - Participation rate
   - Virality coefficient
   - Share of voice
   - Sentiment analysis targets

4. CULTURAL IMPACT METRICS:
   - Media coverage targets
   - Influencer engagement
   - Meme creation/spread
   - Cultural conversation share

5. BUSINESS OUTCOMES:
   - Revenue impact
   - Customer acquisition
   - Brand lift metrics
   - Market share goals

6. MEASUREMENT PLAN:
   - Pre-campaign benchmarks needed
   - Real-time tracking dashboard
   - Weekly optimization triggers
   - Post-campaign analysis

Be specific with numbers, percentages, and timelines. Make metrics ambitious but achievable.`;

    const userPrompt = `Campaign: ${validatedRequest.campaignName}
Big Idea: ${validatedRequest.bigIdea}
Objectives: ${validatedRequest.objectives.join(', ')}
${validatedRequest.budget ? `Budget: ${validatedRequest.budget}` : ''}
${validatedRequest.timeline ? `Timeline: ${validatedRequest.timeline}` : ''}

Set ambitious but achievable KPIs that will prove this campaign's breakthrough success.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.7, max_tokens: 2000 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    return NextResponse.json({
      success: true,
      kpis: {
        fullFramework: content,
        northStarMetric: extractNorthStar(content),
        primaryKPIs: extractPrimaryKPIs(content),
        engagementMetrics: extractEngagementMetrics(content),
        culturalImpactMetrics: extractCulturalMetrics(content),
        businessOutcomes: extractBusinessOutcomes(content),
        measurementPlan: extractMeasurementPlan(content),
      }
    });
  } catch (error) {
    console.error('KPI generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate KPIs'
      },
      { status: 500 }
    );
  }
}

function extractNorthStar(content: string): any {
  const section = content.match(/NORTH STAR.*?(?=PRIMARY|$)/is)?.[0] || '';
  return {
    metric: section.match(/Metric.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    target: section.match(/Target.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    rationale: section.match(/Why.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractPrimaryKPIs(content: string): any[] {
  const section = content.match(/PRIMARY KPIs.*?(?=ENGAGEMENT|$)/is)?.[0] || '';
  const kpis: any[] = [];
  const kpiMatches = section.matchAll(/\d+\.\s*(.+?)(?=\d+\.|ENGAGEMENT|$)/gis);
  
  for (const match of kpiMatches) {
    const kpiText = match[1];
    kpis.push({
      metric: kpiText.split('\n')[0]?.trim() || '',
      target: kpiText.match(/Target.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
      baseline: kpiText.match(/Baseline.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    });
  }
  
  return kpis.slice(0, 5);
}

function extractEngagementMetrics(content: string): any {
  const section = content.match(/ENGAGEMENT METRICS.*?(?=CULTURAL|$)/is)?.[0] || '';
  return {
    participationRate: section.match(/Participation.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    viralityCoefficient: section.match(/Virality.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    shareOfVoice: section.match(/Share of Voice.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    sentiment: section.match(/Sentiment.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractCulturalMetrics(content: string): any {
  const section = content.match(/CULTURAL IMPACT.*?(?=BUSINESS|$)/is)?.[0] || '';
  return {
    mediaCoverage: section.match(/Media.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    influencerEngagement: section.match(/Influencer.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    memeCreation: section.match(/Meme.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    conversationShare: section.match(/Conversation.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractBusinessOutcomes(content: string): any {
  const section = content.match(/BUSINESS OUTCOMES.*?(?=MEASUREMENT|$)/is)?.[0] || '';
  return {
    revenueImpact: section.match(/Revenue.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    customerAcquisition: section.match(/Customer.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    brandLift: section.match(/Brand.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    marketShare: section.match(/Market.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractMeasurementPlan(content: string): any {
  const section = content.match(/MEASUREMENT PLAN.*?$/is)?.[0] || '';
  return {
    benchmarks: section.match(/Benchmark.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    tracking: section.match(/Tracking.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    optimization: section.match(/Optimization.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    analysis: section.match(/Analysis.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}