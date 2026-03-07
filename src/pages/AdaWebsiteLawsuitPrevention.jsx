import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { AlertTriangle, TrendingUp, DollarSign, Scale } from 'lucide-react';

export default function AdaWebsiteLawsuitPrevention() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketingNav />

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <Link to={createPageUrl('AdaWebsiteCompliance')} className="text-violet-400 hover:text-violet-300 text-sm font-semibold mb-6 inline-block">
            ← Back to ADA Compliance
          </Link>
          <h1 className="text-4xl font-bold text-white mb-6">ADA Website Lawsuits: What You Need to Know</h1>
          <p className="text-slate-300 text-lg">Understanding the risks and how to protect your small business.</p>
        </div>

        <article className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">The Rise of ADA Website Lawsuits</h2>
            <p className="text-slate-300">
              Over 2,000 ADA website accessibility lawsuits are filed every year in the United States. Unlike traditional ADA lawsuits that focus on physical accessibility, web-based claims are growing exponentially.
            </p>
            <p className="text-slate-300">
              According to recent data, over 70% of ADA Title III lawsuits now target websites and digital platforms—a trend that shows no signs of slowing down.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why Small Businesses Are Targeted</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-4">
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Accessible Targets</h3>
                  <p className="text-slate-300 text-sm">
                    Plaintiff attorneys can easily automate lawsuits, scanning thousands of small business websites for accessibility violations.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-4">
              <div className="flex gap-4">
                <DollarSign className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Settlement Incentive</h3>
                  <p className="text-slate-300 text-sm">
                    Small business owners often settle quickly ($3,000-$50,000+) to avoid legal costs, making these cases profitable for plaintiffs' attorneys.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What Makes a Website ADA Non-Compliant?</h2>
            <div className="space-y-3">
              <p className="text-slate-300 font-semibold">Common violations include:</p>
              <ul className="space-y-2">
                {[
                  'Missing alt text on images',
                  'Poor color contrast (text vs. background)',
                  'No keyboard navigation support',
                  'Missing form labels',
                  'Unstructured headings (multiple H1s, missing hierarchy)',
                  'Auto-playing videos or audio',
                  'No captions on videos',
                  'Images used as text without alt descriptions',
                  'Missing ARIA landmarks',
                  'Broken skip-to-content links',
                ].map((item, i) => (
                  <li key={i} className="text-slate-300 flex gap-3">
                    <span className="text-violet-400 font-semibold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">The Legal Standard: WCAG 2.1 AA</h2>
            <p className="text-slate-300 mb-4">
              Courts have adopted the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as the accessibility standard for website compliance.
            </p>
            <p className="text-slate-300">
              WCAG AA compliance is achievable for most websites. It requires following accessibility best practices in design, development, and content creation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cost of Litigation vs. Remediation</h2>
            <div className="grid sm:grid-cols-2 gap-6 my-6">
              <div className="bg-rose-900/20 border border-rose-700/50 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Lawsuit Costs
                </h3>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>• Attorney fees: $50,000+</li>
                  <li>• Settlement: $5,000-$50,000+</li>
                  <li>• Time & distraction: Incalculable</li>
                  <li>• Reputation damage: Significant</li>
                </ul>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Remediation Costs
                </h3>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>• Audit: $500-$2,000</li>
                  <li>• Remediation: $5,000-$25,000</li>
                  <li>• Ongoing monitoring: $500/month</li>
                  <li>• Peace of mind: Priceless</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Steps to Protect Your Business</h2>
            <ol className="space-y-4">
              {[
                { step: 'Conduct an Accessibility Audit', desc: 'Get a professional assessment of your website.' },
                { step: 'Develop a Remediation Plan', desc: 'Fix the most critical issues first.' },
                { step: 'Implement Fixes', desc: 'Work with experienced developers to ensure proper implementation.' },
                { step: 'Test for Compliance', desc: 'Verify fixes with both automated tools and accessibility experts.' },
                { step: 'Document Your Efforts', desc: 'Keep records of your remediation efforts for legal protection.' },
                { step: 'Monitor Ongoing', desc: 'Continuously monitor and fix new accessibility issues.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-white font-semibold">{item.step}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-slate-900 border border-violet-600/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Get Your Free Accessibility Audit</h2>
            <p className="text-slate-300 mb-6">
              Don't wait for a lawsuit. Find out if your website is at risk and what you can do about it.
            </p>
            <Link
              to={createPageUrl('Tools')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Check Your Website Now
            </Link>
          </section>
        </article>
      </section>

      <SiteFooter />
    </div>
  );
}