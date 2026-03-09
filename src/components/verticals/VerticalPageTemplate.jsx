import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { CheckCircle, ArrowRight, Star, Zap, BarChart2, Share2, Video, Search } from 'lucide-react';

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

export default function VerticalPageTemplate({ data }) {
  const {
    industry,
    headline,
    subheadline,
    heroImage,
    stats,
    contentExamples,
    features,
    testimonial,
    color,
  } = data;

  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: color }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest mb-4 block" style={{ color }}>
                {industry} Marketing
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                {headline}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl('Get-Started')}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to={createPageUrl('Book-Call')}
                  className="border border-slate-700 hover:border-slate-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                  Book Demo
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-3xl font-extrabold text-white mb-1" style={{ color }}>{s.value}</p>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Examples */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              AI-Generated {industry} Content Examples
            </h2>
            <p className="text-slate-400">Real examples of posts our AI creates for {industry.toLowerCase()} businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {contentExamples.map((ex, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: color }}>{industry[0]}</div>
                  <div>
                    <p className="text-white text-sm font-semibold">{ex.companyName}</p>
                    <p className="text-slate-500 text-xs">{ex.platform}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{ex.caption}</p>
                {ex.hashtags && <p className="text-blue-400 text-xs">{ex.hashtags}</p>}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">❤️ {ex.likes} likes</span>
                  <span className="text-xs text-slate-500">💬 {ex.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Everything {industry} businesses need to grow online
              </h2>
              <p className="text-slate-400 mb-8">
                Our AI platform handles your marketing automatically — so you can focus on running your business.
              </p>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                      <f.icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{f.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(PLAN_FEATURES).map(([name, feats], i) => (
                <div key={name} className={`rounded-2xl p-5 border ${i === 1 ? 'border-violet-500/40 bg-violet-900/10' : 'border-slate-800 bg-slate-900'}`}>
                  {i === 1 && <span className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2 block">Most Popular</span>}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-bold">{name}</p>
                    <p className="text-slate-300 font-bold">{feats[feats.length - 1]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feats.slice(0, -1).map(f => (
                      <span key={f} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Link to={createPageUrl('Pricing')}
                className="block text-center text-violet-400 hover:text-violet-300 text-sm underline">
                View full plan comparison →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {testimonial && (
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <blockquote className="text-xl text-white font-medium leading-relaxed mb-4">
              "{testimonial.quote}"
            </blockquote>
            <p className="text-slate-400 text-sm">— {testimonial.author}, {testimonial.company}</p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start growing your {industry.toLowerCase()} business today
          </h2>
          <p className="text-slate-400 mb-8">7-day free trial. No credit card required. Cancel anytime.</p>
          <Link to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/20 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Starter plan from $197/mo after trial</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}