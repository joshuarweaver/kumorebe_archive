'use client';

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

interface CampaignHeaderProps {
  campaign: any;
}

export default function CampaignHeader({ campaign }: CampaignHeaderProps) {
  // Handle both direct campaign object and database-stored campaign
  const campaignName = campaign.campaign_name || campaign.summary?.campaignName || 'Untitled Campaign';
  const tagline = campaign.tagline || campaign.summary?.tagline || '';
  const bigIdea = campaign.big_idea || campaign.summary?.bigIdea || '';
  
  return (
    <div className="mb-12">
      <h1 className="text-7xl font-light mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
        {cleanMarkdown(campaignName)}
      </h1>
      <p className="text-2xl text-green-400 mb-4">{cleanMarkdown(tagline)}</p>
      <p className="text-lg text-neutral-300 leading-relaxed max-w-4xl">
        {cleanMarkdown(bigIdea)}
      </p>
    </div>
  );
}