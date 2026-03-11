import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export default function MarketingPlanEmptyState() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-12 text-center">
      <div className="max-w-sm mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Marketing Plan In Motion
        </h2>

        <p className="text-slate-600 mb-4">
          Your content strategy is being prepared by our team. Over the next few days, you'll see:
        </p>

        <ul className="text-left space-y-2 mb-6 bg-white rounded-lg p-4 border border-slate-200">
          <li className="flex items-center gap-2 text-slate-700 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Content pieces awaiting your approval
          </li>
          <li className="flex items-center gap-2 text-slate-700 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Scheduled posts across your channels
          </li>
          <li className="flex items-center gap-2 text-slate-700 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Published content showing live activity
          </li>
          <li className="flex items-center gap-2 text-slate-700 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Campaign windows and promotional periods
          </li>
        </ul>

        <p className="text-slate-600 text-sm">
          Check back soon to start seeing your business's marketing momentum build. Your team is working behind the scenes to get everything ready.
        </p>
      </div>
    </div>
  );
}