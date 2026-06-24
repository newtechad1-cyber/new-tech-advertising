import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NTAPricingLadder from '@/components/pricing/NTAPricingLadder';
import SiteFooter from '@/components/marketing/SiteFooter';
import MarketingNav from '../components/nav/MarketingNav';

export default function NTAPricingLadderPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (planId) => {
    window.location.href = '/book-call';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
      <MarketingNav />

      <div className="py-16 px-6 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Choose Your Growth Path
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From DIY tools to full execution, find the plan that matches your goals and capacity.
            </p>
          </div>

          {/* Pricing Ladder */}
          <NTAPricingLadder
            currentPlan={null}
            onSelectPlan={handleSelectPlan}
            showPhases={true}
            compact={false}
          />

          {/* Why Each Plan */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Which Plan Is Right For You?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Foundation */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Start With Foundation Launch</h3>
                <p className="text-slate-400 mb-6">
                  Perfect if you have no website, an outdated website, or a weak online presence. Let's fix the basics first.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Your current website is hard to use or update</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You need a Google Business Profile setup</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You just need the foundational basics done right</span>
                  </li>
                </ul>
              </div>

              {/* Visibility Growth */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Scale With Visibility Growth</h3>
                <p className="text-slate-400 mb-6">
                  Best if you have a website but nobody is finding you. We'll start actively building your online presence.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You need more consistent traffic and leads</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You want regular content updates on your site and social media</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You need ongoing SEO improvements</span>
                  </li>
                </ul>
              </div>

              {/* Authority Builder */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Dominate With Authority Builder</h3>
                <p className="text-slate-400 mb-6">
                  Ideal if you want to become the most trusted name in your service area through strong reputation and content.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You want proactive review generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You need video content and deeper strategy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You want to clearly outpace local competitors</span>
                  </li>
                </ul>
              </div>

              {/* Market Leader & Elevate */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Scale With Market Leader or Elevate</h3>
                <p className="text-slate-400 mb-6">
                  Perfect for aggressive growth, advanced streaming video strategies, and custom AI/CRM automations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You're ready to own your market completely</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You need custom AI workflows and sales automation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">You want premium support and strategic consulting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 bg-slate-900/50 border border-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-bold mb-2">Can I upgrade later?</h3>
                <p className="text-slate-400">
                  Yes! Start with DIY and upgrade to Guided Growth, Done-For-You, or Premium whenever you're ready.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">What if I start DIY and it doesn't work?</h3>
                <p className="text-slate-400">
                  We don't offer money-back guarantees — setup takes real time and our team deserves to be paid for that work. But we never lock you in. Cancel anytime, no penalties, no fees.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">How long does onboarding take?</h3>
                <p className="text-slate-400">
                  DIY onboarding takes about 30 minutes. Guided Growth and Done-For-You include a strategy call to get aligned.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Can I cancel anytime?</h3>
                <p className="text-slate-400">
                  Yes. All plans are month-to-month. Cancel anytime, and you'll have access through the end of your billing period.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-slate-400 mb-8">
              Choose your plan above or book a free strategy call to find the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/nta/diy-growth-system'}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => window.location.href = 'mailto:sales@newtechadvertising.com?subject=Let\'s Chat About Pricing'}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Talk to Sales
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}