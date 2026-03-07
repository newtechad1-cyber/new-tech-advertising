import React from 'react';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import PillarHero from '@/components/templates/PillarHero';
import PillarSection from '@/components/templates/PillarSection';
import PillarCTA from '@/components/templates/PillarCTA';
import InternalLinks from '@/components/templates/InternalLinks';
import { Wrench, CheckCircle, TrendingUp, Calendar, Tv, BrainCircuit } from 'lucide-react';

const PROBLEMS = [
  'Slow seasons that kill cash flow',
  'Competitors outranking you on Google',
  'No time to post consistently on social media',
  'Expensive leads from lead gen sites like HomeAdvisor',
  'No brand recognition in your service area',
  'Customers calling competitors they "just saw"',
];

const STRATEGIES = [
  { icon: BrainCircuit, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'AI Social Content', desc: 'Automatic weekly posts about seasonal tune-ups, energy savings, and promotions — all branded to your company.' },
  { icon: Tv, color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Streaming TV Ads', desc: 'Run local TV ads during the shoulder season to book installs and service calls before the peak rush.' },
  { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Local SEO Dominance', desc: 'Optimize your Google Business profile and local citations so you show up first when someone searches "HVAC near me."' },
  { icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Seasonal Campaigns', desc: 'Pre-built campaign calendars for spring tune-up season, summer AC season, fall furnace checks, and winter emergency calls.' },
];

const CONTENT_ANGLES = [
  '"5 signs your HVAC system needs a tune-up"',
  '"How to lower your energy bill this summer"',
  '"What to do when your AC stops working"',
  '"Why spring is the best time to replace your furnace"',
  '"Local HVAC company vs national chains — what\'s the difference?"',
  '"How much does a new HVAC system cost in [City]?"',
];

const RELATED = [
  { label: 'Playbook', title: 'HVAC Marketing Playbook', desc: 'Complete guide to HVAC marketing', href: createPageUrl('HvacMarketing') },
  { label: 'Tool', title: 'Marketing Plan Generator', desc: 'Build your HVAC marketing plan in minutes', href: createPageUrl('MarketingPlanGenerator') },
  { label: 'Tool', title: 'TV Commercial Script Generator', desc: 'Create a streaming TV ad for your HVAC business', href: createPageUrl('TvCommercialScriptGenerator') },
  { label: 'Service', title: 'Streaming TV Advertising', desc: 'Run local TV ads on Hulu and Roku', href: createPageUrl('StreamingTvAdvertising') },
  { label: 'Service', title: 'Social Media Management', desc: 'Done-for-you social posting', href: createPageUrl('SocialMediaManagement') },
  { label: 'Start', title: 'Start Free Trial', desc: 'Launch your HVAC marketing system today', href: createPageUrl('Get-Started') },
];

export default function HvacIndustry() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />

      <PillarHero
        badge="HVAC Marketing System"
        heading="More service calls. More installs. Less slow season."
        subheading="HVAC companies that use the NTA Growth System fill their schedule year-round with AI-powered social media, streaming TV ads, and local SEO — without spending hours on marketing."
        primaryCta="Build My Marketing Plan"
        primaryHref={createPageUrl('MarketingPlanGenerator')}
        secondaryCta="Book a Strategy Call"
        secondaryHref={createPageUrl('Book-Call')}
      />

      {/* Problems */}
      <PillarSection badge="The Problem" heading="Why most HVAC companies struggle with marketing" dark>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {PROBLEMS.map(p => (
            <div key={p} className="flex items-start gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
              <span className="text-slate-300 text-sm">{p}</span>
            </div>
          ))}
        </div>
      </PillarSection>

      {/* Strategies */}
      <PillarSection badge="The Solution" heading="Your complete HVAC marketing system">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STRATEGIES.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{s.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </PillarSection>

      {/* Content angles */}
      <PillarSection badge="Content Strategy" heading="What we post for HVAC companies" subheading="Your AI content engine generates posts like these every week — keeping your business top of mind year-round." dark>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {CONTENT_ANGLES.map(a => (
            <div key={a} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-300 text-sm italic">{a}</p>
            </div>
          ))}
        </div>
      </PillarSection>

      <InternalLinks heading="HVAC Marketing Resources" links={RELATED} />

      <PillarCTA
        heading="Start marketing your HVAC business the right way."
        subheading="Generate your custom HVAC marketing plan in minutes — free."
        primaryText="Build My Marketing Plan"
        primaryHref={createPageUrl('MarketingPlanGenerator')}
      />

      <SiteFooter />
    </div>
  );
}