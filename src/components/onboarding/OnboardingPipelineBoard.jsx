import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Clock, AlertCircle } from 'lucide-react';

import ClientProgressScore from './ClientProgressScore';
import NextBestOnboardingAction from './NextBestOnboardingAction';
import ClientActivityTimeline from './ClientActivityTimeline';
import ClientLaunchMilestone from './ClientLaunchMilestone';
import FastLaunchModeIndicator from './FastLaunchModeIndicator';
import OnboardingReminderAutomation from './OnboardingReminderAutomation';

const STAGES = [
  { id: 'deal_closed', label: 'Deal Closed' },
  { id: 'welcome_sent', label: 'Welcome Sent' },
  { id: 'brand_assets', label: 'Brand Assets' },
  { id: 'platform_setup', label: 'Platform Setup' },
  { id: 'publishing_connected', label: 'Channels Connected' },
  { id: 'first_content', label: 'First Content' },
  { id: 'content_approved', label: 'Content Approved' },
  { id: 'fully_live', label: 'Fully Live' },
];

export default function OnboardingPipelineBoard({ onSelectClient }) {
  const { data: clients = [] } = useQuery({
    queryKey: ['onboarding-pipeline'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();

  const stageData = STAGES.map(stage => {
    const clientsInStage = clients.filter(c => (c.onboarding_stage || 'deal_closed') === stage.id);
    return {
      ...stage,
      count: clientsInStage.length,
      clients: clientsInStage.map(c => {
        const enteredAt = new Date(c.onboarding_stage_entered_date || c.created_date || now);
        const daysInStage = Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24));
        const isStalled = daysInStage > 7;
        
        return {
          id: c.id,
          name: c.name || c.company_name,
          daysInStage,
          isStalled,
          dealValue: c.deal_value || 0,
          owner: c.onboarding_owner_email || 'Unassigned',
          health: c.onboarding_health || 'good',
        };
      }),
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6">Onboarding Pipeline</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4 min-w-max">
          {stageData.map((stage, idx) => (
            <div key={idx} className="flex-shrink-0 w-80">
              {/* Stage Header */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white">{stage.label}</h4>
                  <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">
                    {stage.count}
                  </span>
                </div>
              </div>

              {/* Client Cards */}
              <div className="space-y-2">
                {stage.clients.map(clientData => {
                  // Get full client object from query for rich data
                  const fullClient = clients.find(c => c.id === clientData.id) || clientData;
                  const isHighPriority = fullClient.deal_value > 25000;
                  
                  return (
                    <div
                      key={clientData.id}
                      onClick={() => onSelectClient?.(fullClient)}
                      className={`border rounded-lg p-3 cursor-pointer transition-all hover:bg-slate-800/60 space-y-2 ${
                        clientData.isStalled
                          ? 'border-red-700/50 bg-red-900/10'
                          : clientData.health === 'good'
                          ? 'border-emerald-700/50 bg-emerald-900/10'
                          : 'border-slate-700 bg-slate-800/30'
                      }`}
                    >
                      {/* Header: Name, Priority Badge, Stall Alert */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{clientData.name}</p>
                          <p className="text-xs text-slate-400">${(clientData.dealValue / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-1">
                          <FastLaunchModeIndicator client={fullClient} isHighPriority={isHighPriority} />
                          {clientData.isStalled && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>

                      {/* Progress Score */}
                      <ClientProgressScore client={fullClient} />

                      {/* Launch Milestone */}
                      <ClientLaunchMilestone client={fullClient} />

                      {/* Next Best Action */}
                      <NextBestOnboardingAction client={fullClient} />

                      {/* Activity Timeline */}
                      <ClientActivityTimeline client={fullClient} />

                      {/* Footer: Days in Stage + Owner + Reminder */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {clientData.daysInStage}d
                        </div>
                        <span className="text-xs text-slate-500">{clientData.owner.split('@')[0]}</span>
                        <OnboardingReminderAutomation client={fullClient} />
                      </div>
                    </div>
                  );
                })}

                {stage.count === 0 && (
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center text-slate-500">
                    <p className="text-xs">No clients</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}