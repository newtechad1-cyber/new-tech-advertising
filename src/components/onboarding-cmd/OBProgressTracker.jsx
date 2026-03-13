import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STAGES = [
  { id: 'intake', label: 'Business Intake', field: 'intake_completed' },
  { id: 'website_build', label: 'Website Authority Build', field: 'website_approved' },
  { id: 'channel_connections', label: 'Channel Connections', field: 'channels_connected' },
  { id: 'content_strategy', label: 'Content Strategy Plan', field: 'content_plan_approved' },
  { id: 'ai_activation', label: 'AI Content Engine', field: 'ai_engine_active' },
  { id: 'streaming_launch', label: 'Streaming Visibility', field: 'streaming_live' },
  { id: 'roi_dashboard', label: 'ROI Dashboard Live', field: 'roi_dashboard_live' },
];

export default function OBProgressTracker({ onboarding }) {
  if (!onboarding) return null;

  const currentIdx = STAGES.findIndex(s => s.id === onboarding.stage);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4">Setup Progress</h3>
      <div className="relative">
        {/* Track line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-800" />
        <div
          className="absolute left-5 top-5 w-0.5 bg-blue-500 transition-all duration-700"
          style={{ height: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
        />

        <div className="space-y-4">
          {STAGES.map((stage, i) => {
            const done = onboarding[stage.field];
            const active = onboarding.stage === stage.id;
            return (
              <div key={stage.id} className="flex items-center gap-4 pl-0">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  done ? 'bg-green-600/20 border-green-500' : active ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-900 border-slate-700'
                }`}>
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : active ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${done ? 'text-green-400' : active ? 'text-white' : 'text-slate-500'}`}>
                    {stage.label}
                  </p>
                  {active && <p className="text-blue-400 text-xs mt-0.5">In progress</p>}
                  {done && <p className="text-green-600 text-xs mt-0.5">Complete ✓</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}