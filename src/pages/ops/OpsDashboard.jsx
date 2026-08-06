import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowRight, BarChart2, CalendarClock, CheckSquare,
  ChevronRight, Clock3, Mail, MapPin, Phone, Plus, RefreshCw,
  Search, Share2, Target, UserCheck, Users
} from 'lucide-react';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import QuickActionModal from '@/components/ops-dashboard/QuickActionModal';
import { base44 } from '@/api/base44Client';

const CLOSED_STATUSES = new Set(['closed_won', 'closed_lost', 'no_response']);

const safe = (request, fallback = []) => request.catch(() => fallback);

const todayKey = () => new Date().toISOString().slice(0, 10);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isLocalDirectory = (prospect) =>
  String(prospect.notes || '').toLowerCase().startsWith('local directory research');

const isActiveProspect = (prospect) =>
  prospect.archived !== true && !CLOSED_STATUSES.has(prospect.status);

const priorityRank = { high: 0, medium: 1, low: 2 };

function StatCard({ label, value, href, icon: Icon, color, alert }) {
  return (
    <Link
      to={href}
      className="relative rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-600"
    >
      {alert && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-400" />}
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs leading-tight text-slate-500">{label}</p>
    </Link>
  );
}

function FocusItem({ title, detail, href, urgent }) {
  return (
    <Link
      to={href}
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors hover:bg-slate-800/60 ${urgent ? 'border-red-900/60 bg-red-950/20' : 'border-slate-800 bg-slate-900/60'}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {urgent
          ? <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
          : <Clock3 className="h-4 w-4 flex-shrink-0 text-slate-500" />}
        <div className="min-w-0">
          <p className={`truncate text-sm font-semibold ${urgent ? 'text-red-200' : 'text-white'}`}>{title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600" />
    </Link>
  );
}

function ProspectLine({ prospect }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{prospect.business_name || 'Unnamed business'}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {prospect.city && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />{prospect.city}, {prospect.state}
            </span>
          )}
          {prospect.industry && <span>{prospect.industry}</span>}
          <span className="capitalize">{prospect.status?.replaceAll('_', ' ') || 'new'}</span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1.5">
        {prospect.phone && (
          <a
            href={`tel:${prospect.phone}`}
            aria-label={`Call ${prospect.business_name}`}
            className="rounded-lg bg-emerald-900/40 p-2 text-emerald-300 hover:bg-emerald-900/70"
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
        )}
        {prospect.email && (
          <a
            href={`mailto:${prospect.email}`}
            aria-label={`Email ${prospect.business_name}`}
            className="rounded-lg bg-blue-900/40 p-2 text-blue-300 hover:bg-blue-900/70"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function OpsDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    prospects: [],
    clients: [],
    audits: [],
    campaigns: [],
    approvals: [],
    scheduledPosts: [],
    reports: []
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const [prospects, clients, audits, campaigns, approvals, scheduledPosts, reports] = await Promise.all([
      safe(base44.entities.SalesLead.list('-updated_date', 500)),
      safe(base44.entities.Client.list('-updated_date', 200)),
      safe(base44.entities.GapAudit.filter({ status: 'draft' })),
      safe(base44.entities.Campaign.filter({ status: 'active' })),
      safe(base44.entities.ContentAsset.filter({ approval_status: 'pending' })),
      safe(base44.entities.SocialPost.filter({ status: 'scheduled' })),
      safe(base44.entities.Report.list('-created_date', 5))
    ]);
    setData({ prospects, clients, audits, campaigns, approvals, scheduledPosts, reports });
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const activeProspects = useMemo(
    () => data.prospects.filter(isActiveProspect),
    [data.prospects]
  );

  const localProspects = useMemo(
    () => activeProspects.filter(isLocalDirectory),
    [activeProspects]
  );

  const dueFollowUps = useMemo(() => {
    const today = todayKey();
    return activeProspects
      .filter(p => p.next_follow_up && String(p.next_follow_up).slice(0, 10) <= today)
      .sort((a, b) => String(a.next_follow_up).localeCompare(String(b.next_follow_up)));
  }, [activeProspects]);

  const newToday = useMemo(() => {
    const today = todayKey();
    return activeProspects.filter(p => String(p.created_date || '').slice(0, 10) === today);
  }, [activeProspects]);

  const localReadyToContact = useMemo(
    () => localProspects
      .filter(p => p.status === 'new')
      .sort((a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)),
    [localProspects]
  );

  const pipeline = useMemo(() => {
    const statuses = ['new', 'contacted', 'replied', 'interested', 'proposal_sent'];
    return statuses.map(status => ({
      status,
      count: activeProspects.filter(p => p.status === status).length
    }));
  }, [activeProspects]);

  const activeClients = data.clients.filter(c => ['active', 'onboarding'].includes(c.status)).length;
  const focusItems = [];

  if (dueFollowUps.length > 0) {
    focusItems.push({
      title: `${dueFollowUps.length} follow-up${dueFollowUps.length === 1 ? '' : 's'} due`,
      detail: 'Contact these businesses before starting new prospecting',
      href: '/ops/prospects',
      urgent: true
    });
  }
  if (localReadyToContact.length > 0) {
    focusItems.push({
      title: `${localReadyToContact.length} local prospect${localReadyToContact.length === 1 ? '' : 's'} ready for first contact`,
      detail: 'Your cleaned Mason City-area list is ready to work',
      href: '/ops/prospects',
      urgent: dueFollowUps.length === 0
    });
  }
  if (data.approvals.length > 0) {
    focusItems.push({
      title: `${data.approvals.length} content item${data.approvals.length === 1 ? '' : 's'} waiting for approval`,
      detail: 'Review before anything is scheduled',
      href: '/ops/approvals',
      urgent: false
    });
  }
  if (data.audits.length > 0) {
    focusItems.push({
      title: `${data.audits.length} gap audit${data.audits.length === 1 ? '' : 's'} in draft`,
      detail: 'Finish and deliver the audit',
      href: '/ops/audits',
      urgent: false
    });
  }
  if (focusItems.length === 0) {
    focusItems.push({
      title: 'No urgent items right now',
      detail: 'Use the local prospect list or capture a new idea',
      href: '/ops/prospects',
      urgent: false
    });
  }

  const stats = [
    { label: 'Follow-ups due', value: dueFollowUps.length, href: '/ops/prospects', icon: CalendarClock, color: 'bg-red-600', alert: dueFollowUps.length > 0 },
    { label: 'Active prospects', value: activeProspects.length, href: '/ops/prospects', icon: Target, color: 'bg-blue-600' },
    { label: 'Local prospect list', value: localProspects.length, href: '/ops/prospects', icon: MapPin, color: 'bg-cyan-600' },
    { label: 'New today', value: newToday.length, href: '/ops/prospects', icon: Plus, color: 'bg-violet-600' },
    { label: 'Active clients', value: activeClients, href: '/ops/clients', icon: UserCheck, color: 'bg-emerald-600' },
    { label: 'Open audits', value: data.audits.length, href: '/ops/audits', icon: Search, color: 'bg-purple-600' },
    { label: 'Pending approvals', value: data.approvals.length, href: '/ops/approvals', icon: CheckSquare, color: 'bg-amber-600', alert: data.approvals.length > 0 },
    { label: 'Scheduled posts', value: data.scheduledPosts.length, href: '/ops/social', icon: Share2, color: 'bg-pink-600' }
  ];

  return (
    <OpsLayout>
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">NTA private office</p>
            <h1 className="mt-1 text-2xl font-black text-white">Daily dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">The few things worth seeing before you start the day.</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {lastRefresh ? `Refreshed ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[...Array(8)].map((_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-900" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Today’s focus</h2>
                  <span className="text-xs text-slate-600">{formatDate(new Date())}</span>
                </div>
                <div className="space-y-2">
                  {focusItems.slice(0, 4).map((item, index) => <FocusItem key={index} {...item} />)}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white">Pipeline at a glance</h2>
                    <p className="mt-0.5 text-xs text-slate-500">{activeProspects.length} active records</p>
                  </div>
                  <BarChart2 className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-3">
                  {pipeline.map(item => {
                    const width = activeProspects.length ? Math.max(4, Math.round((item.count / activeProspects.length) * 100)) : 4;
                    return (
                      <div key={item.status}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="capitalize text-slate-400">{item.status.replaceAll('_', ' ')}</span>
                          <span className="font-bold text-white">{item.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800">
                          <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Local prospects ready to work</h2>
                    <p className="mt-0.5 text-xs text-slate-500">The cleaned Mason City-area list, sorted by priority</p>
                  </div>
                  <Link to="/ops/prospects" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">Open list →</Link>
                </div>
                {localReadyToContact.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-500">No untouched local prospects right now.</p>
                ) : (
                  localReadyToContact.slice(0, 8).map(prospect => <ProspectLine key={prospect.id} prospect={prospect} />)
                )}
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white">Quick actions</h2>
                    <p className="mt-0.5 text-xs text-slate-500">Start with one useful action.</p>
                  </div>
                  <Users className="h-4 w-4 text-slate-500" />
                </div>
                <div className="grid gap-2">
                  <button onClick={() => setModal('prospect')} className="flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-blue-600">
                    <Plus className="h-4 w-4" /> New prospect
                  </button>
                  <button onClick={() => navigate('/ops/prospects')} className="flex items-center gap-2 rounded-xl bg-cyan-900/60 px-3 py-2.5 text-left text-sm font-semibold text-cyan-200 hover:bg-cyan-900">
                    <Target className="h-4 w-4" /> Work local prospect list
                  </button>
                  <button onClick={() => navigate('/ops/approvals')} className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5 text-left text-sm font-semibold text-slate-200 hover:bg-slate-700">
                    <CheckSquare className="h-4 w-4" /> Review approvals
                  </button>
                  <button onClick={() => navigate('/ops/social')} className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5 text-left text-sm font-semibold text-slate-200 hover:bg-slate-700">
                    <Share2 className="h-4 w-4" /> Check social queue
                  </button>
                </div>
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                  <h2 className="text-sm font-bold text-white">Recently updated</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Your most recent active prospect records</p>
                </div>
                <Link to="/ops/prospects" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">View all →</Link>
              </div>
              <div className="divide-y divide-slate-800/80">
                {activeProspects.slice(0, 6).map(prospect => (
                  <Link key={prospect.id} to="/ops/prospects" className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-800/40">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{prospect.business_name || 'Unnamed business'}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{[prospect.city, prospect.industry, prospect.status?.replaceAll('_', ' ')].filter(Boolean).join(' · ')}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-slate-600">{formatDate(prospect.updated_date || prospect.created_date)}</span>
                  </Link>
                ))}
                {activeProspects.length === 0 && <p className="p-6 text-center text-sm text-slate-500">No active prospects yet.</p>}
              </div>
            </section>
          </>
        )}
      </div>

      {modal && (
        <QuickActionModal
          type={modal}
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); load(); }}
        />
      )}
    </OpsLayout>
  );
}
