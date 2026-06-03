import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ClientGuard from '@/components/auth/ClientGuard';
import ClientNav from '@/components/nav/ClientNav';
import HeroSummary from '@/components/client-results/HeroSummary.jsx';
import VisibilityTrendChart from '@/components/client-results/VisibilityTrendChart.jsx';
import EngagementMomentum from '@/components/client-results/EngagementMomentum.jsx';
import BusinessImpactSignals from '@/components/client-results/BusinessImpactSignals.jsx';
import ContentPerformance from '@/components/client-results/ContentPerformance.jsx';
import GrowthOpportunity from '@/components/client-results/GrowthOpportunity.jsx';
import MonthlyNarrative from '@/components/client-results/MonthlyNarrative.jsx';

export default function ClientResults() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) setUser(u);
    });
  }, []);

  const { data: company } = useQuery({
    queryKey: ['client-company', user?.client_id],
    queryFn: async () => {
      if (!user?.client_id) return null;
      const res = await base44.functions.invoke('getClientCompanies', {});
      return res.data.companies?.[0] || null;
    },
    enabled: !!user?.client_id
  });

  return (
    <ClientGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <ClientNav />
        <div className="flex-1 overflow-y-auto max-w-5xl mx-auto px-6 py-12">
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
    </ClientGuard>
  );
}