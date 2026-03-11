import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart3, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ReportHeader from '@/components/reporting/ReportHeader';
import VisibilityMomentumSummary from '@/components/reporting/VisibilityMomentumSummary';
import MarketingActivityTimeline from '@/components/reporting/MarketingActivityTimeline';
import HighlightsSection from '@/components/reporting/HighlightsSection';
import ChannelPresenceSummary from '@/components/reporting/ChannelPresenceSummary';
import UpcomingPlanSection from '@/components/reporting/UpcomingPlanSection';
import ROINarrativeBlock from '@/components/reporting/ROINarrativeBlock';

export default function ClientReports() {
  const [user, setUser] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);
      } catch (error) {
        console.log('User not authenticated');
      }
    };
    loadUser();
  }, []);

  // Get user's company reports
  const { data: reports = [] } = useQuery({
    queryKey: ['client-reports', user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) return [];
      return base44.entities.ClientPerformanceReport?.filter?.({ company_id: user.company_id }, '-generated_at', 10).catch(() => []);
    },
    enabled: !!user?.company_id,
  });

  const latestReport = reports[0];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Performance Report</h1>
            <p className="text-slate-400 text-sm mt-0.5">Marketing activity and strategic progress</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {latestReport ? (
          <>
            {/* Report Header */}
            <ReportHeader report={latestReport} />

            {/* Visibility Momentum */}
            <VisibilityMomentumSummary report={latestReport} />

            {/* Marketing Activity Timeline */}
            <MarketingActivityTimeline report={latestReport} />

            {/* Highlights */}
            <HighlightsSection report={latestReport} />

            {/* Channel Presence */}
            <ChannelPresenceSummary report={latestReport} />

            {/* Upcoming Plan */}
            <UpcomingPlanSection report={latestReport} />

            {/* ROI Narrative */}
            <ROINarrativeBlock report={latestReport} />
          </>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No reports available yet</p>
            <p className="text-sm mt-2">Your first performance report will appear here</p>
          </div>
        )}

      </div>
    </div>
  );
}