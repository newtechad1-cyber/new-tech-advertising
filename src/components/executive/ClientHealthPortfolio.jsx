import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ClientHealthPortfolio({ data }) {
  if (!data || !data.health_distribution) return null;

  const { health_distribution } = data;

  const healthCategories = [
    { key: 'expansion_ready', label: 'Expansion Ready', color: 'bg-green-100 text-green-800', icon: '📈' },
    { key: 'healthy', label: 'Healthy', color: 'bg-blue-100 text-blue-800', icon: '✓' },
    { key: 'growing', label: 'Growing', color: 'bg-purple-100 text-purple-800', icon: '⬆' },
    { key: 'needs_attention', label: 'Needs Attention', color: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
    { key: 'at_risk', label: 'At Risk', color: 'bg-red-100 text-red-800', icon: '🔴' }
  ];

  const total = Object.values(health_distribution).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Client Health Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthCategories.map(cat => {
            const count = health_distribution[cat.key] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                  </div>
                  <Badge className={cat.color}>{count}</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      cat.key === 'expansion_ready' ? 'bg-green-500' :
                      cat.key === 'healthy' ? 'bg-blue-500' :
                      cat.key === 'growing' ? 'bg-purple-500' :
                      cat.key === 'needs_attention' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/success')}>View All Accounts</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/growth')}>Growth Opportunities</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}