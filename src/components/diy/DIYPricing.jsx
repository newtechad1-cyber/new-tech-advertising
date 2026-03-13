import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYPricing({ onCTA, isLoading }) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-slate-400">One plan. All features. No surprises.</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-b from-violet-600/20 to-indigo-600/10 border border-violet-600/50 rounded-2xl p-10">
            <h3 className="text-3xl font-bold text-white mb-2">DIY Growth System</h3>
            <div className="mb-8">
              <div className="text-5xl font-bold text-white">$99</div>
              <p className="text-slate-400 text-sm mt-1">per month, billed monthly</p>
            </div>

            <Button
              onClick={onCTA}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold mb-8 rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? 'Processing...' : 'Start DIY Plan'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>

            <div className="space-y-4">
              <p className="text-slate-400 text-sm">Everything included:</p>
              {[
                'AI Content Generation (4 posts/month)',
                'Social Media Management',
                'AI Video Studio (basic)',
                'Lead Tracking & CRM',
                'ROI Dashboard',
                'Chat Assistant',
                'Website Tools',
                'Email Support',
                'Cancel Anytime',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </div>
              ))}
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