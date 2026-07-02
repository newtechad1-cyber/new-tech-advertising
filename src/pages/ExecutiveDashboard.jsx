import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Activity, TrendingUp, Users, Calendar, Briefcase, Zap,
  FileText, ChevronRight, Target, Bot, Shield, Globe,
  AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw,
  Send, Phone, Star, ArrowRight, BarChart3, Sparkles,
  Megaphone, MessageSquare, Settings, BookOpen, Cpu,
  Heart, Play, Pause, AlertTriangle, Eye, Search,
  PenSquare, ExternalLink, Sun, Moon, Coffee, Network, Brain
} from 'lucide-react';

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: Coffee, color: 'text-amber-400' };
  if (h < 17) return { text: 'Good Afternoon', icon: Sun, color: 'text-yellow-400' };
  return { text: 'Good Evening', icon: Moon, color: 'text-violet-400' };
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatCurrency(n) {
  if (!n && n !== 0) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function safeParse(str, fallback = []) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// ─────────────────────────────────────────────────
// Metric Card
// ─────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, color = 'text-white', bg = 'bg-slate-800/60', accent = 'text-slate-400', link }) {
  const inner = (
    <div className={`${bg} border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-all group`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-4 h-4 ${accent}`} />
        {link && <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />}
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
  if (link) return <Link to={link} className="block">{inner}</Link>;
  return inner;
}

// ─────────────────────────────────────────────────
// Health Dot
// ─────────────────────────────────────────────────

function HealthDot({ status }) {
  const colors = {
    healthy: 'bg-emerald-400',
    degraded: 'bg-yellow-400',
    critical: 'bg-red-400',
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${colors[status] || 'bg-slate-500'} ${status === 'healthy' ? 'animate-pulse' : ''}`} />
      <span className={`text-xs capitalize ${status === 'healthy' ? 'text-emerald-400' : status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
        {status || 'Unknown'}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────
// OS Series Health Row
// ─────────────────────────────────────────────────

function SeriesRow({ label, color, completed, inBuild, pending }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
      <span className={`text-sm font-semibold ${color}`}>{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-bold text-emerald-400">{completed}</p>
          <p className="text-xs text-slate-600">Done</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-yellow-400">{inBuild}</p>
          <p className="text-xs text-slate-600">Build</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">{pending}</p>
          <p className="text-xs text-slate-600">Pending</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Activity Feed Item
// ─────────────────────────────────────────────────

function ActivityItem({ item }) {
  const iconMap = {
    lead: <Target className="w-3.5 h-3.5 text-blue-400" />,
    audit: <Search className="w-3.5 h-3.5 text-orange-400" />,
    proposal: <FileText className="w-3.5 h-3.5 text-violet-400" />,
    social: <Megaphone className="w-3.5 h-3.5 text-pink-400" />,
    automation: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
    client: <Users className="w-3.5 h-3.5 text-emerald-400" />,
    payment: <BarChart3 className="w-3.5 h-3.5 text-green-400" />,
    system: <Settings className="w-3.5 h-3.5 text-slate-400" />,
  };
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-800/30 last:border-0">
      <div className="mt-0.5 flex-shrink-0">{iconMap[item.type] || iconMap.system}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white font-medium truncate">{item.title}</p>
        {item.desc && <p className="text-xs text-slate-500 truncate">{item.desc}</p>}
      </div>
      <span className="text-xs text-slate-600 flex-shrink-0 whitespace-nowrap">{item.time}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────
// AI Advisor Panel
// ─────────────────────────────────────────────────

function AIAdvisorPanel({ brief, onGenerate, generating }) {
  const priorities = safeParse(brief?.ai_priorities);
  const risks = safeParse(brief?.ai_risks);
  const recommendations = safeParse(brief?.ai_recommendations);

  return (
    <div className="bg-gradient-to-br from-violet-900/20 to-slate-900 border border-violet-800/30 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold">AI Executive Advisor</p>
            <p className="text-violet-300 text-xs">Morning Intelligence</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-1" />
        </div>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
        >
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {generating ? 'Generating...' : 'Run Daily Review'}
        </button>
      </div>

      {/* Morning Brief */}
      {brief?.morning_brief ? (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{brief.morning_brief}</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-4 text-center">
          <Sparkles className="w-6 h-6 text-violet-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Click "Run Daily Review" to generate today's brief</p>
        </div>
      )}

      {/* Priorities */}
      {priorities.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-yellow-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
            <Star className="w-3 h-3" /> Today's Priorities
          </p>
          <ul className="space-y-1">
            {priorities.map((p, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-yellow-500 font-bold flex-shrink-0">{i + 1}.</span> {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Risks
          </p>
          <ul className="space-y-1">
            {risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">⚠</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Recommendations
          </p>
          <ul className="space-y-1">
            {recommendations.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0">→</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────

export default function ExecutiveDashboard() {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [salesMetrics, setSalesMetrics] = useState({});
  const [opsMetrics, setOpsMetrics] = useState({});
  const [execMetrics, setExecMetrics] = useState({});
  const [osHealth, setOsHealth] = useState({});
  const [activity, setActivity] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [systemHealth, setSystemHealth] = useState('healthy');
  const greeting = getGreeting();

  // ── Load all data ──
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Run all queries in parallel
      const [leads, audits, proposals, clients, briefs, healthChecks] = await Promise.allSettled([
        base44.entities.SalesLead.list(),
        base44.entities.GapAudit.list(),
        base44.entities.NtaProposal.list(),
        base44.entities.AgencyClient?.list() || base44.entities.Client?.list() || Promise.resolve([]),
        base44.entities.ExecutiveBrief?.list() || Promise.resolve([]),
        base44.entities.SystemHealthCheck?.list() || Promise.resolve([]),
      ]);

      const allLeads = leads.status === 'fulfilled' ? (leads.value || []) : [];
      const allAudits = audits.status === 'fulfilled' ? (audits.value || []) : [];
      const allProposals = proposals.status === 'fulfilled' ? (proposals.value || []) : [];
      const allClients = clients.status === 'fulfilled' ? (clients.value || []) : [];
      const allBriefs = briefs.status === 'fulfilled' ? (briefs.value || []) : [];
      const allHealth = healthChecks.status === 'fulfilled' ? (healthChecks.value || []) : [];

      // Try loading DiscoveryCall if available
      let allCalls = [];
      try {
        allCalls = await base44.entities.DiscoveryCall?.list() || [];
      } catch { /* entity may not exist yet */ }

      // ── Sales Engine ──
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = today.substring(0, 7);
      const newLeadsToday = allLeads.filter(l => l.created_date?.startsWith(today)).length;
      const openAudits = allAudits.filter(a => a.status === 'pending' || a.status === 'in_progress').length;
      const scheduledCalls = allCalls.filter(c => c.status === 'scheduled' || c.status === 'in_progress').length;
      const waitingProposals = allProposals.filter(p => p.status === 'sent' || p.status === 'pending').length;
      const proposalValue = allProposals
        .filter(p => p.status === 'sent' || p.status === 'pending')
        .reduce((sum, p) => sum + (p.monthly_fee || 0) + (p.one_time_fee || 0), 0);
      const closedMonth = allLeads.filter(l => l.status === 'closed_won' && l.updated_date?.startsWith(thisMonth)).length;
      const pipelineValue = allProposals
        .filter(p => !['closed_lost', 'rejected', 'expired'].includes(p.status))
        .reduce((sum, p) => sum + (p.monthly_fee || 0) * 12 + (p.one_time_fee || 0), 0);

      setSalesMetrics({
        newLeadsToday,
        openAudits,
        scheduledCalls,
        waitingProposals,
        proposalValue,
        closedMonth,
        pipelineValue,
      });

      // ── Operations ──
      const onboardingClients = allClients.filter(c =>
        c.status === 'onboarding' || c.lifecycle_stage === 'onboarding'
      ).length;

      setOpsMetrics({
        clientsOnboarding: onboardingClients,
        projectsInProgress: allClients.filter(c => c.status === 'active').length,
        automationJobsRunning: 0, // Populated by brief
        automationErrors: 0,
        slackAlerts: 0,
        socialScheduled: 0,
        socialCompleted: 0,
      });

      // ── Executive ──
      setExecMetrics({
        revenueGoal: 5000, // Starting target — grows with clients
        monthlyRevenue: 800, // Johnson $500 + Monson $300
        weeklyRevenue: 200,
      });

      // ── Follow-ups ──
      const needsFollowUp = allLeads.filter(l =>
        ['contacted', 'audit_sent', 'interested', 'proposal_sent'].includes(l.status)
      ).map(l => ({
        lead: l.business_name || l.contact_name || 'Unknown',
        action: l.status === 'proposal_sent' ? 'Follow up on proposal' :
                l.status === 'audit_sent' ? 'Check audit response' :
                l.status === 'interested' ? 'Schedule discovery call' : 'Follow up',
        status: l.status,
      }));
      setFollowUps(needsFollowUp);

      // ── Activity Feed ──
      const recentItems = [];
      allLeads.slice(-5).reverse().forEach(l => {
        recentItems.push({
          type: 'lead',
          title: `Lead: ${l.business_name || l.contact_name || 'Unknown'}`,
          desc: `Status: ${(l.status || 'new').replace(/_/g, ' ')}`,
          time: l.created_date ? new Date(l.created_date).toLocaleDateString() : '—',
        });
      });
      allAudits.slice(-3).reverse().forEach(a => {
        recentItems.push({
          type: 'audit',
          title: `Audit: ${a.business_name || 'Unknown'}`,
          desc: `Score: ${a.overall_score || '—'}/100`,
          time: a.created_date ? new Date(a.created_date).toLocaleDateString() : '—',
        });
      });
      setActivity(recentItems.slice(0, 8));

      // ── OS Health (from Build Protocol knowledge) ──
      setOsHealth({
        k_series: { completed: 0, in_build: 0, pending: 'TBD' },
        e_series: { completed: 2, in_build: 1, pending: 'TBD' },
        a_series: { completed: 1, in_build: 0, pending: 'TBD' },
        m_series: { completed: 0, in_build: 1, pending: 'TBD' },
      });

      // ── Latest Brief ──
      const todayBrief = allBriefs.find(b => b.brief_date === today);
      if (todayBrief) {
        setBrief(todayBrief);
        setPersonalNotes(todayBrief.personal_notes || '');
        if (todayBrief.system_health_status) setSystemHealth(todayBrief.system_health_status);
        if (todayBrief.os_health) {
          const parsed = safeParse(todayBrief.os_health, null);
          if (parsed) setOsHealth(parsed);
        }
      }

      // ── System Health ──
      if (allHealth.length > 0) {
        const latest = allHealth[allHealth.length - 1];
        setSystemHealth(latest.overall_status || 'healthy');
      }

    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Generate Executive Brief ──
  const handleGenerateBrief = async () => {
    setGenerating(true);
    try {
      const result = await base44.functions.invoke('generateExecutiveBrief', {});
      if (result.data) {
        setBrief(result.data);
        if (result.data.personal_notes) setPersonalNotes(result.data.personal_notes);
        if (result.data.os_health) {
          const parsed = safeParse(result.data.os_health, null);
          if (parsed) setOsHealth(parsed);
        }
        // Refresh all dashboard data
        loadDashboard();
      }
    } catch (err) {
      console.error('Brief generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  // ── Save personal notes ──
  const saveNotes = useCallback(async (notes) => {
    setPersonalNotes(notes);
    if (brief?.id) {
      try {
        await base44.entities.ExecutiveBrief.update(brief.id, { personal_notes: notes });
      } catch {}
    }
  }, [brief]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* ── TOP HEADER ── */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-900 to-violet-900/20 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <greeting.icon className={`w-5 h-5 ${greeting.color}`} />
                  <h1 className="text-white font-bold text-xl">{greeting.text}, Rick.</h1>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">{formatDate()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-sm font-semibold">NTA Operating System</p>
                <p className="text-slate-500 text-xs">Release 0.1</p>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">System Health:</span>
                <HealthDot status={systemHealth} />
              </div>
              <button
                onClick={loadDashboard}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">

        {/* ── 3-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-12 gap-6">

          {/* ═══ LEFT COLUMN — Sales Engine ═══ */}
          <div className="col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <h2 className="text-white text-sm font-bold uppercase tracking-wider">Sales Engine</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={Zap} label="New Leads Today" value={salesMetrics.newLeadsToday || 0}
                color="text-blue-400" accent="text-blue-500"
                link="/admin/sales-leads"
              />
              <MetricCard
                icon={Search} label="Open Audits" value={salesMetrics.openAudits || 0}
                color="text-orange-400" accent="text-orange-500"
                link="/admin/gap-audit"
              />
              <MetricCard
                icon={Phone} label="Calls Scheduled" value={salesMetrics.scheduledCalls || 0}
                color="text-violet-400" accent="text-violet-500"
              />
              <MetricCard
                icon={FileText} label="Proposals Waiting" value={salesMetrics.waitingProposals || 0}
                color="text-pink-400" accent="text-pink-500"
                link="/admin/proposals"
              />
              <MetricCard
                icon={BarChart3} label="Proposal Value" value={formatCurrency(salesMetrics.proposalValue)}
                color="text-emerald-400" accent="text-emerald-500"
              />
              <MetricCard
                icon={CheckCircle2} label="Closed This Month" value={salesMetrics.closedMonth || 0}
                color="text-emerald-400" accent="text-emerald-500"
              />
            </div>

            {/* Pipeline Value */}
            <div className="bg-gradient-to-r from-blue-900/20 to-slate-900 border border-blue-800/30 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold">Sales Pipeline Value</p>
                  <p className="text-3xl font-black text-white mt-1">{formatCurrency(salesMetrics.pipelineValue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500/30" />
              </div>
            </div>

            {/* Follow-up Reminders */}
            {followUps.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Follow-up Reminders
                </h3>
                <div className="space-y-2">
                  {followUps.slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded-xl px-3 py-2">
                      <div>
                        <p className="text-xs text-white font-medium">{f.lead}</p>
                        <p className="text-xs text-slate-500">{f.action}</p>
                      </div>
                      <span className="text-xs text-yellow-400/70 bg-yellow-900/20 px-2 py-0.5 rounded-full">{f.status?.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ CENTER COLUMN — Operations ═══ */}
          <div className="col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-emerald-400" />
              <h2 className="text-white text-sm font-bold uppercase tracking-wider">Operations</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={Users} label="Clients Onboarding" value={opsMetrics.clientsOnboarding || 0}
                color="text-emerald-400" accent="text-emerald-500"
              />
              <MetricCard
                icon={Briefcase} label="Projects Active" value={opsMetrics.projectsInProgress || 0}
                color="text-blue-400" accent="text-blue-500"
              />
              <MetricCard
                icon={Cpu} label="Automations Running" value={brief?.automation_jobs_running || opsMetrics.automationJobsRunning || 0}
                color="text-violet-400" accent="text-violet-500"
              />
              <MetricCard
                icon={AlertCircle} label="Automation Errors" value={brief?.automation_errors || opsMetrics.automationErrors || 0}
                color={brief?.automation_errors > 0 ? 'text-red-400' : 'text-emerald-400'}
                accent={brief?.automation_errors > 0 ? 'text-red-500' : 'text-emerald-500'}
              />
              <MetricCard
                icon={AlertTriangle} label="Slack Alerts" value={brief?.slack_alerts || opsMetrics.slackAlerts || 0}
                color="text-yellow-400" accent="text-yellow-500"
              />
              <MetricCard
                icon={Megaphone} label="Social Scheduled" value={brief?.social_posts_scheduled || opsMetrics.socialScheduled || 0}
                color="text-pink-400" accent="text-pink-500"
              />
            </div>

            {/* Social Posts Completed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Social Posts Today</p>
                <span className="text-lg font-bold text-emerald-400">{brief?.social_posts_completed || opsMetrics.socialCompleted || 0}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{
                  width: `${Math.min(100, ((brief?.social_posts_completed || 0) / Math.max(1, brief?.social_posts_scheduled || 1)) * 100)}%`
                }} />
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Recent Activity
              </h3>
              {activity.length > 0 ? (
                <div className="space-y-0.5">
                  {activity.map((item, i) => <ActivityItem key={i} item={item} />)}
                </div>
              ) : (
                <p className="text-xs text-slate-600 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* ═══ RIGHT COLUMN — Executive ═══ */}
          <div className="col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-violet-400" />
              <h2 className="text-white text-sm font-bold uppercase tracking-wider">Executive</h2>
            </div>

            {/* Revenue Progress */}
            <div className="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-800/30 rounded-2xl p-4">
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-1">Revenue Goal</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-white">{formatCurrency(execMetrics.monthlyRevenue)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">of {formatCurrency(execMetrics.revenueGoal)} monthly goal</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">
                    {execMetrics.revenueGoal ? Math.round((execMetrics.monthlyRevenue / execMetrics.revenueGoal) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, execMetrics.revenueGoal ? (execMetrics.monthlyRevenue / execMetrics.revenueGoal) * 100 : 0)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Weekly: {formatCurrency(execMetrics.weeklyRevenue)}</span>
                <span>Monthly: {formatCurrency(execMetrics.monthlyRevenue)}</span>
              </div>
            </div>

            {/* Personal Notes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <PenSquare className="w-3.5 h-3.5" /> Personal Notes
              </h3>
              <textarea
                value={personalNotes}
                onChange={e => saveNotes(e.target.value)}
                placeholder="Today's thoughts, priorities, reminders..."
                rows={4}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none transition-colors"
              />
            </div>

            {/* Today's Calendar placeholder */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Today's Calendar
                </h3>
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-500 italic text-center py-3">Calendar integration coming soon</p>
            </div>
          </div>
        </div>

        {/* ── AI EXECUTIVE ADVISOR ── */}
        <AIAdvisorPanel brief={brief} onGenerate={handleGenerateBrief} generating={generating} />

        {/* ── OPERATING SYSTEM HEALTH ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              <h2 className="text-white text-sm font-bold uppercase tracking-wider">Operating System Health</h2>
            </div>
            <HealthDot status={systemHealth} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/40 rounded-xl p-4">
              <SeriesRow
                label="K-Series" color="text-blue-400"
                completed={osHealth.k_series?.completed || 0}
                inBuild={osHealth.k_series?.in_build || 0}
                pending={osHealth.k_series?.pending || 'TBD'}
              />
              <p className="text-xs text-slate-600 mt-2">Knowledge Library</p>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4">
              <SeriesRow
                label="E-Series" color="text-emerald-400"
                completed={osHealth.e_series?.completed || 0}
                inBuild={osHealth.e_series?.in_build || 0}
                pending={osHealth.e_series?.pending || 'TBD'}
              />
              <p className="text-xs text-slate-600 mt-2">Sales & Discovery</p>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4">
              <SeriesRow
                label="A-Series" color="text-orange-400"
                completed={osHealth.a_series?.completed || 0}
                inBuild={osHealth.a_series?.in_build || 0}
                pending={osHealth.a_series?.pending || 'TBD'}
              />
              <p className="text-xs text-slate-600 mt-2">Operations & Automation</p>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4">
              <SeriesRow
                label="M-Series" color="text-violet-400"
                completed={osHealth.m_series?.completed || 0}
                inBuild={osHealth.m_series?.in_build || 0}
                pending={osHealth.m_series?.pending || 'TBD'}
              />
              <p className="text-xs text-slate-600 mt-2">Measurement & Executive</p>
            </div>
          </div>
        </div>

        {/* ── INTELLIGENCE (R0.4) ── */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border border-cyan-800/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <h2 className="text-white text-sm font-bold uppercase tracking-wider">Intelligence</h2>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/knowledge-dependencies" className="text-[10px] text-violet-400 hover:text-violet-300 font-mono">
                Dependencies →
              </Link>
              <Link to="/admin/sales-intelligence" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono">
                Sales Intel →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-cyan-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Searches Today</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-emerald-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">New Connections</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-amber-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">High-Value Assets</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-violet-400">—%</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Knowledge Health</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-slate-900/40 rounded-xl p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Suggested Improvements</p>
              <p className="text-xs text-slate-400 italic">Metrics populate once searchKnowledge() is deployed.</p>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Unused Knowledge</p>
              <p className="text-xs text-slate-400 italic">Assets with no relationships or searches.</p>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Dependency Alerts</p>
              <p className="text-xs text-slate-400 italic">No active dependency alerts.</p>
            </div>
          </div>
          <div className="bg-slate-900/40 rounded-xl p-3">
            <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">AI Recommendations</p>
            <p className="text-xs text-slate-400 italic">R0.4 Intelligence Layer active. Knowledge search, capture automation, dependency tracking, and sales intelligence ready for deployment.</p>
          </div>
        </div>

        {/* ── KNOWLEDGE CONNECTIONS (K-002) ── */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-300">Knowledge Connections</h3>
            </div>
            <Link to="/admin/knowledge-navigator" className="text-[10px] text-blue-400 hover:text-blue-300 font-mono">
              Open Navigator →
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-blue-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Total Assets</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-emerald-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Connected</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-amber-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Pending Review</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-red-400">—</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Unverified</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-cyan-400">—%</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Health Score</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 mt-2 italic">Knowledge health metrics populate once Knowledge Navigator is deployed and connections are approved.</p>
        </div>

        {/* ── NAVIGATION BUTTONS ── */}
        <div className="grid grid-cols-9 gap-3">
          {[
            { label: 'Run Daily Review', icon: Play, action: handleGenerateBrief, accent: 'bg-violet-600 hover:bg-violet-500 text-white' },
            { label: 'Executive Notes', icon: PenSquare, link: '#notes', accent: 'bg-slate-800 hover:bg-slate-700 text-slate-300' },
            { label: 'Open Sales', icon: Target, link: '/admin/sales-leads', accent: 'bg-slate-800 hover:bg-slate-700 text-slate-300' },
            { label: 'Client Success', icon: Heart, link: '/admin/clients', accent: 'bg-slate-800 hover:bg-slate-700 text-slate-300' },
            { label: 'Operations', icon: Settings, link: '/admin/operations', accent: 'bg-slate-800 hover:bg-slate-700 text-slate-300' },
            { label: 'AI Lab', icon: Bot, link: '/admin/ai-lab', accent: 'bg-slate-800 hover:bg-slate-700 text-slate-300' },
            { label: 'Knowledge Navigator', icon: BookOpen, link: '/admin/knowledge-navigator', accent: 'bg-slate-800 hover:bg-slate-700 text-slate-300' },
            { label: 'Sales Intel', icon: Search, link: '/admin/sales-intelligence', accent: 'bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300 border border-cyan-800/30' },
            { label: 'Dependencies', icon: Network, link: '/admin/knowledge-dependencies', accent: 'bg-violet-900/50 hover:bg-violet-800/50 text-violet-300 border border-violet-800/30' },
          ].map((btn, i) => {
            const inner = (
              <div className={`${btn.accent} rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer`}>
                <btn.icon className="w-4 h-4" />
                <span className="text-xs font-semibold">{btn.label}</span>
              </div>
            );
            if (btn.action) return <button key={i} onClick={btn.action}>{inner}</button>;
            if (btn.link?.startsWith('#')) return <div key={i}>{inner}</div>;
            return <Link key={i} to={btn.link}>{inner}</Link>;
          })}
        </div>
      </div>
    </div>
  );
}
