import { NextResponse } from 'next/server';
import { ConventionViolationEngine } from '@/services/engines/convention-violation';

export async function GET() {
  try {
    console.log('Testing Convention Violation Engine...');
    const conventionEngine = new ConventionViolationEngine();
    
    console.log('Mapping industry conventions...');
    const conventions = await conventionEngine.mapIndustryConventions('technology');
    
    console.log('Conventions found:', conventions);
    
    return NextResponse.json({
      success: true,
      conventions: conventions.length,
      data: conventions
    });
  } catch (error) {
    console.error('Convention engine error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}