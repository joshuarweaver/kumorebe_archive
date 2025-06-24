# TODO - Kumorebe Issues & Tasks

## High Priority Issues

### ✅ AI-Powered Campaign Generation Complete
- **Created**: Three comprehensive AI endpoints
  - `/api/campaign/creative-concepts` - Generates 3 distinct creative concepts with fal.ai image generation
  - `/api/campaign/media-strategy` - Already existed, enhanced parsing
  - `/api/campaign/activation-strategy` - Full phased activation plan
- **Database**: Updated schema to store creative_concepts_data and activation_strategy_data
- **Components**: All three sections fully integrated and displaying AI-generated content

### 🟡 Update All Chart.js Components
- **Issue**: Other Chart.js components may have similar dark mode visibility issues
- **Components to Check**:
  - EnhancedKPIs (uses Recharts - should be OK)
  - EnhancedConsumerJourney (uses Recharts - should be OK)
  - Any other components using Chart.js
- **Action**: Apply same dynamic color solution if needed

## Medium Priority Issues

### 🔴 KPIs Not Displaying
- **Issue**: The 4 KPI cards (Brand Awareness Lift, Engagement Rate, Conversion Rate, NPS) are not showing under the KPI Framework section
- **Possible Causes**:
  - AI not generating KPI data in expected format (`campaign.kpi_data.kpis` array)
  - Data structure mismatch between API response and component expectations
  - Component rendering issue
- **Next Steps**:
  - Check API response structure for a real campaign
  - Verify EnhancedKPIs component is receiving the correct props
  - Add console logging to debug data flow

### ✅ Cultural Impact Score Chart (Dark Mode)
- **Issue**: The Cultural Impact Score donut chart in CampaignOverview is not visible in dark mode
- **Status**: Fixed
- **Solution**: 
  - Added dynamic color computation from CSS variables
  - Chart.js now uses computed colors instead of CSS variable strings
  - Added border to chart segments for better visibility
  - Colors update automatically when theme changes

## Completed Tasks
- ✅ Set up dark/light mode toggle
- ✅ Create chartreuse color palette
- ✅ Fix campaign page title visibility in dark mode
- ✅ Update neutral colors to theme colors across components
- ✅ Fix chart tooltip colors for dark mode
- ✅ Fix Cultural Impact Score chart visibility in dark mode
- ✅ Update conversion funnel chart to use chartreuse colors
- ✅ Add sticky header with Kumorebe wordmark on campaign page
- ✅ Fix bottom navigation bar with proper background blur
- ✅ Replace navbar with sidebar navigation
- ✅ Remove duplicate Kumorebe wordmark
- ✅ Add sidebar to both homepage and campaign page
- ✅ Create application-style sidebar with proper navigation
- ✅ Add user profile widget with avatar and dropdown
- ✅ Add prominent "Create Campaign" button
- ✅ Separate section navigation for campaign pages
- ✅ Remove share widget translucency
- ✅ Create Enhanced Creative Execution with 3 concepts
- ✅ Integrate fal.ai for image generation
- ✅ Create Media Strategy section
- ✅ Create Activation Strategy section

## Pages to Create

### Application Pages
- [ ] `/dashboard` - Overview with recent campaigns, performance metrics
- [ ] `/showcase` - Gallery of featured generated campaigns
- [ ] `/campaigns` - List view of all campaigns with filters
- [ ] `/create` - Universal creation page (campaigns, brands, platforms, etc.)
- [ ] `/analytics` - Performance analytics and insights
- [ ] `/audience` - Persona management and insights
- [ ] `/content` - Creative asset library
- [ ] `/settings` - User and account settings
- [ ] `/help` - Help documentation and support
- [ ] `/profile` - User profile management
- [ ] `/billing` - Subscription and billing management

## Future Enhancements
- [ ] Add smooth transitions when switching themes
- [ ] Persist theme preference across sessions
- [ ] Add theme-aware animations
- [ ] Optimize chart performance with React.memo