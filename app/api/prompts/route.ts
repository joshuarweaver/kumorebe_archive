import { NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';

export async function GET() {
  try {
    const systemPrompt = `Generate 10 complete campaign brief examples. Each must be a FULL sentence with no ellipsis.

Rules:
- Each prompt must be 150-300 characters
- Complete thoughts only - NO "..." or incomplete sentences
- Include specific details: brand concept, target audience, and solution
- Address real cultural tensions and opportunities
- Cover diverse industries

Example of GOOD prompt:
"Build a mental health app for Gen Z that gamifies therapy sessions and creates viral challenges around emotional vulnerability to destigmatize seeking help"

Example of BAD prompt:
"Create a campaign that challenges the status quo..."

Return a JSON array of 10 complete prompts.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate 10 complete, detailed campaign prompts. No ellipsis or incomplete thoughts.' }
      ],
      { temperature: 0.9, max_tokens: 2000 }
    );

    const content = response.choices[0]?.message?.content || '[]';
    
    try {
      // Extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const prompts = JSON.parse(jsonMatch[0]);
        
        // Filter out any prompts with ellipsis and ensure they're complete
        const completePrompts = prompts.filter((p: string) => 
          p && p.length > 100 && !p.includes('...') && !p.endsWith('.')
        );
        
        if (completePrompts.length >= 5) {
          return NextResponse.json({ prompts: completePrompts });
        }
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }
    
    // High-quality fallback prompts
    const fallbackPrompts = [
      "Launch a mental health app that makes therapy cool for Gen Z by gamifying emotional growth and creating viral TikTok challenges around vulnerability and self-care",
      "Build a sustainable fashion marketplace that exposes fast fashion's environmental crimes while making second-hand luxury more desirable than buying new",
      "Create a fintech platform for millennials that shows exactly how banks exploit them and offers transparent wealth-building tools with zero hidden fees",
      "Develop a food delivery app that connects directly with local farms, shows the carbon footprint of every meal, and makes sustainable eating a status symbol",
      "Transform online dating by matching people based on their activism and social impact goals rather than superficial swipes and filtered photos",
      "Disrupt corporate education with a peer-to-peer platform where industry rebels teach real skills that universities ignore while building anti-establishment credibility",
      "Launch a beauty brand that uses AR to show unfiltered reality, celebrates authentic flaws, and exposes how traditional beauty marketing manipulates insecurities",
      "Build a travel platform that measures positive local impact, creates regenerative tourism experiences, and shames extractive vacation culture",
      "Create a fitness movement that rejects toxic gym culture, celebrates all body types, and brings free strength training to underserved communities",
      "Develop a social platform that rewards users for real-world activism instead of likes, turning social justice into a gamified competition for good"
    ];
    
    return NextResponse.json({ prompts: fallbackPrompts });
    
  } catch (error) {
    console.error('Prompt generation error:', error);
    
    // Return quality fallbacks on error
    return NextResponse.json({ 
      prompts: [
        "Launch a mental health app that makes therapy cool for Gen Z by gamifying emotional growth and creating viral TikTok challenges around vulnerability",
        "Build a sustainable fashion marketplace that exposes fast fashion's true costs while making second-hand luxury more desirable than buying new",
        "Create a fintech platform that shows exactly how banks exploit young people and offers transparent alternatives for building generational wealth"
      ]
    });
  }
}