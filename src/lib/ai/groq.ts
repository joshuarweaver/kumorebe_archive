import Groq from 'groq-sdk';
import { env } from '@/config/env';

export const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export interface GroqModel {
  name: string;
  id: string;
  capabilities: string[];
}

export const GROQ_MODELS: Record<string, GroqModel> = {
  LLAMA_70B: {
    name: 'Llama 3.3 70B',
    id: 'llama-3.3-70b-versatile',
    capabilities: ['general', 'fast', 'analysis'],
  },
  LLAMA_8B: {
    name: 'Llama 3.1 8B',
    id: 'llama-3.1-8b-instant',
    capabilities: ['fast', 'general'],
  },
  GEMMA2: {
    name: 'Gemma 2 9B',
    id: 'gemma2-9b-it',
    capabilities: ['reasoning', 'analysis'],
  },
};

export async function callGroq(
  model: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    temperature?: number;
    max_tokens?: number;
  }
) {
  try {
    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2048,
    });

    return completion;
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

export async function analyzeRealTimeTrends(query: string) {
  const messages = [
    {
      role: 'system' as const,
      content: `You are a cultural trend analyst. Analyze current social conversations and identify emerging trends, cultural tensions, and ideological opportunities. Focus on real-time insights that could inform breakthrough marketing campaigns.`,
    },
    {
      role: 'user' as const,
      content: query,
    },
  ];

  const response = await callGroq(GROQ_MODELS.LLAMA_70B.id, messages, {
    temperature: 0.8,
    max_tokens: 1500,
  });

  return response.choices[0]?.message?.content || '';
}