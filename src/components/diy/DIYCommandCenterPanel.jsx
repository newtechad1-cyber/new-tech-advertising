import React from 'react';
import { CheckCircle2, Target, TrendingUp, Lightbulb } from 'lucide-react';

export default function DIYCommandCenterPanel({ subscription }) {
  return (
    <section className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* Weekly Checklist */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Weekly Checklist</h3>
        </div>
        <ul className="space-y-3">
          {[
            { text: 'Post 3–5 pieces of content', done: false },
            { text: 'Write 1 authority article', done: false },
            { text: 'Create 1 video', done: false },
            { text: 'Review lead tracker', done: true },
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                item.done ? 'bg-green-500 border-green-500' : 'border-slate-600'
              }`}>
                {item.done && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span className={item.done ? 'text-slate-500 line-through' : 'text-slate-300'}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            <span className="text-green-400 font-semibold">1 of 4</span> completed this week
          </p>
        </div>
      </div>

      {/* Campaign Focus & Growth Insight */}
      <div className="space-y-6">
        {/* Campaign Focus */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Campaign Focus</h3>
          </div>
          <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-semibold mb-1">This Week's Priority</p>
            <p className="text-white font-bold mb-3">
              {subscription?.marketing_goals || 'Build SEO authority'}
            </p>
            <p className="text-slate-400 text-sm">
              Focus on creating content that helps customers find you through search.
            </p>
          </div>
        </div>

        {/* Momentum Tracker */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">This Week's Progress</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 text-sm">Content Created</span>
                <span className="text-white font-semibold">1 of 3</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '33%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 text-sm">Posts Scheduled</span>
                <span className="text-white font-semibold">0 of 5</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Growth Recommendation */}
      <div className="lg:col-span-2 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-600/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-white font-bold mb-2">Next Growth Recommendation</h3>
            <p className="text-slate-300 text-sm mb-3">
              Based on your progress, your next high-impact move is to create your first video. Videos get 10x more engagement than text and are easier to create than you think.
            </p>
            <div className="flex gap-2">
              <button className="text-violet-400 text-sm font-semibold hover:text-violet-300">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}