import React from 'react';

const features = [
  {
    icon: '🛒',
    title: 'Online Ordering',
    desc: 'Commission-free ordering page, branded to your restaurant, with real-time kitchen notifications'
  },
  {
    icon: '📋',
    title: 'Menu Management',
    desc: 'Update menu items, prices, photos, and daily specials from your phone in seconds'
  },
  {
    icon: '🌟',
    title: 'Review Management',
    desc: 'Monitor Google, Yelp, and Facebook reviews. Respond fast with smart templates'
  },
  {
    icon: '🔍',
    title: 'Local Visibility',
    desc: 'Show up in Google, AI assistants, and "near me" searches when hungry locals are looking'
  },
  {
    icon: '📧',
    title: 'Customer Follow-Up',
    desc: 'Build an email list from real orders. Send specials, events, and "we miss you" messages'
  },
  {
    icon: '⚡',
    title: 'Custom Features',
    desc: 'Table reservations, kitchen display, catering orders, loyalty programs — whatever you need'
  }
];

export default function RestFeatures() {
  return (
    <section id="features" className="bg-[#0B1120] py-20 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-amber-500 text-sm font-bold uppercase tracking-widest mb-3">
          WHAT YOU GET
        </p>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-16">
          Everything a Modern Restaurant Needs Online
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((feature, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/50 group-hover:bg-amber-500 transition-colors" />
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}