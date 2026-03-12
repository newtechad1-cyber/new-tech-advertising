import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Zap, MapPin, Video, Tv, TrendingUp, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPE_CONFIG = {
  expansion_ready: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-700/40', badge: 'bg-emerald-950 text-emerald-300', label: 'Expansion Ready' },
  multi_location: { icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-950/20 border-blue-700/40', badge: 'bg-blue-950 text-blue-300', label: 'Multi-Location' },
  premium_video: { icon: Video, color: 'text-violet-400', bg: 'bg-violet-950/20 border-violet-700/40', badge: 'bg-violet-950 text-violet-300', label: 'Premium Video' },
  streaming_tv: { icon: Tv, color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-700/40', badge: 'bg-cyan-950 text-cyan-300', label: 'Streaming TV' },
  annual_conversion: { icon: Star, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-700/40', badge: 'bg-amber-950 text-amber-300', label: 'Annual Plan' },
};

const STATUS_BADGE = {
  detected: 'bg-slate-700 text-slate-300',
  outreach_sent: 'bg-blue-950 text-blue-300',
  in_discussion: 'bg-violet-950 text-violet-300',
  converted: 'bg-emerald-950 text-emerald-300',
  declined: 'bg-red-950 text-red-300',
};

const FALLBACK = [
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', opportunity_type: 'expansion_ready', status: 'detected', projected_added_mrr: 1500, confidence_score: 88, recommended_offer: 'Growth → Professional upgrade with AI video pack', current_mrr: 1497, assigned_rep: 'Sarah L.', detected_date: '2026-03-10' },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', opportunity_type: 'premium_video', status: 'outreach_sent', projected_added_mrr: 800, confidence_score: 74, recommended_offer: 'Add AI Video ×4/mo + YouTube distribution', current_mrr: 1497, assigned_rep: 'Jake M.', detected_date: '2026-03-08' },
  { client_name: 'ProHeat Systems', vertical: 'HVAC', opportunity_type: 'annual_conversion', status: 'in_discussion', projected_added_mrr: 299, confidence_score: 91, recommended_offer: 'Lock in annual contract — save 2 months', current_mrr: 2497, assigned_rep: 'Tom R.', detected_date: '2026-03-07' },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', opportunity_type: 'streaming_tv', status: 'detected', projected_added_mrr: 1200, confidence_score: 61, recommended_offer: 'Streaming TV ad campaign — restaurant demo targeting', current_mrr: 997, assigned_rep: 'Maria C.', detected_date: '2026-03-11' },
  { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', opportunity_type: 'multi_location', status: 'detected', projected_added_mrr: 2400, confidence_score: 55, recommended_offer: 'Expand to 2nd service area — Charlotte market', current_mrr: 1497, assigned_rep: 'Jake M.', detected_date: '2026-03-09' },
];

export default function CLEUpsellEngine({ opportunities = [], onRefresh }) {
  const [launching, setLaunching] = useState(null);
  const data = opportunities.length > 0 ? opportunities : FALLBACK;

  const totalAddedMRR = data.filter(o => o.status !== 'declined').reduce((s, o) => s + (o.projected_added_mrr || 0), 0);
  const converted = data.filter(o => o.status === 'converted').length;

  const handleLaunch = async (opp) => {
    setLaunching(opp.client_name);
    await base44.entities.UpsellOpportunity.update?.(opp.id, { status: 'outreach_sent' }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    setLaunching(null);
    onRefresh?.();
  };

  const grouped = Object.keys(TYPE_CONFIG).reduce((acc, t) => {
    acc[t] = data.filter(o => o.opportunity_type === t);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Upsell & Expansion Trigger Engine</h2>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500">Total Upsell Pipeline</p>
            <p className="text-2xl font-bold text-emerald-300">${totalAddedMRR.toLocaleString()}<span className="text-xs text-slate-500">/mo</span></p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500">Opportunities Detected</p>
            <p className="text-2xl font-bold text-violet-300">{data.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500">Converted This Month</p>
            <p className="text-2xl font-bold text-amber-300">{converted}</p>
          </CardContent>
        </Card>
      </div>

      {/* Type summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const Icon = cfg.icon;
          const count = grouped[type]?.length || 0;
          return (
            <div key={type} className={`border rounded-xl p-3 ${cfg.bg}`}>
              <Icon className={`w-4 h-4 ${cfg.color} mb-1`} />
              <p className="text-[10px] text-slate-400">{cfg.label}</p>
              <p className="text-xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Opportunity cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((opp, i) => {
          const cfg = TYPE_CONFIG[opp.opportunity_type] || TYPE_CONFIG.expansion_ready;
          const Icon = cfg.icon;
          return (
            <Card key={i} className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} border ${cfg.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{opp.client_name}</p>
                      <p className="text-[10px] text-slate-500">{opp.vertical}</p>
                    </div>
                  </div>
                  <Badge className={`text-[9px] px-1.5 ${STATUS_BADGE[opp.status]}`}>{opp.status?.replace('_', ' ')}</Badge>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-2.5 mb-3">
                  <p className="text-[10px] text-slate-500 mb-1">Recommended Offer</p>
                  <p className="text-xs text-slate-300">{opp.recommended_offer}</p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-slate-500">Added MRR</p>
                    <p className="text-sm font-bold text-emerald-300">+${(opp.projected_added_mrr || 0).toLocaleString()}/mo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500">Confidence</p>
                    <p className="text-sm font-bold text-violet-300">{opp.confidence_score}%</p>
                  </div>
                </div>

                <div className="h-1 bg-slate-700 rounded-full mb-3">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full" style={{ width: `${opp.confidence_score}%` }} />
                </div>

                {opp.status === 'detected' && (
                  <Button size="sm" className="w-full bg-emerald-700 hover:bg-emerald-600 text-xs h-7"
                    onClick={() => handleLaunch(opp)}
                    disabled={launching === opp.client_name}>
                    <Zap className="w-3 h-3 mr-1" />
                    {launching === opp.client_name ? 'Launching...' : 'Launch Upsell Workflow'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}