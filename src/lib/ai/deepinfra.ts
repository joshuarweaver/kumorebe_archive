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
    id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
    capabilities: ['reasoning', 'analysis', 'strategy'],
  },
  QWEN3: {
    name: 'Qwen 3',
    id: 'Qwen/QwQ-32B-Preview',
    capabilities: ['creative', 'generation', 'ideation'],
  },
  LLAMA4: {
    name: 'Llama 4',
    id: 'meta-llama/Llama-3.3-70B-Instruct',
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
    throw new Error(`DeepInfra API error: ${response.statusText}`);
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
      model: 'BAAI/bge-large-en-v1.5',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepInfra embedding error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}