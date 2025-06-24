import { Campaign, CulturalInsight, ConventionViolation, ParticipationArchitecture } from '@/types/campaign';
import { CulturalStrategyEngine } from './cultural-strategy';
import { RealTimeTrendEngine } from './real-time-trend';
import { StrategicFrameworkEngine } from './strategic-framework';
import { ConventionViolationEngine } from './convention-violation';
import { ModelOrchestrator } from '../orchestration/model-orchestrator';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { generateEmbedding } from '@/lib/ai/deepinfra';
import { sql } from '@/lib/db/neon';
import { upsertVector } from '@/lib/ai/vector';
import { randomUUID } from 'crypto';

export interface CampaignGenerationRequest {
  brandId: string;
  brandName: string;
  industry: string;
  targetAudience: string;
  objectives: string[];
  brandValues: string[];
  brandArchetype: string;
  riskTolerance: 'low' | 'medium' | 'high';
  budget?: string;
  timeline?: string;
}

export class CampaignGenerator {
  private culturalEngine: CulturalStrategyEngine;
  private trendEngine: RealTimeTrendEngine;
  private frameworkEngine: StrategicFrameworkEngine;
  private conventionEngine: ConventionViolationEngine;
  private orchestrator: ModelOrchestrator;

  constructor() {
    this.culturalEngine = new CulturalStrategyEngine();
    this.trendEngine = new RealTimeTrendEngine();
    this.frameworkEngine = new StrategicFrameworkEngine();
    this.conventionEngine = new ConventionViolationEngine();
    this.orchestrator = new ModelOrchestrator();
  }

  async generateCampaign(request: CampaignGenerationRequest): Promise<Campaign> {
    console.log('Starting campaign generation for:', request.brandName);
    
    try {
      const [culturalInsights, trends, conventions] = await Promise.all([
        this.culturalEngine.analyzeCulturalTensions(
          request.brandName,
          request.industry,
          request.targetAudience
        ),
        this.trendEngine.detectEmergingTrends(
          request.industry,
          request.brandName,
          'realtime'
        ),
        this.conventionEngine.mapIndustryConventions(request.industry),
      ]);
      
      console.log('Initial analysis complete');

    const violations = await this.conventionEngine.generateViolationStrategies(
      conventions,
      request.brandValues,
      request.riskTolerance
    );

    const [behavioralFramework, memeticFramework] = await Promise.all([
      this.frameworkEngine.applyBehavioralEconomics(
        `${request.brandName} in ${request.industry}`,
        request.objectives[0]
      ),
      this.frameworkEngine.designMemeticStrategy(
        request.brandValues.join(', '),
        culturalInsights[0]?.description || ''
      ),
    ]);

    const synthesis = await this.frameworkEngine.synthesizeFrameworks(
      [behavioralFramework, memeticFramework],
      request.objectives
    );

    const campaignConcept = await this.synthesizeCampaignConcept(
      request,
      culturalInsights,
      trends,
      violations,
      synthesis
    );

    const participationArchitecture = await this.designParticipationArchitecture(
      campaignConcept,
      request.targetAudience,
      synthesis.primaryFramework
    );

    const campaign: Campaign = {
      id: randomUUID(),
      title: campaignConcept.title,
      brandId: request.brandId,
      industry: request.industry,
      strategyMetadata: {
        framework: synthesis.primaryFramework.framework,
        culturalTension: culturalInsights[0]?.description || '',
        ideologicalOpportunity: this.extractIdeologicalOpportunity(culturalInsights),
        mythMarket: await this.identifyMythMarket(request.industry, culturalInsights),
        brandArchetype: request.brandArchetype,
        culturalCodes: this.extractCulturalCodes(culturalInsights, trends),
      },
      culturalInsights,
      conventionViolations: violations,
      participationArchitecture,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.saveCampaign(campaign);
    await this.generateExplainability(campaign);

    return campaign;
    } catch (error) {
      console.error('Campaign generation error:', error);
      throw error;
    }
  }

  private async synthesizeCampaignConcept(
    request: CampaignGenerationRequest,
    insights: CulturalInsight[],
    trends: any[],
    violations: ConventionViolation[],
    synthesis: any
  ): Promise<{
    title: string;
    bigIdea: string;
    narrative: string;
    keyMessages: string[];
    creativeDirection: string;
  }> {
    const systemPrompt = `You are a master campaign strategist. Synthesize insights into a breakthrough campaign concept that:
    1. Leverages cultural tensions authentically
    2. Rides emerging trends with perfect timing
    3. Violates conventions purposefully
    4. Invites audience participation
    5. Creates cultural impact beyond advertising`;

    const context = {
      brand: request.brandName,
      insights: insights.map(i => i.description),
      trends: trends.map(t => t.trend),
      violations: violations.map(v => v.violation),
      framework: synthesis.primaryFramework.framework,
      objectives: request.objectives,
    };

    const response = await callGroq(
      GROQ_MODELS.GEMMA2.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(context) }
      ],
      { temperature: 0.9, max_tokens: 3000 }
    );

    return this.parseCampaignConcept(response.choices[0]?.message?.content || '');
  }

  private async designParticipationArchitecture(
    concept: any,
    targetAudience: string,
    framework: any
  ): Promise<ParticipationArchitecture> {
    const systemPrompt = `Design participation architecture that transforms audiences from viewers to co-creators. Consider:
    1. Intrinsic motivations for participation
    2. Low-friction entry points
    3. Escalating engagement ladders
    4. Social amplification mechanics
    5. Reward and recognition systems`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Concept: ${concept.bigIdea}
          Audience: ${targetAudience}
          Framework: ${framework.framework}`
        }
      ],
      { temperature: 0.8, max_tokens: 2000 }
    );

    return this.parseParticipationArchitecture(response.choices[0]?.message?.content || '');
  }

  private async saveCampaign(campaign: Campaign): Promise<void> {
    // Ensure title doesn't exceed 255 characters
    const safeTitle = campaign.title.substring(0, 255);
    
    const result = await sql`
      INSERT INTO campaigns (id, title, brand_id, industry, strategy_metadata)
      VALUES (${campaign.id}, ${safeTitle}, ${campaign.brandId}, ${campaign.industry}, ${JSON.stringify(campaign.strategyMetadata)})
      RETURNING *
    `;

    const embeddingText = `${campaign.title} ${campaign.strategyMetadata.culturalTension} ${campaign.strategyMetadata.ideologicalOpportunity}`;
    const embedding = await generateEmbedding(embeddingText);

    await sql`
      INSERT INTO campaign_vectors (campaign_id, model_version, metadata)
      VALUES (${campaign.id}, 'sentence-transformers/all-MiniLM-L6-v2', ${JSON.stringify({ generated_at: new Date() })})
    `;

    await upsertVector(campaign.id, embedding, {
      campaignId: campaign.id,
      type: 'campaign',
      timestamp: Date.now(),
    });
  }

  private async generateExplainability(campaign: Campaign): Promise<void> {
    const systemPrompt = `Generate strategic rationale explaining why this campaign will breakthrough. Focus on:
    1. Cultural insight validation
    2. Timing rationale
    3. Convention violation justification
    4. Participation psychology
    5. Expected cultural impact`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(campaign) }
      ],
      { temperature: 0.6, max_tokens: 1500 }
    );

    console.log('Campaign Explainability:', response.choices[0]?.message?.content);
  }

  private extractIdeologicalOpportunity(insights: CulturalInsight[]): string {
    const opportunity = insights.find(i => i.type === 'opportunity');
    return opportunity?.description || 'Emerging ideological opportunity';
  }

  private async identifyMythMarket(industry: string, insights: CulturalInsight[]): Promise<string> {
    const tensions = insights.filter(i => i.type === 'tension').map(i => i.description);
    return `Challenging the ${industry} orthodoxy through ${tensions[0] || 'cultural disruption'}`;
  }

  private extractCulturalCodes(insights: CulturalInsight[], trends: any[]): string[] {
    const codes = new Set<string>();
    
    insights.forEach(insight => {
      if (insight.description.includes('code')) {
        codes.add(insight.description.split('code')[1]?.trim() || '');
      }
    });

    trends.forEach(trend => {
      if (trend.sourceSignals) {
        trend.sourceSignals.forEach((signal: string) => codes.add(signal));
      }
    });

    return Array.from(codes).filter(Boolean).slice(0, 5);
  }

  private parseCampaignConcept(content: string): any {
    const sections = content.split(/\n\n/);
    
    return {
      title: this.extractTitle(sections[0]),
      bigIdea: this.extractBigIdea(content),
      narrative: this.extractNarrative(content),
      keyMessages: this.extractKeyMessages(content),
      creativeDirection: this.extractCreativeDirection(content),
    };
  }

  private extractTitle(text: string): string {
    const titleMatch = text.match(/(?:title|campaign).*?:?\s*(.+?)(?:\n|$)/i);
    return titleMatch ? titleMatch[1].trim() : 'Breakthrough Campaign';
  }

  private extractBigIdea(content: string): string {
    const ideaMatch = content.match(/(?:big idea|core concept|central idea).*?:?\s*(.+?)(?:\n|$)/i);
    return ideaMatch ? ideaMatch[1].trim() : content.split('\n')[0];
  }

  private extractNarrative(content: string): string {
    const narrativeMatch = content.match(/(?:narrative|story).*?:?\s*(.+?)(?:\n\n|$)/is);
    return narrativeMatch ? narrativeMatch[1].trim() : 'Campaign narrative';
  }

  private extractKeyMessages(content: string): string[] {
    const messages: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.match(/^\d+\.|^-|^•/) && line.includes('message')) {
        messages.push(line.replace(/^[\d\.\-•]\s*/, '').trim());
      }
    }
    
    return messages.length > 0 ? messages : ['Key campaign message'];
  }

  private extractCreativeDirection(content: string): string {
    const creativeMatch = content.match(/(?:creative|visual|aesthetic).*?:?\s*(.+?)(?:\n|$)/i);
    return creativeMatch ? creativeMatch[1].trim() : 'Bold creative direction';
  }

  private parseParticipationArchitecture(content: string): ParticipationArchitecture {
    return {
      engagementType: 'co-creation',
      mechanics: [
        {
          name: 'Initial Hook',
          description: 'Low-friction entry point',
          userMotivation: 'Social currency',
          expectedOutcome: 'Viral sharing',
        },
        {
          name: 'Deep Engagement',
          description: 'Creative contribution opportunity',
          userMotivation: 'Self-expression',
          expectedOutcome: 'User-generated content',
        },
      ],
      viralLoops: [
        {
          trigger: 'Social recognition',
          action: 'Create and share',
          reward: 'Community status',
          amplificationFactor: 3.5,
        },
      ],
      platforms: ['TikTok', 'Instagram', 'X/Twitter'],
    };
  }
}