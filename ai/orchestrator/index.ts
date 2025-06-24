/**
 * Multi-Model Orchestration System
 * Routes tasks to optimal AI models based on capability, cost, and speed
 */

import { ModelCapability, AITask, ModelProvider, TaskType } from './types';
import { AnthropicProvider } from '../models/anthropic';
import { OpenAIProvider } from '../models/openai';
import { GroqProvider } from '../models/groq';
import { DeepInfraProvider } from '../models/deepinfra';

export class ModelOrchestrator {
  private providers: Map<string, ModelProvider>;
  private capabilities: ModelCapability[];
  private performanceHistory: Map<string, PerformanceMetrics>;

  constructor() {
    this.providers = new Map();
    this.capabilities = [];
    this.performanceHistory = new Map();
    this.initializeProviders();
    this.loadCapabilities();
  }

  private initializeProviders() {
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('groq', new GroqProvider());
    this.providers.set('deepinfra', new DeepInfraProvider());
  }

  private loadCapabilities() {
    this.capabilities = [
      // Cultural Analysis - Needs nuance
      {
        model: 'claude-3-opus-20240229',
        provider: 'anthropic',
        strengths: ['cultural_analysis', 'nuanced_reasoning', 'long_context'],
        costPerMillion: 15.0,
        averageLatency: 2000,
        maxTokens: 200000,
        contextWindow: 200000,
      },
      
      // Real-time Trend Detection - Needs speed
      {
        model: 'llama-3.3-70b-versatile',
        provider: 'groq',
        strengths: ['trend_detection', 'real_time', 'pattern_recognition'],
        costPerMillion: 0.59,
        averageLatency: 300,
        maxTokens: 8000,
        contextWindow: 32768,
      },
      
      // Creative Generation - Needs diversity
      {
        model: 'gpt-4-turbo',
        provider: 'openai',
        strengths: ['creative_generation', 'ideation', 'storytelling'],
        costPerMillion: 10.0,
        averageLatency: 1500,
        maxTokens: 4096,
        contextWindow: 128000,
      },
      
      // Strategic Reasoning - Needs depth
      {
        model: 'deepseek-r1',
        provider: 'deepinfra',
        strengths: ['strategic_reasoning', 'logical_analysis', 'planning'],
        costPerMillion: 2.0,
        averageLatency: 1000,
        maxTokens: 4096,
        contextWindow: 32768,
      },
      
      // Visual Analysis
      {
        model: 'gpt-4-vision-preview',
        provider: 'openai',
        strengths: ['visual_analysis', 'trend_spotting', 'creative_audit'],
        costPerMillion: 20.0,
        averageLatency: 2500,
        maxTokens: 4096,
        contextWindow: 128000,
      },
      
      // Quick Iterations - Ultra fast
      {
        model: 'llama-3.1-8b-instant',
        provider: 'groq',
        strengths: ['quick_iteration', 'brainstorming', 'validation'],
        costPerMillion: 0.05,
        averageLatency: 100,
        maxTokens: 8000,
        contextWindow: 32768,
      },
    ];
  }

  /**
   * Route a task to the optimal model
   */
  async route(task: AITask): Promise<ModelCapability> {
    // Find models that match the task type
    const candidates = this.capabilities.filter(cap => 
      cap.strengths.includes(task.type) || 
      cap.strengths.some(s => this.isCompatibleStrength(s, task.type))
    );

    if (candidates.length === 0) {
      throw new Error(`No model available for task type: ${task.type}`);
    }

    // Score candidates based on constraints
    const scored = candidates.map(cap => ({
      capability: cap,
      score: this.scoreModel(cap, task),
    }));

    // Sort by score (higher is better)
    scored.sort((a, b) => b.score - a.score);

    return scored[0].capability;
  }

  /**
   * Execute a task with automatic model selection
   */
  async execute(task: AITask): Promise<any> {
    const capability = await this.route(task);
    const provider = this.providers.get(capability.provider);
    
    if (!provider) {
      throw new Error(`Provider ${capability.provider} not initialized`);
    }

    const startTime = Date.now();
    
    try {
      const result = await provider.execute(task, capability.model);
      
      // Track performance
      this.trackPerformance(capability, Date.now() - startTime, true);
      
      return result;
    } catch (error) {
      // Track failure
      this.trackPerformance(capability, Date.now() - startTime, false);
      
      // Try fallback
      return this.executeFallback(task, capability.model, error);
    }
  }

  /**
   * Fallback to alternative model on failure
   */
  private async executeFallback(task: AITask, failedModel: string, error: any): Promise<any> {
    const candidates = this.capabilities.filter(cap => 
      cap.model !== failedModel &&
      (cap.strengths.includes(task.type) || 
       cap.strengths.some(s => this.isCompatibleStrength(s, task.type)))
    );

    if (candidates.length === 0) {
      throw new Error(`Task failed and no fallback available: ${error.message}`);
    }

    // Use the next best model
    const fallback = candidates[0];
    const provider = this.providers.get(fallback.provider);
    
    if (!provider) {
      throw error; // Re-throw original error
    }

    console.log(`Falling back from ${failedModel} to ${fallback.model}`);
    return provider.execute(task, fallback.model);
  }

  /**
   * Score a model for a given task
   */
  private scoreModel(capability: ModelCapability, task: AITask): number {
    let score = 100;

    // Latency constraint
    if (task.constraints?.maxLatency) {
      if (capability.averageLatency > task.constraints.maxLatency) {
        score -= 50; // Heavy penalty
      } else {
        // Bonus for being faster
        score += (task.constraints.maxLatency - capability.averageLatency) / 100;
      }
    }

    // Cost constraint
    if (task.constraints?.maxCostPerMillion) {
      if (capability.costPerMillion > task.constraints.maxCostPerMillion) {
        score -= 30;
      } else {
        // Bonus for being cheaper
        score += (task.constraints.maxCostPerMillion - capability.costPerMillion);
      }
    }

    // Token requirement
    if (task.estimatedTokens && capability.maxTokens < task.estimatedTokens) {
      score -= 40; // Can't handle the task
    }

    // Performance history bonus
    const metrics = this.performanceHistory.get(capability.model);
    if (metrics) {
      score += metrics.successRate * 20; // Up to 20 point bonus
    }

    // Strength match bonus
    if (capability.strengths.includes(task.type)) {
      score += 30; // Direct match
    }

    return score;
  }

  /**
   * Check if a strength is compatible with a task type
   */
  private isCompatibleStrength(strength: string, taskType: TaskType): boolean {
    const compatibilityMap: Record<string, TaskType[]> = {
      'nuanced_reasoning': ['cultural_analysis', 'strategic_reasoning'],
      'pattern_recognition': ['trend_detection', 'viral_analysis'],
      'ideation': ['creative_generation', 'concept_development'],
      'logical_analysis': ['strategic_reasoning', 'risk_assessment'],
    };

    return compatibilityMap[strength]?.includes(taskType) || false;
  }

  /**
   * Track model performance for optimization
   */
  private trackPerformance(capability: ModelCapability, latency: number, success: boolean) {
    const key = capability.model;
    const existing = this.performanceHistory.get(key) || {
      totalCalls: 0,
      successfulCalls: 0,
      totalLatency: 0,
      successRate: 1.0,
      averageLatency: capability.averageLatency,
    };

    existing.totalCalls++;
    if (success) existing.successfulCalls++;
    existing.totalLatency += latency;
    existing.successRate = existing.successfulCalls / existing.totalCalls;
    existing.averageLatency = existing.totalLatency / existing.totalCalls;

    this.performanceHistory.set(key, existing);
  }

  /**
   * Get performance metrics for monitoring
   */
  getPerformanceMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.performanceHistory);
  }

  /**
   * Optimize routing based on constraints
   */
  optimize(constraints: { budget?: number; latency?: number }) {
    // Re-sort capabilities based on constraints
    if (constraints.budget) {
      this.capabilities.sort((a, b) => a.costPerMillion - b.costPerMillion);
    }
    if (constraints.latency) {
      this.capabilities.sort((a, b) => a.averageLatency - b.averageLatency);
    }
  }
}

interface PerformanceMetrics {
  totalCalls: number;
  successfulCalls: number;
  totalLatency: number;
  successRate: number;
  averageLatency: number;
}

// Export singleton instance
export const orchestrator = new ModelOrchestrator();