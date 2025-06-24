'use client';

import { TrendingUp, Target, BarChart3, Activity, Award, Info, ArrowUp, Milestone, Flag } from 'lucide-react';
import { formatMetricValue, detectMetricFormat } from './utils/formatting';
import { ChartContainer, ChartTooltip } from './ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
} from 'recharts';

interface KPI {
  name: string;
  definition: string;
  target: number;
  benchmark: number;
  unit: string;
  category: 'awareness' | 'engagement' | 'conversion' | 'loyalty';
  importance: 'critical' | 'high' | 'medium';
  description: string;
}

interface Milestone {
  name: string;
  target: number;
  timeframe: string;
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
      target: 35,
      benchmark: 18,
      unit: "%",
      category: "awareness",
      importance: "critical",
      description: "Measures top-of-mind brand presence in category consideration set"
    },
    {
      name: "Engagement Rate",
      definition: "Average interaction rate across all campaign touchpoints",
      target: 12,
      benchmark: 4.5,
      unit: "%",
      category: "engagement",
      importance: "high",
      description: "Indicates content resonance and audience participation quality"
    },
    {
      name: "Conversion Rate",
      definition: "Percentage of engaged users completing desired campaign action",
      target: 5,
      benchmark: 2.8,
      unit: "%",
      category: "conversion",
      importance: "critical",
      description: "Direct measure of campaign effectiveness in driving behavior change"
    },
    {
      name: "Net Promoter Score",
      definition: "Likelihood of campaign participants to recommend brand (0-100)",
      target: 75,
      benchmark: 45,
      unit: "pts",
      category: "loyalty",
      importance: "high",
      description: "Long-term brand advocacy and word-of-mouth potential"
    }
  ];

  const displayKPIs = kpis || defaultKPIs;

  // Detect format for North Star Metric
  const nsFormat = detectMetricFormat(northStarMetric.name, northStarMetric.target);
  
  // Generate roadmap milestones for North Star Metric
  const generateRoadmap = () => {
    const totalTarget = northStarMetric.target;
    const metricName = northStarMetric.name.toLowerCase();
    
    // AI-generated stages based on metric type
    if (metricName.includes('reach') || metricName.includes('impressions') || metricName.includes('views')) {
      return [
        {
          name: "Soft Launch",
          target: Math.round(totalTarget * 0.05),
          timeframe: "Day 1-3",
          description: "Testing and optimization phase with core audience"
        },
        {
          name: "Viral Ignition",
          target: Math.round(totalTarget * 0.2),
          timeframe: "Week 1",
          description: "Influencer activation and early adopter engagement"
        },
        {
          name: "Momentum Build",
          target: Math.round(totalTarget * 0.45),
          timeframe: "Week 2-3",
          description: "Organic sharing accelerates, mainstream attention"
        },
        {
          name: "Peak Velocity",
          target: Math.round(totalTarget * 0.8),
          timeframe: "Week 4-6",
          description: "Maximum reach velocity, cultural conversation dominance"
        },
        {
          name: "Saturation Point",
          target: totalTarget,
          timeframe: "Week 8",
          description: "Complete market penetration achieved"
        }
      ];
    } else if (metricName.includes('engagement') || metricName.includes('participation')) {
      return [
        {
          name: "Activation Phase",
          target: Math.round(totalTarget * 0.1),
          timeframe: "Week 1",
          description: "Initial user onboarding and first interactions"
        },
        {
          name: "Habit Formation",
          target: Math.round(totalTarget * 0.25),
          timeframe: "Week 2-3",
          description: "Regular engagement patterns established"
        },
        {
          name: "Community Growth",
          target: Math.round(totalTarget * 0.5),
          timeframe: "Week 4-5",
          description: "User-generated content and peer influence"
        },
        {
          name: "Network Effects",
          target: Math.round(totalTarget * 0.75),
          timeframe: "Week 6-8",
          description: "Exponential growth through social proof"
        },
        {
          name: "Full Engagement",
          target: totalTarget,
          timeframe: "Week 10",
          description: "Sustained high-frequency participation"
        }
      ];
    } else {
      // Default roadmap for other metrics
      return [
        {
          name: "Foundation",
          target: Math.round(totalTarget * 0.15),
          timeframe: "Week 1-2",
          description: "Establish baseline and early indicators"
        },
        {
          name: "Growth Phase",
          target: Math.round(totalTarget * 0.35),
          timeframe: "Week 3-4",
          description: "Accelerated progress and optimization"
        },
        {
          name: "Acceleration",
          target: Math.round(totalTarget * 0.6),
          timeframe: "Week 5-6",
          description: "Breakthrough performance achieved"
        },
        {
          name: "Optimization",
          target: Math.round(totalTarget * 0.85),
          timeframe: "Week 7-8",
          description: "Fine-tuning for maximum impact"
        },
        {
          name: "Target Success",
          target: totalTarget,
          timeframe: "Week 10",
          description: "Campaign objectives fully realized"
        }
      ];
    }
  };

  const roadmapMilestones = generateRoadmap();

  const getImportanceColor = (importance: string) => {
    switch(importance) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-yellow-400 bg-yellow-500/10';
      case 'medium': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-neutral-400 bg-neutral-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'awareness': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'engagement': return <Activity className="w-4 h-4 text-purple-400" />;
      case 'conversion': return <Target className="w-4 h-4 text-green-400" />;
      case 'loyalty': return <Award className="w-4 h-4 text-orange-400" />;
      default: return <BarChart3 className="w-4 h-4 text-neutral-400" />;
    }
  };

  const calculateLift = (target: number, benchmark: number) => {
    return ((target - benchmark) / benchmark * 100).toFixed(0);
  };

  // Prepare roadmap data for chart
  const roadmapData = roadmapMilestones.map((milestone, index) => ({
    name: milestone.name,
    value: milestone.target,
    formattedValue: formatMetricValue(milestone.target, nsFormat.unit),
    fill: index === roadmapMilestones.length - 1 ? '#22c55e' : '#525252'
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light mb-4">KPI Framework & Success Metrics</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Comprehensive measurement framework with industry benchmarks and strategic targets
        </p>
      </div>

      {/* North Star Metric with Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* North Star Metric */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500/20 via-green-600/10 to-transparent rounded-2xl p-8 border border-green-500/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-medium">North Star Metric</h3>
                <p className="text-neutral-400">{northStarMetric.name}</p>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-7xl font-light text-green-400 drop-shadow-2xl">{nsFormat.formattedValue}</p>
              <p className="text-sm text-neutral-400 mt-2">Campaign Target</p>
            </div>
            <p className="text-sm text-neutral-300 mt-4">{northStarMetric.description}</p>
          </div>
        </div>

        {/* Roadmap to Success */}
        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800">
          <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Flag className="w-5 h-5 text-green-400" />
            Roadmap to {nsFormat.formattedValue}
          </h3>
          
          {/* Roadmap Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roadmapData}>
                <defs>
                  <linearGradient id="colorRoadmap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#999', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fill: '#999', fontSize: 10 }}
                  tickFormatter={(value) => formatMetricValue(value, nsFormat.unit)}
                />
                <Tooltip content={<ChartTooltip formatter={(value: any) => formatMetricValue(value, nsFormat.unit)} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRoadmap)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone Details */}
          <div className="space-y-3">
            {roadmapMilestones.slice(0, 3).map((milestone, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === roadmapMilestones.length - 1 ? 'bg-green-500' : 'bg-neutral-600'
                  }`} />
                  <span className="text-neutral-400">{milestone.name}</span>
                </div>
                <span className="text-neutral-500">{milestone.timeframe}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed KPI Cards with Individual Charts - Single Column */}
      <div className="grid grid-cols-1 gap-8">
        {displayKPIs.map((kpi, index) => {
          const lift = calculateLift(kpi.target, kpi.benchmark);
          
          // Data for vertical bar chart
          const barData = [
            { name: 'Benchmark', value: kpi.benchmark, fill: '#525252' },
            { name: 'Target', value: kpi.target, fill: '#22c55e' },
          ];

          // Data for donut chart
          const donutData = [
            { name: 'Lift', value: kpi.target - kpi.benchmark, fill: '#22c55e' },
            { name: 'Base', value: kpi.benchmark, fill: '#262626' },
          ];
          
          return (
            <div key={index} className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800 hover:border-neutral-700 transition-all shadow-xl hover:shadow-2xl">
              {/* KPI Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-800/50 rounded-xl backdrop-blur-sm">
                    {getCategoryIcon(kpi.category)}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium flex items-center gap-2">
                      {kpi.name}
                      <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                        <Info className="w-4 h-4" />
                      </button>
                    </h4>
                    <p className="text-sm text-neutral-400 mt-1">{kpi.definition}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full ${getImportanceColor(kpi.importance)}`}>
                  {kpi.importance}
                </span>
              </div>

              {/* Chart and Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Vertical Bar Chart */}
                <div className="h-64 bg-neutral-950/50 rounded-xl p-4 border border-neutral-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: '#999' }} />
                      <YAxis tick={{ fill: '#999' }} />
                      <Tooltip content={<ChartTooltip formatter={(value: any) => formatMetricValue(value, kpi.unit)} />} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {barData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Larger Donut Chart */}
                <div className="h-64 bg-neutral-950/50 rounded-xl p-4 border border-neutral-800 flex items-center justify-center">
                  <div className="relative">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {donutData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip formatter={(value: any) => formatMetricValue(value, kpi.unit)} />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-light text-green-400">+{lift}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Display */}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20 backdrop-blur-sm">
                    <p className="text-sm text-neutral-400 mb-2">Campaign Target</p>
                    <p className="text-4xl font-light text-green-400">{formatMetricValue(kpi.target, kpi.unit)}</p>
                  </div>
                  <div className="bg-neutral-950/50 rounded-xl p-6 border border-neutral-800">
                    <p className="text-sm text-neutral-500 mb-2">Industry Benchmark</p>
                    <p className="text-3xl font-light text-neutral-400">{formatMetricValue(kpi.benchmark, kpi.unit)}</p>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <ArrowUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 font-medium">{lift}% above industry standard</p>
                    <p className="text-sm text-neutral-400 mt-1">{kpi.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Criteria */}
      <div className="bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-700">
        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" />
          Campaign Success Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-950/30 rounded-xl p-6 border border-neutral-800">
            <h4 className="text-sm font-medium text-green-400 mb-3">Minimum Success</h4>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Meet 80% of KPI targets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Exceed industry benchmarks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Positive sentiment > 70%</span>
              </li>
            </ul>
          </div>
          <div className="bg-neutral-950/30 rounded-xl p-6 border border-neutral-800">
            <h4 className="text-sm font-medium text-yellow-400 mb-3">Target Success</h4>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Achieve 100% of KPI targets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>25% above benchmarks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Viral coefficient > 1.5</span>
              </li>
            </ul>
          </div>
          <div className="bg-neutral-950/30 rounded-xl p-6 border border-neutral-800">
            <h4 className="text-sm font-medium text-blue-400 mb-3">Breakthrough Success</h4>
            <ul className="text-sm text-neutral-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Exceed targets by 20%+</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Category-leading metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Cultural moment creation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}