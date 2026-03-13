import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ClientMomentumCard({ snapshot, previousSnapshot }) {
  if (!snapshot) return null;

  const getWeekOverWeekChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const contentChange = getWeekOverWeekChange(snapshot.contentPublishedCount, previousSnapshot?.contentPublishedCount);
  const leadChange = getWeekOverWeekChange(snapshot.leadsLoggedCount, previousSnapshot?.leadsLoggedCount);
  const revenueChange = getWeekOverWeekChange(snapshot.revenueAttributed, previousSnapshot?.revenueAttributed);

  const renderChange = (value, metric) => {
    if (value === null) return null;
    const isPositive = value >= 0;
    const arrow = isPositive ? '📈' : '📉';
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    return (
      <span className={`text-xs font-semibold ${color}`}>
        {arrow} {isPositive ? '+' : ''}{Math.round(value)}%
      </span>
    );
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚀 What's Working</span>
          <Badge className={snapshot.momentumScore > 60 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
            Momentum: {snapshot.momentumScore}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Activity */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
          <div>
            <p className="text-sm font-medium">Content Published</p>
            <p className="text-2xl font-bold mt-1">{snapshot.contentPublishedCount}</p>
          </div>
          <div className="text-right">
            {contentChange !== null && renderChange(contentChange, 'content')}
            {snapshot.videosCreatedCount > 0 && (
              <p className="text-xs text-slate-600 mt-2">({snapshot.videosCreatedCount} videos)</p>
            )}
          </div>
        </div>

        {/* Lead Generation */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
          <div>
            <p className="text-sm font-medium">Leads Captured</p>
            <p className="text-2xl font-bold mt-1">{snapshot.leadsLoggedCount}</p>
          </div>
          <div className="text-right">
            {leadChange !== null && renderChange(leadChange, 'leads')}
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div>
            <p className="text-sm font-medium">Revenue Attributed</p>
            <p className="text-2xl font-bold mt-1">
              ${(snapshot.revenueAttributed / 100).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            {revenueChange !== null && renderChange(revenueChange, 'revenue')}
          </div>
        </div>

        {/* Momentum indicator */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Period Momentum</span>
            <div className="flex-1 mx-3 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
                style={{ width: `${snapshot.momentumScore}%` }}
              />
            </div>
            <span className="text-sm font-bold">{snapshot.momentumScore}%</span>
          </div>
        </div>

        {/* Deals */}
        {snapshot.dealsClosedCount > 0 && (
          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs font-medium text-emerald-700">
              🎯 {snapshot.dealsClosedCount} {snapshot.dealsClosedCount === 1 ? 'deal' : 'deals'} closed this period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}