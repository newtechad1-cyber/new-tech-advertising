import React from 'react';
import { FileText, Video, Tv, Share2, Calendar } from 'lucide-react';

const INDUSTRY_TOPICS = {
  hvac: {
    blogs: ['5 Signs Your HVAC Needs Immediate Service', 'AC Maintenance Checklist for Homeowners', 'How to Choose the Right HVAC System', 'Why Regular Filter Changes Save You Money', 'Energy Efficiency Guide for HVAC Systems', 'Emergency HVAC: What to Do When It Breaks', 'Seasonal Tune-Up: Why It Matters', 'Top HVAC Brands Compared'],
    social: ['Before & After: AC Replacement', 'Team Spotlight: Meet Your Technician', 'Quick Tip Tuesday: DIY Filter Change', 'Customer 5-Star Review Highlight', 'Seasonal Reminder: Pre-Summer Checkup'],
    videos: ['Why Regular HVAC Maintenance Matters', 'Before & After: Full System Replacement', 'Customer Testimonial: 5 Years Running', 'Emergency Service: We\'re Here 24/7'],
  },
  plumbing: {
    blogs: ['Signs You Have a Hidden Leak', 'Drain Cleaning vs. Chemical Cleaners', 'Water Heater Lifespan Guide', 'How to Prevent Frozen Pipes This Winter', 'Top Plumbing Emergencies & What to Do', 'Pipe Repiping: Is It Time?', 'Water Pressure Problems Explained', 'DIY vs Professional Plumbing: Know the Limit'],
    social: ['Pipe Repair Before & After', 'Meet the Team', 'Pro Tip: Prevent Drain Clogs', '5-Star Review Feature', 'Monthly Special Offer'],
    videos: ['How to Spot a Hidden Water Leak', 'Drain Cleaning Done Right', 'Water Heater Installation Walk-Through', 'Customer Story: Emergency Repair'],
  },
  default: {
    blogs: ['Why Local Authority Matters', 'How to Stand Out in a Crowded Market', 'The Content Advantage: More Leads for Less', 'Client Success Story', 'Before NTA vs After NTA', '5 Ways to Get More Google Reviews', 'Video Marketing for Local Businesses', 'The Streaming TV Authority Play'],
    social: ['Business Spotlight', 'Client Win of the Week', 'Pro Tip Tuesday', 'Behind the Scenes', 'Special Offer Announcement'],
    videos: ['Brand Authority Introduction', 'Service Showcase', 'Customer Testimonial', 'Seasonal Promo'],
  },
};

const WEEK_SCHEDULE = [
  { week: 'Week 1', items: [{ type: 'Blog', count: 2 }, { type: 'Social', count: 5 }, { type: 'Email', count: 1 }] },
  { week: 'Week 2', items: [{ type: 'Blog', count: 2 }, { type: 'Social', count: 5 }, { type: 'Video', count: 1 }] },
  { week: 'Week 3', items: [{ type: 'Blog', count: 2 }, { type: 'Social', count: 5 }, { type: 'Review Push', count: 1 }] },
  { week: 'Week 4', items: [{ type: 'Blog', count: 2 }, { type: 'Social', count: 5 }, { type: 'Streaming TV', count: 1 }] },
];

const TYPE_COLORS = { Blog: '#3b82f6', Social: '#8b5cf6', Video: '#f59e0b', Email: '#10b981', 'Review Push': '#06b6d4', 'Streaming TV': '#ec4899' };

export default function OBContentPlan({ industry }) {
  const topics = INDUSTRY_TOPICS[industry] || INDUSTRY_TOPICS.default;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" /> 30-Day Visibility Launch Plan
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">Your first month content roadmap</p>
      </div>

      {/* Weekly schedule */}
      <div className="p-4 grid grid-cols-4 gap-3 border-b border-slate-800">
        {WEEK_SCHEDULE.map((week) => (
          <div key={week.week} className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-white text-xs font-bold mb-2">{week.week}</p>
            {week.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: TYPE_COLORS[item.type] || '#94a3b8' }}>{item.type}</span>
                <span className="text-xs text-slate-500 font-bold">×{item.count}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Content topics */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-2"><FileText className="w-3 h-3 text-blue-400" /> Blog Articles</p>
          {topics.blogs.slice(0, 4).map((t, i) => (
            <p key={i} className="text-slate-300 text-xs mb-1.5 leading-relaxed">• {t}</p>
          ))}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-2"><Share2 className="w-3 h-3 text-purple-400" /> Social Posts</p>
          {topics.social.map((t, i) => (
            <p key={i} className="text-slate-300 text-xs mb-1.5 leading-relaxed">• {t}</p>
          ))}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-2"><Video className="w-3 h-3 text-yellow-400" /> Video Topics</p>
          {topics.videos.map((t, i) => (
            <p key={i} className="text-slate-300 text-xs mb-1.5 leading-relaxed">• {t}</p>
          ))}
          <div className="mt-3 p-2 bg-pink-950/20 border border-pink-800/30 rounded-lg">
            <p className="text-pink-400 text-xs font-bold flex items-center gap-1"><Tv className="w-3 h-3" /> Streaming TV</p>
            <p className="text-slate-400 text-xs mt-1">30-sec commercial — Week 4 launch</p>
          </div>
        </div>
      </div>
    </div>
  );
}