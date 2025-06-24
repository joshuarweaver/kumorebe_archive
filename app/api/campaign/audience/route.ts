import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { z } from 'zod';

const audienceRequestSchema = z.object({
  brandName: z.string(),
  targetAudience: z.string(),
  campaignName: z.string(),
  bigIdea: z.string(),
  culturalInsights: z.any().optional(),
});

const personaSchema = z.object({
  name: z.string(),
  age: z.string(),
  occupation: z.string(),
  location: z.string(),
  bio: z.string(),
  demographics: z.object({
    income: z.string(),
    education: z.string(),
    lifestyle: z.string(),
  }),
  psychographics: z.object({
    values: z.array(z.string()),
    motivations: z.array(z.string()),
    painPoints: z.array(z.string()),
    aspirations: z.array(z.string()),
  }),
  behaviors: z.object({
    mediaConsumption: z.array(z.string()),
    purchaseDrivers: z.array(z.string()),
    brandAffinities: z.array(z.string()),
    digitalPlatforms: z.array(z.string()),
  }),
  quote: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = audienceRequestSchema.parse(body);
    
    const systemPrompt = `You are an audience strategist developing detailed personas and audience segments for a breakthrough campaign.

Create comprehensive audience development with EXACTLY this JSON structure:

{
  "personas": [
    {
      "name": "First Last",
      "age": "XX-XX",
      "occupation": "Job Title",
      "location": "City, State",
      "bio": "2-3 sentence character description",
      "demographics": {
        "income": "$XXK-XXK",
        "education": "Degree Level",
        "lifestyle": "Lifestyle Type"
      },
      "psychographics": {
        "values": ["Value1", "Value2", "Value3", "Value4"],
        "motivations": ["Motivation1", "Motivation2", "Motivation3", "Motivation4"],
        "painPoints": ["Pain1", "Pain2", "Pain3", "Pain4"],
        "aspirations": ["Aspiration1", "Aspiration2", "Aspiration3", "Aspiration4"]
      },
      "behaviors": {
        "mediaConsumption": ["Platform1", "Platform2", "Platform3", "Platform4"],
        "purchaseDrivers": ["Driver1", "Driver2", "Driver3", "Driver4"],
        "brandAffinities": ["Brand1", "Brand2", "Brand3", "Brand4"],
        "digitalPlatforms": ["Digital1", "Digital2", "Digital3", "Digital4"]
      },
      "quote": "A quote that captures their worldview"
    }
  ],
  "audienceJourney": {
    "awareness": "How they first encounter the campaign",
    "interest": "What captures their attention",
    "consideration": "What makes them engage deeper",
    "action": "How they participate/convert",
    "advocacy": "How they spread the message"
  },
  "insights": {
    "commonGround": "What unites all personas",
    "keyDifferences": "What distinguishes personas",
    "activationStrategy": "How to engage each persona"
  }
}

Create 2 detailed personas - one primary and one secondary. Be specific, human, and culturally relevant.`;

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
      { temperature: 0.85, max_tokens: 3000, response_format: { type: 'json_object' } }
    );

    const content = response.choices[0]?.message?.content || '{}';
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Validate personas if they exist
      const validatedPersonas = parsedContent.personas?.map((persona: any) => {
        try {
          return personaSchema.parse(persona);
        } catch (e) {
          // Return a default structure if parsing fails
          return {
            name: persona.name || 'Target User',
            age: persona.age || '25-45',
            occupation: persona.occupation || 'Professional',
            location: persona.location || 'Urban Area',
            bio: persona.bio || 'A member of our target audience',
            demographics: persona.demographics || {
              income: '$50K-100K',
              education: "Bachelor's Degree",
              lifestyle: 'Urban Professional'
            },
            psychographics: persona.psychographics || {
              values: ['Quality', 'Innovation', 'Authenticity', 'Community'],
              motivations: ['Success', 'Recognition', 'Impact', 'Growth'],
              painPoints: ['Time constraints', 'Information overload', 'Lack of authenticity', 'Decision fatigue'],
              aspirations: ['Leadership', 'Financial freedom', 'Work-life balance', 'Making a difference']
            },
            behaviors: persona.behaviors || {
              mediaConsumption: ['Social Media', 'Streaming', 'Podcasts', 'News Apps'],
              purchaseDrivers: ['Reviews', 'Brand values', 'Convenience', 'Quality'],
              brandAffinities: ['Premium brands', 'Tech companies', 'Sustainable brands', 'Local businesses'],
              digitalPlatforms: ['Mobile-first', 'Social commerce', 'Video content', 'Apps']
            },
            quote: persona.quote || 'I value brands that align with my values.'
          };
        }
      }) || [];
      
      return NextResponse.json({
        success: true,
        audience: {
          personas: validatedPersonas,
          audienceJourney: parsedContent.audienceJourney || {
            awareness: 'Social media and influencer content',
            interest: 'Engaging visual content and compelling narrative',
            consideration: 'Reviews and peer recommendations',
            action: 'Easy purchase process with clear value',
            advocacy: 'Sharing experiences and creating content'
          },
          insights: parsedContent.insights || {
            commonGround: 'Value authenticity and meaningful connections',
            keyDifferences: 'Life stage and digital behavior patterns',
            activationStrategy: 'Multi-channel approach with persona-specific messaging'
          },
          fullStrategy: content
        }
      });
    } catch (parseError) {
      // Fallback to text extraction if JSON parsing fails
      return NextResponse.json({
        success: true,
        audience: {
          personas: [],
          audienceJourney: extractJourney(content),
          insights: {
            commonGround: 'Shared values and aspirations',
            keyDifferences: 'Demographics and life stages',
            activationStrategy: 'Targeted multi-channel campaigns'
          },
          fullStrategy: content
        }
      });
    }
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


function extractJourney(content: string): any {
  const section = content.match(/AUDIENCE JOURNEY.*?(?=BEHAVIORAL|$)/is)?.[0] || '';
  return {
    awareness: section.match(/Awareness.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    consideration: section.match(/Consideration.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    participation: section.match(/Participation.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
    advocacy: section.match(/Advocacy.*?:?\s*(.+?)(?:\n)/i)?.[1]?.trim() || '',
  };
}