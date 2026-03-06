import React from 'react';
import { CheckCircle, Sparkles, Calendar, Video, BarChart2, Tv } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    heading: 'AI Content Creation',
    body: 'Generate marketing content in minutes. Create social captions, campaign copy, blog ideas, and promotional messaging without starting from scratch.',
    bullets: ['Social media captions', 'Promotional messages', 'Blog and content ideas', 'Campaign copy'],
    callout: 'Never run out of marketing ideas.',
    color: 'from-purple-500 to-indigo-600',
    mockBg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    mockContent: (
      <div className="space-y-3 p-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
          <p className="text-xs text-purple-500 font-semibold mb-2">AI Generated Caption</p>
          <p className="text-slate-700 text-sm leading-relaxed">"Ready to transform your home this spring? Our team is booking fast — get your free estimate today and see why local homeowners trust us."</p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">#HomeImprovement</span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">#LocalBusiness</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['Blog Ideas', 'Ad Copy', 'Email Subject', 'Promo Message'].map(t => (
            <div key={t} className="bg-white border border-purple-100 rounded-lg px-3 py-2 text-xs text-slate-600 font-medium text-center shadow-sm">{t}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Calendar,
    heading: 'Social Media Automation',
    body: 'Create and schedule posts across platforms from one dashboard. Plan content once and keep your business visible everywhere your customers scroll.',
    bullets: ['Schedule posts in advance', 'Manage multiple platforms', 'Keep posting consistent', 'Organize content with a calendar'],
    callout: null,
    badges: ['Facebook', 'Instagram', 'TikTok', 'Google Business', 'YouTube'],
    color: 'from-blue-500 to-cyan-600',
    mockBg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    mockContent: (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-blue-50 bg-blue-600 text-white text-xs font-bold">Content Calendar — March 2025</div>
          <div className="grid grid-cols-7 text-center text-xs text-slate-400 px-2 pt-2 pb-1 border-b">
            {['S','M','T','W','T','F','S'].map((d,i) => <span key={i}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1 p-2">
            {Array.from({length: 31}, (_, i) => i + 1).map(d => (
              <div key={d} className={`aspect-square flex items-center justify-center text-xs rounded-md font-medium ${[3,6,10,13,17,20,24,27,31].includes(d) ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Video,
    heading: 'AI Video Studio',
    body: 'Turn ideas into professional marketing videos with AI-powered scripts, visuals, and voice support. Create short-form videos, ads, and promotional content faster.',
    bullets: ['AI video scripts', 'Image-to-video creation', 'Voiceover support', 'Social media video formats'],
    callout: 'Video marketing without expensive production.',
    color: 'from-pink-500 to-rose-600',
    mockBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    mockContent: (
      <div className="p-6 space-y-3">
        <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 to-rose-900/40" />
          <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1" />
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-black/40 rounded-lg px-3 py-1.5">
            <div className="h-1 bg-white/30 rounded-full"><div className="h-1 bg-pink-400 rounded-full w-2/5" /></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['9:16', '16:9', '1:1'].map(f => (
            <div key={f} className="bg-white border border-pink-100 rounded-lg text-xs font-semibold text-center py-2 text-slate-600 shadow-sm">{f}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: BarChart2,
    heading: 'Analytics Dashboard',
    body: 'See what content is working, what campaigns are performing, and where your engagement is growing — all in one place.',
    bullets: ['Engagement tracking', 'Audience growth', 'Campaign results', 'Content performance'],
    callout: 'Know what drives results.',
    color: 'from-green-500 to-emerald-600',
    mockBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    mockContent: (
      <div className="p-6 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[['Reach', '12,450', '+18%'], ['Engagement', '3.2%', '+6%'], ['Followers', '847', '+43'], ['Posts', '24', 'this mo']].map(([l,v,s]) => (
            <div key={l} className="bg-white rounded-lg border border-green-100 p-3 shadow-sm">
              <p className="text-xs text-slate-500">{l}</p>
              <p className="text-lg font-bold text-slate-800">{v}</p>
              <p className="text-xs text-green-600 font-medium">{s}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-green-100 p-3 shadow-sm">
          <div className="flex items-end gap-1 h-12">
            {[30, 55, 42, 70, 48, 85, 63].map((h, i) => (
              <div key={i} className="flex-1 bg-green-500 rounded-sm opacity-70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Tv,
    heading: 'Streaming TV Campaigns',
    body: 'Go beyond social media and reach customers on streaming platforms with targeted TV-style advertising campaigns.',
    bullets: ['Streaming TV campaign setup', 'Audience targeting', 'Coordinated campaign messaging', 'Performance reporting'],
    callout: 'Combine social media and streaming TV for total reach marketing.',
    badges: ['Roku', 'Hulu', 'Fire TV', 'Samsung TV', 'Streaming Apps'],
    color: 'from-orange-500 to-amber-600',
    mockBg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    mockContent: (
      <div className="p-6 space-y-3">
        <div className="bg-slate-900 rounded-xl p-4 shadow-md">
          <p className="text-white text-xs font-semibold mb-3">Active Campaigns</p>
          {[['Spring Promo', 'Running', '12,400 impressions'], ['Brand Awareness', 'Scheduled', 'Starts Apr 1']].map(([n, s, d]) => (
            <div key={n} className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white text-xs font-medium">{n}</p>
                <p className="text-slate-400 text-xs">{d}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s === 'Running' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Roku', 'Hulu', 'Fire TV'].map(p => (
            <span key={p} className="text-xs bg-white border border-orange-100 text-slate-600 px-2 py-1 rounded-full shadow-sm font-medium">{p}</span>
          ))}
        </div>
      </div>
    ),
  },
];

export default function PlatformFeatures() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {features.map(({ icon: Icon, heading, body, bullets, callout, badges, color, mockBg, mockContent }, index) => (
          <div key={heading} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            {/* Text */}
            <div className={index % 2 !== 0 ? 'lg:order-2' : ''}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-4">{heading}</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-5">{body}</p>
              <ul className="space-y-2.5 mb-5">
                {bullets.map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              {badges && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {badges.map(badge => (
                    <span key={badge} className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full shadow-sm">{badge}</span>
                  ))}
                </div>
              )}
              {callout && (
                <div className="inline-block bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm px-4 py-2 rounded-lg">
                  {callout}
                </div>
              )}
            </div>

            {/* Visual */}
            <div className={index % 2 !== 0 ? 'lg:order-1' : ''}>
              <div className={`rounded-2xl overflow-hidden border border-slate-200 shadow-xl ${mockBg}`}>
                {mockContent}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}