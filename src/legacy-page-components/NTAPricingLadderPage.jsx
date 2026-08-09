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
                <h3 className="text-white font-bold mb-2">Why is there a setup fee?</h3>
                <p className="text-slate-400">
                  The setup fee covers the initial work required to build or improve your digital foundation. Depending on your business, this may include website setup, website updates, Google Business Profile optimization, social media setup, SEO configuration, content creation, and connecting the tools needed to support your growth.
                  <br/><br/>
                  Unlike many agencies that charge large upfront fees, our setup fee is designed to keep startup costs affordable while allowing us to begin delivering value immediately.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Why do I need a monthly plan?</h3>
                <p className="text-slate-400">
                  Building visibility online is not a one-time project.
                  <br/><br/>
                  Your website, search rankings, content, reviews, and online presence all require ongoing attention. Each month we continue building on the work completed previously, helping more customers find, trust, and choose your business.
                  <br/><br/>
                  Think of it as building a house. The foundation is important, but the value comes from continually improving and maintaining it over time.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">How long should I expect to stay on a plan?</h3>
                <p className="text-slate-400">
                  Most businesses begin seeing meaningful improvements within the first few months, but long-term success comes from consistency.
                  <br/><br/>
                  We generally recommend a minimum commitment of 3 to 6 months, with many clients choosing to stay 12 months or longer because their online presence continues to grow and improve over time.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Do I need a website to get started?</h3>
                <p className="text-slate-400">
                  No.
                  <br/><br/>
                  Many businesses come to us without a website, while others have websites that are outdated or underperforming.
                  <br/><br/>
                  Our Foundation Launch package was specifically designed to help businesses create a professional online presence from the ground up.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">What if I already have a website?</h3>
                <p className="text-slate-400">
                  Perfect.
                  <br/><br/>
                  We'll evaluate your current website and determine whether it can be improved or whether rebuilding it would create a better customer experience and stronger online visibility.
                  <br/><br/>
                  Many clients begin with our Visibility Growth plan because they already have a website and simply need help attracting more customers.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">What does "visibility" mean?</h3>
                <div className="text-slate-400">
                  Visibility simply means how easily potential customers can find your business online.
                  <br/><br/>
                  This includes:
                  <ul className="list-disc pl-5 mt-2 space-y-1 mb-2">
                    <li>Google Search</li>
                    <li>Google Maps</li>
                    <li>Social media</li>
                    <li>Online directories</li>
                    <li>Reviews</li>
                    <li>Website content</li>
                  </ul>
                  The more visible your business becomes, the more opportunities customers have to discover you.
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Do I need to understand AI?</h3>
                <p className="text-slate-400">
                  Not at all.
                  <br/><br/>
                  Our job is to use the best tools available to help your business grow.
                  <br/><br/>
                  Whether that involves AI, automation, content creation, SEO, or social media management, we handle the technical side so you can focus on running your business.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">What makes New Tech Advertising different?</h3>
                <p className="text-slate-400">
                  Most marketing companies sell individual services.
                  <br/><br/>
                  We focus on helping local businesses build a stronger digital foundation, increase their visibility, and grow their reputation over time.
                  <br/><br/>
                  Our approach combines years of local marketing experience with modern technology to create affordable solutions that help small businesses compete in today's digital world.
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-white font-bold mb-2">Can I upgrade my plan later?</h3>
                <p className="text-slate-400">
                  Absolutely.
                  <br/><br/>
                  Many clients begin with Foundation Launch or Visibility Growth and move into Authority Builder, Market Leader, or Elevate as their business grows.
                  <br/><br/>
                  Our services are designed to grow alongside your business.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-slate-400 mb-8">
              Choose a path below or book a free strategy call to find the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/free-audit'}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Run a Free Visibility Audit
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => window.location.href = '/book-call'}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                Schedule a Discovery Call
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