# CLAUDE.md - Kumorebe AI Campaign Generator

## Overview

Kumorebe is a first-to-market, strategy-first AI marketing campaign generator that transcends traditional content creation to deliver genuine strategic innovation. Unlike existing AI marketing tools that focus on tactical execution, Kumorebe thinks like a Chief Strategy Officer, identifying cultural tensions, violating industry conventions purposefully, and creating campaigns that invite participation rather than passive consumption.

## Core Philosophy

**"Think Strategy, Not Content"**

Kumorebe operates on the principle that breakthrough marketing campaigns emerge from:
- Strategic insight into cultural tensions
- Purposeful violation of category conventions
- Authentic alignment with brand values
- Participation architectures that engage audiences as co-creators
- Real-time adaptation to market dynamics

## User Interface Architecture

### Campaign Generation Flow

The application features a single-page campaign experience with the following key components:

1. **Homepage**: Streamlined input form capturing brand details, campaign goals, and inspiration with dynamic, animated UI elements

2. **Campaign Page**: Consolidated single-page view with:
   - Strategic Overview with comprehensive target audience descriptions and Cultural Impact Score
   - Enhanced Personas carousel showcasing 4 detailed personas (2 primary, 2 secondary)
   - Interactive Consumer Journey with both funnel visualization and editable flow chart
   - Comprehensive KPI Framework with industry benchmarks and AI-generated roadmaps
   - Creative Execution guidelines with strategic narrative
   - Sticky navigation for easy section access

### Visual Design System

The application employs a modern, glassmorphic design language:
- **Dark theme foundation** with neutral-950 backgrounds
- **Glassmorphism effects** using backdrop-blur and semi-transparent overlays
- **Gradient accents** for emphasis and visual hierarchy
- **shadcn/ui components** for consistent, modern UI elements
- **Recharts** for all data visualizations instead of Chart.js
- **Smooth animations** and hover effects throughout

### Key UI Components

#### EnhancedPersonas
- Carousel navigation showing 2 personas at a time
- Comprehensive persona cards with demographics, psychographics, behaviors, and digital footprint
- Visual distinction between primary and secondary personas
- Smooth page transitions with indicators

#### EnhancedKPIs
- North Star Metric with AI-generated roadmap visualization
- Vertical bar charts comparing targets to benchmarks
- Large donut charts (200x200) showing performance lift
- Single-column layout for better readability
- Intelligent number formatting based on metric type
- Success criteria framework with minimum, target, and breakthrough levels

#### EnhancedConsumerJourney
- Dual visualization: funnel chart and interactive flow diagram
- Modern area chart with gradient fills for funnel analysis
- React Flow diagram with drag-and-drop capability
- "Add Touchpoint" feature with 6 predefined templates
- Dynamic funnel updates when touchpoints are added
- Journey insights cards with performance indicators

#### CampaignOverview
- Expanded target audience summary (full paragraph)
- Cultural Impact Score instead of generic "North Star Metric"
- Strategic pillars with visual icons
- Clean, scannable layout

## Technical Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Recharts** for data visualization
- **React Flow** for interactive diagrams
- **Lucide React** for icons

### State Management
- React hooks for local state
- Campaign data fetched via API and passed as props
- Real-time updates for interactive elements

### Data Visualization
- **Recharts** replacing Chart.js for modern, customizable charts
- Custom chart components with shadcn/ui styling
- Responsive containers with proper aspect ratios
- Gradient fills and smooth animations

### Styling Approach
```css
/* Core design tokens */
- Background: neutral-900/50 with backdrop-blur-sm
- Borders: border-neutral-800 with hover:border-neutral-700
- Shadows: shadow-xl hover:shadow-2xl
- Gradients: from-[color]-500/20 via-[color]-600/10 to-transparent
- Text: Neutral palette with semantic color accents
```

## API Structure

### Campaign Generation Endpoints
- `POST /api/generate` - Generate new campaign
- `GET /api/campaigns/[id]` - Retrieve campaign details
- `POST /api/campaigns/[id]` - Save campaign to database

### Data Models

```typescript
interface Campaign {
  id: string;
  brand_name: string;
  industry: string;
  campaign_goals: string[];
  target_audience: string;
  inspiration_brands: string[];
  creative_formats: string[];
  summary_data: {
    campaign_name: string;
    tagline: string;
    core_message: string;
    strategic_approach: string;
    cultural_insight: string;
    convention_violation: string;
    participation_framework: string;
    success_metrics: string;
  };
  audience_data: {
    summary: string; // Full paragraph description
    personas: Persona[];
  };
  creative_data: CreativeData;
  media_data: MediaStrategy;
  kpi_data: {
    northStarMetric: {
      name: string;
      target: number;
      description: string;
    };
    kpis: KPI[];
  };
}

interface Persona {
  type: 'primary' | 'secondary';
  name: string;
  age: number;
  occupation: string;
  location: string;
  income: string;
  demographics: {
    education: string;
    relationship_status: string;
    living_situation: string;
    tech_savviness: string;
  };
  psychographics: {
    values: string[];
    lifestyle: string;
    personality_traits: string[];
    aspirations: string[];
  };
  behaviors: {
    shopping_habits: string;
    media_consumption: string[];
    brand_preferences: string[];
    pain_points: string[];
  };
  digital_footprint: {
    social_platforms: string[];
    online_activities: string[];
    content_preferences: string[];
    influence_level: string;
  };
}

interface KPI {
  name: string;
  definition: string;
  target: number;
  benchmark: number;
  unit: string;
  category: 'awareness' | 'engagement' | 'conversion' | 'loyalty';
  importance: 'critical' | 'high' | 'medium';
  description: string;
}
```

## Model Orchestration

### Current Implementation
- **Grok** for real-time social intelligence and trend analysis
- **DeepInfra** integration for diverse model capabilities
- Strategic task routing based on capability requirements

### Model Selection Strategy
```typescript
const modelSelection = {
  culturalAnalysis: 'grok-beta',
  creativeGeneration: 'qwen-2.5-72b',
  strategicReasoning: 'deepseek-r1',
  rapidPrototyping: 'llama-3.3-70b'
};
```

## Development Guidelines

### Component Best Practices
1. **Modular Design**: Each component should be self-contained with clear props interfaces
2. **Responsive First**: All components must work seamlessly on mobile through desktop
3. **Performance**: Use React.memo for expensive renders, lazy load heavy components
4. **Accessibility**: Ensure WCAG 2.1 AA compliance throughout

### State Management
- Keep state as close to where it's needed as possible
- Use URL parameters for shareable states (campaign ID)
- Implement optimistic updates for better UX

### Error Handling
- Graceful degradation for missing data
- User-friendly error messages
- Fallback UI states for loading and errors

### Code Style
```typescript
// Consistent naming conventions
interface ComponentNameProps {
  // Props interface
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  return (
    // JSX with consistent formatting
  );
}
```

## Deployment Considerations

### Environment Variables
```env
# AI Model APIs
GROQ_API_KEY=
DEEPINFRA_API_KEY=

# Database
DATABASE_URL=

# Redis Cache
REDIS_URL=

# Analytics
ANALYTICS_ID=
```

### Performance Optimization
- Static generation for marketing pages
- Dynamic imports for heavy components
- Image optimization with next/image
- API route caching with Redis

### Monitoring
- Error tracking with Sentry
- Performance monitoring with Vercel Analytics
- User behavior tracking for campaign effectiveness

## Future Enhancements

### Phase 1: Enhanced Intelligence
- Real-time trend integration from X/Twitter
- Competitive campaign analysis
- Automated A/B testing recommendations

### Phase 2: Advanced Personalization
- Multi-language campaign generation
- Regional cultural adaptation
- Industry-specific templates

### Phase 3: Analytics & Learning
- Campaign performance tracking
- ROI prediction models
- Self-improving recommendation engine

### Phase 4: Enterprise Features
- Team collaboration tools
- Brand guideline enforcement
- API access for integrations
- White-label capabilities

## Success Metrics

### User Experience
- Time to campaign generation < 30 seconds
- Single-page load time < 2 seconds
- Mobile responsiveness score > 95
- User satisfaction score > 4.5/5

### Business Impact
- Campaign quality score based on strategic depth
- User retention rate > 60%
- Generated campaigns activated rate > 40%
- Platform differentiation index vs competitors

## Conclusion

Kumorebe represents a paradigm shift in AI-powered marketing - from content generation to strategic innovation. The platform combines cutting-edge AI models with thoughtful UX design to deliver campaigns that don't just communicate but catalyze cultural movements. The modern, glassmorphic interface reflects the forward-thinking nature of the strategies it generates, while the robust technical architecture ensures scalability and reliability for marketers worldwide.