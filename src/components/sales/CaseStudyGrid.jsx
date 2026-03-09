import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';

const STATIC_CASES = [
  {
    id: 'hvac-1', industry: 'HVAC', company: 'Valley Heating & Cooling',
    headline: '312% increase in organic leads in 90 days',
    summary: 'A 12-person HVAC company in Texas replaced their $3,200/month agency with NTA. Within 90 days they ranked #1 for 14 local keywords, grew their review count by 40, and tripled inbound calls.',
    results: ['314% lead increase', '#1 Google rankings', '40 new reviews', '$2,600/mo savings'],
    plan: 'Growth', industry_color: 'bg-orange-900/30 text-orange-400',
  },
  {
    id: 'rest-1', industry: 'Restaurant', company: 'Taco House Downtown',
    headline: 'Sold out Friday nights 3 weeks in a row',
    summary: 'A family-owned restaurant used NTA\'s AI social content and video marketing to build a local following. Their posts consistently reached 4,000+ people per week with zero paid ads.',
    results: ['4,200 avg weekly reach', '3x Instagram followers', 'Sold-out weekends', 'Zero ad spend'],
    plan: 'Starter', industry_color: 'bg-red-900/30 text-red-400',
  },
  {
    id: 'plumb-1', industry: 'Plumbing', company: 'Quick Fix Plumbing',
    headline: 'Went from 4 leads/month to 22 in 60 days',
    summary: 'A solo plumber with no website and no marketing presence launched on NTA, got a website built, ran local SEO, and used AI content to fill his calendar consistently.',
    results: ['450% lead growth', 'Full schedule in 60 days', 'Professional website', 'Top 3 Google Maps'],
    plan: 'Starter', industry_color: 'bg-blue-900/30 text-blue-400',
  },
  {
    id: 'cont-1', industry: 'Contractor', company: 'Apex Home Renovations',
    headline: 'Closed $180K in new projects from content alone',
    summary: 'A residential contractor used NTA\'s authority pack and video marketing to become the go-to remodeling company in their city. Sales now come in through content, not cold calls.',
    results: ['$180K pipeline from content', '8 video case studies', 'Top 5 SEO rankings', '60% less cold calling'],
    plan: 'Pro', industry_color: 'bg-yellow-900/30 text-yellow-400',
  },
];

const INDUSTRIES = ['All', 'HVAC', 'Restaurant', 'Plumbing', 'Contractor'];

export default function CaseStudyGrid({ compact = false }) {
  const [filter, setFilter] = useState('All');

  const filtered = STATIC_CASES.filter(c => filter === 'All' || c.industry === filter);

  return (
    <div>
      {!compact && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {INDUSTRIES.map(ind => (
            <button key={ind} onClick={() => setFilter(ind)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                filter === ind
                  ? 'bg-violet-700 border-violet-600 text-white'
                  : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              }`}>
              {ind}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        {filtered.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-violet-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.industry_color}`}>{c.industry}</span>
              <span className="text-xs text-slate-500">{c.plan} Plan</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2 leading-snug">{c.headline}</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{c.summary}</p>
            <div className="grid grid-cols-2 gap-2">
              {c.results.map(r => (
                <div key={r} className="flex items-center gap-1.5 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3 flex-shrink-0" /> {r}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}