import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Zap } from 'lucide-react';

export default function OnboardingHealthPanel() {
  const { data: clients = [] } = useQuery({
    queryKey: ['onboarding-health'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();
  const issues = [];

  clients.forEach(client => {
    // Stalled > 14 days
    if (client.onboarding_started_date) {
      const daysInOnboarding = Math.floor((now - new Date(client.onboarding_started_date)) / (1000 * 60 * 60 * 24));
      if (daysInOnboarding > 14) {
        issues.push({
          severity: 'high',
          title: 'Onboarding Delayed',
          description: `${client.name || client.company_name} stalled for ${daysInOnboarding}d`,
          clientId: client.id,
        });
      }
    }

    // Missing brand assets
    if (!client.logo_uploaded) {
      issues.push({
        severity: 'medium',
        title: 'Missing Brand Assets',
        description: `${client.name || client.company_name} needs logo & colors`,
        clientId: client.id,
      });
    }

    // No channels connected
    if (!client.website_publishing_ready && !client.facebook_connected) {
      issues.push({
        severity: 'medium',
        title: 'No Channels Connected',
        description: `${client.name || client.company_name} needs platform setup`,
        clientId: client.id,
      });
    }

    // Portal not activated
    if (!client.client_portal_activated) {
      issues.push({
        severity: 'low',
        title: 'Portal Not Activated',
        description: `${client.name || client.company_name} client portal pending`,
        clientId: client.id,
      });
    }
  });

  const uniqueIssues = Array.from(new Map(issues.map(i => [i.title + i.clientId, i])).values()).slice(0, 5);

  const severityColors = {
    high: 'border-red-700 bg-red-900/20',
    medium: 'border-orange-700 bg-orange-900/20',
    low: 'border-yellow-700 bg-yellow-900/20',
  };

  const severityIcons = {
    high: 'text-red-400',
    medium: 'text-orange-400',
    low: 'text-yellow-400',
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-400" />
        Onboarding Health
      </h3>

      {uniqueIssues.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {uniqueIssues.map((issue, idx) => (
            <div key={idx} className={`${severityColors[issue.severity]} border rounded-lg p-3`}>
              <p className={`text-xs font-semibold ${severityIcons[issue.severity]} mb-1`}>
                {issue.title}
              </p>
              <p className="text-xs text-slate-300">{issue.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">All systems healthy</p>
        </div>
      )}
    </div>
  );
}