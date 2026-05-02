import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Users, UserCheck, Search, Megaphone, FileText, Video, Share2, CheckSquare, Target, Bell, BarChart2, ArrowRight, TrendingUp } from 'lucide-react';

function StatCard({ label, value, href, icon: Icon, color }) { // Icon is used below as JSX component
  return (
    <Link to={href} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </Link>
  );
}

export default function OpsDashboard() {
  const [counts, setCounts] = useState({
    prospects: 0, clients: 0, audits: 0, campaigns: 0,
    content: 0, videos: 0, social: 0, leads: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prospects, clients, audits, campaigns, content, videos, social, leads] = await Promise.all([
          base44.entities.SalesLead.filter({ status: 'new' }),
          base44.entities.Clients.filter({ archived: false }),
          base44.entities.WebsiteAudit.list('-created_date', 5),
          base44.entities.SpokeCampaign.filter({ status: 'active' }),
          base44.entities.NTAContentAsset.list('-created_date', 5),
          base44.entities.NTAVideoAsset.list('-created_date', 5),
          base44.entities.SocialPostQueue.filter({ publish_status: 'scheduled' }),
          base44.entities.SalesLead.list('-created_date', 5),
        ]);
        setCounts({
          prospects: prospects.length,
          clients: clients.length,
          audits: audits.length,
          campaigns: campaigns.length,
          content: content.length,
          videos: videos.length,
          social: social.length,
          leads: leads.length,
        });
        setRecentLeads(leads.slice(0, 8));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const stats = [
    { label: 'New Prospects', value: loading ? '…' : counts.prospects, href: '/ops/prospects', icon: Target, color: 'bg-blue-600' },
    { label: 'Active Clients', value: loading ? '…' : counts.clients, href: '/ops/clients', icon: UserCheck, color: 'bg-emerald-600' },
    { label: 'Gap Audits', value: loading ? '…' : counts.audits, href: '/ops/audits', icon: Search, color: 'bg-violet-600' },
    { label: 'Active Campaigns', value: loading ? '…' : counts.campaigns, href: '/ops/campaigns', icon: Megaphone, color: 'bg-orange-500' },
    { label: 'Content Assets', value: loading ? '…' : counts.content, href: '/ops/content', icon: FileText, color: 'bg-sky-600' },
    { label: 'Video Scripts', value: loading ? '…' : counts.videos, href: '/ops/videos', icon: Video, color: 'bg-rose-600' },
    { label: 'Scheduled Posts', value: loading ? '…' : counts.social, href: '/ops/social', icon: Share2, color: 'bg-pink-600' },
    { label: 'Total Leads', value: loading ? '…' : counts.leads, href: '/ops/leads', icon: Users, color: 'bg-teal-600' },
  ];

  return (
    <OpsLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">NTA Operations Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage prospects, audits, campaigns, content, and clients</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.map(s => <StatCard key={s.href} {...s} />)}
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Recent Leads</h2>
            <Link to="/ops/leads" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {recentLeads.length === 0 ? (
              <p className="text-slate-500 text-sm p-5 text-center">No leads yet. <Link to="/gap-audit" className="text-blue-400 hover:underline">Share the gap audit page</Link> to start capturing leads.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Business</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hidden sm:table-cell">Contact</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Status</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hidden md:table-cell">Source</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{lead.business_name}</td>
                      <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{lead.contact_name || lead.phone || lead.email || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          lead.status === 'new' ? 'bg-blue-900/50 text-blue-400' :
                          lead.status === 'contacted' ? 'bg-amber-900/40 text-amber-400' :
                          lead.status === 'qualified' ? 'bg-emerald-900/40 text-emerald-400' :
                          'bg-slate-800 text-slate-500'
                        }`}>{lead.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{lead.lead_source || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{lead.created_date ? new Date(lead.created_date).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-bold text-white mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '+ New Prospect', href: '/ops/prospects' },
              { label: '+ Gap Audit', href: '/ops/audits' },
              { label: '+ Campaign', href: '/ops/campaigns' },
              { label: '+ Content Asset', href: '/ops/content' },
              { label: '+ Video Script', href: '/ops/videos' },
              { label: '+ Scheduled Post', href: '/ops/social' },
              { label: 'View Approvals', href: '/ops/approvals' },
              { label: 'Follow-Up Queue', href: '/ops/followups' },
            ].map(a => (
              <Link key={a.href} to={a.href} className="text-xs font-semibold px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors">
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </OpsLayout>
  );
}