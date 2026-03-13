import React from 'react';
import { CheckCircle2, Clock, Zap, Building2 } from 'lucide-react';

const STAGE_LABELS = {
  intake: 'Business Intake', website_build: 'Website Build', channel_connections: 'Channel Setup',
  content_strategy: 'Content Strategy', ai_activation: 'AI Activation', streaming_launch: 'Streaming Launch', live: 'Live 🚀',
};

const readinessConfig = (score) => {
  if (score >= 90) return { label: 'Launch Ready', color: '#10b981', bg: 'bg-green-600' };
  if (score >= 60) return { label: 'On Track', color: '#f59e0b', bg: 'bg-amber-600' };
  return { label: 'Setup In Progress', color: '#3b82f6', bg: 'bg-blue-600' };
};

export default function OBHeader({ onboarding, isAdmin }) {
  if (!onboarding) return null;
  const rc = readinessConfig(onboarding.readiness_score || 0);

  return (
    <div className="bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950 border-b border-slate-800 px-6 py-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-white text-2xl font-black">
                {isAdmin ? `${onboarding.company_name} — Onboarding` : `Welcome, ${onboarding.company_name.split(' ')[0]} Team! 👋`}
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ color: rc.color, background: `${rc.color}20` }}>
                {rc.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm flex-wrap">
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-purple-400" />{onboarding.package_tier?.replace('_', ' ')} package</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-500" />Stage: {STAGE_LABELS[onboarding.stage]}</span>
              {onboarding.target_launch_date && (
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" />Target launch: {onboarding.target_launch_date}</span>
              )}
            </div>
          </div>
        </div>

        {/* Readiness score */}
        <div className="text-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={rc.color} strokeWidth="8"
                strokeDasharray={`${(onboarding.readiness_score || 0) / 100 * 201} 201`}
                strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg font-black">{onboarding.readiness_score || 0}%</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-1">Readiness</p>
        </div>
      </div>
    </div>
  );
}