import React from 'react';
import { Building2, MapPin, Tag, DollarSign, TrendingUp, Users } from 'lucide-react';

const INDUSTRY_MARKET = {
  hvac: { size: 'Large', pop: 85000, competition: 'High', avg_ticket: 4200 },
  plumbing: { size: 'Large', pop: 85000, competition: 'High', avg_ticket: 1800 },
  roofing: { size: 'Medium', pop: 65000, competition: 'Medium', avg_ticket: 12000 },
  landscaping: { size: 'Medium', pop: 55000, competition: 'Medium', avg_ticket: 2400 },
  electrical: { size: 'Medium', pop: 65000, competition: 'Medium', avg_ticket: 3200 },
  painting: { size: 'Small', pop: 40000, competition: 'Low', avg_ticket: 5500 },
  fitness: { size: 'Medium', pop: 70000, competition: 'High', avg_ticket: 600 },
  restaurant: { size: 'Large', pop: 90000, competition: 'Very High', avg_ticket: 45 },
  real_estate: { size: 'Large', pop: 90000, competition: 'Very High', avg_ticket: 9000 },
  other: { size: 'Medium', pop: 60000, competition: 'Medium', avg_ticket: 3000 },
};

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

export default function OpportunityContext({ opportunity, engagementScore }) {
  if (!opportunity) return null;
  const market = INDUSTRY_MARKET[opportunity.industry] || INDUSTRY_MARKET.other;
  const compScore = { 'Low': 2, 'Medium': 5, 'High': 8, 'Very High': 10 }[market.competition] || 5;
  const compColor = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#ef4444', 'Very High': '#dc2626' }[market.competition] || '#94a3b8';

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base">{opportunity.company_name}</h3>
          <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5">
            {opportunity.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opportunity.city}</span>}
            {opportunity.industry && <span className="flex items-center gap-1 capitalize"><Tag className="w-3 h-3" />{opportunity.industry.replace('_', ' ')}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Est. Deal Value', value: fmt(opportunity.deal_value || 0), icon: DollarSign, color: '#10b981' },
          { label: 'Market Size', value: market.size, icon: Users, color: '#3b82f6' },
          { label: 'Competition', value: market.competition, icon: TrendingUp, color: compColor },
          { label: 'Avg Ticket', value: fmt(market.avg_ticket), icon: DollarSign, color: '#f59e0b' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-slate-900/60 rounded-xl p-3 flex items-center gap-2">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: m.color }} />
              <div>
                <p className="text-slate-500 text-xs">{m.label}</p>
                <p className="text-white text-sm font-bold">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {engagementScore !== undefined && (
        <div className="bg-slate-900/60 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-xs">Engagement Score</p>
            <span className={`text-xs font-bold ${engagementScore >= 60 ? 'text-green-400' : engagementScore >= 35 ? 'text-yellow-400' : 'text-slate-400'}`}>
              {engagementScore >= 60 ? 'Hot' : engagementScore >= 35 ? 'Warm' : 'Cold'}
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{
              width: `${engagementScore}%`,
              background: engagementScore >= 60 ? '#10b981' : engagementScore >= 35 ? '#f59e0b' : '#94a3b8'
            }} />
          </div>
          <p className="text-slate-600 text-xs mt-1">{engagementScore}% close readiness</p>
        </div>
      )}
    </div>
  );
}