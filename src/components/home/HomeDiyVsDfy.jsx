import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, ArrowRight } from 'lucide-react';

const DIY = [
  'AI-generated posts every week',
  'Content calendar & scheduling',
  'AI Video Studio access',
  'Performance dashboard',
  'Brand profile & strategy setup',
  'Authority Plan (90-day strategy)',
  'You review and approve content',
  'Connect your own social accounts',
];

const DFY = [
  'Everything in DIY, plus:',
  'Dedicated marketing team',
  'We create, approve & post for you',
  'Monthly strategy calls',
  'Custom campaign planning',
  'Video production & editing',
  'ADA compliance & website services',
  'Priority support & account manager',
];

export default function HomeDiyVsDfy() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Two Ways to Win</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            DIY or Done-For-You — you choose
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Whether you want control or complete hands-off marketing, NTA has a track built for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DIY */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <span className="inline-block bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">DIY — Self-Service</span>
              <p className="text-4xl font-extrabold text-white">$99<span className="text-lg font-normal text-slate-400">/mo</span></p>
              <p className="text-slate-400 text-sm mt-1">You're in the driver's seat. AI handles the heavy lifting.</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {DIY.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to={createPageUrl('Get-Started')}
              className="w-full text-center bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-slate-600 text-xs text-center mt-3">14-day free trial · No credit card required</p>
          </div>

          {/* DFY */}
          <div className="bg-gradient-to-br from-violet-900/40 to-slate-900 border border-violet-500/40 rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
            </div>
            <div className="mb-6">
              <span className="inline-block bg-violet-800/50 text-violet-300 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">DFY — Done-For-You</span>
              <p className="text-4xl font-extrabold text-white">$399<span className="text-lg font-normal text-slate-400">/mo</span></p>
              <p className="text-slate-400 text-sm mt-1">We handle everything. You approve or relax.</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {DFY.map((item, i) => (
                <li key={item} className={`flex items-start gap-2.5 text-sm ${i === 0 ? 'text-violet-300 font-semibold' : 'text-slate-300'}`}>
                  {i > 0 && <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />}
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to={createPageUrl('Book-Call')}
              className="w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              Book Strategy Call <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-slate-600 text-xs text-center mt-3">Free consultation · No commitment</p>
          </div>
        </div>
      </div>
    </section>
  );
}