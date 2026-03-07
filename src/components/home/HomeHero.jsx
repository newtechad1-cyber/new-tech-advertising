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
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/b24330cf3_backgroundimage.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
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
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/c74887154_generated_image.png"
              alt="NTA Dashboard — Website Management, Social Media, CRM, AI Content Engine"
              className="w-full block"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-950" />
        </div>
      </div>
    </section>
  );
}