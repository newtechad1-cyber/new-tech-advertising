import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';

export default function WhatThisMeansBlock({ report }) {
  const generateInsight = () => {
    const content = report.content_published_count || 0;
    const campaigns = report.campaigns_active || 0;
    const scheduled = report.scheduled_content_count || 0;

    let insight = '';

    if (content > 10 && campaigns > 2) {
      insight = 'Your consistent publishing and multi-channel strategy is building trust and expanding your reach. This frequency establishes your brand as an active, engaged player in your market.';
    } else if (content > 5 && campaigns > 1) {
      insight = 'Your regular content distribution across multiple channels is creating multiple customer touchpoints. This approach strengthens brand recall and customer engagement.';
    } else if (content > 0) {
      insight = 'Your marketing activity is establishing baseline brand visibility. Continuing to build consistency will strengthen customer awareness and engagement opportunities.';
    } else {
      insight = 'Begin establishing a consistent publishing schedule to build brand visibility and customer engagement. A regular cadence creates reliable touchpoints with your audience.';
    }

    if (scheduled > 5) {
      insight += ' With significant content already scheduled, your pipeline is set for sustained visibility.';
    }

    return insight;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-cyan-400" />
        What This Means For Your Business
      </h3>

      <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-6">
        <p className="text-base text-cyan-100 leading-relaxed mb-4">
          {generateInsight()}
        </p>

        <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-cyan-800">
          <TrendingUp className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white mb-1">Bottom Line</p>
            <p className="text-sm text-slate-300">
              Marketing success requires consistency. Your effort in publishing and campaign management directly impacts customer awareness and business growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}