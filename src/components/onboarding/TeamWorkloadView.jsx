import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users } from 'lucide-react';

export default function TeamWorkloadView() {
  const { data: clients = [] } = useQuery({
    queryKey: ['team-workload'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();

  // Aggregate by onboarding owner
  const teamStats = {};
  clients.forEach(client => {
    const owner = client.onboarding_owner_email || 'Unassigned';
    if (!teamStats[owner]) {
      teamStats[owner] = {
        assigned: 0,
        inProgress: 0,
        stalled: 0,
        readyToLaunch: 0,
      };
    }

    teamStats[owner].assigned += 1;

    if (['welcome_sent', 'brand_assets', 'platform_setup', 'publishing_connected', 'first_content'].includes(client.onboarding_stage)) {
      teamStats[owner].inProgress += 1;
    }

    if (client.onboarding_started_date) {
      const daysInOnboarding = Math.floor((now - new Date(client.onboarding_started_date)) / (1000 * 60 * 60 * 24));
      if (daysInOnboarding > 14) {
        teamStats[owner].stalled += 1;
      }
    }

    if (client.onboarding_stage === 'content_approved') {
      teamStats[owner].readyToLaunch += 1;
    }
  });

  const team = Object.entries(teamStats)
    .map(([email, stats]) => ({
      email,
      name: email.split('@')[0],
      ...stats,
    }))
    .sort((a, b) => b.assigned - a.assigned);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-emerald-400" />
        Team Workload
      </h3>

      {team.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {team.map((member, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white capitalize">{member.name}</p>
                <span className="text-xs font-bold bg-slate-700 px-2 py-1 rounded text-slate-300">
                  {member.assigned}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">In Progress</p>
                  <p className="font-bold text-blue-400">{member.inProgress}</p>
                </div>
                <div>
                  <p className="text-slate-400">Stalled</p>
                  <p className="font-bold text-red-400">{member.stalled}</p>
                </div>
                <div>
                  <p className="text-slate-400">Ready</p>
                  <p className="font-bold text-emerald-400">{member.readyToLaunch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">No team data</p>
        </div>
      )}
    </div>
  );
}