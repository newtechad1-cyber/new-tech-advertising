import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

const CATEGORY_GROUPS = [
  {
    group: 'Publishing',
    icon: '📰',
    categories: ['publishing_performance'],
    description: 'Content timing, cadence, distribution',
  },
  {
    group: 'Sales',
    icon: '💰',
    categories: ['sales_conversion'],
    description: 'Pipeline velocity, win rates, conversion',
  },
  {
    group: 'Onboarding',
    icon: '🚀',
    categories: ['onboarding_efficiency'],
    description: 'Launch speed, setup optimization',
  },
  {
    group: 'Automation',
    icon: '⚙️',
    categories: ['automation_reliability'],
    description: 'Failure rates, retry logic, resilience',
  },
  {
    group: 'Reporting',
    icon: '📊',
    categories: ['reporting_effectiveness'],
    description: 'Report generation, delivery timing',
  },
  {
    group: 'Reseller Growth',
    icon: '📈',
    categories: ['reseller_growth'],
    description: 'Client expansion, revenue per reseller',
  },
  {
    group: 'Client Engagement',
    icon: '👥',
    categories: ['client_engagement'],
    description: 'Activity frequency, feature adoption',
  },
];

export default function OptimizationCategoryGroup({ selected = null, onSelect = () => {}, stats = {} }) {
  return (
    <div className="space-y-2">
      {CATEGORY_GROUPS.map((group) => {
        const isSelected = selected === group.group;
        const groupStats = stats[group.group] || { candidates: 0, experiments: 0, wins: 0 };

        return (
          <Card
            key={group.group}
            className={`cursor-pointer transition-all ${
              isSelected
                ? 'bg-indigo-950/30 border-indigo-700/50'
                : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => onSelect(group.group)}
          >
            <div className="p-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{group.icon}</span>
                  <h3 className="font-semibold text-white">{group.group}</h3>
                </div>
                <p className="text-xs text-slate-400 mb-2">{group.description}</p>

                {/* Stats */}
                <div className="flex gap-3">
                  {groupStats.candidates > 0 && (
                    <Badge variant="outline" className="text-xs bg-orange-950/30 text-orange-300 border-orange-700/30">
                      {groupStats.candidates} candidates
                    </Badge>
                  )}
                  {groupStats.experiments > 0 && (
                    <Badge variant="outline" className="text-xs bg-blue-950/30 text-blue-300 border-blue-700/30">
                      {groupStats.experiments} running
                    </Badge>
                  )}
                  {groupStats.wins > 0 && (
                    <Badge variant="outline" className="text-xs bg-emerald-950/30 text-emerald-300 border-emerald-700/30">
                      {groupStats.wins} wins
                    </Badge>
                  )}
                </div>
              </div>

              <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                isSelected ? 'rotate-90' : ''
              }`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export { CATEGORY_GROUPS };