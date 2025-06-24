export interface Campaign {
  id: string;
  title: string;
  brandId: string;
  industry: string;
  strategyMetadata: StrategyMetadata;
  culturalInsights: CulturalInsight[];
  conventionViolations: ConventionViolation[];
  participationArchitecture: ParticipationArchitecture;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyMetadata {
  framework: string;
  culturalTension: string;
  ideologicalOpportunity: string;
  mythMarket: string;
  brandArchetype: string;
  culturalCodes: string[];
}

export interface CulturalInsight {
  type: 'tension' | 'opportunity' | 'trend';
  description: string;
  source: string;
  confidence: number;
  timestamp: Date;
}

export interface ConventionViolation {
  convention: string;
  violation: string;
  riskLevel: 'low' | 'medium' | 'high';
  alignmentScore: number;
  rationale: string;
}

export interface ParticipationArchitecture {
  engagementType: 'co-creation' | 'user-generated' | 'social-challenge' | 'community';
  mechanics: ParticipationMechanic[];
  viralLoops: ViralLoop[];
  platforms: string[];
}

export interface ParticipationMechanic {
  name: string;
  description: string;
  userMotivation: string;
  expectedOutcome: string;
}

export interface ViralLoop {
  trigger: string;
  action: string;
  reward: string;
  amplificationFactor: number;
}