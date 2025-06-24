/**
 * Type definitions for the AI orchestration system
 */

export type TaskType = 
  | 'cultural_analysis'
  | 'trend_detection'
  | 'creative_generation'
  | 'strategic_reasoning'
  | 'visual_analysis'
  | 'quick_iteration'
  | 'concept_development'
  | 'viral_analysis'
  | 'risk_assessment'
  | 'performance_prediction';

export type ModelProvider = 'anthropic' | 'openai' | 'groq' | 'deepinfra' | 'perplexity';

export interface ModelCapability {
  model: string;
  provider: ModelProvider;
  strengths: string[];
  costPerMillion: number;
  averageLatency: number; // milliseconds
  maxTokens: number;
  contextWindow: number;
}

export interface AITask {
  id?: string;
  type: TaskType;
  prompt: string;
  context?: string;
  systemPrompt?: string;
  estimatedTokens?: number;
  constraints?: TaskConstraints;
  metadata?: Record<string, any>;
}

export interface TaskConstraints {
  maxLatency?: number; // milliseconds
  maxCostPerMillion?: number;
  minConfidence?: number; // 0-1
  requiresVision?: boolean;
  preferredProvider?: ModelProvider;
}

export interface TaskResult {
  taskId: string;
  model: string;
  provider: ModelProvider;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
  cost: number;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface ModelProvider {
  name: string;
  initialize(): Promise<void>;
  execute(task: AITask, model: string): Promise<TaskResult>;
  validateModel(model: string): boolean;
  getAvailableModels(): string[];
}