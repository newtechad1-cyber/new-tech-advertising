import React, { useState } from 'react';
import { Captions, Video, Image, Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const TOOLS = [
  {
    id: 'captions',
    icon: Captions,
    color: 'bg-blue-600',
    light: 'bg-blue-50 text-blue-700',
    title: 'AI Captions',
    short: 'Write post captions in seconds',
    description: 'Tell the AI your goal — promotion, awareness, or engagement — and it writes platform-ready captions for Facebook, Instagram, and LinkedIn. Includes hashtags and call-to-action.',
    bullets: ['Brand-voice trained', 'Platform-specific formatting', 'Hashtag suggestions included', 'One-click copy to post'],
  },
  {
    id: 'video',
    icon: Video,
    color: 'bg-purple-600',
    light: 'bg-purple-50 text-purple-700',
    title: 'Video Creation',
    short: 'Professional videos without a crew',
    description: 'Generate video ads from a script. Choose an avatar, add your voiceover, drop in your brand assets, and export a ready-to-post video in minutes.',
    bullets: ['AI avatars & voiceover', 'Script to video automation', 'Streaming TV-ready formats', 'Logo & brand overlay'],
  },
  {
    id: 'images',
    icon: Image,
    color: 'bg-emerald-600',
    light: 'bg-emerald-50 text-emerald-700',
    title: 'Image Generation',
    short: 'Scroll-stopping visuals on demand',
    description: 'Generate custom images from a text prompt or pick from branded templates. Every image is sized correctly for each platform.',
    bullets: ['AI image generation', 'Branded templates', 'Sized per platform automatically', 'Instant download'],
  },
  {
    id: 'calendar',
    icon: Calendar,
    color: 'bg-orange-500',
    light: 'bg-orange-50 text-orange-700',
    title: 'Content Calendar',
    short: 'Plan a month of content in minutes',
    description: 'Your AI builds a full content calendar based on your business goals. Every post is drafted and ready — all you do is approve.',
    bullets: ['Auto-generated monthly calendar', 'Goal-based content planning', 'Approval workflow', 'Edit before publish'],
  },
  {
    id: 'scheduling',
    icon: Clock,
    color: 'bg-slate-700',
    light: 'bg-slate-100 text-slate-700',
    title: 'Post Scheduling',
    short: 'Set it and forget it',
    description: 'Connect Facebook, Instagram, and LinkedIn. Schedule posts to go out automatically — days, weeks, or a full month in advance.',
    bullets: ['Multi-platform publishing', 'Auto-schedule by best time', 'Queue management', 'Publish or manual-post modes'],
  },
];

export default function HomePlatform() {
  const [active, setActive] = useState('captions');
  const tool = TOOLS.find(t => t.id === active);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">The Platform</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Every marketing tool you need,<br className="hidden md:block" /> in one place
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            No subscriptions to five different tools. No copy-pasting between apps. Just one platform that does it all.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-3 mb-10">
          {TOOLS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 ${
                  active === t.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active === t.id ? t.color : 'bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${active === t.id ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <span className={`text-sm font-semibold ${active === t.id ? 'text-blue-700' : 'text-slate-700'}`}>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {tool && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden grid lg:grid-cols-2">
            <div className="p-10">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${tool.light}`}>
                <tool.icon className="w-4 h-4" /> {tool.title}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{tool.short}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{tool.description}</p>
              <ul className="space-y-2 mb-8">
                {tool.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <a
                href={TRIAL_URL}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Try It Free <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-10 min-h-64">
              <div className={`w-24 h-24 rounded-2xl ${tool.color} flex items-center justify-center shadow-2xl`}>
                <tool.icon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}