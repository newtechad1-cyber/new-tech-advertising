import React, { useState } from 'react';
import { AlertCircle, RefreshCw, X, ChevronDown, Wifi, FileX, Cpu, Send } from 'lucide-react';

const ERROR_CATEGORIES = [
  { id: 'api_failure',    label: 'API Connection Errors',          icon: Wifi,  color: '#ef4444' },
  { id: 'content_error',  label: 'Content Generation Failures',    icon: FileX, color: '#f59e0b' },
  { id: 'publish_error',  label: 'Publishing Failures',            icon: Send,  color: '#8b5cf6' },
  { id: 'agent_error',    label: 'Agent Processing Errors',        icon: Cpu,   color: '#ec4899' },
];

const MOCK_ERRORS = [
  { id: 1, category: 'api_failure',   message: 'Meta Graph API rate limit exceeded', client: 'ABC Plumbing', time: '12 min ago', retries: 2 },
  { id: 2, category: 'content_error', message: 'OpenAI timeout on blog generation task', client: 'Peak HVAC', time: '34 min ago', retries: 1 },
  { id: 3, category: 'publish_error', message: 'Instagram page token expired', client: 'Lone Star Roofing', time: '1 hr ago', retries: 0 },
  { id: 4, category: 'agent_error',   message: 'Agent memory overflow — task queue stall', client: 'Internal', time: '2 hr ago', retries: 3 },
  { id: 5, category: 'api_failure',   message: 'Google Business API auth failure', client: 'Metro Electric', time: '3 hr ago', retries: 1 },
];

export default function AWFailureDiagnostics({ jobs, onRetryAll }) {
  const [openCat, setOpenCat] = useState('api_failure');
  const failedJobs = jobs.filter(j => j.status === 'failed');
  const errors = failedJobs.length > 0
    ? failedJobs.map(j => ({ id: j.id, category: 'agent_error', message: j.error_message || 'Unknown error', client: j.client_name, time: 'Recently', retries: j.attempts || 0 }))
    : MOCK_ERRORS;

  const byCat = {};
  ERROR_CATEGORIES.forEach(c => { byCat[c.id] = errors.filter(e => e.category === c.id); });

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <h3 className="text-white font-bold text-sm">Failure Diagnostics</h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-900/30 border border-red-800/40 text-red-400">{errors.length} issues</span>
        </div>
        <button onClick={onRetryAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-400 border border-purple-800/40 hover:bg-purple-900/20 transition-colors">
          <RefreshCw className="w-3 h-3" /> Retry All
        </button>
      </div>

      <div className="p-4 space-y-2">
        {ERROR_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const catErrors = byCat[cat.id] || [];
          const isOpen = openCat === cat.id;
          return (
            <div key={cat.id} className="rounded-xl border border-slate-700/40 overflow-hidden">
              <button onClick={() => setOpenCat(isOpen ? null : cat.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800/30 transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}15` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                </div>
                <span className="flex-1 text-sm font-semibold text-slate-300">{cat.label}</span>
                {catErrors.length > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ color: cat.color, background: `${cat.color}18` }}>
                    {catErrors.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-slate-700/40 divide-y divide-slate-800/40">
                  {catErrors.length === 0 ? (
                    <p className="px-4 py-3 text-slate-600 text-xs">No errors in this category.</p>
                  ) : catErrors.map((err, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3">
                      <div className="flex-1">
                        <p className="text-slate-300 text-xs font-semibold">{err.message}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-600">
                          <span>{err.client}</span>
                          <span>{err.time}</span>
                          <span>{err.retries} retries</span>
                        </div>
                      </div>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300 flex-shrink-0 font-semibold">Retry</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}