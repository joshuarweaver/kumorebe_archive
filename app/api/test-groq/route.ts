import { NextResponse } from 'next/server';
import { callGroq, GROQ_MODELS } from '@/lib/ai/groq';

export async function GET() {
  try {
    console.log('Testing Groq API...');
    
    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello in one word.' }
      ],
      { temperature: 0.7, max_tokens: 10 }
    );
    
    return NextResponse.json({
      success: true,
      model: GROQ_MODELS.LLAMA_70B.id,
      response: response.choices[0]?.message?.content || 'No response'
    });
  } catch (error) {
    console.error('Groq error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}