import React from 'react';
import { ArrowRight, Sparkles, Calendar, Video, BarChart2, Tv } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const pillars = [
  { icon: Sparkles, label: 'AI Content Creation', color: 'bg-purple-50 text-purple-600' },
  { icon: Calendar, label: 'Social Media Automation', color: 'bg-blue-50 text-blue-600' },
  { icon: Video, label: 'AI Video Studio', color: 'bg-pink-50 text-pink-600' },
  { icon: BarChart2, label: 'Analytics Dashboard', color: 'bg-green-50 text-green-600' },
  { icon: Tv, label: 'Streaming TV Campaigns', color: 'bg-orange-50 text-orange-600' },
];

export default function PlatformOverview() {
  return (
    <section className="bg-white py-20 lg:py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Platform Overview
        </div>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-5">
          One Platform. Total Marketing Control.
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed">
          The NTA platform combines AI content creation, social media automation, video production, analytics, and streaming TV advertising into one dashboard designed specifically for small businesses.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {pillars.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 text-center leading-tight">{label}</p>
            </div>
          ))}
        </div>

        <a
          href={TRIAL_URL}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
        >
          Start Free Trial <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}