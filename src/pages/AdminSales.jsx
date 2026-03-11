import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminNav from '@/components/nav/AdminNav';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Zap, Plus, RefreshCw, List, LayoutGrid } from 'lucide-react';
import { createPageUrl } from '@/utils';
import SalesKPICards from '@/components/sales/cmd/SalesKPICards';
import SalesPipelineBoard from '@/components/sales/cmd/SalesPipelineBoard';
import DealsTableView from '@/components/sales/cmd/DealsTableView';
import FollowUpPriorityPanel from '@/components/sales/cmd/FollowUpPriorityPanel';
import RevenueForecaster from '@/components/sales/cmd/RevenueForecaster';
import LeadSourcePanel from '@/components/sales/cmd/LeadSourcePanel';
import RepPerformancePanel from '@/components/sales/cmd/RepPerformancePanel';
import SalesActivityFeed from '@/components/sales/cmd/SalesActivityFeed';

export default function AdminSales() {
  const [viewMode, setViewMode] = useState('board');
  const [refetchKey, setRefetchKey] = useState(0);

  // Fetch deals
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['sales-deals', refetchKey],
    queryFn: () => base44.entities.SalesDeals.list('-created_date', 500),
    refetchInterval: 30000,
  });

  // Fetch activity
  const { data: activities = [] } = useQuery({
    queryKey: ['sales-activities'],
    queryFn: async () => {
      try {
        const result = await base44.entities.SalesActivities.list('-created_at', 50);
        return result || [];
      } catch {
        return [];
      }
    },
    enabled: true,
    staleTime: 60000,
  });

  // Calculate KPIs
  const kpis = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const pipelineValue = deals
      .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
      .reduce((sum, d) => sum + (d.deal_value || 0), 0);

    const closingThisMonth = deals.filter(d => {
      if (!d.closing_date || d.stage === 'closed_lost') return false;
      const closeDate = new Date(d.closing_date);
      return closeDate.getMonth() === currentMonth && closeDate.getFullYear() === currentYear;
    }).length;

    const today = new Date(currentYear, currentMonth, now.getDate());
    const followUpsDueToday = deals.filter(d => {
      if (!d.next_followup_date) return false;
      const followUp = new Date(d.next_followup_date);
      return followUp.toDateString() === today.toDateString();
    }).length;

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newLeads = deals.filter(
      d => d.stage === 'new_lead' && new Date(d.created_date || 0) >= sevenDaysAgo
    ).length;

    const closedWon = deals.filter(d => d.stage === 'closed_won');
    const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
    const winRate = activeDeals.length > 0 ? Math.round((closedWon.length / (activeDeals.length + closedWon.length)) * 100) : 0;

    const revenueWonThisMonth = closedWon
      .filter(d => {
        const createdDate = new Date(d.created_date || 0);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      })
      .reduce((sum, d) => sum + (d.deal_value || 0), 0);

    return {
      pipeline_value: pipelineValue,
      deals_closing: closingThisMonth,
      followups_due: followUpsDueToday,
      new_leads: newLeads,
      win_rate: winRate,
      revenue_won: revenueWonThisMonth,
    };
  }, [deals]);

  const handleRefresh = () => {
    setRefetchKey(prev => prev + 1);
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Header */}
          <div className="border-b border-slate-800 bg-slate-900 sticky top-0 z-20 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/50 border border-emerald-800 rounded-lg">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Sales Command Center</h1>
                <p className="text-xs text-slate-500">Track pipeline, follow-ups, deal momentum, and revenue opportunities</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white text-xs h-8 gap-1">
                <Plus className="w-3 h-3" />
                Add Prospect
              </Button>
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white text-xs h-8 gap-1">
                <Plus className="w-3 h-3" />
                Add Opportunity
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-700 text-slate-400 hover:text-white text-xs h-8 gap-1"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </Button>

              {/* View Toggle */}
              <div className="flex items-center gap-1 border border-slate-700 rounded-lg p-0.5">
                <Button
                  size="sm"
                  variant={viewMode === 'board' ? 'default' : 'ghost'}
                  className={`h-7 w-7 p-0 ${viewMode === 'board' ? 'bg-slate-700' : 'text-slate-500'}`}
                  onClick={() => setViewMode('board')}
                >
                  <LayoutGrid className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  className={`h-7 w-7 p-0 ${viewMode === 'table' ? 'bg-slate-700' : 'text-slate-500'}`}
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
            {/* KPI Row */}
            <SalesKPICards data={kpis} />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Pipeline or Table */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pipeline Board or Table */}
                {viewMode === 'board' ? (
                  <SalesPipelineBoard deals={deals} />
                ) : (
                  <DealsTableView deals={deals} />
                )}

                {/* Revenue Forecast */}
                <RevenueForecaster deals={deals} />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Follow-Ups */}
                <FollowUpPriorityPanel deals={deals} />

                {/* Activity Feed */}
                <SalesActivityFeed activities={activities} />
              </div>
            </div>

            {/* Bottom Row: Source & Rep Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadSourcePanel deals={deals} />
              <RepPerformancePanel deals={deals} />
            </div>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}