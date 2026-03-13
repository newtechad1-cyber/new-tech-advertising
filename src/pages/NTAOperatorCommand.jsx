import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, DollarSign, Zap, AlertTriangle, Activity, Clock, RefreshCw } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import OCPDailyKPIBar from '@/components/operator-cmd/OCPDailyKPIBar';
import OCPActionBar from '@/components/operator-cmd/OCPActionBar';
import OCPRevenuePanel from '@/components/operator-cmd/OCPRevenuePanel';
import OCPMomentumPanel from '@/components/operator-cmd/OCPMomentumPanel';
import OCPAutomationPanel from '@/components/operator-cmd/OCPAutomationPanel';
import OCPExpansionPanel from '@/components/operator-cmd/OCPExpansionPanel';

function buildPriorityActions(opportunities, growthStages, aiJobs) {
  const actions = [];
  const today = new Date().toISOString().split('T')[0];

  const overdueFollowUps = opportunities.filter(o => o.next_step_due && o.next_step_due < today && !['closed_won','closed_lost'].includes(o.stage));
  if (overdueFollowUps.length > 0) {
    actions.push({ urgency: 'critical', label: `${overdueFollowUps.length} follow-up${overdueFollowUps.length > 1 ? 's' : ''} overdue`, description: 'Revenue at risk — prospects require immediate contact', linkTo: '/admin/sales-pipeline' });
  }

  const verbalYes = opportunities.filter(o => o.stage === 'verbal_yes');
  if (verbalYes.length > 0) {
    actions.push({ urgency: 'high', label: `${verbalYes.length} verbal yes deal${verbalYes.length > 1 ? 's' : ''} ready to close`, description: 'Send contract and finalize onboarding kickoff', linkTo: '/admin/sales-pipeline' });
  }

  const criticalClients = growthStages.filter(g => g.retention_risk_level === 'critical');
  if (criticalClients.length > 0) {
    actions.push({ urgency: 'critical', label: `${criticalClients.length} client${criticalClients.length > 1 ? 's' : ''} at critical retention risk`, description: 'Strategist outreach required today', linkTo: '/admin/retention-dashboard' });
  }

  const failedJobs = aiJobs.filter(j => j.status === 'failed');
  if (failedJobs.length > 5) {
    actions.push({ urgency: 'high', label: `${failedJobs.length} automation failures detected`, description: 'Content pipeline may be impacted', linkTo: '/nta/ai-workforce' });
  }

  return actions.sort((a, b) => (a.urgency === 'critical' ? -1 : 1));
}

export default function NTAOperatorCommand() {
  const [opportunities, setOpportunities] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [aiJobs, setAiJobs] = useState([]);
  const [aiAgents, setAiAgents] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [opps, stages, boards, jobs, agents, res, terr] = await Promise.all([
      base44.entities.SalesOpportunity.list('-updated_date', 100),
      base44.entities.ClientGrowthStage.list('-retention_risk_score', 100),
      base44.entities.ClientOnboarding.filter({ status: 'active' }),
      base44.entities.AIJob.list('-created_date', 50),
      base44.entities.AIAgent.list('-load_percent', 50),
      base44.entities.Reseller.filter({ status: 'active' }),
      base44.entities.Territory.list(),
    ]);
    setOpportunities(opps || []);
    setGrowthStages(stages || []);
    setOnboardings(boards || []);
    setAiJobs(jobs || []);
    setAiAgents(agents || []);
    setResellers(res || []);
    setTerritories(terr || []);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const today = new Date().toISOString().split('T')[0];
  const followUpsDueToday = opportunities.filter(o => o.next_step_due === today && !['closed_won','closed_lost'].includes(o.stage));
  const openPipelineValue = opportunities.filter(o => !['closed_won','closed_lost'].includes(o.stage)).reduce((s, o) => s + (o.deal_value || 0), 0);
  const criticalClients = growthStages.filter(g => g.retention_risk_level === 'critical' || g.retention_risk_level === 'at_risk').length;
  const failedJobs = aiJobs.filter(j => j.status === 'failed').length;
  const expansionReady = growthStages.filter(g => g.expansion_readiness_score >= 60).length;
  const activeOnboardings = onboardings.length;

  const kpis = [
    { label: 'Follow-Ups Today', value: followUpsDueToday.length, icon: Clock, color: followUpsDueToday.length > 0 ? '#ef4444' : '#10b981' },
    { label: 'Pipeline Value', value: `$${(openPipelineValue / 1000).toFixed(0)}k`, icon: DollarSign, color: '#3b82f6' },
    { label: 'Active Onboardings', value: activeOnboardings, icon: Users, color: '#8b5cf6' },
    { label: 'Retention Risks', value: criticalClients, icon: AlertTriangle, color: criticalClients > 0 ? '#f97316' : '#10b981' },
    { label: 'Automation Failures', value: failedJobs, icon: Activity, color: failedJobs > 0 ? '#ef4444' : '#10b981' },
    { label: 'Expansion Ready', value: expansionReady, icon: Zap, color: '#10b981' },
  ];

  const priorityActions = buildPriorityActions(opportunities, growthStages, aiJobs);

  return (
    <div className="min-h-screen bg-slate-50">
      <NTACommandNav />
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-lg">Operator Command</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Daily executive workflow · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={loadData} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:border-slate-500 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {lastRefresh ? lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Refresh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {/* KPI bar */}
          <OCPDailyKPIBar kpis={kpis} />

          {/* Priority action banner */}
          {priorityActions.length > 0 && (
            <OCPActionBar priorityActions={priorityActions} />
          )}

          {/* Main 2×2 grid */}
          <div className="grid lg:grid-cols-2 gap-5">
            <OCPRevenuePanel opportunities={opportunities} />
            <OCPMomentumPanel growthStages={growthStages} onboardings={onboardings} />
            <OCPAutomationPanel aiJobs={aiJobs} aiAgents={aiAgents} />
            <OCPExpansionPanel growthStages={growthStages} resellers={resellers} territories={territories} />
          </div>
        </div>
      )}
    </div>
  );
}