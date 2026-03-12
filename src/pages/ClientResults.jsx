import React from 'react';
import HeroSummary from '@/components/client-results/HeroSummary.jsx';
import VisibilityTrendChart from '@/components/client-results/VisibilityTrendChart.jsx';
import EngagementMomentum from '@/components/client-results/EngagementMomentum.jsx';
import BusinessImpactSignals from '@/components/client-results/BusinessImpactSignals.jsx';
import ContentPerformance from '@/components/client-results/ContentPerformance.jsx';
import GrowthOpportunity from '@/components/client-results/GrowthOpportunity.jsx';
import MonthlyNarrative from '@/components/client-results/MonthlyNarrative.jsx';

export default function ClientResults() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Section 1: Hero Summary */}
        <HeroSummary />

        {/* Section 2: Visibility Trend */}
        <VisibilityTrendChart />

        {/* Section 3: Engagement Momentum */}
        <EngagementMomentum />

        {/* Section 4: Business Impact Signals */}
        <BusinessImpactSignals />

        {/* Section 5: Content Performance */}
        <ContentPerformance />

        {/* Section 6: Monthly Narrative */}
        <MonthlyNarrative />

        {/* Section 7: Growth Opportunity */}
        <GrowthOpportunity />
      </div>
    </div>
  );
}