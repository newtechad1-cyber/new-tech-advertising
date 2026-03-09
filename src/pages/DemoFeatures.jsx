import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import StickyCTA from '@/components/demo-machine/StickyCTA';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import DemoConversionBlock from '@/components/demo-machine/DemoConversionBlock';
import { useDemoPageView } from '@/components/demo-machine/useDemoSession';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const FEATURES = [
  {
    title: 'AI Content Engine',
    badge: 'Content',
    color: 'border-purple-700',
    summary: 'Generates blog posts, social content, email newsletters, and marketing copy every week — automatically.',
    details: ['Weekly blog articles written and published automatically', 'Social media posts for Facebook, Instagram, and Google', 'Email newsletter content generated from your latest updates', 'All content optimized for SEO and your brand voice'],
  },
  {
    title: 'Programmatic SEO',
    badge: 'SEO',
    color: 'border-green-700',
    summary: 'Builds hundreds of local landing pages targeting every service and city in your market.',
    details: ['City + service page combinations built automatically', 'Optimized for Google local search rankings', 'Schema markup and technical SEO handled for you', 'Updated regularly to stay ahead of algorithm changes'],
  },
  {
    title: 'Review Automation',
    badge: 'Reputation',
    color: 'border-yellow-700',
    summary: 'Sends automated review requests after every job and manages your online reputation hands-free.',
    details: ['Automated SMS/email review requests', 'Google, Yelp, and Facebook review monitoring', 'AI-assisted response suggestions', 'Review performance dashboard'],
  },
  {
    title: 'Lead CRM',
    badge: 'CRM',
    color: 'border-cyan-700',
    summary: 'Captures every lead from every source and tracks them through your pipeline automatically.',
    details: ['Centralized lead inbox from all sources', 'Automated follow-up sequences', 'Lead scoring and priority flagging', 'Sales pipeline visualization'],
  },
  {
    title: 'Social Media Manager',
    badge: 'Social',
    color: 'border-pink-700',
    summary: 'Schedules and publishes consistent social media content across all your profiles.',
    details: ['Auto-scheduled posts across platforms', 'AI-generated captions and hashtags', 'Campaign and promotion management', 'Engagement tracking and analytics'],
  },
  {
    title: 'Analytics & Reporting',
    badge: 'Analytics',
    color: 'border-orange-700',
    summary: 'Shows you exactly what your marketing is doing and what return you\'re getting.',
    details: ['Traffic sources and page analytics', 'Lead conversion tracking', 'Monthly ROI reporting', 'Competitor benchmarking'],
  },
];

export default function DemoFeatures() {
  useDemoPageView('DemoFeatures');
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <DemoProgressBar currentPage="DemoFeatures" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/40 border border-blue-700 rounded-full text-blue-300 text-xs font-semibold mb-4">
            Step 3 of 7 — Feature Walkthrough
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Every Tool Your Business<br /><span className="text-blue-400">Will Ever Need</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six integrated systems that replace the stack of tools, agencies, and freelancers most businesses pay for separately.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`bg-slate-900 border rounded-xl overflow-hidden transition-all ${expanded === i ? f.color : 'border-slate-800'}`}>
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">{f.badge}</span>
                  <span className="font-semibold text-white">{f.title}</span>
                </div>
                {expanded === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expanded === i && (
                <div className="px-5 pb-5 border-t border-slate-800">
                  <p className="text-slate-300 text-sm mt-4 mb-3">{f.summary}</p>
                  <ul className="space-y-1.5">
                    {f.details.map(d => (
                      <li key={d} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-green-400 mt-0.5">✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl('DemoExamples')}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
              See Real Examples <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <DemoConversionBlock nextPage="DemoExamples" nextLabel="Real Examples →" />
      </div>

      <DemoAIPanel context="Prospect is exploring platform features in detail" />
      <StickyCTA currentStep="DemoFeatures" />
    </div>
  );
}