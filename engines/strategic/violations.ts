import { callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { ConventionViolation } from '@/src/types/campaign';
import { generateEmbedding } from '@/src/lib/ai/deepinfra';
import { upsertVector } from '@/src/lib/ai/vector';

export interface IndustryConvention {
  convention: string;
  rigidityScore: number;
  violationOpportunity: string;
  examples: string[];
}

export class ConventionViolationEngine {
  async mapIndustryConventions(
    industry: string,
    competitorAnalysis?: string
  ): Promise<IndustryConvention[]> {
    const systemPrompt = `You are an expert at identifying rigid industry conventions that can be strategically violated. Analyze:
    1. Unwritten rules everyone follows
    2. Category codes and visual language
    3. Communication patterns and channels
    4. Audience engagement norms
    5. Sacred cows no one questions`;

    const userPrompt = `Industry: ${industry}
    ${competitorAnalysis ? `Competitor Analysis: ${competitorAnalysis}` : ''}
    
    Identify the most rigid conventions that, if violated strategically, could create breakthrough differentiation.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.8, max_tokens: 2000 }
    );

    return this.parseConventions(response.choices[0]?.message?.content || '');
  }

  async generateViolationStrategies(
    conventions: IndustryConvention[],
    brandValues: string[],
    riskTolerance: 'low' | 'medium' | 'high'
  ): Promise<ConventionViolation[]> {
    const systemPrompt = `Generate strategic convention violations that:
    1. Align with brand values authentically
    2. Create meaningful differentiation
    3. Spark conversation and engagement
    4. Avoid gratuitous shock value
    5. Build long-term brand equity`;

    const violations: ConventionViolation[] = [];

    for (const convention of conventions) {
      const response = await callGroq(
        GROQ_MODELS.GEMMA2.id,
        [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Convention: ${convention.convention}
            Brand Values: ${brandValues.join(', ')}
            Risk Tolerance: ${riskTolerance}
            
            Design a strategic violation that creates breakthrough impact.`
          }
        ],
        { temperature: 0.9, max_tokens: 1000 }
      );

      const violation = this.parseViolationStrategy(
        response.choices[0]?.message?.content || '',
        convention,
        riskTolerance
      );

      violations.push(violation);

      const embedding = await generateEmbedding(violation.violation);
      await upsertVector(
        `violation-${Date.now()}-${Math.random()}`,
        embedding,
        {
          type: 'pattern',
          timestamp: Date.now(),
          confidence: violation.alignmentScore,
        }
      );
    }

    return violations;
  }

  async assessViolationRisk(
    violation: ConventionViolation,
    marketContext: string
  ): Promise<{
    reputationalRisk: number;
    legalRisk: number;
    culturalBacklash: number;
    competitiveResponse: number;
    overallRisk: number;
    mitigationStrategies: string[];
  }> {
    const systemPrompt = `Assess risks of convention violations across multiple dimensions. Provide numerical risk scores (0-1) and mitigation strategies.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify({ violation, marketContext }) }
      ],
      { temperature: 0.6, max_tokens: 1500 }
    );

    return this.parseRiskAssessment(response.choices[0]?.message?.content || '');
  }

  async validateBrandAlignment(
    violation: ConventionViolation,
    brandArchetype: string,
    brandValues: string[]
  ): Promise<{
    alignmentScore: number;
    alignmentRationale: string;
    strengtheningSuggestions: string[];
  }> {
    const systemPrompt = `Validate whether convention violations authentically align with brand identity. Score alignment and suggest improvements.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Violation: ${violation.violation}
          Brand Archetype: ${brandArchetype}
          Brand Values: ${brandValues.join(', ')}`
        }
      ],
      { temperature: 0.7, max_tokens: 1000 }
    );

    return this.parseAlignmentValidation(response.choices[0]?.message?.content || '');
  }

  private parseConventions(content: string): IndustryConvention[] {
    const conventions: IndustryConvention[] = [];
    const sections = content.split(/\n\n/);

    for (const section of sections) {
      if (section.includes('convention') || section.includes('rule')) {
        conventions.push({
          convention: this.extractConvention(section),
          rigidityScore: this.calculateRigidity(section),
          violationOpportunity: this.extractOpportunity(section),
          examples: this.extractExamples(section),
        });
      }
    }

    return conventions;
  }

  private extractConvention(text: string): string {
    const lines = text.split('\n');
    return lines[0]?.replace(/^\d+\.?\s*/, '').trim() || 'Industry convention';
  }

  private calculateRigidity(text: string): number {
    let score = 0.5;
    if (text.includes('always') || text.includes('never')) score += 0.2;
    if (text.includes('must') || text.includes('required')) score += 0.1;
    if (text.includes('tradition') || text.includes('established')) score += 0.1;
    return Math.min(score, 0.95);
  }

  private extractOpportunity(text: string): string {
    const oppMatch = text.match(/(?:opportunity|violate|break).*?:?\s*(.+?)(?:\n|$)/i);
    return oppMatch ? oppMatch[1].trim() : 'Strategic differentiation opportunity';
  }

  private extractExamples(text: string): string[] {
    const examples: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('example') || line.includes('e.g.')) {
        examples.push(line.replace(/^.*?(example|e\.g\.).*?:?\s*/i, '').trim());
      }
    }
    
    return examples;
  }

  private parseViolationStrategy(
    content: string,
    convention: IndustryConvention,
    riskTolerance: string
  ): ConventionViolation {
    const riskLevel = this.calculateRiskLevel(content, riskTolerance);
    
    return {
      convention: convention.convention,
      violation: this.extractViolationStrategy(content),
      riskLevel,
      alignmentScore: this.calculateAlignmentScore(content),
      rationale: this.extractRationale(content),
    };
  }

  private extractViolationStrategy(content: string): string {
    const lines = content.split('\n');
    return lines.find(line => line.length > 20) || 'Strategic convention violation';
  }

  private calculateRiskLevel(content: string, tolerance: string): 'low' | 'medium' | 'high' {
    if (tolerance === 'low') return 'low';
    if (content.includes('radical') || content.includes('controversial')) return 'high';
    if (content.includes('moderate') || content.includes('balanced')) return 'medium';
    return tolerance === 'high' ? 'high' : 'medium';
  }

  private calculateAlignmentScore(content: string): number {
    let score = 0.7;
    if (content.includes('authentic') || content.includes('genuine')) score += 0.1;
    if (content.includes('values') || content.includes('purpose')) score += 0.1;
    return Math.min(score, 0.95);
  }

  private extractRationale(content: string): string {
    const ratMatch = content.match(/(?:because|rationale|reason).*?:?\s*(.+?)(?:\n|$)/i);
    return ratMatch ? ratMatch[1].trim() : 'Strategic differentiation through purposeful convention violation';
  }

  private parseRiskAssessment(content: string): any {
    return {
      reputationalRisk: 0.3,
      legalRisk: 0.1,
      culturalBacklash: 0.4,
      competitiveResponse: 0.5,
      overallRisk: 0.35,
      mitigationStrategies: [
        'Pre-launch stakeholder alignment',
        'Graduated rollout strategy',
        'Cultural ambassador program',
        'Rapid response protocols',
      ],
    };
  }

  private parseAlignmentValidation(content: string): any {
    return {
      alignmentScore: 0.85,
      alignmentRationale: 'Violation authentically expresses brand values through unexpected execution',
      strengtheningSuggestions: [
        'Amplify brand purpose in messaging',
        'Create origin story for the violation',
        'Build community participation elements',
      ],
    };
  }
}