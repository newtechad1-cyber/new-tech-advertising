import React from 'react';
import { AlertCircle, Zap, TrendingUp, Clock } from 'lucide-react';
import { useGlobalContext } from '@/components/context/useGlobalContext';

export default function CommandStrip({ metrics }) {
  const { active_context_type, active_company_name } = useGlobalContext();

  const getHealthStatus = () => {
    const passRate = metrics.total > 0 ? Math.round((metrics.published / metrics.total) * 100) : 0;
    if (passRate >= 80) return { color: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'Healthy' };
    if (passRate >= 50) return { color: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'At Risk' };
    return { color: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Critical' };
  };

  const health = getHealthStatus();
  const passRate = metrics.total > 0 ? Math.round((metrics.published / metrics.total) * 100) : 0;

  return (
    <div className={`${health.color} border rounded-lg p-4`}>
      <div className="flex items-center justify-between gap-6">
        {/* Left: Status Summary */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${passRate >= 80 ? 'bg-green-500' : passRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-semibold ${health.text}`}>{health.label} Publishing Pipeline</span>
            <span className={`text-xs ${health.text}`}>•</span>
            <span className={`text-xs ${health.text}`}>{passRate}% delivery rate</span>
          </div>
          <p className="text-xs text-slate-600">
            Context: <span className="font-mono text-slate-700">{active_context_type}</span>
            {active_company_name && <> • <span className="font-mono text-slate-700">{active_company_name}</span></>}
          </p>
        </div>

        {/* Center: Key Metrics */}
        <div className="flex gap-6 items-center py-2 border-l border-r border-slate-300 px-6">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{metrics.awaitingReview}</div>
            <p className="text-xs text-slate-600">Awaiting Review</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{metrics.ready}</div>
            <p className="text-xs text-slate-600">Ready to Publish</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{metrics.failed}</div>
            <p className="text-xs text-slate-600">Failed / Blocked</p>
          </div>
        </div>

        {/* Right: Next Action */}
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end gap-2">
            {metrics.failed > 0 ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-700">Fix {metrics.failed} Issues</span>
              </>
            ) : metrics.awaitingReview > 0 ? (
              <>
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">Review {metrics.awaitingReview} Videos</span>
              </>
            ) : metrics.ready > 0 ? (
              <>
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-700">Publish {metrics.ready} Items</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">All systems healthy</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-600">Next best action available below</p>
        </div>
      </div>
    </div>
  );
}