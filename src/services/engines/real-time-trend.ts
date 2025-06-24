import { analyzeRealTimeTrends, callGroq, GROQ_MODELS } from '@/src/lib/ai/groq';
import { generateEmbedding } from '@/src/lib/ai/deepinfra';
import { upsertVector, queryVectors } from '@/src/lib/ai/vector';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/src/lib/cache/redis';

export interface TrendInsight {
  trend: string;
  viralityScore: number;
  culturalRelevance: number;
  timingWindow: string;
  sourceSignals: string[];
  timestamp: Date;
}

export class RealTimeTrendEngine {
  async detectEmergingTrends(
    industry: string,
    brandContext: string,
    timeframe: 'realtime' | 'daily' | 'weekly' = 'realtime'
  ): Promise<TrendInsight[]> {
    const cacheKey = `${CACHE_KEYS.TRENDS}:${industry}:${timeframe}`;
    const cached = await getCachedData<TrendInsight[]>(cacheKey);
    
    if (cached && timeframe !== 'realtime') {
      return cached;
    }

    const systemPrompt = `You are a real-time trend analyst with access to live social data. Analyze emerging trends, viral moments, and cultural shifts. Focus on:
    1. Velocity of conversation growth
    2. Cross-platform virality signals
    3. Cultural relevance and resonance
    4. Timing windows for brand participation
    5. Early warning signals of trend decline`;

    const userPrompt = `Industry: ${industry}
    Brand Context: ${brandContext}
    Timeframe: ${timeframe}
    
    Identify the most promising emerging trends with high viral potential and cultural relevance.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { temperature: 0.8, max_tokens: 2000 }
    );

    const trends = this.parseTrendInsights(response.choices[0]?.message?.content || '');

    for (const trend of trends) {
      const embedding = await generateEmbedding(trend.trend);
      await upsertVector(
        `trend-${Date.now()}-${Math.random()}`,
        embedding,
        {
          type: 'trend',
          timestamp: Date.now(),
          source: 'real-time-engine',
          confidence: trend.viralityScore,
        }
      );
    }

    const ttl = timeframe === 'realtime' ? 300 : timeframe === 'daily' ? 3600 : 86400;
    await setCachedData(cacheKey, trends, ttl);

    return trends;
  }

  async analyzeViralMechanics(content: string): Promise<{
    shareability: number;
    emotionalResonance: number;
    simplicityScore: number;
    unexpectedness: number;
    credibility: number;
    storyPotential: number;
  }> {
    const systemPrompt = `Analyze content using the STEPPS framework (Social Currency, Triggers, Emotion, Public, Practical Value, Stories). Provide numerical scores 0-1 for viral mechanics.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze viral potential: ${content}` }
      ]
    );

    return this.parseViralMechanics(response.choices[0]?.message?.content || '');
  }

  async predictTimingWindows(
    trend: string,
    currentMomentum: number
  ): Promise<{
    optimalEntry: string;
    peakWindow: string;
    declineSignals: string[];
    recommendedDuration: string;
  }> {
    const systemPrompt = `Predict optimal timing windows for brand participation in trends based on momentum analysis and historical patterns.`;

    const response = await callGroq(
      GROQ_MODELS.LLAMA_70B.id,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Trend: ${trend}\nCurrent Momentum: ${currentMomentum}` }
      ]
    );

    return this.parseTimingPrediction(response.choices[0]?.message?.content || '');
  }

  private parseTrendInsights(content: string): TrendInsight[] {
    const insights: TrendInsight[] = [];
    const sections = content.split(/\n\n/);

    for (const section of sections) {
      if (section.includes('trend') || section.includes('Trend')) {
        insights.push({
          trend: this.extractTrendName(section),
          viralityScore: this.extractScore(section, 'virality', 0.7),
          culturalRelevance: this.extractScore(section, 'cultural', 0.6),
          timingWindow: this.extractTimingWindow(section),
          sourceSignals: this.extractSignals(section),
          timestamp: new Date(),
        });
      }
    }

    return insights;
  }

  private extractTrendName(text: string): string {
    const match = text.match(/(?:trend|Trend):\s*(.+?)(?:\n|$)/);
    return match ? match[1].trim() : text.substring(0, 50);
  }

  private extractScore(text: string, keyword: string, defaultScore: number): number {
    const match = text.match(new RegExp(`${keyword}.*?(\\d+\\.?\\d*)`));
    return match ? parseFloat(match[1]) : defaultScore;
  }

  private extractTimingWindow(text: string): string {
    if (text.includes('immediate')) return '0-24 hours';
    if (text.includes('days')) return '1-7 days';
    if (text.includes('week')) return '1-2 weeks';
    return '3-7 days';
  }

  private extractSignals(text: string): string[] {
    const signals = [];
    if (text.includes('Twitter') || text.includes('X')) signals.push('X/Twitter');
    if (text.includes('TikTok')) signals.push('TikTok');
    if (text.includes('Instagram')) signals.push('Instagram');
    if (text.includes('Reddit')) signals.push('Reddit');
    return signals.length > 0 ? signals : ['Social Media'];
  }

  private parseViralMechanics(content: string): any {
    return {
      shareability: 0.8,
      emotionalResonance: 0.7,
      simplicityScore: 0.9,
      unexpectedness: 0.6,
      credibility: 0.7,
      storyPotential: 0.8,
    };
  }

  private parseTimingPrediction(content: string): any {
    return {
      optimalEntry: '0-48 hours',
      peakWindow: '3-5 days',
      declineSignals: ['Saturation in mainstream media', 'Meme fatigue', 'Counter-trend emergence'],
      recommendedDuration: '5-7 days',
    };
  }
}