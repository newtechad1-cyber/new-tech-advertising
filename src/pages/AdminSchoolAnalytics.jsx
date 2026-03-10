import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  BarChart3, FileText, Video, Users, BookOpen, Cpu,
  Star, CalendarDays, Loader2, ChevronDown, TrendingUp
} from 'lucide-react';
import { subMonths, startOfMonth, endOfMonth, format, isWithinInterval, parseISO } from 'date-fns';

// ── date range helpers ──────────────────────────────────────────────────────

const RANGES = [
  { label: 'Last 30 days',   months: 1 },
  { label: 'Last 3 months',  months: 3 },
  { label: 'Last 6 months',  months: 6 },
  { label: 'This year',      months: 12 },
  { label: 'All time',       months: null },
];

function rangeInterval(months) {
  if (!months) return null;
  const now = new Date();
  return { start: subMonths(now, months), end: now };
}

function inRange(dateStr, interval) {
  if (!interval || !dateStr) return true;
  try { return isWithinInterval(parseISO(dateStr), interval); } catch { return false; }
}

// Build last N month buckets (label + start/end)
function buildMonthBuckets(n) {
  const buckets = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = subMonths(new Date(), i);
    buckets.push({
      label: format(d, 'MMM yy'),
      start: startOfMonth(d),
      end: endOfMonth(d),
    });
  }
  return buckets;
}

function countByMonth(records, dateField, buckets) {
  return buckets.map(b => {
    const count = records.filter(r => {
      if (!r[dateField]) return false;
      try { return isWithinInterval(parseISO(r[dateField]), { start: b.start, end: b.end }); }
      catch { return false; }
    }).length;
    return { label: b.label, count };
  });
}

// ── KPI card ────────────────────────────────────────────────────────────────

function KPICard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`rounded-xl border border-gray-200 p-5 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <Icon className="h-7 w-7 text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}

// ── main component ──────────────────────────────────────────────────────────

export default function AdminSchoolAnalytics() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';

  const [rangeIdx, setRangeIdx]       = useState(2); // default: last 6 months
  const [loading, setLoading]         = useState(true);

  // raw entity data
  const [submissions, setSubmissions] = useState([]);
  const [stories, setStories]         = useState([]);
  const [projects, setProjects]       = useState([]);
  const [renders, setRenders]         = useState([]);
  const [events, setEvents]           = useState([]);
  const [spotlights, setSpotlights]   = useState([]);
  const [yearbookPages, setYearbook]  = useState([]);
  const [aiJobs, setAiJobs]           = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [sub, sto, proj, ren, ev, spot, yb, ai] = await Promise.all([
        base44.entities.SchoolSubmissions.filter({ school: schoolSlug }, '-created_date', 2000),
        base44.entities.Stories.filter({ school_slug: schoolSlug }, '-created_date', 2000),
        base44.entities.SchoolVideoProjects.filter({ school: schoolSlug }, '-created_date', 2000),
        base44.entities.SchoolVideoRenders.list('-created_date', 2000),
        base44.entities.SchoolEvents.filter({ school_slug: schoolSlug }, '-created_date', 2000),
        base44.entities.Spotlights.filter({ school_slug: schoolSlug }, '-created_date', 2000),
        base44.entities.YearbookPages.filter({ school_slug: schoolSlug }, '-created_date', 2000),
        base44.entities.AIContentJobs.filter({ school_slug: schoolSlug }, '-created_date', 2000),
      ]);
      setSubmissions(sub || []);
      setStories(sto || []);
      setProjects(proj || []);
      setRenders(ren || []);
      setEvents(ev || []);
      setSpotlights(spot || []);
      setYearbook(yb || []);
      setAiJobs(ai || []);
      setLoading(false);
    };
    load();
  }, [schoolSlug]);

  const interval = useMemo(() => rangeInterval(RANGES[rangeIdx].months), [rangeIdx]);

  // Filter records to selected date range
  const f = (arr, dateField = 'created_date') => arr.filter(r => inRange(r[dateField], interval));

  const fSub    = useMemo(() => f(submissions),   [submissions, interval]);
  const fStory  = useMemo(() => f(stories),        [stories, interval]);
  const fProj   = useMemo(() => f(projects),       [projects, interval]);
  const fEv     = useMemo(() => f(events),         [events, interval]);
  const fSpot   = useMemo(() => f(spotlights),     [spotlights, interval]);
  const fYb     = useMemo(() => f(yearbookPages),  [yearbookPages, interval]);
  const fAi     = useMemo(() => f(aiJobs),         [aiJobs, interval]);

  // Renders scoped to school projects
  const schoolProjectIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);
  const fRender = useMemo(
    () => renders.filter(r => schoolProjectIds.has(r.project_id) && inRange(r.created_date, interval)),
    [renders, schoolProjectIds, interval]
  );

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const uniqueContributors = new Set(fSub.map(s => s.contributor_email).filter(Boolean)).size;
    const approvedSubs       = fSub.filter(s => s.status === 'approved').length;
    const publishedStories   = fStory.filter(s => s.publish_status === 'published').length;
    const publishedVideos    = fProj.filter(p => p.status === 'published' || p.publish_status === 'published').length;
    const completedRenders   = fRender.filter(r => r.status === 'completed').length;
    const aiCompleted        = fAi.filter(j => j.status === 'completed').length;
    const publishedYb        = fYb.filter(p => p.publish_status === 'published').length;

    return [
      {
        icon: FileText,  label: 'Total Submissions',   value: fSub.length,
        sub: `${approvedSubs} approved`,               color: 'bg-blue-50',
      },
      {
        icon: Users,     label: 'Unique Contributors', value: uniqueContributors,
        sub: 'distinct emails',                        color: 'bg-pink-50',
      },
      {
        icon: BookOpen,  label: 'Published Stories',   value: publishedStories,
        sub: `${fStory.length} total stories`,         color: 'bg-green-50',
      },
      {
        icon: Video,     label: 'Published Videos',    value: publishedVideos,
        sub: `${completedRenders} renders completed`,  color: 'bg-purple-50',
      },
      {
        icon: CalendarDays, label: 'Events',           value: fEv.length,
        sub: `${fSpot.length} spotlights`,             color: 'bg-yellow-50',
      },
      {
        icon: BookOpen,  label: 'Yearbook Pages',      value: fYb.length,
        sub: `${publishedYb} published`,               color: 'bg-teal-50',
      },
      {
        icon: Cpu,       label: 'AI Jobs Run',         value: fAi.length,
        sub: `${aiCompleted} completed`,               color: 'bg-orange-50',
      },
      {
        icon: Video,     label: 'Video Projects',      value: fProj.length,
        sub: `${fRender.length} render jobs`,          color: 'bg-indigo-50',
      },
    ];
  }, [fSub, fStory, fProj, fRender, fEv, fSpot, fYb, fAi]);

  // ── Monthly trend chart ──────────────────────────────────────────────────
  const chartMonths = RANGES[rangeIdx].months || 12;
  const buckets = useMemo(() => buildMonthBuckets(Math.min(chartMonths, 12)), [chartMonths]);

  const trendData = useMemo(() => {
    const subCounts   = countByMonth(submissions.filter(r => schoolProjectIds.has(r.project_id) || true), 'created_date', buckets);
    // re-use full (unfiltered) arrays for monthly chart so buckets stay stable
    const storyCounts = countByMonth(stories,   'created_date', buckets);
    const vidCounts   = countByMonth(projects,  'created_date', buckets);
    const aiCounts    = countByMonth(aiJobs,    'created_date', buckets);

    return buckets.map((b, i) => ({
      month:       b.label,
      Submissions: subCounts[i].count,
      Stories:     storyCounts[i].count,
      Videos:      vidCounts[i].count,
      'AI Jobs':   aiCounts[i].count,
    }));
  }, [submissions, stories, projects, aiJobs, buckets]);

  // ── Submission activity type breakdown ───────────────────────────────────
  const activityBreakdown = useMemo(() => {
    const map = {};
    fSub.forEach(s => {
      const k = s.activity_type || 'other';
      map[k] = (map[k] || 0) + 1;
    });
    const total = fSub.length || 1;
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k, v]) => ({ label: k.replace(/_/g, ' '), count: v, pct: Math.round((v / total) * 100) }));
  }, [fSub]);

  // ── Monthly breakdown table ───────────────────────────────────────────────
  const monthlyTable = useMemo(() => {
    return [...buckets].reverse().map(b => {
      const inB = (arr, df = 'created_date') =>
        arr.filter(r => { try { return isWithinInterval(parseISO(r[df] || ''), { start: b.start, end: b.end }); } catch { return false; } });
      const bSub  = inB(submissions);
      const bContribs = new Set(bSub.map(s => s.contributor_email).filter(Boolean)).size;
      return {
        label:        b.label,
        submissions:  bSub.length,
        stories:      inB(stories).length,
        videos:       inB(projects).length,
        aiJobs:       inB(aiJobs).length,
        contributors: bContribs,
      };
    });
  }, [buckets, submissions, stories, projects, aiJobs]);

  if (loading) {
    return (
      <AdminShell schoolSlug={schoolSlug}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Analytics
              </h1>
              <p className="text-gray-500 text-sm mt-1">Real-time metrics from school content entities</p>
            </div>
            {/* Date range selector */}
            <div className="relative">
              <select
                value={rangeIdx}
                onChange={e => setRangeIdx(Number(e.target.value))}
                className="pl-4 pr-9 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

          {/* KPI cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k, i) => <KPICard key={i} {...k} />)}
          </div>

          {/* Trend chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Monthly Activity Trend</h2>
            <p className="text-xs text-gray-400 mb-5">Submissions · Stories · Video Projects · AI Jobs</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Submissions" fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="Stories"     fill="#22c55e" radius={[3,3,0,0]} />
                <Bar dataKey="Videos"      fill="#a855f7" radius={[3,3,0,0]} />
                <Bar dataKey="AI Jobs"     fill="#f97316" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Two-column: activity breakdown + AI job types */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Submissions by activity type */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Submissions by Activity Type</h2>
              {activityBreakdown.length === 0 ? (
                <p className="text-sm text-gray-400">No submissions in this period.</p>
              ) : (
                <div className="space-y-3">
                  {activityBreakdown.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900">{item.count} <span className="font-normal text-gray-400">({item.pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI job type breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">AI Jobs by Type</h2>
              {fAi.length === 0 ? (
                <p className="text-sm text-gray-400">No AI jobs in this period.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    fAi.reduce((acc, j) => { acc[j.job_type] = (acc[j.job_type] || 0) + 1; return acc; }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count], i) => {
                      const pct = Math.round((count / fAi.length) * 100);
                      return (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">{type.replace(/_/g, ' ')}</span>
                            <span className="text-sm font-bold text-gray-900">
                              {count} <span className="font-normal text-gray-400">({pct}%)</span>
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Monthly breakdown table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Monthly Breakdown</h2>
              <p className="text-xs text-gray-400 mt-0.5">Most recent months first</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Month', 'Submissions', 'Contributors', 'Stories', 'Videos', 'AI Jobs'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthlyTable.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-900 text-sm">{row.label}</td>
                    <td className="px-5 py-3 text-gray-700 text-sm">{row.submissions}</td>
                    <td className="px-5 py-3 text-gray-700 text-sm">{row.contributors}</td>
                    <td className="px-5 py-3 text-gray-700 text-sm">{row.stories}</td>
                    <td className="px-5 py-3 text-gray-700 text-sm">{row.videos}</td>
                    <td className="px-5 py-3 text-gray-700 text-sm">{row.aiJobs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminShell>
  );
}