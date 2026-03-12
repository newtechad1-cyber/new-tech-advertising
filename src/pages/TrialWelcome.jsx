import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle2 } from 'lucide-react';

export default function TrialWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[12%] bg-violet-500 transition-all" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome.</h1>
          <p className="text-lg text-white font-semibold mb-6">
            We're going to set up your marketing system.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
              </div>
              <p className="text-slate-300 text-sm text-left">This takes about 10 minutes</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
              </div>
              <p className="text-slate-300 text-sm text-left">We guide you step-by-step</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
              </div>
              <p className="text-slate-300 text-sm text-left">No marketing experience required</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link
            to={createPageUrl('TrialBusinessSetup')}
            className="block w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl text-center transition-all"
          >
            Start Setup
          </Link>
          <Link
            to={createPageUrl('ClientDashboard')}
            className="block w-full text-center text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}