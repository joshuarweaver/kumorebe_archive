import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { ModelOrchestrator } from '../orchestration/model-orchestrator';

export interface StrategicFramework {
  framework: string;
  application: string;
  tacticalElements: string[];
  expectedOutcome: string;
  confidence: number;
}

export class StrategicFrameworkEngine {
  private orchestrator: ModelOrchestrator;

  constructor() {
    this.orchestrator = new ModelOrchestrator();
  }

  async applyBehavioralEconomics(
    campaignContext: string,
    targetBehavior: string
  ): Promise<StrategicFramework> {
    const systemPrompt = `Apply behavioral economics principles to design campaign mechanics. Consider:
    1. Nudge theory and choice architecture
    2. Loss aversion and framing effects
    3. Social proof and conformity biases
    4. Anchoring and availability heuristics
    5. Gamification and reward structures`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context: ${campaignContext}\nDesired Behavior: ${targetBehavior}` }
      ],
      { temperature: 0.7, max_tokens: 1500 }
    );

    return this.parseFrameworkResponse(response.choices[0]?.message?.content || '', 'Behavioral Economics');
  }

  async designMemeticStrategy(
    brandMessage: string,
    culturalContext: string
  ): Promise<StrategicFramework> {
    const systemPrompt = `Design a memetic strategy using:
    1. STEPPS framework (Social Currency, Triggers, Emotion, Public, Practical Value, Stories)
    2. Network topology optimization
    3. Seeding and amplification strategies
    4. Mutation and evolution pathways
    5. Cross-platform adaptation patterns`;

    const response = await callGroq(
      GROQ_MODELS.GEMMA2.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Message: ${brandMessage}\nCultural Context: ${culturalContext}` }
      ],
      { temperature: 0.8, max_tokens: 2000 }
    );

    return this.parseFrameworkResponse(response.choices[0]?.message?.content || '', 'Memetic Theory');
  }

  async createTransmediaArchitecture(
    coreNarrative: string,
    platforms: string[]
  ): Promise<StrategicFramework> {
    const systemPrompt = `Design transmedia storytelling architecture with:
    1. Worldbuilding and mythology
    2. Platform-specific narratives
    3. Participation opportunities
    4. Canon vs. fanon boundaries
    5. Extractability and drillability`;

    const response = await callGroq(
      GROQ_MODELS.GEMMA2.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Narrative: ${coreNarrative}\nPlatforms: ${platforms.join(', ')}` }
      ],
      { temperature: 0.9, max_tokens: 2500 }
    );

    return this.parseFrameworkResponse(response.choices[0]?.message?.content || '', 'Transmedia Storytelling');
  }

  async applyComplexityTheory(
    systemElements: string[],
    desiredEmergence: string
  ): Promise<StrategicFramework> {
    const systemPrompt = `Apply complexity theory to campaign design:
    1. Identify feedback loops and amplification points
    2. Design for emergence and self-organization
    3. Map network effects and tipping points
    4. Create adaptive response mechanisms
    5. Build antifragile campaign structures`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `System Elements: ${systemElements.join(', ')}\nDesired Emergence: ${desiredEmergence}` }
      ],
      { temperature: 0.7, max_tokens: 1800 }
    );

    return this.parseFrameworkResponse(response.choices[0]?.message?.content || '', 'Complexity Theory');
  }

  async synthesizeFrameworks(
    frameworks: StrategicFramework[],
    campaignObjectives: string[]
  ): Promise<{
    primaryFramework: StrategicFramework;
    supportingFrameworks: StrategicFramework[];
    synergyPoints: string[];
    implementationSequence: string[];
  }> {
    const systemPrompt = `Synthesize multiple strategic frameworks into a cohesive campaign strategy. Identify synergies, conflicts, and optimal implementation sequence.`;

    const response = await callGroq(
      GROQ_MODELS.GEMMA2.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify({ frameworks, objectives: campaignObjectives }) }
      ],
      { temperature: 0.6, max_tokens: 2000 }
    );

    return this.parseSynthesis(response.choices[0]?.message?.content || '', frameworks);
  }

  private parseFrameworkResponse(content: string, frameworkName: string): StrategicFramework {
    const sections = content.split(/\n\n/);
    
    return {
      framework: frameworkName,
      application: sections[0] || 'Strategic application of ' + frameworkName,
      tacticalElements: this.extractTacticalElements(content),
      expectedOutcome: this.extractExpectedOutcome(content),
      confidence: this.calculateConfidence(content, frameworkName),
    };
  }

  private extractTacticalElements(content: string): string[] {
    const elements: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.match(/^\d+\.|^-|^•/) && line.length > 10) {
        elements.push(line.replace(/^[\d\.\-•]\s*/, '').trim());
      }
    }
    
    return elements.slice(0, 5);
  }

  private extractExpectedOutcome(content: string): string {
    const outcomeMatch = content.match(/(?:outcome|result|expect|achieve).*?:?\s*(.+?)(?:\n|$)/i);
    return outcomeMatch ? outcomeMatch[1].trim() : 'Breakthrough campaign performance';
  }

  private calculateConfidence(content: string, framework: string): number {
    let confidence = 0.7;
    
    if (content.length > 1000) confidence += 0.1;
    if (content.includes('research') || content.includes('data')) confidence += 0.05;
    if (framework === 'Behavioral Economics') confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }

  private parseSynthesis(content: string, frameworks: StrategicFramework[]): any {
    return {
      primaryFramework: frameworks[0] || this.createDefaultFramework(),
      supportingFrameworks: frameworks.slice(1),
      synergyPoints: [
        'Behavioral nudges amplify memetic spread',
        'Transmedia architecture enables complexity emergence',
        'Cultural tensions create viral triggers',
      ],
      implementationSequence: [
        'Establish cultural foundation',
        'Deploy behavioral mechanics',
        'Activate memetic elements',
        'Scale through transmedia',
      ],
    };
  }

  private createDefaultFramework(): StrategicFramework {
    return {
      framework: 'Integrated Strategy',
      application: 'Multi-framework strategic approach',
      tacticalElements: ['Cultural insight', 'Behavioral design', 'Viral mechanics'],
      expectedOutcome: 'Breakthrough campaign performance',
      confidence: 0.8,
    };
  }
}