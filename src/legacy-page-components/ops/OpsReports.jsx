import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { BarChart2, RefreshCw, Zap, ChevronDown } from 'lucide-react';

function KPI({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-slate-800/60 rounded-xl px-4 py-3 text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-slate-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

export default function OpsReports() {
  const [clients, setClients] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [generating, setGenerating] = useState(false);
  const [latestReport, setLatestReport] = useState(null);

  const load = async () => {
    setLoading(true);
    const [c, r] = await Promise.all([
      base44.entities.Client.list('-created_date', 100),
      base44.entities.Report.list('-created_date', 50),
    ]);
    setClients(c);
    setReports(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!selectedClient || !selectedMonth) return;
    setGenerating(true);
    setLatestReport(null);
    const res = await base44.functions.invoke('ntaMonthlyReportGenerator', {
      client_id: selectedClient,
      report_month: selectedMonth,
    });
    setLatestReport(res.data);
    setGenerating(false);
    load();
  };

  const clientName = (id) => clients.find(c => c.id === id)?.business_name || 'Unknown';

  return (
    <OpsLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Monthly Reports</h1>
            <p className="text-slate-500 text-sm">{reports.length} reports generated</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* Generator */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-3">Generate Monthly Report</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Client</label>
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Month</label>
              <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <button onClick={handleGenerate} disabled={generating || !selectedClient}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {generating ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating…</> : <><Zap className="w-4 h-4" /> Generate Report</>}
            </button>
          </div>
        </div>

        {/* Latest generated report */}
        {latestReport && (
          <div className="bg-slate-900 border border-emerald-700/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-white font-bold">{latestReport.client} — {latestReport.report_month}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <KPI label="Leads" value={latestReport.metrics?.leads || 0} color="text-blue-400" />
              <KPI label="Posts Published" value={latestReport.metrics?.posts_published || 0} color="text-purple-400" />
              <KPI label="Videos" value={latestReport.metrics?.videos_completed || 0} color="text-red-400" />
              <KPI label="SEO Pages" value={latestReport.metrics?.seo_pages_published || 0} color="text-emerald-400" />
              <KPI label="Active Campaigns" value={latestReport.metrics?.active_campaigns || 0} color="text-orange-400" />
            </div>

            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Summary</p>
              <p className="text-slate-300 text-sm leading-relaxed">{latestReport.summary}</p>
            </div>

            {latestReport.highlights?.length > 0 && (
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Highlights</p>
                <ul className="space-y-1">
                  {latestReport.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400 mt-0.5">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {latestReport.recommendations?.length > 0 && (
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Next Month Recommendations</p>
                <ul className="space-y-1">
                  {latestReport.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-blue-400 mt-0.5">→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {latestReport.next_month_focus && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl px-4 py-3">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Top Priority Next Month</p>
                <p className="text-slate-300 text-sm">{latestReport.next_month_focus}</p>
              </div>
            )}
          </div>
        )}

        {/* Past reports list */}
        {reports.length > 0 && (
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Past Reports</p>
            {reports.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{clientName(r.client_id)} — {r.report_month}</p>
                  <p className="text-slate-500 text-xs">{r.leads_generated} leads · {r.posts_published} posts · {r.pages_created} pages</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OpsLayout>
  );
}