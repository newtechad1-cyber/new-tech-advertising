import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import { useDemoPageView, useDemoTrack } from '@/components/demo-machine/useDemoSession';
import { Zap, Calendar, ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react';

const STEPS_AFTER = [
  { n: '1', title: 'Start Free Trial', desc: 'Get instant access to the platform. No credit card required.', time: '5 minutes' },
  { n: '2', title: 'Onboarding Call', desc: 'A setup specialist walks you through your account.', time: '30 minutes' },
  { n: '3', title: 'Platform Built', desc: 'Your website, content, and SEO system go live.', time: '5–7 business days' },
  { n: '4', title: 'First Results', desc: 'Traffic, leads, and visibility start building.', time: 'First 30 days' },
];

export default function DemoNext() {
  useDemoPageView('DemoNext');
  const { track } = useDemoTrack();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <DemoProgressBar currentPage="DemoNext" />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/40 border border-blue-700 rounded-full text-blue-300 text-xs font-semibold mb-4">
            Step 7 of 7 — Your Next Step
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            You've Seen What NTA Does.<br /><span className="text-blue-400">Now Let's Do It for You.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Getting started is simple. Here's exactly what happens when you join.
          </p>
        </div>

        {/* What happens next */}
        <div className="space-y-3 mb-10">
          {STEPS_AFTER.map(s => (
            <div key={s.n} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">{s.n}</div>
              <div className="flex-1">
                <div className="font-semibold text-white">{s.title}</div>
                <div className="text-slate-400 text-sm mt-0.5">{s.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                <Clock className="w-3 h-3" /> {s.time}
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white">Our Promise to You</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['No long-term contracts', 'Cancel anytime', 'Onboarding support included', '30-day satisfaction guarantee', 'Dedicated setup specialist', 'Results in first 30 days or we fix it'].map(g => (
              <div key={g} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> {g}
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_click', { value: 'start_trial_final' })}>
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg flex flex-col items-center gap-1 transition-colors">
              <div className="flex items-center gap-2"><Zap className="w-5 h-5" /> Start Free Trial</div>
              <span className="text-blue-200 text-sm font-normal">No credit card required</span>
            </button>
          </Link>
          <Link to={createPageUrl('Book-Call')} onClick={() => track('cta_click', { value: 'book_call_final' })}>
            <button className="w-full py-4 border-2 border-slate-600 hover:border-slate-400 text-white rounded-2xl font-bold text-lg flex flex-col items-center gap-1 transition-colors">
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Book a Strategy Call</div>
              <span className="text-slate-400 text-sm font-normal">Free 30-minute consultation</span>
            </button>
          </Link>
        </div>

        <div className="text-center text-slate-500 text-sm">
          Questions? <button className="text-blue-400 hover:text-blue-300" onClick={() => {}}>Ask our AI guide →</button>
        </div>
      </div>

      <DemoAIPanel context="Prospect has completed the demo and is deciding whether to start a trial or book a call" />
    </div>
  );
}