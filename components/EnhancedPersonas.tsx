'use client';

import { useState } from 'react';
import { User, Brain, Heart, TrendingUp, Target, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface Persona {
  name: string;
  age: string;
  occupation: string;
  location: string;
  bio: string;
  demographics: {
    income: string;
    education: string;
    lifestyle: string;
  };
  psychographics: {
    values: string[];
    motivations: string[];
    painPoints: string[];
    aspirations: string[];
  };
  behaviors: {
    mediaConsumption: string[];
    purchaseDrivers: string[];
    brandAffinities: string[];
    digitalPlatforms: string[];
  };
  quote: string;
  avatar?: string;
}

interface EnhancedPersonasProps {
  personas: Persona[];
}

export default function EnhancedPersonas({ personas }: EnhancedPersonasProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Generate default personas if not provided - now with 4 personas (2 primary, 2 secondary)
  const defaultPersonas: Persona[] = [
    {
      name: "Sarah Chen",
      age: "28-34",
      occupation: "Product Manager",
      location: "San Francisco, CA",
      bio: "Tech-savvy millennial balancing career ambitions with personal wellness. Early adopter who influences her social circle's purchasing decisions.",
      demographics: {
        income: "$85K-120K",
        education: "Bachelor's Degree",
        lifestyle: "Urban Professional"
      },
      psychographics: {
        values: ["Authenticity", "Innovation", "Sustainability", "Work-Life Balance"],
        motivations: ["Career Growth", "Social Impact", "Personal Development", "Community"],
        painPoints: ["Time Constraints", "Information Overload", "Authenticity Concerns", "Decision Fatigue"],
        aspirations: ["Leadership Role", "Financial Freedom", "Making a Difference", "Healthy Lifestyle"]
      },
      behaviors: {
        mediaConsumption: ["LinkedIn Daily", "Instagram Stories", "Podcasts", "Newsletter Subscriptions"],
        purchaseDrivers: ["Peer Reviews", "Brand Values", "Convenience", "Quality over Price"],
        brandAffinities: ["Apple", "Patagonia", "Oatly", "Peloton"],
        digitalPlatforms: ["Mobile-First", "Voice Assistants", "Streaming Services", "E-commerce Apps"]
      },
      quote: "I don't just buy products, I invest in brands that align with my values."
    },
    {
      name: "Marcus Thompson",
      age: "35-45",
      occupation: "Small Business Owner",
      location: "Austin, TX",
      bio: "Entrepreneurial Gen-X leader focused on growing his business while maintaining strong family connections. Values practical solutions and proven results.",
      demographics: {
        income: "$150K+",
        education: "MBA",
        lifestyle: "Family-Oriented Professional"
      },
      psychographics: {
        values: ["Family First", "Entrepreneurship", "Community Support", "Financial Security"],
        motivations: ["Business Success", "Legacy Building", "Family Well-being", "Local Impact"],
        painPoints: ["Time Management", "Scaling Challenges", "Work-Life Integration", "Economic Uncertainty"],
        aspirations: ["Business Expansion", "Early Retirement", "Children's Education", "Community Leadership"]
      },
      behaviors: {
        mediaConsumption: ["Business Podcasts", "LinkedIn", "Local News", "Industry Publications"],
        purchaseDrivers: ["ROI Focus", "Time Savings", "Reliability", "Local Support"],
        brandAffinities: ["Tesla", "American Express", "Salesforce", "Local Brands"],
        digitalPlatforms: ["Desktop & Mobile", "CRM Tools", "Video Conferencing", "Business Apps"]
      },
      quote: "Show me the value and I'll show you my loyalty."
    },
    {
      name: "Maya Patel",
      age: "22-28",
      occupation: "Content Creator",
      location: "Los Angeles, CA",
      bio: "Digital-native Gen Z influencer who creates authentic content around lifestyle and social causes. Champions transparency and uses platform for positive change.",
      demographics: {
        income: "$40K-75K",
        education: "Some College",
        lifestyle: "Creative Nomad"
      },
      psychographics: {
        values: ["Creativity", "Social Justice", "Mental Health", "Inclusivity"],
        motivations: ["Self-Expression", "Community Building", "Social Change", "Creative Freedom"],
        painPoints: ["Algorithm Changes", "Burnout", "Monetization Pressure", "Authenticity Balance"],
        aspirations: ["Platform Growth", "Brand Partnerships", "Social Impact", "Creative Independence"]
      },
      behaviors: {
        mediaConsumption: ["TikTok Creator", "Instagram Reels", "YouTube Shorts", "BeReal"],
        purchaseDrivers: ["Brand Story", "Ethical Practices", "Community Reviews", "Aesthetic Appeal"],
        brandAffinities: ["Glossier", "Reformation", "Oat Milk Brands", "Vintage Shops"],
        digitalPlatforms: ["Content Creation Tools", "Social Commerce", "NFT Platforms", "Discord Communities"]
      },
      quote: "If your brand doesn't stand for something, it stands for nothing."
    },
    {
      name: "David Kim",
      age: "45-55",
      occupation: "Corporate Executive",
      location: "New York, NY",
      bio: "C-suite leader navigating digital transformation while maintaining work-life balance. Values efficiency, quality, and meaningful professional relationships.",
      demographics: {
        income: "$250K+",
        education: "Graduate Degree",
        lifestyle: "Luxury Professional"
      },
      psychographics: {
        values: ["Excellence", "Integrity", "Innovation", "Legacy"],
        motivations: ["Industry Leadership", "Team Development", "Strategic Growth", "Personal Legacy"],
        painPoints: ["Digital Disruption", "Talent Retention", "Work-Life Balance", "Rapid Change"],
        aspirations: ["Board Positions", "Thought Leadership", "Mentorship Impact", "Strategic Exits"]
      },
      behaviors: {
        mediaConsumption: ["Wall Street Journal", "LinkedIn", "Podcasts", "Bloomberg"],
        purchaseDrivers: ["Time Savings", "Premium Quality", "Exclusive Access", "Expert Recommendations"],
        brandAffinities: ["Rolex", "Mercedes-Benz", "Amex Platinum", "Four Seasons"],
        digitalPlatforms: ["LinkedIn Premium", "Executive Apps", "Private Networks", "Investment Platforms"]
      },
      quote: "Excellence is not a destination but a continuous journey of improvement."
    }
  ];

  const displayPersonas = personas.length > 0 ? personas : defaultPersonas;
  const totalPages = Math.ceil(displayPersonas.length / 2);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  const currentPersonas = displayPersonas.slice(currentPage * 2, (currentPage + 1) * 2);

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light mb-4">Target Audience Personas</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Deep understanding of our core audiences drives strategic precision and authentic connection
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
          aria-label="Previous personas"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
          aria-label="Next personas"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentPage ? 'w-8 bg-green-500' : 'bg-neutral-600'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
        
        {/* Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentPersonas.map((persona, index) => {
            const globalIndex = currentPage * 2 + index;
            const isPrimary = globalIndex < 2;
            return (
              <div key={index} className="bg-neutral-900 rounded-xl p-8 border border-neutral-800 hover:border-neutral-700 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{persona.name}</h3>
                      <p className="text-neutral-400">{persona.age} • {persona.occupation}</p>
                      <p className="text-sm text-neutral-500">{persona.location}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${isPrimary ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {isPrimary ? 'Primary' : 'Secondary'}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-neutral-300 mb-6 italic">"{persona.bio}"</p>

                {/* Demographics */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-sm font-medium mb-3 text-neutral-300">
                    <Users className="w-4 h-4" /> Demographics
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-800 rounded-lg px-3 py-2">
                      <p className="text-xs text-neutral-500">Income</p>
                      <p className="text-sm">{persona.demographics.income}</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg px-3 py-2">
                      <p className="text-xs text-neutral-500">Education</p>
                      <p className="text-sm">{persona.demographics.education}</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg px-3 py-2">
                      <p className="text-xs text-neutral-500">Lifestyle</p>
                      <p className="text-sm">{persona.demographics.lifestyle}</p>
                    </div>
                  </div>
                </div>

                {/* Psychographics */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-sm font-medium mb-3 text-neutral-300">
                    <Brain className="w-4 h-4" /> Psychographics
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Core Values</p>
                      <div className="flex flex-wrap gap-2">
                        {persona.psychographics.values.map((value, i) => (
                          <span key={i} className="px-2 py-1 bg-neutral-800 rounded text-xs">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Key Motivations</p>
                      <div className="flex flex-wrap gap-2">
                        {persona.psychographics.motivations.map((motivation, i) => (
                          <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">
                            {motivation}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Pain Points</p>
                      <div className="flex flex-wrap gap-2">
                        {persona.psychographics.painPoints.map((pain, i) => (
                          <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                            {pain}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behaviors */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-sm font-medium mb-3 text-neutral-300">
                    <TrendingUp className="w-4 h-4" /> Behaviors
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Media Habits</p>
                      <ul className="space-y-1">
                        {persona.behaviors.mediaConsumption.slice(0, 2).map((media, i) => (
                          <li key={i} className="text-neutral-400 text-xs">• {media}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Purchase Drivers</p>
                      <ul className="space-y-1">
                        {persona.behaviors.purchaseDrivers.slice(0, 2).map((driver, i) => (
                          <li key={i} className="text-neutral-400 text-xs">• {driver}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="pt-6 border-t border-neutral-800">
                  <p className="text-green-400 italic text-sm flex items-start">
                    <Heart className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    "{persona.quote}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights Summary */}
      <div className="mt-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-neutral-800">
        <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
          <Target className="w-5 h-5 text-green-400" />
          Strategic Audience Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-400 mb-1">Common Ground</p>
            <p className="text-neutral-200">Value authenticity, seek meaningful connections, digital-first engagement</p>
          </div>
          <div>
            <p className="text-neutral-400 mb-1">Key Differences</p>
            <p className="text-neutral-200">Life stage priorities, media consumption patterns, decision-making processes</p>
          </div>
          <div>
            <p className="text-neutral-400 mb-1">Activation Strategy</p>
            <p className="text-neutral-200">Multi-channel approach with persona-specific messaging and touchpoints</p>
          </div>
        </div>
      </div>
    </div>
  );
}