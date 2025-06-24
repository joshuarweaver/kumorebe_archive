// Formatting utilities for numbers and metrics

export function formatMetricValue(value: number, unit?: string): string {
  // Determine the format based on the value and unit
  if (unit === '%') {
    return `${value}%`;
  }
  
  if (unit === 'pts' || unit === 'points') {
    return `${value} ${unit}`;
  }
  
  // For large numbers, add appropriate formatting
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toLocaleString();
  }
}

export function formatFullNumber(value: number): string {
  return value.toLocaleString();
}

export function detectMetricFormat(metricName: string, value: number): { formattedValue: string; unit: string } {
  const name = metricName.toLowerCase();
  
  // Percentage metrics
  if (name.includes('rate') || name.includes('percentage') || name.includes('%') || name.includes('lift')) {
    return { formattedValue: `${value}%`, unit: '%' };
  }
  
  // Score metrics
  if (name.includes('score') || name.includes('nps') || name.includes('index')) {
    return { formattedValue: value.toString(), unit: 'pts' };
  }
  
  // Volume metrics
  if (name.includes('reach') || name.includes('impressions') || name.includes('views') || 
      name.includes('users') || name.includes('participants') || name.includes('engagement')) {
    if (value >= 1000000) {
      return { formattedValue: `${(value / 1000000).toFixed(1)}M`, unit: '' };
    } else if (value >= 1000) {
      return { formattedValue: `${(value / 1000).toFixed(1)}K`, unit: '' };
    }
    return { formattedValue: value.toLocaleString(), unit: '' };
  }
  
  // Time metrics
  if (name.includes('time') || name.includes('duration')) {
    return { formattedValue: value.toString(), unit: 'min' };
  }
  
  // Default: assume it's a volume metric
  return { formattedValue: formatMetricValue(value), unit: '' };
}

export function formatMetricName(name: string): string {
  // Add spaces between camelCase words
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/(\d+)([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d+)/g, '$1 $2');
}