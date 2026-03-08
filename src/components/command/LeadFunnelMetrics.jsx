import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowDown } from 'lucide-react';

function FunnelStep({ label, count, total, color, isLast }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const width = total > 0 ? Math.max(20, pct) : 20;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <div
          className={`${color} rounded-lg py-3 px-4 text-center transition-all`}
          style={{ width: `${width}%`, minWidth: 120 }}
        >
          <p className="text-white font-bold text-xl">{count.toLocaleString()}</p>
          <p className="text-white/80 text-xs mt-0.5">{label}</p>
        </div>
        {!isLast && (
          <div className="flex flex-col items-center my-1">
            <p className="text-xs text-slate-500 mb-0.5">{pct}% converted</p>
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadFunnelMetrics() {
  const { data: leads = [] } = useQuery({
    queryKey: ['cc-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 500)
  });
  const { data: trials = [] } = useQuery({
    queryKey: ['cc-trials'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 200)
  });

  const totalLeads = leads.length;
  const guidesDownloaded = leads.filter(l => l.guide_downloaded).length;
  const trialsStarted = leads.filter(l => l.trial_started).length + trials.length;
  const consultations = leads.filter(l => l.status === 'consultation_scheduled').length;
  const converted = leads.filter(l => l.status === 'won').length;

  const steps = [
    { label: 'Total Visitors / Leads', count: totalLeads, color: 'bg-violet-700' },
    { label: 'Guide Downloads', count: guidesDownloaded, color: 'bg-violet-600' },
    { label: 'Trials Started', count: trialsStarted, color: 'bg-indigo-600' },
    { label: 'Consultations Booked', count: consultations, color: 'bg-blue-600' },
    { label: 'Clients Converted', count: converted, color: 'bg-emerald-600' },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Lead Funnel Performance</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex flex-col items-center gap-0 w-full">
          {steps.map((step, i) => (
            <FunnelStep
              key={step.label}
              {...step}
              total={i === 0 ? totalLeads : steps[i - 1].count}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">{totalLeads > 0 ? Math.round((guidesDownloaded / totalLeads) * 100) : 0}%</p>
            <p className="text-xs text-slate-500">Lead → Guide</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{guidesDownloaded > 0 ? Math.round((trialsStarted / guidesDownloaded) * 100) : 0}%</p>
            <p className="text-xs text-slate-500">Guide → Trial</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0}%</p>
            <p className="text-xs text-slate-500">Lead → Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}