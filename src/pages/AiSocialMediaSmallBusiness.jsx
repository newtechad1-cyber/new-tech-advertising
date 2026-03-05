import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import MarketingHero from '../components/marketing/MarketingHero';
import { VideoSection, FeaturesSection, HowItWorksSection, PricingSection, CtaBanner } from '../components/marketing/PlatformSections';
import { CheckCircle } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function AiSocialMediaSmallBusiness() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        <MarketingHero
          badge="Social Media for Small Business"
          headline="Create Social Media Posts in Minutes — Not Hours"
          subheadline="AI tools that help small and mid-sized businesses stay active on Facebook, Instagram, and LinkedIn without hiring a marketing agency."
        />

        {/* Why social media matters */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Why Social Media Matters for Small Business</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Your customers are on social media every day. Businesses that show up consistently build trust and win more customers over time.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: '📣', title: 'Stay Visible', desc: 'Regular posting keeps your business top-of-mind when customers are ready to buy.' },
                { emoji: '🤝', title: 'Build Trust', desc: 'Consistent, professional content shows customers you\'re reliable and established.' },
                { emoji: '📈', title: 'Grow Reach', desc: 'Every post is an opportunity to reach new potential customers in your area.' },
              ].map(c => (
                <div key={c.title} className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
                  <div className="text-3xl mb-3">{c.emoji}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-slate-600 text-sm">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform capabilities */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">What You Can Create on the Platform</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                'AI-written captions for any business type',
                'Promotional images sized for each platform',
                'Short videos to highlight your services',
                'Event and announcement graphics',
                'Seasonal promotion content',
                'Hashtag suggestions and CTAs',
              ].map(f => (
                <div key={f} className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-3 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm font-medium">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <VideoSection />
        <HowItWorksSection />
        <PricingSection />
        <CtaBanner headline="Start creating social media content today." sub="No agency. No design experience. Just a simple platform built for business owners." />
      </main>
      <SiteFooter />
    </div>
  );
}