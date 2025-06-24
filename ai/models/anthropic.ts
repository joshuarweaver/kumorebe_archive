/**
 * Anthropic (Claude) Model Provider
 */

import Anthropic from '@anthropic-ai/sdk';
import { ModelProvider, AITask, TaskResult } from '../orchestrator/types';

export class AnthropicProvider implements ModelProvider {
  name = 'anthropic';
  private client: Anthropic | null = null;
  private models = [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ];

  async initialize(): Promise<void> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async execute(task: AITask, model: string): Promise<TaskResult> {
    if (!this.client) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      const response = await this.client!.messages.create({
        model,
        max_tokens: task.constraints?.maxTokens || 4096,
        temperature: task.metadata?.temperature || 0.7,
        system: task.systemPrompt || this.getDefaultSystemPrompt(task.type),
        messages: [
          {
            role: 'user',
            content: task.context ? `${task.context}\n\n${task.prompt}` : task.prompt,
          },
        ],
      });

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      return {
        taskId: task.id || `anthropic-${Date.now()}`,
        model,
        provider: 'anthropic',
        content,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        latency: Date.now() - startTime,
        cost: this.calculateCost(model, response.usage.input_tokens + response.usage.output_tokens),
        confidence: this.estimateConfidence(response),
      };
    } catch (error: any) {
      throw new Error(`Anthropic execution failed: ${error.message}`);
    }
  }

  validateModel(model: string): boolean {
    return this.models.includes(model);
  }

  getAvailableModels(): string[] {
    return [...this.models];
  }

  private getDefaultSystemPrompt(taskType: string): string {
    const prompts: Record<string, string> = {
      cultural_analysis: `You are an expert cultural analyst specializing in identifying cultural tensions, 
        movements, and ideological opportunities. Use frameworks from Douglas Holt, Grant McCracken, 
        and other cultural strategists to provide deep insights.`,
      
      strategic_reasoning: `You are a strategic advisor with expertise in business strategy, 
        market positioning, and competitive dynamics. Think like a McKinsey consultant combined 
        with a creative strategist.`,
      
      creative_generation: `You are a creative director at a top advertising agency. Generate 
        breakthrough creative concepts that are culturally relevant, strategically sound, and 
        designed to create cultural impact.`,
    };

    return prompts[taskType] || 'You are a helpful AI assistant.';
  }

  private calculateCost(model: string, tokens: number): number {
    const costs: Record<string, number> = {
      'claude-3-opus-20240229': 15.0 / 1_000_000,
      'claude-3-sonnet-20240229': 3.0 / 1_000_000,
      'claude-3-haiku-20240307': 0.25 / 1_000_000,
    };

    return tokens * (costs[model] || 0);
  }

  private estimateConfidence(response: any): number {
    // Simple confidence estimation based on response characteristics
    // In production, this could use more sophisticated methods
    return 0.85; // Claude typically has high confidence
  }
}