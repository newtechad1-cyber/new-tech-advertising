import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, TrendingUp, Zap, RefreshCw, Flag, Award, AlertTriangle } from 'lucide-react';

const EVENT_CONFIG = {
  onboarding_complete: { icon: CheckCircle2, color: 'text-teal-400', dot: 'bg-teal-500', label: 'Onboarding Complete' },
  first_content: { icon: Zap, color: 'text-blue-400', dot: 'bg-blue-500', label: 'First Content Published' },
  ranking_breakthrough: { icon: TrendingUp, color: 'text-emerald-400', dot: 'bg-emerald-500', label: 'Ranking Breakthrough' },
  viral_post: { icon: Star, color: 'text-amber-400', dot: 'bg-amber-500', label: 'Viral Social Post' },
  upsell_accepted: { icon: Award, color: 'text-violet-400', dot: 'bg-violet-500', label: 'Upsell Accepted' },
  renewal_milestone: { icon: RefreshCw, color: 'text-cyan-400', dot: 'bg-cyan-500', label: 'Renewal Milestone' },
  performance_review: { icon: Flag, color: 'text-slate-400', dot: 'bg-slate-500', label: 'Performance Review' },
  risk_flagged: { icon: AlertTriangle, color: 'text-red-400', dot: 'bg-red-500', label: 'Risk Flagged' },
};

const TIER_BADGE = {
  starter: 'bg-slate-700 text-slate-300',
  growth: 'bg-blue-950 text-blue-300',
  professional: 'bg-violet-950 text-violet-300',
  enterprise: 'bg-amber-950 text-amber-300',
};

const FALLBACK = [
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', revenue_tier: 'professional', city: 'Denver', state: 'CO', event_type: 'ranking_breakthrough', event_date: '2026-03-10', headline: '18 keywords moved to top 5 — spring SEO surge', description: 'Dominant local visibility achieved in Denver metro for AC installation and emergency HVAC terms.', milestone: true, mrr_at_event: 2400 },
  { client_name: 'Citywide Dental', vertical: 'Dental', revenue_tier: 'growth', city: 'Orlando', state: 'FL', event_type: 'viral_post', event_date: '2026-03-08', headline: 'Instagram Reel hit 38K reach in 48 hours', description: '"Same-day crown" demo video went viral in Orlando dental market — inquiry spike followed.', milestone: true, mrr_at_event: 1900 },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', revenue_tier: 'professional', city: 'Charlotte', state: 'NC', event_type: 'upsell_accepted', event_date: '2026-03-06', headline: 'Accepted multi-location expansion package', description: 'Signed second location upgrade. MRR increasing to $3,400 starting next cycle.', milestone: true, mrr_at_event: 2200 },
  { client_name: 'ProHeat Systems', vertical: 'HVAC', revenue_tier: 'growth', city: 'Dallas', state: 'TX', event_type: 'first_content', event_date: '2026-03-01', headline: 'First video published — 4.2K organic reach in week 1', description: 'Spring heat pump promotion video launched on Facebook and Instagram with strong native traction.', milestone: false, mrr_at_event: 1800 },
  { client_name: 'CoolBreeze HVAC', vertical: 'HVAC', revenue_tier: 'starter', city: 'Tampa', state: 'FL', event_type: 'risk_flagged', event_date: '2026-02-28', headline: 'Performance decline flagged — retention intervention needed', description: 'Content production paused. Engagement down 44%. Churn risk elevated to critical.', milestone: false, mrr_at_event: 800 },
  { client_name: 'Apex Law Partners', vertical: 'Legal', revenue_tier: 'enterprise', city: 'Chicago', state: 'IL', event_type: 'renewal_milestone', event_date: '2026-02-22', headline: 'Renewed annual contract — year 2 milestone', description: 'Strong ROI documentation supported renewal discussion. Client noted 3x estimated lead growth.', milestone: true, mrr_at_event: 3200 },
  { client_name: 'Taco Loco Franchise', vertical: 'Restaurant', revenue_tier: 'starter', city: 'Austin', state: 'TX', event_type: 'onboarding_complete', event_date: '2026-02-15', headline: 'Onboarding complete — first campaign launched', description: 'All brand assets collected, social accounts connected, and first weekly content batch scheduled.', milestone: false, mrr_at_event: 900 },
];

const VERTICALS = ['All', 'HVAC', 'Restaurant', 'Home Services', 'Legal', 'Dental'];
const TIERS = ['All', 'starter', 'growth', 'professional', 'enterprise'];

export default function CPTimeline({ events = [] }) {
  const [vertFilter, setVertFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const data = events.length > 0 ? events : FALLBACK;

  const filtered = data.filter(e => {
    if (vertFilter !== 'All' && e.vertical !== vertFilter) return false;
    if (tierFilter !== 'All' && e.revenue_tier !== tierFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Performance Timeline Visualization</h2>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1.5 overflow-x-auto">
          {VERTICALS.map(v => (
            <button key={v} onClick={() => setVertFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${vertFilter === v ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {TIERS.map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-colors ${tierFilter === t ? 'bg-violet-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-700" />
        <div className="space-y-4">
          {filtered.map((event, i) => {
            const cfg = EVENT_CONFIG[event.event_type] || EVENT_CONFIG.performance_review;
            const Icon = cfg.icon;
            return (
              <div key={i} className="relative flex gap-4">
                <div className={`absolute -left-3.5 top-3 w-3 h-3 rounded-full border-2 border-slate-900 ${cfg.dot} ${event.milestone ? 'w-4 h-4 -left-4' : ''}`} />
                <div className={`flex-1 bg-slate-800/60 border rounded-xl p-4 hover:border-slate-600 transition-colors ${event.milestone ? 'border-slate-600' : 'border-slate-700'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color} flex-shrink-0`} />
                      <p className="text-xs font-bold text-white">{event.headline}</p>
                      {event.milestone && <Star className="w-3 h-3 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap flex-shrink-0">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">{event.description}</p>
                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    <span className="text-slate-500">{event.client_name}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{event.vertical}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{event.city}, {event.state}</span>
                    <Badge className={`text-[9px] px-1.5 ${TIER_BADGE[event.revenue_tier]}`}>{event.revenue_tier}</Badge>
                    <span className="ml-auto text-slate-500">${event.mrr_at_event?.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-600 text-xs">No timeline events matching current filters</div>
          )}
        </div>
      </div>
    </div>
  );
}