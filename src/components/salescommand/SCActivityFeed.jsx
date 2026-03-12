import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle2, FileText, DollarSign, Bell, Mail, Calendar, StickyNote, AlertCircle } from 'lucide-react';

const ACTIVITY_CONFIG = {
  call_logged: { icon: Phone, color: 'text-blue-400', bg: 'bg-blue-950/20', label: 'Call Logged' },
  demo_completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/20', label: 'Demo Done' },
  proposal_sent: { icon: FileText, color: 'text-violet-400', bg: 'bg-violet-950/20', label: 'Proposal Sent' },
  deal_closed: { icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-950/20', label: 'Deal Closed' },
  follow_up: { icon: Bell, color: 'text-amber-400', bg: 'bg-amber-950/20', label: 'Follow-up' },
  email_sent: { icon: Mail, color: 'text-cyan-400', bg: 'bg-cyan-950/20', label: 'Email Sent' },
  meeting_scheduled: { icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-950/20', label: 'Meeting Sched.' },
  note_added: { icon: StickyNote, color: 'text-slate-400', bg: 'bg-slate-800', label: 'Note Added' },
};

const FALLBACK = [
  { activity_type: 'deal_closed', rep_name: 'Sarah L.', company_name: 'Metro HVAC Solutions', deal_value: 24000, vertical: 'HVAC', created_date: new Date(Date.now() - 1800000).toISOString(), overdue: false },
  { activity_type: 'demo_completed', rep_name: 'Jake M.', company_name: 'Precision Plumbing', vertical: 'Home Services', created_date: new Date(Date.now() - 3600000).toISOString(), overdue: false },
  { activity_type: 'follow_up', rep_name: 'Tom R.', company_name: 'Blue Ridge Roofing', vertical: 'Roofing', created_date: new Date(Date.now() - 7200000).toISOString(), overdue: true },
  { activity_type: 'proposal_sent', rep_name: 'Sarah L.', company_name: 'Sunrise Med Spa', vertical: 'MedSpa', deal_value: 14400, created_date: new Date(Date.now() - 10800000).toISOString(), overdue: false },
  { activity_type: 'call_logged', rep_name: 'Jake M.', company_name: 'Arctic Air HVAC', vertical: 'HVAC', notes: 'Interested in AI video — send pricing', created_date: new Date(Date.now() - 14400000).toISOString(), overdue: false },
  { activity_type: 'email_sent', rep_name: 'Maria C.', company_name: 'Mesa Grill Group', vertical: 'Restaurant', created_date: new Date(Date.now() - 18000000).toISOString(), overdue: false },
  { activity_type: 'meeting_scheduled', rep_name: 'Tom R.', company_name: 'Citywide Dental', vertical: 'Dental', created_date: new Date(Date.now() - 21600000).toISOString(), overdue: false },
  { activity_type: 'follow_up', rep_name: 'Maria C.', company_name: 'Heritage Builders', vertical: 'Construction', created_date: new Date(Date.now() - 86400000).toISOString(), overdue: true },
];

const REP_LIST = ['All Reps', 'Jake M.', 'Sarah L.', 'Tom R.', 'Maria C.'];
const VERTICAL_LIST = ['All Verticals', 'HVAC', 'Restaurant', 'Home Services', 'Roofing', 'Dental'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function SCActivityFeed({ activities = [] }) {
  const [repFilter, setRepFilter] = useState('All Reps');
  const [verticalFilter, setVerticalFilter] = useState('All Verticals');

  const feed = (activities.length > 0 ? activities : FALLBACK)
    .filter(a => repFilter === 'All Reps' || a.rep_name === repFilter)
    .filter(a => verticalFilter === 'All Verticals' || a.vertical === verticalFilter)
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const overdueCount = feed.filter(a => a.overdue).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Activity Command Feed</h2>
          {overdueCount > 0 && (
            <Badge className="bg-red-950 text-red-300 gap-1 text-xs">
              <AlertCircle className="w-3 h-3" /> {overdueCount} overdue
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <select value={repFilter} onChange={e => setRepFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none">
            {REP_LIST.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={verticalFilter} onChange={e => setVerticalFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none">
            {VERTICAL_LIST.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-0 max-h-80 overflow-y-auto">
          {feed.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6">No activities match filters</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {feed.map((activity, i) => {
                const cfg = ACTIVITY_CONFIG[activity.activity_type] || ACTIVITY_CONFIG.note_added;
                const Icon = cfg.icon;
                return (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors ${activity.overdue ? 'border-l-2 border-red-600' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-medium text-white">{activity.rep_name}</p>
                        <Badge className="text-[9px] px-1 bg-slate-700 text-slate-400">{cfg.label}</Badge>
                        {activity.overdue && <Badge className="text-[9px] px-1 bg-red-950 text-red-300">Overdue</Badge>}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activity.company_name}
                        {activity.deal_value ? ` · $${(activity.deal_value / 1000).toFixed(0)}k` : ''}
                      </p>
                      {activity.notes && <p className="text-[10px] text-slate-500 mt-0.5 italic">"{activity.notes}"</p>}
                    </div>
                    <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(activity.created_date)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}