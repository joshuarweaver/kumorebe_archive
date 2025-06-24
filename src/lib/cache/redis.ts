import { Redis } from '@upstash/redis';
import { env } from '@/config/env';

export const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
});

export const CACHE_KEYS = {
  TRENDS: 'trends',
  CULTURAL_INSIGHTS: 'cultural_insights',
  CAMPAIGN_PATTERNS: 'campaign_patterns',
  MODEL_CACHE: 'model_cache',
} as const;

export const CACHE_TTL = {
  TRENDS: 300, // 5 minutes
  CULTURAL_INSIGHTS: 3600, // 1 hour
  CAMPAIGN_PATTERNS: 86400, // 24 hours
  MODEL_CACHE: 1800, // 30 minutes
} as const;

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data as T;
  } catch (error) {
    console.error(`Redis get error for key ${key}:`, error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl?: number
): Promise<void> {
  try {
    if (ttl) {
      await redis.setex(key, ttl, JSON.stringify(data));
    } else {
      await redis.set(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Redis set error for key ${key}:`, error);
  }
}