import { NextResponse } from 'next/server';
import { callDeepInfra, DEEPINFRA_MODELS } from '@/lib/ai/deepinfra';
import { generateEmbedding } from '@/lib/ai/deepinfra';

export async function GET() {
  try {
    console.log('Testing DeepInfra API...');
    
    // Test text generation
    const response = await callDeepInfra(
      DEEPINFRA_MODELS.LLAMA3.id,
      [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello in one word.' }
      ],
      { temperature: 0.7, max_tokens: 10 }
    );
    
    console.log('Text generation response:', response);
    
    // Test embedding generation
    const embedding = await generateEmbedding('Hello world');
    console.log('Embedding dimensions:', embedding.length);
    
    return NextResponse.json({
      success: true,
      textGeneration: response.choices?.[0]?.message?.content || 'No response',
      embeddingDimensions: embedding.length,
      models: DEEPINFRA_MODELS
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}