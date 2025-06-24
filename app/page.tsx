'use client';

import { useState, useEffect, useRef } from 'react';

const examples = [
  "overthrow big tech's monopoly on truth",
  "make sustainability sexier than consumption", 
  "turn mental health into a cultural revolution",
  "destroy fast fashion with radical transparency",
  "make banking actually human",
  "reimagine education as rebellion"
];

export default function Home() {
  const [phase, setPhase] = useState<'input' | 'loading' | 'result'>('input');
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [campaign, setCampaign] = useState<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    let j = 0;
    let currentExample = 0;
    let deleting = false;
    
    const type = () => {
      const example = examples[currentExample];
      
      if (!deleting) {
        if (j <= example.length) {
          setPlaceholder(example.substring(0, j));
          j++;
        } else {
          deleting = true;
          setTimeout(() => {}, 2000);
        }
      } else {
        if (j > 0) {
          setPlaceholder(example.substring(0, j - 1));
          j--;
        } else {
          deleting = false;
          currentExample = (currentExample + 1) % examples.length;
        }
      }
    };
    
    const interval = setInterval(type, deleting ? 30 : 80);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setPhase('loading');
    
    // Parse the input to extract campaign details
    const brandMatch = input.match(/(?:for|by|@)\s+(\w+)/i);
    const brandName = brandMatch ? brandMatch[1] : 'Disruptor';
    
    const payload = {
      brandId: `brand-${Date.now()}`,
      brandName,
      industry: detectIndustry(input),
      targetAudience: "Culture creators and change makers",
      objectives: ["Create cultural disruption", "Build authentic community", "Drive systemic change"],
      brandValues: ["Radical honesty", "Bold action", "Authentic rebellion"],
      brandArchetype: "rebel",
      riskTolerance: "high"
    };
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        setCampaign(data.campaign);
        setPhase('result');
      }
    } catch (error) {
      console.error('Error:', error);
      setPhase('input');
    }
  };
  
  const detectIndustry = (text: string): string => {
    const industries: Record<string, string[]> = {
      'technology': ['tech', 'app', 'platform', 'digital', 'software'],
      'fashion': ['fashion', 'clothing', 'style', 'wear', 'apparel'],
      'finance': ['banking', 'finance', 'money', 'payment', 'invest'],
      'health': ['health', 'wellness', 'mental', 'medical', 'care'],
      'education': ['education', 'learning', 'school', 'teach', 'study'],
      'food': ['food', 'restaurant', 'eat', 'drink', 'coffee'],
    };
    
    const lowercaseText = text.toLowerCase();
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        return industry;
      }
    }
    return 'consumer';
  };
  
  if (phase === 'result' && campaign) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="absolute top-8 right-8">
          <h1 className="text-xl font-chillax font-medium">kumorebe</h1>
        </div>
        
        <div className="max-w-4xl mx-auto px-8 py-24">
          <div className="mb-16">
            <h2 className="text-6xl font-light mb-4">{campaign.summary?.campaignName || 'Untitled Campaign'}</h2>
            <p className="text-2xl text-neutral-500">{campaign.summary?.tagline || ''}</p>
          </div>
          
          <div className="space-y-12">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-600 mb-3">The Idea</h3>
              <p className="text-xl leading-relaxed">{campaign.summary?.bigIdea || ''}</p>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-600 mb-3">The Audience</h3>
              <p className="text-lg text-neutral-300">{campaign.audience?.primaryPersona?.psychographics || ''}</p>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-600 mb-3">The Impact</h3>
              <p className="text-lg text-neutral-300">{campaign.kpis?.northStarMetric?.metric || ''}: <span className="text-white">{campaign.kpis?.northStarMetric?.target || ''}</span></p>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-wider text-neutral-600 mb-3">The Execution</h3>
              <p className="text-lg text-neutral-300">{campaign.creative?.heroConcept?.narrative || ''}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setPhase('input');
              setCampaign(null);
              setInput('');
            }}
            className="mt-20 text-neutral-500 hover:text-white transition-colors"
          >
            create another →
          </button>
        </div>
      </main>
    );
  }
  
  if (phase === 'loading') {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-light animate-pulse">creating...</div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute top-8 left-8">
        <h1 className="text-xl font-chillax font-medium">kumorebe</h1>
      </div>
      <div className="absolute top-8 right-8 flex items-center gap-6">
        <button className="text-sm text-neutral-500 hover:text-white transition-colors">
          Pricing
        </button>
        <button className="text-sm text-neutral-500 hover:text-white transition-colors">
          Log in
        </button>
        <button className="text-sm bg-white text-black px-4 py-2 rounded hover:bg-neutral-200 transition-colors">
          Sign up
        </button>
      </div>
      
      <div className="min-h-screen flex items-center justify-center px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            maxLength={2100}
            className="w-full bg-transparent border-b border-neutral-800 focus:border-neutral-600 outline-none text-3xl font-light py-4 placeholder-neutral-800 transition-colors resize-none h-32"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-neutral-600">{input.length} / 2100</span>
            <span className="text-sm text-neutral-500">press cmd+enter →</span>
          </div>
        </form>
      </div>
    </main>
  );
}