import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import StickyCTA from '@/components/demo-machine/StickyCTA';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import DemoConversionBlock from '@/components/demo-machine/DemoConversionBlock';
import { useDemoPageView } from '@/components/demo-machine/useDemoSession';
import { Globe, FileText, Search, Star, Users, BarChart2, ArrowRight, CheckCircle } from 'lucide-react';

const PILLARS = [
  { icon: Globe, color: 'text-blue-400', title: 'AI-Built Website', desc: 'Professional, fast-loading website built and managed for you — no developers needed.' },
  { icon: FileText, color: 'text-purple-400', title: 'Automated Content', desc: 'Weekly blog posts, social content, and marketing copy generated automatically.' },
  { icon: Search, color: 'text-green-400', title: 'Local SEO Engine', desc: 'City and service pages that rank on Google and bring in organic traffic every month.' },
  { icon: Star, color: 'text-yellow-400', title: 'Review Management', desc: 'Automated review requests and response system that builds your reputation on autopilot.' },
  { icon: Users, color: 'text-cyan-400', title: 'Lead CRM', desc: 'Capture, track, and follow up with every lead from one central dashboard.' },
  { icon: BarChart2, color: 'text-orange-400', title: 'Analytics Dashboard', desc: 'See exactly what\'s working — traffic, leads, conversions, and ROI in real time.' },
];

export default function DemoPlatform() {
  useDemoPageView('DemoPlatform');

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <DemoProgressBar currentPage="DemoPlatform" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/40 border border-blue-700 rounded-full text-blue-300 text-xs font-semibold mb-4">
            Step 2 of 7 — Platform Overview
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            One Platform.<br /><span className="text-blue-400">Your Entire Marketing Engine.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            NTA replaces your agency, your scattered tools, and your manual processes — with one AI-powered system that works 24/7.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl aspect-video flex items-center justify-center mb-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600 flex items-center justify-center mx-auto mb-3">
              <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-blue-400 ml-1" />
            </div>
            <p className="text-slate-400 text-sm">Platform Overview Video · 3 min</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {PILLARS.map(({ icon: PillarIcon, color, title, desc }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors">
              <PillarIcon className={`w-6 h-6 ${color} mb-3`} />
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-800 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-white mb-3">Everything Works Together</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Website auto-links to all content', 'Reviews feed into Google rankings', 'Leads flow into your CRM automatically', 'Analytics track every source', 'Social links back to your website', 'Content feeds SEO every week'].map(pt => (
              <div key={pt} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> {pt}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to={createPageUrl('DemoFeatures')}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
              See Every Feature <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <DemoConversionBlock nextPage="DemoFeatures" nextLabel="Feature Walkthrough →" />
      </div>

      <DemoAIPanel context="Prospect is on the Platform Overview page, learning about all NTA modules" />
      <StickyCTA currentStep="DemoPlatform" />
    </div>
  );
}