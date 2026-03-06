import React from 'react';
import { ArrowRight } from 'lucide-react';

const PIPELINE_STAGES = [
  { label: 'Lead Intake', color: 'bg-blue-600', agents: ['Lead Qualification', 'Follow-Up'] },
  { label: 'Onboarding', color: 'bg-cyan-600', agents: ['Onboarding Setup', 'Brand Intake'] },
  { label: 'Strategy', color: 'bg-violet-600', agents: ['Authority Plan', 'Campaign Planning'] },
  { label: 'Production', color: 'bg-fuchsia-600', agents: ['Content', 'Video Script', 'Image Prompt'] },
  { label: 'Scheduling', color: 'bg-pink-600', agents: ['Scheduling', 'Publishing'] },
  { label: 'Reporting', color: 'bg-amber-600', agents: ['Reporting', 'Insight'] },
  { label: 'Growth', color: 'bg-green-600', agents: ['Offer Rec.', 'Retention', 'Billing'] },
];

export default function AgentPipelineMap() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
      <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Event-Driven Business Pipeline</h3>
      <div className="flex items-start gap-1 overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.label}>
            <div className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[90px]">
              <div className={`${stage.color} rounded-lg px-3 py-1.5 text-white text-xs font-bold text-center w-full`}>
                {stage.label}
              </div>
              <div className="flex flex-col gap-1 w-full">
                {stage.agents.map(a => (
                  <div key={a} className="bg-slate-800 border border-slate-700 rounded text-slate-300 text-[10px] px-2 py-0.5 text-center truncate">
                    {a}
                  </div>
                ))}
              </div>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className="flex-shrink-0 flex items-start pt-3">
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}