import React from 'react';
import { Play } from 'lucide-react';

export default function PlatformPreview() {
  return (
    <div className="bg-slate-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">How the Platform Works</h2>
        <p className="text-slate-600 mb-12 text-lg">
          Quick walkthrough of the system that runs your marketing.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Platform Highlights */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-3">Client Dashboard</h3>
            <p className="text-slate-600 mb-4">
              See your entire marketing system status at a glance. Content scheduled, visibility trending, engagement happening.
            </p>
            <div className="bg-slate-100 h-32 rounded flex items-center justify-center text-slate-400">
              [Dashboard Preview]
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-3">Content Pipeline</h3>
            <p className="text-slate-600 mb-4">
              Track every piece of content from creation through publishing. Know what's approved, scheduled, and performing.
            </p>
            <div className="bg-slate-100 h-32 rounded flex items-center justify-center text-slate-400">
              [Pipeline Preview]
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-3">Channel Management</h3>
            <p className="text-slate-600 mb-4">
              Connect all your social channels and websites. Everything synced, no manual re-posting, complete control.
            </p>
            <div className="bg-slate-100 h-32 rounded flex items-center justify-center text-slate-400">
              [Channels Preview]
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-3">ROI Results</h3>
            <p className="text-slate-600 mb-4">
              Real business results, not vanity metrics. Visibility, engagement, and customer actions that matter.
            </p>
            <div className="bg-slate-100 h-32 rounded flex items-center justify-center text-slate-400">
              [Results Preview]
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
            <Play className="w-4 h-4" />
            Watch Full Demo (4 min)
          </button>
        </div>
      </div>
    </div>
  );
}