import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Play, Zap, CheckCircle, BrainCircuit, Video, Tv, Share2 } from 'lucide-react';

const CAPABILITIES = [
  { icon: BrainCircuit, label: 'AI Content Creation' },
  { icon: Video, label: 'Video Marketing' },
  { icon: Share2, label: 'Social Media Automation' },
  { icon: Tv, label: 'Streaming TV Advertising' },
];

const TRUST_ITEMS = [
  'No contracts', 'Cancel anytime', 'Setup in 48 hours', 'Free 14-day trial',
];

export default function HomeHero() {
  return (
    <section className="relative bg-slate-950 overflow-hidden pt-20 pb-0">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            Built for Small Businesses
          </span>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            The Small Business
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Marketing System
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Create content, videos, social media campaigns, and even streaming TV ads from one platform built for small businesses. Use it yourself or let us run it for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to={createPageUrl('Get-Started')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-105"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={createPageUrl('AiMarketingPlatform')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all backdrop-blur-sm"
            >
              <Play className="w-4 h-4 fill-white" /> Watch Demo
            </Link>
          </div>

          {/* Capability badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {CAPABILITIES.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-full">
                <Icon className="w-3.5 h-3.5 text-violet-400" />
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            {TRUST_ITEMS.map(item => (
              <span key={item} className="flex items-center gap-1.5 text-slate-400 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-14 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="bg-slate-900 border border-slate-700 rounded-t-2xl overflow-hidden shadow-2xl shadow-violet-900/20">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-slate-400 text-xs text-center max-w-xs mx-auto">
                app.newtechadvertising.com/dashboard
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950">
              {[
                { label: 'Posts Scheduled', value: '24', sub: 'This month', color: 'text-violet-400' },
                { label: 'Avg. Reach', value: '4,820', sub: '+18% vs last month', color: 'text-cyan-400' },
                { label: 'Content Items', value: '96', sub: 'AI-generated', color: 'text-green-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.sub}</p>
                </div>
              ))}
              <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wide">Upcoming Posts This Week</p>
                <div className="space-y-2">
                  {[
                    { platform: 'Facebook', caption: '🔥 Don\'t miss our spring sale — 20% off all services this week only!', status: 'Scheduled', color: 'bg-blue-600' },
                    { platform: 'Instagram', caption: '✨ Behind the scenes at our team meetup. Real people, real results.', status: 'Approved', color: 'bg-pink-600' },
                    { platform: 'LinkedIn', caption: '📈 How we helped a local HVAC company grow their social reach by 340%...', status: 'Draft', color: 'bg-sky-600' },
                  ].map((post, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className={`${post.color} text-white px-2 py-0.5 rounded font-medium text-[10px] w-20 text-center flex-shrink-0`}>{post.platform}</span>
                      <span className="text-slate-400 truncate flex-1">{post.caption}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${post.status === 'Scheduled' ? 'bg-green-900 text-green-300' : post.status === 'Approved' ? 'bg-violet-900 text-violet-300' : 'bg-slate-800 text-slate-400'}`}>{post.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-950" />
        </div>
      </div>
    </section>
  );
}