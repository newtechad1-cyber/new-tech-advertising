import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, TrendingDown, X, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const RISK_CONFIG = {
  critical: { badge: 'bg-red-950 text-red-300', border: 'border-red-700/40', dot: 'bg-red-500' },
  high: { badge: 'bg-orange-950 text-orange-300', border: 'border-orange-700/40', dot: 'bg-orange-500' },
  medium: { badge: 'bg-amber-950 text-amber-300', border: 'border-amber-700/40', dot: 'bg-amber-500' },
  low: { badge: 'bg-slate-700 text-slate-300', border: 'border-slate-600', dot: 'bg-slate-500' },
};

const FALLBACK = [
  { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', churn_probability: 78, risk_level: 'critical', primary_signal: 'No content in 18 days, automation stalled, low engagement', satisfaction_trend: 'declining', low_production_activity: true, negative_engagement: true, intervention_status: 'none', assigned_manager: 'Jake M.', days_until_renewal: 22, mrr: 1497 },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', churn_probability: 54, risk_level: 'high', primary_signal: 'Posting frequency dropped 60%, owner unresponsive to check-ins', satisfaction_trend: 'declining', low_production_activity: true, negative_engagement: false, intervention_status: 'triggered', assigned_manager: 'Maria C.', days_until_renewal: 48, mrr: 997 },
  { client_name: 'Sun Valley Landscaping', vertical: 'Home Services', churn_probability: 38, risk_level: 'medium', primary_signal: 'Questions about ROI, comparing to competitor', satisfaction_trend: 'stable', low_production_activity: false, negative_engagement: false, intervention_status: 'in_progress', assigned_manager: 'Tom R.', days_until_renewal: 15, mrr: 1497 },
];

const InterventionModal = ({ client, onClose, onSave }) => {
  const [note, setNote] = useState('');

  const handleActivate = async () => {
    if (client.id) {
      await base44.entities.RetentionRiskFlag.update(client.id, { intervention_status: 'triggered' }).catch(() => {});
    }
    onSave?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 bg-slate-900 border-red-700/50 w-full max-w-md shadow-2xl">
        <CardHeader className="border-b border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Activate Retention Intervention
            </CardTitle>
            <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Client: <strong className="text-white">{client.client_name}</strong> · {client.churn_probability}% churn risk</p>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-3">
            <p className="text-xs text-red-300 font-semibold mb-1">Risk Signal</p>
            <p className="text-xs text-slate-300">{client.primary_signal}</p>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="font-semibold text-white">Intervention actions will trigger:</p>
            {['Immediate manager notification', 'Escalation to founder review', 'Pause billing auto-renewal', 'Schedule retention call within 48h', 'AI-generated recovery proposal'].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {a}
              </div>
            ))}
          </div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add notes for the intervention team..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none focus:border-red-500 h-16" />
          <Button className="w-full bg-red-700 hover:bg-red-600" onClick={handleActivate}>
            <Shield className="w-4 h-4 mr-2" /> Activate Retention Intervention
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function CLERetentionPanel({ flags = [], onRefresh }) {
  const [interventionClient, setInterventionClient] = useState(null);
  const data = flags.length > 0 ? flags : FALLBACK;

  const critical = data.filter(f => f.risk_level === 'critical').length;
  const mrrAtRisk = data.reduce((s, f) => s + (f.mrr || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retention & Risk Control Panel</h2>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-red-950/20 border-red-700/40">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500">Critical Risk</p>
            <p className="text-2xl font-bold text-red-300">{critical}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500">MRR At Risk</p>
            <p className="text-2xl font-bold text-amber-300">${mrrAtRisk.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500">Interventions Active</p>
            <p className="text-2xl font-bold text-violet-300">{data.filter(f => f.intervention_status !== 'none').length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {data.map((flag, i) => {
          const cfg = RISK_CONFIG[flag.risk_level] || RISK_CONFIG.medium;
          return (
            <div key={i} className={`border rounded-xl p-4 bg-slate-800/50 ${cfg.border}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-white">{flag.client_name}</p>
                      <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{flag.risk_level}</Badge>
                      <Badge className="text-[9px] px-1.5 bg-slate-700 text-slate-400">{flag.churn_probability}% churn</Badge>
                      {flag.days_until_renewal && (
                        <Badge className="text-[9px] px-1.5 bg-orange-950 text-orange-300">{flag.days_until_renewal}d to renewal</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{flag.primary_signal}</p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                      {flag.low_production_activity && <span className="text-amber-400">⚠ Low production</span>}
                      {flag.negative_engagement && <span className="text-red-400">⚠ Negative engagement</span>}
                      <span>Satisfaction: <span className={flag.satisfaction_trend === 'declining' ? 'text-red-300' : flag.satisfaction_trend === 'improving' ? 'text-emerald-300' : 'text-slate-300'}>{flag.satisfaction_trend}</span></span>
                      <span>${(flag.mrr || 0).toLocaleString()}/mo · {flag.assigned_manager}</span>
                    </div>
                  </div>
                </div>
                {flag.intervention_status === 'none' || flag.risk_level === 'critical' ? (
                  <Button size="sm" className="bg-red-800 hover:bg-red-700 text-xs gap-1 flex-shrink-0 h-7"
                    onClick={() => setInterventionClient(flag)}>
                    <Shield className="w-3 h-3" /> Intervene
                  </Button>
                ) : (
                  <Badge className={`text-xs flex-shrink-0 ${flag.intervention_status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-violet-950 text-violet-300'}`}>
                    {flag.intervention_status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {interventionClient && (
        <InterventionModal client={interventionClient} onClose={() => setInterventionClient(null)} onSave={onRefresh} />
      )}
    </div>
  );
}