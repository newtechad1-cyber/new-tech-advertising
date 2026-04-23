import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Clock, LayoutDashboard, Play, Home, Loader2 } from 'lucide-react';

const STEPS = [
  'Business profile created',
  'Marketing intelligence being generated',
  'Weekly marketing plan being prepared',
  'Dashboard access being provisioned',
];

export default function StartSuccess({ trialId }) {
  const [provisioningStatus, setProvisioningStatus] = useState('queued');
  const [checkCount, setCheckCount] = useState(0);

  // Poll TrialAccount for provisioning_status every 8s (max 5 checks = 40s)
  useEffect(() => {
    if (!trialId || provisioningStatus === 'ready' || checkCount >= 5) return;
    const timer = setTimeout(async () => {
      try {
        const { base44 } = await import('@/api/base44Client');
        const trial = await base44.entities.TrialAccount.get(trialId);
        if (trial?.provisioning_status) setProvisioningStatus(trial.provisioning_status);
        if (trial?.onboarding_status === 'ready_for_dashboard') setProvisioningStatus('ready');
      } catch (_) {}
      setCheckCount(c => c + 1);
    }, 8000);
    return () => clearTimeout(timer);
  }, [trialId, provisioningStatus, checkCount]);

  const isReady = provisioningStatus === 'ready';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3">Your Trial Is Started</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We've received your business details. Here's what's happening right now:
        </p>

        {/* Status list */}
        <ul className="space-y-3 mb-10 text-left">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-slate-300">
              {isReady || i === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-violet-400 flex-shrink-0 animate-spin" />
              )}
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ul>

        {/* Conditional CTA based on provisioning state */}
        <div className="space-y-3">
          {isReady ? (
            <Link
              to="/client/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30"
            >
              <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-2 w-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold py-3 rounded-xl text-sm cursor-default">
              <Clock className="w-4 h-4 text-violet-400" /> Your setup is being prepared…
            </div>
          )}
          <Link
            to={createPageUrl('Demo')}
            className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            <Play className="w-4 h-4" /> Watch Demo While You Wait
          </Link>
          <Link
            to={createPageUrl('Home')}
            className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>

        <p className="text-slate-700 text-xs mt-6">
          A confirmation email is on its way · Questions? Call{' '}
          <a href="tel:6414208816" className="text-violet-400 hover:text-violet-300">641-420-8816</a>
        </p>
      </div>
    </div>
  );
}