import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config({ path: '.env.local' });

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Create SQL client with env var
    const sql = neon(process.env.DATABASE_URL!);
    
    // Drop existing tables
    console.log('Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS campaign_analytics CASCADE`;
    await sql`DROP TABLE IF EXISTS campaigns CASCADE`;
    
    // Create campaigns table
    console.log('Creating campaigns table...');
    await sql`
      CREATE TABLE campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        -- Basic campaign info
        brand_id VARCHAR(255) NOT NULL,
        brand_name VARCHAR(255) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        
        -- Campaign summary
        campaign_name TEXT NOT NULL,
        tagline TEXT,
        big_idea TEXT,
        strategic_rationale TEXT,
        expected_impact TEXT,
        
        -- Target audience
        target_audience TEXT,
        
        -- Campaign details
        objectives JSONB,
        brand_values JSONB,
        brand_archetype VARCHAR(100),
        risk_tolerance VARCHAR(20),
        
        -- Full campaign data
        summary_data JSONB,
        audience_data JSONB,
        kpi_data JSONB,
        media_strategy_data JSONB,
        creative_data JSONB,
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        viewed_count INTEGER DEFAULT 0,
        shared_count INTEGER DEFAULT 0,
        
        -- URL slug for sharing
        slug VARCHAR(255) UNIQUE
      )
    `;
    
    // Create indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX idx_campaigns_slug ON campaigns(slug)`;
    await sql`CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id)`;
    await sql`CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC)`;
    
    // Create analytics table
    console.log('Creating campaign_analytics table...');
    await sql`
      CREATE TABLE campaign_analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB,
        ip_address INET,
        user_agent TEXT,
        referrer TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create analytics indexes
    await sql`CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id)`;
    await sql`CREATE INDEX idx_campaign_analytics_event_type ON campaign_analytics(event_type)`;
    await sql`CREATE INDEX idx_campaign_analytics_created_at ON campaign_analytics(created_at DESC)`;
    
    // Create update trigger
    console.log('Creating update trigger...');
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    
    await sql`
      CREATE TRIGGER update_campaigns_updated_at 
      BEFORE UPDATE ON campaigns 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column()
    `;
    
    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrate();