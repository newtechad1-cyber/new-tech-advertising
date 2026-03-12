import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, TrendingUp, Video, Target, Flame } from 'lucide-react';

const MILESTONE_CONFIG = {
  visibility_gain: { icon: '📊', label: 'Visibility', color: 'text-blue-600', bg: 'bg-blue-50', count: 0 },
  engagement_jump: { icon: '💬', label: 'Engagement', color: 'text-emerald-600', bg: 'bg-emerald-50', count: 0 },
  campaign_launch: { icon: '🎯', label: 'Campaign', color: 'text-purple-600', bg: 'bg-purple-50', count: 0 },
  video_success: { icon: '🎬', label: 'Video', color: 'text-rose-600', bg: 'bg-rose-50', count: 0 },
  content_consistency: { icon: '📝', label: 'Content', color: 'text-amber-600', bg: 'bg-amber-50', count: 0 },
  lead_signal_increase: { icon: '⚡', label: 'Leads', color: 'text-cyan-600', bg: 'bg-cyan-50', count: 0 },
  expansion_ready: { icon: '🚀', label: 'Expansion', color: 'text-indigo-600', bg: 'bg-indigo-50', count: 0 },
};

function impactColor(score) {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 50) return 'text-blue-600';
  return 'text-slate-500';
}

function impactBg(score) {
  if (score >= 75) return 'bg-emerald-100';
  if (score >= 50) return 'bg-blue-100';
  return 'bg-slate-100';
}

export default function ClientROITimeline() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ROIGrowthMilestone.list('-milestone_date', 100).then(m => {
      setMilestones(m.sort((a, b) => new Date(a.milestone_date) - new Date(b.milestone_date)));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading your growth story…</div>
      </div>
    );
  }

  // Count milestone types
  const typeDistribution = Object.keys(MILESTONE_CONFIG).map(type => ({
    name: MILESTONE_CONFIG[type].label,
    count: milestones.filter(m => m.milestone_type === type).length,
    color: MILESTONE_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Determine momentum phase
  const recentMilestones = milestones.slice(-3);
  const avgRecentImpact = recentMilestones.length > 0
    ? Math.round(recentMilestones.reduce((sum, m) => sum + (m.milestone_impact_score || 0), 0) / recentMilestones.length)
    : 0;

  let momentumPhase = 'early_progress';
  if (avgRecentImpact >= 75) momentumPhase = 'acceleration_phase';
  else if (avgRecentImpact >= 60) momentumPhase = 'strong_momentum';
  else if (avgRecentImpact >= 45) momentumPhase = 'steady_growth';

  const MOMENTUM_CONFIG = {
    early_progress: { label: 'Early Progress', emoji: '📈', color: 'text-blue-600' },
    steady_growth: { label: 'Steady Growth', emoji: '📊', color: 'text-emerald-600' },
    strong_momentum: { label: 'Strong Momentum', emoji: '🔥', color: 'text-amber-600' },
    acceleration_phase: { label: 'Acceleration Phase', emoji: '🚀', color: 'text-rose-600' },
  };

  const momentum = MOMENTUM_CONFIG[momentumPhase];

  // Top milestones by impact
  const topMilestones = [...milestones].sort((a, b) => (b.milestone_impact_score || 0) - (a.milestone_impact_score || 0)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Growth Story</h1>
          <p className="text-slate-600 text-sm mt-1">Marketing progress and milestones over time</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-8">

        {/* SECTION 1 — Growth Journey Hero */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-100 p-6 sm:p-8 text-center">
          <span className="text-4xl block mb-2">{momentum.emoji}</span>
          <h2 className={`text-2xl sm:text-3xl font-black ${momentum.color} mb-2`}>
            {momentum.label}
          </h2>
          <p className="text-slate-700">
            You've reached <span className="font-black text-slate-900">{milestones.length} milestones</span> in your marketing journey.
          </p>
          <p className="text-sm text-slate-600 mt-3">
            Your consistent effort has built steady momentum. Keep up the great work!
          </p>
        </div>

        {/* SECTION 2 — Vertical Timeline */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wider">Your Progress Timeline</h3>
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-blue-400 to-emerald-400" />

            {milestones.map((milestone, idx) => (
              <div key={milestone.id} className="relative pl-16 sm:pl-20">
                {/* Timeline dot */}
                <div className={`absolute left-0 sm:left-1 top-2 w-8 h-8 rounded-full border-4 border-white ${impactBg(milestone.milestone_impact_score || 0)} flex items-center justify-center text-sm`}>
                  <span>{MILESTONE_CONFIG[milestone.milestone_type]?.icon}</span>
                </div>

                {/* Milestone card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {new Date(milestone.milestone_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                        {milestone.milestone_title}
                      </h4>
                    </div>
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${impactBg(milestone.milestone_impact_score || 0)} ${impactColor(milestone.milestone_impact_score || 0)}`}>
                      {MILESTONE_CONFIG[milestone.milestone_type]?.label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    {milestone.milestone_summary}
                  </p>

                  {/* Impact indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (milestone.milestone_impact_score || 0) >= 75
                            ? 'bg-emerald-600'
                            : (milestone.milestone_impact_score || 0) >= 50
                            ? 'bg-blue-600'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${milestone.milestone_impact_score || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{milestone.milestone_impact_score || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 — Milestone Type Distribution */}
        {typeDistribution.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Progress Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeDistribution} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [val, 'Milestones']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 4 — Momentum Progress Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Your Journey</h3>
          <div className="flex items-center justify-between gap-2">
            {['early_progress', 'steady_growth', 'strong_momentum', 'acceleration_phase'].map(phase => {
              const isActive = phase === momentumPhase;
              const phaseLabel = MOMENTUM_CONFIG[phase];
              return (
                <div key={phase} className="flex-1 text-center">
                  <div className={`rounded-full w-full aspect-square flex items-center justify-center text-lg mb-2 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {phaseLabel.emoji}
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                    {phaseLabel.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Best Progress Moments */}
        {topMilestones.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Best Progress Moments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topMilestones.map((milestone, idx) => (
                <div key={milestone.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-2">{MILESTONE_CONFIG[milestone.milestone_type]?.icon}</div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {new Date(milestone.milestone_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </p>
                  <h4 className="text-sm font-black text-slate-900 mb-2">{milestone.milestone_title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This milestone showed strong progress in your marketing efforts and helped accelerate your growth trajectory.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600">High Impact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closing message */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6 text-center">
          <p className="text-sm text-slate-700">
            <span className="font-black text-slate-900">You've made real progress.</span> Your consistent marketing efforts are building momentum and creating value for your business.
          </p>
          <p className="text-xs text-slate-600 mt-3">Keep moving forward! 🎯</p>
        </div>

      </div>
    </div>
  );
}