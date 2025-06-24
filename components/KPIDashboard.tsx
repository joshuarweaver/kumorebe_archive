'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface KPIDashboardProps {
  campaign: any;
}

export default function KPIDashboard({ campaign }: KPIDashboardProps) {
  // Generate dynamic KPI chart data
  const generateKPIData = () => {
    const kpiData = campaign.kpi_data || campaign.kpis || {};
    const kpis = kpiData.primaryKPIs || [];
    
    return {
      labels: kpis.length > 0 
        ? kpis.map((kpi: any, index: number) => kpi.name || `KPI ${index + 1}`)
        : ['Engagement', 'Reach', 'Conversion', 'Brand Lift', 'ROI'],
      datasets: [
        {
          label: 'Target %',
          data: kpis.length > 0
            ? kpis.map((kpi: any) => kpi.target || Math.floor(Math.random() * 100) + 50)
            : [85, 92, 78, 88, 95],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'],
          borderWidth: 0,
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

  return (
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
  );
}