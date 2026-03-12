import React from 'react';
import { AlertCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function PriorityActionPanel() {
  const priorities = [
    {
      id: 1,
      company: 'ABC HVAC Services',
      industry: 'HVAC',
      stage: 'Deal Room Active',
      lastActivity: '2 days ago',
      urgency: 'high'
    },
    {
      id: 2,
      company: 'Summit Plumbing Co',
      industry: 'Plumbing',
      stage: 'Deal Room Active',
      lastActivity: '4 days ago',
      urgency: 'critical'
    },
    {
      id: 3,
      company: 'Elite Roofing LLC',
      industry: 'Roofing',
      stage: 'Demo Completed',
      lastActivity: '1 day ago',
      urgency: 'high'
    }
  ];

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {priorities.length} Deal-Room Prospects Need Follow-Up Today
          </h2>
          <p className="text-sm text-slate-700 mb-4">
            These prospects viewed your deal room recently but haven't committed. Time to push forward.
          </p>

          <div className="space-y-3 mb-4">
            {priorities.map((prospect) => (
              <div key={prospect.id} className="bg-white p-3 rounded border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{prospect.company}</p>
                    <p className="text-xs text-slate-600">{prospect.industry}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    prospect.urgency === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {prospect.urgency.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {prospect.stage}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {prospect.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            Open Follow-Up List
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}