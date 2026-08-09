import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { BrainCircuit, MapPin, Building2, Zap, TrendingUp, Calendar, BarChart2 } from 'lucide-react';

const MODULES = [
  { label: 'Industry Intel', icon: BrainCircuit, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-800/30', desc: 'Manage seeded industry intelligence records', page: 'IndustryIntelAdmin' },
  { label: 'Local Market Intel', icon: MapPin, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-800/30', desc: 'City/state/industry market intelligence', page: 'LocalMarketIntelAdmin' },
  { label: 'Business Profiles', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-800/30', desc: 'Manage business onboarding profiles', page: 'BusinessProfileAdmin' },
  { label: 'Intel Profiles', icon: BrainCircuit, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-800/30', desc: 'View generated marketing intelligence output', page: 'BusinessIntelProfileAdmin' },
  { label: 'Opportunity Signals', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-800/30', desc: 'Ranked opportunity and gap detection', page: 'OpportunitySignalAdmin' },
  { label: 'Weekly Plans', icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-800/30', desc: 'Generated weekly marketing execution plans', page: 'WeeklyPlanAdmin' },
  { label: 'Performance Signals', icon: BarChart2, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-800/30', desc: 'Track measured performance outcomes', page: 'PerformanceSignalAdmin' },
];

export default function IntelAdmin() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">Local Marketing Profile Engine</p>
          <h1 className="text-3xl font-extrabold text-white mb-2">Intelligence Admin</h1>
          <p className="text-slate-400 text-sm">Manage the structured intelligence system that powers marketing profiles, opportunity signals, and weekly plans.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map(m => {
            const Icon = m.icon;
            return (
              <Link key={m.label} to={createPageUrl(m.page)} className={`bg-slate-900 border ${m.border} rounded-2xl p-6 hover:bg-slate-800 transition-all group`}>
                <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-violet-300 transition-colors">{m.label}</h3>
                <p className="text-slate-500 text-xs">{m.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}