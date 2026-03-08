import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function OperationsRisk({ data }) {
  if (!data || !data.summary) return null;

  const { summary } = data;

  const riskItems = [
    {
      issue: 'Critical SLA Breaches',
      count: summary.critical_sla_breaches || 0,
      severity: 'critical',
      link: '/admin/operations'
    },
    {
      issue: 'Total SLA Breaches',
      count: summary.total_sla_breaches || 0,
      severity: 'high',
      link: '/admin/operations'
    },
    {
      issue: 'At-Risk Accounts',
      count: summary.at_risk_accounts || 0,
      severity: 'high',
      link: '/admin/success'
    },
    {
      issue: 'Urgent Client Requests',
      count: summary.urgent_client_requests || 0,
      severity: summary.urgent_client_requests > 0 ? 'medium' : 'low',
      link: '/admin/clients'
    },
    {
      issue: 'Unread Messages',
      count: summary.unread_messages || 0,
      severity: 'medium',
      link: '/admin/messages'
    }
  ];

  const hasCritical = summary.critical_sla_breaches > 0 || summary.at_risk_accounts > 0;

  return (
    <Card className={hasCritical ? 'border-red-200 bg-red-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasCritical ? (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600" />
          )}
          Operations Risk
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {riskItems.map((item, idx) => (
            <a key={idx} href={createPageUrl(item.link)} className="block hover:bg-white/50 p-2 rounded transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.issue}</span>
                <Badge className={
                  item.severity === 'critical' ? 'bg-red-600' :
                  item.severity === 'high' ? 'bg-orange-600' :
                  'bg-yellow-600'
                }>
                  {item.count}
                </Badge>
              </div>
            </a>
          ))}
        </div>

        {hasCritical && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-xs font-semibold text-red-800">⚠ Immediate Attention Required</p>
            <p className="text-xs text-red-700 mt-1">Critical operational issues detected</p>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <a href={createPageUrl('/admin/operations')}>View Operations Hub</a>
        </Button>
      </CardContent>
    </Card>
  );
}