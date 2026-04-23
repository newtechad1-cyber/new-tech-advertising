import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, X, TrendingUp, Target, PhoneCall, DollarSign } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';

export default function AgencyCampaignPerformance() {
  const [metrics, setMetrics] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ campaign_id: '', asset_id: '', channel: '', views: 0, clicks: 0, leads: 0, booked_calls: 0, revenue: 0, date_logged: new Date().toISOString().split('T')[0] });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [m, c, a] = await Promise.all([
      base44.entities.PerformanceMetric.list('-date_logged', 500),
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.NTAContentAsset.list('-created_date', 200),
    ]);
    setMetrics(m); setCampaigns(c); setAssets(a); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    await base44.entities.PerformanceMetric.create({ ...form, views: +form.views, clicks: +form.clicks, leads: +form.leads, booked_calls: +form.booked_calls, revenue: +form.revenue });
    setShowModal(false);
    setSaving(false);
    load();
  };

  // Aggregate by campaign
  const campMap = {};
  campaigns.forEach(c => { campMap[c.id] = c; });
  const assetMap = {};
  assets.forEach(a => { assetMap[a.id] = a; });

  const campaignAgg = {};
  metrics.forEach(m => {
    if (!m.campaign_id) return;
    if (!campaignAgg[m.campaign_id]) campaignAgg[m.campaign_id] = { views: 0, clicks: 0, leads: 0, booked_calls: 0, revenue: 0 };
    campaignAgg[m.campaign_id].views += m.views || 0;
    campaignAgg[m.campaign_id].clicks += m.clicks || 0;
    campaignAgg[m.campaign_id].leads += m.leads || 0;
    campaignAgg[m.campaign_id].booked_calls += m.booked_calls || 0;
    campaignAgg[m.campaign_id].revenue += m.revenue || 0;
  });

  const assetAgg = {};
  metrics.forEach(m => {
    if (!m.asset_id) return;
    if (!assetAgg[m.asset_id]) assetAgg[m.asset_id] = { views: 0, clicks: 0, leads: 0 };
    assetAgg[m.asset_id].leads += m.leads || 0;
    assetAgg[m.asset_id].views += m.views || 0;
    assetAgg[m.asset_id].clicks += m.clicks || 0;
  });

  // Week filter
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
  const weekMetrics = metrics.filter(m => m.date_logged && new Date(m.date_logged) >= weekAgo);
  const totalLeadsWeek = weekMetrics.reduce((s, m) => s + (m.leads || 0), 0);
  const totalCallsWeek = weekMetrics.reduce((s, m) => s + (m.booked_calls || 0), 0);

  // Top campaign by leads
  const topCampaignId = Object.entries(campaignAgg).sort((a, b) => b[1].leads - a[1].leads)[0]?.[0];
  const topCampaign = topCampaignId ? campMap[topCampaignId] : null;

  // Top asset by leads
  const topAssetId = Object.entries(assetAgg).sort((a, b) => b[1].leads - a[1].leads)[0]?.[0];
  const topAsset = topAssetId ? assetMap[topAssetId] : null;

  const sortedCampaigns = Object.entries(campaignAgg).sort((a, b) => b[1].leads - a[1].leads);

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Campaign Performance</h1>
            <p className="text-slate-500 text-sm mt-0.5">Leads, calls, and revenue across campaigns</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> Log Metrics
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPI icon={TrendingUp} label="Top Campaign" value={topCampaign?.campaign_name || '—'} sub={topCampaign ? `${campaignAgg[topCampaignId]?.leads || 0} leads` : ''} color="text-blue-400" />
          <KPI icon={Target} label="Total Leads This Week" value={totalLeadsWeek} color="text-emerald-400" />
          <KPI icon={PhoneCall} label="Booked Calls This Week" value={totalCallsWeek} color="text-violet-400" />
          <KPI icon={TrendingUp} label="Top Content Asset" value={topAsset?.asset_name?.slice(0,20) || '—'} sub={topAsset ? `${assetAgg[topAssetId]?.leads || 0} leads` : ''} color="text-amber-400" />
        </div>

        {/* Campaign table */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Campaigns</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : sortedCampaigns.length === 0 ? (
              <p className="p-8 text-center text-slate-600 text-sm">No performance data logged yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-800">{['Campaign','Views','Clicks','Leads','Calls','Revenue'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {sortedCampaigns.map(([cId, agg]) => (
                    <tr key={cId} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-white font-medium">{campMap[cId]?.campaign_name || cId.slice(0,8)}</td>
                      <td className="px-4 py-3 text-slate-400">{agg.views.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-400">{agg.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">{agg.leads}</td>
                      <td className="px-4 py-3 text-violet-400">{agg.booked_calls}</td>
                      <td className="px-4 py-3 text-amber-400">${agg.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent metric logs */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Recent Entries</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {metrics.slice(0, 8).map(m => (
              <div key={m.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{campMap[m.campaign_id]?.campaign_name || 'Unknown Campaign'}</p>
                  <p className="text-xs text-slate-500">{m.channel || 'All channels'} · {m.date_logged}</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-emerald-400">{m.leads} leads</span>
                  <span className="text-violet-400">{m.booked_calls} calls</span>
                  <span className="text-amber-400">${m.revenue}</span>
                </div>
              </div>
            ))}
            {metrics.length === 0 && <p className="p-6 text-center text-slate-600 text-sm">No data yet.</p>}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Log Performance Metrics</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className={LBL}>Campaign</label>
                <select value={form.campaign_id} onChange={e => setForm(p => ({...p, campaign_id: e.target.value}))} className={IN}>
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
                </select>
              </div>
              <div className="col-span-2"><label className={LBL}>Channel / Platform</label><input value={form.channel} onChange={e => setForm(p => ({...p, channel: e.target.value}))} className={IN} /></div>
              {[['views','Views'],['clicks','Clicks'],['leads','Leads'],['booked_calls','Booked Calls'],['revenue','Revenue ($)']].map(([k,l]) => (
                <div key={k}><label className={LBL}>{l}</label><input type="number" value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} className={IN} /></div>
              ))}
              <div><label className={LBL}>Date</label><input type="date" value={form.date_logged} onChange={e => setForm(p => ({...p, date_logged: e.target.value}))} className={IN} /></div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving || !form.campaign_id} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Log Metrics'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

function KPI({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <Icon className={`w-4 h-4 ${color} mb-2`} />
      <p className={`text-xl font-black ${color} truncate`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-600">{sub}</p>}
    </div>
  );
}