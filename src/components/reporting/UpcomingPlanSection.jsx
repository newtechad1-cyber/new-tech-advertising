import React from 'react';
import { Calendar, Zap } from 'lucide-react';

export default function UpcomingPlanSection({ report }) {
  const upcomingPlan = report.upcoming_plan_json
    ? JSON.parse(report.upcoming_plan_json)
    : {
        nextCampaigns: [
          'Spring product launch campaign',
          'Seasonal promotion series',
          'Customer testimonial videos',
        ],
        strategy: 'Increased publishing frequency and expanded content distribution',
      };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        Upcoming Strategy
      </h3>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
        <p className="text-sm text-blue-100 mb-4">{upcomingPlan.strategy || 'Strategic direction for next period'}</p>

        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          Planned Initiatives
        </h4>

        <ul className="space-y-2">
          {(upcomingPlan.nextCampaigns || []).map((campaign, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-blue-100">
              <span className="text-blue-400 font-bold mt-0.5">→</span>
              {campaign}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}