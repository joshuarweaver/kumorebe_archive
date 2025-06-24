'use client';

import { useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Helper function to clean markdown formatting
const cleanMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
    .replace(/^[-•]\s*/gm, '') // Remove bullet points
    .replace(/^\d+\.\s*/gm, '') // Remove numbered lists
    .trim();
};

// Helper function to parse tagline and description
const parseTaglineAndDescription = (text: string): { tagline: string; description: string } => {
  if (!text) return { tagline: '', description: '' };
  
  // Split by line breaks
  const lines = text.split(/\n+/).filter(line => line.trim());
  
  // First line is tagline, rest is description
  const tagline = cleanMarkdown(lines[0] || '');
  const description = cleanMarkdown(lines.slice(1).join(' ') || '');
  
  return { tagline, description };
};

interface CampaignVisualizationProps {
  campaign: any;
}

export default function CampaignVisualization({ campaign }: CampaignVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'kpis' | 'creative'>('overview');

  // Generate dynamic KPI chart data
  const generateKPIData = () => {
    const kpis = campaign.kpis?.primaryKPIs || [];
    return {
      labels: kpis.map((kpi: any, index: number) => `KPI ${index + 1}` || `Metric ${index + 1}`),
      datasets: [
        {
          label: 'Target',
          data: kpis.map(() => Math.floor(Math.random() * 100) + 50),
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'],
          borderWidth: 0,
        },
      ],
    };
  };

  // Generate consumer journey data
  const generateJourneyData = () => {
    const stages = ['Awareness', 'Interest', 'Consideration', 'Action', 'Advocacy'];
    return {
      labels: stages,
      datasets: [
        {
          label: 'Conversion Rate %',
          data: [100, 75, 45, 25, 15],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  const TabButton = ({ tab, label, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(tab)}
      className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
        isActive
          ? 'text-white border-green-500 bg-green-500/10'
          : 'text-neutral-400 border-transparent hover:text-white hover:border-neutral-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-8 right-8">
        <h1 className="text-xl font-chillax font-medium">kumorebe</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-24">
        {/* Campaign Title */}
        <div className="mb-12">
          <h1 className="text-7xl font-light mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {cleanMarkdown(campaign.summary?.campaignName || 'Untitled Campaign')}
          </h1>
          <p className="text-2xl text-green-400 mb-4">{cleanMarkdown(campaign.summary?.tagline || '')}</p>
          <p className="text-lg text-neutral-300 leading-relaxed max-w-4xl">
            {cleanMarkdown(campaign.summary?.bigIdea || '')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-0 mb-12 border-b border-neutral-800">
          <TabButton tab="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton tab="journey" label="Consumer Journey" isActive={activeTab === 'journey'} onClick={setActiveTab} />
          <TabButton tab="kpis" label="KPI Dashboard" isActive={activeTab === 'kpis'} onClick={setActiveTab} />
          <TabButton tab="creative" label="Creative Execution" isActive={activeTab === 'creative'} onClick={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                <h3 className="text-xl font-medium mb-4 text-green-400">Strategic Rationale</h3>
                <p className="text-neutral-300 leading-relaxed">
                  {cleanMarkdown(campaign.summary?.strategicRationale || campaign.summary?.fullSummary || 'Strategic analysis generating...')}
                </p>
              </div>
              
              <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                <h3 className="text-xl font-medium mb-4 text-blue-400">Target Audience</h3>
                <p className="text-neutral-300 leading-relaxed">
                  {cleanMarkdown(campaign.audience?.primaryPersona?.psychographics || 
                   campaign.audience?.description || 
                   'Culture creators and change makers who value authenticity and bold action')}
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-xl font-medium mb-6 text-purple-400">North Star Metric</h3>
              <div className="h-64">
                <Doughnut 
                  data={{
                    labels: ['Achieved', 'Remaining'],
                    datasets: [{
                      data: [65, 35],
                      backgroundColor: ['#10B981', '#374151'],
                      borderWidth: 0,
                    }]
                  }}
                  options={{
                    ...chartOptions,
                    cutout: '70%',
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-green-400">65%</p>
                <p className="text-sm text-neutral-400">
                  {campaign.kpis?.northStarMetric?.metric || 'Cultural Impact Score'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-8">
            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-2xl font-medium mb-6 text-green-400">Consumer Journey Visualization</h3>
              <div className="h-96">
                <Line data={generateJourneyData()} options={chartOptions} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {['Awareness', 'Interest', 'Consideration', 'Action', 'Advocacy'].map((stage, index) => (
                <div key={stage} className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold">{index + 1}</span>
                  </div>
                  <h4 className="font-medium mb-2">{stage}</h4>
                  <p className="text-2xl font-bold text-green-400">{[100, 75, 45, 25, 15][index]}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                <h3 className="text-lg font-medium mb-4 text-green-400">Primary KPIs</h3>
                <div className="h-64">
                  <Bar data={generateKPIData()} options={chartOptions} />
                </div>
              </div>
              
              <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                <h3 className="text-lg font-medium mb-6 text-blue-400">Engagement Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Participation Rate</span>
                    <span className="text-xl font-bold text-blue-400">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Virality Coefficient</span>
                    <span className="text-xl font-bold text-blue-400">2.3x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Share of Voice</span>
                    <span className="text-xl font-bold text-blue-400">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Sentiment Score</span>
                    <span className="text-xl font-bold text-green-400">+85</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                <h3 className="text-lg font-medium mb-6 text-purple-400">Cultural Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Media Mentions</span>
                    <span className="text-xl font-bold text-purple-400">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Influencer Reach</span>
                    <span className="text-xl font-bold text-purple-400">2.1M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Meme Velocity</span>
                    <span className="text-xl font-bold text-purple-400">156/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-300">Cultural Resonance</span>
                    <span className="text-xl font-bold text-green-400">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creative' && (
          <div className="space-y-8">
            <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-2xl font-medium mb-6 text-green-400">Creative Execution</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-4 text-blue-400">Hero Concept</h4>
                  <p className="text-neutral-300 leading-relaxed mb-6">
                    {cleanMarkdown(campaign.creative?.heroConcept?.narrative || 
                     campaign.creative?.description ||
                     'A bold creative concept that breaks category conventions and invites authentic participation.')}
                  </p>
                  
                  <h4 className="text-lg font-medium mb-4 text-purple-400">Key Messages</h4>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Authentic rebellion against industry norms</li>
                    <li>• Community-driven change movement</li>
                    <li>• Cultural disruption through participation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4 text-yellow-400">Activation Strategy</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-800/50 rounded-lg">
                      <h5 className="font-medium text-white mb-2">Phase 1: Ignition</h5>
                      <p className="text-sm text-neutral-400">Launch with cultural provocateurs and early adopters</p>
                    </div>
                    <div className="p-4 bg-neutral-800/50 rounded-lg">
                      <h5 className="font-medium text-white mb-2">Phase 2: Amplification</h5>
                      <p className="text-sm text-neutral-400">Scale through participation mechanics and viral loops</p>
                    </div>
                    <div className="p-4 bg-neutral-800/50 rounded-lg">
                      <h5 className="font-medium text-white mb-2">Phase 3: Institutionalization</h5>
                      <p className="text-sm text-neutral-400">Embed in cultural conversation and normalize change</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-16">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
          >
            Generate New Campaign
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 border border-neutral-600 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            ← Back to Input
          </button>
        </div>
      </div>
    </div>
  );
}