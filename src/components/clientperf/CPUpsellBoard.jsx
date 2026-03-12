import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Video, MapPin, Tv, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPE_CONFIG = {
  premium_video: { icon: Video, color: 'text-violet-300', bg: 'bg-violet-950/20 border-violet-700/40', badge: 'bg-violet-950 text-violet-300' },
  multi_location: { icon: MapPin, color: 'text-blue-300', bg: 'bg-blue-950/20 border-blue-700/40', badge: 'bg-blue-950 text-blue-300' },
  streaming_tv: { icon: Tv, color: 'text-pink-300', bg: 'bg-pink-950/20 border-pink-700/40', badge: 'bg-pink-950 text-pink-300' },
  authority_pack: { icon: Package, color: 'text-amber-300', bg: 'bg-amber-950/20 border-amber-700/40', badge: 'bg-amber-950 text-amber-300' },
  annual_prepay: { icon: TrendingUp, color: 'text-emerald-300', bg: 'bg-emerald-950/20 border-emerald-700/40', badge: 'bg-emerald-950 text-emerald-300' },
  social_expansion: { icon: Zap, color: 'text-cyan-300', bg: 'bg-cyan-950/20 border-cyan-700/40', badge: 'bg-cyan-950 text-cyan-300' },
};

const URGENCY_BADGE = { high: 'bg-red-950 text-red-300', medium: 'bg-amber-950 text-amber-300', low: 'bg-slate-700 text-slate-400' };

const FALLBACK = [
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', opportunity_type: 'premium_video', status: 'detected', projected_added_mrr: 800, confidence_score: 91, recommended_package: 'Video Authority Pack Pro', urgency: 'high', current_mrr: 2400, trigger_signal: 'Social video content achieving 3x avg engagement', detected_date: '2026-03-10' },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', opportunity_type: 'multi_location', status: 'detected', projected_added_mrr: 1200, confidence_score: 87, recommended_package: 'Multi-Location Growth', urgency: 'high', current_mrr: 2200, trigger_signal: 'Owner mentioned second location in last strategy call', detected_date: '2026-03-08' },
  { client_name: 'Apex Law Partners', vertical: 'Legal', opportunity_type: 'authority_pack', status: 'outreach_sent', projected_added_mrr: 600, confidence_score: 82, recommended_package: 'Legal Authority Pack', urgency: 'medium', current_mrr: 3200, trigger_signal: 'Consistent top-3 rankings; reputation management upsell ready', detected_date: '2026-03-05' },
  { client_name: 'Citywide Dental', vertical: 'Dental', opportunity_type: 'streaming_tv', status: 'detected', projected_added_mrr: 900, confidence_score: 78, recommended_package: 'Streaming TV Starter', urgency: 'medium', current_mrr: 1900, trigger_signal: 'Video content performance above 85th percentile in vertical', detected_date: '2026-03-11' },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', opportunity_type: 'social_expansion', status: 'in_discussion', projected_added_mrr: 400, confidence_score: 74, recommended_package: 'Social Expansion Add-on', urgency: 'medium', current_mrr: 1600, trigger_signal: 'Instagram reels generating strong organic traction', detected_date: '2026-03-07' },
  { client_name: 'ProHeat Systems', vertical: 'HVAC', opportunity_type: 'annual_prepay', status: 'detected', projected_added_mrr: 320, confidence_score: 88, recommended_package: 'Annual Prepay Discount (20%)', urgency: 'high', current_mrr: 1800, trigger_signal: 'Client on 6-month streak of positive performance signals', detected_date: '2026-03-12' },
];

const STATUS_BADGE = {
  detected: 'bg-slate-700 text-slate-300',
  outreach_sent: 'bg-blue-950 text-blue-300',
  in_discussion: 'bg-amber-950 text-amber-300',
  converted: 'bg-emerald-950 text-emerald-300',
  declined: 'bg-red-950 text-red-400',
};

export default function CPUpsellBoard({ opportunities = [], onRefresh }) {
  const data = opportunities.length > 0 ? opportunities : FALLBACK;
  const totalProjected = data.filter(o => o.status !== 'declined').reduce((s, o) => s + (o.projected_added_mrr || 0), 0);

  const handleLaunch = async (opp) => {
    if (opp.id && opportunities.length > 0) {
      await base44.entities.UpsellOpportunitySignal.update(opp.id, { status: 'outreach_sent' }).catch(() => {});
      onRefresh?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Upsell Opportunity Intelligence Board</h2>
        <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-700/40 rounded-xl px-3 py-1.5">
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-300">+${totalProjected.toLocaleString()} MRR potential</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((opp, i) => {
          const cfg = TYPE_CONFIG[opp.opportunity_type] || TYPE_CONFIG.authority_pack;
          const Icon = cfg.icon;
          return (
            <Card key={i} className={`border ${cfg.bg} hover:border-opacity-100 transition-all`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{opp.client_name}</p>
                      <p className="text-[10px] text-slate-500">{opp.vertical}</p>
                    </div>
                  </div>
                  <Badge className={`text-[9px] px-1.5 ${URGENCY_BADGE[opp.urgency]}`}>{opp.urgency}</Badge>
                </div>

                <Badge className={`text-[9px] px-1.5 mb-3 ${cfg.badge}`}>{opp.opportunity_type?.replace(/_/g, ' ')}</Badge>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-[10px] text-slate-500">Added MRR</p>
                    <p className="text-sm font-bold text-emerald-300">+${opp.projected_added_mrr?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-[10px] text-slate-500">Confidence</p>
                    <div>
                      <p className="text-sm font-bold text-white">{opp.confidence_score}%</p>
                      <div className="h-1 bg-slate-700 rounded-full mt-0.5">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${opp.confidence_score}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mb-2 line-clamp-2 italic">"{opp.trigger_signal}"</p>
                <p className="text-[10px] text-slate-500 mb-3">Package: <span className="text-slate-200">{opp.recommended_package}</span></p>

                <div className="flex items-center justify-between">
                  <Badge className={`text-[9px] px-1.5 ${STATUS_BADGE[opp.status]}`}>{opp.status?.replace(/_/g, ' ')}</Badge>
                  {opp.status === 'detected' && (
                    <button onClick={() => handleLaunch(opp)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-[10px] font-medium text-white transition-colors">
                      <Zap className="w-3 h-3" /> Launch Workflow
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}