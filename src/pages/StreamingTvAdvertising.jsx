import React from 'react';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import PillarHero from '@/components/templates/PillarHero';
import PillarSection from '@/components/templates/PillarSection';
import PillarCTA from '@/components/templates/PillarCTA';
import InternalLinks from '@/components/templates/InternalLinks';
import { Tv, Target, MapPin, DollarSign, TrendingUp, PlayCircle, CheckCircle } from 'lucide-react';

const PLATFORMS = [
  'Hulu', 'Roku', 'Paramount+', 'Pluto TV', 'Tubi', 'Amazon Fire TV',
  'ESPN+', 'Discovery+', 'Peacock', 'Samsung TV+', 'LG Channels', 'DIRECTV Stream'
];

const HOW_IT_WORKS = [
  { step: '01', label: 'Write Your Script', desc: 'Use our AI script generator to create a 15 or 30-second commercial script tailored to your business and service area.' },
  { step: '02', label: 'Produce the Ad', desc: 'Our team produces your TV commercial using AI video technology, branded graphics, and professional voiceover.' },
  { step: '03', label: 'Target Your Area', desc: 'We set up precise geographic targeting — your ads only run in your service zip codes and surrounding areas.' },
  { step: '04', label: 'Launch & Track', desc: 'Your ad goes live across 30+ streaming platforms. Track impressions, completions, and conversions in your dashboard.' },
];

const WHY_CTV = [
  'Reach cord-cutters who no longer watch traditional TV',
  'Target by zip code, household income, and behavior',
  'Video ads with completion rates of 90%+',
  'Fraction of the cost of traditional broadcast TV',
  'Measurable results — not just "impressions"',
  'Run alongside social and search for full-funnel coverage',
];

const RELATED = [
  { label: 'Tool', title: 'TV Commercial Script Generator', desc: 'Generate your ad script in 60 seconds', href: createPageUrl('TvCommercialScriptGenerator') },
  { label: 'System', title: 'The NTA Growth System', desc: 'How streaming TV fits the bigger picture', href: createPageUrl('GrowthSystem') },
  { label: 'Industry', title: 'HVAC Marketing System', desc: 'Streaming TV for home service businesses', href: createPageUrl('HvacIndustry') },
  { label: 'Platform', title: 'AI Marketing Platform', desc: 'All tools in one place', href: createPageUrl('AiMarketingPlatform') },
  { label: 'Demo', title: 'See a Sample Commercial', desc: 'Watch an example streaming TV ad', href: createPageUrl('StreamingTV') },
  { label: 'Start', title: 'Get Started', desc: 'Launch your first streaming TV campaign', href: createPageUrl('Get-Started') },
];

export default function StreamingTvAdvertising() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />

      <PillarHero
        badge="Streaming TV Advertising"
        heading="Local TV ads on Hulu, Roku, and 30+ streaming platforms"
        subheading="Put your business on the same screen as Netflix, Hulu, and Prime Video. Streaming TV advertising gives small businesses the reach of broadcast TV — with the precision targeting of digital ads."
        primaryCta="Generate My TV Script"
        primaryHref={createPageUrl('TvCommercialScriptGenerator')}
        secondaryCta="See Pricing"
        secondaryHref={createPageUrl('Pricing')}
      />

      {/* Platforms */}
      <PillarSection badge="Where Your Ads Run" heading="30+ streaming platforms. One campaign." dark>
        <div className="flex flex-wrap gap-3 justify-center">
          {PLATFORMS.map(p => (
            <span key={p} className="bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium px-4 py-2 rounded-full">{p}</span>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">Your ads run across all platforms simultaneously from one campaign setup.</p>
      </PillarSection>

      {/* Why CTV */}
      <PillarSection badge="Why Streaming TV" heading="Why smart small businesses are moving to CTV">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {WHY_CTV.map(item => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </PillarSection>

      {/* How It Works */}
      <PillarSection badge="How It Works" heading="From script to live TV ad in days — not months" dark>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="text-3xl font-extrabold text-violet-500/30 mb-3">{step.step}</div>
              <h3 className="text-white font-bold text-base mb-2">{step.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </PillarSection>

      {/* Pricing teaser */}
      <PillarSection badge="Pricing" heading="Included in Total Reach — or as a standalone add-on">
        <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm mb-4">Streaming TV advertising is included in our <span className="text-white font-semibold">Total Reach</span> plan at $899/mo, or available as a standalone campaign package.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={createPageUrl('Get-Started')} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">Start Free Trial</a>
            <a href={createPageUrl('Book-Call')} className="border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all text-sm">Book a Call</a>
          </div>
        </div>
      </PillarSection>

      <InternalLinks heading="Related Resources" links={RELATED} />

      <PillarCTA
        heading="Ready to run your first TV ad?"
        subheading="Generate your script in 60 seconds — then we'll take it from there."
        primaryText="Generate My TV Script"
        primaryHref={createPageUrl('TvCommercialScriptGenerator')}
      />

      <SiteFooter />
    </div>
  );
}