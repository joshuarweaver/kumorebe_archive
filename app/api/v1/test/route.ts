import { NextRequest, NextResponse } from 'next/server';
import { analyze, models, systemPrompts } from '@/ai/client';

export async function GET() {
  return NextResponse.json({
    message: 'AI Gateway Test Endpoint',
    availableModels: Object.keys(models),
    usage: 'POST /api/v1/test with { prompt: string, taskType?: string }'
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, taskType = 'quick_iteration' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Testing AI Gateway with:', { taskType, prompt });

    const result = await analyze(taskType as any, {
      prompt,
      systemPrompt: systemPrompts[taskType as keyof typeof systemPrompts],
      constraints: { speed: 'fast', cost: 'low' }
    });

    return NextResponse.json({
      success: true,
      result: result.content,
      model: result.model,
      usage: result.usage,
    });

  } catch (error: any) {
    console.error('AI Gateway test error:', error);
    return NextResponse.json(
      { 
        error: 'AI Gateway test failed', 
        details: error.message,
        hint: 'Check your VERCEL_AI_GATEWAY_API_KEY and AI_GATEWAY_URL env vars'
      },
      { status: 500 }
    );
  }
}