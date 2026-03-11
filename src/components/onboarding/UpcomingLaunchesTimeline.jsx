import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar } from 'lucide-react';

export default function UpcomingLaunchesTimeline() {
  const { data: clients = [] } = useQuery({
    queryKey: ['upcoming-launches'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const launches = clients
    .filter(c => {
      if (!c.target_launch_date) return false;
      const launchDate = new Date(c.target_launch_date);
      return launchDate >= now && launchDate <= thirtyDaysFromNow;
    })
    .map(c => {
      const launchDate = new Date(c.target_launch_date);
      const daysUntil = Math.floor((launchDate - now) / (1000 * 60 * 60 * 24));
      
      // Calculate readiness from onboarding stage
      const stageOrder = ['deal_closed', 'welcome_sent', 'brand_assets', 'platform_setup', 'publishing_connected', 'first_content', 'content_approved', 'fully_live'];
      const currentStageIdx = stageOrder.indexOf(c.onboarding_stage || 'deal_closed');
      const readiness = Math.round(((currentStageIdx + 1) / stageOrder.length) * 100);

      return {
        id: c.id,
        name: c.name || c.company_name,
        launchDate,
        daysUntil,
        readiness,
        owner: c.onboarding_owner_email || 'Unassigned',
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        Upcoming Launches
      </h3>

      {launches.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {launches.map((launch, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{launch.name}</p>
                  <p className="text-xs text-slate-400">{launch.daysUntil}d away</p>
                </div>
                <span className="text-xs font-bold bg-slate-700 px-2 py-1 rounded text-slate-300">
                  {launch.readiness}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${launch.readiness}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">No launches scheduled</p>
        </div>
      )}
    </div>
  );
}