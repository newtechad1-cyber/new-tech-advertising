import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Play, CheckCircle, BarChart2, Globe, Zap, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const FLOW_STEPS = [
  { num: '01', icon: Play, label: 'Watch the Demo', desc: 'See how the platform works in 8 minutes' },
  { num: '02', icon: BarChart2, label: 'See Real Examples', desc: 'Industry-specific results from real businesses' },
  { num: '03', icon: CheckCircle, label: 'Review Pricing', desc: 'Transparent plans, no agency markup' },
  { num: '04', icon: Zap, label: 'Start or Call', desc: 'Begin your trial or talk to our team' },
];

const STATS = [
  { val: '3x', label: 'Average lead increase in 90 days' },
  { val: '$597', label: 'Starting monthly — vs $3K+ agency retainer' },
  { val: '100%', label: 'Done-for-you setup — we build it for you' },
  { val: '48hr', label: 'Time to first published content' },
];

export default function SalesRoom() {
  useEffect(() => {
    // Track demo room entry
    const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();
    localStorage.setItem('nta_session', sessionKey);
    base44.functions.invoke('trackSalesEvent', {
      event_type: 'demo_start',
      page_path: '/sales',
      session_key: sessionKey,
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link to={createPageUrl('Home')}><img src={LOGO} alt="NTA" className="h-9 w-auto" /></Link>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('Book-Call')} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Book Call
          </Link>
          <Link to={createPageUrl('DemoPricing')}>
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white">View Pricing</Button>
          </Link>
          <Link to={createPageUrl('DemoOverview')}>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 font-semibold">Start Demo <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/50 text-violet-300 text-sm px-4 py-1.5 rounded-full mb-8">
          <Zap className="w-3.5 h-3.5" /> AI-Powered Marketing · Built for Small Businesses
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
          See How AI Can Run<br />
          <span className="text-violet-400">Your Marketing</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Most small businesses waste thousands on scattered marketing that doesn't connect. NTA is one system that handles content, video, SEO, social, and lead generation — automatically.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to={createPageUrl('DemoOverview')}>
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-8 py-4 h-auto rounded-xl shadow-xl shadow-violet-600/20">
              <Play className="w-5 h-5 mr-2" /> Start the Demo
            </Button>
          </Link>
          <Link to={createPageUrl('DemoPricing')}>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white text-base px-6 py-4 h-auto rounded-xl">
              View Pricing
            </Button>
          </Link>
          <Link to={createPageUrl('Book-Call')} className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1.5 transition-colors">
            <Calendar className="w-4 h-4" /> Or book a call
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-violet-400 mb-1">{s.val}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">How the Sales Room Works</h2>
        <p className="text-slate-400 text-center mb-12">Take 8 minutes. We'll show you exactly what NTA does and whether it's right for your business.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center hover:border-violet-700 transition-all">
                <div className="w-12 h-12 bg-violet-900/40 border border-violet-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-xs text-slate-600 font-bold mb-2">{step.num}</div>
                <h3 className="text-white font-bold mb-2">{step.label}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link to={createPageUrl('DemoOverview')}>
            <Button className="bg-violet-600 hover:bg-violet-500 font-bold text-base px-8 py-3 h-auto rounded-xl">
              Start Demo Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* What you'll see */}
      <section className="bg-slate-900 border-y border-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">What's Inside</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'The Platform', desc: 'Website, content, SEO, video, social — all in one dashboard' },
              { icon: BarChart2, title: 'Real Examples', desc: 'HVAC, restaurants, plumbers, contractors — see what happened' },
              { icon: CheckCircle, title: 'Transparent Pricing', desc: 'Compare to agencies. Most businesses save $1,500-$3,000/month' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-10 h-10 bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="py-8 text-center border-t border-slate-800">
        <p className="text-slate-600 text-sm">New Tech Advertising · <a href="tel:6414208816" className="text-violet-400 hover:text-violet-300">641-420-8816</a> · <a href="mailto:rick@newtechadvertising.com" className="text-violet-400 hover:text-violet-300">rick@newtechadvertising.com</a></p>
      </div>
    </div>
  );
}