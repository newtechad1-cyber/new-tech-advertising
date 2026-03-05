import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import MarketingHero from '../components/marketing/MarketingHero';
import { HowItWorksSection, PricingSection, CtaBanner } from '../components/marketing/PlatformSections';
import { CheckCircle } from 'lucide-react';

export default function RestaurantSocialMedia() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        <MarketingHero
          badge="Restaurant Marketing Platform"
          headline="Fill More Tables With Better Social Media Content"
          subheadline="Create menu highlights, daily specials, event announcements, and food promotion content in minutes — no photographer or agency needed."
        />

        {/* Restaurant Content Types */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Content Your Restaurant Can Create Instantly</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">The platform is built to help restaurants create mouth-watering content without a dedicated marketing team.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { emoji: '🍽️', title: 'Menu Highlights', desc: 'Showcase your best dishes with AI-generated descriptions and image prompts that make food look irresistible.' },
                { emoji: '⭐', title: 'Daily Specials', desc: 'Announce your daily or weekly specials with quick, attention-grabbing posts that drive same-day traffic.' },
                { emoji: '🎉', title: 'Events & Live Entertainment', desc: 'Promote trivia nights, live music, holiday events, and private dining with branded graphics and videos.' },
                { emoji: '🔥', title: 'Food Promotions', desc: 'Run limited-time offers, happy hour deals, and seasonal promotions with content that drives urgency.' },
                { emoji: '🎬', title: 'Behind-the-Scenes Video', desc: 'Short kitchen videos, chef introductions, and cooking clips that create a personal connection with customers.' },
                { emoji: '📆', title: 'Scheduled Posting', desc: 'Plan a week or month of restaurant content ahead of time so you\'re never scrambling for ideas.' },
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
        <section className="py-20 bg-gradient-to-br from-orange-900 to-red-900 text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-4">Food Photos and Videos Drive Restaurant Visits</h2>
                <p className="text-orange-100 mb-6 leading-relaxed">Restaurants with active social media see more walk-ins, reservations, and repeat customers. The platform helps you create content that actually makes people hungry.</p>
                <ul className="space-y-3">
                  {['Create food highlight videos fast', 'Post daily specials without design skills', 'Promote events with branded graphics', 'Stay active even on your busiest days'].map(i => (
                    <li key={i} className="flex items-center gap-3 text-orange-100 text-sm"><CheckCircle className="w-5 h-5 text-orange-300 shrink-0" />{i}</li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href="https://app.newtechadvertising.com/start-trial" className="inline-flex items-center justify-center bg-white text-orange-700 hover:bg-orange-50 font-extrabold px-8 py-4 rounded-lg text-base shadow-lg transition-colors">
                    Start Free Trial
                  </a>
                </div>
              </div>
              <div className="bg-black/30 rounded-2xl aspect-video flex flex-col items-center justify-center gap-3 border border-white/10">
                <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-white/70 text-sm">Restaurant Marketing Demo</p>
              </div>
            </div>
          </div>
        </section>

        <HowItWorksSection />
        <PricingSection />
        <CtaBanner headline="Ready to fill more tables?" sub="Start creating menu highlights, special promotions, and event content today." />
      </main>
      <SiteFooter />
    </div>
  );
}