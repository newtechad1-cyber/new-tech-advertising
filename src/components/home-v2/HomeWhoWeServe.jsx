import React from 'react';

const SERVICES = [
  {
    title: 'Website Rebuild',
    desc: 'Fast, mobile-friendly, built to convert. We don\'t do templates — we build for your business and your market.',
    href: '/services/website-rebuilds',
    icon: '🌐',
  },
  {
    title: 'Local SEO Pages',
    desc: 'City + service pages that show up when someone searches your service in their town. Built and optimized by us.',
    href: '/seo-pages-for-local-businesses',
    icon: '📍',
  },
  {
    title: 'Seasonal Campaigns',
    desc: 'Spring tune-ups, fall cleanouts, holiday deals. Timely ads and landing pages that drive calls when demand is high.',
    href: '/seasonal-campaigns',
    icon: '📅',
  },
  {
    title: 'Social Media Content',
    desc: 'Weekly posts for Facebook and Google Business Profile — job photos, tips, promos. Consistent and local.',
    href: '/social-media-content-system',
    icon: '📲',
  },
  {
    title: 'AI Video Marketing',
    desc: '60-second branded videos that build trust and get clicks. Created with AI, edited for your business.',
    href: '/ai-video-marketing',
    icon: '🎬',
  },
  {
    title: 'Lead Follow-Up System',
    desc: 'Automated texts and emails that follow up with every new lead fast — so you stop losing jobs to slow response.',
    href: '/local-lead-systems',
    icon: '🔔',
  },
];

const INDUSTRIES = [
  { name: 'HVAC & Heating', icon: '🌡️' },
  { name: 'Plumbing & Septic', icon: '🔧' },
  { name: 'Excavating & Hauling', icon: '🚜' },
  { name: 'Lawn & Landscaping', icon: '🌿' },
  { name: 'Roofing & Siding', icon: '🏠' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Retail & Hardware', icon: '🛒' },
  { name: 'Home Care & Cleaning', icon: '🧹' },
  { name: 'Auto & Equipment', icon: '🔩' },
  { name: 'Medical & Dental', icon: '🏥' },
  { name: 'Restaurants & Food', icon: '🍽️' },
  { name: 'Any Local Service', icon: '📌' },
];

export default function HomeWhoWeServe() {
  return (
    <>
      {/* Services */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Services</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Everything you need to get found, get trusted, and get calls.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(s => (
              <a
                key={s.title}
                href={s.href}
                className="group border border-slate-100 hover:border-blue-200 hover:shadow-md rounded-2xl p-5 transition-all block"
              >
                <span className="text-2xl mb-3 block">{s.icon}</span>
                <h3 className="font-black text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-slate-950 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Who We Work With</p>
          <h2 className="text-3xl font-black text-white mb-3">Industries We Serve</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">If you serve North Iowa customers, we can build a lead system for you.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map(ind => (
              <div key={ind.name} className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-300 font-medium transition-colors">
                <span>{ind.icon}</span> {ind.name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}