'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CampaignHeader from '@/components/CampaignHeader';
import CampaignOverview from '@/components/CampaignOverview';
import EnhancedPersonas from '@/components/EnhancedPersonas';
import EnhancedKPIs from '@/components/EnhancedKPIs';
import EnhancedConsumerJourney from '@/components/EnhancedConsumerJourney';
import CreativeExecution from '@/components/CreativeExecution';

export default function CampaignPage() {
  const router = useRouter();
  const params = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.campaign);
      } else {
        setError(data.error || 'Failed to load campaign');
      }
    } catch (err) {
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="animate-pulse">
          <div className="h-20 bg-neutral-800 rounded mb-6"></div>
          <div className="h-8 bg-neutral-800 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-neutral-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="text-4xl font-light mb-4">Campaign Not Found</h1>
        <p className="text-neutral-400 mb-8">{error || 'This campaign does not exist.'}</p>
        <Link href="/" className="text-green-400 hover:text-green-300">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // Prepare data for components
  const personas = campaign.audience_data?.personas || [];
  const northStarMetric = {
    name: campaign.kpi_data?.northStarMetric?.name || 'Campaign Participation Rate',
    value: campaign.kpi_data?.northStarMetric?.value || 65,
    target: campaign.kpi_data?.northStarMetric?.target || 100,
    description: campaign.kpi_data?.northStarMetric?.description || 'Percentage of target audience actively engaging with campaign'
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-24">
      <CampaignHeader campaign={campaign} />
      
      {/* Strategic Overview Section */}
      <section className="mb-16">
        <CampaignOverview campaign={campaign} />
      </section>

      {/* Target Audience Section */}
      <section className="mb-16 scroll-mt-24" id="audience">
        <EnhancedPersonas personas={personas} />
      </section>

      {/* Consumer Journey Section */}
      <section className="mb-16 scroll-mt-24" id="journey">
        <EnhancedConsumerJourney campaign={campaign} />
      </section>

      {/* KPIs Section */}
      <section className="mb-16 scroll-mt-24" id="kpis">
        <EnhancedKPIs northStarMetric={northStarMetric} kpis={campaign.kpi_data?.kpis} />
      </section>

      {/* Creative Execution Section */}
      <section className="mb-16 scroll-mt-24" id="creative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">Creative Execution</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Strategic narrative and activation approach designed to maximize cultural impact
          </p>
        </div>
        <CreativeExecution campaign={campaign} />
      </section>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-16 pt-16 border-t border-neutral-800">
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
        >
          Generate New Campaign
        </button>
        <button
          onClick={() => {
            const url = window.location.origin + window.location.pathname;
            navigator.clipboard.writeText(url);
            alert('Campaign URL copied to clipboard!');
          }}
          className="px-8 py-3 border border-neutral-600 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Share Campaign
        </button>
      </div>

      {/* Sticky Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 rounded-full px-2 py-2 border border-neutral-800 shadow-2xl z-50">
        <nav className="flex gap-2">
          <a href="#audience" className="px-4 py-2 text-sm hover:bg-neutral-800 rounded-full transition-colors">
            Audience
          </a>
          <a href="#journey" className="px-4 py-2 text-sm hover:bg-neutral-800 rounded-full transition-colors">
            Journey
          </a>
          <a href="#kpis" className="px-4 py-2 text-sm hover:bg-neutral-800 rounded-full transition-colors">
            KPIs
          </a>
          <a href="#creative" className="px-4 py-2 text-sm hover:bg-neutral-800 rounded-full transition-colors">
            Creative
          </a>
        </nav>
      </div>
    </div>
  );
}