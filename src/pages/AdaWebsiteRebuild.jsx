import React from 'react';
import SiteHeader from '../components/marketing/SiteHeader';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, ShieldCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdaWebsiteRebuild() {
  return (
    <div className="bg-white">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-block bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              ADA Website Rebuild Service
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight max-w-3xl mx-auto">
              Get a Modern, ADA-Compliant Website Built for Your Business
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              We rebuild your website to meet ADA accessibility standards — protecting you from legal risk while giving you a professional, modern site that works for every customer.
            </p>
            <Link to={createPageUrl('AdaAccessibility')}>
              <button className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-lg text-base shadow-lg transition-colors">
                Request a Website Review
              </button>
            </Link>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">What's Included in the Rebuild</h2>
              <p className="text-slate-600">Every rebuild is done from the ground up with accessibility built in from day one.</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                'Full ADA WCAG 2.1 compliance',
                'Mobile-responsive design',
                'Proper alt text for all images',
                'Keyboard navigation support',
                'Accessible forms and inputs',
                'Color contrast standards met',
                'Video caption support',
                'Screen reader compatibility',
                'Modern professional design',
                'Fast page load speeds',
                'Google-friendly structure',
                'Business dashboard integration',
              ].map(f => (
                <div key={f} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm font-medium">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Transparent Pricing</h2>
              <p className="text-slate-600">No surprises. You'll know the full price before any work begins.</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-10 shadow-sm max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-6 h-6 text-blue-500" />
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">ADA Website Rebuild</p>
              </div>
              <p className="text-5xl font-extrabold text-slate-900 mb-2">$1,500–$3,000</p>
              <p className="text-slate-500 mb-8">Pricing depends on size and complexity of your current website.</p>

              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <p className="font-bold text-slate-900 text-sm mb-1">50% Deposit</p>
                  <p className="text-slate-600 text-sm">Paid at project kickoff to reserve your spot and begin work.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <p className="font-bold text-slate-900 text-sm mb-1">50% Upon Completion</p>
                  <p className="text-slate-600 text-sm">Final payment due when your new website is ready to launch.</p>
                </div>
              </div>

              <ul className="text-left space-y-2 mb-8">
                {['No surprise fees', 'You approve before launch', 'Includes one round of revisions', 'Milestone-based billing — no risk'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />{f}</li>
                ))}
              </ul>

              <Link to={createPageUrl('AdaAccessibility')}>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg text-base transition-colors shadow-md">
                  Request a Website Review
                </button>
              </Link>
              <p className="text-slate-400 text-xs mt-3">Free review — no obligation to purchase</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">How the Rebuild Process Works</h2>
            <div className="space-y-6">
              {[
                { n: 1, title: 'Request a Free Website Review', desc: 'We review your current site and identify all ADA compliance issues. No cost, no obligation.' },
                { n: 2, title: 'Receive Your Proposal', desc: 'We send a clear proposal with pricing, timeline, and exactly what will be done.' },
                { n: 3, title: 'Pay 50% Deposit', desc: 'Once you approve, a 50% deposit reserves your project and we begin building.' },
                { n: 4, title: 'Review Your New Website', desc: 'We show you the completed site for your review and approval before launch.' },
                { n: 5, title: 'Pay Final 50% & Launch', desc: 'Final payment triggers your site going live. Your new ADA-compliant website is ready.' },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-5 bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-extrabold text-sm shrink-0">{s.n}</div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">{s.title}</p>
                    <p className="text-slate-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <ShieldCheck className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Protect Your Business. Modernize Your Website.</h2>
            <p className="text-blue-100 mb-8">Request a free review today and find out exactly what needs to be fixed.</p>
            <Link to={createPageUrl('AdaAccessibility')}>
              <button className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-10 py-4 rounded-lg text-base shadow-lg transition-colors">
                Request Website Review →
              </button>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}