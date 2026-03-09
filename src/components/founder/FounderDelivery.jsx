import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Package, AlertTriangle, Clock } from 'lucide-react';

function DelivStat({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function FounderDelivery() {
  const { data: clients = [] } = useQuery({ queryKey: ['founder-delivery-clients'], queryFn: () => base44.entities.ClientCompanies.list() });
  const { data: tasks = [] } = useQuery({ queryKey: ['founder-agent-tasks'], queryFn: () => base44.entities.AgentTasks.list('-created_date', 300) });
  const { data: runs = [] } = useQuery({ queryKey: ['founder-agent-runs'], queryFn: () => base44.entities.AgentRuns.list('-created_date', 100) });
  const { data: activityLog = [] } = useQuery({ queryKey: ['founder-activity-log'], queryFn: () => base44.entities.ClientActivityLog.list('-created_date', 500) });

  const now = new Date();
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const activeClients = clients.filter(c => c.status === 'active' || !c.status).length;
  const onboardingClients = clients.filter(c => c.onboarding_status === 'in_progress' || c.status === 'onboarding');
  const stuckOnboarding = onboardingClients.filter(c => new Date(c.updated_date) < threeDaysAgo);
  const pendingApprovals = tasks.filter(t => t.status === 'pending_approval' || t.status === 'awaiting_approval').length;
  const queuedTasks = tasks.filter(t => t.status === 'queued' || t.status === 'pending').length;
  const failedTasks = tasks.filter(t => t.status === 'failed');
  const failedRunsToday = runs.filter(r => r.status === 'failed' && new Date(r.created_date) >= todayStart).length;
  const recentActiveIds = new Set(activityLog.filter(a => new Date(a.created_date) >= fourteenDaysAgo).map(a => a.company_id));
  const inactiveClients = clients.filter(c => (c.status === 'active' || !c.status) && !recentActiveIds.has(c.id)).length;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-bold text-white">Client Delivery</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <DelivStat label="Active Clients" value={activeClients} color="text-white" />
        <DelivStat label="Onboarding" value={onboardingClients.length} color="text-blue-400" />
        <DelivStat label="Stuck ≥3 Days" value={stuckOnboarding.length} color={stuckOnboarding.length > 0 ? 'text-red-400' : 'text-green-400'} />
        <DelivStat label="Pending Approvals" value={pendingApprovals} color={pendingApprovals > 0 ? 'text-yellow-400' : 'text-gray-400'} />
        <DelivStat label="Tasks Queued" value={queuedTasks} color="text-gray-300" />
        <DelivStat label="Failed Runs Today" value={failedRunsToday} color={failedRunsToday > 0 ? 'text-red-400' : 'text-green-400'} />
        <DelivStat label="No Activity 14d" value={inactiveClients} color={inactiveClients > 0 ? 'text-yellow-400' : 'text-green-400'} />
        <DelivStat label="Failed Tasks" value={failedTasks.length} color={failedTasks.length > 0 ? 'text-red-400' : 'text-green-400'} />
      </div>
      {failedTasks.length > 0 && (
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-medium text-red-400">Failed Content Tasks</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {failedTasks.slice(0, 8).map(t => (
              <div key={t.id} className="flex items-center justify-between text-xs bg-red-900/20 border border-red-900/30 rounded-md px-2.5 py-1.5">
                <span className="text-gray-300 truncate max-w-[55%]">{t.task_name || t.description || 'Unknown Task'}</span>
                <span className="text-red-400 font-medium">Failed</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {stuckOnboarding.length > 0 && (
        <div className="border-t border-gray-800 pt-3 mt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-400">Stalled Onboarding</span>
          </div>
          <div className="space-y-1.5">
            {stuckOnboarding.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center justify-between text-xs bg-yellow-900/20 border border-yellow-900/30 rounded-md px-2.5 py-1.5">
                <span className="text-gray-300 truncate">{c.company_name || c.name || 'Unknown Client'}</span>
                <span className="text-yellow-500 flex-shrink-0">{Math.floor((now - new Date(c.updated_date)) / (1000 * 60 * 60 * 24))}d stalled</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}