import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import MarketingHero from '../components/marketing/MarketingHero';
import { HowItWorksSection, PricingSection, CtaBanner } from '../components/marketing/PlatformSections';
import { CheckCircle } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function HvacMarketing() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        <MarketingHero
          badge="HVAC Marketing Platform"
          headline="Grow Your HVAC Business With AI-Powered Marketing"
          subheadline="Create seasonal promotions, maintenance reminders, and equipment upgrade content in minutes — without a marketing team."
        />

        {/* HVAC Content Types */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Marketing Content Built for HVAC Companies</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">The platform generates content specific to HVAC businesses — so you're not starting from scratch every time.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { emoji: '❄️', title: 'Seasonal Promotions', desc: 'Announce summer AC tune-ups, winter furnace checks, or spring/fall promotions with ready-to-post graphics and captions.' },
                { emoji: '🔔', title: 'Service Reminders', desc: 'Remind past customers to schedule annual maintenance with professional posts that go out automatically.' },
                { emoji: '🛠️', title: 'Maintenance Tips', desc: 'Post helpful tips about filter changes, energy savings, and system care to build trust with your audience.' },
                { emoji: '⚡', title: 'Equipment Upgrades', desc: 'Promote high-efficiency systems, smart thermostats, and new equipment with attention-grabbing visuals and video.' },
                { emoji: '📹', title: 'Service Highlight Videos', desc: 'Short videos showing what you do — before-and-after, technician tips, or customer stories.' },
                { emoji: '📆', title: 'Consistent Scheduling', desc: 'Plan a full month of HVAC content in your dashboard and schedule it all at once.' },
              ].map(c => (
                <div key={c.title} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="text-2xl mb-3">{c.emoji}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-slate-800 rounded-2xl aspect-video flex flex-col items-center justify-center gap-3 border border-slate-700">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-slate-400 text-sm">HVAC Marketing Demo</p>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-4">Video Content That Gets HVAC Customers Calling</h2>
                <p className="text-slate-300 mb-6 leading-relaxed">Video posts consistently outperform plain text and image posts. HVAC companies that post videos — even simple ones — see more calls, shares, and brand recognition.</p>
                <ul className="space-y-3">
                  {['Create service highlight videos in minutes', 'Show before-and-after results', 'Post seasonal promotion videos', 'Build trust with how-it-works content'].map(i => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <HowItWorksSection />
        <PricingSection />
        <CtaBanner headline="Ready to grow your HVAC business?" sub="Start creating seasonal promotions, maintenance reminders, and video content today." />
      </main>
      <SiteFooter />
    </div>
  );
}