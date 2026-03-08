import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AdminGuard from '@/components/auth/AdminGuard';
import SalesAlertsPanel from '@/components/sales/SalesAlertsPanel';
import HotLeadsPanel from '@/components/sales/HotLeadsPanel';
import ProposalTracker from '@/components/sales/ProposalTracker';
import TrialSignupsPanel from '@/components/sales/TrialSignupsPanel';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Target, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

function SalesStat({ label, value, color }) {
  return (
    <div className="bg-white border rounded-lg p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminSales() {
  const [runningMonitor, setRunningMonitor] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ['sales-notifications'],
    queryFn: () => base44.entities.SalesNotification.filter({ status: 'unread' }, '-created_date', 100),
    refetchInterval: 60000
  });

  const { data: hotScores = [] } = useQuery({
    queryKey: ['hot-lead-scores'],
    queryFn: () => base44.entities.LeadScore.filter({ status: 'hot' })
  });

  const { data: trials = [] } = useQuery({
    queryKey: ['trial-signups'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 30)
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals-tracker'],
    queryFn: () => base44.entities.Proposal.list('-created_date', 50)
  });

  const urgentCount = notifications.filter(n => n.priority === 'urgent').length;
  const activeProposals = proposals.filter(p => ['sent', 'viewed'].includes(p.status)).length;
  const needsOnboarding = trials.filter(t => t.onboarding_status !== 'ready_for_dashboard' && t.trial_status !== 'draft').length;

  const runMonitor = async () => {
    setRunningMonitor(true);
    try {
      const res = await base44.functions.invoke('followUpMonitor', {});
      toast.success(`Monitor complete — ${res.data?.notifications_created || 0} new alerts created`);
    } catch {
      toast.error('Monitor run failed');
    }
    setRunningMonitor(false);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sales Command Center</h1>
                <p className="text-sm text-gray-500">Real-time alerts when human interaction is needed</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={createPageUrl('LeadsDashboard')}>View All Leads</Link>
              </Button>
              <Button size="sm" onClick={runMonitor} disabled={runningMonitor}>
                {runningMonitor
                  ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Running...</>
                  : <><RefreshCw className="w-4 h-4 mr-1" /> Run Follow-Up Monitor</>
                }
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <SalesStat label="Unread Alerts" value={notifications.length} color={notifications.length > 0 ? 'text-red-600' : 'text-gray-700'} />
            <SalesStat label="Urgent" value={urgentCount} color={urgentCount > 0 ? 'text-orange-600' : 'text-gray-700'} />
            <SalesStat label="Hot Leads" value={hotScores.length} color={hotScores.length > 0 ? 'text-red-600' : 'text-gray-700'} />
            <SalesStat label="Active Proposals" value={activeProposals} color="text-blue-600" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="alerts">
            <TabsList className="mb-4">
              <TabsTrigger value="alerts">
                🔔 Alerts {notifications.length > 0 && `(${notifications.length})`}
              </TabsTrigger>
              <TabsTrigger value="hot">
                🔥 Hot Leads {hotScores.length > 0 && `(${hotScores.length})`}
              </TabsTrigger>
              <TabsTrigger value="proposals">📄 Proposals</TabsTrigger>
              <TabsTrigger value="trials">
                🚀 Trials {needsOnboarding > 0 && `(${needsOnboarding} need attention)`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts">
              <SalesAlertsPanel />
            </TabsContent>
            <TabsContent value="hot">
              <HotLeadsPanel />
            </TabsContent>
            <TabsContent value="proposals">
              <ProposalTracker />
            </TabsContent>
            <TabsContent value="trials">
              <TrialSignupsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}