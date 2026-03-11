import React from 'react';
import { Zap, CheckCircle } from 'lucide-react';

export default function ReportGenerationQueue() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-violet-400" />
        Report Generation Queue
      </h3>

      <div className="space-y-4">
        {[
          { name: 'Acme Corp', status: 'generating', progress: 65 },
          { name: 'TechStart Inc', status: 'generating', progress: 40 },
          { name: 'Global Services', status: 'queued', progress: 0 },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <span className="text-xs font-bold text-slate-400 capitalize">{item.status}</span>
            </div>
            {item.progress > 0 && (
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-600 to-violet-400 h-2 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-700 rounded-lg flex gap-2">
        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-emerald-300">Agents ready to generate reports on schedule</p>
      </div>
    </div>
  );
}