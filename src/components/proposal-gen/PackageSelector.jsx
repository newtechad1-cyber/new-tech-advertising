import React from 'react';
import { CheckCircle2, Star, Zap, Crown } from 'lucide-react';

export const PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter Visibility Package',
    tagline: 'Get found. Get reviews. Get going.',
    icon: Zap,
    color: '#3b82f6',
    setup: 1497,
    monthly: 997,
    ideal: 'New to digital marketing or replacing underperforming agency',
    deliverables: [
      '30 content pieces/month (blogs, social, email)',
      'Google Business Profile optimization',
      'Review generation system',
      'Monthly performance report',
      'Basic website SEO + local citations',
      'Social media posting (FB + IG)',
    ],
    positioning: 'Establish your digital foundation and start attracting local customers consistently.',
  },
  authority: {
    id: 'authority',
    name: 'Market Authority Package',
    tagline: 'Own your market. Be the obvious choice.',
    icon: Star,
    color: '#8b5cf6',
    setup: 2497,
    monthly: 1997,
    ideal: 'Ready to dominate local search and outpace competitors',
    badge: 'Most Popular',
    deliverables: [
      '60 content pieces/month (full omnichannel)',
      'Authority website build & management',
      'Video content production (4 videos/month)',
      'Streaming TV commercial + distribution',
      'Advanced local SEO + link authority',
      'Lead tracking + CRM integration',
      'Bi-weekly strategy calls',
      'Competitor gap analysis & monitoring',
    ],
    positioning: 'Become the recognized authority in your market — the business everyone mentions when asked for a recommendation.',
  },
  domination: {
    id: 'domination',
    name: 'Market Domination Package',
    tagline: 'Total visibility. Total authority. Total market control.',
    icon: Crown,
    color: '#f59e0b',
    setup: 3997,
    monthly: 3497,
    ideal: 'Multi-location or aggressive growth target',
    deliverables: [
      'Unlimited content production',
      'Premium authority website + location pages',
      '8+ videos/month + TV commercial series',
      'Full streaming TV + OTT campaign',
      'Aggressive SEO + reputation domination',
      'AI-powered lead scoring + follow-up',
      'Weekly executive reporting + strategy',
      'Dedicated account strategist',
      'Competitor displacement campaigns',
      'Referral activation system',
    ],
    positioning: 'This is for businesses ready to own their category. Complete market saturation — online, on TV, and in every conversation.',
  },
};

export default function PackageSelector({ selectedPackage, setSelectedPackage }) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Select Package</p>
      {Object.values(PACKAGES).map((pkg) => {
        const Icon = pkg.icon;
        const sel = selectedPackage === pkg.id;
        return (
          <button
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
              sel ? 'shadow-lg' : 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600'
            }`}
            style={sel ? { borderColor: pkg.color, background: `${pkg.color}0d` } : {}}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${pkg.color}22` }}>
                <Icon className="w-4 h-4" style={{ color: pkg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm">{pkg.name}</p>
                  {pkg.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${pkg.color}33`, color: pkg.color }}>
                      {pkg.badge}
                    </span>
                  )}
                  {sel && <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: pkg.color }} />}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{pkg.tagline}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-lg font-bold" style={{ color: pkg.color }}>${pkg.monthly.toLocaleString()}</span>
                  <span className="text-slate-500 text-xs">/mo</span>
                  <span className="text-slate-600 text-xs ml-2">+ ${pkg.setup.toLocaleString()} setup</span>
                </div>
              </div>
            </div>

            {sel && (
              <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                {pkg.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: pkg.color }} />
                    <span className="text-slate-300 text-xs leading-relaxed">{d}</span>
                  </div>
                ))}
                <p className="text-xs mt-2 pt-2 border-t border-slate-700/40 italic" style={{ color: pkg.color }}>
                  {pkg.positioning}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}