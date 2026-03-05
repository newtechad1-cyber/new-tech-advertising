import React, { useState } from 'react';
import { Wrench, UtensilsCrossed, Store, CheckCircle, ArrowRight } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const INDUSTRIES = [
  {
    id: 'hvac',
    icon: Wrench,
    label: 'HVAC & Home Services',
    tagline: 'Keep your schedule full year-round',
    description: 'Generate seasonal promotions, maintenance reminders, and service call content automatically. Stay top of mind so homeowners call you first.',
    useCases: [
      'Seasonal tune-up promotions',
      'Before & after service visuals',
      'Emergency availability posts',
      'Monthly maintenance reminder campaigns',
      'Streaming TV ads for local reach',
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
    color: 'from-orange-500 to-red-600',
    accent: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'restaurant',
    icon: UtensilsCrossed,
    label: 'Restaurants & Food',
    tagline: 'Fill more seats with less effort',
    description: 'Show off your menu, daily specials, and events with professional-looking posts. Video content that makes people hungry — and makes them come in.',
    useCases: [
      'Daily special announcements',
      'Menu highlight videos',
      'Event & catering promotion',
      'Holiday & seasonal campaigns',
      'Behind-the-scenes kitchen content',
    ],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    color: 'from-amber-500 to-orange-600',
    accent: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'local',
    icon: Store,
    label: 'Local Businesses',
    tagline: 'Stand out in your neighborhood',
    description: 'Retailers, salons, gyms, medical offices, and every local business in between. Build awareness, drive foot traffic, and turn new customers into regulars.',
    useCases: [
      'Grand opening & anniversary promotions',
      'Customer testimonial posts',
      'Product or service spotlights',
      'Community involvement content',
      'Local streaming TV ad campaigns',
    ],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    color: 'from-blue-500 to-indigo-600',
    accent: 'bg-blue-100 text-blue-700',
  },
];

export default function HomeIndustries() {
  const [active, setActive] = useState('hvac');
  const industry = INDUSTRIES.find(i => i.id === active);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Built for Your Industry</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Marketing that actually fits your business
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            NTA is designed for the businesses that power local economies.
          </p>
        </div>

        {/* Industry tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {INDUSTRIES.map(ind => {
            const Icon = ind.icon;
            return (
              <button
                key={ind.id}
                onClick={() => setActive(ind.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold text-sm transition-all ${
                  active === ind.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" /> {ind.label}
              </button>
            );
          })}
        </div>

        {/* Detail card */}
        {industry && (
          <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            {/* Image */}
            <div className="relative min-h-72">
              <img
                src={industry.image}
                alt={industry.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-70`} />
              <div className="relative p-8 flex flex-col justify-end h-full">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3 ${industry.accent} self-start`}>
                  <industry.icon className="w-4 h-4" /> {industry.label}
                </div>
                <p className="text-white text-2xl font-extrabold">{industry.tagline}</p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-slate-50 p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">{industry.description}</p>
              <ul className="space-y-2 mb-8">
                {industry.useCases.map(uc => (
                  <li key={uc} className="flex items-center gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {uc}
                  </li>
                ))}
              </ul>
              <a
                href={TRIAL_URL}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}