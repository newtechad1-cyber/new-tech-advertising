import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TrialWelcome() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(25);
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
            <p className="text-slate-400 text-sm font-semibold tracking-wide mb-3">STEP 1 OF 4</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= 1 ? 'bg-violet-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome — Let's Set Up Your Marketing System
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              We'll walk you through 4 simple steps to get your marketing running. This should take about 10 minutes.
            </p>

            {/* What You'll Get */}
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold">Your business profile</p>
                  <p className="text-slate-400 text-sm">So we understand your goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold">Connected channels</p>
                  <p className="text-slate-400 text-sm">Your Facebook, Google, Instagram & more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold">Your first campaign</p>
                  <p className="text-slate-400 text-sm">Ready to go live in 24 hours</p>
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 mb-10 inline-block">
              <p className="text-slate-300 text-sm">
                ⏱️ <span className="font-semibold">Estimated time:</span> 10 minutes
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <Link
              to={createPageUrl('TrialBusiness')}
              className="block w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-center transition-all text-lg flex items-center justify-center gap-2 group"
            >
              ⭐ Start Setup <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button
              className="w-full text-slate-400 hover:text-slate-200 font-semibold transition-colors py-3"
              onClick={() => window.location.href = createPageUrl('ClientDashboard')}
            >
              Skip and explore later →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}