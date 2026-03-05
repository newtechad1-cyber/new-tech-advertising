import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import MarketingHero from '../components/marketing/MarketingHero';
import { VideoSection, FeaturesSection, MediaCreationSection, HowItWorksSection, PricingSection, CtaBanner } from '../components/marketing/PlatformSections';
import { CheckCircle } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function Home() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        <MarketingHero
          badge="AI Marketing Platform for Small Business"
          headline="Create Videos, Images, and Social Media Posts in Minutes"
          subheadline="Marketing tools built for small and mid-sized businesses that want simple, effective marketing. No agency required."
        />

        {/* Logo strip / trust bar */}
        <div className="bg-slate-800 py-4 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm font-medium">
            {['Facebook', 'Instagram', 'LinkedIn', 'Google Business', 'Scheduling', 'AI Captions'].map(p => (
              <span key={p} className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />{p}</span>
            ))}
          </div>
        </div>

        <VideoSection />
        <FeaturesSection />
        <MediaCreationSection />
        <HowItWorksSection />
        <PricingSection />

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">What Business Owners Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { quote: "I created a month of social media posts in one afternoon. I never thought that was possible.", name: "Wendy R.", role: "HVAC Business Owner" },
                { quote: "The video tools are surprisingly easy. My posts look professional now.", name: "Pete G.", role: "Restaurant Owner" },
                { quote: "Finally a platform that speaks plain English, not marketing jargon.", name: "Tony J.", role: "Local Retailer" },
                { quote: "I can schedule a whole week of content in under 30 minutes.", name: "Jay M.", role: "Service Business Owner" },
              ].map(t => (
                <div key={t.name} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-slate-700 italic mb-4">"{t.quote}"</p>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner headline="Your first month of content is waiting." sub="Start your free trial and create videos, images, and posts today." />
      </main>
      <SiteFooter />
    </div>
  );
}