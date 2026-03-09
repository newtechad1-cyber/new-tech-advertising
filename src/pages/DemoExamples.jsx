import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import StickyCTA from '@/components/demo-machine/StickyCTA';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import DemoConversionBlock from '@/components/demo-machine/DemoConversionBlock';
import { useDemoPageView } from '@/components/demo-machine/useDemoSession';
import { ArrowRight, TrendingUp } from 'lucide-react';

const CASE_STUDIES = [
  { industry: 'HVAC', name: 'Metro Comfort Systems', location: 'Dallas, TX', result: '3x more organic calls in 90 days', detail: 'After NTA built their local SEO pages and automated seasonal content, they went from page 3 to top 3 on Google for "AC repair Dallas" — without running a single ad.', metric: '+247%', metricLabel: 'Organic Traffic' },
  { industry: 'Restaurant', name: 'Bella Vista Kitchen', location: 'Austin, TX', result: 'Fully booked weekends within 60 days', detail: 'NTA automated their weekly specials posts, ran a review campaign, and optimized their Google Business Profile. Within 2 months, they had a waitlist on Friday and Saturday nights.', metric: '+89', metricLabel: 'New Reviews' },
  { industry: 'Plumbing', name: 'ClearFlow Plumbing', location: 'Phoenix, AZ', result: '15 new customers in first month', detail: 'NTA built 40+ city and service pages targeting emergency and drain cleaning searches. Their phone started ringing from organic search within the first 30 days.', metric: '40+', metricLabel: 'New SEO Pages' },
  { industry: 'Contractor', name: 'Premier Build Group', location: 'Chicago, IL', result: 'Stopped competing on price', detail: 'After NTA built their project showcase content and review system, they started winning jobs based on their online reputation — not just their quote. Their close rate improved by 35%.', metric: '+35%', metricLabel: 'Close Rate' },
];

export default function DemoExamples() {
  useDemoPageView('DemoExamples');
  const industry = typeof window !== 'undefined' ? localStorage.getItem('nta_demo_industry') : '';

  const sorted = [...CASE_STUDIES].sort((a, b) =>
    a.industry.toLowerCase() === industry ? -1 : b.industry.toLowerCase() === industry ? 1 : 0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <DemoProgressBar currentPage="DemoExamples" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/40 border border-green-700 rounded-full text-green-300 text-xs font-semibold mb-4">
            Step 4 of 7 — Real Results
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Real Businesses.<br /><span className="text-green-400">Real Results.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Here's what NTA clients in your industry have actually achieved — no fake testimonials, no cherry-picked data.
          </p>
        </div>

        <div className="space-y-5 mb-10">
          {sorted.map((cs, i) => (
            <div key={cs.name} className={`bg-slate-900 border rounded-2xl p-6 ${i === 0 && cs.industry.toLowerCase() === industry ? 'border-blue-700' : 'border-slate-800'}`}>
              {i === 0 && cs.industry.toLowerCase() === industry && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-900/50 border border-blue-700 rounded-full text-blue-300 text-xs font-semibold mb-3">
                  ✦ Matches your industry
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">{cs.industry}</span>
                    <span className="text-xs text-slate-500">{cs.location}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">{cs.name}</h3>
                  <p className="text-green-400 font-semibold text-sm mt-1">{cs.result}</p>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{cs.detail}</p>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-3xl font-black text-green-400">{cs.metric}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{cs.metricLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl('DemoPricing')}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
              See Pricing <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <DemoConversionBlock nextPage="DemoPricing" nextLabel="See Pricing →" />
      </div>

      <DemoAIPanel context="Prospect is reviewing case studies and real results from NTA clients" />
      <StickyCTA currentStep="DemoExamples" />
    </div>
  );
}