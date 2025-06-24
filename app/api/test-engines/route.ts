import { NextResponse } from 'next/server';
import { CulturalStrategyEngine } from '@/services/engines/cultural-strategy';
import { RealTimeTrendEngine } from '@/services/engines/real-time-trend';
import { ConventionViolationEngine } from '@/services/engines/convention-violation';

export async function GET() {
  const results: any = {};
  
  try {
    console.log('Testing Cultural Strategy Engine...');
    const culturalEngine = new CulturalStrategyEngine();
    const culturalInsights = await culturalEngine.analyzeCulturalTensions(
      'TestBrand',
      'technology',
      'Gen Z'
    );
    results.cultural = { success: true, insights: culturalInsights.length };
  } catch (error) {
    console.error('Cultural engine error:', error);
    results.cultural = { success: false, error: error instanceof Error ? error.message : 'Unknown' };
  }
  
  try {
    console.log('Testing Convention Violation Engine...');
    const conventionEngine = new ConventionViolationEngine();
    const conventions = await conventionEngine.mapIndustryConventions('technology');
    results.conventions = { success: true, count: conventions.length };
  } catch (error) {
    console.error('Convention engine error:', error);
    results.conventions = { success: false, error: error instanceof Error ? error.message : 'Unknown' };
  }
  
  try {
    console.log('Testing Real-time Trend Engine...');
    const trendEngine = new RealTimeTrendEngine();
    const trends = await trendEngine.detectEmergingTrends(
      'technology',
      'TestBrand',
      'realtime'
    );
    results.trends = { success: true, count: trends.length };
  } catch (error) {
    console.error('Trend engine error:', error);
    results.trends = { success: false, error: error instanceof Error ? error.message : 'Unknown' };
  }
  
  return NextResponse.json(results);
}