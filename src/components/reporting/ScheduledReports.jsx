import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ScheduledReports() {
  const { data: schedules = [] } = useQuery({
    queryKey: ['scheduled-reports'],
    queryFn: () => base44.entities.ReportingSchedule?.list?.('-next_generation', 10).catch(() => []),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['schedule-clients'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-updated_date', 500).catch(() => []),
  });

  const schedulesWithClient = schedules
    .filter(s => s.active)
    .map(schedule => {
      const client = clients.find(c => c.id === schedule.company_id);
      return { ...schedule, clientName: client?.name || 'Unknown' };
    });

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-amber-400" />
        Scheduled Reports
      </h3>

      {schedulesWithClient.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {schedulesWithClient.map((schedule, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{schedule.clientName}</p>
                  <p className="text-xs text-slate-400 capitalize">{schedule.frequency}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1 text-slate-400 hover:text-slate-300">
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
              {schedule.next_generation && (
                <p className="text-xs text-slate-500">
                  Next: {new Date(schedule.next_generation).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">No scheduled reports</p>
        </div>
      )}
    </div>
  );
}