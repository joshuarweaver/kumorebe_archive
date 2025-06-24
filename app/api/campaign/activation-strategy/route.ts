import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const activationRequestSchema = z.object({
  campaignName: z.string(),
  bigIdea: z.string(),
  targetAudience: z.string(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  objectives: z.array(z.string()),
  mediaStrategy: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = activationRequestSchema.parse(body);
    
    const systemPrompt = `You are a campaign activation strategist creating a comprehensive go-to-market plan that builds cultural momentum.

Create a detailed activation strategy including:

1. ACTIVATION PHASES (4 phases):
   For each phase provide:
   - Phase Name (creative, action-oriented)
   - Duration (specific timeframe)
   - Description (what happens and why)
   - Key Tactics (4-5 specific actions)
   - Success Metrics (3 measurable KPIs with targets)

2. INFLUENCER TIERS:
   - Mega Influencers (5-10): Names, reach, role, investment %
   - Macro Influencers (20-30): Categories, reach, role, investment %
   - Micro Influencers (100-200): Types, reach, role, investment %
   - Nano Army (1000+): Activation approach, reach, role, investment %

3. REAL-WORLD ACTIVATIONS:
   - Pop-up experiences (locations, concepts)
   - Street teams (tactics, cities)
   - Event partnerships (specific events/festivals)
   - Retail activations (in-store experiences)

4. DIGITAL EXPERIENCES:
   - AR/VR concepts (specific features)
   - Gamification mechanics (rewards, challenges)
   - AI personalization (how it works)
   - Interactive web experiences

5. PARTICIPATION MECHANICS:
   - User-generated content campaigns
   - Co-creation opportunities
   - Community challenges
   - Reward systems

6. MOMENTUM METRICS:
   - Week-by-week projections for:
     * Awareness growth
     * Engagement rates
     * Participation numbers
   - Inflection points and amplification moments

Be specific with numbers, timelines, and tactics. This should feel like a military campaign plan for cultural domination.`;

    const userPrompt = `Campaign: ${validatedRequest.campaignName}
Big Idea: ${validatedRequest.bigIdea}
Target Audience: ${validatedRequest.targetAudience}
Objectives: ${validatedRequest.objectives.join(', ')}
${validatedRequest.budget ? `Budget: ${validatedRequest.budget}` : ''}
${validatedRequest.timeline ? `Timeline: ${validatedRequest.timeline}` : ''}

Create an activation strategy that will embed this campaign into culture and create unstoppable momentum.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.8, max_tokens: 4000 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    return NextResponse.json({
      success: true,
      activationStrategy: {
        fullStrategy: content,
        phases: extractPhases(content),
        influencerTiers: extractInfluencerTiers(content),
        realWorldActivations: extractRealWorldActivations(content),
        digitalExperiences: extractDigitalExperiences(content),
        participationMechanics: extractParticipationMechanics(content),
        momentumMetrics: extractMomentumMetrics(content),
      }
    });
  } catch (error) {
    console.error('Activation strategy error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate activation strategy'
      },
      { status: 500 }
    );
  }
}

function extractPhases(content: string): any[] {
  const phases: any[] = [];
  const phaseSection = content.match(/ACTIVATION PHASES.*?(?=INFLUENCER|$)/is)?.[0] || '';
  
  // Match phase patterns
  const phaseMatches = phaseSection.matchAll(/Phase\s*\d+:?\s*([^:\n]+)(?::|[\n])([\s\S]*?)(?=Phase\s*\d+:|INFLUENCER|$)/gi);
  
  for (const match of phaseMatches) {
    const phaseName = match[1].trim();
    const phaseContent = match[2];
    
    phases.push({
      name: phaseName,
      duration: phaseContent.match(/Duration:?\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || '2-4 weeks',
      description: phaseContent.match(/Description:?\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || 
                   phaseContent.split('\n')[0]?.trim() || '',
      tactics: extractListItems(phaseContent, 'Tactics', 4),
      kpis: extractListItems(phaseContent, 'Metrics|KPIs|Success', 3)
    });
  }
  
  // Ensure we have 4 phases
  while (phases.length < 4) {
    phases.push({
      name: `Phase ${phases.length + 1}: ${['Seeding', 'Launch', 'Amplification', 'Sustain'][phases.length]}`,
      duration: ['2 weeks', '4 weeks', '8 weeks', 'Ongoing'][phases.length],
      description: 'Strategic activation phase',
      tactics: ['Tactic 1', 'Tactic 2', 'Tactic 3', 'Tactic 4'],
      kpis: ['KPI 1', 'KPI 2', 'KPI 3']
    });
  }
  
  return phases.slice(0, 4);
}

function extractInfluencerTiers(content: string): any[] {
  const section = content.match(/INFLUENCER.*?TIERS.*?(?=REAL-WORLD|DIGITAL|$)/is)?.[0] || '';
  const tiers: any[] = [];
  
  const tierTypes = [
    { name: 'Mega Influencers', pattern: /Mega.*?Influencers?/i },
    { name: 'Macro Influencers', pattern: /Macro.*?Influencers?/i },
    { name: 'Micro Influencers', pattern: /Micro.*?Influencers?/i },
    { name: 'Nano Army', pattern: /Nano.*?Army|Nano.*?Influencers?/i }
  ];
  
  for (const tierType of tierTypes) {
    const tierMatch = section.match(new RegExp(`${tierType.pattern.source}.*?(?=${tierTypes.map(t => t.pattern.source).join('|')}|REAL-WORLD|$)`, 'is'));
    if (tierMatch) {
      const tierContent = tierMatch[0];
      tiers.push({
        tier: tierType.name,
        count: tierContent.match(/(\d+-?\d*)\s*(?:influencers?|creators?|people)/i)?.[1] || '10-20',
        reach: tierContent.match(/reach:?\s*([^,\n]+)/i)?.[1]?.trim() || '1M+',
        role: tierContent.match(/role:?\s*([^,\n]+)/i)?.[1]?.trim() || 'Brand advocacy',
        investment: tierContent.match(/(\d+)%/)?.[1] + '%' || '25%'
      });
    }
  }
  
  // Fill in any missing tiers
  const defaultTiers = [
    { tier: 'Mega Influencers', count: '5-10', reach: '10M+', role: 'Campaign ambassadors', investment: '40%' },
    { tier: 'Macro Influencers', count: '20-30', reach: '500K-1M', role: 'Category authority', investment: '30%' },
    { tier: 'Micro Influencers', count: '100-200', reach: '10K-100K', role: 'Authentic advocacy', investment: '20%' },
    { tier: 'Nano Army', count: '1000+', reach: '1K-10K', role: 'Grassroots spread', investment: '10%' }
  ];
  
  for (const defaultTier of defaultTiers) {
    if (!tiers.find(t => t.tier === defaultTier.tier)) {
      tiers.push(defaultTier);
    }
  }
  
  return tiers.slice(0, 4);
}

function extractRealWorldActivations(content: string): any[] {
  const section = content.match(/REAL-WORLD.*?ACTIVATIONS.*?(?=DIGITAL|PARTICIPATION|$)/is)?.[0] || '';
  const activations: any[] = [];
  
  const types = ['Pop-up', 'Street', 'Event', 'Retail'];
  
  for (const type of types) {
    const activation = section.match(new RegExp(`${type}.*?:?\\s*(.+?)(?=${types.join('|')}|DIGITAL|$)`, 'is'))?.[1]?.trim();
    if (activation) {
      activations.push({
        type: type + ' Activation',
        concept: activation.split('\n')[0]?.trim() || activation
      });
    }
  }
  
  return activations;
}

function extractDigitalExperiences(content: string): any[] {
  const section = content.match(/DIGITAL.*?EXPERIENCES.*?(?=PARTICIPATION|MOMENTUM|$)/is)?.[0] || '';
  const experiences: any[] = [];
  
  const types = ['AR/VR', 'Gamif', 'AI', 'Interactive'];
  
  for (const type of types) {
    const experience = section.match(new RegExp(`${type}.*?:?\\s*(.+?)(?=${types.join('|')}|PARTICIPATION|$)`, 'is'))?.[1]?.trim();
    if (experience) {
      experiences.push({
        type: type.includes('Gamif') ? 'Gamification' : type,
        description: experience.split('\n')[0]?.trim() || experience
      });
    }
  }
  
  return experiences;
}

function extractParticipationMechanics(content: string): any[] {
  const section = content.match(/PARTICIPATION.*?MECHANICS.*?(?=MOMENTUM|$)/is)?.[0] || '';
  const mechanics: any[] = [];
  
  // Extract bullet points or numbered items
  const items = section.match(/[-•*]\s*(.+?)(?=\n|$)/g) || [];
  
  for (const item of items.slice(0, 4)) {
    mechanics.push({
      mechanic: item.replace(/[-•*]\s*/, '').trim()
    });
  }
  
  // Default mechanics if none found
  if (mechanics.length === 0) {
    mechanics.push(
      { mechanic: 'User-generated content challenges' },
      { mechanic: 'Co-creation workshops' },
      { mechanic: 'Community voting mechanisms' },
      { mechanic: 'Reward point system' }
    );
  }
  
  return mechanics;
}

function extractMomentumMetrics(content: string): any {
  const section = content.match(/MOMENTUM.*?METRICS.*?$/is)?.[0] || '';
  
  // Try to extract week-by-week data
  const weeklyData: any[] = [];
  const weekMatches = section.matchAll(/Week\s*(\d+):?\s*(.+?)(?=Week\s*\d+:|$)/gi);
  
  for (const match of weekMatches) {
    const weekNum = parseInt(match[1]);
    const weekContent = match[2];
    
    weeklyData.push({
      week: `W${weekNum}`,
      awareness: parseInt(weekContent.match(/awareness:?\s*(\d+)%?/i)?.[1] || '0'),
      engagement: parseInt(weekContent.match(/engagement:?\s*(\d+)%?/i)?.[1] || '0'),
      participation: parseInt(weekContent.match(/participation:?\s*(\d+)%?/i)?.[1] || '0')
    });
  }
  
  // If no weekly data found, create default momentum curve
  if (weeklyData.length === 0) {
    weeklyData.push(
      { week: 'W1', awareness: 5, engagement: 8, participation: 3 },
      { week: 'W2', awareness: 15, engagement: 20, participation: 10 },
      { week: 'W4', awareness: 60, engagement: 70, participation: 45 },
      { week: 'W8', awareness: 92, engagement: 85, participation: 88 }
    );
  }
  
  return {
    weeklyProjections: weeklyData,
    inflectionPoints: section.match(/inflection.*?:?\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || 'Week 3-4: Viral momentum achieved'
  };
}

function extractListItems(content: string, keyword: string, maxItems: number = 5): string[] {
  const items: string[] = [];
  const section = content.match(new RegExp(`${keyword}.*?:([\\s\\S]*?)(?=\\n\\n|$)`, 'i'))?.[1] || '';
  
  // Try to extract bullet points or numbered items
  const bulletItems = section.match(/[-•*]\s*(.+?)(?=\n|$)/g) || [];
  const numberedItems = section.match(/\d+\.\s*(.+?)(?=\n|$)/g) || [];
  
  const allItems = [...bulletItems, ...numberedItems].map(item => 
    item.replace(/^[-•*\d.]\s*/, '').trim()
  );
  
  return allItems.slice(0, maxItems);
}