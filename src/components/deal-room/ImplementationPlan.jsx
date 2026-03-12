import React from 'react';
import { Calendar, CheckCircle, Zap } from 'lucide-react';

export default function ImplementationPlan() {
  const phases = [
    {
      title: 'Week 1-2: Foundation',
      items: [
        'Complete onboarding call',
        'Connect all channels',
        'Set up brand profile',
        'Plan content calendar'
      ]
    },
    {
      title: 'Week 3-4: Launch',
      items: [
        'First content batch published',
        'Social channels live',
        'Reporting dashboard active',
        'Momentum building starts'
      ]
    },
    {
      title: 'Month 2: Growth',
      items: [
        'Engagement accelerates',
        'Visibility increases measurably',
        'Customer inquiries rise',
        'Optimization adjustments'
      ]
    },
    {
      title: 'Month 3+: Expansion',
      items: [
        'Success proven & validated',
        'Scale content or channels',
        'Video authority plan',
        'Additional services discussed'
      ]
    }
  ];

  return (
    <div className="bg-slate-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-3 mb-12">
          <Calendar className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Implementation Timeline</h2>
            <p className="text-slate-600 mt-2">
              Clear, predictable roadmap from start to results.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {phases.map((phase, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <h3 className="font-semibold text-slate-900 mb-4">{phase.title}</h3>
              <ul className="space-y-3">
                {phase.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Timeline Arrow Visual */}
        <div className="mt-8 bg-blue-100 rounded-lg p-4">
          <p className="text-center text-blue-900 font-semibold">
            ← You'll see results starting Week 3, with momentum building each month →
          </p>
        </div>
      </div>
    </div>
  );
}