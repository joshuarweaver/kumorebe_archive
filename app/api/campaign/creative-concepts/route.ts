import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const creativeConceptsRequestSchema = z.object({
  campaignName: z.string(),
  bigIdea: z.string(),
  tagline: z.string(),
  brandValues: z.array(z.string()),
  targetAudience: z.string(),
  mediaFormats: z.array(z.string()).optional(),
  conventionViolations: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = creativeConceptsRequestSchema.parse(body);
    
    const systemPrompt = `You are a world-class creative director generating THREE distinct creative concepts for a campaign. Each concept must be radically different in approach while supporting the same big idea.

Format your response EXACTLY like this:

CONCEPT 1: [Provocative Concept Name]
KEY MESSAGE: One powerful sentence that captures the essence of this concept
HERO TREATMENT: Detailed description of the main creative execution - be cinematic and specific about what we see, hear, and feel
VISUAL DIRECTION: Specific visual style, color palette, photography/illustration style, motion principles, and overall aesthetic
FORMATS:
- Video: How this works as video content
- Social: How this adapts for social platforms
- Digital: Interactive digital experiences
- OOH: Out-of-home and physical applications
PARTICIPATION HOOK: Specific way audiences can engage, create, or participate

CONCEPT 2: [Different Provocative Name]
KEY MESSAGE: [Different message angle]
HERO TREATMENT: [Completely different creative approach]
VISUAL DIRECTION: [Distinct visual language]
FORMATS:
- Video: [Different video approach]
- Social: [Different social strategy]
- Digital: [Different digital experience]
- OOH: [Different physical presence]
PARTICIPATION HOOK: [Different participation mechanic]

CONCEPT 3: [Another Provocative Name]
KEY MESSAGE: [Third unique angle]
HERO TREATMENT: [Third distinct approach]
VISUAL DIRECTION: [Third visual style]
FORMATS:
- Video: [Third video concept]
- Social: [Third social approach]
- Digital: [Third digital idea]
- OOH: [Third physical concept]
PARTICIPATION HOOK: [Third way to participate]

Each concept should:
- Take a different creative angle (emotional vs rational vs cultural)
- Use completely different visual languages
- Appeal to different aspects of the target audience
- Be equally bold and breakthrough
- Include specific, executable details`;

    const userPrompt = `Campaign: ${validatedRequest.campaignName}
Big Idea: ${validatedRequest.bigIdea}
Tagline: ${validatedRequest.tagline}
Target Audience: ${validatedRequest.targetAudience}
Brand Values: ${validatedRequest.brandValues.join(', ')}
${validatedRequest.conventionViolations ? `Convention Violations: ${JSON.stringify(validatedRequest.conventionViolations)}` : ''}

Generate 3 radically different creative concepts that will dominate culture.`;

    let content = '';
    try {
      const response = await callGroq(
        GROQ_MODELS.LLAMA_70B.id,
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        { temperature: 0.9, max_tokens: 4000 }
      );
      
      content = response.choices[0]?.message?.content || '';
      
      if (!content || content.length < 100) {
        throw new Error('Groq returned empty or insufficient content');
      }
    } catch (groqError) {
      console.error('Groq API error:', groqError);
      // Fallback to generated concepts if Groq fails
      content = generateFallbackConcepts(validatedRequest);
    }
    
    const concepts = parseCreativeConcepts(content);
    
    // Add Midjourney prompts to each concept
    const conceptsWithPrompts = concepts.map(concept => {
      // Create a professional Midjourney prompt
      const midjourneyPrompt = createMidjourneyPrompt(concept, validatedRequest);
      
      return {
        ...concept,
        staticImage: null,
        animatedImage: null,
        midjourneyPrompt
      };
    });
    
    return NextResponse.json({
      success: true,
      concepts: conceptsWithPrompts
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Creative concepts generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate creative concepts'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

function parseCreativeConcepts(content: string): any[] {
  const concepts: any[] = [];
  
  // Split by concept headers - try multiple patterns
  const conceptPatterns = [
    /CONCEPT\s*\d+:\s*\[(.+?)\]/gi,
    /CONCEPT\s*\d+:\s*(.+?)(?=\n)/gi,
    /CONCEPT\s*\d+:\s*(.+?)(?=KEY MESSAGE|$)/gi
  ];
  
  let conceptMatches: RegExpMatchArray[] = [];
  for (const pattern of conceptPatterns) {
    const matches = Array.from(content.matchAll(pattern));
    if (matches.length > 0) {
      conceptMatches = matches;
      break;
    }
  }
  
  // Also try splitting by concept numbers
  const conceptSections = content.split(/CONCEPT\s*\d+:/i).slice(1);
  
  // Parse each concept section
  for (let i = 0; i < Math.max(conceptMatches.length, conceptSections.length); i++) {
    const name = conceptMatches[i]?.[1]?.trim() || `Concept ${i + 1}`;
    const section = conceptSections[i] || '';
    
    const concept = {
      name: name.replace(/[\[\]]/g, '').trim(),
      keyMessage: extractField(section, 'KEY MESSAGE'),
      heroTreatment: extractField(section, 'HERO TREATMENT'),
      visualDirection: extractField(section, 'VISUAL DIRECTION'),
      formats: extractFormats(section),
      participationHook: extractField(section, 'PARTICIPATION HOOK'),
    };
    
    // Only add if we have meaningful content
    if (concept.keyMessage || concept.heroTreatment || concept.visualDirection) {
      concepts.push(concept);
    }
  }
  
  // Ensure we always return 3 concepts
  while (concepts.length < 3) {
    concepts.push({
      name: `Concept ${concepts.length + 1}`,
      keyMessage: 'Bold message that challenges conventions',
      heroTreatment: 'Breakthrough creative execution',
      visualDirection: 'Distinctive visual approach',
      formats: [],
      participationHook: 'Engaging participation mechanic',
    });
  }
  
  return concepts.slice(0, 3);
}

function extractField(section: string, fieldName: string): string {
  // Try multiple regex patterns for better extraction
  const patterns = [
    new RegExp(`${fieldName}:?\\s*(.+?)(?=\\n[A-Z]|\\nFORMATS:|\\nPARTICIPATION|$)`, 'is'),
    new RegExp(`${fieldName}:?\\s*(.+?)(?=\\n\\n|$)`, 'is'),
    new RegExp(`${fieldName}:?\\s*(.+?)$`, 'im')
  ];
  
  for (const regex of patterns) {
    const match = section.match(regex);
    if (match?.[1]?.trim()) {
      return match[1].trim();
    }
  }
  
  return '';
}

function extractFormats(section: string): any[] {
  const formatsSection = section.match(/FORMATS:(.+?)(?=PARTICIPATION|$)/is)?.[1] || '';
  const formats: any[] = [];
  
  // Common format types
  const formatTypes = ['video', 'social', 'digital', 'OOH', 'experiential', 'mobile'];
  
  for (const format of formatTypes) {
    const formatMatch = formatsSection.match(new RegExp(`${format}[^:]*:?\\s*([^,;]+)`, 'i'));
    if (formatMatch) {
      formats.push({
        type: format,
        description: formatMatch[1].trim()
      });
    }
  }
  
  return formats;
}

function generateFallbackConcepts(request: any): string {
  return `CONCEPT 1: [Cultural Rebellion]
KEY MESSAGE: We don't follow culture, we create it - join the revolution of ${request.campaignName}
HERO TREATMENT: A cinematic rebellion unfolds as everyday people break free from societal constraints. We see a montage of individuals in various cities simultaneously doing the unexpected - dancing in business meetings, painting murals on corporate walls, transforming sterile spaces into vibrant expressions of humanity. The camera captures raw emotion as people discover their power to reshape reality.
VISUAL DIRECTION: High-contrast black and white cinematography punctuated by explosive bursts of neon color when people break free. Handheld camera work creates intimacy. Typography is bold, revolutionary poster-style. Motion is kinetic and unpredictable.
FORMATS:
- Video: 60-second anthem film plus 15-second social cuts
- Social: User-generated rebellion moments with branded AR filters
- Digital: Interactive website where users can "break" conventional web design
- OOH: Billboards that appear to be vandalized with positive messages
PARTICIPATION HOOK: #MyRebellion challenge - users share moments of positive rule-breaking

CONCEPT 2: [Invisible Threads]
KEY MESSAGE: Every action creates ripples - see how your choices connect to transform the world
HERO TREATMENT: We follow a single act of kindness as it ripples through a city, visualized as luminous threads connecting people. A coffee bought for a stranger leads to a smile, which inspires an artist, whose work moves a CEO to change company policy, affecting thousands. The threads multiply exponentially, creating a stunning web of human connection.
VISUAL DIRECTION: Ethereal, dreamlike aesthetic with practical effects showing glowing threads. Soft focus with sharp moments of clarity. Warm color palette transitioning from dawn to dusk. Floating camera movements suggesting omniscience.
FORMATS:
- Video: 90-second film tracking one thread's journey
- Social: AR lens showing users' connection threads in real-time
- Digital: Interactive data visualization of real impact stories
- OOH: Connected billboards that react to each other across cities
PARTICIPATION HOOK: Thread tracker app measuring users' positive impact chains

CONCEPT 3: [Future Artifacts]
KEY MESSAGE: Messages from tomorrow - what will you tell future generations about today?
HERO TREATMENT: Museum visitors in 2074 discover artifacts from 2024 - but they're not what we expect. A protest sign becomes a symbol of change achieved. A smartphone holds the last message that sparked a movement. Young people see their grandparents as revolutionaries. The twist: viewers realize they're creating these future artifacts now.
VISUAL DIRECTION: Split-screen showing present and future simultaneously. Museum scenes are pristine and minimalist while present-day scenes are gritty and real. Typography morphs between contemporary and futuristic. Color desaturates in future scenes except for the artifacts which glow with significance.
FORMATS:
- Video: 2-minute short film with multiple timeline perspectives  
- Social: Time capsule posts that unlock in the future
- Digital: Virtual museum where users can submit their artifacts
- OOH: Billboards showing "future historical markers" for present locations
PARTICIPATION HOOK: Create and submit your future artifact with impact prediction`;
}

function createMidjourneyPrompt(concept: any, request: any): string {
  // Build a professional Midjourney prompt with proper parameters
  const elements = [];
  
  // Main concept and visual direction
  elements.push(`${concept.visualDirection}, ${concept.heroTreatment}`);
  
  // Add campaign context
  elements.push(`advertising campaign for ${request.campaignName}`);
  
  // Add style modifiers for professional results
  const styleModifiers = [
    'professional advertising photography',
    'commercial campaign',
    'high end production',
    'award winning',
    'shot on medium format',
    'perfect lighting'
  ];
  
  // Add appropriate style based on visual direction
  const direction = concept.visualDirection.toLowerCase();
  if (direction.includes('minimal')) {
    styleModifiers.push('minimalist', 'clean aesthetic', 'negative space');
  } else if (direction.includes('bold') || direction.includes('vibrant')) {
    styleModifiers.push('bold colors', 'high contrast', 'dynamic composition');
  } else if (direction.includes('ethereal')) {
    styleModifiers.push('ethereal lighting', 'soft focus', 'dreamlike');
  } else if (direction.includes('cinematic')) {
    styleModifiers.push('cinematic lighting', 'movie poster', 'dramatic');
  }
  
  elements.push(...styleModifiers);
  
  // Add technical parameters
  elements.push('--ar 16:9'); // Aspect ratio for campaign visuals
  elements.push('--q 2'); // High quality
  elements.push('--s 750'); // Stylization
  
  return elements.join(', ');
}