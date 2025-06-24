import { NextResponse } from 'next/server';
import { createTables } from '@/src/lib/db/neon';

export async function GET() {
  try {
    await createTables();
    
    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully',
      tables: [
        'campaigns',
        'campaign_vectors',
        'knowledge_nodes',
        'relationships',
        'pattern_library'
      ]
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize database',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}