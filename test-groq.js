import { callGroq, GROQ_MODELS } from './src/lib/ai/groq.js';

async function testGroq() {
  try {
    console.log('Testing Groq API...');
    console.log('Model:', GROQ_MODELS.GEMMA2.id);
    
    const response = await callGroq(
      GROQ_MODELS.GEMMA2.id,
      [
        { role: 'system', content: 'You are a helpful assistant. Respond with a short greeting.' },
        { role: 'user', content: 'Hello!' }
      ],
      { temperature: 0.7, max_tokens: 100 }
    );
    
    console.log('Response:', response);
    console.log('Content:', response.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

testGroq();