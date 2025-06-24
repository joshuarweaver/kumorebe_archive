import { Index } from '@upstash/vector';

export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

export interface VectorMetadata {
  campaignId?: string;
  type: 'campaign' | 'pattern' | 'insight' | 'trend';
  timestamp: number;
  source?: string;
  confidence?: number;
}

export async function upsertVector(
  id: string,
  vector: number[],
  metadata: VectorMetadata
) {
  try {
    await vectorIndex.upsert({
      id,
      vector,
      metadata,
    });
  } catch (error) {
    console.error('Vector upsert error:', error);
    throw error;
  }
}

export async function queryVectors(
  vector: number[],
  topK: number = 10,
  filter?: Partial<VectorMetadata>
) {
  try {
    const results = await vectorIndex.query({
      vector,
      topK,
      includeMetadata: true,
      filter,
    });
    return results;
  } catch (error) {
    console.error('Vector query error:', error);
    throw error;
  }
}

export async function deleteVector(id: string) {
  try {
    await vectorIndex.delete(id);
  } catch (error) {
    console.error('Vector delete error:', error);
    throw error;
  }
}