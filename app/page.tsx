'use client';

import { useState, useEffect, useRef } from 'react';

// Initial examples - will be replaced by dynamic AI-generated ones
const defaultExamples = [
  "Create a luxury sustainable fashion brand that makes eco-conscious choices more desirable than fast fashion by partnering with Gen Z influencers",
  "Build a mental health platform that gamifies therapy and creates social challenges where vulnerability becomes a superpower among young professionals",
  "Launch a banking app for Gen Z that shows exactly how banks profit from their money and offers transparent alternatives for building wealth"
];

export default function Home() {
  const [phase, setPhase] = useState<'input' | 'loading'>('input');
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('');
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
    
    // Use the full input as the campaign brief
    const payload = {
      brandId: `campaign-${Date.now()}`,
      brandName: 'Campaign Brief', // Generic name since it's an open prompt
      campaignBrief: input, // Send the full input to the API
      industry: detectIndustry(input),
      targetAudience: extractTargetAudience(input),
      objectives: extractObjectives(input),
      brandValues: extractBrandValues(input),
      brandArchetype: extractArchetype(input),
      riskTolerance: extractRiskTolerance(input)
    };
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        // Redirect to the campaign page using the slug or ID
        const campaignUrl = data.campaignSlug 
          ? `/campaign/${data.campaignSlug}`
          : `/campaign/${data.campaignId}`;
        window.location.href = campaignUrl;
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


  const extractTargetAudience = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('gen z')) return 'Gen Z digital natives';
    if (lowercaseText.includes('millennial')) return 'Millennials seeking authenticity';
    if (lowercaseText.includes('professional')) return 'Young professionals';
    if (lowercaseText.includes('creator')) return 'Content creators and influencers';
    if (lowercaseText.includes('activist')) return 'Social activists and change makers';
    
    return 'Culture creators and conscious consumers';
  };

  const extractObjectives = (text: string): string[] => {
    const objectives = [];
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('awareness') || lowercaseText.includes('brand')) {
      objectives.push('Increase brand awareness');
    }
    if (lowercaseText.includes('community') || lowercaseText.includes('social')) {
      objectives.push('Build authentic community');
    }
    if (lowercaseText.includes('change') || lowercaseText.includes('disrupt')) {
      objectives.push('Drive cultural change');
    }
    if (lowercaseText.includes('engagement') || lowercaseText.includes('participate')) {
      objectives.push('Maximize engagement');
    }
    
    return objectives.length > 0 ? objectives : ['Create cultural impact', 'Build engaged community'];
  };

  const extractBrandValues = (text: string): string[] => {
    const values = [];
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('authentic') || lowercaseText.includes('real')) {
      values.push('Authenticity');
    }
    if (lowercaseText.includes('sustainable') || lowercaseText.includes('environment')) {
      values.push('Sustainability');
    }
    if (lowercaseText.includes('transparent') || lowercaseText.includes('honest')) {
      values.push('Transparency');
    }
    if (lowercaseText.includes('innovation') || lowercaseText.includes('creative')) {
      values.push('Innovation');
    }
    if (lowercaseText.includes('community') || lowercaseText.includes('together')) {
      values.push('Community');
    }
    
    return values.length > 0 ? values : ['Authenticity', 'Innovation', 'Community'];
  };

  const extractArchetype = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('disrupt') || lowercaseText.includes('challenge') || lowercaseText.includes('break')) {
      return 'rebel';
    }
    if (lowercaseText.includes('help') || lowercaseText.includes('solve') || lowercaseText.includes('support')) {
      return 'caregiver';
    }
    if (lowercaseText.includes('create') || lowercaseText.includes('build') || lowercaseText.includes('make')) {
      return 'creator';
    }
    if (lowercaseText.includes('explore') || lowercaseText.includes('discover') || lowercaseText.includes('adventure')) {
      return 'explorer';
    }
    if (lowercaseText.includes('lead') || lowercaseText.includes('inspire') || lowercaseText.includes('empower')) {
      return 'hero';
    }
    
    return 'creator';
  };

  const extractRiskTolerance = (text: string): 'low' | 'medium' | 'high' => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('bold') || lowercaseText.includes('radical') || lowercaseText.includes('revolutionary')) {
      return 'high';
    }
    if (lowercaseText.includes('safe') || lowercaseText.includes('traditional') || lowercaseText.includes('conservative')) {
      return 'low';
    }
    
    return 'medium';
  };
  
  
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
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-neutral-600">{input.length} / 2100</span>
            <button 
              type="submit"
              className="text-sm text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              press enter ↵
            </button>
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