import React from 'react';
import { Clock, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TODAY_TASKS = [
  {
    id: 1,
    title: 'Write First Authority Article',
    description: 'Build SEO authority with your first 1,500-word article',
    time: '45 mins',
    impact: 'High SEO Impact',
    module: 'website',
  },
  {
    id: 2,
    title: 'Create Social Media Posts for This Week',
    description: 'Schedule 5-7 posts across LinkedIn, Instagram, and Facebook',
    time: '30 mins',
    impact: 'Consistency Boost',
    module: 'social',
  },
  {
    id: 3,
    title: 'Set Up Lead Tracker',
    description: 'Track which marketing efforts drive real leads',
    time: '20 mins',
    impact: 'Essential Setup',
    module: 'leads',
  },
  {
    id: 4,
    title: 'Generate Your First Video Script',
    description: 'AI creates a script for your first promotional video',
    time: '15 mins',
    impact: 'Content Creation',
    module: 'video',
  },
];

export default function DIYTodaysPriorities({ onTaskClick }) {
  return (
    <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">📋 Today's Priorities</h2>
        <p className="text-slate-400">Focus on these 4 high-impact tasks to build momentum</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {TODAY_TASKS.map((task) => (
          <div
            key={task.id}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-violet-600/50 rounded-lg p-5 transition-all hover:shadow-lg hover:shadow-violet-600/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{task.title}</h3>
                <p className="text-slate-400 text-sm">{task.description}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-slate-600 flex-shrink-0 ml-3" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Clock className="w-4 h-4" />
                {task.time}
              </div>
              <span className="px-2 py-1 bg-violet-600/20 text-violet-300 text-xs font-semibold rounded">
                {task.impact}
              </span>
            </div>

            <Button
              onClick={() => onTaskClick(task.module)}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 text-sm font-semibold rounded flex items-center justify-center gap-2"
            >
              Start Task
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}