import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell, CheckCheck, X, Clock, RefreshCw, Loader2,
  Flame, FileText, Rocket, AlertCircle, ChevronRight, Mail,
  Building2, User, Wrench, Calendar, Info, Tag
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PRIORITY_ROW = {
  urgent: 'border-l-4 border-l-red-500 bg-red-950/30',
  high:   'border-l-4 border-l-orange-400 bg-orange-950/20',
  medium: 'border-l-4 border-l-yellow-500 bg-yellow-950/20',
  low:    'border-l-4 border-l-slate-600 bg-slate-800/40',
};

const PRIORITY_BADGE = {
  urgent: 'bg-red-900/60 text-red-300 border border-red-700',
  high:   'bg-orange-900/60 text-orange-300 border border-orange-700',
  medium: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
  low:    'bg-slate-700 text-slate-400',
};

const TYPE_SECTIONS = [
  { id: 'hot_lead', label: '🔥 Hot Leads', types: ['hot_lead', 'followup_needed'] },
  { id: 'proposals', label: '📄 Proposal Activity', types: ['proposal_viewed', 'proposal_viewed_multiple', 'proposal_followup', 'proposal_no_response'] },
  { id: 'trials', label: '🚀 Trial Follow-Up', types: ['trial_started', 'trial_incomplete'] },
  { id: 'client_requests', label: '💬 Client Requests', types: ['client_request'] },
];

function AlertCard({ n, onAction }) {
  return (
    <div className={`rounded-xl p-4 mb-2 ${PRIORITY_ROW[n.priority] || PRIORITY_ROW.medium}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">{n.title}</span>
            <Badge className={`text-xs ${PRIORITY_BADGE[n.priority]}`}>{n.priority}</Badge>
            <span className="text-xs text-slate-500">
              {n.created_date ? formatDistanceToNow(new Date(n.created_date), { addSuffix: true }) : ''}
            </span>
          </div>

          {/* Company / contact quick-view */}
          {(n.company_name || n.contact_email) && (
            <div className="flex flex-wrap gap-3 mb-2 text-xs text-slate-400">
              {n.company_name && <span>🏢 {n.company_name}</span>}
              {n.contact_name && <span>👤 {n.contact_name}</span>}
              {n.service_interest && <span>🛠 {n.service_interest.replace(/_/g, ' ')}</span>}
            </div>
          )}

          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{n.message}</p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {n.contact_email && (
              <a href={`mailto:${n.contact_email}`}>
                <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700 gap-1">
                  <Mail className="w-3 h-3" /> Send Email
                </Button>
              </a>
            )}
            {n.related_lead_id && (
              <Link to={createPageUrl('LeadsDashboard')}>
                <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700 gap-1">
                  <ChevronRight className="w-3 h-3" /> View Lead
                </Button>
              </Link>
            )}
            {n.related_proposal_id && (
              <Link to={createPageUrl('AdminSales')}>
                <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700 gap-1">
                  <FileText className="w-3 h-3" /> View Proposal
                </Button>
              </Link>
            )}
            <Button
              size="sm"
              className="h-7 text-xs bg-emerald-700 hover:bg-emerald-600 gap-1"
              onClick={() => onAction(n.id, 'actioned')}
            >
              <CheckCheck className="w-3 h-3" /> Mark Done
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-slate-500 hover:text-orange-400 gap-1"
              onClick={() => {
                const until = new Date(Date.now() + 86400000).toISOString();
                onAction(n.id, 'snoozed', until);
              }}
            >
              <Clock className="w-3 h-3" /> Snooze 1 Day
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-slate-600 hover:text-red-400"
              onClick={() => onAction(n.id, 'dismissed')}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAlerts() {
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState('hot_lead');
  const [runningMonitor, setRunningMonitor] = useState(false);

  const { data: allNotifications = [], isLoading } = useQuery({
    queryKey: ['admin-alerts'],
    queryFn: () => base44.entities.SalesNotification.filter({ status: 'unread' }, '-created_date', 200),
    refetchInterval: 60000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, snooze_until }) =>
      base44.entities.SalesNotification.update(id, {
        status,
        ...(snooze_until ? { snooze_until } : {}),
        ...(status === 'actioned' || status === 'resolved' ? { resolved_date: new Date().toISOString() } : {}),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-alerts'] }),
  });

  const handleAction = (id, status, snooze_until) => {
    updateMutation.mutate({ id, status, snooze_until });
    if (status === 'actioned') toast.success('Marked as done');
    if (status === 'snoozed') toast.info('Snoozed for 1 day');
    if (status === 'dismissed') toast.success('Dismissed');
  };

  const markAllSectionDone = async (types) => {
    const toMark = allNotifications.filter(n => types.includes(n.notification_type));
    for (const n of toMark) {
      await base44.entities.SalesNotification.update(n.id, { status: 'actioned', resolved_date: new Date().toISOString() });
    }
    qc.invalidateQueries({ queryKey: ['admin-alerts'] });
    toast.success(`Marked ${toMark.length} alerts done`);
  };

  const runMonitor = async () => {
    setRunningMonitor(true);
    try {
      const res = await base44.functions.invoke('followUpMonitor', {});
      toast.success(`Monitor ran — ${res.data?.notifications_created || 0} new alerts`);
      qc.invalidateQueries({ queryKey: ['admin-alerts'] });
    } catch { toast.error('Monitor failed'); }
    setRunningMonitor(false);
  };

  const currentSection = TYPE_SECTIONS.find(s => s.id === activeSection);
  const filtered = allNotifications.filter(n => currentSection?.types.includes(n.notification_type));

  const countFor = (types) => allNotifications.filter(n => types.includes(n.notification_type)).length;

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-400" />
                <div>
                  <h1 className="text-xl font-bold">Alert Center</h1>
                  <p className="text-slate-400 text-sm">
                    {allNotifications.length} unread — who needs a human touch right now
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1"
                  onClick={runMonitor}
                  disabled={runningMonitor}
                >
                  {runningMonitor
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running...</>
                    : <><RefreshCw className="w-3.5 h-3.5" /> Run Monitor</>
                  }
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-6">
            {/* Section tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TYPE_SECTIONS.map(s => {
                const cnt = countFor(s.types);
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeSection === s.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                    {cnt > 0 && (
                      <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                        activeSection === s.id ? 'bg-white/20 text-white' : 'bg-red-600 text-white'
                      }`}>{cnt}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section header + bulk action */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-200">{currentSection?.label}</h2>
              {filtered.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-slate-400 hover:text-emerald-400 gap-1"
                  onClick={() => markAllSectionDone(currentSection.types)}
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark All Done
                </Button>
              )}
            </div>

            {/* Alerts list */}
            {isLoading ? (
              <div className="text-center py-16 text-slate-500">Loading alerts...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-600">
                <CheckCheck className="w-10 h-10 mx-auto mb-3 text-emerald-700" />
                <p className="font-medium">All clear in this section</p>
                <p className="text-sm text-slate-500 mt-1">No unread alerts — you're on top of it.</p>
              </div>
            ) : (
              <div>
                {filtered.map(n => (
                  <AlertCard key={n.id} n={n} onAction={handleAction} />
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}