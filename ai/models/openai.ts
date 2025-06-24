/**
 * OpenAI Model Provider
 */

import OpenAI from 'openai';
import { ModelProvider, AITask, TaskResult } from '../orchestrator/types';

export class OpenAIProvider implements ModelProvider {
  name = 'openai';
  private client: OpenAI | null = null;
  private models = [
    'gpt-4-turbo',
    'gpt-4-turbo-2024-04-09',
    'gpt-4-vision-preview',
    'gpt-3.5-turbo',
  ];

  async initialize(): Promise<void> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set');
    }
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async execute(task: AITask, model: string): Promise<TaskResult> {
    if (!this.client) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      
      if (task.systemPrompt) {
        messages.push({ role: 'system', content: task.systemPrompt });
      } else {
        messages.push({ role: 'system', content: this.getDefaultSystemPrompt(task.type) });
      }

      // Handle vision tasks
      if (task.metadata?.images && model.includes('vision')) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: task.prompt },
            ...task.metadata.images.map((url: string) => ({
              type: 'image_url' as const,
              image_url: { url },
            })),
          ],
        });
      } else {
        messages.push({
          role: 'user',
          content: task.context ? `${task.context}\n\n${task.prompt}` : task.prompt,
        });
      }

      const response = await this.client.chat.completions.create({
        model,
        messages,
        max_tokens: task.constraints?.maxTokens || 4096,
        temperature: task.metadata?.temperature || 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage!;

      return {
        taskId: task.id || `openai-${Date.now()}`,
        model,
        provider: 'openai',
        content,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        },
        latency: Date.now() - startTime,
        cost: this.calculateCost(model, usage.total_tokens),
        confidence: this.estimateConfidence(response),
      };
    } catch (error: any) {
      throw new Error(`OpenAI execution failed: ${error.message}`);
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
      creative_generation: `You are an award-winning creative director known for breakthrough campaigns. 
        Generate innovative, culturally resonant ideas that push boundaries while maintaining strategic focus. 
        Think like David Droga, Susan Hoffman, or Dan Wieden.`,
      
      visual_analysis: `You are an expert in visual culture, design trends, and semiotics. 
        Analyze visual content for cultural signals, emerging aesthetics, and brand opportunities. 
        Consider color psychology, compositional trends, and symbolic meanings.`,
      
      trend_detection: `You are a trend forecaster and cultural analyst. Identify emerging patterns, 
        weak signals, and nascent movements before they hit mainstream. Think like a combination 
        of Faith Popcorn, Malcolm Gladwell, and a data scientist.`,
    };

    return prompts[taskType] || 'You are a helpful AI assistant with expertise in marketing and culture.';
  }

  private calculateCost(model: string, tokens: number): number {
    const costs: Record<string, number> = {
      'gpt-4-turbo': 10.0 / 1_000_000,
      'gpt-4-turbo-2024-04-09': 10.0 / 1_000_000,
      'gpt-4-vision-preview': 20.0 / 1_000_000,
      'gpt-3.5-turbo': 0.5 / 1_000_000,
    };

    return tokens * (costs[model] || 0);
  }

  private estimateConfidence(response: any): number {
    // Estimate based on model and response characteristics
    const choice = response.choices[0];
    if (choice.finish_reason === 'stop') {
      return 0.9; // Normal completion
    } else if (choice.finish_reason === 'length') {
      return 0.7; // Truncated
    }
    return 0.8;
  }
}