export interface ModelConfig {
  provider: 'deepinfra' | 'groq' | 'openai';
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ModelTask {
  id: string;
  type: 'cultural-analysis' | 'trend-detection' | 'strategic-reasoning' | 'creative-generation' | 'pattern-recognition';
  input: any;
  modelConfig: ModelConfig;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface ModelResponse {
  taskId: string;
  output: any;
  model: string;
  processingTime: number;
  confidence?: number;
}