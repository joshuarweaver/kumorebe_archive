import { env } from '@/config/env';

const DEEPINFRA_API_URL = 'https://api.deepinfra.com/v1/openai';

export interface DeepInfraModel {
  name: string;
  id: string;
  capabilities: string[];
}

export const DEEPINFRA_MODELS: Record<string, DeepInfraModel> = {
  DEEPSEEK_R1: {
    name: 'DeepSeek R1',
    id: 'deepseek-ai/DeepSeek-R1',
    capabilities: ['reasoning', 'analysis', 'strategy'],
  },
  QWEN3: {
    name: 'Qwen QwQ',
    id: 'Qwen/QwQ-32B',
    capabilities: ['creative', 'generation', 'ideation'],
  },
  LLAMA3: {
    name: 'Llama 3.2',
    id: 'meta-llama/Llama-3.2-90B-Vision-Instruct',
    capabilities: ['general', 'fast', 'versatile'],
  },
};

export async function callDeepInfra(
  model: string,
  messages: Array<{ role: string; content: string }>,
  options?: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }
) {
  const response = await fetch(`${DEEPINFRA_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPINFRA_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2048,
      stream: options?.stream ?? false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('DeepInfra API error:', response.status, errorBody);
    throw new Error(`DeepInfra API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${DEEPINFRA_API_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPINFRA_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepInfra embedding error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}