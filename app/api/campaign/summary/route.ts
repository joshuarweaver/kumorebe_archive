import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { z } from 'zod';

const summaryRequestSchema = z.object({
  brandName: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  objectives: z.array(z.string()),
  brandValues: z.array(z.string()),
  brandArchetype: z.string(),
  culturalInsights: z.any().optional(),
  conventionViolations: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = summaryRequestSchema.parse(body);
    
    const systemPrompt = `You are a Chief Strategy Officer creating an executive summary for a breakthrough marketing campaign. 

Generate a compelling executive summary that includes:
1. Campaign Name: A powerful, memorable name that captures the essence
2. Big Idea: The core creative concept in one compelling sentence
3. Strategic Rationale: Why this campaign will breakthrough (2-3 sentences)
4. Expected Impact: The cultural and business impact (2-3 sentences)
5. Campaign Tagline: A memorable line that encapsulates everything

Focus on ACTUAL CAMPAIGN IDEAS, not analysis. Be bold, creative, and specific.`;

    const userPrompt = `Brand: ${validatedRequest.brandName}
Industry: ${validatedRequest.industry}
Target Audience: ${validatedRequest.targetAudience}
Objectives: ${validatedRequest.objectives.join(', ')}
Brand Values: ${validatedRequest.brandValues.join(', ')}
Brand Archetype: ${validatedRequest.brandArchetype}
${validatedRequest.culturalInsights ? `Cultural Insights: ${JSON.stringify(validatedRequest.culturalInsights)}` : ''}
${validatedRequest.conventionViolations ? `Convention Violations: ${JSON.stringify(validatedRequest.conventionViolations)}` : ''}

Create an executive summary for a breakthrough campaign that will dominate culture and drive results.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.8, max_tokens: 1000 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    // Parse the response into structured data
    const campaignName = content.match(/Campaign Name:?\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || 'Breakthrough Campaign';
    const bigIdea = content.match(/Big Idea:?\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || '';
    const tagline = content.match(/Tagline:?\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || '';
    
    return NextResponse.json({
      success: true,
      summary: {
        campaignName,
        bigIdea,
        tagline,
        fullSummary: content,
        strategicRationale: extractSection(content, 'Strategic Rationale'),
        expectedImpact: extractSection(content, 'Expected Impact'),
      }
    });
  } catch (error) {
    console.error('Campaign summary error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate campaign summary'
      },
      { status: 500 }
    );
  }
}

function extractSection(content: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\\s*(.+?)(?=\\n\\n|\\n[A-Z]|$)`, 'is');
  return content.match(regex)?.[1]?.trim() || '';
}