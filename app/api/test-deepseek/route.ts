import { NextResponse } from 'next/server';
import { callDeepInfra, DEEPINFRA_MODELS } from '@/lib/ai/deepinfra';

export async function GET() {
  try {
    console.log('Testing DeepSeek R1 model:', DEEPINFRA_MODELS.DEEPSEEK_R1.id);
    
    const response = await callDeepInfra(
      DEEPINFRA_MODELS.DEEPSEEK_R1.id,
      [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello.' }
      ],
      { temperature: 0.7, max_tokens: 10 }
    );
    
    return NextResponse.json({
      success: true,
      model: DEEPINFRA_MODELS.DEEPSEEK_R1.id,
      response: response
    });
  } catch (error) {
    console.error('DeepSeek error:', error);
    return NextResponse.json(
      { 
        success: false,
        model: DEEPINFRA_MODELS.DEEPSEEK_R1.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}