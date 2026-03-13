import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PLANS = ['free_trial', 'diy', 'guided_growth', 'done_for_you', 'premium', 'enterprise'];

export default function PlanFeatureMatrix() {
  const { data: features, isLoading } = useQuery({
    queryKey: ['plan-features'],
    queryFn: async () => {
      const all = await base44.entities.PlanFeatureAccess.list();
      
      // Group by feature
      const grouped = {};
      all?.forEach(f => {
        if (!grouped[f.featureKey]) {
          grouped[f.featureKey] = {};
        }
        grouped[f.featureKey][f.planKey] = f;
      });
      
      return grouped;
    },
  });

  const accessLevelColor = (level) => {
    switch (level) {
      case 'unlimited': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'standard': return 'bg-purple-100 text-purple-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="animate-spin">Loading features...</div>;

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Plan Feature Access Matrix</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left min-w-40">Feature</th>
              {PLANS.map(plan => (
                <th key={plan} className="px-2 py-2 text-center min-w-28">
                  <div className="font-semibold">{plan.toUpperCase()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features && Object.entries(features).map(([featureKey, planAccess]) => (
              <tr key={featureKey} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{featureKey}</td>
                {PLANS.map(plan => {
                  const access = planAccess[plan];
                  const level = access?.accessLevel || 'none';
                  
                  return (
                    <td key={plan} className="px-2 py-2 text-center">
                      <Badge className={accessLevelColor(level)}>
                        {level}
                        {access?.limit && ` (${access.limit})`}
                      </Badge>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}