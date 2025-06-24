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
                           
  // Generate comprehensive target audience description
  const getTargetAudienceDescription = () => {
    if (campaign.audience_data?.fullStrategy) {
      // Extract a meaningful paragraph from the full strategy
      const strategy = campaign.audience_data.fullStrategy;
      const primaryMatch = strategy.match(/PRIMARY PERSONA[\s\S]*?(?=SECONDARY|AUDIENCE|$)/i)?.[0] || '';
      const psychMatch = primaryMatch.match(/Psychographic[\s\S]*?(?=Media|Pain|$)/i)?.[0] || '';
      if (psychMatch) {
        return cleanMarkdown(psychMatch);
      }
    }
    
    // Build from structured data if available
    if (campaign.audience_data?.personas?.length > 0) {
      const personas = campaign.audience_data.personas;
      const primary = personas.find((p: any) => p.name) || personas[0];
      const secondary = personas.length > 1 ? personas[1] : null;
      
      let description = `Our primary audience consists of ${primary.age} year old ${primary.occupation}s who ${primary.bio} `;
      description += `They value ${primary.psychographics?.values?.slice(0, 3).join(', ')} and are motivated by ${primary.psychographics?.motivations?.slice(0, 2).join(' and ')}. `;
      
      if (secondary) {
        description += `Our secondary audience includes ${secondary.occupation}s who ${secondary.bio} `;
        description += `This diverse audience shares common ground in ${campaign.audience_data?.insights?.commonGround || 'their values and aspirations'}.`;
      }
      
      return description;
    }
    
    // Fallback to basic description
    return campaign.target_audience || 
           'Our campaign targets progressive millennials and Gen Z consumers aged 25-40 who are digital natives, value authenticity over perfection, and actively seek brands that align with their personal values. They are early adopters, cultural influencers within their communities, and prioritize experiences over material possessions. This audience consumes media across multiple platforms, engages deeply with causes they believe in, and expects brands to take meaningful stances on social issues.';
  };
  
  const targetAudience = getTargetAudienceDescription();
                        
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
          <p className="text-neutral-300 leading-relaxed text-sm">
            {targetAudience}
          </p>
        </div>
      </div>

      <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
        <h3 className="text-xl font-medium mb-6 text-purple-400">Cultural Impact Score</h3>
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
          <p className="text-sm text-neutral-400">Current Performance</p>
          <p className="text-xs text-neutral-500 mt-2">Measures campaign's ability to shift cultural conversations and create lasting brand impact</p>
        </div>
      </div>
    </div>
  );
}