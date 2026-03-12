import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Rocket, TrendingUp, Users, Target, BarChart2 } from 'lucide-react';

const STATUS_CONFIG = {
  dominated: { color: '#10b981', label: 'Dominated', badge: 'bg-emerald-950 text-emerald-300' },
  active: { color: '#f59e0b', label: 'Active', badge: 'bg-amber-950 text-amber-300' },
  opportunity: { color: '#ef4444', label: 'Opportunity', badge: 'bg-red-950 text-red-300' },
};

export default function CTMarketMap({ zones = [] }) {
  const [selectedZone, setSelectedZone] = useState(null);

  const dominated = zones.filter(z => z.status === 'dominated');
  const active = zones.filter(z => z.status === 'active');
  const opportunity = zones.filter(z => z.status === 'opportunity');

  const displayZone = selectedZone !== null ? zones[selectedZone] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Market Expansion Intelligence</h2>
        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-xs gap-1">
          <Rocket className="w-3 h-3" /> Launch Expansion Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Map Placeholder */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">U.S. Market Coverage</CardTitle>
                <div className="flex gap-2 ml-auto">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <span key={key} className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {/* SVG-based simplified map representation */}
              <div className="relative bg-slate-900 rounded-xl overflow-hidden h-48 border border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-600 text-xs">Interactive Map • {zones.length} Zones Tracked</p>
                </div>
                {/* Dot grid simulating cities */}
                <div className="absolute inset-0 p-4">
                  {zones.map((zone, i) => {
                    const cfg = STATUS_CONFIG[zone.status] || STATUS_CONFIG.opportunity;
                    // Spread dots across the container based on index
                    const left = 10 + ((zone.lng ? (zone.lng + 125) / 60 : (i * 11) % 80)) + '%';
                    const top = 15 + ((zone.lat ? (50 - zone.lat) / 20 : (i * 13) % 70)) + '%';
                    return (
                      <button
                        key={i}
                        className="absolute w-3 h-3 rounded-full border-2 border-slate-900 hover:scale-150 transition-transform cursor-pointer"
                        style={{ background: cfg.color, left, top, transform: 'translate(-50%, -50%)' }}
                        onClick={() => setSelectedZone(selectedZone === i ? null : i)}
                        title={`${zone.city}, ${zone.state}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Zone summary stats */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: 'Dominated', count: dominated.length, color: 'text-emerald-300', sub: 'Full market penetration' },
                  { label: 'Active', count: active.length, color: 'text-amber-300', sub: 'Campaigns in flight' },
                  { label: 'Opportunity', count: opportunity.length, color: 'text-red-300', sub: 'High-value targets' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                    <p className="text-[10px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side data panel */}
        <div>
          <Card className="bg-slate-800/50 border-slate-700 h-full">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">
                {displayZone ? `${displayZone.city}, ${displayZone.state}` : 'Market Intelligence'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {displayZone ? (
                <div className="space-y-3">
                  <Badge className={STATUS_CONFIG[displayZone.status]?.badge}>{displayZone.status}</Badge>
                  {[
                    { icon: TrendingUp, label: 'Vertical Penetration', value: `${displayZone.vertical_penetration || 0}%` },
                    { icon: Target, label: 'Lead Demand Index', value: displayZone.lead_demand_index || 0 },
                    { icon: Users, label: 'Competitor Density', value: displayZone.competitor_density_score || 0 },
                    { icon: BarChart2, label: 'Market Value', value: `$${((displayZone.projected_market_value || 0) / 1000).toFixed(0)}k` },
                    { icon: Users, label: 'Active Clients', value: displayZone.active_clients || 0 },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <item.icon className="w-3 h-3" />
                        {item.label}
                      </div>
                      <span className="font-bold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 mb-3">Top Opportunity Zones</p>
                  {zones
                    .filter(z => z.status === 'opportunity')
                    .sort((a, b) => (b.projected_market_value || 0) - (a.projected_market_value || 0))
                    .slice(0, 5)
                    .map((z, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center justify-between px-2 py-1.5 bg-slate-900/50 rounded hover:bg-slate-700/50 transition-colors"
                        onClick={() => setSelectedZone(zones.indexOf(z))}
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {z.city}, {z.state}
                        </div>
                        <span className="text-xs text-emerald-300 font-semibold">${((z.projected_market_value || 0) / 1000).toFixed(0)}k</span>
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}