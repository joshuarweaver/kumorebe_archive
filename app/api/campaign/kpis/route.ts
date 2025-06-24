import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const kpiRequestSchema = z.object({
  campaignName: z.string(),
  objectives: z.array(z.string()),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  bigIdea: z.string(),
});

const kpiSchema = z.object({
  name: z.string(),
  definition: z.string(),
  current: z.number(),
  target: z.number(),
  benchmark: z.number(),
  unit: z.string(),
  category: z.enum(['awareness', 'engagement', 'conversion', 'loyalty']),
  importance: z.enum(['critical', 'high', 'medium']),
  trend: z.enum(['up', 'down', 'stable']),
  description: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = kpiRequestSchema.parse(body);
    
    const systemPrompt = `You are a performance strategist setting KPIs and success metrics for a breakthrough campaign.

Create a comprehensive measurement framework with EXACTLY this JSON structure:

{
  "northStarMetric": {
    "name": "Metric Name",
    "value": 0,
    "target": 100,
    "description": "Why this metric matters most"
  },
  "kpis": [
    {
      "name": "KPI Name",
      "definition": "Clear definition of what this measures",
      "current": 0,
      "target": 50,
      "benchmark": 25,
      "unit": "%",
      "category": "awareness|engagement|conversion|loyalty",
      "importance": "critical|high|medium",
      "trend": "up|down|stable",
      "description": "Strategic importance and measurement approach"
    }
  ],
  "successCriteria": {
    "minimum": ["Criteria 1", "Criteria 2", "Criteria 3"],
    "target": ["Criteria 1", "Criteria 2", "Criteria 3"],
    "breakthrough": ["Criteria 1", "Criteria 2", "Criteria 3"]
  },
  "measurementPlan": {
    "prelaunch": "Benchmark collection approach",
    "realtime": "Live tracking methodology",
    "optimization": "Weekly optimization triggers",
    "postCampaign": "Analysis and learning plan"
  }
}

Create 4 comprehensive KPIs covering awareness, engagement, conversion, and loyalty. Use realistic industry benchmarks and ambitious but achievable targets.`;

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
      { temperature: 0.7, max_tokens: 2500 }
    );

    const content = response.choices[0]?.message?.content || '{}';
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Validate KPIs if they exist
      const validatedKPIs = parsedContent.kpis?.map((kpi: any) => {
        try {
          return kpiSchema.parse(kpi);
        } catch (e) {
          // Return a default structure if parsing fails
          return {
            name: kpi.name || 'Key Metric',
            definition: kpi.definition || 'Important campaign metric',
            current: kpi.current || 0,
            target: kpi.target || 50,
            benchmark: kpi.benchmark || 25,
            unit: kpi.unit || '%',
            category: kpi.category || 'engagement',
            importance: kpi.importance || 'high',
            trend: kpi.trend || 'stable',
            description: kpi.description || 'Measures campaign effectiveness'
          };
        }
      }) || [];
      
      return NextResponse.json({
        success: true,
        kpis: {
          northStarMetric: parsedContent.northStarMetric || {
            name: 'Campaign Participation Rate',
            value: 0,
            target: 100,
            description: 'Percentage of target audience actively engaging with campaign'
          },
          kpis: validatedKPIs,
          successCriteria: parsedContent.successCriteria || {
            minimum: ['Meet 80% of KPI targets', 'Exceed industry benchmarks', 'Positive sentiment > 70%'],
            target: ['Achieve 100% of KPI targets', '25% above benchmarks', 'Viral coefficient > 1.5'],
            breakthrough: ['Exceed targets by 20%+', 'Category-leading metrics', 'Cultural moment creation']
          },
          measurementPlan: parsedContent.measurementPlan || {
            prelaunch: 'Collect baseline metrics through surveys and social listening',
            realtime: 'Dashboard tracking engagement, reach, and sentiment hourly',
            optimization: 'Weekly reviews with trigger-based adjustments',
            postCampaign: 'Comprehensive analysis with learnings documentation'
          },
          fullFramework: content
        }
      });
    } catch (parseError) {
      // Fallback to text extraction if JSON parsing fails
      return NextResponse.json({
        success: true,
        kpis: {
          northStarMetric: extractNorthStar(content),
          kpis: [],
          successCriteria: {
            minimum: ['Meet core objectives', 'Positive ROI', 'Brand lift'],
            target: ['Exceed all KPIs', 'Strong viral growth', 'Category leadership'],
            breakthrough: ['Cultural phenomenon', 'Industry disruption', 'Lasting impact']
          },
          measurementPlan: extractMeasurementPlan(content),
          fullFramework: content
        }
      });
    }
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