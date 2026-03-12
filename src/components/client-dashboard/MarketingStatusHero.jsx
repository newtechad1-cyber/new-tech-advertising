import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MarketingStatusHero({ clientProfile }) {
  const navigate = useNavigate();
  
  const nextPostDate = clientProfile?.last_successful_sync 
    ? new Date(clientProfile.last_successful_sync).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Soon';

  const contentInProduction = clientProfile?.reconnect_required ? 0 : 2;
  const visibilityTrend = clientProfile?.permission_level_summary ? '+12%' : 'Tracking';

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-slate-300 text-sm font-medium uppercase tracking-wide mb-2">Status</p>
          <h1 className="text-4xl font-bold mb-6">Your Marketing System Is Active</h1>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-slate-400 text-sm mb-2">Next Post</p>
              <p className="text-2xl font-semibold text-white">{nextPostDate}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">In Production</p>
              <p className="text-2xl font-semibold text-white">{contentInProduction} pieces</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Visibility Trend</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <p className="text-2xl font-semibold text-white">{visibilityTrend}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-green-400/20 text-green-300 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/client/calendar')}
        className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
      >
        View Content Plan
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}