/**
 * Unified AI Client using Vercel AI Gateway
 * Single API key and endpoint for all providers with built-in observability
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText, generateObject } from 'ai';
import { z } from 'zod';

// Initialize providers with Vercel AI Gateway
const gatewayConfig = {
  baseURL: process.env.AI_GATEWAY_URL || 'https://gateway.vercel.app',
  headers: {
    'Authorization': `Bearer ${process.env.VERCEL_AI_GATEWAY_API_KEY}`,
  },
};

// Create provider instances
export const openai = createOpenAI({
  baseURL: `${gatewayConfig.baseURL}/openai`,
  headers: gatewayConfig.headers,
});

export const anthropic = createAnthropic({
  baseURL: `${gatewayConfig.baseURL}/anthropic`,
  headers: gatewayConfig.headers,
});

export const google = createGoogleGenerativeAI({
  baseURL: `${gatewayConfig.baseURL}/google`,
  headers: gatewayConfig.headers,
});

// Groq through OpenAI-compatible endpoint
export const groq = createOpenAI({
  baseURL: `${gatewayConfig.baseURL}/groq`,
  headers: gatewayConfig.headers,
});

// Model registry with capabilities
export const models = {
  // Cultural Analysis - Needs nuance
  'claude-3-opus': {
    provider: anthropic,
    model: 'claude-3-opus-20240229',
    strengths: ['cultural_analysis', 'nuanced_reasoning', 'long_context'],
    costTier: 'premium',
    speed: 'slow',
  },
  
  // Real-time Trend Detection - Needs speed
  'llama-3.3-70b': {
    provider: groq,
    model: 'llama-3.3-70b-versatile',
    strengths: ['trend_detection', 'real_time', 'pattern_recognition'],
    costTier: 'low',
    speed: 'fast',
  },
  
  // Creative Generation - Needs diversity
  'gpt-4-turbo': {
    provider: openai,
    model: 'gpt-4-turbo',
    strengths: ['creative_generation', 'ideation', 'storytelling'],
    costTier: 'high',
    speed: 'medium',
  },
  
  // Strategic Reasoning
  'claude-3-sonnet': {
    provider: anthropic,
    model: 'claude-3-sonnet-20240229',
    strengths: ['strategic_reasoning', 'analysis', 'planning'],
    costTier: 'medium',
    speed: 'medium',
  },
  
  // Visual Analysis
  'gpt-4-vision': {
    provider: openai,
    model: 'gpt-4-vision-preview',
    strengths: ['visual_analysis', 'trend_spotting', 'creative_audit'],
    costTier: 'premium',
    speed: 'slow',
  },
  
  // Quick Iterations
  'llama-3.1-8b': {
    provider: groq,
    model: 'llama-3.1-8b-instant',
    strengths: ['quick_iteration', 'brainstorming', 'validation'],
    costTier: 'minimal',
    speed: 'instant',
  },
  
  // Gemini for multimodal
  'gemini-1.5-pro': {
    provider: google,
    model: 'gemini-1.5-pro-latest',
    strengths: ['multimodal', 'long_context', 'reasoning'],
    costTier: 'medium',
    speed: 'medium',
  },
};

// Task types
export type TaskType = 
  | 'cultural_analysis'
  | 'trend_detection'
  | 'creative_generation'
  | 'strategic_reasoning'
  | 'visual_analysis'
  | 'quick_iteration';

// Select best model for task
export function selectModel(taskType: TaskType, constraints?: {
  speed?: 'instant' | 'fast' | 'medium' | 'slow';
  cost?: 'minimal' | 'low' | 'medium' | 'high' | 'premium';
}) {
  // Find models matching the task
  const candidates = Object.entries(models).filter(([_, config]) =>
    config.strengths.includes(taskType)
  );

  // Apply constraints
  let filtered = candidates;
  
  if (constraints?.speed) {
    filtered = filtered.filter(([_, config]) => {
      const speedOrder = ['instant', 'fast', 'medium', 'slow'];
      return speedOrder.indexOf(config.speed) <= speedOrder.indexOf(constraints.speed!);
    });
  }
  
  if (constraints?.cost) {
    filtered = filtered.filter(([_, config]) => {
      const costOrder = ['minimal', 'low', 'medium', 'high', 'premium'];
      return costOrder.indexOf(config.costTier) <= costOrder.indexOf(constraints.cost!);
    });
  }

  // Return best match or fallback to first candidate
  return filtered[0] || candidates[0];
}

// High-level AI functions using Vercel AI SDK
export async function analyze(taskType: TaskType, {
  prompt,
  context,
  systemPrompt,
  constraints,
  stream = false,
}: {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  constraints?: Parameters<typeof selectModel>[1];
  stream?: boolean;
}) {
  const [modelKey, modelConfig] = selectModel(taskType, constraints);
  
  const messages = [
    ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
    { 
      role: 'user' as const, 
      content: context ? `${context}\n\n${prompt}` : prompt 
    },
  ];

  if (stream) {
    return streamText({
      model: modelConfig.provider(modelConfig.model),
      messages,
      temperature: 0.7,
      maxTokens: 4096,
    });
  }

  const result = await generateText({
    model: modelConfig.provider(modelConfig.model),
    messages,
    temperature: 0.7,
    maxTokens: 4096,
  });

  return {
    content: result.text,
    model: modelKey,
    usage: result.usage,
    finishReason: result.finishReason,
  };
}

// Structured output generation
export async function generateStructured<T>(
  taskType: TaskType,
  {
    prompt,
    schema,
    systemPrompt,
    constraints,
  }: {
    prompt: string;
    schema: z.ZodSchema<T>;
    systemPrompt?: string;
    constraints?: Parameters<typeof selectModel>[1];
  }
): Promise<T> {
  const [modelKey, modelConfig] = selectModel(taskType, constraints);
  
  const result = await generateObject({
    model: modelConfig.provider(modelConfig.model),
    schema,
    prompt,
    system: systemPrompt,
  });

  return result.object;
}

// Batch processing for efficiency
export async function analyzeBatch(
  tasks: Array<{
    type: TaskType;
    prompt: string;
    context?: string;
    constraints?: Parameters<typeof selectModel>[1];
  }>
) {
  return Promise.all(
    tasks.map(task => 
      analyze(task.type, {
        prompt: task.prompt,
        context: task.context,
        constraints: task.constraints,
      })
    )
  );
}

// Export system prompts
export const systemPrompts = {
  cultural_analysis: `You are an expert cultural analyst specializing in identifying cultural tensions, 
    movements, and ideological opportunities. Use frameworks from Douglas Holt, Grant McCracken, 
    and other cultural strategists to provide deep insights.`,
  
  trend_detection: `You are a trend forecaster and cultural analyst. Identify emerging patterns, 
    weak signals, and nascent movements before they hit mainstream. Think like a combination 
    of Faith Popcorn, Malcolm Gladwell, and a data scientist.`,
  
  creative_generation: `You are an award-winning creative director known for breakthrough campaigns. 
    Generate innovative, culturally resonant ideas that push boundaries while maintaining strategic focus. 
    Think like David Droga, Susan Hoffman, or Dan Wieden.`,
  
  strategic_reasoning: `You are a strategic advisor with expertise in business strategy, 
    market positioning, and competitive dynamics. Think like a McKinsey consultant combined 
    with a creative strategist.`,
  
  visual_analysis: `You are an expert in visual culture, design trends, and semiotics. 
    Analyze visual content for cultural signals, emerging aesthetics, and brand opportunities. 
    Consider color psychology, compositional trends, and symbolic meanings.`,
};