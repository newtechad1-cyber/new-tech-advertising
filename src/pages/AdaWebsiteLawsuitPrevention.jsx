import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdaWebsiteLawsuitPrevention() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" /> ADA Website Compliance
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight">
                  Is Your Website a Lawsuit Risk?
                </h1>
                <p className="text-slate-300 mb-6 leading-relaxed text-lg">
                  Thousands of small business websites receive ADA accessibility demand letters and lawsuits every year. Most business owners don't even know their site has a problem — until they get the letter.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={createPageUrl('AdaAccessibility')}>
                    <button className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg">
                      Request a Free Website Review
                    </button>
                  </Link>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-8">
                <p className="text-red-300 font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Common ADA Violations</p>
                <ul className="space-y-3">
                  {['Images missing alt text', 'Poor color contrast', 'No keyboard navigation support', 'Forms without proper labels', 'Videos without captions', 'Missing skip navigation links'].map(v => (
                    <li key={v} className="flex items-center gap-3 text-slate-300 text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />{v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Risk section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Why ADA Compliance Matters for Your Business</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">The ADA (Americans with Disabilities Act) applies to websites, not just physical locations. Lawsuits targeting small business websites have been rising every year.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { emoji: '⚖️', title: 'Legal Risk', desc: 'Small businesses receive ADA demand letters and can face lawsuits and settlement costs even without knowing their site has issues.' },
                { emoji: '♿', title: 'Accessibility Risk', desc: 'People with visual, hearing, or motor disabilities may not be able to use your website, cutting you off from customers.' },
                { emoji: '📉', title: 'Reputation Risk', desc: 'An inaccessible website can damage your reputation and signal to customers that your business doesn\'t value everyone.' },
              ].map(c => (
                <div key={c.title} className="bg-red-50 rounded-xl p-6 border border-red-100 text-center">
                  <div className="text-3xl mb-3">{c.emoji}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">The Good News: It's Fixable</h3>
                  <p className="text-slate-600 mb-4">Most ADA website issues can be identified and fixed. We offer a free website review to identify problems, and a website rebuild service that brings your site into compliance.</p>
                  <Link to={createPageUrl('AdaAccessibility')}>
                    <button className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-lg transition-colors">
                      Request Your Free Website Review
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rebuild service CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-extrabold mb-4">Need a Full ADA-Compliant Website Rebuild?</h2>
            <p className="text-slate-300 mb-6">Our website rebuild service delivers a fully accessible, modern website built to ADA standards. Pricing from $1,500–$3,000.</p>
            <Link to={createPageUrl('AdaWebsiteRebuild')}>
              <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-lg transition-colors">
                Learn About Website Rebuilds →
              </button>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}