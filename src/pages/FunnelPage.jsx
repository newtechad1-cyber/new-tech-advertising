import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { CheckCircle2, Play, Star, ArrowRight } from 'lucide-react';
import LeadCaptureForm from '../components/funnel/LeadCaptureForm';
import ExitIntentPopup from '../components/funnel/ExitIntentPopup';
import StickyCTABar from '../components/funnel/StickyCTABar';
import { base44 } from '@/api/base44Client';

const SERVICE_CONFIG = {
  'streaming-tv-advertising': {
    headline: 'Put Your Business on Streaming TV',
    subheadline: 'Reach customers watching Roku, Hulu, and YouTube TV — right in their living rooms.',
    icon: '📺',
    color: 'from-blue-900 to-indigo-900',
    features: ['AI-Produced Video Ads', 'Hyper-Local Targeting', 'Roku, Hulu & YouTube TV', 'Real-Time Analytics'],
    guideTitle: '5 Ways Local Businesses Can Win With Streaming TV Advertising',
    videoEmbed: null,
    serviceSlug: 'streaming_tv'
  },
  'ada-website-compliance': {
    headline: 'Protect Your Business From ADA Lawsuits',
    subheadline: 'Get a fully ADA-compliant website that protects you legally and opens your site to all customers.',
    icon: '⚖️',
    color: 'from-slate-900 to-blue-900',
    features: ['Full Compliance Audit', 'Website Rebuild', 'Legal Protection', 'Accessibility Certificate'],
    guideTitle: '5 Things Every Business Owner Needs to Know About ADA Website Compliance',
    videoEmbed: null,
    serviceSlug: 'ada_rebuild'
  },
  'local-seo': {
    headline: 'Dominate Local Google Search',
    subheadline: 'Show up #1 when customers in your area search for your services — guaranteed.',
    icon: '🔍',
    color: 'from-emerald-900 to-teal-900',
    features: ['Google Maps Domination', 'Local Keyword Strategy', 'Review Generation', 'Monthly Reporting'],
    guideTitle: '5 Local SEO Secrets That Get Small Businesses Found on Google',
    videoEmbed: null,
    serviceSlug: 'local_seo'
  },
  'ai-social-media': {
    headline: 'Never Run Out of Social Media Content Again',
    subheadline: 'AI generates 30+ posts per month — images, captions, and hashtags — done for you.',
    icon: '📱',
    color: 'from-pink-900 to-purple-900',
    features: ['30+ Posts/Month', 'AI-Generated Images', 'Auto-Scheduling', 'Every Platform Covered'],
    guideTitle: '5 Ways AI Social Media Transforms Local Business Marketing',
    videoEmbed: null,
    serviceSlug: 'diy_saas'
  }
};

const DEFAULT_CONFIG = {
  headline: 'Grow Your Business With AI Marketing',
  subheadline: 'NTA gives local businesses the same marketing power as national brands — at a fraction of the cost.',
  icon: '🚀',
  color: 'from-slate-900 to-violet-900',
  features: ['AI Content Creation', 'Streaming TV Ads', 'Local SEO', 'Social Media Automation'],
  guideTitle: 'The Local Business Owner\'s Guide to AI Marketing',
  videoEmbed: null,
  serviceSlug: 'not_sure'
};

const CASE_STUDIES = [
  { business: 'Dallas HVAC Company', result: '3x increase in summer service calls', service: 'Streaming TV', icon: '❄️' },
  { business: 'Chicago Restaurant', result: '280% more Google reservations in 90 days', service: 'Local SEO', icon: '🍕' },
  { business: 'Texas Law Firm', result: '$0 ADA lawsuit exposure + 40% more web traffic', service: 'ADA Compliance', icon: '⚖️' },
];

export default function FunnelPage() {
  const params = new URLSearchParams(window.location.search);
  const serviceSlug = params.get('service') || 'default';
  const config = SERVICE_CONFIG[serviceSlug] || DEFAULT_CONFIG;

  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className={`bg-gradient-to-br ${config.color} text-white py-20 px-4`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-5xl mb-4">{config.icon}</div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                {config.headline}
              </h1>
              <p className="text-xl text-white/80 mb-8">
                {config.subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-8 text-lg font-bold"
                  onClick={() => window.location.href = createPageUrl('Start')}
                >
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 h-14 px-8 text-lg"
                  onClick={() => document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Download Free Guide
                </Button>
              </div>
            </div>

            {/* Feature list */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <h3 className="font-bold text-lg mb-4">What You Get:</h3>
              <ul className="space-y-3">
                {config.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-white/70">"NTA transformed our marketing. Best investment we've made." — Local Business Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Video */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Watch How It Works</h2>
          <p className="text-slate-500 mb-8">See why hundreds of local businesses trust NTA to run their marketing.</p>
          <div
            className="bg-slate-900 rounded-2xl aspect-video flex items-center justify-center cursor-pointer group hover:bg-slate-800 transition-colors"
            onClick={() => window.location.href = createPageUrl('Demo')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <p className="text-white font-semibold">Watch the Full Demo</p>
              <p className="text-slate-400 text-sm">2 minutes — see real results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture / Download Guide */}
      <section id="guide-section" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              FREE Download
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              "{config.guideTitle}"
            </h2>
            <p className="text-slate-500">Enter your info below and we'll send it straight to your inbox — plus a free strategy session offer.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8">
            <LeadCaptureForm
              serviceSlug={serviceSlug}
              sourcePage={`funnel/${serviceSlug}`}
              ctaLabel="Send Me the Free Guide →"
            />
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{cs.icon}</div>
                  <p className="font-bold text-lg mb-2">{cs.business}</p>
                  <p className="text-orange-400 font-semibold mb-3">"{cs.result}"</p>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{cs.service}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-white/90 mb-8">Start your free trial today. No contracts, no setup fees.</p>
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50 h-14 px-10 text-lg font-bold shadow-lg"
            onClick={() => window.location.href = createPageUrl('Start')}
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-white/70 mt-4">Free trial · No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Exit Intent & Sticky Bar */}
      <ExitIntentPopup serviceSlug={serviceSlug} guideTitle={config.guideTitle} />
      <StickyCTABar serviceSlug={serviceSlug} />
    </div>
  );
}