import { neon } from '@neondatabase/serverless';
import { env } from '@/config/env';

export const sql = neon(env.DATABASE_URL);
export const sqlUnpooled = neon(env.DATABASE_URL_UNPOOLED);

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      brand_id VARCHAR(255) NOT NULL,
      industry VARCHAR(100) NOT NULL,
      strategy_metadata JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS campaign_vectors (
      campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
      model_version VARCHAR(50),
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (campaign_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS knowledge_nodes (
      node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      node_type VARCHAR(50) NOT NULL,
      properties JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS relationships (
      source_id UUID REFERENCES knowledge_nodes(node_id),
      target_id UUID REFERENCES knowledge_nodes(node_id),
      relationship_type VARCHAR(50) NOT NULL,
      weight FLOAT DEFAULT 1.0,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (source_id, target_id, relationship_type)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pattern_library (
      pattern_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      pattern_type VARCHAR(50) NOT NULL,
      pattern_rules JSONB NOT NULL,
      confidence_score FLOAT NOT NULL,
      occurrence_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}