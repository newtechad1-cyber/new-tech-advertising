import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Play, Package, CheckCircle2, TrendingUp, Star, RefreshCw, AlertTriangle, Shield } from 'lucide-react';

const EVENT_CONFIG = {
  deal_closed: { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-950/30', dot: 'bg-emerald-500', label: 'Deal Closed' },
  onboarding_started: { icon: Play, color: 'text-blue-400', bg: 'bg-blue-950/30', dot: 'bg-blue-500', label: 'Onboarding Started' },
  assets_submitted: { icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-950/30', dot: 'bg-indigo-500', label: 'Assets Submitted' },
  strategy_approved: { icon: CheckCircle2, color: 'text-violet-400', bg: 'bg-violet-950/30', dot: 'bg-violet-500', label: 'Strategy Approved' },
  first_content_published: { icon: CheckCircle2, color: 'text-cyan-400', bg: 'bg-cyan-950/30', dot: 'bg-cyan-500', label: 'First Content Live' },
  first_ranking_improvement: { icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-950/30', dot: 'bg-teal-500', label: 'First Ranking ↑' },
  upsell_converted: { icon: Star, color: 'text-amber-400', bg: 'bg-amber-950/30', dot: 'bg-amber-500', label: 'Upsell Converted' },
  renewal_checkpoint: { icon: RefreshCw, color: 'text-orange-400', bg: 'bg-orange-950/30', dot: 'bg-orange-500', label: 'Renewal Checkpoint' },
  risk_flagged: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-950/30', dot: 'bg-red-500', label: 'Risk Flagged' },
  intervention_triggered: { icon: Shield, color: 'text-pink-400', bg: 'bg-pink-950/30', dot: 'bg-pink-500', label: 'Intervention' },
};

const TIER_BADGE = {
  starter: 'bg-slate-700 text-slate-300',
  growth: 'bg-blue-950 text-blue-300',
  professional: 'bg-violet-950 text-violet-300',
  enterprise: 'bg-amber-950 text-amber-300',
};

const FALLBACK_EVENTS = [
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'deal_closed', event_date: '2026-01-12', description: 'Closed Growth plan at $1,497/mo', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'onboarding_started', event_date: '2026-01-13', description: 'Onboarding workflow initiated', milestone: false, revenue_tier: 'growth', mrr_at_event: 1497 },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', event_type: 'deal_closed', event_date: '2026-01-18', description: 'Closed Professional plan at $2,497/mo', milestone: true, revenue_tier: 'professional', mrr_at_event: 2497 },
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'first_content_published', event_date: '2026-01-25', description: 'First blog post and social video published', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', event_type: 'deal_closed', event_date: '2026-02-02', description: 'Closed Starter plan at $997/mo', milestone: true, revenue_tier: 'starter', mrr_at_event: 997 },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', event_type: 'strategy_approved', event_date: '2026-02-05', description: 'Content strategy and voice approved', milestone: false, revenue_tier: 'professional', mrr_at_event: 2497 },
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'first_ranking_improvement', event_date: '2026-02-14', description: '6 keywords moved to page 1', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
  { client_name: 'ProHeat Systems', vertical: 'HVAC', event_type: 'deal_closed', event_date: '2026-02-18', description: 'Closed Growth plan at $1,497/mo', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
  { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', event_type: 'risk_flagged', event_date: '2026-03-05', description: 'Low activity and stalled automation detected', milestone: false, revenue_tier: 'growth', mrr_at_event: 1497 },
  { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'upsell_converted', event_date: '2026-03-08', description: 'Upgraded to Professional — AI Video added', milestone: true, revenue_tier: 'professional', mrr_at_event: 2497 },
  { client_name: 'Mesa Grill Group', vertical: 'Restaurant', event_type: 'intervention_triggered', event_date: '2026-03-10', description: 'Retention intervention activated', milestone: false, revenue_tier: 'starter', mrr_at_event: 997 },
  { client_name: 'Precision Plumbing', vertical: 'Home Services', event_type: 'first_ranking_improvement', event_date: '2026-03-11', description: '9 keywords moved up, lead volume increased', milestone: true, revenue_tier: 'professional', mrr_at_event: 2497 },
];

const VERTICALS = ['All Verticals', 'HVAC', 'Restaurant', 'Home Services', 'Roofing'];
const TIERS = ['All Tiers', 'starter', 'growth', 'professional', 'enterprise'];

export default function CLETimeline({ events = [] }) {
  const [verticalFilter, setVerticalFilter] = useState('All Verticals');
  const [tierFilter, setTierFilter] = useState('All Tiers');

  const data = (events.length > 0 ? events : FALLBACK_EVENTS)
    .filter(e => verticalFilter === 'All Verticals' || e.vertical === verticalFilter)
    .filter(e => tierFilter === 'All Tiers' || e.revenue_tier === tierFilter)
    .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  const milestones = data.filter(e => e.milestone).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lifecycle Timeline Visualization</h2>
        <div className="flex gap-2">
          <select value={verticalFilter} onChange={e => setVerticalFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none">
            {VERTICALS.map(v => <option key={v}>{v}</option>)}
          </select>
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none">
            {TIERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 flex gap-3 items-center">
            <div>
              <p className="text-[10px] text-slate-500">Total Events</p>
              <p className="text-2xl font-bold text-white">{data.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 flex gap-3 items-center">
            <div>
              <p className="text-[10px] text-slate-500">Milestones</p>
              <p className="text-2xl font-bold text-amber-300">{milestones}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-0">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[2.75rem] top-0 bottom-0 w-px bg-slate-700" />

            <div className="divide-y divide-slate-700/30">
              {data.map((event, i) => {
                const cfg = EVENT_CONFIG[event.event_type] || EVENT_CONFIG.deal_closed;
                const Icon = cfg.icon;
                return (
                  <div key={i} className="flex gap-4 px-4 py-4 hover:bg-slate-800/30 transition-colors relative">
                    {/* Date */}
                    <div className="w-16 flex-shrink-0 text-right">
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Dot */}
                    <div className="relative flex-shrink-0 flex items-start justify-center w-4 pt-0.5">
                      <div className={`w-3 h-3 rounded-full border-2 border-slate-900 ${cfg.dot} ${event.milestone ? 'ring-2 ring-offset-1 ring-offset-slate-900' : ''}`}
                        style={event.milestone ? { boxShadow: `0 0 6px ${cfg.dot.replace('bg-', '')}` } : {}} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`w-5 h-5 rounded-md ${cfg.bg} flex items-center justify-center`}>
                          <Icon className={`w-3 h-3 ${cfg.color}`} />
                        </div>
                        <p className="text-xs font-semibold text-white">{event.client_name}</p>
                        <Badge className={`text-[9px] px-1.5 ${TIER_BADGE[event.revenue_tier]}`}>{event.revenue_tier}</Badge>
                        {event.milestone && <Badge className="text-[9px] px-1.5 bg-amber-950 text-amber-300">★ Milestone</Badge>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{cfg.label} — {event.description}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{event.vertical} · ${(event.mrr_at_event || 0).toLocaleString()}/mo</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}