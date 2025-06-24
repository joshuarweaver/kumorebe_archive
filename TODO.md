# TODO - Kumorebe Issues & Tasks

## High Priority Issues

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

## Future Enhancements
- [ ] Add smooth transitions when switching themes
- [ ] Persist theme preference across sessions
- [ ] Add theme-aware animations
- [ ] Optimize chart performance with React.memo