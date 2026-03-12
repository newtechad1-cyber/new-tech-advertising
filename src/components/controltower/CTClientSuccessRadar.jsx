import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, X, AlertTriangle, Zap } from 'lucide-react';

const HealthRing = ({ score }) => {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="flex-shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#1e293b" strokeWidth="5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 26 26)" />
      <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  );
};

const TrendIcon = ({ trend }) => {
  if (trend === 'up' || trend === 'improving') return <TrendingUp className="w-3 h-3 text-emerald-400" />;
  if (trend === 'down' || trend === 'declining') return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-slate-400" />;
};

const CHURN_COLORS = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-red-400' };

export default function CTClientSuccessRadar({ clients = [] }) {
  const [selected, setSelected] = useState(null);

  const sorted = [...clients].sort((a, b) => (a.health_score || 0) - (b.health_score || 0));
  const atRisk = clients.filter(c => c.health_score < 60).length;
  const healthy = clients.filter(c => c.health_score >= 80).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Client Success Radar</h2>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-400">{healthy} Healthy</span>
          <span className="text-red-400">{atRisk} At Risk</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {sorted.map((client, i) => (
          <Card
            key={i}
            className={`bg-slate-800/50 border-slate-700 cursor-pointer hover:border-slate-500 transition-all ${client.health_score < 60 ? 'border-red-700/50' : ''}`}
            onClick={() => setSelected(i)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {(client.logo_initial || client.company_name?.[0] || '?').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{client.company_name}</p>
                  <p className="text-[10px] text-slate-500">{client.vertical || 'General'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <HealthRing score={client.health_score || 0} />
                <div className="text-right space-y-0.5">
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                    <TrendIcon trend={client.lead_flow_trend} />
                    <span>Leads</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                    <TrendIcon trend={client.ranking_trend} />
                    <span>Rankings</span>
                  </div>
                  <p className="text-[10px] text-slate-500">ROI {client.roi_confidence || 0}%</p>
                </div>
              </div>
              {client.churn_risk === 'high' && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-red-400 bg-red-950/30 rounded px-1.5 py-0.5">
                  <AlertTriangle className="w-3 h-3" /> Churn Risk
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Command Panel Modal */}
      {selected !== null && sorted[selected] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <Card className="relative z-10 bg-slate-900 border-slate-700 w-full max-w-lg shadow-2xl">
            <CardHeader className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                    {(sorted[selected].logo_initial || sorted[selected].company_name?.[0] || '?').toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">{sorted[selected].company_name}</CardTitle>
                    <p className="text-xs text-slate-400">{sorted[selected].account_manager || 'No AM assigned'} · {sorted[selected].vertical}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Health Score', value: `${sorted[selected].health_score}/100`, color: sorted[selected].health_score >= 80 ? 'text-emerald-300' : sorted[selected].health_score >= 60 ? 'text-amber-300' : 'text-red-300' },
                  { label: 'Monthly MRR', value: `$${((sorted[selected].mrr || 0) / 1000).toFixed(1)}k`, color: 'text-emerald-300' },
                  { label: 'ROI Score', value: `${sorted[selected].roi_confidence || 0}%`, color: 'text-blue-300' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Publishing Activity', value: `${sorted[selected].publishing_activity || 0} pieces/mo`, trend: 'up' },
                  { label: 'Ranking Trend', value: sorted[selected].ranking_trend || 'stable', trend: sorted[selected].ranking_trend },
                  { label: 'Video Performance', value: `${sorted[selected].video_performance || 0}% engagement`, trend: 'stable' },
                  { label: 'Content Output', value: sorted[selected].content_output_level || 'medium', trend: 'stable' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-500 mb-0.5">{item.label}</p>
                    <div className="flex items-center gap-1">
                      <TrendIcon trend={item.trend} />
                      <span className="text-white font-medium capitalize">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              {sorted[selected].upsell_signals && (
                <div className="bg-amber-950/30 border border-amber-700/40 rounded-lg p-3 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-300">Upsell Signal</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sorted[selected].upsell_signals}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Churn Risk:</span>
                <span className={`font-bold ${CHURN_COLORS[sorted[selected].churn_risk || 'low']}`}>
                  {(sorted[selected].churn_risk || 'low').toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}