import React from 'react';

const STAGES = [
  {
    step: '01',
    label: 'Attention',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50 border-purple-100',
    textColor: 'text-purple-700',
    icon: '📺',
    items: ['CTV & Streaming TV', 'Video content', 'Social media', 'Reels & shorts'],
  },
  {
    step: '02',
    label: 'Discovery',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50 border-blue-100',
    textColor: 'text-blue-700',
    icon: '🔍',
    items: ['Google & Maps', 'AI search visibility', 'Local SEO', 'Voice search'],
  },
  {
    step: '03',
    label: 'Trust',
    color: 'bg-green-600',
    lightColor: 'bg-green-50 border-green-100',
    textColor: 'text-green-700',
    icon: '⭐',
    items: ['Website & branding', 'Reviews & testimonials', 'Helpful content', 'Case studies'],
  },
  {
    step: '04',
    label: 'Conversion',
    color: 'bg-orange-600',
    lightColor: 'bg-orange-50 border-orange-100',
    textColor: 'text-orange-700',
    icon: '📞',
    items: ['Calls & forms', 'Text & chat', 'Landing pages', 'CRM & follow-up'],
  },
  {
    step: '05',
    label: 'Follow-Up',
    color: 'bg-red-600',
    lightColor: 'bg-red-50 border-red-100',
    textColor: 'text-red-700',
    icon: '🔁',
    items: ['Email automation', 'SMS sequences', 'Retargeting', 'Content reminders'],
  },
];

export default function GrowthSystemSection() {
  return (
    <section className="py-20 px-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">The System</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Modern Local Business Growth System
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Most marketing companies sell one piece. NTA connects the whole journey.
          </p>
        </div>

        <div className="hidden lg:grid grid-cols-5 gap-4 mb-10">
          {STAGES.map((stage) => (
            <div key={stage.label} className={`rounded-2xl border p-6 ${stage.lightColor} h-full`}>
              <div className={`w-8 h-8 rounded-full ${stage.color} text-white text-xs font-black flex items-center justify-center mb-3`}>
                {stage.step}
              </div>
              <div className="text-2xl mb-2">{stage.icon}</div>
              <h3 className={`font-black text-lg mb-3 ${stage.textColor}`}>{stage.label}</h3>
              <ul className="space-y-1">
                {stage.items.map(item => (
                  <li key={item} className="text-slate-600 text-xs leading-relaxed flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:hidden space-y-4 mb-10">
          {STAGES.map((stage) => (
            <div key={stage.label} className={`rounded-2xl border p-5 ${stage.lightColor} flex gap-4 items-start`}>
              <div className={`w-8 h-8 rounded-full ${stage.color} text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {stage.step}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{stage.icon}</span>
                  <h3 className={`font-black text-base ${stage.textColor}`}>{stage.label}</h3>
                </div>
                <p className="text-slate-500 text-sm">{stage.items.join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Each stage feeds the next. When the full system runs together, local businesses stop relying on luck and start building consistent, compounding growth.
          </p>
        </div>
      </div>
    </section>
  );
}