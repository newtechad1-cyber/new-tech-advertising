import React from 'react';
import { Zap, MapPin, Users, Calendar, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MONTH_SEASONS = {
  0: { season: 'New Year', prompt: 'Q1 goal-setting campaigns resonate with service businesses in January.' },
  1: { season: 'Valentine / Pre-Spring', prompt: 'Pre-spring demand surge begins in February for HVAC, landscaping, and home services.' },
  2: { season: 'Spring Launch', prompt: 'March is prime for spring campaign activation across all service verticals.' },
  3: { season: 'Spring Peak', prompt: 'April peaks for outdoor and home service demand — amplify now.' },
  4: { season: 'Summer Prep', prompt: 'May campaign launches for summer-peak businesses see highest ROI.' },
  5: { season: 'Summer Authority', prompt: 'June visibility campaigns capture peak summer search volume.' },
  6: { season: 'Mid-Summer', prompt: 'July retention campaigns prevent summer slowdown for non-seasonal verticals.' },
  7: { season: 'Back-to-Season', prompt: 'August signals the start of fall demand — launch fall authority content now.' },
  8: { season: 'Fall Surge', prompt: 'September is the highest-ROI month for HVAC, roofing, and home prep campaigns.' },
  9: { season: 'Pre-Holiday', prompt: 'October seasonal urgency campaigns drive Q4 pipeline.' },
  10: { season: 'Holiday Authority', prompt: 'November campaigns for non-retail service businesses outperform Q4 averages.' },
  11: { season: 'Year-End Planning', prompt: 'December: Lock in Q1 strategy reviews and expansion planning sessions.' },
};

export default function OCPExpansionPanel({ growthStages, resellers, territories }) {
  const month = new Date().getMonth();
  const seasonalContext = MONTH_SEASONS[month];

  const upgradeReady = growthStages.filter(g => g.expansion_readiness_score >= 60 && g.current_package !== 'market_domination');
  const resellerOpps = resellers.filter(r => r.status === 'active' && r.pipeline_value > 0);
  const openTerritories = territories.filter(t => t.status === 'available' && t.expansion_opportunity);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-black text-slate-900 text-sm">Growth & Expansion</h2>
          <p className="text-slate-400 text-xs mt-0.5">Upgrade opportunities & market signals</p>
        </div>
        <Link to="/nta/pricing-stack" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
          Pricing stack <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-5 space-y-4">
        {/* Seasonal prompt */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-amber-700">{seasonalContext.season} Season</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">{seasonalContext.prompt}</p>
        </div>

        {/* Upgrade ready clients */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Ready for Upgrade Discussion</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white bg-purple-500">{upgradeReady.length}</span>
            </div>
            {upgradeReady.length > 0 && (
              <Link to="/admin/retention-dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5">
                View <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          {upgradeReady.length === 0 ? (
            <p className="text-xs text-slate-400 italic pl-6">No clients at upgrade threshold yet</p>
          ) : (
            <div className="space-y-1.5 pl-6">
              {upgradeReady.slice(0, 4).map((g, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-700 font-semibold truncate">{g.company_name}</p>
                  <span className="text-xs text-purple-600 font-bold flex-shrink-0">{g.expansion_readiness_score}% ready</span>
                </div>
              ))}
              {upgradeReady.length > 4 && <p className="text-xs text-slate-400">+{upgradeReady.length - 4} more</p>}
            </div>
          )}
        </div>

        {/* Reseller pipeline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Reseller Pipeline</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{resellerOpps.length}</span>
            </div>
            <Link to="/nta/reseller-command" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5">
              View <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {resellerOpps.length === 0 ? (
            <p className="text-xs text-slate-400 italic pl-6">No active reseller pipeline</p>
          ) : (
            <div className="space-y-1.5 pl-6">
              {resellerOpps.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-700 font-semibold truncate">{r.company_name}</p>
                  <span className="text-xs text-blue-600 font-bold">${r.pipeline_value?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Territory signals */}
        {openTerritories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Territory Expansion Signals</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">{openTerritories.length}</span>
            </div>
            <div className="space-y-1.5 pl-6">
              {openTerritories.slice(0, 3).map((t, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-700 font-semibold">{t.territory_name}, {t.state}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">Available</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}