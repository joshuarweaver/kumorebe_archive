'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Download, Sparkles, ExternalLink, ImageIcon, Copy } from 'lucide-react';
import Image from 'next/image';

interface CreativeConcept {
  name: string;
  keyMessage: string;
  heroTreatment: string;
  visualDirection: string;
  formats: Array<{
    type: string;
    description: string;
  }>;
  participationHook: string;
  staticImage?: string;
  animatedImage?: string;
  midjourneyPrompt?: string;
  midjourneyUrl?: string;
}

interface EnhancedCreativeExecutionProps {
  concepts?: CreativeConcept[];
  campaignData?: any;
}

export default function EnhancedCreativeExecution({ concepts, campaignData }: EnhancedCreativeExecutionProps) {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localConcepts, setLocalConcepts] = useState<CreativeConcept[]>(concepts || []);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!concepts && campaignData) {
      generateConcepts();
    }
  }, [campaignData]);

  const generateConcepts = async () => {
    if (!campaignData) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/campaign/creative-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: campaignData.campaign_name || campaignData.summary_data?.campaign_name,
          bigIdea: campaignData.summary_data?.core_message || 'Transform culture through participation',
          tagline: campaignData.summary_data?.tagline || campaignData.tagline,
          brandValues: campaignData.brand_values || [],
          targetAudience: campaignData.target_audience || '',
          mediaFormats: ['TikTok Video', 'Instagram Reels', 'Digital Billboard', 'Interactive Web']
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      console.log('Response content-type:', contentType);
      console.log('Response status:', response.status);
      
      // Try to get response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!responseText) {
        throw new Error("Server returned empty response");
      }
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error("Server returned invalid JSON: " + responseText.substring(0, 100));
      }
      
      if (data.success) {
        setLocalConcepts(data.concepts);
      } else {
        throw new Error(data.error || 'Failed to generate concepts');
      }
    } catch (error) {
      console.error('Failed to generate concepts:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeConcept = localConcepts[activeConceptIndex];

  const nextConcept = () => {
    setActiveConceptIndex((prev) => (prev + 1) % localConcepts.length);
    setIsPlaying(false);
  };

  const prevConcept = () => {
    setActiveConceptIndex((prev) => (prev - 1 + localConcepts.length) % localConcepts.length);
    setIsPlaying(false);
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating creative concepts...</p>
        </div>
      </div>
    );
  }

  if (localConcepts.length === 0) {
    return (
      <div className="text-center py-24">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Creative Concepts Yet</h3>
        <p className="text-muted-foreground mb-6">Generate breakthrough creative executions for your campaign</p>
        <button
          onClick={generateConcepts}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Generate Creative Concepts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Concept Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={prevConcept}
            className="p-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Concept {activeConceptIndex + 1} of {localConcepts.length}</p>
            <h3 className="text-2xl font-medium">{activeConcept?.name}</h3>
          </div>
          <button
            onClick={nextConcept}
            className="p-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Concept Indicators */}
        <div className="flex gap-2">
          {localConcepts.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveConceptIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeConceptIndex 
                  ? 'w-8 bg-primary' 
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>

      {activeConcept && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Section */}
          <div className="space-y-4">
            {/* Main Visual */}
            <div className="relative aspect-video bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl overflow-hidden border border-border">
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-medium">Generate Visual with Midjourney</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Create stunning campaign visuals using our optimized prompt
                  </p>
                  {activeConcept.midjourneyPrompt && (
                    <a
                      href={`https://www.midjourney.com/imagine?prompt=${encodeURIComponent(activeConcept.midjourneyPrompt)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Generate in Midjourney
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Midjourney Prompt */}
            {activeConcept.midjourneyPrompt && (
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Midjourney Prompt</h4>
                    <p className="text-sm font-mono bg-background/50 p-3 rounded-lg break-all">
                      /imagine {activeConcept.midjourneyPrompt}
                    </p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(`/imagine ${activeConcept.midjourneyPrompt}`)}
                    className="p-2 hover:bg-background/50 rounded-lg transition-colors"
                    title="Copy prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Visual Direction */}
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
              <h4 className="text-lg font-medium mb-3 text-chartreuse-400">Visual Direction</h4>
              <p className="text-muted-foreground leading-relaxed">
                {activeConcept.visualDirection}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Key Message */}
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
              <h4 className="text-lg font-medium mb-3 text-chartreuse-500">Key Message</h4>
              <p className="text-xl leading-relaxed">
                "{activeConcept.keyMessage}"
              </p>
            </div>

            {/* Hero Treatment */}
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
              <h4 className="text-lg font-medium mb-3 text-chartreuse-400">Hero Treatment</h4>
              <p className="text-muted-foreground leading-relaxed">
                {activeConcept.heroTreatment}
              </p>
            </div>

            {/* Formats */}
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
              <h4 className="text-lg font-medium mb-4 text-chartreuse-500">Format Adaptations</h4>
              <div className="space-y-3">
                {activeConcept.formats.map((format, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded uppercase">
                      {format.type}
                    </span>
                    <p className="text-sm text-muted-foreground flex-1">
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation Hook */}
            <div className="bg-primary/10 backdrop-blur-sm p-6 rounded-xl border border-primary/20">
              <h4 className="text-lg font-medium mb-3 text-primary">Participation Hook</h4>
              <p className="text-muted-foreground leading-relaxed">
                {activeConcept.participationHook}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}