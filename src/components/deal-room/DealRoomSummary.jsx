import React from 'react';
import { CheckCircle, TrendingUp, Target } from 'lucide-react';

export default function DealRoomSummary({ opportunity }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700 p-8">
      <h2 className="text-2xl font-bold text-white mb-2">Your Personalized Growth Plan</h2>
      <p className="text-slate-400 mb-6">Based on {opportunity.company_name}'s business profile</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Goal */}
        <div className="flex gap-4">
          <Target className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">Your Goal</h3>
            <p className="text-sm text-slate-300">{opportunity.growth_goal || 'Accelerate growth'}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex gap-4">
          <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">Timeline</h3>
            <p className="text-sm text-slate-300">
              {opportunity.decision_timeline.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Investment */}
        <div className="flex gap-4">
          <TrendingUp className="w-8 h-8 text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">Expected Investment</h3>
            <p className="text-sm text-slate-300">
              ${opportunity.estimated_deal_value.toLocaleString()}/year
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}