import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Settings, Sparkles, TrendingUp } from 'lucide-react';

const FLOW_STEPS = [
  {
    number: 1,
    title: 'Join the Growth System',
    description: 'Sign up and get onboarded in minutes. No contracts, no setup fees.',
    icon: CheckCircle,
    color: 'bg-blue-500'
  },
  {
    number: 2,
    title: 'Set Up Your Marketing Plan',
    description: 'Tell us your goals. Our AI creates a personalized content calendar.',
    icon: Settings,
    color: 'bg-purple-500'
  },
  {
    number: 3,
    title: 'Create Content With AI',
    description: 'Generate social posts, videos, and campaigns—done in minutes, not days.',
    icon: Sparkles,
    color: 'bg-pink-500'
  },
  {
    number: 4,
    title: 'Build Visibility & Leads',
    description: 'Watch your marketing presence grow. Track results. Scale what works.',
    icon: TrendingUp,
    color: 'bg-green-500'
  }
];

export default function DIYHowItWorks() {
  return (
    <section className="py-16 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Four simple steps to launch your marketing growth system and see results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* Card */}
                <Card className="bg-slate-800 border-slate-700 h-full hover:border-slate-600 transition-all">
                  <CardContent className="p-6 space-y-4">
                    {/* Step Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`${step.color} text-white p-2 rounded-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Step {step.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow connector (hide on last) */}
                {idx < FLOW_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="text-slate-600">→</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Most users complete onboarding in <span className="font-semibold text-white">under 15 minutes</span> and see their first results within <span className="font-semibold text-white">30 days</span>.
          </p>
        </div>
      </div>
    </section>
  );
}