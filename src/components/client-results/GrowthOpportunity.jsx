import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function GrowthOpportunity() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-8 mb-12">
      <div className="flex items-start gap-4 mb-6">
        <Zap className="w-6 h-6 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Ready to Accelerate Growth?</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            You are ready to increase visibility further. Your content strategy is working—now it's time to expand reach and capture even more customer interest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pt-6 border-t border-slate-700">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-1">Recommended Next Step</p>
          <p className="font-semibold">Increase Posting Frequency</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-1">Also Available</p>
          <p className="font-semibold">Add Video Plan</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-1">Expand Reach To</p>
          <p className="font-semibold">Additional Channels</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
          Book Growth Strategy <ArrowRight className="w-4 h-4" />
        </button>
        <button className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors">
          View Upgrade Options
        </button>
      </div>
    </div>
  );
}