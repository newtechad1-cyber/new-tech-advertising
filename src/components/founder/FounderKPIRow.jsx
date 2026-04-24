import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DollarSign, Users, TrendingUp, Shield, AlertTriangle, UserCheck } from 'lucide-react';

function KPICard({ icon: Icon, label, value, sub, status }) {
  const statusColors = { good: 'border-green-800', warn: 'border-yellow-700', bad: 'border-red-700', neutral: 'border-gray-700' };
  const valueColors = { good: 'text-green-400', warn: 'text-yellow-400', bad: 'text-red-400', neutral: 'text-white' };
  const dotColors = { good: 'bg-green-500', warn: 'bg-yellow-500', bad: 'bg-red-500', neutral: 'bg-gray-500' };
  const s = status || 'neutral';
  return (
    <div className={`rounded-xl border bg-gray-900 p-4 ${statusColors[s]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${dotColors[s]}`} />
      </div>
      <div className={`text-2xl font-bold ${valueColors[s]}`}>{value}</div>
      <div className="text-xs font-medium text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

export default function FounderKPIRow() {
  const { data: subs = [] } = useQuery({ queryKey: ['kpi-subs'], queryFn: () => base44.entities.ClientSubscriptions.filter({ status: 'active' }) });
  const { data: leads = [] } = useQuery({ queryKey: ['kpi-leads'], queryFn: () => base44.entities.SalesLead.list('-created_date', 200) });
  const { data: qaRelease = [] } = useQuery({ queryKey: ['kpi-qa-release'], queryFn: () => base44.entities.QAReleaseStatus.list('-last_updated', 1) });
  const { data: qaIssues = [] } = useQuery({ queryKey: ['kpi-qa-issues'], queryFn: () => base44.entities.QAIssues.filter({ status: 'Open' }) });
  const { data: resellers = [] } = useQuery({ queryKey: ['kpi-resellers'], queryFn: () => base44.entities.ResellerAccounts.list() });
  const { data: clients = [] } = useQuery({ queryKey: ['kpi-clients'], queryFn: () => base44.entities.ClientCompanies.list() });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const leadsThisWeek = leads.filter(l => new Date(l.created_date) >= weekAgo).length;
  const mrr = subs.reduce((s, sub) => s + (sub.monthly_amount || 0), 0);
  const latestRelease = qaRelease[0];
  const readiness = latestRelease?.readiness_score ?? null;
  const goLive = latestRelease?.go_live_status ?? 'Unknown';
  const criticalIssues = qaIssues.filter(i => i.severity === 'Critical').length;
  const activeResellers = resellers.filter(r => r.status === 'active').length;

  const glStatus = goLive === 'Ready for Sale' ? 'good' : (goLive === 'Ready for Beta' || goLive === 'Ready for Internal Use') ? 'warn' : goLive === 'Unknown' ? 'neutral' : 'bad';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      <KPICard icon={DollarSign} label="MRR" value={`$${mrr.toLocaleString()}`} sub={`${subs.length} active subs`} status={mrr > 0 ? 'good' : 'warn'} />
      <KPICard icon={TrendingUp} label="Leads This Week" value={leadsThisWeek} sub="new leads 7 days" status={leadsThisWeek >= 5 ? 'good' : leadsThisWeek > 0 ? 'warn' : 'bad'} />
      <KPICard icon={Users} label="Active Clients" value={clients.length} sub="total accounts" status="neutral" />
      <KPICard icon={UserCheck} label="Active Resellers" value={activeResellers} sub={`of ${resellers.length} total`} status={activeResellers > 0 ? 'good' : 'neutral'} />
      <KPICard icon={Shield} label="QA Readiness" value={readiness !== null ? `${readiness}` : '—'} sub={goLive} status={glStatus} />
      <KPICard icon={AlertTriangle} label="Critical Issues" value={criticalIssues} sub="open QA issues" status={criticalIssues === 0 ? 'good' : criticalIssues <= 2 ? 'warn' : 'bad'} />
    </div>
  );
}