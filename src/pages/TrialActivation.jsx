import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

export default function TrialActivation() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-slate-800 w-full">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Step Indicator */}
          <div className="mb-12">
            <p className="text-slate-400 text-sm font-semibold tracking-wide mb-3">STEP 4 OF 4</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= 4 ? 'bg-violet-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Marketing System Is Building 🚀
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Behind the scenes, we're setting up your channels, preparing your first content, and getting everything ready to launch.
            </p>
          </div>

          {/* Status Checklist */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-10 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Business profile created</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Channels configured</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-violet-400 flex-shrink-0 animate-pulse" />
              <div>
                <p className="text-white font-semibold text-sm">Content generation starting...</p>
              </div>
            </div>
          </div>

          {/* What's Happening */}
          <div className="space-y-5 mb-12">
            {/* Timeline Preview */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">📅 Your First Week</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="text-2xl">📱</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Tomorrow 10 AM</p>
                    <p className="text-slate-400 text-xs mt-1">First social post goes live</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Friday</p>
                    <p className="text-slate-400 text-xs mt-1">Welcome email to your audience</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">🎬</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Next Monday</p>
                    <p className="text-slate-400 text-xs mt-1">Video content series begins</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Results */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">📊 Expected Results</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-violet-300">2,500+</p>
                  <p className="text-slate-400 text-xs mt-2">Estimated Monthly Reach</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-300">8-12</p>
                  <p className="text-slate-400 text-xs mt-2">Qualified Leads/Month</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-300">15%+</p>
                  <p className="text-slate-400 text-xs mt-2">Engagement Rate</p>
                </div>
              </div>
            </div>

            {/* What You Can Do Now */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="font-semibold text-white">What happens next:</span> We'll continue setting up your content in the background. You can start exploring your dashboard now, or check back in a few hours when your first posts are ready to review.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link
              to={createPageUrl('ClientDashboard')}
              className="block w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-center transition-all text-lg flex items-center justify-center gap-2 group"
            >
              ⭐ Go to Your Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              className="w-full text-slate-400 hover:text-slate-200 font-semibold transition-colors py-3"
              onClick={() => alert("We'll email you when your first posts are ready!")}
            >
              Email me when content is ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}