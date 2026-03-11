import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function ROINarrativeBlock({ report }) {
  const narrative = report.roi_narrative_text || 
    'Your business is building steady visibility through consistent branded content distribution and strategic promotional activities. The combination of regular publishing and active campaign management creates multiple touchpoints for customer engagement.';

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-violet-400" />
        Strategic Value
      </h3>

      <div className="bg-violet-900/20 border border-violet-700 rounded-lg p-6">
        <p className="text-base text-violet-100 leading-relaxed">
          {narrative}
        </p>

        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Connection Health</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full"
                style={{ width: `${report.connection_health_score || 85}%` }}
              />
            </div>
            <span className="text-sm font-bold text-emerald-400">{report.connection_health_score || 85}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}