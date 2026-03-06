import React from 'react';
import { Clock, DollarSign, Calendar, BarChart2 } from 'lucide-react';

const painPoints = [
  { icon: Clock, title: 'Creating content regularly is time-consuming', desc: 'Hours spent writing captions, designing posts, and keeping up with trends.' },
  { icon: DollarSign, title: 'Video production is expensive', desc: 'Professional video costs thousands. Most businesses skip it entirely.' },
  { icon: Calendar, title: 'Social media posting is inconsistent', desc: 'Busy weeks mean missed posts. Inconsistency hurts visibility and trust.' },
  { icon: BarChart2, title: 'Advertising platforms are complicated', desc: 'Ads dashboards are built for agencies, not small business owners.' },
];

export default function PlatformProblem() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-5">
            Marketing Takes More Time Than Most Businesses Have
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Small business owners know marketing matters, but keeping up with content, social media, and advertising is difficult. Most businesses do not have the time, team, or tools to stay consistent.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {painPoints.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md">
            New Tech Advertising solves these problems with one AI-powered marketing platform.
          </div>
        </div>
      </div>
    </section>
  );
}