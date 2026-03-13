import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TrendingUp, Trophy, AlertCircle, ArrowRight, FileText } from 'lucide-react';

export default function ClientCommunicationSummaryPanel({ organizationId }) {
  const [latestComms, setLatestComms] = useState({
    weeklySummary: null,
    recentWin: null,
    nextAction: null,
    monthlyReport: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComms = async () => {
      try {
        const comms = await base44.entities.ClientCommunicationLog.filter(
          { organizationId, status: 'sent' },
          '-sentAt',
          50
        );

        setLatestComms({
          weeklySummary: comms.find(c => c.communicationType === 'weekly_summary'),
          recentWin: comms.find(c => c.communicationType === 'success_highlight' || c.communicationType === 'milestone'),
          nextAction: comms.find(c => c.communicationType === 'upgrade_recommendation' || c.communicationType === 'inactivity_nudge'),
          monthlyReport: comms.find(c => c.communicationType === 'monthly_report')
        });
      } catch (error) {
        console.error('Error loading communications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      loadComms();
    }
  }, [organizationId]);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Latest Weekly Summary */}
      {latestComms.weeklySummary && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                This Week's Summary
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-800 text-xs">Latest</Badge>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-slate-700 mb-2">{latestComms.weeklySummary.summaryText}</p>
            <p className="text-xs text-slate-500">
              {new Date(latestComms.weeklySummary.sentAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Win */}
      {latestComms.recentWin && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-600" />
                Recent Win
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-slate-700 mb-2">{latestComms.recentWin.summaryText}</p>
            <p className="text-xs text-slate-500">
              {new Date(latestComms.recentWin.sentAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Next Best Move */}
      {latestComms.nextAction && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Next Best Move
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-slate-700 mb-2">{latestComms.nextAction.summaryText}</p>
            <button className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 mt-2">
              Learn more <ArrowRight className="w-3 h-3" />
            </button>
          </CardContent>
        </Card>
      )}

      {/* Latest Monthly Report */}
      {latestComms.monthlyReport && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Monthly Report
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-slate-700 mb-3">{latestComms.monthlyReport.summaryText}</p>
            <Link
              to={createPageUrl('ClientMonthlyGrowthReport')}
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
            >
              View Full Report <ArrowRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Call to Action if no recent comms */}
      {!latestComms.weeklySummary && !latestComms.monthlyReport && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600 text-sm">
              No communications yet. Start publishing content to generate your growth reports.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}