'use client';

import { Zap, Users, Globe, Smartphone, Calendar, TrendingUp, Target, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ActivationStrategyProps {
  activationData?: any;
  campaignData?: any;
}

export default function ActivationStrategy({ activationData, campaignData }: ActivationStrategyProps) {
  // Extract activation phases from activation data or use defaults
  const phases = activationData?.phases || [
    {
      name: 'Phase 1: Cultural Seeding',
      duration: '2 weeks',
      description: 'Partner with cultural insiders and micro-influencers to seed the movement authentically',
      tactics: ['Influencer briefings', 'Exclusive previews', 'Behind-the-scenes content', 'Whisper campaigns'],
      kpis: ['Reach: 500K', 'Engagement: 15%', 'Earned media: 20 placements']
    },
    {
      name: 'Phase 2: Mass Ignition',
      duration: '4 weeks',
      description: 'Launch hero creative and activate participation mechanics across all channels',
      tactics: ['Hero film release', 'AR/filter launch', 'Creator challenges', 'Paid amplification'],
      kpis: ['Reach: 10M', 'Participation: 100K', 'Share rate: 25%']
    },
    {
      name: 'Phase 3: Community Amplification',
      duration: '8 weeks',
      description: 'Empower community to co-create and spread the movement organically',
      tactics: ['UGC contests', 'Creator funds', 'Real-world activations', 'Partnership integrations'],
      kpis: ['UGC pieces: 50K', 'Community growth: 300%', 'Advocacy score: 8.5/10']
    },
    {
      name: 'Phase 4: Cultural Institution',
      duration: 'Ongoing',
      description: 'Embed the movement into culture as a permanent fixture',
      tactics: ['Documentary content', 'Platform partnerships', 'Educational programs', 'Annual events'],
      kpis: ['Brand lift: 45%', 'Cultural relevance: Top 10', 'LTV increase: 35%']
    }
  ];

  // Momentum curve data
  const momentumData = [
    { week: 'W1', awareness: 5, engagement: 8, participation: 3 },
    { week: 'W2', awareness: 15, engagement: 20, participation: 10 },
    { week: 'W3', awareness: 35, engagement: 45, participation: 25 },
    { week: 'W4', awareness: 60, engagement: 70, participation: 45 },
    { week: 'W5', awareness: 75, engagement: 85, participation: 65 },
    { week: 'W6', awareness: 85, engagement: 90, participation: 80 },
    { week: 'W7', awareness: 90, engagement: 88, participation: 85 },
    { week: 'W8', awareness: 92, engagement: 85, participation: 88 },
    { week: 'W12', awareness: 95, engagement: 80, participation: 90 },
  ];

  // Influencer tiers
  const influencerTiers = activationData?.influencerTiers || [
    {
      tier: 'Mega Influencers',
      count: '5-10',
      reach: '10M+',
      role: 'Campaign ambassadors, hero content',
      investment: '40%'
    },
    {
      tier: 'Macro Influencers',
      count: '20-30',
      reach: '500K-1M',
      role: 'Category authority, niche audiences',
      investment: '30%'
    },
    {
      tier: 'Micro Influencers',
      count: '100-200',
      reach: '10K-100K',
      role: 'Authentic advocacy, community building',
      investment: '20%'
    },
    {
      tier: 'Nano Army',
      count: '1000+',
      reach: '1K-10K',
      role: 'Grassroots spread, hyper-local activation',
      investment: '10%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Activation Timeline */}
      <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
        <h3 className="text-2xl font-medium mb-8">Activation Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-chartreuse-500 to-chartreuse-300"></div>
          
          {/* Phases */}
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="relative flex gap-6">
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-chartreuse-500 rounded-full border-4 border-background"></div>
                
                {/* Phase content */}
                <div className="flex-1 ml-16">
                  <div className="bg-card/80 p-6 rounded-xl border border-border hover:border-chartreuse-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-chartreuse-400">{phase.name}</h4>
                        <p className="text-sm text-muted-foreground">{phase.duration}</p>
                      </div>
                      <Zap className="w-5 h-5 text-chartreuse-500" />
                    </div>
                    <p className="text-muted-foreground mb-4">{phase.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Key Tactics</p>
                        <ul className="space-y-1">
                          {phase.tactics.map((tactic: string, i: number) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="w-1 h-1 bg-chartreuse-400 rounded-full"></span>
                              {tactic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Success Metrics</p>
                        <ul className="space-y-1">
                          {phase.kpis.map((kpi: string, i: number) => (
                            <li key={i} className="text-sm text-chartreuse-300">{kpi}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Momentum Curve */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
        <h3 className="text-xl font-medium mb-6">Campaign Momentum Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={momentumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="week" stroke="rgb(var(--muted-foreground))" />
            <YAxis stroke="rgb(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(var(--card))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area type="monotone" dataKey="awareness" stackId="1" stroke="rgb(var(--chartreuse-500))" fill="rgb(var(--chartreuse-500))" fillOpacity={0.3} />
            <Area type="monotone" dataKey="engagement" stackId="1" stroke="rgb(var(--chartreuse-400))" fill="rgb(var(--chartreuse-400))" fillOpacity={0.3} />
            <Area type="monotone" dataKey="participation" stackId="1" stroke="rgb(var(--chartreuse-300))" fill="rgb(var(--chartreuse-300))" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chartreuse-500"></div>
            <span className="text-sm text-muted-foreground">Awareness</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chartreuse-400"></div>
            <span className="text-sm text-muted-foreground">Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chartreuse-300"></div>
            <span className="text-sm text-muted-foreground">Participation</span>
          </div>
        </div>
      </div>

      {/* Influencer Strategy */}
      <div>
        <h3 className="text-xl font-medium mb-6">Influencer Activation Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {influencerTiers.map((tier, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-5 h-5 text-chartreuse-400" />
                <span className="text-sm font-medium text-chartreuse-500">{tier.investment}</span>
              </div>
              <h4 className="font-medium mb-2">{tier.tier}</h4>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">Count:</span> {tier.count}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Reach:</span> {tier.reach}
                </p>
                <p className="text-muted-foreground text-xs mt-3">
                  {tier.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-World Activations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-chartreuse-500/10 to-chartreuse-600/5 p-6 rounded-xl border border-chartreuse-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-chartreuse-500" />
            <h3 className="text-lg font-medium">Real-World Activations</h3>
          </div>
          <ul className="space-y-3">
            {(activationData?.realWorldActivations || [
              { type: 'Pop-Up Activation', concept: 'Interactive brand installations in high-traffic areas' },
              { type: 'Street Activation', concept: 'Guerrilla marketing and sampling campaigns' },
              { type: 'Event Activation', concept: 'Integration with cultural moments and festivals' }
            ]).map((activation, index) => (
              <li key={index} className="flex items-start gap-3">
                <Target className="w-4 h-4 text-chartreuse-400 mt-0.5" />
                <div>
                  <p className="font-medium">{activation.type}</p>
                  <p className="text-sm text-muted-foreground">{activation.concept}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-chartreuse-400/10 to-chartreuse-500/5 p-6 rounded-xl border border-chartreuse-400/20">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-6 h-6 text-chartreuse-400" />
            <h3 className="text-lg font-medium">Digital Experiences</h3>
          </div>
          <ul className="space-y-3">
            {(activationData?.digitalExperiences || [
              { type: 'AR/VR', description: 'Immersive brand world exploration' },
              { type: 'Gamification', description: 'Reward-based participation mechanics' },
              { type: 'AI Personalization', description: 'Custom content generation for each user' }
            ]).map((experience, index) => (
              <li key={index} className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-chartreuse-500 mt-0.5" />
                <div>
                  <p className="font-medium">{experience.type}</p>
                  <p className="text-sm text-muted-foreground">{experience.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Success Criteria */}
      <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
        <h3 className="text-xl font-medium mb-6">Activation Success Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-chartreuse-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-chartreuse-500" />
            </div>
            <h4 className="font-medium mb-2">Reach Metrics</h4>
            <p className="text-sm text-muted-foreground">100M+ impressions</p>
            <p className="text-sm text-muted-foreground">25M+ unique reach</p>
            <p className="text-sm text-muted-foreground">15+ markets activated</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-chartreuse-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-chartreuse-400" />
            </div>
            <h4 className="font-medium mb-2">Engagement Goals</h4>
            <p className="text-sm text-muted-foreground">1M+ participants</p>
            <p className="text-sm text-muted-foreground">50K+ UGC pieces</p>
            <p className="text-sm text-muted-foreground">25% share rate</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-chartreuse-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-chartreuse-300" />
            </div>
            <h4 className="font-medium mb-2">Business Impact</h4>
            <p className="text-sm text-muted-foreground">45% brand lift</p>
            <p className="text-sm text-muted-foreground">30% purchase intent</p>
            <p className="text-sm text-muted-foreground">8.5 NPS increase</p>
          </div>
        </div>
      </div>
    </div>
  );
}