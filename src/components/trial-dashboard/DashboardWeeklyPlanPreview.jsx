import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, ArrowRight, Zap } from 'lucide-react';

export default function DashboardWeeklyPlanPreview({ weeklyPlan, readinessState }) {
  if (!weeklyPlan) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
        <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-300 font-medium mb-1">Weekly Marketing Plan Coming Soon</p>
        <p className="text-slate-500 text-sm">
          We're preparing your first plan based on your business and goals.
        </p>
      </div>
    );
  }

  const taskCount = [
    weeklyPlan.content_tasks?.length || 0,
    weeklyPlan.video_tasks?.length || 0,
    weeklyPlan.social_tasks?.length || 0,
    weeklyPlan.campaign_tasks?.length || 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            This Week's Marketing Plan
          </h3>
          <p className="text-sm text-slate-500">
            Week of {weeklyPlan.week_start_date}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        {weeklyPlan.primary_theme && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-xs font-bold uppercase text-violet-400 mb-1">This Week's Theme</p>
            <p className="text-white font-semibold">{weeklyPlan.primary_theme}</p>
          </div>
        )}

        {/* Offer */}
        {weeklyPlan.primary_offer && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-xs font-bold uppercase text-emerald-400 mb-1">Primary Offer</p>
            <p className="text-white font-semibold">{weeklyPlan.primary_offer}</p>
          </div>
        )}

        {/* Task counts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Content', count: weeklyPlan.content_tasks?.length || 0 },
            { label: 'Videos', count: weeklyPlan.video_tasks?.length || 0 },
            { label: 'Social', count: weeklyPlan.social_tasks?.length || 0 },
            { label: 'Campaigns', count: weeklyPlan.campaign_tasks?.length || 0 },
          ].map(item => (
            <div key={item.label} className="bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-violet-400">{item.count}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        to={createPageUrl('GrowthSystem')}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
      >
        View Full Plan <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}