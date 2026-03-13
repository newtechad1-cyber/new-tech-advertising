import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Zap } from 'lucide-react';

const OUTCOMES = [
  {
    icon: '📱',
    title: 'Consistent Marketing Presence',
    description: 'Automated social posting keeps your brand visible daily'
  },
  {
    icon: '✍️',
    title: '20+ New Content Pieces',
    description: 'AI-powered social posts, scripts, and campaigns ready to go'
  },
  {
    icon: '⚡',
    title: 'Content Campaigns Structured',
    description: 'Your content organized and automated for maximum reach'
  },
  {
    icon: '📈',
    title: 'Visibility Momentum Started',
    description: 'Early tracking shows engagement growth and lead flow starting'
  },
  {
    icon: '📊',
    title: 'Growth Tracking Activated',
    description: 'Dashboard shows where leads come from and ROI metrics'
  },
  {
    icon: '🎯',
    title: 'First Qualified Leads Flowing',
    description: 'Initial lead generation from your new marketing presence'
  }
];

export default function DIY30DayOutcomes() {
  return (
    <section className="py-16 px-6 bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-semibold">30-DAY OUTCOME</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What You'll Have in Your First Month
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Concrete, measurable results after 30 days of using the DIY Growth System.
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OUTCOMES.map((outcome, idx) => (
            <Card
              key={idx}
              className="bg-slate-900 border-slate-700 hover:border-green-600/30 hover:bg-slate-800/50 transition-all"
            >
              <CardContent className="p-6 space-y-3">
                {/* Icon */}
                <div className="text-3xl">{outcome.icon}</div>

                {/* Title */}
                <h3 className="font-semibold text-white text-sm leading-tight">
                  {outcome.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {outcome.description}
                </p>

                {/* Checkmark */}
                <div className="pt-2 flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">Achievable in 30 days</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-10 bg-blue-900/10 border border-blue-800/30 rounded-lg p-6 text-center">
          <Zap className="w-5 h-5 text-blue-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-2">
            These aren't promises—they're outcomes we see consistently.
          </p>
          <p className="text-slate-400 text-sm">
            Your timeline depends on your engagement, but most users see momentum starting in weeks 1-2.
          </p>
        </div>
      </div>
    </section>
  );
}