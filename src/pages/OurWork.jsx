import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

const SITES = [
  {
    name: 'Johnson Heating & Air Conditioning',
    url: 'https://johnsonheatingandac.com/',
    location: 'Mason City, IA',
    industry: 'HVAC · Heating & Cooling',
    description: 'Website rebuild emphasizing emergency availability, social proof, and seasonal promotions. Structured to rank locally and convert visitors into booked service calls.',
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/2b82c0d3b_johnson.png',
  },
  {
    name: 'Monson Plumbing, Heating & Excavating',
    url: 'https://monsonplumbing.com/',
    location: 'Mason City, IA',
    industry: 'Plumbing · Heating · Excavating',
    description: 'Full website rebuild with clear service pages, fast mobile load, and prominent call-to-action on every page. Focused on getting homeowners to call or text fast.',
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/cd337086e_monson.png',
  },
  {
    name: 'Ladybug Travels – New Zealand Tour',
    url: '#',
    location: 'Senior Travel',
    industry: 'Travel · Tour Operator',
    description: 'Landing page built for a senior group travel tour to New Zealand. Focused on converting interested travelers with a clear itinerary, limited availability messaging, and a direct booking CTA.',
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/ce0acb58e_NewZealand.png',
  },
  {
    name: "Papa Everett's Pizza",
    url: 'https://pizzaclearlake.com/',
    location: 'Clear Lake, IA',
    industry: 'Restaurant · Pizza',
    description: 'Clean, mobile-first site with easy menu navigation, online ordering info, and local search presence. Built to help customers find hours, menu, and contact quickly.',
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/d33d47649_papaeveretts.png',
  },
  {
    name: 'Club Fitness – Fort Dodge',
    url: 'https://clubfitnessfd.com/',
    location: 'Fort Dodge, IA',
    industry: 'Fitness · Gym',
    description: "Website rebuild for Fort Dodge's only 18+ fitness and recovery center. Built to drive memberships with clear service pages, 24/7 access messaging, and an easy join flow.",
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/ba36be62f_generated_image.png',
  },
  {
    name: "Cattleman's Dining",
    url: 'https://cattleman-dining-green.base44.app',
    location: 'Belmond, IA',
    industry: 'Restaurant · Steakhouse',
    description: "Full website for North Iowa's steakhouse experience at Belmond Country Club. Menu, specials, private events, gallery, and a reserve-a-table CTA — built to make the drive worth it.",
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/8d2ddbc24_generated_image.png',
  },
  {
    name: 'Grandma Wendy Ladybug Travels',
    url: 'https://ladybug-travels-store-85d369b9.base44.app',
    location: 'Senior Travel',
    industry: 'Travel · Tour Operator',
    description: 'Fun, vibrant travel brand site for Grandma Wendy Ladybug — built to showcase group cruise and tour experiences, sell travel merch, and capture new travelers with a bold personality.',
    screenshot: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/1a80d03d7_generated_image.png',
  },
];

function SiteCard({ site }) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Screenshot */}
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative group overflow-hidden bg-slate-100 aspect-[16/9]"
      >
        {site.screenshot ? (
          <img
            src={site.screenshot}
            alt={`${site.name} website`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <p className="text-slate-400 text-sm font-medium">Screenshot coming soon</p>
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            Visit Site <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-lg font-black text-slate-900 leading-snug">{site.name}</h2>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-blue-600 hover:text-blue-500 mt-0.5"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-slate-500 mb-3">{site.location} · {site.industry}</p>
        <p className="text-slate-600 text-sm leading-relaxed flex-1">{site.description}</p>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-5 text-blue-600 hover:text-blue-500 font-semibold text-sm transition-colors"
        >
          View Live Site <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

import SEOHead from '@/components/shared/SEOHead';

export default function OurWork() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title="Portfolio | New Tech Advertising Work"
        description="See our work. AI-powered websites, social media campaigns, video production & marketing for small businesses. New Tech Advertising, Mason City IA."
      />
      <MarketingNav />

      {/* Header */}
      <section className="bg-slate-950 text-white pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Sites I've Built</h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Real local businesses with real websites — built to rank, convert, and make it easy for customers to take action.
          </p>
        </div>
      </section>

      {/* Site grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-8">
          {SITES.map(site => (
            <SiteCard key={site.name} site={site} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Want a site like these?</h2>
          <p className="text-slate-400 mb-7 max-w-xl">Start with a free review of what you currently have and I'll tell you what's working and what isn't.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              Get My Free Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              Call or Text: 641-420-8816
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}