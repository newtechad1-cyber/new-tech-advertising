import React from 'react';
import { CheckCircle, Video, Image, Calendar, Bell, Zap, Layout } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export function VideoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video placeholder */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow aspect-video flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">Why Video Works</p>
          </div>

          <div>
            <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">Video First</div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why Video Marketing Works</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">Video consistently produces higher engagement than text or images alone. Businesses using video see real results — and our platform makes it simple to create.</p>
            <ul className="space-y-3">
              {['Higher social media reach', 'Stronger audience engagement', 'Better brand recognition', 'More customer inquiries'].map(item => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    { icon: Zap, label: 'AI Caption Generation', desc: 'Write engaging captions in seconds with AI built for your business type.' },
    { icon: Image, label: 'Image Creation Tools', desc: 'Generate promotional images and social media graphics without a designer.' },
    { icon: Video, label: 'Short Marketing Videos', desc: 'Create promotional videos quickly — no editing experience needed.' },
    { icon: Layout, label: 'Content Calendar', desc: 'Plan your month of content in one simple dashboard view.' },
    { icon: Calendar, label: 'Post Scheduling', desc: 'Schedule posts to Facebook, Instagram, and LinkedIn ahead of time.' },
    { icon: Bell, label: 'Publishing Reminders', desc: 'Never miss a posting day with smart reminders.' },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">All-In-One Dashboard</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Create Marketing Content in One Dashboard</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Everything a business owner needs to create and publish content — without hiring a marketing team.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{label}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MediaCreationSection() {
  const items = [
    { emoji: '🖼️', label: 'Promotional Images', desc: 'Eye-catching graphics for sales, services, and announcements.' },
    { emoji: '📱', label: 'Social Media Graphics', desc: 'Sized and styled for Facebook, Instagram, and LinkedIn.' },
    { emoji: '🎬', label: 'Short Promotional Videos', desc: 'Quick clips that introduce your business or offer.' },
    { emoji: '🔦', label: 'Service Highlight Videos', desc: 'Show customers what you do and how you help.' },
    { emoji: '📅', label: 'Event Announcement Videos', desc: 'Promote sales, grand openings, or seasonal events.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">No Design Experience Needed</div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Create Images and Videos Without Design Experience</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">The platform generates professional-looking content so you can focus on running your business, not learning design software.</p>
            <ul className="space-y-3">
              {items.map(i => (
                <li key={i.label} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{i.emoji}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{i.label}</p>
                    <p className="text-slate-500 text-sm">{i.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Video placeholder */}
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl overflow-hidden shadow-xl aspect-video flex flex-col items-center justify-center gap-3 border border-purple-700">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p className="text-white/80 text-sm font-medium">Image & Video Creator Demo</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { n: 1, title: 'Create your free account', desc: 'Sign up in minutes. No credit card needed.' },
    { n: 2, title: 'Generate content with AI', desc: 'Answer a few questions about your business and get a full month of content ideas.' },
    { n: 3, title: 'Create images and videos', desc: 'Use the built-in tools to produce professional visuals instantly.' },
    { n: 4, title: 'Schedule your posts', desc: 'Set your calendar and let the platform handle posting reminders.' },
    { n: 5, title: 'Grow your visibility', desc: 'Stay consistent and watch your reach grow over time.' },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">How the Platform Works</h2>
          <p className="text-slate-400">Five simple steps to go from nothing to publishing.</p>
        </div>
        <div className="space-y-6">
          {steps.map(s => (
            <div key={s.n} className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-extrabold text-sm shrink-0 mt-0.5">{s.n}</div>
              <div>
                <p className="font-bold text-white mb-1">{s.title}</p>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href={TRIAL_URL} className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-lg text-base transition-colors shadow-lg">
            Start Your 7-Day Free Trial
          </a>
          <p className="text-slate-500 text-sm mt-3">No credit card required</p>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Simple, Transparent Pricing</h2>
          <p className="text-slate-600">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border-2 border-slate-200 p-8">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Starter</p>
            <p className="text-4xl font-extrabold text-slate-900 mb-1">$99<span className="text-lg font-normal text-slate-500">/mo</span></p>
            <p className="text-slate-600 text-sm mb-6">Everything you need to get started creating and scheduling content.</p>
            <ul className="space-y-2 mb-8">
              {['AI caption generation', 'Image creation tools', 'Content calendar', 'Post scheduling', 'Publishing reminders'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />{f}</li>
              ))}
            </ul>
            <a href={TRIAL_URL} className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
              Start Free Trial
            </a>
          </div>
          <div className="rounded-2xl border-2 border-blue-500 p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">Most Popular</div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Pro</p>
            <p className="text-4xl font-extrabold text-slate-900 mb-1">$199<span className="text-lg font-normal text-slate-500">/mo</span></p>
            <p className="text-slate-600 text-sm mb-6">Advanced tools for businesses that want to grow faster.</p>
            <ul className="space-y-2 mb-8">
              {['Everything in Starter', 'Short marketing videos', 'Service highlight videos', 'Multi-platform publishing', 'Priority support'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />{f}</li>
              ))}
            </ul>
            <a href={TRIAL_URL} className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
              Start Free Trial
            </a>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">Try the platform free for 7 days. No credit card required.</p>
      </div>
    </section>
  );
}

export function CtaBanner({ headline = 'Ready to start creating content?', sub = 'Join businesses already using the platform to grow their visibility.' }) {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{headline}</h2>
        <p className="text-blue-100 mb-8 text-base">{sub}</p>
        <a href={TRIAL_URL} className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-10 py-4 rounded-lg text-base shadow-lg transition-colors">
          Start Your 7-Day Free Trial →
        </a>
        <p className="text-blue-200/80 text-xs mt-3">No credit card required. Cancel anytime.</p>
      </div>
    </section>
  );
}