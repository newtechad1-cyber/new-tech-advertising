import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, LayoutDashboard, Play, Home } from 'lucide-react';

const NEXT_STEPS = [
  'Your business profile is being prepared',
  'Your starting marketing direction is being generated',
  'You\'ll be guided into the platform experience',
];

export default function StartSuccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3">Your Trial Is Started</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We've received your business details and started building your marketing setup. Here's what's happening now:
        </p>

        <ul className="space-y-3 mb-10 text-left">
          {NEXT_STEPS.map(step => (
            <li key={step} className="flex items-start gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Link
            to={createPageUrl('Dashboard')}
            className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30"
          >
            <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
          </Link>
          <Link
            to={createPageUrl('AiMarketingPlatform')}
            className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            <Play className="w-4 h-4" /> Watch Demo
          </Link>
          <Link
            to={createPageUrl('Home')}
            className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>

        <p className="text-slate-700 text-xs mt-6">
          Questions? Call <a href="tel:6414208816" className="text-violet-400 hover:text-violet-300">641-420-8816</a>
        </p>
      </div>
    </div>
  );
}