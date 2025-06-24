'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import CampaignHeader from '@/components/CampaignHeader';
import CampaignOverview from '@/components/CampaignOverview';
import EnhancedPersonas from '@/components/EnhancedPersonas';
import EnhancedKPIs from '@/components/EnhancedKPIs';
import EnhancedConsumerJourney from '@/components/EnhancedConsumerJourney';
import EnhancedCreativeExecution from '@/components/EnhancedCreativeExecution';
import MediaStrategy from '@/components/MediaStrategy';
import ActivationStrategy from '@/components/ActivationStrategy';

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
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Campaign not found');
        } else {
          setError(`Failed to load campaign (Error ${response.status})`);
        }
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError('Server returned invalid response format');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.campaign);
      } else {
        setError(data.error || 'Failed to load campaign');
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="animate-pulse">
          <div className="h-20 bg-muted rounded mb-6"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="text-4xl font-light mb-4">Campaign Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || 'This campaign does not exist.'}</p>
        <Link href="/" className="text-primary hover:text-primary/80 cursor-pointer">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // Prepare data for components
  const personas = campaign.audience_data?.personas || [];
  const northStarMetric = {
    name: campaign.kpi_data?.northStarMetric?.name || 'Campaign Participation Rate',
    value: campaign.kpi_data?.northStarMetric?.value || 0,
    target: campaign.kpi_data?.northStarMetric?.target || 100000,
    description: campaign.kpi_data?.northStarMetric?.description || 'Total audience reached and engaged through campaign activation'
  };

  return (
    <div className="min-h-screen">
      <AppSidebar currentPage="campaigns" />
      
      {/* Main Content - offset for sidebar on desktop */}
      <div className="sidebar-offset">
        {/* Sticky Share Widget */}
        <button
          onClick={() => {
            const url = window.location.origin + window.location.pathname;
            navigator.clipboard.writeText(url);
            // You could add a toast notification here instead of alert
            alert('Campaign URL copied to clipboard!');
          }}
          className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground rounded-full p-4 shadow-xl hover:bg-primary-600 dark:hover:bg-primary-300 transition-all hover:scale-110 cursor-pointer group"
          title="Share Campaign"
        >
          <Share2 className="w-5 h-5" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-card-foreground px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Share
          </span>
        </button>
        
        {/* Section Navigation */}
        <div className="fixed top-4 right-4 z-40 hidden lg:flex gap-2 bg-card/95 backdrop-blur-md rounded-full px-2 py-2 border border-border shadow-lg">
          <a href="#audience" className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
            Audience
          </a>
          <a href="#journey" className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
            Journey
          </a>
          <a href="#kpis" className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
            KPIs
          </a>
          <a href="#creative" className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
            Creative
          </a>
          <a href="#media" className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
            Media
          </a>
          <a href="#activation" className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer">
            Activation
          </a>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16 lg:py-24">
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
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three distinct creative concepts designed to dominate culture and invite participation
          </p>
        </div>
        <EnhancedCreativeExecution 
          concepts={campaign.creative_concepts_data || campaign.creativeConcepts}
          campaignData={campaign} 
        />
      </section>
      
      {/* Media Strategy Section */}
      <section className="mb-16 scroll-mt-24" id="media">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">Media Strategy</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Channel strategy and platform tactics to maximize reach and engagement
          </p>
        </div>
        <MediaStrategy mediaData={campaign.media_strategy_data || campaign.mediaStrategy} />
      </section>
      
      {/* Activation Strategy Section */}
      <section className="mb-16 scroll-mt-24" id="activation">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">Activation Strategy</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Phased approach to building momentum and embedding the campaign in culture
          </p>
        </div>
        <ActivationStrategy 
          activationData={campaign.activation_strategy_data || campaign.activationStrategy} 
          campaignData={campaign} 
        />
      </section>
      

        </div>
        
        {/* Mobile Section Navigation */}
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <div className="bg-card/95 backdrop-blur-md rounded-full px-2 py-2 border border-border shadow-lg overflow-x-auto">
            <div className="flex gap-1 min-w-max px-2">
              <a href="#audience" className="px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer whitespace-nowrap">
                Audience
              </a>
              <a href="#journey" className="px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer whitespace-nowrap">
                Journey
              </a>
              <a href="#kpis" className="px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer whitespace-nowrap">
                KPIs
              </a>
              <a href="#creative" className="px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer whitespace-nowrap">
                Creative
              </a>
              <a href="#media" className="px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer whitespace-nowrap">
                Media
              </a>
              <a href="#activation" className="px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground rounded-full transition-colors cursor-pointer whitespace-nowrap">
                Activation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}