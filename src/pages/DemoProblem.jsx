import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import StickyCTA from '@/components/demo-machine/StickyCTA';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import DemoConversionBlock from '@/components/demo-machine/DemoConversionBlock';
import { useDemoPageView } from '@/components/demo-machine/useDemoSession';
import { AlertCircle, DollarSign, Clock, TrendingDown, ArrowRight } from 'lucide-react';

const PROBLEMS = [
  { icon: DollarSign, title: 'Wasting Money on Agencies', desc: 'Paying $2,000–$5,000/month for reports you can\'t understand and results you can\'t verify.' },
  { icon: Clock, title: 'No Time to Do It Yourself', desc: 'Running a business is full-time. You don\'t have 15 hours a week for content, SEO, and social media.' },
  { icon: TrendingDown, title: 'Invisible Online', desc: 'Your competitors show up first on Google. Your website gets no traffic. Leads go elsewhere.' },
  { icon: AlertCircle, title: 'Fragmented Tools', desc: 'Website here. Social scheduler there. Email somewhere else. CRM you never use. Nothing talks to each other.' },
];

export default function DemoProblem() {
  useDemoPageView('DemoProblem');
  const industry = typeof window !== 'undefined' ? localStorage.getItem('nta_demo_industry') : '';

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <DemoProgressBar currentPage="DemoProblem" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/40 border border-red-800 rounded-full text-red-300 text-xs font-semibold mb-4">
            Step 1 of 7 — The Problem
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Why Most Small Business<br /><span className="text-red-400">Marketing Doesn't Work</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Before we show you the solution, let's name exactly what's broken — because it's probably costing you thousands of dollars right now.
          </p>
        </div>

        {/* Video placeholder */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl aspect-video flex items-center justify-center mb-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600 flex items-center justify-center mx-auto mb-3">
              <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-blue-400 ml-1" />
            </div>
            <p className="text-slate-400 text-sm">Problem Statement Video · 2 min</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {PROBLEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <Icon className="w-6 h-6 text-red-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-yellow-800/40 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-yellow-400 mb-2">The Real Cost of Broken Marketing</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            The average small business spends <strong className="text-white">$18,000–$36,000 per year</strong> on marketing that doesn't generate measurable ROI.
            They pay agencies for reports, buy tools they don't use, and post on social without a strategy.
            Meanwhile, their online presence stays weak, their pipeline stays dry, and their competitors keep winning.
          </p>
        </div>

        <div className="text-center">
          <Link to={createPageUrl('DemoPlatform')}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
              See the Solution <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-slate-500 text-sm mt-3">Next: Platform Overview →</p>
        </div>

        <DemoConversionBlock title="Already Convinced?" nextPage="DemoPlatform" nextLabel="Continue Demo" />
      </div>

      <DemoAIPanel context="Prospect is on the Problem page learning about marketing challenges" />
      <StickyCTA currentStep="DemoProblem" />
    </div>
  );
}