'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CampaignHeader from '@/components/CampaignHeader';
import ConsumerJourney from '@/components/ConsumerJourney';

export default function JourneyPage() {
  const params = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.campaign);
      }
    } catch (err) {
      console.error('Failed to load campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="animate-pulse">
          <div className="h-20 bg-neutral-800 rounded mb-6"></div>
          <div className="h-96 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-24">
      <CampaignHeader campaign={campaign} />
      
      {/* Navigation Tabs */}
      <div className="flex space-x-0 mb-12 border-b border-neutral-800">
        <Link
          href={`/campaign/${params.id}`}
          className="px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-neutral-400 border-transparent hover:text-white hover:border-neutral-600"
        >
          Overview
        </Link>
        <Link
          href={`/campaign/${params.id}/journey`}
          className="px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-white border-green-500 bg-green-500/10"
        >
          Consumer Journey
        </Link>
        <Link
          href={`/campaign/${params.id}/kpis`}
          className="px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-neutral-400 border-transparent hover:text-white hover:border-neutral-600"
        >
          KPI Dashboard
        </Link>
        <Link
          href={`/campaign/${params.id}/creative`}
          className="px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-neutral-400 border-transparent hover:text-white hover:border-neutral-600"
        >
          Creative Execution
        </Link>
      </div>
      
      <ConsumerJourney campaign={campaign} />
    </div>
  );
}