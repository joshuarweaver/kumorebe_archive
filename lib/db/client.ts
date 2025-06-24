import { neon } from '@neondatabase/serverless';

// Create the SQL query function
export const sql = neon(process.env.DATABASE_URL!);

// Types for our campaign data
export interface Campaign {
  id: string;
  brand_id: string;
  brand_name: string;
  industry: string;
  campaign_name: string;
  tagline?: string;
  big_idea?: string;
  strategic_rationale?: string;
  expected_impact?: string;
  target_audience?: string;
  objectives?: any;
  brand_values?: any;
  brand_archetype?: string;
  risk_tolerance?: string;
  summary_data?: any;
  audience_data?: any;
  kpi_data?: any;
  media_strategy_data?: any;
  creative_data?: any;
  created_at: Date;
  updated_at: Date;
  viewed_count: number;
  shared_count: number;
  slug?: string;
}

export interface CampaignAnalytics {
  id: string;
  campaign_id: string;
  event_type: 'view' | 'share' | 'export' | 'generate';
  event_data?: any;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: Date;
}

// Helper function to generate URL-safe slugs
export function generateSlug(campaignName: string): string {
  const randomId = Math.random().toString(36).substring(2, 8);
  const nameSlug = campaignName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  return `${nameSlug}-${randomId}`;
}