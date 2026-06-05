import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYPricing({ onCTA, isLoading }) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-slate-400">Start with Social, or upgrade to the full Suite.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* DIY Social */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">DIY Social</h3>
            <p className="text-slate-400 text-sm mb-6">Manage your social media with AI tools</p>
            <div className="mb-8">
              <div className="text-5xl font-bold text-white">$97</div>
              <p className="text-slate-400 text-sm mt-2">per month</p>
            </div>

            <Button
              onClick={() => onCTA('diy_social')}
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 text-lg font-semibold mb-6 rounded-lg flex items-center justify-center gap-2 border border-slate-700"
            >
              {isLoading ? 'Processing...' : 'Start DIY Social'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>

            <div className="space-y-3 mb-8 text-sm text-slate-300 flex-1">
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> AI Content Generation (20 posts/mo)</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Social Media Planner</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> 3 Social Channels</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Content Calendar</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Growth Guide Chatbot</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Learning Center Access</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Email Support</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> Cancel Anytime</div>
            </div>
          </div>

          {/* DIY Suite */}
          <div className="bg-gradient-to-b from-violet-600/20 to-indigo-600/10 border border-violet-600/50 rounded-2xl p-10 flex flex-col relative scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              Best for Solo Operators
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">DIY Marketing Suite</h3>
            <p className="text-slate-400 text-sm mb-6">Full marketing + business tools</p>
            <div className="mb-8">
              <div className="text-5xl font-bold text-white">$197</div>
              <p className="text-slate-400 text-sm mt-2">per month</p>
            </div>

            <Button
              onClick={() => onCTA('diy_suite')}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold mb-6 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
            >
              {isLoading ? 'Processing...' : 'Start Marketing Suite'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>

            <div className="space-y-3 mb-8 text-sm text-slate-300 flex-1">
              <div className="flex items-start gap-3 font-semibold text-white"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Everything in DIY Social PLUS:</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Full CRM & Client Management</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Leads Pipeline & Prospecting</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Invoicing & Expense Tracking</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Financial Reports (P&L)</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Project Tracking</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> 50 AI Posts/mo</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> 7 Social Channels</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> AI Video Studio</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" /> Self-Service Gap Audit</div>
            </div>
            
            <div className="border-t border-slate-600/30 pt-6 mt-auto">
              <p className="text-slate-400 text-xs text-center">
                Most businesses recover this investment with just one new customer.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Questions?</h3>
          <div className="space-y-6">
            {[
              {
                q: 'Can I upgrade to full service later?',
                a: 'Yes! If you need hands-on strategy and execution, you can upgrade to our full service plan anytime.',
              },
              {
                q: 'Do I get customer support?',
                a: 'Yes, you get email support and access to our knowledge base. Pro support can be added for $49/month.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. No long-term contracts, no setup fees. Cancel with one click.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Stripe. Your payment is secure and encrypted.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}