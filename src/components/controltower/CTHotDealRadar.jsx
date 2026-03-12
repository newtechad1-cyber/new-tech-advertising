import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, ThermometerSun, Snowflake, X, DollarSign, User, Calendar } from 'lucide-react';

const URGENCY_CONFIG = {
  hot: { icon: Flame, color: 'text-red-400', bg: 'bg-red-950/40 border-red-700/50', badge: 'bg-red-950 text-red-300' },
  warm: { icon: ThermometerSun, color: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-700/40', badge: 'bg-amber-950 text-amber-300' },
  cold: { icon: Snowflake, color: 'text-blue-400', bg: 'bg-slate-800/50 border-slate-700', badge: 'bg-slate-700 text-slate-300' },
};

export default function CTHotDealRadar({ deals = [] }) {
  const [selected, setSelected] = useState(null);

  const sorted = [...deals]
    .filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won')
    .sort((a, b) => {
      const urgencyOrder = { hot: 0, warm: 1, cold: 2 };
      return (urgencyOrder[a.urgency] || 1) - (urgencyOrder[b.urgency] || 1);
    });

  const selectedDeal = selected !== null ? sorted[selected] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hot Deal Radar</h2>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" /> Live Pipeline Heat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-[520px] overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No active deals</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {sorted.map((deal, i) => {
                const cfg = URGENCY_CONFIG[deal.urgency] || URGENCY_CONFIG.warm;
                const UrgencyIcon = cfg.icon;
                return (
                  <button
                    key={i}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/40 transition-colors text-left ${selected === i ? 'bg-slate-700/40' : ''}`}
                    onClick={() => setSelected(selected === i ? null : i)}
                  >
                    <UrgencyIcon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{deal.company_name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{deal.stage?.replace(/_/g, ' ')} · {deal.vertical || 'General'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-emerald-300">${((deal.deal_value || 0) / 1000).toFixed(0)}k</p>
                      <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{deal.urgency}</Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deal Detail Panel */}
      {selectedDeal && (
        <Card className={`border ${URGENCY_CONFIG[selectedDeal.urgency]?.bg || 'bg-slate-800/50 border-slate-700'}`}>
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white">{selectedDeal.company_name}</CardTitle>
              <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400"><DollarSign className="w-3 h-3" /> Value: <span className="text-emerald-300 font-bold">${((selectedDeal.deal_value || 0) / 1000).toFixed(0)}k</span></div>
              <div className="flex items-center gap-2 text-slate-400"><User className="w-3 h-3" /> Rep: <span className="text-white">{selectedDeal.assigned_rep || 'Unassigned'}</span></div>
              <div className="flex items-center gap-2 text-slate-400"><Calendar className="w-3 h-3" /> Close: <span className="text-white">{selectedDeal.expected_close_date || 'TBD'}</span></div>
              <div className="flex items-center gap-2 text-slate-400">Prob: <span className="text-amber-300 font-bold">{selectedDeal.close_probability || 0}%</span></div>
            </div>
            {selectedDeal.notes && (
              <p className="text-xs text-slate-400 border-t border-slate-700 pt-2">{selectedDeal.notes}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}