import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminNav from '@/components/nav/AdminNav';
import AdminGuard from '@/components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, TrendingUp, DollarSign, FileText, Play, Phone, Zap, Eye, Star, ArrowRight, Loader2, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_STYLES = {
  new: 'bg-slate-700 text-slate-300',
  watching_demo: 'bg-blue-900/40 text-blue-400',
  engaged: 'bg-violet-900/40 text-violet-400',
  pricing_viewed: 'bg-yellow-900/40 text-yellow-400',
  proposal_viewed: 'bg-orange-900/40 text-orange-400',
  trial_started: 'bg-green-900/40 text-green-400',
  booked_call: 'bg-cyan-900/40 text-cyan-400',
  closed: 'bg-emerald-900/40 text-emerald-400',
  lost: 'bg-red-900/40 text-red-400',
};

const PLAN_COLORS = { starter: 'text-cyan-400', growth: 'text-violet-400', pro: 'text-yellow-400' };

function KPICard({ icon: CardIcon, label, value, sub, color = 'text-white', bgColor = 'bg-slate-800' }) {
  const Icon = CardIcon;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
      </div>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-slate-400 text-xs font-medium mt-0.5">{label}</p>
      {sub && <p className="text-slate-600 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminSalesDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lead_score');

  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['sales-prospects'],
    queryFn: () => base44.entities.SalesProspects.list('-lead_score', 200),
    refetchInterval: 30000,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['sales-events-kpi'],
    queryFn: () => base44.entities.SalesEvents.list('-created_at', 500),
  });

  // KPIs from events (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const recentEvents = events.filter(e => e.created_at >= thirtyDaysAgo);
  const kpis = {
    active: prospects.filter(p => !['closed', 'lost'].includes(p.status)).length,
    demoStarts: recentEvents.filter(e => e.event_type === 'demo_start').length,
    pricingViews: recentEvents.filter(e => ['demo_pricing', 'deal_room_pricing'].includes(e.event_type)).length,
    proposalViews: recentEvents.filter(e => e.event_type === 'deal_room_proposal').length,
    trialStarts: prospects.filter(p => p.status === 'trial_started').length,
    bookedCalls: prospects.filter(p => p.status === 'booked_call').length,
    avgScore: prospects.length > 0 ? Math.round(prospects.reduce((s, p) => s + (p.lead_score || 0), 0) / prospects.length) : 0,
  };

  const filtered = statusFilter === 'all' ? prospects : prospects.filter(p => p.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'lead_score') return (b.lead_score || 0) - (a.lead_score || 0);
    if (sortBy === 'last_activity') return new Date(b.last_activity_at || 0) - new Date(a.last_activity_at || 0);
    return new Date(b.created_date) - new Date(a.created_date);
  });

  const hotLeads = sorted.filter(p => (p.lead_score || 0) >= 50);

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 sticky top-0 z-20 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-900/50 border border-violet-800 rounded-lg"><Zap className="w-4 h-4 text-violet-400" /></div>
              <div>
                <h1 className="text-base font-bold text-white">NTA Sales Command Center</h1>
                <p className="text-xs text-slate-500">Prospects · Pipeline · Performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('AdminSalesAssets')}><Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white text-xs">Assets</Button></Link>
              <Link to={createPageUrl('AdminSalesFollowups')}><Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white text-xs">Follow-ups</Button></Link>
              <Link to={createPageUrl('AdminSalesPrompts')}><Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white text-xs">Prompts</Button></Link>
              <Link to={createPageUrl('SalesRoom')} target="_blank"><Button size="sm" className="bg-violet-700 hover:bg-violet-600 text-xs">View Sales Room ↗</Button></Link>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <KPICard icon={Users} label="Active Prospects" value={kpis.active} color="text-white" bgColor="bg-slate-700" />
              <KPICard icon={Play} label="Demo Starts (30d)" value={kpis.demoStarts} color="text-violet-400" bgColor="bg-violet-900/40" />
              <KPICard icon={Eye} label="Pricing Views" value={kpis.pricingViews} color="text-yellow-400" bgColor="bg-yellow-900/30" />
              <KPICard icon={FileText} label="Proposal Views" value={kpis.proposalViews} color="text-orange-400" bgColor="bg-orange-900/30" />
              <KPICard icon={Zap} label="Trial Starts" value={kpis.trialStarts} color="text-green-400" bgColor="bg-green-900/30" />
              <KPICard icon={Phone} label="Booked Calls" value={kpis.bookedCalls} color="text-cyan-400" bgColor="bg-cyan-900/30" />
              <KPICard icon={Star} label="Avg Lead Score" value={kpis.avgScore} color="text-yellow-400" bgColor="bg-yellow-900/30" />
            </div>

            {/* Hot leads */}
            {hotLeads.length > 0 && (
              <div className="bg-gradient-to-r from-violet-900/20 to-slate-900 border border-violet-800 rounded-xl p-4">
                <p className="text-violet-300 font-bold text-sm mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> Hot Leads — Score 50+</p>
                <div className="flex flex-wrap gap-2">
                  {hotLeads.slice(0, 8).map(p => (
                    <Link key={p.id} to={`${createPageUrl('AdminSalesDashboard')}?prospect=${p.id}`}>
                      <div className="bg-slate-800 border border-violet-700 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-violet-500 transition-colors cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-violet-400" />
                        <span className="text-sm text-white font-medium">{p.full_name || p.email}</span>
                        <span className="text-xs text-violet-400 font-bold">{p.lead_score}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Filters & Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-white">{sorted.length} Prospects</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {['all', 'new', 'watching_demo', 'engaged', 'pricing_viewed', 'proposal_viewed', 'trial_started', 'booked_call'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${statusFilter === s ? 'bg-violet-700 border-violet-600 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-slate-500">Sort:</span>
                  {['lead_score', 'last_activity', 'created'].map(s => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${sortBy === s ? 'border-violet-600 text-violet-400' : 'border-slate-700 text-slate-600 hover:text-slate-400'}`}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
              ) : sorted.length === 0 ? (
                <div className="py-12 text-center text-slate-600">No prospects yet. Share your sales room link to start tracking.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        {['Name', 'Company', 'Industry', 'Status', 'Score', 'Plan', 'Last Activity', ''].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map(p => (
                        <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{p.full_name || '—'}</td>
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{p.company_name || p.email}</td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.industry || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[p.status] || 'bg-slate-700 text-slate-400'}`}>
                              {p.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-bold ${(p.lead_score || 0) >= 50 ? 'text-violet-400' : (p.lead_score || 0) >= 20 ? 'text-yellow-400' : 'text-slate-500'}`}>
                              {p.lead_score || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium capitalize ${PLAN_COLORS[p.recommended_plan] || 'text-slate-500'}`}>{p.recommended_plan || '—'}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                            {p.last_activity_at ? new Date(p.last_activity_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <Link to={`${createPageUrl('AdminSalesProspect')}?id=${p.id}`}>
                              <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 h-7 text-xs">View <ArrowRight className="w-3 h-3 ml-1" /></Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}