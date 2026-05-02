import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { BarChart2, TrendingUp, Users, Megaphone, FileText, RefreshCw } from 'lucide-react';

function KPI({ label, value, sub, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className={`text-3xl font-black ${color || 'text-white'}`}>{value}</p>
      <p className="text-sm font-semibold text-white mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function OpsReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [leads, clients, audits, campaigns, content, videos, social] = await Promise.all([
      base44.entities.SalesLead.list('-created_date', 500),
      base44.entities.Clients.list('-created_date', 200),
      base44.entities.WebsiteAudit.list('-created_date', 200),
      base44.entities.SpokeCampaign.list('-created_date', 200),
      base44.entities.NTAContentAsset.list('-created_date', 200),
      base44.entities.NTAVideoAsset.list('-created_date', 200),
      base44.entities.SocialPostQueue.list('-created_date', 200),
    ]);
    setData({ leads, clients, audits, campaigns, content, videos, social });
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading || !data) return (
    <OpsLayout>
      <div className="p-8 text-center text-slate-500 text-sm">Loading reports…</div>
    </OpsLayout>
  );

  const { leads, clients, audits, campaigns, content, videos, social } = data;

  // Lead source breakdown
  const sourceCounts = leads.reduce((acc, l) => { acc[l.lead_source || 'other'] = (acc[l.lead_source || 'other'] || 0) + 1; return acc; }, {});
  const statusCounts = leads.reduce((acc, l) => { acc[l.status || 'new'] = (acc[l.status || 'new'] || 0) + 1; return acc; }, {});
  const platformCounts = social.reduce((acc, p) => { acc[p.platform] = (acc[p.platform] || 0) + 1; return acc; }, {});

  return (
    <OpsLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-slate-500 text-sm">Overview of your NTA operations</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Main KPIs */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <KPI label="Total Leads" value={leads.length} color="text-blue-400" />
            <KPI label="Active Clients" value={clients.filter(c => c.status === 'active_client').length} color="text-emerald-400" />
            <KPI label="Gap Audits Run" value={audits.length} color="text-violet-400" />
            <KPI label="Active Campaigns" value={campaigns.filter(c => c.status === 'active').length} color="text-orange-400" />
            <KPI label="Content Assets" value={content.length} sub={`${content.filter(c => c.status === 'approved').length} approved`} color="text-sky-400" />
            <KPI label="Video Scripts" value={videos.length} sub={`${videos.filter(v => v.render_status === 'completed').length} completed`} color="text-rose-400" />
            <KPI label="Social Posts" value={social.length} sub={`${social.filter(p => p.publish_status === 'published').length} published`} color="text-pink-400" />
            <KPI label="Qualified Leads" value={leads.filter(l => l.status === 'qualified').length} color="text-amber-400" />
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Lead Pipeline</h2>
            <div className="space-y-2">
              {[
                { label: 'New', key: 'new', color: 'bg-blue-500' },
                { label: 'Contacted', key: 'contacted', color: 'bg-amber-500' },
                { label: 'Qualified', key: 'qualified', color: 'bg-emerald-500' },
                { label: 'Unresponsive', key: 'unresponsive', color: 'bg-slate-600' },
              ].map(stage => {
                const count = statusCounts[stage.key] || 0;
                const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={stage.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">{stage.label}</span>
                      <span className="text-white font-bold">{count} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Lead Sources</h2>
            <div className="space-y-2">
              {Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([source, count]) => {
                const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{source.replace(/_/g, ' ')}</span>
                      <span className="text-white font-bold">{count} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {Object.keys(sourceCounts).length === 0 && <p className="text-slate-500 text-xs">No lead source data yet.</p>}
            </div>
          </div>
        </div>

        {/* Content status + Social platforms */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Content Asset Status</h2>
            <div className="space-y-2">
              {Object.entries(content.reduce((acc, c) => { acc[c.status || 'draft'] = (acc[c.status || 'draft'] || 0) + 1; return acc; }, {})).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 capitalize">{status.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-bold text-white">{count}</span>
                </div>
              ))}
              {content.length === 0 && <p className="text-slate-500 text-xs">No content assets yet.</p>}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Social Posts by Platform</h2>
            <div className="space-y-2">
              {Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 capitalize">{platform.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-bold text-white">{count}</span>
                </div>
              ))}
              {Object.keys(platformCounts).length === 0 && <p className="text-slate-500 text-xs">No social posts yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </OpsLayout>
  );
}