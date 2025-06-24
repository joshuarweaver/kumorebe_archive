'use client';

import { useCallback, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './EnhancedConsumerJourney.module.css';
import {
  ReactFlow,
  MiniMap,
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
    <div className={`px-4 py-3 rounded-lg border-2 ${data.color} bg-neutral-900 min-w-[200px]`}>
      <Handle type="target" position={Position.Top} className="!bg-green-500" />
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded ${data.iconBg}`}>
          {data.icon}
        </div>
        <div>
          <div className="font-medium">{data.label}</div>
          <div className="text-xs text-neutral-400">{data.subtitle}</div>
        </div>
      </div>
      {data.metrics && (
        <div className="text-xs space-y-1 mt-2 pt-2 border-t border-neutral-700">
          <div className="flex justify-between">
            <span className="text-neutral-500">Volume:</span>
            <span>{data.metrics.volume}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Conversion:</span>
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
        color: 'border-neutral-600'
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
        color: 'border-neutral-600'
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
        color: 'border-neutral-600'
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
  const [funnelData, setFunnelData] = useState({
    labels: journeyStages.map(stage => stage.name),
    datasets: [
      {
        label: 'Conversion Funnel',
        data: journeyStages.map(stage => stage.metrics.conversionRate),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Industry Benchmark',
        data: [100, 65, 35, 20, 10],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.3,
      }
    ],
  });

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
        iconBg: 'bg-neutral-700',
        color: 'border-neutral-600'
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
      const newData = { ...prevData };
      const currentData = [...newData.datasets[0].data];
      
      // Improve conversion rates for this stage and subsequent stages
      for (let i = stageIndex; i < currentData.length; i++) {
        currentData[i] = Math.min(100, currentData[i] + improvement * (1 - (i - stageIndex) * 0.2));
      }
      
      newData.datasets[0].data = currentData;
      return newData;
    });
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#999',
        },
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
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#999',
          callback: function(value: any) {
            return value + '%';
          },
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light mb-4">Consumer Journey & Conversion Funnel</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Interactive visualization of the customer experience from awareness to advocacy
        </p>
      </div>

      {/* Funnel Chart */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Conversion Funnel Analysis
        </h3>
        <div className="h-80">
          <Line options={chartOptions} data={funnelData} />
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
                      <p className="text-xs text-neutral-400">{(stage.metrics.volume / 1000).toFixed(0)}K users</p>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-2xl font-light">{stage.metrics.conversionRate}%</p>
                    <p className="text-xs text-neutral-500">conversion</p>
                  </div>
                </div>
              </div>
              {index < journeyStages.length - 1 && (
                <div className="flex items-center mx-2">
                  <ArrowRight className="w-6 h-6 text-neutral-500" />
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
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Interactive Journey Flow
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                Drag nodes to reorganize • Add touchpoints to improve conversion
              </p>
            </div>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Touchpoint
            </button>
          </div>
          
          {/* Add Touchpoint Menu */}
          {showAddMenu && (
            <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-400 mb-3">Select a stage, then choose a touchpoint to add:</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {journeyStages.map((stage, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStage(String(index))}
                    className={`p-2 rounded text-xs transition-colors ${
                      selectedStage === String(index)
                        ? 'bg-green-500 text-black'
                        : 'bg-neutral-700 hover:bg-neutral-600'
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
                      className="p-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors flex items-center gap-2"
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
            className="bg-neutral-950"
          >
            <Controls className="!bg-neutral-800 !border-neutral-700" />
            <MiniMap 
              className="!bg-neutral-800 !border-neutral-700" 
              nodeColor="#22c55e"
              maskColor="rgba(0, 0, 0, 0.8)"
            />
            <Background variant="dots" gap={16} size={1} color="#333" />
          </ReactFlow>
        </div>
      </div>

      {/* Journey Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/30">
          <CheckCircle2 className="w-5 h-5 text-green-400 mb-2" />
          <h4 className="font-medium mb-1">Strong Performance</h4>
          <p className="text-sm text-neutral-400">
            Interest to Consideration conversion exceeds industry benchmark by 25%
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/30">
          <AlertCircle className="w-5 h-5 text-yellow-400 mb-2" />
          <h4 className="font-medium mb-1">Optimization Opportunity</h4>
          <p className="text-sm text-neutral-400">
            Consideration to Action drop-off can be improved with better nurturing
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
          <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
          <h4 className="font-medium mb-1">Growth Potential</h4>
          <p className="text-sm text-neutral-400">
            High advocacy rate indicates strong viral growth opportunity
          </p>
        </div>
      </div>
    </div>
  );
}