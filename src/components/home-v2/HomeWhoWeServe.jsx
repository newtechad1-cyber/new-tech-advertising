import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Flame, Shovel, Leaf, Home, Heart, Truck } from 'lucide-react';

const INDUSTRIES = [
  { icon: Flame, label: 'HVAC Companies', desc: 'Seasonal campaigns, service pages, and follow-up for heating and cooling businesses.', href: '/services/website-rebuilds' },
  { icon: Wrench, label: 'Plumbers', desc: 'Emergency call pages, local SEO, and social content that bring in service calls.', href: '/services/website-rebuilds' },
  { icon: Shovel, label: 'Excavating & Grading', desc: 'Project-based lead gen, campaign pages, and before/after content for excavating businesses.', href: '/our-work' },
  { icon: Leaf, label: 'Lawn & Landscaping', desc: 'Spring and fall campaign pages, seasonal social content, and local visibility.', href: '/services/social-media-management' },
  { icon: Home, label: 'Home Service Providers', desc: 'Full lead systems for painters, remodelers, cleaners, and other home service pros.', href: '/services/website-rebuilds' },
  { icon: Heart, label: 'Care Businesses', desc: 'Trust-building websites and local SEO for care providers, assisted living, and health services.', href: '/gap-audit/example-hvac-mason-city' },
  { icon: Truck, label: 'Equipment & Service Businesses', desc: 'Lead pages, parts search, service area pages, and content for equipment dealers.', href: '/our-work' },
];

export default function HomeWhoWeServe() {
  return (
    <section className="py-20 px-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-3">Who This Is For</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Built for North Iowa Service Businesses</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We work with local service businesses that need more leads — not more marketing buzzwords. If you're a contractor, care provider, or local service company, this system was built for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {INDUSTRIES.map(ind => {
            const Icon = ind.icon;
            return (
              <Link
                key={ind.label}
                to={ind.href}
                className="bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-2xl p-5 flex flex-col gap-3 transition group"
              >
                <div className="w-9 h-9 bg-blue-600/20 border border-blue-700/50 rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1 group-hover:text-blue-300 transition">{ind.label}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{ind.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}