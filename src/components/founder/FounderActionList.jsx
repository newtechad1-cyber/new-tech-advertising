import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, XCircle, Clock, CreditCard, Shield, Users, Zap, HeartHandshake, Ticket } from 'lucide-react';

const PRIORITY_ORDER = { Critical: 0, High: 1, Normal: 2 };
const PRIORITY_COLORS = {
  Critical: 'text-red-400 bg-red-900/20 border-red-900/30',
  High: 'text-orange-400 bg-orange-900/20 border-orange-900/30',
  Normal: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/30',
};
const PRIORITY_DOT = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Normal: 'bg-yellow-500',
};

function ActionItem({ item }) {
  const colors = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.Normal;
  const dot = PRIORITY_DOT[item.priority] || PRIORITY_DOT.Normal;
  const Icon = item.icon;

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${colors}`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
      <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-70" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-200 leading-snug">{item.title}</div>
        {item.sub && <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>}
      </div>
      <span className="text-xs font-bold opacity-60 flex-shrink-0">{item.priority}</span>
    </div>
  );
}

export default function FounderActionList() {
  const { data: invoices = [] } = useQuery({
    queryKey: ['action-invoices'],
    queryFn: () => base44.entities.BillingInvoices.list('-created_date', 100),
  });

  const { data: qaIssues = [] } = useQuery({
    queryKey: ['action-qa-issues'],
    queryFn: () => base44.entities.QAIssues.filter({ status: 'Open' }),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['action-clients'],
    queryFn: () => base44.entities.ClientCompanies.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['action-tasks'],
    queryFn: () => base44.entities.AgentTasks.list('-created_date', 200),
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['action-deals'],
    queryFn: () => base44.entities.SalesDeals.list('-created_date', 100),
  });

  const { data: resellerRevenue = [] } = useQuery({
    queryKey: ['action-reseller-rev'],
    queryFn: () => base44.entities.ResellerRevenue.list('-created_date', 50),
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['action-tickets'],
    queryFn: () => base44.entities.SupportTickets.list('-created_date', 100),
  });

  const { data: activityLog = [] } = useQuery({
    queryKey: ['action-activity-log'],
    queryFn: () => base44.entities.ClientActivityLog.list('-created_date', 300),
  });

  const actions = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
    const items = [];

    // Failed payments
    const failedInvoices = invoices.filter(i => i.status === 'failed' || i.status === 'past_due');
    if (failedInvoices.length > 0) {
      items.push({
        priority: 'Critical',
        icon: CreditCard,
        title: `${failedInvoices.length} failed / past-due payment${failedInvoices.length > 1 ? 's' : ''}`,
        sub: `$${failedInvoices.reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()} outstanding`,
      });
    }

    // Critical QA issues
    const critQA = qaIssues.filter(i => i.severity === 'Critical');
    if (critQA.length > 0) {
      items.push({
        priority: 'Critical',
        icon: Shield,
        title: `${critQA.length} critical QA issue${critQA.length > 1 ? 's' : ''} open`,
        sub: critQA.slice(0, 2).map(i => i.title).join(' · '),
      });
    }

    // Data isolation issues
    const dataIsoIssues = qaIssues.filter(i => i.issue_type === 'Data Isolation Bug');
    if (dataIsoIssues.length > 0) {
      items.push({
        priority: 'Critical',
        icon: Shield,
        title: `${dataIsoIssues.length} data isolation bug${dataIsoIssues.length > 1 ? 's' : ''} open`,
        sub: 'Security priority',
      });
    }

    // Stalled onboarding
    const stalled = clients.filter(c =>
      (c.onboarding_status === 'in_progress' || c.status === 'onboarding') &&
      new Date(c.updated_date) < threeDaysAgo
    );
    if (stalled.length > 0) {
      items.push({
        priority: 'High',
        icon: Users,
        title: `${stalled.length} client${stalled.length > 1 ? 's' : ''} stalled in onboarding`,
        sub: stalled.slice(0, 2).map(c => c.company_name || c.name || 'Unknown').join(', '),
      });
    }

    // Failed content tasks
    const failedTasks = tasks.filter(t => t.status === 'failed');
    if (failedTasks.length > 0) {
      items.push({
        priority: 'High',
        icon: Zap,
        title: `${failedTasks.length} failed content task${failedTasks.length > 1 ? 's' : ''}`,
        sub: failedTasks.slice(0, 2).map(t => t.task_name || t.description || 'Unknown').join(', '),
      });
    }

    // High QA issues
    const highQA = qaIssues.filter(i => i.severity === 'High');
    if (highQA.length > 0) {
      items.push({
        priority: 'High',
        icon: AlertTriangle,
        title: `${highQA.length} high-severity QA issue${highQA.length > 1 ? 's' : ''} open`,
        sub: highQA.slice(0, 2).map(i => i.title).join(' · '),
      });
    }

    // Proposals needing follow-up
    const staleDeals = deals.filter(d => {
      if (['Closed Won', 'Closed Lost'].includes(d.stage)) return false;
      return new Date(d.updated_date) < sevenDaysAgo;
    });
    if (staleDeals.length > 0) {
      items.push({
        priority: 'High',
        icon: Clock,
        title: `${staleDeals.length} deal${staleDeals.length > 1 ? 's' : ''} with no follow-up in 7+ days`,
        sub: staleDeals.slice(0, 2).map(d => d.deal_name || d.title || 'Unnamed').join(', '),
      });
    }

    // Reseller payout issues
    const overduePayouts = resellerRevenue.filter(r => r.status === 'pending' && new Date(r.created_date) < sevenDaysAgo);
    if (overduePayouts.length > 0) {
      items.push({
        priority: 'High',
        icon: HeartHandshake,
        title: `${overduePayouts.length} reseller payout${overduePayouts.length > 1 ? 's' : ''} overdue`,
        sub: `$${overduePayouts.reduce((s, r) => s + (r.commission_amount || 0), 0).toLocaleString()} owed`,
      });
    }

    // Overdue support tickets
    const overdueTickets = tickets.filter(t =>
      t.status === 'open' && new Date(t.created_date) < sevenDaysAgo
    );
    if (overdueTickets.length > 0) {
      items.push({
        priority: 'Normal',
        icon: Ticket,
        title: `${overdueTickets.length} support ticket${overdueTickets.length > 1 ? 's' : ''} open 7+ days`,
        sub: overdueTickets.slice(0, 2).map(t => t.subject || t.title || 'Untitled').join(', '),
      });
    }

    // Clients with no recent activity
    const recentActiveIds = new Set(
      activityLog.filter(a => new Date(a.created_date) >= fourteenDaysAgo).map(a => a.company_id)
    );
    const inactiveClients = clients.filter(c =>
      (c.status === 'active' || !c.status) && !recentActiveIds.has(c.id)
    );
    if (inactiveClients.length > 0) {
      items.push({
        priority: 'Normal',
        icon: Users,
        title: `${inactiveClients.length} active client${inactiveClients.length > 1 ? 's' : ''} with no activity in 14d`,
        sub: inactiveClients.slice(0, 2).map(c => c.company_name || c.name || 'Unknown').join(', '),
      });
    }

    return items.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99));
  }, [invoices, qaIssues, clients, tasks, deals, resellerRevenue, tickets, activityLog]);

  const critCount = actions.filter(a => a.priority === 'Critical').length;
  const highCount = actions.filter(a => a.priority === 'High').length;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-bold text-white">Founder Action List</h2>
        </div>
        <div className="flex gap-1.5">
          {critCount > 0 && (
            <span className="text-xs font-bold bg-red-900/40 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
              {critCount} Critical
            </span>
          )}
          {highCount > 0 && (
            <span className="text-xs font-bold bg-orange-900/40 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">
              {highCount} High
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-[520px]">
        {actions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <Shield className="w-8 h-8 mb-3 opacity-40 text-green-500" />
            <p className="text-sm font-medium text-green-500">All clear</p>
            <p className="text-xs mt-1">No critical or high-priority actions</p>
          </div>
        ) : (
          actions.map((item, i) => <ActionItem key={i} item={item} />)
        )}
      </div>
    </div>
  );
}