import React from 'react';
import { Users, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

export default function ClientHealthOverviewCards({
  totalActive,
  planDistribution,
  atRiskCount,
  upgradeReadyCount,
  highMomentumCount,
}) {
  const cards = [
    {
      label: 'Active Clients',
      value: totalActive,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'At-Risk',
      value: atRiskCount,
      icon: AlertTriangle,
      color: 'red',
      subtext: 'require attention',
    },
    {
      label: 'Upgrade Ready',
      value: upgradeReadyCount,
      icon: Zap,
      color: 'amber',
      subtext: 'high potential',
    },
    {
      label: 'High Momentum',
      value: highMomentumCount,
      icon: TrendingUp,
      color: 'green',
      subtext: 'growing fast',
    },
  ];

  const colorStyles = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    red: 'bg-red-500/10 border-red-500/30 text-red-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-lg border p-6 ${colorStyles[card.color]}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">{card.label}</div>
                <div className="text-4xl font-bold text-white">{card.value}</div>
                {card.subtext && (
                  <div className="text-xs text-slate-400 mt-2">{card.subtext}</div>
                )}
              </div>
              <Icon className="w-5 h-5 opacity-60" />
            </div>
          </div>
        );
      })}

      {/* Plan Distribution */}
      <div className="md:col-span-2 lg:col-span-4 bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <h3 className="font-semibold text-white mb-4">Plan Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          {planDistribution.map((plan) => (
            <div key={plan.name} className="text-center">
              <div className="text-2xl font-bold text-white">{plan.count}</div>
              <div className="text-xs text-slate-400 mt-1">{plan.name}</div>
              <div className="text-xs text-slate-500 mt-1">
                {plan.percent}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}