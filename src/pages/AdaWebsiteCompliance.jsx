import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';

export default function AdaWebsiteCompliance() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketingNav />

      {/* Hero */}
      <section className="py-24 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 text-sm font-semibold">Legal Protection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            ADA Website Compliance & Rebuild
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Protect your business from ADA website lawsuits while improving accessibility and usability for all visitors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={createPageUrl('Tools')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Check Your Website
            </Link>
            <Link
              to={createPageUrl('Book-Call')}
              className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">The Risk</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-rose-900/30 rounded-lg p-6">
              <AlertTriangle className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Lawsuit Exposure</h3>
              <p className="text-slate-300 text-sm">
                Over 2,000 ADA website accessibility lawsuits filed annually. Small businesses are prime targets.
              </p>
            </div>
            <div className="bg-slate-900 border border-rose-900/30 rounded-lg p-6">
              <AlertTriangle className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Legal Costs</h3>
              <p className="text-slate-300 text-sm">
                Average settlement: $5,000-$50,000+. Defense costs can exceed $100,000 even if you win.
              </p>
            </div>
            <div className="bg-slate-900 border border-rose-900/30 rounded-lg p-6">
              <AlertTriangle className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Brand Damage</h3>
              <p className="text-slate-300 text-sm">
                Failed accessibility lawsuits damage reputation and create negative publicity.
              </p>
            </div>
            <div className="bg-slate-900 border border-rose-900/30 rounded-lg p-6">
              <AlertTriangle className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Lost Customers</h3>
              <p className="text-slate-300 text-sm">
                Inaccessible websites exclude millions of people with disabilities from your services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Solution</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-violet-600/20 border border-violet-600 flex items-center justify-center">
                  <span className="text-violet-400 font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">ADA Website Audit</h3>
                <p className="text-slate-300">
                  We scan your website for WCAG compliance, color contrast, alt text, keyboard navigation, and more.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-violet-600/20 border border-violet-600 flex items-center justify-center">
                  <span className="text-violet-400 font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Accessibility Rebuild</h3>
                <p className="text-slate-300">
                  Our team remediates issues: semantic HTML, ARIA landmarks, alt text, form labels, color contrast fixes.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-violet-600/20 border border-violet-600 flex items-center justify-center">
                  <span className="text-violet-400 font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Compliance Verification</h3>
                <p className="text-slate-300">
                  We re-audit to verify WCAG AA compliance and provide documentation for legal protection.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-violet-600/20 border border-violet-600 flex items-center justify-center">
                  <span className="text-violet-400 font-bold">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Ongoing Monitoring</h3>
                <p className="text-slate-300">
                  We monitor your site and notify you of new accessibility issues as you update content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why It Matters</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Legal Protection</h3>
              <p className="text-slate-400 text-sm">
                Significantly reduce lawsuit risk with documented compliance.
              </p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Reach More Customers</h3>
              <p className="text-slate-400 text-sm">
                Accessible websites serve 1 in 4 Americans with disabilities.
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Better SEO</h3>
              <p className="text-slate-400 text-sm">
                Accessible sites rank better and improve search visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Learn More</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              to={createPageUrl('AdaWebsiteLawsuitPrevention')}
              className="group bg-slate-900 border border-slate-700 hover:border-violet-600/50 rounded-lg p-6 transition-all"
            >
              <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors mb-2">
                ADA Website Lawsuits Explained
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                What you need to know about ADA website compliance requirements and lawsuit trends.
              </p>
              <span className="text-violet-400 text-sm font-semibold">Read Article →</span>
            </Link>
            <Link
              to={createPageUrl('Home')}
              className="group bg-slate-900 border border-slate-700 hover:border-violet-600/50 rounded-lg p-6 transition-all"
            >
              <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors mb-2">
                WCAG Compliance Standards
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                A comprehensive guide to WCAG 2.1 accessibility standards and how to implement them.
              </p>
              <span className="text-violet-400 text-sm font-semibold">Learn More →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Is Your Website ADA Compliant?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Get a free accessibility audit and discover potential compliance risks.
          </p>
          <Link
            to={createPageUrl('Tools')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Start Your Free Audit
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}