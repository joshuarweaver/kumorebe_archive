import { z } from "zod"

export const CampaignObjectiveEnum = z.enum([
  "awareness",
  "conversion",
  "retention",
  "advocacy"
])

export const IndustryEnum = z.enum([
  "technology",
  "healthcare",
  "finance",
  "retail",
  "education",
  "entertainment",
  "nonprofit",
  "other"
])

export const CampaignSetupSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  brandName: z.string().min(1, "Brand/Organization name is required"),
  objectives: z.array(CampaignObjectiveEnum).min(1, "Select at least one objective"),
  launchDate: z.date(),
  endDate: z.date(),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  industry: IndustryEnum,
  description: z.string().optional()
})

export type CampaignSetup = z.infer<typeof CampaignSetupSchema>

export interface AudienceSegment {
  name: string
  demographics: {
    ageRange: string
    gender: string[]
    location: string[]
    income: string
  }
  psychographics: {
    interests: string[]
    values: string[]
    lifestyle: string[]
  }
  behaviors: {
    purchaseBehavior: string[]
    mediaConsumption: string[]
    brandInteraction: string[]
  }
  sizeEstimate: string
  keyInsights: string[]
  painPoints: string[]
}

export interface Persona {
  name: string
  age: number
  occupation: string
  background: string
  goals: string[]
  challenges: string[]
  preferredChannels: string[]
  quote: string
  dayInLife: string[]
}

export interface CustomerJourneyStage {
  name: string
  touchpoints: string[]
  contentNeeds: string[]
  channels: string[]
  emotionalState: string
  keyActions: string[]
}

export interface KPI {
  name: string
  target: string
  measurement: string
  frequency: string
  benchmark: string
}

export interface TacticItem {
  channel: string
  platform: string
  strategy: string
  budget: number
  timeline: string
  kpis: string[]
}

export interface ContentPillar {
  name: string
  themes: string[]
  formats: string[]
  frequency: string
  keyMessages: string[]
}

export interface MessagingFramework {
  coreMessage: string
  proofPoints: string[]
  ctaBySegment: Record<string, string>
  toneAndVoice: {
    tone: string[]
    voice: string[]
    doList: string[]
    dontList: string[]
  }
  differentiators: string[]
}

export interface MediaMix {
  paid: {
    channels: string[]
    percentage: number
    budget: number
  }
  owned: {
    channels: string[]
    percentage: number
    budget: number
  }
  earned: {
    channels: string[]
    percentage: number
    budget: number
  }
  testingBudget: number
  contingencyBudget: number
}

export interface Campaign extends CampaignSetup {
  id: string
  createdAt: Date
  updatedAt: Date
  status: "draft" | "active" | "completed"
  audienceStrategy: {
    primarySegments: AudienceSegment[]
    secondarySegments: AudienceSegment[]
    personas: Persona[]
  }
  customerJourney: {
    awareness: CustomerJourneyStage
    consideration: CustomerJourneyStage
    decision: CustomerJourneyStage
    retention: CustomerJourneyStage
    advocacy: CustomerJourneyStage
  }
  kpis: {
    primary: KPI[]
    secondary: KPI[]
  }
  tactics: TacticItem[]
  contentStrategy: {
    pillars: ContentPillar[]
    editorialCalendar: {
      month: string
      themes: string[]
      keyDates: string[]
    }[]
    creativeBrief: string
  }
  messaging: MessagingFramework
  mediaMix: MediaMix
  measurement: {
    methodology: string
    optimizationTriggers: string[]
    reportingCadence: string
    successCriteria: string[]
  }
}