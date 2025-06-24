'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to clean markdown formatting
const cleanMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[-•]\s*/gm, '')
    .replace(/^\d+\.\s*/gm, '')
    .trim();
};

interface CampaignOverviewProps {
  campaign: any;
}

export default function CampaignOverview({ campaign }: CampaignOverviewProps) {
  // Handle both direct campaign object and database-stored campaign
  const strategicRationale = campaign.strategic_rationale || 
                           campaign.summary?.strategicRationale || 
                           campaign.summary_data?.strategicRationale ||
                           campaign.summary_data?.fullSummary || 
                           'Strategic analysis generating...';
                           
  const targetAudience = campaign.target_audience || 
                        campaign.audience_data?.primaryPersona?.psychographics ||
                        campaign.audience_data?.description ||
                        campaign.audience?.primaryPersona?.psychographics || 
                        campaign.audience?.description || 
                        'Culture creators and change makers who value authenticity and bold action';
                        
  const northStarMetric = campaign.kpi_data?.northStarMetric?.metric ||
                         campaign.kpis?.northStarMetric?.metric ||
                         'Cultural Impact Score';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
          <h3 className="text-xl font-medium mb-4 text-green-400">Strategic Rationale</h3>
          <p className="text-neutral-300 leading-relaxed">
            {cleanMarkdown(strategicRationale)}
          </p>
        </div>
        
        <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
          <h3 className="text-xl font-medium mb-4 text-blue-400">Target Audience</h3>
          <p className="text-neutral-300 leading-relaxed">
            {cleanMarkdown(targetAudience)}
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
            options={chartOptions}
          />
        </div>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-green-400">65%</p>
          <p className="text-sm text-neutral-400">{northStarMetric}</p>
        </div>
      </div>
    </div>
  );
}