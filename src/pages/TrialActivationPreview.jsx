import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader } from 'lucide-react';

export default function TrialActivationPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-violet-500 transition-all" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Your Marketing System Is Building</h1>
          <p className="text-slate-400 text-sm">Here's what's happening behind the scenes.</p>
        </div>

        {/* Status */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-slate-300 text-sm">Business profile created</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-slate-300 text-sm">Channels connected</span>
          </div>
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 text-violet-400 flex-shrink-0 animate-spin" />
            <span className="text-slate-300 text-sm">Content generation starting...</span>
          </div>
        </div>

        {/* Content Preview */}
        <div className="space-y-6 mb-8">
          {/* First Post Preview */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">📱 Preview: Your First Post</h3>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <p className="text-white font-bold">Your Business</p>
                  <p className="text-slate-200 text-sm mt-1">Is Now Live Online</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your professional marketing system is now active. Your team can manage posts, track performance, and respond to leads—all from one dashboard.
                </p>
                <p className="text-slate-500 text-xs mt-3">Scheduled for tomorrow at 10:00 AM</p>
              </div>
            </div>
          </div>

          {/* Campaign Timeline */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">📅 Your Campaign Timeline</h3>
            <div className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">Week 1: Social Launch</p>
                    <p className="text-slate-500 text-xs mt-1">First posts go live across all channels</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">Week 2: Email Campaign</p>
                    <p className="text-slate-500 text-xs mt-1">Personalized emails sent to your audience</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">Week 3: Content Series</p>
                    <p className="text-slate-500 text-xs mt-1">Educational series builds authority</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Expectation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">📊 Expected Results</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-violet-400">2,500+</p>
                <p className="text-slate-400 text-xs mt-2">Est. Monthly Reach</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-violet-400">15%</p>
                <p className="text-slate-400 text-xs mt-2">Target Engagement</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-violet-400">8-12</p>
                <p className="text-slate-400 text-xs mt-2">Qualified Leads/Mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-10">
          <Link
            to={createPageUrl('ClientDashboard')}
            className="block w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl text-center transition-all flex items-center justify-center gap-2"
          >
            Go to Your Marketing Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Link
            to={createPageUrl('TrialConnectChannels')}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>
    </div>
  );
}