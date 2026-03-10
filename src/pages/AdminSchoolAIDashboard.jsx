import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { useSchoolPermissions } from '@/components/school-tv/useSchoolPermissions';
import PermissionGuard from '@/components/school-tv/PermissionGuard';
import { Button } from '@/components/ui/button';
import {
  Sparkles, CheckCircle2, AlertCircle, Clock, XCircle,
  Loader2, RefreshCw, Eye, ChevronDown, ExternalLink,
  Zap, BarChart3
} from 'lucide-react';
import { formatDistanceToNow, parseISO, subDays, isAfter } from 'date-fns';

// ── constants ────────────────────────────────────────────────────────────────

const JOB_TYPE_LABELS = {
  story_generation:    'Story Generation',
  yearbook_generation: 'Yearbook Generation',
  event_recap:         'Event Recap',
  spotlight_summary:   'Spotlight Summary',
  video_script:        'Video Script',
  caption_generation:  'Caption Generation',
};

const STATUS_CONFIG = {
  pending:        { label: 'Queued',     color: 'bg-gray-100 text-gray-700',    icon: Clock },
  processing:     { label: 'Running',    color: 'bg-blue-100 text-blue-700',    icon: Loader2, spin: true },
  completed:      { label: 'Completed',  color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  failed:         { label: 'Failed',     color: 'bg-red-100 text-red-700',      icon: XCircle },
  pending_review: { label: 'Needs Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  approved:       { label: 'Approved',   color: 'bg-green-100 text-green-800',  icon: CheckCircle2 },
  rejected:       { label: 'Rejected',   color: 'bg-red-100 text-red-800',      icon: XCircle },
  archived:       { label: 'Archived',   color: 'bg-gray-100 text-gray-500',    icon: Clock },
};

// Map source_entity_type → page name for linking
const ENTITY_PAGE_MAP = {
  StudentVideoSubmissions: 'AdminSubmissionDetail',
  Stories:                 'AdminStoryDetail',
  YearbookPages:           'AdminYearbookPage',
  SchoolEvents:            'AdminSchoolEventDetail',
  Spotlights:              'AdminSchoolSpotlightDetail',
  VideoProjects:           'AdminSchoolProjectDetail',
};

const DATE_RANGES = [
  { label: 'Today',        days: 1 },
  { label: 'Last 7 days',  days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'All time',     days: null },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className={`h-3 w-3 ${cfg.spin ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
}

function sourceLink(job, schoolSlug) {
  if (!job.source_entity_id || !job.source_entity_type) return null;
  const page = ENTITY_PAGE_MAP[job.source_entity_type];
  if (!page) return null;
  // school-scoped pages need schoolSlug param
  const schoolPages = ['AdminSchoolEventDetail', 'AdminSchoolSpotlightDetail', 'AdminSchoolProjectDetail'];
  const base = createPageUrl(page);
  const qs = schoolPages.includes(page)
    ? `?id=${job.source_entity_id}&schoolSlug=${schoolSlug}`
    : `?id=${job.source_entity_id}`;
  return `${base}${qs}`;
}

function relativeTime(dateStr) {
  if (!dateStr) return '—';
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); }
  catch { return dateStr; }
}

// ── main component ────────────────────────────────────────────────────────────

export default function AdminSchoolAIDashboard() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const { can } = useSchoolPermissions(schoolSlug);

  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [retrying, setRetrying] = useState(null); // job id being retried

  // filters
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [typeFilter,     setTypeFilter]      = useState('all');
  const [entityFilter,   setEntityFilter]    = useState('all');
  const [dateRangeIdx,   setDateRangeIdx]    = useState(2); // last 30 days
  const [search,         setSearch]          = useState('');

  const [activeTab, setActiveTab] = useState('queue');

  // ── load ────────────────────────────────────────────────────────────────────
  const loadJobs = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities.AIContentJobs.filter(
      { school_slug: schoolSlug },
      '-created_date',
      500
    );
    setJobs(data || []);
    setLoading(false);
  }, [schoolSlug]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // ── retry failed job ─────────────────────────────────────────────────────────
  const handleRetry = async (job) => {
    setRetrying(job.id);
    await base44.entities.AIContentJobs.update(job.id, {
      status: 'pending',
      error_log: null,
    });
    await loadJobs();
    setRetrying(null);
  };

  // ── approve / reject ─────────────────────────────────────────────────────────
  const handleApprove = async (job) => {
    await base44.entities.AIContentJobs.update(job.id, { status: 'approved' });
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'approved' } : j));
  };

  const handleReject = async (job) => {
    await base44.entities.AIContentJobs.update(job.id, { status: 'rejected' });
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'rejected' } : j));
  };

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => ({
    total:         jobs.length,
    queued:        jobs.filter(j => j.status === 'pending').length,
    running:       jobs.filter(j => j.status === 'processing').length,
    completed:     jobs.filter(j => j.status === 'completed').length,
    pendingReview: jobs.filter(j => j.status === 'pending_review').length,
    approved:      jobs.filter(j => j.status === 'approved').length,
    failed:        jobs.filter(j => j.status === 'failed').length,
  }), [jobs]);

  // ── filtered jobs ─────────────────────────────────────────────────────────────
  const displayed = useMemo(() => {
    let result = jobs;
    const days = DATE_RANGES[dateRangeIdx].days;
    if (days) {
      const cutoff = subDays(new Date(), days);
      result = result.filter(j => j.created_date && isAfter(parseISO(j.created_date), cutoff));
    }
    if (statusFilter !== 'all') result = result.filter(j => j.status === statusFilter);
    if (typeFilter   !== 'all') result = result.filter(j => j.job_type === typeFilter);
    if (entityFilter !== 'all') result = result.filter(j => j.source_entity_type === entityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        (j.job_type || '').toLowerCase().includes(q) ||
        (j.source_entity_type || '').toLowerCase().includes(q) ||
        (j.source_entity_id || '').toLowerCase().includes(q) ||
        (j.requested_by || '').toLowerCase().includes(q) ||
        (j.output_text || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [jobs, statusFilter, typeFilter, entityFilter, dateRangeIdx, search]);

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
                AI Automation Engine
              </h1>
              <p className="text-gray-500 text-sm mt-1">Live job queue and content generation activity</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadJobs} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">

          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Jobs',     value: kpis.total,         color: 'bg-gray-50',    icon: BarChart3 },
              { label: 'Queued',         value: kpis.queued,        color: 'bg-gray-50',    icon: Clock },
              { label: 'Running',        value: kpis.running,       color: 'bg-blue-50',    icon: Loader2 },
              { label: 'Completed',      value: kpis.completed,     color: 'bg-green-50',   icon: CheckCircle2 },
              { label: 'Needs Review',   value: kpis.pendingReview, color: 'bg-yellow-50',  icon: AlertCircle },
              { label: 'Failed',         value: kpis.failed,        color: 'bg-red-50',     icon: XCircle },
            ].map(({ label, value, color, icon: Icon }, i) => (
              <div key={i} className={`rounded-xl border border-gray-200 p-4 ${color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'queue',      label: '⚙️ Job Queue' },
              { key: 'guidelines', label: '📚 AI Guidelines' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Job Queue tab ───────────────────────────────────────────────── */}
          {activeTab === 'queue' && (
            <>
              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
                {/* Search */}
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by type, entity, requester..."
                  className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Status filter */}
                <div className="relative">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">All Statuses</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Job type filter */}
                <div className="relative">
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">All Types</option>
                    {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Source entity filter */}
                <div className="relative">
                  <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">All Sources</option>
                    {Object.keys(ENTITY_PAGE_MAP).map(k => (
                      <option key={k} value={k}>{k.replace(/([A-Z])/g, ' $1').trim()}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Date range */}
                <div className="relative">
                  <select value={dateRangeIdx} onChange={e => setDateRangeIdx(Number(e.target.value))}
                    className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {DATE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <span className="text-xs text-gray-400 ml-auto">{displayed.length} job{displayed.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              )}

              {/* Empty */}
              {!loading && displayed.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Sparkles className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">No AI jobs found</p>
                  <p className="text-gray-400 text-sm mt-1">Try changing your filters or trigger a job from a submission or project.</p>
                </div>
              )}

              {/* Job table */}
              {!loading && displayed.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Job Type', 'Status', 'Source', 'Output Preview', 'Requested By', 'Created', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayed.map(job => {
                        const link = sourceLink(job, schoolSlug);
                        const outputPreview = job.output_text
                          ? job.output_text.replace(/\n/g, ' ').slice(0, 60) + (job.output_text.length > 60 ? '…' : '')
                          : null;

                        return (
                          <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                            {/* Type */}
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-gray-900">
                                {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <StatusBadge status={job.status} />
                            </td>

                            {/* Source entity */}
                            <td className="px-4 py-3">
                              {job.source_entity_type ? (
                                <div>
                                  <p className="text-xs font-semibold text-gray-700">
                                    {job.source_entity_type.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  {link ? (
                                    <Link to={link} className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
                                      {job.source_entity_id?.slice(0, 8)}…
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  ) : (
                                    <span className="text-xs text-gray-400">{job.source_entity_id?.slice(0, 8)}…</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>

                            {/* Output preview */}
                            <td className="px-4 py-3 max-w-xs">
                              {job.status === 'failed' && job.error_log ? (
                                <span className="text-xs text-red-500 line-clamp-2">{job.error_log.slice(0, 80)}…</span>
                              ) : outputPreview ? (
                                <span className="text-xs text-gray-600 line-clamp-2">{outputPreview}</span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>

                            {/* Requested by */}
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {job.requested_by || '—'}
                            </td>

                            {/* Created */}
                            <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                              {relativeTime(job.created_date)}
                              {job.completed_at && (
                                <div className="text-green-500 mt-0.5">
                                  Done {relativeTime(job.completed_at)}
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap">
                                {/* View source */}
                                {link && (
                                  <Link to={link}>
                                    <Button variant="ghost" size="sm" className="text-blue-600 h-7 px-2">
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </Link>
                                )}
                                {/* Approve pending_review */}
                                {job.status === 'pending_review' && (
                                  <Button variant="ghost" size="sm" className="text-green-600 h-7 px-2" onClick={() => handleApprove(job)}>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                                {/* Reject pending_review */}
                                {job.status === 'pending_review' && (
                                  <Button variant="ghost" size="sm" className="text-red-500 h-7 px-2" onClick={() => handleReject(job)}>
                                    <XCircle className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                                {/* Retry failed */}
                                {job.status === 'failed' && (
                                  <Button
                                    variant="ghost" size="sm"
                                    className="text-orange-500 h-7 px-2 gap-1"
                                    onClick={() => handleRetry(job)}
                                    disabled={retrying === job.id}
                                  >
                                    <RefreshCw className={`h-3.5 w-3.5 ${retrying === job.id ? 'animate-spin' : ''}`} />
                                    <span className="text-xs">Retry</span>
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── Guidelines tab (static) ────────────────────────────────────── */}
          {activeTab === 'guidelines' && (
            <div className="space-y-5">
              {[
                { title: 'School-Safe Content Rules', items: ['No controversial or sensitive speculation', 'No personal judgments or criticism', 'No unsupported claims or exaggeration', 'No corporate promotional tone', 'Focus on activities, teamwork, learning, and community'] },
                { title: 'Moderation Standards', items: ['All AI outputs are draft content first', 'Nothing AI-generated publishes automatically', 'Staff can approve, reject, or edit AI outputs', 'Store both original AI output and edited human version', 'Clear "AI Draft" status labels in admin interface'] },
                { title: 'Output Quality Standards', items: ['Factually accurate and verified', 'Age-appropriate and school safe', 'Free from exaggeration or unsupported claims', 'Inclusive and respectful language', 'Suitable for public viewing by parents and community'] },
              ].map((section, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-2.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </AdminShell>
  );
}