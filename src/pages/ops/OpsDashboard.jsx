import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import {
  Users, UserCheck, Search, Megaphone, FileText,
  Target, Bell, BarChart2, ArrowRight, TrendingUp,
  Plus, Zap, CheckSquare, Share2, Clock, AlertCircle, ChevronRight
} from 'lucide-react';
import QuickActionModal from '@/components/ops-dashboard/QuickActionModal';

function StatCard({ label, value, href, icon: Icon, color, alert }) {
  return (
    <Link to={href} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors group relative">
      {alert && (
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950" />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition-colors" />
      </div>
      <p className="text-2xl font-black text-white">{value ?? '—'}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
    </Link>
  );
}

function QuickActionBtn({ label, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${color}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </button>
  );
}

function NextUpItem({ label, detail, href, urgent }) {
  return (
    <Link to={href} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-slate-800/60 ${urgent ? 'border border-red-900/50 bg-red-950/20' : 'border border-slate-800 bg-slate-900/60'}`}>
      <div className="flex items-center gap-3">
        {urgent ? <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />}
        <div>
          <p className={`text-sm font-semibold ${urgent ? 'text-red-300' : 'text-white'}`}>{label}</p>
          {detail && <p className="text-xs text-slate-500 mt-0.5">{detail}</p>}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600" />
    </Link>
  );
}

export default function OpsDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'prospect' | 'client' | 'campaign' | 'seasonal' | 'weekly' | 'report'

  const load = async () => {
    setLoading(true);
    const [prospects, clients, audits, campaigns, pendingApprovals, leads, scheduledPosts, reports] = await Promise.all([
      base44.entities.Prospect.list('-created_date', 200),
      base44.entities.Client.list('-created_date', 200),
      base44.entities.GapAudit.filter({ status: 'draft' }),
      base44.entities.Campaign.filter({ status: 'active' }),
      base44.entities.ContentAsset.filter({ approval_status: 'pending' }),
      base44.entities.Lead.list('-created_date', 10),
      base44.entities.SocialPost.filter({ status: 'scheduled' }),
      base44.entities.Report.list('-created_date', 5),
    ]);
    setCounts({
      prospects: prospects.filter(p => p.status !== 'converted').length,
      clients: clients.filter(c => c.status === 'active' || c.status === 'onboarding').length,
      audits: audits.length,
      campaigns: campaigns.length,
      pendingApprovals: pendingApprovals.length,
      leads: leads.filter(l => l.status === 'new').length,
      scheduledPosts: scheduledPosts.length,
      reports: reports.length,
    });
    setRecentLeads(leads.slice(0, 6));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = [
    { label: 'Prospects', value: loading ? '…' : counts.prospects, href: '/ops/prospects', icon: Target, color: 'bg-blue-600' },
    { label: 'Active Clients', value: loading ? '…' : counts.clients, href: '/ops/clients', icon: UserCheck, color: 'bg-emerald-600' },
    { label: 'Open Audits', value: loading ? '…' : counts.audits, href: '/ops/audits', icon: Search, color: 'bg-violet-600', alert: counts.audits > 0 },
    { label: 'Active Campaigns', value: loading ? '…' : counts.campaigns, href: '/ops/campaigns', icon: Megaphone, color: 'bg-orange-500' },
    { label: 'Pending Approvals', value: loading ? '…' : counts.pendingApprovals, href: '/ops/approvals', icon: CheckSquare, color: 'bg-yellow-600', alert: counts.pendingApprovals > 0 },
    { label: 'New Leads', value: loading ? '…' : counts.leads, href: '/ops/leads', icon: Users, color: 'bg-teal-600', alert: counts.leads > 0 },
    { label: 'Scheduled Posts', value: loading ? '…' : counts.scheduledPosts, href: '/ops/social', icon: Share2, color: 'bg-pink-600' },
    { label: 'Reports', value: loading ? '…' : counts.reports, href: '/ops/reports', icon: BarChart2, color: 'bg-sky-600' },
  ];

  // Build "Next Up" priority list based on counts
  const nextUp = [];
  if (counts.pendingApprovals > 0) nextUp.push({ label: `${counts.pendingApprovals} content item${counts.pendingApprovals > 1 ? 's' : ''} waiting for approval`, detail: 'Review and approve before scheduling', href: '/ops/approvals', urgent: true });
  if (counts.leads > 0) nextUp.push({ label: `${counts.leads} new lead${counts.leads > 1 ? 's' : ''} need follow-up`, detail: 'Follow up within 2 hours for best conversion', href: '/ops/leads', urgent: true });
  if (counts.audits > 0) nextUp.push({ label: `${counts.audits} gap audit${counts.audits > 1 ? 's' : ''} in draft`, detail: 'Complete and deliver to prospects', href: '/ops/audits', urgent: false });
  if (counts.prospects > 0) nextUp.push({ label: `${counts.prospects} active prospect${counts.prospects > 1 ? 's' : ''}`, detail: 'Review and move forward in pipeline', href: '/ops/prospects', urgent: false });
  if (nextUp.length === 0) nextUp.push({ label: 'All caught up! 🎉', detail: 'No urgent items right now', href: '/ops', urgent: false });

  return (
    <OpsLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">NTA Operations</h1>
            <p className="text-slate-500 text-sm">Good to see you, Rick. Here's what needs your attention today.</p>
          </div>
          <button onClick={load} className="text-xs text-slate-500 hover:text-white transition-colors">↻ Refresh</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => <StatCard key={s.href} {...s} />)}
        </div>

        {/* Next Up */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Next Up</h2>
          <div className="space-y-2">
            {nextUp.slice(0, 4).map((item, i) => (
              <NextUpItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <QuickActionBtn label="New Prospect" icon={Plus} color="bg-blue-700 hover:bg-blue-600 text-white" onClick={() => setModal('prospect')} />
            <QuickActionBtn label="Create Gap Audit" icon={Search} color="bg-violet-700 hover:bg-violet-600 text-white" onClick={() => navigate('/ops/audits')} />
            <QuickActionBtn label="New Client" icon={UserCheck} color="bg-emerald-700 hover:bg-emerald-600 text-white" onClick={() => setModal('client')} />
            <QuickActionBtn label="New Campaign" icon={Megaphone} color="bg-orange-700 hover:bg-orange-600 text-white" onClick={() => setModal('campaign')} />
            <QuickActionBtn label="Seasonal Campaign" icon={Zap} color="bg-purple-700 hover:bg-purple-600 text-white" onClick={() => setModal('seasonal')} />
            <QuickActionBtn label="Weekly Content" icon={FileText} color="bg-sky-700 hover:bg-sky-600 text-white" onClick={() => setModal('weekly')} />
            <QuickActionBtn label="Pending Approvals" icon={CheckSquare} color="bg-yellow-700 hover:bg-yellow-600 text-white" onClick={() => navigate('/ops/approvals')} />
            <QuickActionBtn label="Monthly Report" icon={BarChart2} color="bg-teal-700 hover:bg-teal-600 text-white" onClick={() => setModal('report')} />
          </div>
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Recent Leads
            </h2>
            <Link to="/ops/leads" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {recentLeads.length === 0 ? (
              <p className="text-slate-500 text-sm p-5 text-center">No leads yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Name</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hidden sm:table-cell">Service</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Status</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-white">{lead.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell truncate max-w-[160px]">{lead.service_needed || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          lead.status === 'new' ? 'bg-blue-900/50 text-blue-400' :
                          lead.status === 'contacted' ? 'bg-amber-900/40 text-amber-400' :
                          lead.status === 'qualified' ? 'bg-emerald-900/40 text-emerald-400' :
                          lead.status === 'booked' ? 'bg-green-900/40 text-green-400' :
                          'bg-slate-800 text-slate-500'
                        }`}>{lead.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                        {lead.created_date ? new Date(lead.created_date).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Modals */}
      {modal && (
        <QuickActionModal
          type={modal}
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); load(); }}
        />
      )}
    </OpsLayout>
  );
}