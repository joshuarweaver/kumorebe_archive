import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const summaryRequestSchema = z.object({
  brandName: z.string(),
  campaignBrief: z.string().optional(),
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

You MUST respond with ONLY valid JSON in this exact format:
{
  "campaignName": "A powerful, memorable name that captures the essence",
  "tagline": "A memorable tagline that encapsulates everything",
  "bigIdea": "The core creative concept in one compelling sentence",
  "strategicRationale": "Why this campaign will breakthrough (2-3 sentences)",
  "expectedImpact": "The cultural and business impact (2-3 sentences)"
}

Focus on ACTUAL CAMPAIGN IDEAS, not analysis. Be bold, creative, and specific.
Do NOT include any text outside the JSON structure.`;

    const userPrompt = `${validatedRequest.campaignBrief ? `Campaign Brief: ${validatedRequest.campaignBrief}\n\n` : ''}
Industry Context: ${validatedRequest.industry}
Target Audience: ${validatedRequest.targetAudience}
Objectives: ${validatedRequest.objectives.join(', ')}
Brand Values: ${validatedRequest.brandValues.join(', ')}
Brand Archetype: ${validatedRequest.brandArchetype}
${validatedRequest.culturalInsights ? `Cultural Insights: ${JSON.stringify(validatedRequest.culturalInsights)}` : ''}
${validatedRequest.conventionViolations ? `Convention Violations: ${JSON.stringify(validatedRequest.conventionViolations)}` : ''}

Based on the campaign brief above, create an executive summary for a breakthrough campaign that will dominate culture and drive results.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.8, max_tokens: 1000 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    try {
      // Parse JSON response
      const parsedContent = JSON.parse(content);
      
      return NextResponse.json({
        success: true,
        summary: {
          campaignName: parsedContent.campaignName || 'Breakthrough Campaign',
          bigIdea: parsedContent.bigIdea || '',
          tagline: parsedContent.tagline || '',
          fullSummary: content,
          strategicRationale: parsedContent.strategicRationale || '',
          expectedImpact: parsedContent.expectedImpact || '',
        }
      });
    } catch (parseError) {
      // Fallback to regex parsing if JSON parsing fails
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
    }
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