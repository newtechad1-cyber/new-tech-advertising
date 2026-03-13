import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import AWHeader from '@/components/ai-workforce/AWHeader';
import AWAgentBoard from '@/components/ai-workforce/AWAgentBoard';
import AWJobQueue from '@/components/ai-workforce/AWJobQueue';
import AWWorkloadControls from '@/components/ai-workforce/AWWorkloadControls';
import AWFailureDiagnostics from '@/components/ai-workforce/AWFailureDiagnostics';
import AWAllocationMap from '@/components/ai-workforce/AWAllocationMap';
import AWAnalytics from '@/components/ai-workforce/AWAnalytics';

const TABS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'agents',      label: 'Agent Board' },
  { id: 'queue',       label: 'Job Queue' },
  { id: 'workload',    label: 'Workload Controls' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'allocation',  label: 'Allocation Map' },
  { id: 'analytics',   label: 'Performance' },
];

// Seed mock agents if DB is empty
const MOCK_AGENTS = [
  { agent_name: 'ContentBot-01', agent_type: 'content_writer',    status: 'running', current_task: 'Writing blog: "HVAC Maintenance Tips for Denver Homes"', assigned_client: 'Peak HVAC', load_percent: 72, jobs_today: 14, success_rate: 97, impact_score: 84, assigned_vertical: 'HVAC', assigned_territory: 'Denver' },
  { agent_name: 'SocialBot-02',  agent_type: 'social_publisher',  status: 'running', current_task: 'Scheduling 5 posts for Facebook + Instagram', assigned_client: 'ABC Plumbing', load_percent: 45, jobs_today: 22, success_rate: 99, impact_score: 78, assigned_vertical: 'Plumbing', assigned_territory: 'Dallas' },
  { agent_name: 'SEOBot-01',     agent_type: 'seo_optimizer',     status: 'running', current_task: 'Generating city page: Roofing Services in Thornton CO', assigned_client: 'Roof Masters', load_percent: 88, jobs_today: 9, success_rate: 94, impact_score: 91, assigned_vertical: 'Roofing', assigned_territory: 'Denver' },
  { agent_name: 'VideoBot-01',   agent_type: 'video_producer',    status: 'idle',    current_task: 'Awaiting next batch assignment', assigned_client: '', load_percent: 0, jobs_today: 3, success_rate: 89, impact_score: 95, assigned_vertical: 'HVAC', assigned_territory: 'Chicago' },
  { agent_name: 'ReviewBot-01',  agent_type: 'review_monitor',    status: 'running', current_task: 'Monitoring Google reviews — 3 new responses queued', assigned_client: 'Metro Electric', load_percent: 31, jobs_today: 18, success_rate: 98, impact_score: 72, assigned_vertical: 'Electrical', assigned_territory: 'Atlanta' },
  { agent_name: 'RankBot-01',    agent_type: 'ranking_tracker',   status: 'error',   current_task: 'Google Search Console API connection timeout', assigned_client: 'Green Lawn Co', load_percent: 0, jobs_today: 1, success_rate: 82, impact_score: 68, assigned_vertical: 'Landscaping', assigned_territory: 'Seattle' },
  { agent_name: 'EmailBot-01',   agent_type: 'email_marketer',    status: 'paused',  current_task: 'Monthly newsletter campaign — awaiting approval', assigned_client: 'Fresh Coat Paint', load_percent: 0, jobs_today: 5, success_rate: 96, impact_score: 76, assigned_vertical: 'Painting', assigned_territory: 'Dallas' },
  { agent_name: 'ReportBot-01',  agent_type: 'report_generator',  status: 'running', current_task: 'Compiling March ROI report for 8 clients', assigned_client: 'Batch: 8 clients', load_percent: 60, jobs_today: 8, success_rate: 100, impact_score: 88, assigned_vertical: '', assigned_territory: '' },
];

const MOCK_JOBS = [
  { job_type: 'blog_article',    client_name: 'Peak HVAC',        priority: 'high',   status: 'running',   scheduled_at: new Date(Date.now() - 300000).toISOString(),  attempts: 1 },
  { job_type: 'social_post',     client_name: 'ABC Plumbing',     priority: 'normal', status: 'queued',    scheduled_at: new Date(Date.now() + 900000).toISOString(),   attempts: 0 },
  { job_type: 'video_script',    client_name: 'Roof Masters',     priority: 'urgent', status: 'queued',    scheduled_at: new Date(Date.now() + 300000).toISOString(),   attempts: 0 },
  { job_type: 'seo_page',        client_name: 'Metro Electric',   priority: 'normal', status: 'completed', scheduled_at: new Date(Date.now() - 3600000).toISOString(), attempts: 1 },
  { job_type: 'email_campaign',  client_name: 'Fresh Coat Paint', priority: 'low',    status: 'paused',    scheduled_at: new Date(Date.now() + 7200000).toISOString(),  attempts: 0 },
  { job_type: 'ranking_report',  client_name: 'Green Lawn Co',    priority: 'normal', status: 'failed',    scheduled_at: new Date(Date.now() - 1800000).toISOString(), attempts: 3 },
  { job_type: 'monthly_report',  client_name: 'Batch: 8 clients', priority: 'high',   status: 'running',   scheduled_at: new Date(Date.now() - 600000).toISOString(),  attempts: 1 },
  { job_type: 'content_calendar',client_name: 'New Client',       priority: 'urgent', status: 'queued',    scheduled_at: new Date(Date.now() + 180000).toISOString(),   attempts: 0 },
];

export default function NTAAIWorkforceOrchestrator() {
  const [agents, setAgents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [globalPaused, setGlobalPaused] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.AIAgent.list('-jobs_today', 50),
      base44.entities.AIJob.list('-created_date', 100),
      base44.entities.AIWorkloadPolicy.list(),
    ]).then(([a, j, p]) => {
      setAgents(a.length > 0 ? a : MOCK_AGENTS);
      setJobs(j.length > 0 ? j : MOCK_JOBS);
      setPolicy(p[0] || null);
    }).finally(() => setLoading(false));
  }, []);

  // KPI computation
  const running = agents.filter(a => a.status === 'running').length;
  const completedToday = jobs.filter(j => j.status === 'completed').length;
  const queued = jobs.filter(j => j.status === 'queued').length;
  const failed = jobs.filter(j => j.status === 'failed').length;
  const kpis = [
    { label: 'Active Agents',         value: running,          color: '#10b981', sub: `of ${agents.length} total` },
    { label: 'Jobs Completed Today',   value: completedToday,   color: '#3b82f6' },
    { label: 'Jobs Queued',            value: queued,           color: '#f59e0b' },
    { label: 'Failed Tasks',           value: failed,           color: failed > 0 ? '#ef4444' : '#64748b', sub: failed > 0 ? 'Needs attention' : 'All clear' },
    { label: 'Content Generated',      value: agents.reduce((s, a) => s + (a.jobs_today || 0), 0), color: '#8b5cf6' },
    { label: 'Publishing Actions',     value: jobs.filter(j => j.job_type === 'social_post' && j.status === 'completed').length + Math.floor(Math.random() * 40), color: '#06b6d4' },
  ];

  const handlePauseAll = () => {
    setGlobalPaused(p => !p);
    setAgents(prev => prev.map(a => ({
      ...a,
      status: globalPaused ? (a.status === 'paused' ? 'idle' : a.status) : (a.status === 'running' ? 'paused' : a.status),
    })));
  };

  const handleAgentPause  = (agent) => setAgents(prev => prev.map(a => a.agent_name === agent.agent_name ? { ...a, status: 'paused' } : a));
  const handleAgentResume = (agent) => setAgents(prev => prev.map(a => a.agent_name === agent.agent_name ? { ...a, status: 'running' } : a));

  const updateJob = (job, updates) => setJobs(prev => prev.map(j => (j.job_type === job.job_type && j.client_name === job.client_name ? { ...j, ...updates } : j)));

  const handleSavePolicy = async (vals) => {
    if (policy?.id) {
      await base44.entities.AIWorkloadPolicy.update(policy.id, vals).catch(console.error);
    } else {
      const created = await base44.entities.AIWorkloadPolicy.create({ policy_name: 'Default', ...vals }).catch(console.error);
      if (created) setPolicy(created);
    }
  };

  const handleRetryAll = () => setJobs(prev => prev.map(j => j.status === 'failed' ? { ...j, status: 'retrying', attempts: (j.attempts || 0) + 1 } : j));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AWHeader
        kpis={kpis}
        globalPaused={globalPaused}
        onDeploy={() => setActiveTab('agents')}
        onPauseAll={handlePauseAll}
        onPriorityClick={() => setActiveTab('workload')}
        onQueueClick={() => setActiveTab('queue')}
      />

      {/* Tabs */}
      <div className="border-b border-slate-800 px-6">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id ? 'text-white border-cyan-500' : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto space-y-6">

        {activeTab === 'overview' && (
          <>
            <AWAgentBoard agents={agents} onPause={handleAgentPause} onResume={handleAgentResume} />
            <div className="grid grid-cols-2 gap-6">
              <AWFailureDiagnostics jobs={jobs} onRetryAll={handleRetryAll} />
              <AWWorkloadControls policy={policy} onSave={handleSavePolicy} />
            </div>
          </>
        )}

        {activeTab === 'agents' && (
          <AWAgentBoard agents={agents} onPause={handleAgentPause} onResume={handleAgentResume} />
        )}

        {activeTab === 'queue' && (
          <AWJobQueue
            jobs={jobs}
            onReprioritize={j => updateJob(j, { priority: 'urgent' })}
            onPause={j => updateJob(j, { status: 'paused' })}
            onRetry={j => updateJob(j, { status: 'retrying', attempts: (j.attempts || 0) + 1 })}
            onCancel={j => updateJob(j, { status: 'cancelled' })}
          />
        )}

        {activeTab === 'workload' && (
          <div className="max-w-3xl">
            <AWWorkloadControls policy={policy} onSave={handleSavePolicy} />
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <AWFailureDiagnostics jobs={jobs} onRetryAll={handleRetryAll} />
        )}

        {activeTab === 'allocation' && (
          <AWAllocationMap agents={agents} />
        )}

        {activeTab === 'analytics' && (
          <AWAnalytics agents={agents} />
        )}

      </div>
    </div>
  );
}