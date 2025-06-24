'use client';

import { useCallback, useState } from 'react';
import styles from './EnhancedConsumerJourney.module.css';
import { ChartContainer, ChartTooltip } from './ui/chart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Node,
  Edge,
  Connection,
  NodeTypes,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Users, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Share2, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Target,
  Zap,
  MessageCircle,
  UserCheck,
  ArrowRight,
  Plus,
  Mail,
  Phone,
  Globe,
  Video,
  FileText,
  Megaphone
} from 'lucide-react';

interface JourneyStage {
  name: string;
  description: string;
  touchpoints: string[];
  metrics: {
    volume: number;
    conversionRate: number;
    dropOffRate: number;
    avgTimeSpent: string;
  };
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// Custom node component for the flow chart
const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-4 py-3 rounded-xl border-2 ${data.color} bg-gradient-to-br from-card to-muted/50 backdrop-blur-sm min-w-[200px] shadow-lg hover:shadow-xl transition-all`}>
      <Handle type="target" position={Position.Top} className="!bg-green-500" />
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${data.iconBg} backdrop-blur-sm`}>
          {data.icon}
        </div>
        <div>
          <div className="font-medium">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.subtitle}</div>
        </div>
      </div>
      {data.metrics && (
        <div className="text-xs space-y-1 mt-2 pt-2 border-t border-border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volume:</span>
            <span>{data.metrics.volume}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Conversion:</span>
            <span className="text-green-400">{data.metrics.conversion}%</span>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Predefined touchpoint templates
const touchpointTemplates = [
  { id: 'email', label: 'Email Campaign', icon: <Mail className="w-4 h-4" />, type: 'email' },
  { id: 'phone', label: 'Phone Outreach', icon: <Phone className="w-4 h-4" />, type: 'phone' },
  { id: 'webinar', label: 'Webinar', icon: <Video className="w-4 h-4" />, type: 'webinar' },
  { id: 'content', label: 'Content Marketing', icon: <FileText className="w-4 h-4" />, type: 'content' },
  { id: 'retargeting', label: 'Retargeting Ads', icon: <Megaphone className="w-4 h-4" />, type: 'ads' },
  { id: 'website2', label: 'Landing Page', icon: <Globe className="w-4 h-4" />, type: 'website' },
];

export default function EnhancedConsumerJourney({ campaign }: { campaign: any }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  // Journey stages with detailed data
  const journeyStages: JourneyStage[] = [
    {
      name: 'Awareness',
      description: 'First exposure to campaign message',
      touchpoints: ['Social Media Ads', 'Influencer Posts', 'PR Coverage', 'Organic Discovery'],
      metrics: {
        volume: 100000,
        conversionRate: 100,
        dropOffRate: 0,
        avgTimeSpent: '3 sec'
      },
      icon: <Eye className="w-4 h-4" />,
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      name: 'Interest',
      description: 'Engagement with campaign content',
      touchpoints: ['Content Views', 'Social Engagement', 'Website Visits', 'Email Signups'],
      metrics: {
        volume: 75000,
        conversionRate: 75,
        dropOffRate: 25,
        avgTimeSpent: '45 sec'
      },
      icon: <Heart className="w-4 h-4" />,
      color: 'border-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      name: 'Consideration',
      description: 'Deep exploration of brand/product',
      touchpoints: ['Product Pages', 'Reviews Research', 'Comparison Shopping', 'FAQ/Support'],
      metrics: {
        volume: 45000,
        conversionRate: 60,
        dropOffRate: 40,
        avgTimeSpent: '5 min'
      },
      icon: <Target className="w-4 h-4" />,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/20'
    },
    {
      name: 'Action',
      description: 'Conversion and purchase decision',
      touchpoints: ['Purchase', 'Sign-up', 'Download', 'Participation'],
      metrics: {
        volume: 25000,
        conversionRate: 55.6,
        dropOffRate: 44.4,
        avgTimeSpent: '8 min'
      },
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'border-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      name: 'Advocacy',
      description: 'Post-purchase engagement and sharing',
      touchpoints: ['Social Sharing', 'Reviews', 'Referrals', 'UGC Creation'],
      metrics: {
        volume: 15000,
        conversionRate: 60,
        dropOffRate: 40,
        avgTimeSpent: '12 min'
      },
      icon: <Share2 className="w-4 h-4" />,
      color: 'border-orange-500',
      bgColor: 'bg-orange-500/20'
    }
  ];

  // React Flow initial setup
  const initialNodes: Node[] = [
    // Main journey flow
    {
      id: '1',
      type: 'custom',
      position: { x: 100, y: 50 },
      data: { 
        label: 'Awareness',
        subtitle: '100K impressions',
        icon: <Eye className="w-4 h-4" />,
        iconBg: 'bg-blue-500/20',
        color: 'border-blue-500',
        metrics: { volume: '100K', conversion: 75 }
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 400, y: 50 },
      data: { 
        label: 'Interest',
        subtitle: '75K engaged',
        icon: <Heart className="w-4 h-4" />,
        iconBg: 'bg-purple-500/20',
        color: 'border-purple-500',
        metrics: { volume: '75K', conversion: 60 }
      },
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 700, y: 50 },
      data: { 
        label: 'Consideration',
        subtitle: '45K considering',
        icon: <Target className="w-4 h-4" />,
        iconBg: 'bg-yellow-500/20',
        color: 'border-yellow-500',
        metrics: { volume: '45K', conversion: 55.6 }
      },
    },
    {
      id: '4',
      type: 'custom',
      position: { x: 1000, y: 50 },
      data: { 
        label: 'Action',
        subtitle: '25K converted',
        icon: <ShoppingCart className="w-4 h-4" />,
        iconBg: 'bg-green-500/20',
        color: 'border-green-500',
        metrics: { volume: '25K', conversion: 60 }
      },
    },
    {
      id: '5',
      type: 'custom',
      position: { x: 1300, y: 50 },
      data: { 
        label: 'Advocacy',
        subtitle: '15K advocates',
        icon: <Share2 className="w-4 h-4" />,
        iconBg: 'bg-orange-500/20',
        color: 'border-orange-500',
        metrics: { volume: '15K', conversion: 100 }
      },
    },
    // Touchpoint nodes
    {
      id: '6',
      type: 'custom',
      position: { x: 100, y: 200 },
      data: { 
        label: 'Social Media',
        subtitle: 'Paid + Organic',
        icon: <MessageCircle className="w-4 h-4" />,
        iconBg: 'bg-blue-500/20',
        color: 'border-muted-foreground'
      },
    },
    {
      id: '7',
      type: 'custom',
      position: { x: 400, y: 200 },
      data: { 
        label: 'Website',
        subtitle: 'Landing Pages',
        icon: <Zap className="w-4 h-4" />,
        iconBg: 'bg-purple-500/20',
        color: 'border-muted-foreground'
      },
    },
    {
      id: '8',
      type: 'custom',
      position: { x: 700, y: 200 },
      data: { 
        label: 'Email',
        subtitle: 'Nurture Sequence',
        icon: <UserCheck className="w-4 h-4" />,
        iconBg: 'bg-yellow-500/20',
        color: 'border-muted-foreground'
      },
    },
  ];

  const initialEdges: Edge[] = [
    // Main flow
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#22c55e' } },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#22c55e' } },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true, style: { stroke: '#22c55e' } },
    { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true, style: { stroke: '#22c55e' } },
    // Touchpoint connections
    { id: 'e6-1', source: '6', target: '1', type: 'smoothstep', style: { stroke: '#525252' } },
    { id: 'e7-2', source: '7', target: '2', type: 'smoothstep', style: { stroke: '#525252' } },
    { id: 'e8-3', source: '8', target: '3', type: 'smoothstep', style: { stroke: '#525252' } },
    // Advocacy loop back
    { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', style: { stroke: '#f97316' }, 
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [funnelData, setFunnelData] = useState(
    journeyStages.map((stage, index) => ({
      name: stage.name,
      conversion: stage.metrics.conversionRate,
      benchmark: [100, 65, 35, 20, 10][index],
      users: (stage.metrics.volume / 1000).toFixed(0) + 'K',
    }))
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  // Add new touchpoint
  const addTouchpoint = (template: any, stageIndex: number) => {
    const stageNode = nodes.find(n => n.id === String(stageIndex + 1));
    if (!stageNode) return;
    
    const newNodeId = `tp-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position: { 
        x: stageNode.position.x, 
        y: stageNode.position.y + 150 + (Math.random() * 50) 
      },
      data: {
        label: template.label,
        subtitle: 'New Touchpoint',
        icon: template.icon,
        iconBg: 'bg-muted',
        color: 'border-muted-foreground'
      }
    };
    
    const newEdge: Edge = {
      id: `e-${newNodeId}-${stageIndex + 1}`,
      source: newNodeId,
      target: String(stageIndex + 1),
      type: 'smoothstep',
      style: { stroke: '#525252' }
    };
    
    setNodes(nds => [...nds, newNode]);
    setEdges(eds => [...eds, newEdge]);
    
    // Update funnel data to show improved conversion
    const improvement = 5 + Math.random() * 10; // 5-15% improvement
    updateFunnelData(stageIndex, improvement);
    
    setShowAddMenu(false);
    setSelectedStage(null);
  };
  
  // Update funnel data when touchpoints are added
  const updateFunnelData = (stageIndex: number, improvement: number) => {
    setFunnelData(prevData => {
      const newData = [...prevData];
      
      // Improve conversion rates for this stage and subsequent stages
      for (let i = stageIndex; i < newData.length; i++) {
        newData[i] = {
          ...newData[i],
          conversion: Math.min(100, newData[i].conversion + improvement * (1 - (i - stageIndex) * 0.2))
        };
      }
      
      return newData;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light mb-4">Consumer Journey & Conversion Funnel</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive visualization of the customer experience from awareness to advocacy
        </p>
      </div>

      {/* Funnel Chart */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-muted-foreground transition-all shadow-xl hover:shadow-2xl">
        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Conversion Funnel Analysis
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717a" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#71717a" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#a1a1aa' }}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis 
                tick={{ fill: '#a1a1aa' }}
                axisLine={{ stroke: '#3f3f46' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={<ChartTooltip formatter={(value: any) => `${value}%`} />} 
                cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => <span style={{ color: '#a1a1aa' }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="benchmark"
                name="Industry Benchmark"
                stroke="#71717a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBenchmark)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="conversion"
                name="Conversion Funnel"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorConversion)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {funnelData.map((stage, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{stage.name}</p>
              <p className="text-lg font-light text-green-400">{stage.conversion}%</p>
              <p className="text-xs text-muted-foreground/70">{stage.users} users</p>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Journey Blocks */}
      <div className="py-8">
        <h3 className="text-xl font-medium mb-6 text-center">Journey Overview</h3>
        <div className="flex flex-wrap justify-center items-center gap-4">
          {journeyStages.map((stage, index) => (
            <div key={index} className="flex items-center">
              <div className="relative">
                <div className={`p-6 rounded-xl ${stage.bgColor} border ${stage.color.replace('border-', 'border-')} transition-all hover:scale-105`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${stage.bgColor}`}>
                      {stage.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{stage.name}</h4>
                      <p className="text-xs text-muted-foreground">{(stage.metrics.volume / 1000).toFixed(0)}K users</p>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-2xl font-light">{stage.metrics.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">conversion</p>
                  </div>
                </div>
              </div>
              {index < journeyStages.length - 1 && (
                <div className="flex items-center mx-2">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-red-400 ml-1">
                    -{((journeyStages[index].metrics.volume - journeyStages[index + 1].metrics.volume) / journeyStages[index].metrics.volume * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Flow Chart */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border overflow-hidden shadow-xl hover:shadow-2xl transition-all">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Interactive Journey Flow
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Drag nodes to reorganize • Add touchpoints to improve conversion
              </p>
            </div>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-lg hover:from-green-400 hover:to-green-500 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Touchpoint
            </button>
          </div>
          
          {/* Add Touchpoint Menu */}
          {showAddMenu && (
            <div className="mt-4 p-4 bg-muted/50 backdrop-blur-sm rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3">Select a stage, then choose a touchpoint to add:</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {journeyStages.map((stage, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStage(String(index))}
                    className={`p-2 rounded text-xs transition-colors ${
                      selectedStage === String(index)
                        ? 'bg-green-500 text-black'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {stage.name}
                  </button>
                ))}
              </div>
              {selectedStage !== null && (
                <div className="grid grid-cols-3 gap-2">
                  {touchpointTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => addTouchpoint(template, parseInt(selectedStage))}
                      className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
                    >
                      {template.icon}
                      <span className="text-xs">{template.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ width: '100%', height: '600px' }} className={styles.darkControls}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-background via-card to-background"
          >
            <Controls className="!bg-card/80 !backdrop-blur-sm !border-border !shadow-xl" />
            <Background variant="dots" gap={16} size={1} color="#27272a" />
          </ReactFlow>
        </div>
      </div>

      {/* Journey Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 via-green-600/10 to-transparent rounded-xl p-6 border border-green-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
          <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
          <h4 className="font-medium mb-1">Strong Performance</h4>
          <p className="text-sm text-muted-foreground">
            Interest to Consideration conversion exceeds industry benchmark by 25%
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent rounded-xl p-6 border border-yellow-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
          <AlertCircle className="w-5 h-5 text-yellow-400 mb-2" />
          <h4 className="font-medium mb-1">Optimization Opportunity</h4>
          <p className="text-sm text-muted-foreground">
            Consideration to Action drop-off can be improved with better nurturing
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
          <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
          <h4 className="font-medium mb-1">Growth Potential</h4>
          <p className="text-sm text-muted-foreground">
            High advocacy rate indicates strong viral growth opportunity
          </p>
        </div>
      </div>
    </div>
  );
}