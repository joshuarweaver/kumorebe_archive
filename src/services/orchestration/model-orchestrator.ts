import { ModelTask, ModelResponse, ModelConfig } from '@/types/models';
import { callDeepInfra, DEEPINFRA_MODELS } from '@/lib/ai/deepinfra';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { getCachedData, setCachedData } from '@/lib/cache/redis';

export class ModelOrchestrator {
  private taskQueue: ModelTask[] = [];
  private processing = false;

  async executeTask(task: ModelTask): Promise<ModelResponse> {
    this.taskQueue.push(task);
    return this.processQueue();
  }

  async executeBatch(tasks: ModelTask[]): Promise<ModelResponse[]> {
    this.taskQueue.push(...tasks);
    const results = await Promise.all(
      tasks.map(() => this.processQueue())
    );
    return results;
  }

  private async processQueue(): Promise<ModelResponse> {
    if (this.processing || this.taskQueue.length === 0) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(this.processQueue()), 100);
      });
    }

    this.processing = true;
    const task = this.taskQueue.shift()!;
    
    try {
      const response = await this.executeModelTask(task);
      this.processing = false;
      return response;
    } catch (error) {
      this.processing = false;
      throw error;
    }
  }

  private async executeModelTask(task: ModelTask): Promise<ModelResponse> {
    const cacheKey = `model:${task.id}`;
    const cached = await getCachedData<ModelResponse>(cacheKey);
    if (cached) return cached;

    const startTime = Date.now();
    let output: any;

    switch (task.modelConfig.provider) {
      case 'deepinfra':
        output = await this.executeDeepInfra(task);
        break;
      case 'groq':
        output = await this.executeGroq(task);
        break;
      default:
        throw new Error(`Unknown provider: ${task.modelConfig.provider}`);
    }

    const response: ModelResponse = {
      taskId: task.id,
      output,
      model: task.modelConfig.model,
      processingTime: Date.now() - startTime,
      confidence: this.calculateConfidence(task, output),
    };

    await setCachedData(cacheKey, response, 1800);
    return response;
  }

  private async executeDeepInfra(task: ModelTask): Promise<any> {
    const response = await callDeepInfra(
      task.modelConfig.model,
      [
        { role: 'system', content: task.modelConfig.systemPrompt || '' },
        { role: 'user', content: JSON.stringify(task.input) }
      ],
      {
        temperature: task.modelConfig.temperature,
        max_tokens: task.modelConfig.maxTokens,
      }
    );
    return response.choices[0]?.message?.content;
  }

  private async executeGroq(task: ModelTask): Promise<any> {
    const response = await callGroq(
      task.modelConfig.model,
      [
        { role: 'system', content: task.modelConfig.systemPrompt || '' },
        { role: 'user', content: JSON.stringify(task.input) }
      ],
      {
        temperature: task.modelConfig.temperature,
        max_tokens: task.modelConfig.maxTokens,
      }
    );
    return response.choices[0]?.message?.content;
  }

  private calculateConfidence(task: ModelTask, output: any): number {
    let confidence = 0.7;

    if (task.type === 'cultural-analysis' && task.modelConfig.model.includes('deepseek')) {
      confidence += 0.15;
    }

    if (task.type === 'trend-detection' && task.modelConfig.provider === 'groq') {
      confidence += 0.1;
    }

    if (output && output.length > 500) {
      confidence += 0.05;
    }

    return Math.min(confidence, 0.95);
  }

  selectOptimalModel(taskType: ModelTask['type']): ModelConfig {
    switch (taskType) {
      case 'cultural-analysis':
      case 'strategic-reasoning':
        return {
          provider: 'deepinfra',
          model: DEEPINFRA_MODELS.DEEPSEEK_R1.id,
          temperature: 0.7,
          maxTokens: 2500,
        };
      
      case 'creative-generation':
        return {
          provider: 'deepinfra',
          model: DEEPINFRA_MODELS.QWEN3.id,
          temperature: 0.9,
          maxTokens: 3000,
        };
      
      case 'trend-detection':
        return {
          provider: 'groq',
          model: GROQ_MODELS.LLAMA_70B.id,
          temperature: 0.6,
          maxTokens: 1500,
        };
      
      case 'pattern-recognition':
        return {
          provider: 'groq',
          model: GROQ_MODELS.GEMMA2.id,
          temperature: 0.5,
          maxTokens: 2000,
        };
      
      default:
        return {
          provider: 'deepinfra',
          model: DEEPINFRA_MODELS.LLAMA3.id,
          temperature: 0.7,
          maxTokens: 2000,
        };
    }
  }
}