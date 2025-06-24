'use client';

import { TrendingUp, Target, BarChart3, Activity, Award, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface KPI {
  name: string;
  definition: string;
  current: number;
  target: number;
  benchmark: number;
  unit: string;
  category: 'awareness' | 'engagement' | 'conversion' | 'loyalty';
  importance: 'critical' | 'high' | 'medium';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface EnhancedKPIsProps {
  northStarMetric: {
    name: string;
    value: number;
    target: number;
    description: string;
  };
  kpis?: KPI[];
}

export default function EnhancedKPIs({ northStarMetric, kpis }: EnhancedKPIsProps) {
  // Default comprehensive KPI framework
  const defaultKPIs: KPI[] = [
    {
      name: "Brand Awareness Lift",
      definition: "Percentage increase in unaided brand recall among target audience",
      current: 23,
      target: 35,
      benchmark: 18,
      unit: "%",
      category: "awareness",
      importance: "critical",
      trend: "up",
      description: "Measures top-of-mind brand presence in category consideration set"
    },
    {
      name: "Engagement Rate",
      definition: "Average interaction rate across all campaign touchpoints",
      current: 8.7,
      target: 12,
      benchmark: 4.5,
      unit: "%",
      category: "engagement",
      importance: "high",
      trend: "up",
      description: "Indicates content resonance and audience participation quality"
    },
    {
      name: "Conversion Rate",
      definition: "Percentage of engaged users completing desired campaign action",
      current: 3.2,
      target: 5,
      benchmark: 2.8,
      unit: "%",
      category: "conversion",
      importance: "critical",
      trend: "stable",
      description: "Direct measure of campaign effectiveness in driving behavior change"
    },
    {
      name: "Net Promoter Score",
      definition: "Likelihood of campaign participants to recommend brand (0-100)",
      current: 67,
      target: 75,
      benchmark: 45,
      unit: "pts",
      category: "loyalty",
      importance: "high",
      trend: "up",
      description: "Long-term brand advocacy and word-of-mouth potential"
    }
  ];

  const displayKPIs = kpis || defaultKPIs;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#999',
        borderColor: '#333',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#999',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#999',
        },
      },
    },
  };

  const performanceData = {
    labels: displayKPIs.map(kpi => kpi.name),
    datasets: [
      {
        label: 'Current',
        data: displayKPIs.map(kpi => kpi.current),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Target',
        data: displayKPIs.map(kpi => kpi.target),
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1,
      },
      {
        label: 'Benchmark',
        data: displayKPIs.map(kpi => kpi.benchmark),
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'rgba(156, 163, 175, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const getImportanceColor = (importance: string) => {
    switch(importance) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-yellow-400 bg-yellow-500/10';
      case 'medium': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-neutral-400 bg-neutral-500/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light mb-4">KPI Framework & Success Metrics</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Comprehensive measurement framework with industry benchmarks and strategic targets
        </p>
      </div>

      {/* North Star Metric */}
      <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-8 border border-green-500/30 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-2xl font-medium">North Star Metric</h3>
              <p className="text-neutral-400">{northStarMetric.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light text-green-400">{northStarMetric.value}%</p>
            <p className="text-sm text-neutral-400">Target: {northStarMetric.target}%</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-neutral-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(northStarMetric.value / northStarMetric.target) * 100}%` }}
            />
          </div>
          <p className="text-sm text-neutral-300 mt-3">{northStarMetric.description}</p>
        </div>
      </div>

      {/* Performance Overview Chart */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          Performance Overview
        </h3>
        <div className="h-64">
          <Bar options={chartOptions} data={performanceData} />
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-neutral-400">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-neutral-400">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-neutral-500 rounded"></div>
            <span className="text-sm text-neutral-400">Industry Benchmark</span>
          </div>
        </div>
      </div>

      {/* Detailed KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayKPIs.map((kpi, index) => {
          const performanceRatio = (kpi.current / kpi.target) * 100;
          const benchmarkComparison = ((kpi.current - kpi.benchmark) / kpi.benchmark) * 100;
          
          return (
            <div key={index} className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all">
              {/* KPI Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-medium flex items-center gap-2">
                    {kpi.name}
                    <button className="text-neutral-500 hover:text-neutral-300">
                      <Info className="w-4 h-4" />
                    </button>
                  </h4>
                  <p className="text-sm text-neutral-400 mt-1">{kpi.definition}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-xs px-2 py-1 rounded ${getImportanceColor(kpi.importance)}`}>
                    {kpi.importance}
                  </span>
                </div>
              </div>

              {/* Metrics Display */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Current</p>
                  <p className="text-2xl font-light">{kpi.current}{kpi.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Target</p>
                  <p className="text-xl text-blue-400">{kpi.target}{kpi.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Benchmark</p>
                  <p className="text-xl text-neutral-400">{kpi.benchmark}{kpi.unit}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                  <span>Progress to Target</span>
                  <span>{performanceRatio.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      performanceRatio >= 100 ? 'bg-green-500' :
                      performanceRatio >= 75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(performanceRatio, 100)}%` }}
                  />
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-2 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-sm">
                  {benchmarkComparison > 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        {benchmarkComparison.toFixed(0)}% above industry benchmark
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">
                        {Math.abs(benchmarkComparison).toFixed(0)}% below industry benchmark
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-neutral-400">{kpi.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Criteria */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" />
          Campaign Success Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-400">Minimum Success</h4>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Meet 80% of KPI targets</li>
              <li>• Exceed industry benchmarks</li>
              <li>• Positive sentiment > 70%</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-yellow-400">Target Success</h4>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Achieve 100% of KPI targets</li>
              <li>• 25% above benchmarks</li>
              <li>• Viral coefficient > 1.5</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-400">Breakthrough Success</h4>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Exceed targets by 20%+</li>
              <li>• Category-leading metrics</li>
              <li>• Cultural moment creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}