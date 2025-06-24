import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const mediaRequestSchema = z.object({
  campaignName: z.string(),
  bigIdea: z.string(),
  targetAudience: z.string(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  platforms: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = mediaRequestSchema.parse(body);
    
    const systemPrompt = `You are a media strategist planning channel strategy and media allocation for a breakthrough campaign.

Create comprehensive media strategy including:

1. CHANNEL STRATEGY:
   - Hero Channels (primary focus, 40-50% budget)
   - Hub Channels (community building, 30-40% budget)  
   - Hygiene Channels (always-on, 10-20% budget)
   - Rationale for each selection

2. PLATFORM-SPECIFIC TACTICS:
   For each major platform:
   - Content format & frequency
   - Engagement tactics
   - Influencer/creator strategy
   - Paid amplification approach

3. MEDIA MIX & BUDGET ALLOCATION:
   - Paid (specific placements & formats)
   - Owned (brand channels & assets)
   - Earned (PR & influencer outreach)
   - Shared (UGC & community)
   - % allocation with rationale

4. CONTENT CALENDAR:
   - Launch sequence (Day 1-7)
   - Sustain phase (Week 2-4)
   - Amplification moments
   - Key tentpole events

5. INFLUENCER & CREATOR STRATEGY:
   - Tier 1: Mega influencers (names & rationale)
   - Tier 2: Macro influencers (categories)
   - Tier 3: Micro/nano army (activation plan)
   - Creator collaboration formats

6. REAL-TIME OPTIMIZATION:
   - Social listening triggers
   - Content pivots based on performance
   - Trend-jacking opportunities
   - Crisis management protocols

Be specific about platforms, formats, timing, and budget percentages.`;

    const userPrompt = `Campaign: ${validatedRequest.campaignName}
Big Idea: ${validatedRequest.bigIdea}
Target Audience: ${validatedRequest.targetAudience}
${validatedRequest.budget ? `Budget: ${validatedRequest.budget}` : ''}
${validatedRequest.timeline ? `Timeline: ${validatedRequest.timeline}` : ''}
${validatedRequest.platforms ? `Key Platforms: ${validatedRequest.platforms.join(', ')}` : ''}

Create a media strategy that will make this campaign impossible to ignore and maximize participation.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.75, max_tokens: 2500 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    return NextResponse.json({
      success: true,
      mediaStrategy: {
        fullStrategy: content,
        channelStrategy: extractChannelStrategy(content),
        platformTactics: extractPlatformTactics(content),
        mediaMix: extractMediaMix(content),
        contentCalendar: extractContentCalendar(content),
        influencerStrategy: extractInfluencerStrategy(content),
        optimization: extractOptimization(content),
      }
    });
  } catch (error) {
    console.error('Media strategy error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate media strategy'
      },
      { status: 500 }
    );
  }
}

function extractChannelStrategy(content: string): any {
  const section = content.match(/CHANNEL STRATEGY.*?(?=PLATFORM|$)/is)?.[0] || '';
  return {
    hero: section.match(/Hero.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    hub: section.match(/Hub.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    hygiene: section.match(/Hygiene.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractPlatformTactics(content: string): any[] {
  const section = content.match(/PLATFORM.*?TACTICS.*?(?=MEDIA MIX|$)/is)?.[0] || '';
  const platforms: any[] = [];
  
  // Extract major platforms mentioned
  const platformNames = ['TikTok', 'Instagram', 'Twitter', 'X', 'YouTube', 'LinkedIn', 'Reddit'];
  
  for (const platform of platformNames) {
    const platformSection = section.match(new RegExp(`${platform}.*?(?=${platformNames.join('|')}|$)`, 'is'))?.[0];
    if (platformSection) {
      platforms.push({
        platform,
        format: platformSection.match(/Format.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
        frequency: platformSection.match(/Frequency.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
        tactics: platformSection.match(/Tactics?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
      });
    }
  }
  
  return platforms;
}

function extractMediaMix(content: string): any {
  const section = content.match(/MEDIA MIX.*?(?=CONTENT CALENDAR|$)/is)?.[0] || '';
  return {
    paid: section.match(/Paid.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    owned: section.match(/Owned.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    earned: section.match(/Earned.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    shared: section.match(/Shared.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractContentCalendar(content: string): any {
  const section = content.match(/CONTENT CALENDAR.*?(?=INFLUENCER|$)/is)?.[0] || '';
  return {
    launch: section.match(/Launch.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    sustain: section.match(/Sustain.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    amplification: section.match(/Amplification.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractInfluencerStrategy(content: string): any {
  const section = content.match(/INFLUENCER.*?STRATEGY.*?(?=REAL-TIME|$)/is)?.[0] || '';
  return {
    tier1: section.match(/Tier 1.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    tier2: section.match(/Tier 2.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    tier3: section.match(/Tier 3.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractOptimization(content: string): any {
  const section = content.match(/REAL-TIME.*?$/is)?.[0] || '';
  return {
    triggers: section.match(/Triggers?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    pivots: section.match(/Pivots?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    opportunities: section.match(/Opportunit.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}