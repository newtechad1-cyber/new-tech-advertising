import React from 'react';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import PillarHero from '@/components/templates/PillarHero';
import PillarSection from '@/components/templates/PillarSection';
import PillarCTA from '@/components/templates/PillarCTA';
import InternalLinks from '@/components/templates/InternalLinks';
import { BrainCircuit, Video, Tv, BarChart2, Globe, Zap, CheckCircle, Shield } from 'lucide-react';

const SYSTEM_LAYERS = [
  { icon: BrainCircuit, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'AI Content Engine', desc: 'Automatically generate brand-aligned social posts, captions, and campaign content from your business profile — every week.' },
  { icon: Video, color: 'text-pink-400', bg: 'bg-pink-500/10', label: 'AI Video Studio', desc: 'Turn scripts and ideas into professional marketing videos with AI avatars, voiceover, and branded overlays.' },
  { icon: Tv, color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Streaming TV Ads', desc: 'Run local TV commercials on Hulu, Roku, Paramount+, and 30+ streaming platforms — targeted to your exact service area.' },
  { icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Local SEO & Visibility', desc: 'Dominate Google Maps, local search, and voice search with consistent citations, reviews, and optimized profiles.' },
  { icon: BarChart2, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Performance Reporting', desc: 'AI-generated monthly reports with plain-English insights on reach, engagement, top posts, and strategic recommendations.' },
  { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'ADA Website Compliance', desc: 'Make sure your website is accessible and compliant with modern accessibility standards. Protect against lawsuits.' },
  { icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Done-For-You Option', desc: 'Not a DIY person? Our team runs everything — content creation, approvals, scheduling, and optimization. Zero effort from you.' },
];

const PROBLEMS = [
  { label: 'No time', desc: 'You\'re running your business — marketing falls off every week.' },
  { label: 'No team', desc: 'Hiring a marketer or agency costs more than most small businesses can afford.' },
  { label: 'No system', desc: 'You\'re using 5–10 tools that don\'t talk to each other and still get inconsistent results.' },
  { label: 'No clarity', desc: 'You don\'t know what\'s working, what to prioritize, or what to do next.' },
];

const OUTCOMES = [
  'More leads from social, search, and streaming TV',
  'A consistent online presence — even when you\'re busy',
  'Professional content without hiring a marketing team',
  'Measurable results tracked every month',
  'A system that grows with your business',
];

const RELATED = [
  { label: 'Platform', title: 'AI Marketing Platform', desc: 'See every tool in the platform', href: createPageUrl('AiMarketingPlatform') },
  { label: 'Service', title: 'Streaming TV Advertising', desc: 'Local TV ads on Hulu, Roku & more', href: createPageUrl('StreamingTV') },
  { label: 'Industries', title: 'Industry Marketing Systems', desc: 'Solutions built for your business type', href: createPageUrl('IndustriesHub') },
  { label: 'Tools', title: 'TV Commercial Script Generator', desc: 'Generate your first TV ad script free', href: createPageUrl('TvCommercialScriptGenerator') },
  { label: 'Pricing', title: 'Plans & Pricing', desc: 'From $99/mo DIY to full-service', href: createPageUrl('Pricing') },
  { label: 'Start', title: 'Start Free Trial', desc: 'No credit card required', href: createPageUrl('Get-Started') },
];

export default function GrowthSystem() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />

      <PillarHero
        badge="The Small Business Marketing System"
        heading="Marketing that actually works for small businesses"
        subheading="New Tech Advertising is not an agency. It's not just another tool. It's a complete marketing system built specifically for local service businesses — AI content, video, streaming TV, social media, and local SEO in one connected platform."
        primaryCta="Start Free Trial"
        primaryHref={createPageUrl('Get-Started')}
        secondaryCta="Generate My Free Plan"
        secondaryHref={createPageUrl('MarketingPlanGenerator')}
      />

      {/* What is the Growth System */}
      <PillarSection
        badge="System Overview"
        heading="One system. Every channel. Zero guesswork."
        subheading="Most small businesses piece together 5–10 different tools to run their marketing. The NTA Growth System replaces all of them with a single, AI-powered platform built for local businesses."
        dark
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SYSTEM_LAYERS.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{item.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </PillarSection>

      {/* Outcomes */}
      <PillarSection
        badge="Results"
        heading="What you get when the system is running"
        subheading="The Growth System is designed for one outcome: more customers from your marketing investment."
      >
        <div className="max-w-2xl mx-auto">
          <ul className="space-y-4">
            {OUTCOMES.map(o => (
              <li key={o} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-base">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </PillarSection>

      {/* DIY vs DFY */}
      <PillarSection badge="Options" heading="Use it yourself — or let us run it" dark>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">DIY Platform</p>
            <h3 className="text-white font-bold text-lg mb-2">You're in control</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Use our AI tools to create content, schedule posts, and track performance. Starting at $99/mo.</p>
          </div>
          <div className="bg-violet-900/20 border border-violet-700/40 rounded-2xl p-6">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Done For You</p>
            <h3 className="text-white font-bold text-lg mb-2">We handle everything</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our team creates, approves, and publishes all content for you. Monthly strategy calls included. Starting at $399/mo.</p>
          </div>
        </div>
      </PillarSection>

      <InternalLinks heading="Explore the System" links={RELATED} />

      <PillarCTA
        heading="Your growth system is waiting."
        subheading="Start your free 14-day trial. No credit card required."
      />

      <SiteFooter />
    </div>
  );
}