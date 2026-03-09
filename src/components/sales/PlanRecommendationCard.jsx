import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLANS = {
  starter: {
    label: 'Starter',
    price: '$297',
    tagline: 'Best for solo operators & small local businesses',
    color: 'border-cyan-700',
    badgeColor: 'bg-cyan-900/40 text-cyan-400 border-cyan-700',
    features: ['AI-generated social content', 'Monthly blog articles', 'Local SEO foundation', 'Basic website updates', 'Review management'],
  },
  growth: {
    label: 'Growth',
    price: '$597',
    tagline: 'Best for growing businesses ready to dominate locally',
    color: 'border-violet-600',
    badgeColor: 'bg-violet-900/40 text-violet-400 border-violet-700',
    features: ['Everything in Starter', 'Custom website build', 'Video content monthly', 'Advanced SEO campaigns', 'Social media management', 'Email marketing'],
  },
  pro: {
    label: 'Pro',
    price: '$997',
    tagline: 'Best for multi-location or service businesses scaling fast',
    color: 'border-yellow-600',
    badgeColor: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
    features: ['Everything in Growth', 'Streaming TV ads', 'ADA compliance', 'Multiple locations', 'Dedicated account manager', 'Priority support'],
  },
};

export default function PlanRecommendationCard({ recommendedPlan = 'growth', compact = false }) {
  const plan = PLANS[recommendedPlan] || PLANS.growth;

  if (compact) {
    return (
      <div className={`bg-slate-900 border-2 ${plan.color} rounded-xl p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-slate-400">Recommended for you</span>
        </div>
        <p className="text-white font-bold text-lg">{plan.label} Plan</p>
        <p className="text-slate-400 text-sm">{plan.price}/month · {plan.tagline}</p>
        <Link to={createPageUrl('DealRoomPricing')} className="mt-3 block">
          <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-sm">
            See Full Pricing <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 border-2 ${plan.color} rounded-2xl p-6 relative`}>
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-yellow-400" />
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${plan.badgeColor}`}>Recommended for you</span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold text-white">{plan.label}</span>
        <span className="text-violet-400 font-bold">{plan.price}<span className="text-slate-500 text-sm font-normal">/mo</span></span>
      </div>
      <p className="text-slate-400 text-sm mb-4">{plan.tagline}</p>
      <ul className="space-y-1.5 mb-5">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Link to={createPageUrl('StartTrial')}>
        <Button className="w-full bg-violet-600 hover:bg-violet-500 font-semibold">
          Start Free Trial <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}