import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const creativeRequestSchema = z.object({
  campaignName: z.string(),
  bigIdea: z.string(),
  tagline: z.string(),
  brandValues: z.array(z.string()),
  conventionViolations: z.any().optional(),
  platforms: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = creativeRequestSchema.parse(body);
    
    const systemPrompt = `You are a creative director developing breakthrough creative concepts and messaging for a campaign.

Create comprehensive creative blueprint including:

1. HERO CREATIVE CONCEPT:
   - Visual concept description (what people SEE)
   - Core narrative (what story we TELL)
   - Experiential element (what people DO)
   - Production notes

2. KEY MESSAGES (3-5):
   - Primary message
   - Supporting messages
   - Proof points
   - Call-to-action variations

3. VISUAL IDENTITY:
   - Color palette & rationale
   - Typography direction
   - Photography/illustration style
   - Motion design principles
   - Iconic visual elements

4. CONTENT FORMATS:
   - Hero film (60-90 sec concept)
   - Social-first content (15-30 sec)
   - Static visuals (key frames)
   - Interactive experiences
   - User templates for co-creation

5. COPY PLATFORM:
   - Tone of voice (with examples)
   - Key phrases and language
   - Hashtags (primary + secondary)
   - Headlines for different contexts

6. ACTIVATION IDEAS:
   - Launch stunt concept
   - Participation mechanics
   - Real-world activations
   - Digital experiences
   - Partnership opportunities

Be wildly creative but executable. Paint a picture people can see, feel, and want to be part of.`;

    const userPrompt = `Campaign: ${validatedRequest.campaignName}
Big Idea: ${validatedRequest.bigIdea}
Tagline: ${validatedRequest.tagline}
Brand Values: ${validatedRequest.brandValues.join(', ')}
${validatedRequest.conventionViolations ? `Convention Violations: ${JSON.stringify(validatedRequest.conventionViolations)}` : ''}
${validatedRequest.platforms ? `Key Platforms: ${validatedRequest.platforms.join(', ')}` : ''}

Create breakthrough creative that will dominate culture and make people desperate to participate.`;

    const response = await callGroq(
      GROQ_MODELS.GEMMA2.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.9, max_tokens: 3000 }
    );

    const content = response.choices[0]?.message?.content || '';
    
    return NextResponse.json({
      success: true,
      creative: {
        fullConcept: content,
        heroConcept: extractHeroConcept(content),
        keyMessages: extractKeyMessages(content),
        visualIdentity: extractVisualIdentity(content),
        contentFormats: extractContentFormats(content),
        copyPlatform: extractCopyPlatform(content),
        activationIdeas: extractActivationIdeas(content),
      }
    });
  } catch (error) {
    console.error('Creative generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate creative concepts'
      },
      { status: 500 }
    );
  }
}

function extractHeroConcept(content: string): any {
  const section = content.match(/HERO CREATIVE.*?(?=KEY MESSAGES|$)/is)?.[0] || '';
  return {
    visual: section.match(/Visual.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    narrative: section.match(/Narrative.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    experiential: section.match(/Experiential.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    production: section.match(/Production.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractKeyMessages(content: string): string[] {
  const section = content.match(/KEY MESSAGES.*?(?=VISUAL IDENTITY|$)/is)?.[0] || '';
  const messages: string[] = [];
  
  // Extract numbered messages
  const messageMatches = section.matchAll(/\d+\.\s*(.+?)(?=\d+\.|VISUAL|$)/gis);
  for (const match of messageMatches) {
    messages.push(match[1].split('\n')[0]?.trim() || '');
  }
  
  return messages.slice(0, 5);
}

function extractVisualIdentity(content: string): any {
  const section = content.match(/VISUAL IDENTITY.*?(?=CONTENT FORMATS|$)/is)?.[0] || '';
  return {
    colorPalette: section.match(/Color.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    typography: section.match(/Typography.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    style: section.match(/Style.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    motion: section.match(/Motion.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    iconicElements: section.match(/Iconic.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractContentFormats(content: string): any {
  const section = content.match(/CONTENT FORMATS.*?(?=COPY PLATFORM|$)/is)?.[0] || '';
  return {
    heroFilm: section.match(/Hero Film.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    socialContent: section.match(/Social.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    staticVisuals: section.match(/Static.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    interactive: section.match(/Interactive.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    templates: section.match(/Templates?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractCopyPlatform(content: string): any {
  const section = content.match(/COPY PLATFORM.*?(?=ACTIVATION|$)/is)?.[0] || '';
  return {
    toneOfVoice: section.match(/Tone.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    keyPhrases: section.match(/Phrases?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    hashtags: section.match(/Hashtags?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    headlines: section.match(/Headlines?.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}

function extractActivationIdeas(content: string): any[] {
  const section = content.match(/ACTIVATION IDEAS.*?$/is)?.[0] || '';
  const ideas: any[] = [];
  
  // Extract different types of activations
  const types = ['Launch', 'Participation', 'Real-world', 'Digital', 'Partnership'];
  
  for (const type of types) {
    const activation = section.match(new RegExp(`${type}.*?:?\\s*(.+?)(?=${types.join('|')}|$)`, 'is'))?.[1]?.trim();
    if (activation) {
      ideas.push({
        type,
        concept: activation
      });
    }
  }
  
  return ideas;
}