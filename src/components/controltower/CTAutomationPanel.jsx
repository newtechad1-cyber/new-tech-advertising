import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Play, Pause, CheckCircle2, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_CONFIG = {
  active: { color: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-300', icon: CheckCircle2 },
  paused: { color: 'text-amber-400', badge: 'bg-amber-950 text-amber-300', icon: Pause },
  error: { color: 'text-red-400', badge: 'bg-red-950 text-red-300', icon: XCircle },
};

export default function CTAutomationPanel({ triggers = [] }) {
  const [allPaused, setAllPaused] = useState(false);
  const [pauseConfirm, setPauseConfirm] = useState(false);

  const active = triggers.filter(t => t.status === 'active').length;
  const errors = triggers.filter(t => t.status === 'error').length;
  const totalFirestoday = triggers.reduce((s, t) => s + (t.fires_today || 0), 0);

  const handlePauseAll = () => {
    if (!pauseConfirm) { setPauseConfirm(true); return; }
    setAllPaused(!allPaused);
    setPauseConfirm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Automation Command Panel</h2>
        <Button
          size="sm"
          className={`gap-1 text-xs ${allPaused ? 'bg-emerald-700 hover:bg-emerald-600' : pauseConfirm ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-amber-700 hover:bg-amber-600'}`}
          onClick={handlePauseAll}
        >
          {allPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          {allPaused ? 'Resume All' : pauseConfirm ? 'Confirm Pause?' : 'Pause All'}
        </Button>
      </div>

      {/* Global summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Active Rules', value: active, color: 'text-emerald-300' },
          { label: 'Fires Today', value: totalFirestoday, color: 'text-blue-300' },
          { label: 'Campaigns Running', value: triggers.filter(t => t.category === 'campaign').length, color: 'text-violet-300' },
          { label: 'Error Alerts', value: errors, color: errors > 0 ? 'text-red-300' : 'text-slate-500' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trigger list */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Automation Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-64 overflow-y-auto">
          {triggers.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No automation rules configured</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {triggers.map((trigger, i) => {
                const cfg = STATUS_CONFIG[allPaused ? 'paused' : (trigger.status || 'active')];
                const StatusIcon = cfg.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/30 transition-colors">
                    <StatusIcon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{trigger.rule_name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{trigger.trigger_type?.replace(/_/g, ' ')} · {trigger.category || 'general'}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-0.5">
                      <p className="text-[10px] text-slate-400">{trigger.fires_today || 0} fires</p>
                      {trigger.error_count > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-red-400">
                          <AlertTriangle className="w-3 h-3" /> {trigger.error_count}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}