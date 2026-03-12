import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function conversionColor(score) {
  if (score >= 70) return 'text-emerald-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-rose-500';
}

function conversionBg(score) {
  if (score >= 70) return 'bg-emerald-100';
  if (score >= 40) return 'bg-amber-100';
  return 'bg-rose-100';
}

export default function AdminFunnelPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [filterScore, setFilterScore] = useState('all');

  useEffect(() => {
    base44.entities.PageConversionMetric.list('page_name', 100).then(p => {
      setPages(p);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading page analytics…</div>
      </div>
    );
  }

  // Filter pages
  const filteredPages = pages.filter(p => {
    if (filterScore === 'high' && p.conversion_score < 70) return false;
    if (filterScore === 'medium' && (p.conversion_score < 40 || p.conversion_score >= 70)) return false;
    if (filterScore === 'low' && p.conversion_score >= 40) return false;
    return true;
  });

  // Calculate KPIs
  const highestConverting = [...pages].sort((a, b) => (b.conversion_score || 0) - (a.conversion_score || 0))[0];
  const highestTraffic = [...pages].sort((a, b) => (b.visitors_count || 0) - (a.visitors_count || 0))[0];
  const highestDropOff = [...pages].sort((a, b) => (b.drop_off_rate || 0) - (a.drop_off_rate || 0))[0];
  const avgCtaEngagement = pages.length > 0
    ? Math.round(pages.reduce((sum, p) => sum + ((p.primary_cta_clicks || 0) / Math.max(p.visitors_count || 1, 1) * 100), 0) / pages.length)
    : 0;
  const avgTimeOnSite = pages.length > 0
    ? Math.round(pages.reduce((sum, p) => sum + (p.avg_time_on_page_seconds || 0), 0) / pages.length)
    : 0;

  // Chart data
  const scatterData = pages.map(p => ({
    x: p.avg_time_on_page_seconds || 0,
    y: p.conversion_score || 0,
    page: p.page_name,
    fill: (p.conversion_score || 0) >= 70 ? '#10b981' : (p.conversion_score || 0) >= 40 ? '#f59e0b' : '#ef4444',
  }));

  // Insights
  const insights = [];
  if (highestDropOff && highestDropOff.drop_off_rate > 60) {
    insights.push({
      type: 'alert',
      title: `${highestDropOff.page_name} Causing High Drop-Off`,
      description: `${highestDropOff.drop_off_rate}% of visitors leave without action. Review messaging and offer positioning.`,
      action: '🎯 Optimize page layout and CTA clarity',
    });
  }

  const lowEngagementPages = pages.filter(p => (p.conversion_score || 0) < 40);
  if (lowEngagementPages.length > 0) {
    insights.push({
      type: 'alert',
      title: `${lowEngagementPages.length} Page(s) Underperforming`,
      description: `Pages with low conversion scores need messaging review and better value prop clarity.`,
      action: '📝 Schedule copy optimization review',
    });
  }

  const demoPage = pages.find(p => p.page_name?.includes('Demo'));
  if (demoPage && demoPage.conversion_score > 70) {
    insights.push({
      type: 'positive',
      title: 'Demo Page Driving Strong Engagement',
      description: `Demo page conversion score is ${demoPage.conversion_score}. Customers love this experience.`,
      action: '✓ Use demo page messaging pattern on other pages',
    });
  }

  const pricingPage = pages.find(p => p.page_name?.includes('Pricing'));
  if (pricingPage && pricingPage.drop_off_rate > 50) {
    insights.push({
      type: 'alert',
      title: 'Pricing Page Causing Hesitation',
      description: `${pricingPage.drop_off_rate}% drop-off suggests price objection. Consider clearer ROI messaging.`,
      action: '💰 A/B test ROI calculator or better value bundles',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-white">Page Conversion Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Analyze conversion performance by page</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Highest Converting</p>
            <p className="text-xl font-black text-white">{highestConverting?.page_name}</p>
            <p className="text-sm text-emerald-400 font-bold mt-2">{highestConverting?.conversion_score || 0}%</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Highest Traffic</p>
            <p className="text-xl font-black text-white">{highestTraffic?.page_name}</p>
            <p className="text-sm text-blue-400 font-bold mt-2">{highestTraffic?.visitors_count?.toLocaleString() || 0} visits</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Highest Drop-Off</p>
            <p className="text-xl font-black text-white">{highestDropOff?.page_name}</p>
            <p className="text-sm text-rose-400 font-bold mt-2">{highestDropOff?.drop_off_rate || 0}%</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg CTA Engagement</p>
            <p className="text-3xl font-black text-amber-400">{avgCtaEngagement}%</p>
            <p className="text-xs text-slate-400 mt-2">Primary clicks</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Time on Site</p>
            <p className="text-3xl font-black text-purple-400">{avgTimeOnSite}s</p>
            <p className="text-xs text-slate-400 mt-2">Engagement depth</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterScore('all')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
              filterScore === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            All Pages
          </button>
          <button
            onClick={() => setFilterScore('high')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
              filterScore === 'high' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            High Converting
          </button>
          <button
            onClick={() => setFilterScore('medium')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
              filterScore === 'medium' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilterScore('low')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
              filterScore === 'low' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            Needs Work
          </button>
        </div>

        {/* SECTION 2 — Page Performance Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Page Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPages.map(page => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page)}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left hover:border-slate-600 hover:bg-slate-750 transition-all"
              >
                <h4 className="text-sm font-black text-white mb-4">{page.page_name}</h4>

                {/* Conversion score */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Conversion</span>
                    <span className={`text-sm font-bold ${conversionColor(page.conversion_score || 0)}`}>
                      {page.conversion_score || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (page.conversion_score || 0) >= 70
                          ? 'bg-emerald-500'
                          : (page.conversion_score || 0) >= 40
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${page.conversion_score || 0}%` }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Visitors</p>
                    <p className="text-sm font-bold text-white">{page.visitors_count?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Drop-Off</p>
                    <p className="text-sm font-bold text-rose-400">{page.drop_off_rate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">CTA Clicks</p>
                    <p className="text-sm font-bold text-blue-400">{page.primary_cta_clicks || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Time on Page</p>
                    <p className="text-sm font-bold text-purple-400">{page.avg_time_on_page_seconds || 0}s</p>
                  </div>
                </div>

                {/* Score indicator */}
                <span className={`text-xs font-bold px-2 py-1 rounded ${conversionBg(page.conversion_score || 0)} ${conversionColor(page.conversion_score || 0)}`}>
                  {(page.conversion_score || 0) >= 70 ? 'Performing' : (page.conversion_score || 0) >= 40 ? 'Average' : 'Needs Optimization'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 4 — Engagement vs Conversion Chart */}
        {scatterData.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Engagement vs Conversion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="x"
                  name="Avg Time on Page (seconds)"
                  label={{ value: 'Time on Page (sec)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  dataKey="y"
                  name="Conversion Score"
                  label={{ value: 'Conversion %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
                />
                <Scatter name="Pages" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Drop-Off Intelligence */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Funnel Intelligence</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-950 border-emerald-700'
                    : 'bg-rose-950 border-rose-700'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '📈' : '⚠️'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-black ${insight.type === 'positive' ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {insight.title}
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">{insight.description}</p>
                      <div className={`mt-3 text-xs font-bold ${insight.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {insight.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-black text-white">{selectedPage.page_name}</h3>
              <button onClick={() => setSelectedPage(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Route */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Route</p>
                <p className="text-sm text-slate-300 font-mono">{selectedPage.page_route}</p>
              </div>

              {/* Traffic */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Visitors</p>
                  <p className="text-2xl font-black text-white">{selectedPage.visitors_count?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Avg Time</p>
                  <p className="text-2xl font-black text-purple-400">{selectedPage.avg_time_on_page_seconds || 0}s</p>
                </div>
              </div>

              {/* Conversion */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Conversion Score</p>
                <p className={`text-3xl font-black ${conversionColor(selectedPage.conversion_score || 0)}`}>
                  {selectedPage.conversion_score || 0}%
                </p>
              </div>

              {/* Drop-off */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Drop-Off Rate</p>
                <p className="text-2xl font-black text-rose-400">{selectedPage.drop_off_rate || 0}%</p>
              </div>

              {/* CTA Performance */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1">Primary CTA</p>
                  <p className="text-lg font-black text-blue-400">{selectedPage.primary_cta_clicks || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1">Demo Clicks</p>
                  <p className="text-lg font-black text-amber-400">{selectedPage.demo_clicks || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1">Trial Clicks</p>
                  <p className="text-lg font-black text-emerald-400">{selectedPage.trial_clicks || 0}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                🎨 Flag for Layout Optimization
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                ✏️ Flag for Messaging Review
              </button>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                ✓ Mark as Performing Well
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}