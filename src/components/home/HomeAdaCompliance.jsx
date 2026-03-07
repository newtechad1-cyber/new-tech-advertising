import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, AlertTriangle, Users, TrendingUp } from 'lucide-react';

export default function HomeAdaCompliance() {
  return (
    <section className="py-20 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 text-sm font-semibold">Legal Protection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Protect Your Business from ADA Website Lawsuits
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              Small businesses are increasingly facing ADA website accessibility lawsuits. New Tech Advertising helps you rebuild accessible websites, improve usability, and protect against compliance risks.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Free accessibility audit for your website',
                'Identify WCAG compliance issues before they become lawsuits',
                'Professional remediation to achieve ADA compliance',
                'Ongoing monitoring to catch new issues',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to={createPageUrl('Tools')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Check Your Website
            </Link>
          </div>

          {/* Right: Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <span className="text-3xl font-bold text-white">2,000+</span>
              </div>
              <p className="text-slate-300">ADA website lawsuits filed annually</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-bold text-white">$50K+</span>
              </div>
              <p className="text-slate-300">Average settlement cost</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">1 in 4</span>
              </div>
              <p className="text-slate-300">Americans have disabilities — make your site accessible</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-white">+30%</span>
              </div>
              <p className="text-slate-300">Better SEO with accessible websites</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}