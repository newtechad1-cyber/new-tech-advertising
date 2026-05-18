import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import MarketingHero from '../components/marketing/MarketingHero';
import { VideoSection, FeaturesSection, HowItWorksSection, PricingSection, CtaBanner } from '../components/marketing/PlatformSections';
import { CheckCircle } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function LocalBusinessMarketing() {
  return (
    <div className="bg-white">
      <SEOHead 
        title="Local Business Marketing | AI Marketing for Small Business"
        description="AI-powered marketing for local businesses. Google Business Profile, social media, local SEO & AI search optimization. Grow your local customer base. New Tech Advertising."
      />
      <SiteHeader />
      <main>
        <MarketingHero
          badge="Local Business Marketing Platform"
          headline="Grow Your Local Business Visibility Online"
          subheadline="AI-powered marketing tools that help local businesses create content, stay active on social media, and attract more customers — without an agency."
        />

        {/* Why visibility matters */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Why Online Visibility Matters for Local Business</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">When someone needs what you offer, they search online first. Businesses that show up consistently online win more customers — it's that simple.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { emoji: '🔍', title: 'Customers Search Before They Buy', desc: 'Most people look up a business online before visiting or calling. If you\'re not showing up, you\'re losing to competitors who are.' },
                { emoji: '📱', title: 'Social Media Builds Trust', desc: 'An active social media presence tells potential customers that your business is real, responsive, and worth their time.' },
                { emoji: '🏆', title: 'Consistency Wins', desc: 'Businesses that post regularly — even just a few times per week — consistently outperform those that don\'t.' },
                { emoji: '⚡', title: 'You Don\'t Need a Big Budget', desc: 'Organic social media content is free to publish. The platform helps you create it quickly so consistency is achievable.' },
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

        {/* What the platform does */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">What the Platform Does for Your Business</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                'Create a month of content in one sitting',
                'Generate captions and hashtags with AI',
                'Design images without a graphic designer',
                'Produce short promotional videos',
                'Schedule posts to Facebook, Instagram, LinkedIn',
                'Get reminders so you never miss a posting day',
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
        <CtaBanner headline="Start growing your local business visibility today." sub="Create your first post in minutes. No agency, no design skills, no complicated setup." />
      </main>
      <SiteFooter />
    </div>
  );
}