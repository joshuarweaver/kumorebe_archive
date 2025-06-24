import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { z } from 'zod';

const audienceRequestSchema = z.object({
  brandName: z.string(),
  targetAudience: z.string(),
  campaignName: z.string(),
  bigIdea: z.string(),
  culturalInsights: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = audienceRequestSchema.parse(body);
    
    const systemPrompt = `You are an audience strategist developing detailed personas and audience segments for a breakthrough campaign.

Create comprehensive audience development that includes:

1. PRIMARY PERSONA (most important):
   - Name & Age
   - Occupation/Life Stage
   - Psychographic Profile (values, attitudes, beliefs)
   - Media Consumption Habits
   - Pain Points & Desires
   - Cultural Touchpoints
   - Quote that captures their worldview

2. SECONDARY PERSONAS (2-3 additional):
   - Similar detail but more concise

3. AUDIENCE JOURNEY:
   - Awareness: How they first encounter the campaign
   - Consideration: What makes them engage
   - Participation: How they become co-creators
   - Advocacy: How they spread the message

4. BEHAVIORAL INSIGHTS:
   - Specific behaviors to target
   - Moments of receptivity
   - Emotional triggers

Be specific, human, and insightful. Use real cultural references and behaviors.`;

    const userPrompt = `Campaign: ${validatedRequest.campaignName}
Big Idea: ${validatedRequest.bigIdea}
Target Audience: ${validatedRequest.targetAudience}
${validatedRequest.culturalInsights ? `Cultural Context: ${JSON.stringify(validatedRequest.culturalInsights)}` : ''}

Develop detailed audience personas and journey mapping that will make this campaign irresistible to our target.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.85, max_tokens: 2000 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    return NextResponse.json({
      success: true,
      audience: {
        fullStrategy: content,
        primaryPersona: extractPersona(content, 'PRIMARY PERSONA'),
        secondaryPersonas: extractSecondaryPersonas(content),
        audienceJourney: extractJourney(content),
        behavioralInsights: extractInsights(content),
      }
    });
  } catch (error) {
    console.error('Audience development error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to develop audience strategy'
      },
      { status: 500 }
    );
  }
}

function extractPersona(content: string, personaType: string): any {
  const section = content.match(new RegExp(`${personaType}.*?(?=SECONDARY|AUDIENCE|$)`, 'is'))?.[0] || '';
  return {
    name: section.match(/Name.*?:?\s*(.+?)(?:\n|,)/i)?.[1]?.trim() || '',
    age: section.match(/Age.*?:?\s*(.+?)(?:\n|,)/i)?.[1]?.trim() || '',
    occupation: section.match(/Occupation.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    psychographics: section.match(/Psychographic.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    mediaHabits: section.match(/Media.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    painPoints: section.match(/Pain Points.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    quote: section.match(/Quote.*?:?\s*["'](.+?)["'](?:\n|$)/i)?.[1]?.trim() || '',
  };
}

function extractSecondaryPersonas(content: string): any[] {
  const section = content.match(/SECONDARY PERSONAS.*?(?=AUDIENCE|BEHAVIORAL|$)/is)?.[0] || '';
  // Simple extraction - in production would be more sophisticated
  return [];
}

function extractJourney(content: string): any {
  const section = content.match(/AUDIENCE JOURNEY.*?(?=BEHAVIORAL|$)/is)?.[0] || '';
  return {
    awareness: section.match(/Awareness.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    consideration: section.match(/Consideration.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    participation: section.match(/Participation.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    advocacy: section.match(/Advocacy.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractInsights(content: string): string[] {
  const section = content.match(/BEHAVIORAL INSIGHTS.*?$/is)?.[0] || '';
  return section.split('\n')
    .filter(line => line.match(/^[-•*]/))
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}