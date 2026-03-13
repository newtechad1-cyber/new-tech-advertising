import React from 'react';
import { TrendingDown, Clock, AlertCircle, FileX, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function SignalRow({ icon: Icon, color, label, count, items, linkTo, emptyText }) {
  return (
    <div className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{label}</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${count > 0 ? 'text-white' : 'bg-slate-100 text-slate-400'}`}
            style={count > 0 ? { background: color } : {}}>{count}</span>
        </div>
        {linkTo && count > 0 && (
          <Link to={linkTo} className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5">
            Review <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {count === 0 ? (
        <p className="text-xs text-slate-400 italic pl-6">{emptyText}</p>
      ) : (
        <div className="space-y-1 pl-6">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-700 font-semibold truncate">{item.company_name}</p>
              {item.detail && <span className="text-xs text-slate-400 flex-shrink-0">{item.detail}</span>}
            </div>
          ))}
          {items.length > 3 && <p className="text-xs text-slate-400">+{items.length - 3} more</p>}
        </div>
      )}
    </div>
  );
}

export default function OCPMomentumPanel({ growthStages, onboardings }) {
  const decliningEngagement = growthStages
    .filter(g => g.retention_risk_level === 'at_risk' || g.retention_risk_level === 'critical')
    .map(g => ({ company_name: g.company_name, detail: g.retention_risk_level }));

  const roiStagnation = growthStages
    .filter(g => g.roi_trend === 'stagnating' || g.roi_trend === 'declining')
    .map(g => ({ company_name: g.company_name, detail: g.roi_trend }));

  const onboardingBottlenecks = onboardings
    .filter(o => o.stage !== 'live' && o.readiness_score < 50)
    .map(o => ({ company_name: o.company_name, detail: o.stage?.replace(/_/g, ' ') }));

  const approvalDelays = growthStages
    .filter(g => g.approval_avg_days > 7)
    .map(g => ({ company_name: g.company_name, detail: `${g.approval_avg_days}d avg` }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-black text-slate-900 text-sm">Client Momentum Signals</h2>
          <p className="text-slate-400 text-xs mt-0.5">Engagement, ROI, and delivery health</p>
        </div>
        <Link to="/admin/retention-dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
          All clients <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-5">
        <SignalRow icon={TrendingDown} color="#ef4444" label="Declining Engagement"   count={decliningEngagement.length}  items={decliningEngagement}  linkTo="/admin/retention-dashboard" emptyText="All clients engaged" />
        <SignalRow icon={AlertCircle}  color="#f97316" label="ROI Stagnation Alerts"  count={roiStagnation.length}        items={roiStagnation}        linkTo="/admin/retention-dashboard" emptyText="All ROI trends healthy" />
        <SignalRow icon={Clock}        color="#8b5cf6" label="Onboarding Bottlenecks" count={onboardingBottlenecks.length} items={onboardingBottlenecks} linkTo="/nta/onboarding"           emptyText="All onboardings on track" />
        <SignalRow icon={FileX}        color="#f59e0b" label="Content Approval Delays" count={approvalDelays.length}      items={approvalDelays}       linkTo="/admin/retention-dashboard" emptyText="Content approvals current" />
      </div>
    </div>
  );
}