import { NextRequest, NextResponse } from 'next/server';
import { callDeepInfra, DEEPINFRA_MODELS } from '@/lib/ai/deepinfra';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';
import { ModelTask, ModelResponse } from '@/types/models';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/cache/redis';

export async function POST(request: NextRequest) {
  try {
    const task: ModelTask = await request.json();
    
    const cacheKey = `${CACHE_KEYS.MODEL_CACHE}:${task.id}`;
    const cached = await getCachedData<ModelResponse>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const startTime = Date.now();
    let output: any;

    switch (task.modelConfig.provider) {
      case 'deepinfra':
        const deepinfraResponse = await callDeepInfra(
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
        output = deepinfraResponse.choices[0]?.message?.content;
        break;

      case 'groq':
        const groqResponse = await callGroq(
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
        output = groqResponse.choices[0]?.message?.content;
        break;

      default:
        throw new Error(`Unsupported provider: ${task.modelConfig.provider}`);
    }

    const response: ModelResponse = {
      taskId: task.id,
      output,
      model: task.modelConfig.model,
      processingTime: Date.now() - startTime,
    };

    await setCachedData(cacheKey, response, CACHE_TTL.MODEL_CACHE);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Model orchestration error:', error);
    return NextResponse.json(
      { error: 'Failed to process model task' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const models = {
    deepinfra: DEEPINFRA_MODELS,
    groq: GROQ_MODELS,
  };

  return NextResponse.json(models);
}