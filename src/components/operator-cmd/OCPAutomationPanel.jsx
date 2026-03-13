import React from 'react';
import { XCircle, Cpu, AlertTriangle, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function HealthBar({ label, value, color, max = 100 }) {
  const pct = Math.min((value / max) * 100, 100);
  const isCritical = pct >= 80;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-black" style={{ color: isCritical ? '#ef4444' : color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: isCritical ? '#ef4444' : color }} />
      </div>
    </div>
  );
}

export default function OCPAutomationPanel({ aiJobs, aiAgents }) {
  const failedJobs = aiJobs.filter(j => j.status === 'failed');
  const runningJobs = aiJobs.filter(j => j.status === 'running');
  const queuedJobs = aiJobs.filter(j => j.status === 'queued');
  const overloadedAgents = aiAgents.filter(a => a.load_percent >= 85);
  const errorAgents = aiAgents.filter(a => a.status === 'error');
  const avgLoad = aiAgents.length > 0
    ? Math.round(aiAgents.reduce((s, a) => s + (a.load_percent || 0), 0) / aiAgents.length)
    : 0;

  const overallHealth = failedJobs.length === 0 && errorAgents.length === 0 && avgLoad < 80 ? 'healthy' : failedJobs.length > 5 || errorAgents.length > 0 ? 'critical' : 'watch';
  const healthConfig = {
    healthy:  { label: 'All Systems Operational', color: '#10b981', bg: 'bg-green-50',  border: 'border-green-200' },
    watch:    { label: 'Monitor Required',         color: '#f59e0b', bg: 'bg-amber-50',  border: 'border-amber-200' },
    critical: { label: 'Intervention Required',    color: '#ef4444', bg: 'bg-red-50',    border: 'border-red-200' },
  }[overallHealth];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-black text-slate-900 text-sm">Automation Health Monitor</h2>
          <p className="text-slate-400 text-xs mt-0.5">{aiAgents.length} agents · {aiJobs.length} jobs tracked</p>
        </div>
        <Link to="/nta/ai-workforce" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
          Workforce <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-5">
        {/* Status badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-4 ${healthConfig.bg} ${healthConfig.border}`}>
          <div className="w-2 h-2 rounded-full" style={{ background: healthConfig.color }} />
          <span className="text-xs font-black" style={{ color: healthConfig.color }}>{healthConfig.label}</span>
        </div>

        {/* Job stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Failed', value: failedJobs.length, color: '#ef4444' },
            { label: 'Running', value: runningJobs.length, color: '#8b5cf6' },
            { label: 'Queued', value: queuedJobs.length, color: '#3b82f6' },
          ].map(s => (
            <div key={s.label} className="text-center p-2.5 rounded-xl bg-slate-50">
              <p className="text-lg font-black" style={{ color: s.value > 0 && s.label === 'Failed' ? '#ef4444' : '#1e293b' }}>{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Load bars */}
        <div className="space-y-0">
          <HealthBar label="Avg Agent Load" value={avgLoad} max={100} color="#8b5cf6" />
          <HealthBar label="Overloaded Agents" value={overloadedAgents.length} max={aiAgents.length || 1} color="#f59e0b" />
          <HealthBar label="Error Agents" value={errorAgents.length} max={aiAgents.length || 1} color="#ef4444" />
        </div>

        {/* Failed job list */}
        {failedJobs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-500" /> Recent Failures
            </p>
            <div className="space-y-1.5">
              {failedJobs.slice(0, 3).map((j, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-600 truncate font-medium">{j.job_type?.replace(/_/g, ' ')} — {j.client_name}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold flex-shrink-0">{j.attempts}x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}