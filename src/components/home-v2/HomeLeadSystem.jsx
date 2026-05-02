import React from 'react';
import { Search, Globe, MapPin, Megaphone, Share2, Video, Bell } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    label: 'Audit',
    title: 'We Find the Gaps',
    desc: 'A free gap audit shows exactly what\'s costing you leads — slow site, missing SEO, no follow-up. No guesswork.',
    color: 'bg-purple-600',
  },
  {
    icon: Globe,
    label: 'Rebuild',
    title: 'Fast, Local Website',
    desc: 'We rebuild your site so it loads fast, looks professional on mobile, and is built to convert visitors into calls.',
    color: 'bg-blue-600',
  },
  {
    icon: MapPin,
    label: 'SEO Pages',
    title: 'Show Up in Local Searches',
    desc: 'City + service pages that rank on Google. When someone searches "HVAC Mason City" — you show up.',
    color: 'bg-indigo-600',
  },
  {
    icon: Megaphone,
    label: 'Seasonal Campaigns',
    title: 'Timely Ads & Offers',
    desc: 'Spring tune-ups, fall cleanouts, holiday specials — we run campaigns at the right time so customers act now.',
    color: 'bg-orange-600',
  },
  {
    icon: Share2,
    label: 'Social Content',
    title: 'Stay Top of Mind',
    desc: 'Weekly posts, job photos, and local stories that keep your business visible on Facebook and Google Business Profile.',
    color: 'bg-teal-600',
  },
  {
    icon: Video,
    label: 'AI Video',
    title: 'Video That Builds Trust',
    desc: 'Short-form AI videos with your branding that explain your services, showcase your work, and earn clicks.',
    color: 'bg-rose-600',
  },
  {
    icon: Bell,
    label: 'Lead Follow-Up',
    title: 'Never Lose a Lead',
    desc: 'Automated texts and emails follow up with every inquiry — fast. Most businesses lose leads just from slow response.',
    color: 'bg-emerald-600',
  },
];

export default function HomeLeadSystem() {
  return (
    <section id="how-it-works" className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* What is a Lead System */}
        <div className="text-center mb-14">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">What We Build</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">What Is a Local Lead System?</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            It's everything working together — your website, SEO, ads, content, video, and follow-up — so local customers find you, trust you, and call you. Not just a website. A system.
          </p>
        </div>

        {/* Problem block */}
        <div className="bg-slate-950 rounded-2xl p-8 mb-14 text-white">
          <h3 className="text-xl font-black mb-2">The Problem With Most Small Business Websites</h3>
          <p className="text-slate-400 mb-5 max-w-2xl">Most local business websites were built once and forgotten. They're slow, hard to find on Google, and don't give visitors a reason to call. Here's what that's actually costing you:</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { stat: '75%', label: 'of people judge credibility by website design' },
              { stat: '53%', label: 'of mobile users leave a page that takes 3+ seconds to load' },
              { stat: '78%', label: 'of local mobile searches result in an offline purchase' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-blue-400 mb-1">{item.stat}</p>
                <p className="text-slate-400 text-sm leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System steps */}
        <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">Our 7-Part System</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${step.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Step {i + 1}</p>
                    <p className="text-xs font-bold text-slate-600">{step.label}</p>
                  </div>
                </div>
                <h4 className="font-black text-slate-900 text-base mb-1.5">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
          {/* Final CTA card */}
          <div className="border-2 border-blue-500 bg-blue-50 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
            <p className="text-blue-700 font-black text-lg mb-2">Ready to see what's missing?</p>
            <p className="text-blue-600 text-sm mb-4">Get a free gap audit — we'll show you exactly what to fix.</p>
            <a href="/gap-audit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Get My Free Audit →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}