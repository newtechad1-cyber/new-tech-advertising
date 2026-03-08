import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function RenewalsRadar({ data }) {
  if (!data || !data.summary) return null;

  const { summary } = data;

  // Create sample renewal opportunities for now
  const renewals = [
    { company: 'TechCorp Inc', type: 'Renewal', value: 45000, dueDate: '2026-04-15', confidence: 92, health: 'healthy' },
    { company: 'Growth Marketing LLC', type: 'Upsell', value: 28000, dueDate: '2026-04-22', confidence: 78, health: 'growing' },
    { company: 'E-Commerce Pro', type: 'Expansion', value: 15000, dueDate: '2026-05-01', confidence: 65, health: 'needs_attention' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Renewals & Expansion Radar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2 font-semibold text-gray-600">Company</th>
                <th className="text-left py-2 font-semibold text-gray-600">Type</th>
                <th className="text-left py-2 font-semibold text-gray-600">Value</th>
                <th className="text-left py-2 font-semibold text-gray-600">Due Date</th>
                <th className="text-left py-2 font-semibold text-gray-600">Health</th>
                <th className="text-right py-2 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renewals.map((renewal, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">{renewal.company}</td>
                  <td className="py-3">
                    <Badge className={
                      renewal.type === 'Renewal' ? 'bg-blue-100 text-blue-800' :
                      renewal.type === 'Upsell' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {renewal.type}
                    </Badge>
                  </td>
                  <td className="py-3 font-semibold">${(renewal.value / 1000).toFixed(0)}k</td>
                  <td className="py-3 text-gray-600">{renewal.dueDate}</td>
                  <td className="py-3">
                    <Badge className={
                      renewal.health === 'healthy' ? 'bg-green-100 text-green-800' :
                      renewal.health === 'growing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {renewal.health}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl('/admin/growth')}>All Opportunities</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}