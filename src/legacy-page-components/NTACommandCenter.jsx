import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
// Unified NTA Operating System - Command Center
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Inbox, Building2, Target, FolderKanban, Megaphone, CheckSquare,
  Activity, Heart, AlertTriangle, RefreshCw, Loader2, ArrowRight,
  Clock, XCircle, Zap, Users, TrendingUp
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, href, loading }) {
  return (
    <Link to={href || '#'}>
      <div className={`bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-all cursor-pointer`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs font-medium">{label}</span>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        {loading ? (
          <div className="h-7 w-12 bg-slate-700 rounded animate-pulse" />
        ) : (
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        )}
      </div>
    </Link>
  );
}

function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-white font-semibold text-sm">{title}</h2>
      {href && <Link to={href} className="text-violet-400 text-xs hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>}
    </div>
  );
}

export default function NTACommandCenter() {
  const [data, setData] = useState({
    submissions: [], opportunities: [], tasks: [], projects: [], campaigns: [], activities: []
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [submissions, opportunities, tasks, projects, campaigns, activities] = await Promise.all([
      base44.entities.Submission.list('-created_date', 100),
      base44.entities.NTAOpportunity.list('-created_date', 100),
      base44.entities.NTATask.list('-created_date', 100),
      base44.entities.NTAClientProject.list('-created_date', 100),
      base44.entities.NTACampaign.list('-created_date', 100),
      base44.entities.NTAActivity.list('-created_date', 50),
    ]);
    setData({ submissions, opportunities, tasks, projects, campaigns, activities });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().slice(0, 10);

  const newSubmissions = data.submissions.filter(s => s.processing_status === 'new');
  const webhookFailed = data.submissions.filter(s => s.webhook_status === 'failed');
  const unmatchedSubs = data.submissions.filter(s => !s.matched_company_id && s.processing_status === 'new');
  const overdueTasks = data.tasks.filter(t => t.status === 'todo' && t.due_date && t.due_date < today);
  const todayTasks = data.tasks.filter(t => t.status === 'todo' && t.due_date === today);
  const openOpps = data.opportunities.filter(o => o.status === 'open');
  const demoScheduled = data.opportunities.filter(o => o.stage === 'demo_scheduled');
  const proposalDue = data.opportunities.filter(o => o.stage === 'proposal_sent');
  const activeProjects = data.projects.filter(p => p.status === 'in_progress');
  const activeCampaigns = data.campaigns.filter(c => c.status === 'active');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">NTA Command Center</h1>
            <p className="text-slate-400 text-sm">Unified operating system — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <Button onClick={load} disabled={loading} variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

        {/* Alert Row */}
        {(webhookFailed.length > 0 || overdueTasks.length > 0 || unmatchedSubs.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {webhookFailed.length > 0 && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm font-medium">{webhookFailed.length} webhook failure{webhookFailed.length > 1 ? 's' : ''}</span>
                <Link to="/nta/submissions?webhook_status=failed" className="text-red-400 text-xs hover:underline ml-1">Fix →</Link>
              </div>
            )}
            {overdueTasks.length > 0 && (
              <div className="flex items-center gap-2 bg-orange-900/30 border border-orange-700 rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-orange-300 text-sm font-medium">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</span>
                <Link to="/nta/tasks?overdue=true" className="text-orange-400 text-xs hover:underline ml-1">View →</Link>
              </div>
            )}
            {unmatchedSubs.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-700 rounded-lg px-3 py-2">
                <Inbox className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-yellow-300 text-sm font-medium">{unmatchedSubs.length} unmatched submission{unmatchedSubs.length > 1 ? 's' : ''}</span>
                <Link to="/nta/submissions?unmatched=true" className="text-yellow-400 text-xs hover:underline ml-1">Review →</Link>
              </div>
            )}
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="New Submissions" value={newSubmissions.length} icon={Inbox} color="text-blue-400" href="/nta/submissions" loading={loading} />
          <StatCard label="Open Opportunities" value={openOpps.length} icon={Target} color="text-violet-400" href="/nta/opportunities" loading={loading} />
          <StatCard label="Active Projects" value={activeProjects.length} icon={FolderKanban} color="text-emerald-400" href="/nta/projects" loading={loading} />
          <StatCard label="Due Today" value={todayTasks.length} icon={Clock} color="text-amber-400" href="/nta/tasks" loading={loading} />
          <StatCard label="Active Campaigns" value={activeCampaigns.length} icon={Megaphone} color="text-cyan-400" href="/nta/campaigns" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* New Submissions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <SectionHeader title="New Submissions" href="/nta/submissions" />
            {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />)}</div>
            : newSubmissions.length === 0 ? <p className="text-slate-500 text-sm py-4 text-center">No new submissions</p>
            : (
              <div className="space-y-2">
                {newSubmissions.slice(0, 5).map(s => (
                  <Link key={s.id} to="/nta/submissions" className="block bg-slate-800 rounded-lg p-3 hover:border-slate-600 border border-transparent transition-all">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-medium truncate">{s.business_name || s.name || 'Unknown'}</p>
                      <Badge className="bg-blue-900 text-blue-300 border-0 text-xs shrink-0 ml-2">{s.submission_type}</Badge>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{s.source_system} · {new Date(s.created_date).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <SectionHeader title="Pipeline Highlights" href="/nta/opportunities" />
            <div className="space-y-3">
              {[
                { label: 'Demos Scheduled', items: demoScheduled, color: 'text-cyan-400', icon: Users },
                { label: 'Proposals Sent', items: proposalDue, color: 'text-violet-400', icon: TrendingUp },
              ].map(({ label, items, color, icon: Icon }) => (
                <div key={label} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-slate-300 text-xs font-medium">{label}</span>
                    </div>
                    <span className={`text-lg font-bold ${color}`}>{items.length}</span>
                  </div>
                  {items.slice(0, 2).map(o => (
                    <p key={o.id} className="text-slate-500 text-xs truncate">· {o.opportunity_name}</p>
                  ))}
                </div>
              ))}
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-400 text-xs font-medium mb-2">By Stage</p>
                {['new','qualified','contacted','demo_scheduled','proposal_sent','won'].map(stage => {
                  const count = data.opportunities.filter(o => o.stage === stage).length;
                  if (!count) return null;
                  return (
                    <div key={stage} className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{stage.replace('_', ' ')}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tasks & Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <SectionHeader title="Today's Tasks" href="/nta/tasks" />
            {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse" />)}</div>
            : todayTasks.length === 0 && overdueTasks.length === 0 ? <p className="text-slate-500 text-sm py-4 text-center">All clear ✓</p>
            : (
              <div className="space-y-1.5">
                {overdueTasks.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <p className="text-red-200 text-xs truncate flex-1">{t.title}</p>
                    <span className="text-red-500 text-xs shrink-0">Overdue</span>
                  </div>
                ))}
                {todayTasks.slice(0, 4).map(t => (
                  <div key={t.id} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                    <CheckSquare className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <p className="text-slate-300 text-xs truncate flex-1">{t.title}</p>
                    <Badge className={`text-xs border-0 shrink-0 ${t.priority === 'urgent' ? 'bg-red-900 text-red-300' : t.priority === 'high' ? 'bg-orange-900 text-orange-300' : 'bg-slate-700 text-slate-400'}`}>{t.priority}</Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800">
              <SectionHeader title="Recent Activity" href="/nta/activity" />
              <div className="space-y-1.5">
                {data.activities.slice(0, 4).map(a => (
                  <div key={a.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-300 text-xs">{a.title}</p>
                      <p className="text-slate-600 text-xs">{new Date(a.created_date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nav Grid */}
        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Quick Navigate</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Submissions', icon: Inbox, href: '/nta/submissions', color: 'text-blue-400' },
              { label: 'Companies', icon: Building2, href: '/nta/companies', color: 'text-emerald-400' },
              { label: 'Opportunities', icon: Target, href: '/nta/opportunities', color: 'text-violet-400' },
              { label: 'Projects', icon: FolderKanban, href: '/nta/projects', color: 'text-cyan-400' },
              { label: 'Campaigns', icon: Megaphone, href: '/nta/campaigns', color: 'text-orange-400' },
              { label: 'Tasks', icon: CheckSquare, href: '/nta/tasks', color: 'text-amber-400' },
              { label: 'Activity', icon: Activity, href: '/nta/activity', color: 'text-slate-400' },
              { label: 'Clients', icon: Users, href: '/nta/clients', color: 'text-green-400' },
              { label: 'System Health', icon: Heart, href: '/nta/system-health', color: 'text-red-400' },
            ].map(({ label, icon: Icon, href, color }) => (
              <Link key={href} to={href}>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-all flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-slate-300 text-sm font-medium">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}