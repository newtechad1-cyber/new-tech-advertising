import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react';

export default function UpcomingScheduleStrip() {
  const upcoming = [
    {
      type: 'demo',
      company: 'Elite Roofing LLC',
      time: 'Today at 2:00 PM',
      rep: 'Sarah Chen',
      status: 'confirmed'
    },
    {
      type: 'strategy',
      company: 'Smart Home Tech',
      time: 'Today at 4:30 PM',
      rep: 'Marcus Johnson',
      status: 'confirmed'
    },
    {
      type: 'demo',
      company: 'Fitness Plus',
      time: 'Tomorrow at 10:00 AM',
      rep: 'Alex Rivera',
      status: 'pending_confirmation'
    },
    {
      type: 'followup',
      company: 'ABC HVAC',
      time: 'Tomorrow at 3:00 PM',
      rep: 'Sarah Chen',
      status: 'confirmed'
    },
    {
      type: 'strategy',
      company: 'Green Landscaping',
      time: 'Mar 14 at 11:00 AM',
      rep: 'Marcus Johnson',
      status: 'scheduled'
    }
  ];

  const getTypeLabel = (type) => {
    const labels = {
      demo: 'Platform Demo',
      strategy: 'Strategy Call',
      followup: 'Follow-Up Call'
    };
    return labels[type];
  };

  const getTypeIcon = (type) => {
    const icons = {
      demo: Phone,
      strategy: Phone,
      followup: Phone
    };
    return icons[type];
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      pending_confirmation: { color: 'bg-yellow-100 text-yellow-800', label: 'Needs Confirmation' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' }
    };
    return badges[status];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Upcoming Schedule
        </h2>
        <p className="text-sm text-slate-600">{upcoming.length} events</p>
      </div>

      <div className="space-y-3">
        {upcoming.map((event, idx) => {
          const TypeIcon = getTypeIcon(event.type);
          const statusBadge = getStatusBadge(event.status);

          return (
            <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="flex-shrink-0 pt-1">
                <TypeIcon className="w-5 h-5 text-slate-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold text-slate-900">{event.company}</p>
                    <p className="text-sm text-slate-600">{getTypeLabel(event.type)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${statusBadge.color} whitespace-nowrap ml-2`}>
                    {statusBadge.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.time}
                  </span>
                  <span>Rep: {event.rep}</span>
                </div>
              </div>

              {event.status === 'pending_confirmation' && (
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors">
                    Confirm
                  </button>
                  <button className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-900 text-xs font-semibold rounded transition-colors">
                    Reschedule
                  </button>
                </div>
              )}

              {event.status === 'confirmed' && (
                <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-semibold rounded transition-colors">
                  Prep Demo
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Confirm pending calls early and send reminder emails 24 hours before demos.
        </p>
      </div>
    </div>
  );
}