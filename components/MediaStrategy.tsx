'use client';

import { BarChart3, TrendingUp, Users, Share2, Calendar, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface MediaStrategyProps {
  mediaData?: any;
}

export default function MediaStrategy({ mediaData }: MediaStrategyProps) {
  // Extract data from mediaData or use defaults
  const channelStrategy = mediaData?.channelStrategy || {
    hero: 'TikTok & Instagram Reels for viral moment creation',
    hub: 'YouTube & Twitter for community building',
    hygiene: 'LinkedIn & Facebook for brand presence'
  };

  const mediaMix = mediaData?.mediaMix || {
    paid: '40% - Strategic placements on hero platforms',
    owned: '25% - Brand channels and website',
    earned: '20% - Influencer and PR outreach',
    shared: '15% - User-generated content'
  };

  const platformTactics = mediaData?.platformTactics || [
    {
      platform: 'TikTok',
      format: 'Native vertical videos, challenges',
      frequency: '2-3x daily during launch',
      tactics: 'Creator partnerships, trending sounds'
    },
    {
      platform: 'Instagram',
      format: 'Reels, Stories, carousel posts',
      frequency: 'Daily posts, 3-4 stories',
      tactics: 'AR filters, shoppable posts'
    },
    {
      platform: 'YouTube',
      format: 'Long-form content, Shorts',
      frequency: 'Weekly hero content, daily Shorts',
      tactics: 'Pre-roll ads, creator collabs'
    }
  ];

  // Data for charts
  const budgetAllocationData = [
    { name: 'Hero Channels', value: parseInt(channelStrategy.heroPercentage) || 45, color: 'rgb(var(--chartreuse-500))' },
    { name: 'Hub Channels', value: parseInt(channelStrategy.hubPercentage) || 35, color: 'rgb(var(--chartreuse-400))' },
    { name: 'Hygiene Channels', value: parseInt(channelStrategy.hygienePercentage) || 20, color: 'rgb(var(--chartreuse-300))' }
  ];

  const mediaMixData = [
    { type: 'Paid', percentage: 40 },
    { type: 'Owned', percentage: 25 },
    { type: 'Earned', percentage: 20 },
    { type: 'Shared', percentage: 15 }
  ];

  const platformReachData = [
    { platform: 'TikTok', reach: 85, engagement: 92, conversion: 78 },
    { platform: 'Instagram', reach: 78, engagement: 85, conversion: 72 },
    { platform: 'YouTube', reach: 65, engagement: 70, conversion: 68 },
    { platform: 'Twitter', reach: 55, engagement: 60, conversion: 45 },
    { platform: 'LinkedIn', reach: 40, engagement: 35, conversion: 55 }
  ];

  return (
    <div className="space-y-8">
      {/* Channel Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-chartreuse-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-chartreuse-500/20 rounded-lg">
              <Target className="w-5 h-5 text-chartreuse-500" />
            </div>
            <h3 className="text-lg font-medium">Hero Channels</h3>
            <span className="ml-auto text-sm text-muted-foreground">45%</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {channelStrategy.hero}
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-chartreuse-400/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-chartreuse-400/20 rounded-lg">
              <Users className="w-5 h-5 text-chartreuse-400" />
            </div>
            <h3 className="text-lg font-medium">Hub Channels</h3>
            <span className="ml-auto text-sm text-muted-foreground">35%</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {channelStrategy.hub}
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-chartreuse-300/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-chartreuse-300/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-chartreuse-300" />
            </div>
            <h3 className="text-lg font-medium">Hygiene Channels</h3>
            <span className="ml-auto text-sm text-muted-foreground">20%</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {channelStrategy.hygiene}
          </p>
        </div>
      </div>

      {/* Budget Allocation & Media Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Allocation Pie Chart */}
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
          <h3 className="text-xl font-medium mb-6">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Media Mix Bar Chart */}
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
          <h3 className="text-xl font-medium mb-6">PESO Media Mix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mediaMixData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="type" stroke="rgb(var(--muted-foreground))" />
              <YAxis stroke="rgb(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(var(--card))',
                  border: '1px solid rgb(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="percentage" fill="rgb(var(--chartreuse-500))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-muted-foreground"><span className="font-medium">Paid:</span> {mediaMix.paid}</p>
            <p className="text-muted-foreground"><span className="font-medium">Owned:</span> {mediaMix.owned}</p>
            <p className="text-muted-foreground"><span className="font-medium">Earned:</span> {mediaMix.earned}</p>
            <p className="text-muted-foreground"><span className="font-medium">Shared:</span> {mediaMix.shared}</p>
          </div>
        </div>
      </div>

      {/* Platform Performance Radar */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
        <h3 className="text-xl font-medium mb-6">Platform Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={platformReachData}>
            <PolarGrid stroke="rgb(var(--border))" />
            <PolarAngleAxis dataKey="platform" stroke="rgb(var(--muted-foreground))" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgb(var(--muted-foreground))" />
            <Radar name="Reach" dataKey="reach" stroke="rgb(var(--chartreuse-500))" fill="rgb(var(--chartreuse-500))" fillOpacity={0.3} />
            <Radar name="Engagement" dataKey="engagement" stroke="rgb(var(--chartreuse-400))" fill="rgb(var(--chartreuse-400))" fillOpacity={0.3} />
            <Radar name="Conversion" dataKey="conversion" stroke="rgb(var(--chartreuse-300))" fill="rgb(var(--chartreuse-300))" fillOpacity={0.3} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Tactics */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Platform-Specific Tactics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformTactics.map((platform, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
              <h4 className="text-lg font-medium mb-3 text-chartreuse-400">{platform.platform}</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Format</p>
                  <p className="text-sm">{platform.format}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Frequency</p>
                  <p className="text-sm">{platform.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tactics</p>
                  <p className="text-sm">{platform.tactics}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Calendar Preview */}
      <div className="bg-gradient-to-br from-chartreuse-500/10 to-chartreuse-600/5 p-8 rounded-xl border border-chartreuse-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-chartreuse-500" />
          <h3 className="text-xl font-medium">Launch Sequence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-chartreuse-400">Week 1: Ignition</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Teaser content across hero channels</li>
              <li>• Influencer seeding begins</li>
              <li>• AR filter launch</li>
              <li>• Paid amplification starts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-chartreuse-400">Week 2-3: Amplification</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Hero content release</li>
              <li>• Creator challenge activation</li>
              <li>• UGC contests begin</li>
              <li>• Cross-platform storytelling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-chartreuse-400">Week 4+: Sustain</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Community management focus</li>
              <li>• Performance optimization</li>
              <li>• Trend-jacking opportunities</li>
              <li>• Long-form content release</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}