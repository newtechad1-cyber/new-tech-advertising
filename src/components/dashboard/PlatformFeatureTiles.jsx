import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Share2, Video, Search, Star, Calendar, BarChart2, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Share2,
    label: 'Social Media Automation',
    description: 'AI-written posts scheduled across all your channels',
    link: 'ScheduledQueue',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
  },
  {
    icon: Video,
    label: 'AI Video Creation',
    description: 'Create professional marketing videos in minutes',
    link: 'AiVideos',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
  {
    icon: Search,
    label: 'SEO & Blog Generator',
    description: 'Rank higher with AI-generated SEO content',
    link: 'AiSeo',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    icon: Star,
    label: 'Review Management',
    description: 'Monitor and grow your online reputation',
    link: 'GrowthSystem',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    icon: Calendar,
    label: 'Content Calendar',
    description: 'Plan and visualize your entire content strategy',
    link: 'ContentQueue',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    icon: BarChart2,
    label: 'Analytics Dashboard',
    description: 'Track leads, engagement, and growth metrics',
    link: 'Dashboard',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
  },
];

export default function PlatformFeatureTiles({ dark = false }) {
  const cardClass = dark
    ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 rounded-xl p-4 flex items-center gap-4 transition-all group'
    : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl p-4 flex items-center gap-4 transition-all group shadow-sm';

  const labelClass = dark ? 'text-white font-semibold text-sm' : 'text-slate-800 font-semibold text-sm';
  const descClass = dark ? 'text-slate-400 text-xs mt-0.5' : 'text-slate-500 text-xs mt-0.5';
  const arrowClass = dark ? 'text-slate-600 group-hover:text-slate-300' : 'text-slate-300 group-hover:text-slate-500';
  const headingClass = dark ? 'text-lg font-bold text-white mb-4' : 'text-lg font-bold text-slate-800 mb-4';

  return (
    <div>
      <h3 className={headingClass}>Your Marketing Tools</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.label} to={createPageUrl(f.link)} className={cardClass}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.bgColor}`}>
                <Icon className={`w-5 h-5 ${f.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={labelClass}>{f.label}</p>
                <p className={descClass}>{f.description}</p>
              </div>
              <ArrowRight className={`w-4 h-4 shrink-0 transition-colors ${arrowClass}`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}