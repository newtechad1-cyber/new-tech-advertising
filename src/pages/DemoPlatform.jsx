import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Globe, FileText, Video, TrendingUp, Share2, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SalesProgressSteps from '@/components/sales/SalesProgressSteps';
import SalesGuidePanel from '@/components/sales/SalesGuidePanel';
import StickySalesCTA from '@/components/sales/StickySalesCTA';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const MODULES = [
  { icon: Globe, color: 'text-cyan-400 bg-cyan-900/30 border-cyan-800', title: 'Website & Local Pages', desc: 'Professional website built for you. Location and service pages that rank on Google. ADA compliant. Mobile-optimized. Updated by AI, not by you.' },
  { icon: FileText, color: 'text-violet-400 bg-violet-900/30 border-violet-800', title: 'AI Content Engine', desc: 'Blog articles, landing pages, social posts, email sequences — generated automatically for your industry, targeting your keywords, published on schedule.' },
  { icon: Video, color: 'text-orange-400 bg-orange-900/30 border-orange-800', title: 'Video Marketing', desc: 'Short-form videos, explainer content, social clips, and sales videos — all created from your business info without a camera crew or production team.' },
  { icon: TrendingUp, color: 'text-green-400 bg-green-900/30 border-green-800', title: 'SEO & Google Ranking', desc: 'Keyword strategy, local SEO campaigns, authority building, and Google Business optimization. Rank for the terms your customers actually search.' },
  { icon: Share2, color: 'text-pink-400 bg-pink-900/30 border-pink-800', title: 'Social Media Management', desc: 'Consistent posting to Facebook, Instagram, Google Business, and more. Captions, images, hashtags, and scheduling — handled every week.' },
  { icon: Zap, color: 'text-yellow-400 bg-yellow-900/30 border-yellow-800', title: 'Review & Reputation', desc: 'Automated review requests, responses, and reputation monitoring across Google, Yelp, and industry directories. Build trust at scale.' },
];

export default function DemoPlatform() {
  const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

  useEffect(() => {
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'demo_platform',
      page_path: '/demo/platform',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  const track = (e) => base44.functions.invoke('trackSalesEvent', { event_type: e, page_path: '/demo/platform', session_key: sessionKey }).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/95 backdrop-blur">
        <Link to={createPageUrl('SalesRoom')}><img src={LOGO} alt="NTA" className="h-8 w-auto" /></Link>
        <SalesProgressSteps currentStep="DemoPlatform" />
        <Link to={createPageUrl('DemoExamples')}>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500">Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-800 text-violet-300 text-xs px-3 py-1.5 rounded-full mb-6">
              Step 2 of 5 · The Platform
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              One System.<br />
              <span className="text-violet-400">Everything You Need to Grow.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              NTA replaces your agency, your content writer, your SEO consultant, and your video team — for a fraction of the combined cost. Here's what's inside the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map(m => {
              const Icon = m.icon;
              return (
                <div key={m.title} className={`bg-slate-900 border rounded-xl p-5 border-slate-700 hover:border-violet-700 transition-all`}>
                  <div className={`w-10 h-10 border rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{m.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-white font-bold">NTA vs. Traditional Agency</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-3 text-left text-slate-500 font-medium">What you get</th>
                    <th className="px-6 py-3 text-center text-violet-400 font-semibold">NTA Platform</th>
                    <th className="px-6 py-3 text-center text-slate-500 font-medium">Typical Agency</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Website built & maintained', '✓', '+ Extra fee'],
                    ['Weekly content creation', '✓ Automated', '3 posts/week'],
                    ['Video marketing', '✓ Monthly', 'Usually not included'],
                    ['SEO campaigns', '✓ Ongoing', 'Sometimes'],
                    ['Social media management', '✓ Daily', 'Limited'],
                    ['Review management', '✓', 'Rarely'],
                    ['Monthly cost', '$297-$997', '$2,500-$5,000+'],
                  ].map(([label, nta, agency]) => (
                    <tr key={label} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="px-6 py-3 text-slate-300">{label}</td>
                      <td className="px-6 py-3 text-center text-green-400 font-medium">{nta}</td>
                      <td className="px-6 py-3 text-center text-slate-500">{agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Link to={createPageUrl('DemoExamples')} onClick={() => track('demo_examples')}>
            <Button className="bg-violet-600 hover:bg-violet-500 font-bold text-base px-8 py-3 h-auto rounded-xl w-full sm:w-auto">
              See Real Business Examples <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <SalesGuidePanel step="DemoPlatform" />
        </div>
      </div>

      <StickySalesCTA currentStep="DemoPlatform" onTrack={track} />
    </div>
  );
}