'use client';

import { useState, useEffect, useRef } from 'react';

// Initial examples - will be replaced by dynamic AI-generated ones
const defaultExamples = [
  "Create a luxury sustainable fashion brand that makes eco-conscious choices more desirable than fast fashion by partnering with Gen Z influencers",
  "Build a mental health platform that gamifies therapy and creates social challenges where vulnerability becomes a superpower among young professionals",
  "Launch a banking app for Gen Z that shows exactly how banks profit from their money and offers transparent alternatives for building wealth"
];

export default function Home() {
  const [phase, setPhase] = useState<'input' | 'loading' | 'result'>('input');
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [campaign, setCampaign] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [examples, setExamples] = useState(defaultExamples);
  const [taglineWord, setTaglineWord] = useState('brand');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Fetch dynamic prompts on mount
  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => {
        if (data.prompts && data.prompts.length > 0) {
          setExamples(data.prompts);
        }
      })
      .catch(err => console.error('Failed to load prompts:', err));
  }, []);
  
  // Tagline word rotation
  useEffect(() => {
    const words = ['brand', 'campaign', 'platform', 'program', 'business'];
    let currentIndex = 0;
    
    const rotateWord = () => {
      currentIndex = (currentIndex + 1) % words.length;
      setTaglineWord(words[currentIndex]);
    };
    
    const interval = setInterval(rotateWord, 2000);
    return () => clearInterval(interval);
  }, []);
  
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
        }
      } else {
        // Delete much faster - delete 10 chars at a time
        j = Math.max(0, j - 10);
        setPlaceholder(example.substring(0, j));
        
        if (j === 0) {
          deleting = false;
          currentExample = (currentExample + 1) % examples.length;
        }
      }
    };
    
    const interval = setInterval(type, deleting ? 20 : 60);
    return () => clearInterval(interval);
  }, [examples]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input, placeholder]);
  
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
        <h1 className="text-2xl font-chillax font-medium">kumorebe</h1>
        <p className="text-base text-neutral-500 mt-1 font-satoshi">
          build a <span className="text-white transition-all duration-300">{taglineWord}</span>
        </p>
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
        <form onSubmit={handleSubmit} className="w-full max-w-4xl relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            maxLength={2100}
            className="w-full bg-transparent border-b border-neutral-800 focus:border-neutral-600 outline-none text-3xl font-light py-4 placeholder-neutral-800 transition-colors resize-none overflow-hidden min-h-[48px]"
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
          
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => setShowOverlay(true)}
              className="text-sm text-neutral-500 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-600 px-4 py-2 rounded"
            >
              What is this?
            </button>
            <button
              type="button"
              onClick={async () => {
                // Fetch fresh prompts for randomize
                try {
                  const res = await fetch('/api/prompts');
                  const data = await res.json();
                  if (data.prompts && data.prompts.length > 0) {
                    const randomExample = data.prompts[Math.floor(Math.random() * data.prompts.length)];
                    setInput(randomExample);
                    setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                  }
                } catch (err) {
                  // Fallback to current examples
                  const randomExample = examples[Math.floor(Math.random() * examples.length)];
                  setInput(randomExample);
                  setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                }
              }}
              className="text-sm text-neutral-500 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-600 px-4 py-2 rounded"
            >
              Randomize
            </button>
          </div>
        </form>
      </div>
      
      {showOverlay && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-8" onClick={() => setShowOverlay(false)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-3xl font-light mb-8">How Kumorebe Works</h2>
            
            <div className="space-y-6 text-neutral-300">
              <div>
                <h3 className="text-white font-medium mb-2">Strategy-First AI</h3>
                <p className="text-sm leading-relaxed">Unlike typical AI tools that generate generic content, Kumorebe thinks like a Chief Strategy Officer. It identifies cultural tensions, finds ideological opportunities, and creates campaigns that catalyze movements.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">How to Use</h3>
                <p className="text-sm leading-relaxed">Describe your campaign vision in detail. Include your brand, target audience, the problem you're solving, and the cultural shift you want to create. The more context you provide, the more breakthrough your campaign will be.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">What You Get</h3>
                <p className="text-sm leading-relaxed">A complete campaign strategy including the big idea, target audience personas, KPIs, media strategy, and creative concepts. Every element is designed to create cultural impact, not just impressions.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Tips for Best Results</h3>
                <ul className="text-sm leading-relaxed space-y-1">
                  <li>• Be specific about the cultural tension you want to address</li>
                  <li>• Include your brand values and what makes you different</li>
                  <li>• Describe your audience's beliefs, not just demographics</li>
                  <li>• Think about the change you want to see in the world</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowOverlay(false)}
              className="mt-8 text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Got it →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}