import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import AdminNav from '../components/nav/AdminNav';
import AgentCard from '../components/agents/AgentCard';
import AgentPipelineMap from '../components/agents/AgentPipelineMap';
import AgentEditModal from '../components/agents/AgentEditModal';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Plus, RefreshCw, Zap, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

const CATEGORY_ORDER = [
  'lead_pipeline',
  'onboarding',
  'content_strategy',
  'content_production',
  'scheduling_publishing',
  'reporting_insights',
  'billing_retention',
];

const CATEGORY_LABELS = {
  lead_pipeline: 'Lead Pipeline',
  onboarding: 'Onboarding',
  content_strategy: 'Content Strategy',
  content_production: 'Content Production',
  scheduling_publishing: 'Scheduling & Publishing',
  reporting_insights: 'Reporting & Insights',
  billing_retention: 'Billing & Retention',
};

const CATEGORY_COLORS = {
  lead_pipeline: 'text-blue-400',
  onboarding: 'text-cyan-400',
  content_strategy: 'text-violet-400',
  content_production: 'text-fuchsia-400',
  scheduling_publishing: 'text-pink-400',
  reporting_insights: 'text-amber-400',
  billing_retention: 'text-green-400',
};

export default function AgentArchitecture() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAgent, setEditAgent] = useState(null);
  const [filterPhase, setFilterPhase] = useState('all');
  const [seeding, setSeeding] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    const data = await base44.entities.AiAgent.list('-created_date', 100);
    setAgents(data);
    setLoading(false);
  };

  useEffect(() => { loadAgents(); }, []);

  const handleToggle = async (agent, val) => {
    await base44.entities.AiAgent.update(agent.id, { is_enabled: val });
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_enabled: val } : a));
  };

  const handleSeed = async () => {
    setSeeding(true);
    const existing = await base44.entities.AiAgent.list('-created_date', 100);
    const existingKeys = new Set(existing.map(a => a.key));

    const agentsToSeed = SEED_AGENTS.filter(a => !existingKeys.has(a.key));
    for (const agent of agentsToSeed) {
      await base44.entities.AiAgent.create(agent);
    }
    await loadAgents();
    setSeeding(false);
  };

  const filtered = filterPhase === 'all' ? agents : agents.filter(a => a.phase === parseInt(filterPhase));

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catAgents = filtered.filter(a => a.category === cat);
    if (catAgents.length > 0) acc[cat] = catAgents;
    return acc;
  }, {});

  const enabledCount = agents.filter(a => a.is_enabled).length;
  const reviewCount = agents.filter(a => a.requires_human_review).length;
  const phase1Count = agents.filter(a => a.phase === 1).length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <AdminNav />
        <div className="flex-1 lg:pl-60">

          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-violet-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">NTA Agent Architecture</h1>
                  <p className="text-slate-400 text-sm">Event-driven AI business system — {agents.length} agents configured</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {agents.length === 0 && (
                  <Button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {seeding ? 'Seeding...' : 'Seed All 22 Agents'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setEditAgent({ phase: 1, is_enabled: true, requires_human_review: false })}
                >
                  <Plus className="w-4 h-4 mr-1" /> New Agent
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={loadAgents}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Agents', value: agents.length, icon: BrainCircuit, color: 'text-violet-400' },
                { label: 'Enabled', value: enabledCount, icon: CheckCircle2, color: 'text-green-400' },
                { label: 'Phase 1 Core', value: phase1Count, icon: Zap, color: 'text-blue-400' },
                { label: 'Human Review', value: reviewCount, icon: Eye, color: 'text-yellow-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pipeline Map */}
            <AgentPipelineMap />

            {/* Phase Filter */}
            <div className="flex items-center gap-2">
              {[['all', 'All Phases'], ['1', 'Phase 1 — Core'], ['2', 'Phase 2 — Advanced']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilterPhase(val)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterPhase === val
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Seed prompt if empty */}
            {!loading && agents.length === 0 && (
              <div className="bg-slate-900 border border-slate-700 border-dashed rounded-xl p-12 text-center">
                <BrainCircuit className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">No agents configured yet</h3>
                <p className="text-slate-400 text-sm mb-6">Click "Seed All 22 Agents" to initialize the full NTA agent architecture.</p>
                <Button onClick={handleSeed} disabled={seeding} className="bg-violet-600 hover:bg-violet-500 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  {seeding ? 'Seeding...' : 'Seed All 22 Agents'}
                </Button>
              </div>
            )}

            {/* Agent groups by category */}
            {Object.entries(grouped).map(([cat, catAgents]) => (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className={`font-semibold text-sm uppercase tracking-widest ${CATEGORY_COLORS[cat]}`}>
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <span className="text-slate-600 text-xs">({catAgents.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {catAgents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onToggle={handleToggle}
                      onEdit={setEditAgent}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editAgent && (
        <AgentEditModal
          agent={editAgent}
          onClose={() => setEditAgent(null)}
          onSaved={loadAgents}
        />
      )}
    </AdminGuard>
  );
}

// ─── Seed Data: All 22 Agents ────────────────────────────────────────────────

const SEED_AGENTS = [
  // ── Phase 1: Core ──────────────────────────────────────────────────────────
  {
    key: 'lead_qualification_agent',
    name: 'Lead Qualification Agent',
    description: 'Scores and qualifies incoming leads based on service interest, business type, and budget signals. Routes to appropriate sales track.',
    phase: 1,
    category: 'lead_pipeline',
    trigger_event: 'Lead.created',
    input_entities: ['Lead', 'Company'],
    output_entities: ['Lead', 'Opportunity', 'AgentJob', 'ActivityLog'],
    job_type: 'lead_scoring',
    is_enabled: true,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.003,
    system_prompt: 'You are a sales qualification agent for New Tech Advertising. Evaluate incoming leads and determine their fit, urgency, and which NTA service track they belong to. Output a qualification score and recommended next action.'
  },
  {
    key: 'follow_up_agent',
    name: 'Follow-Up Agent',
    description: 'Sends personalized follow-up emails to leads based on their service interest and engagement history. Handles nurture sequences.',
    phase: 1,
    category: 'lead_pipeline',
    trigger_event: 'Lead.status=contacted',
    input_entities: ['Lead', 'Company', 'ActivityLog'],
    output_entities: ['ActivityLog', 'AgentJob'],
    job_type: 'email_sequence',
    is_enabled: true,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.002,
    system_prompt: 'You are a follow-up agent. Draft personalized outreach emails for leads that need follow-up. Tailor tone and content to the service they expressed interest in.'
  },
  {
    key: 'onboarding_setup_agent',
    name: 'Onboarding Setup Agent',
    description: 'Guides new clients through the onboarding process, creates their OnboardingProfile, and coordinates asset collection.',
    phase: 1,
    category: 'onboarding',
    trigger_event: 'Subscription.status=active',
    input_entities: ['Company', 'Subscription', 'Contact'],
    output_entities: ['OnboardingProfile', 'AgentJob', 'ActivityLog'],
    job_type: 'onboarding_setup',
    is_enabled: true,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.002,
    system_prompt: 'You are an onboarding setup agent. When a new subscription activates, initialize the client onboarding profile and prepare the checklist of items needed from the client.'
  },
  {
    key: 'brand_intake_agent',
    name: 'Brand Intake Agent',
    description: 'Analyzes submitted brand assets, website, and client answers to build a comprehensive BrandProfile.',
    phase: 1,
    category: 'onboarding',
    trigger_event: 'OnboardingProfile.status=completed',
    input_entities: ['OnboardingProfile', 'Company', 'AssetBundle'],
    output_entities: ['BrandProfile', 'AgentJob', 'ActivityLog'],
    job_type: 'onboarding_setup',
    is_enabled: true,
    requires_human_review: true,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.015,
    system_prompt: 'You are a brand intake agent. Review submitted assets, website content, and client answers to generate a thorough BrandProfile including voice, target audience, USPs, content pillars, and approved hashtags.'
  },
  {
    key: 'authority_plan_agent',
    name: 'Authority Plan Agent',
    description: 'Generates the 90-day marketing authority strategy: campaigns, content pillars, and posting calendar.',
    phase: 1,
    category: 'content_strategy',
    trigger_event: 'BrandProfile.created',
    input_entities: ['BrandProfile', 'Company', 'MarketingPlan', 'OnboardingProfile'],
    output_entities: ['ContentCampaign', 'MarketingPlan', 'AgentJob', 'ActivityLog'],
    job_type: 'content_generation',
    is_enabled: true,
    requires_human_review: true,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.05,
    system_prompt: 'You are the Authority Plan agent. Generate a structured 90-day marketing strategy with campaign themes, content pillars, weekly posting frequency, and channel recommendations aligned to the client\'s brand and goals.'
  },
  {
    key: 'content_agent',
    name: 'Content Agent',
    description: 'Generates social media posts, captions, and copy based on the active MarketingPlan and BrandProfile.',
    phase: 1,
    category: 'content_production',
    trigger_event: 'MarketingPlan.status=active',
    input_entities: ['MarketingPlan', 'BrandProfile', 'ContentCampaign', 'Company'],
    output_entities: ['ContentItem', 'AgentJob', 'ActivityLog'],
    job_type: 'content_generation',
    is_enabled: true,
    requires_human_review: true,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.04,
    system_prompt: 'You are a social media content agent. Generate engaging, brand-aligned posts for each scheduled content slot. Follow the brand voice, include relevant hashtags, and format content for the target platform.'
  },
  {
    key: 'video_script_agent',
    name: 'Video Script Agent',
    description: 'Creates short-form video scripts optimized for Reels, TikTok, and YouTube Shorts aligned to campaign themes.',
    phase: 1,
    category: 'content_production',
    trigger_event: 'ContentCampaign.status=active',
    input_entities: ['ContentCampaign', 'BrandProfile', 'MarketingPlan'],
    output_entities: ['ContentItem', 'AgentJob', 'ActivityLog'],
    job_type: 'video_generation',
    is_enabled: true,
    requires_human_review: true,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.03,
    system_prompt: 'You are a video script agent. Write compelling 30-60 second video scripts for social media that align with campaign themes. Include a hook, core message, and CTA. Format for teleprompter reading.'
  },
  {
    key: 'scheduling_agent',
    name: 'Scheduling Agent',
    description: 'Schedules approved ContentItems to optimal posting times across connected social channels.',
    phase: 1,
    category: 'scheduling_publishing',
    trigger_event: 'ContentItem.status=approved',
    input_entities: ['ContentItem', 'MarketingPlan', 'SocialAccount', 'Company'],
    output_entities: ['ScheduledPost', 'AgentJob', 'ActivityLog'],
    job_type: 'content_generation',
    is_enabled: true,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.001,
    system_prompt: 'You are a scheduling agent. Assign approved content items to optimal posting times based on platform best practices, posting frequency targets, and existing schedule gaps.'
  },
  {
    key: 'reporting_agent',
    name: 'Reporting Agent',
    description: 'Generates monthly performance reports with AI narrative summaries from post metrics and engagement data.',
    phase: 1,
    category: 'reporting_insights',
    trigger_event: 'scheduled.monthly',
    input_entities: ['ScheduledPost', 'ContentItem', 'Company', 'MarketingPlan'],
    output_entities: ['PerformanceReport', 'AgentJob', 'ActivityLog'],
    job_type: 'report_generation',
    is_enabled: true,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.01,
    system_prompt: 'You are a reporting agent. Analyze monthly content performance data and generate a clear, actionable narrative summary for each client. Highlight wins, identify gaps, and recommend adjustments.'
  },
  {
    key: 'billing_agent',
    name: 'Billing Agent',
    description: 'Monitors subscription health, triggers invoice creation, flags overdue accounts, and logs billing events.',
    phase: 1,
    category: 'billing_retention',
    trigger_event: 'Subscription.next_billing_date',
    input_entities: ['Subscription', 'Company', 'Invoice'],
    output_entities: ['Invoice', 'AgentJob', 'ActivityLog'],
    job_type: 'other',
    is_enabled: true,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.001,
    system_prompt: 'You are a billing agent. Monitor subscription billing dates, flag overdue accounts, and coordinate invoice creation and payment reminders.'
  },

  // ── Phase 2: Advanced ──────────────────────────────────────────────────────
  {
    key: 'offer_recommendation_agent',
    name: 'Offer Recommendation Agent',
    description: 'Analyzes client usage and engagement to recommend upsell offers, add-ons, or plan upgrades at the right moment.',
    phase: 2,
    category: 'billing_retention',
    trigger_event: 'PerformanceReport.created',
    input_entities: ['Company', 'Subscription', 'PerformanceReport', 'ServiceRequest'],
    output_entities: ['Opportunity', 'AgentJob', 'ActivityLog'],
    job_type: 'lead_scoring',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.005,
    system_prompt: 'You are an offer recommendation agent. Analyze client performance data and subscription history to surface the most timely upsell opportunities, framed as value additions rather than sales.'
  },
  {
    key: 'campaign_planning_agent',
    name: 'Campaign Planning Agent',
    description: 'Plans seasonal, promotional, or event-driven campaigns with content calendars and creative briefs.',
    phase: 2,
    category: 'content_strategy',
    trigger_event: 'manual',
    input_entities: ['BrandProfile', 'MarketingPlan', 'Company', 'ContentCampaign'],
    output_entities: ['ContentCampaign', 'ContentItem', 'AgentJob', 'ActivityLog'],
    job_type: 'content_generation',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.03,
    system_prompt: 'You are a campaign planning agent. Design structured content campaigns for specific business goals, seasons, or promotions. Define themes, creative direction, post cadence, and channel mix.'
  },
  {
    key: 'upgrade_opportunity_agent',
    name: 'Upgrade Opportunity Agent',
    description: 'Identifies clients on lower-tier plans who would benefit from DFY Managed or Authority services based on activity signals.',
    phase: 2,
    category: 'billing_retention',
    trigger_event: 'scheduled.weekly',
    input_entities: ['Subscription', 'Company', 'ActivityLog', 'PerformanceReport'],
    output_entities: ['Opportunity', 'AgentJob', 'ActivityLog'],
    job_type: 'lead_scoring',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.003,
    system_prompt: 'You are an upgrade opportunity agent. Scan active subscriptions and usage signals to identify clients ready for a higher tier. Generate a personalized upgrade rationale for each candidate.'
  },
  {
    key: 'image_prompt_agent',
    name: 'Image Prompt Agent',
    description: 'Generates detailed AI image generation prompts for each ContentItem, matched to brand style and campaign theme.',
    phase: 2,
    category: 'content_production',
    trigger_event: 'ContentItem.status=draft',
    input_entities: ['ContentItem', 'BrandProfile', 'AssetBundle'],
    output_entities: ['ContentItem', 'AssetBundle', 'AgentJob', 'ActivityLog'],
    job_type: 'image_generation',
    is_enabled: false,
    requires_human_review: false,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.02,
    system_prompt: 'You are an image prompt agent. For each content item, generate a detailed, professional image generation prompt that matches the brand aesthetic, campaign theme, and post caption context.'
  },
  {
    key: 'video_production_agent',
    name: 'Video Production Agent',
    description: 'Orchestrates AI video generation via HeyGen or Vibe.co from approved video scripts and brand assets.',
    phase: 2,
    category: 'content_production',
    trigger_event: 'ContentItem.content_type=video_post AND status=approved',
    input_entities: ['ContentItem', 'BrandProfile', 'AssetBundle'],
    output_entities: ['ContentItem', 'AssetBundle', 'AgentJob', 'ActivityLog'],
    job_type: 'video_generation',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.50,
    system_prompt: 'You are a video production coordinator. Take approved video scripts and orchestrate the AI video generation pipeline including avatar selection, voice, slides, and brand overlays.'
  },
  {
    key: 'website_content_agent',
    name: 'Website Content Agent',
    description: 'Generates SEO-optimized blog posts, landing page copy, and website content aligned to the topical authority strategy.',
    phase: 2,
    category: 'content_strategy',
    trigger_event: 'AuthorityMap.created',
    input_entities: ['BrandProfile', 'Company', 'MarketingPlan'],
    output_entities: ['ContentItem', 'AgentJob', 'ActivityLog'],
    job_type: 'content_generation',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.04,
    system_prompt: 'You are a website content agent. Write SEO-optimized articles, landing page sections, and blog posts aligned to the client\'s topical authority map. Use their brand voice and target keyword clusters.'
  },
  {
    key: 'publishing_agent',
    name: 'Publishing Agent',
    description: 'Executes final publishing of ScheduledPosts to connected social accounts via Meta, LinkedIn, TikTok, and Google APIs.',
    phase: 2,
    category: 'scheduling_publishing',
    trigger_event: 'ScheduledPost.scheduled_at <= now',
    input_entities: ['ScheduledPost', 'ContentItem', 'SocialAccount'],
    output_entities: ['ScheduledPost', 'AgentJob', 'ActivityLog'],
    job_type: 'other',
    is_enabled: false,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.001,
    system_prompt: 'You are a publishing agent. Coordinate the final delivery of scheduled posts to their respective social platforms. Handle errors, retries, and status updates.'
  },
  {
    key: 'campaign_launch_agent',
    name: 'Campaign Launch Agent',
    description: 'Orchestrates full campaign launches: final content review, scheduling, notification, and activation across channels.',
    phase: 2,
    category: 'scheduling_publishing',
    trigger_event: 'ContentCampaign.status=planned → active',
    input_entities: ['ContentCampaign', 'ContentItem', 'ScheduledPost', 'Company'],
    output_entities: ['ContentCampaign', 'ScheduledPost', 'AgentJob', 'ActivityLog'],
    job_type: 'other',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.005,
    system_prompt: 'You are a campaign launch agent. When a campaign is approved for launch, verify all content is ready, execute the scheduling pipeline, and send launch confirmation notifications.'
  },
  {
    key: 'project_fulfillment_agent',
    name: 'Project Fulfillment Agent',
    description: 'Manages ADA, website rebuild, and streaming TV project workflows, tracks milestones, and coordinates deliverables.',
    phase: 2,
    category: 'onboarding',
    trigger_event: 'NtaProject.status=in_progress',
    input_entities: ['NtaProject', 'NtaProposal', 'Company', 'OnboardingProfile'],
    output_entities: ['NtaProject', 'AgentJob', 'ActivityLog'],
    job_type: 'onboarding_setup',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.005,
    system_prompt: 'You are a project fulfillment agent. Track project milestones, coordinate deliverable handoffs, and surface blockers for ADA compliance, website rebuild, and streaming TV production projects.'
  },
  {
    key: 'insight_agent',
    name: 'Insight Agent',
    description: 'Surfaces actionable insights from performance data: what\'s working, what\'s not, and strategic recommendations.',
    phase: 2,
    category: 'reporting_insights',
    trigger_event: 'PerformanceReport.created',
    input_entities: ['PerformanceReport', 'ContentItem', 'BrandProfile', 'MarketingPlan'],
    output_entities: ['AgentJob', 'ActivityLog'],
    job_type: 'report_generation',
    is_enabled: false,
    requires_human_review: false,
    default_model: 'gpt-4o',
    estimated_cost_usd: 0.02,
    system_prompt: 'You are an insight agent. Analyze content performance trends across clients to identify patterns, benchmark against targets, and generate strategic recommendations for the next planning cycle.'
  },
  {
    key: 'retention_agent',
    name: 'Retention Agent',
    description: 'Monitors churn signals like reduced logins, stalled content, or low engagement and triggers proactive re-engagement workflows.',
    phase: 2,
    category: 'billing_retention',
    trigger_event: 'scheduled.weekly',
    input_entities: ['Subscription', 'Company', 'ActivityLog', 'PerformanceReport'],
    output_entities: ['ServiceRequest', 'AgentJob', 'ActivityLog'],
    job_type: 'email_sequence',
    is_enabled: false,
    requires_human_review: true,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.003,
    system_prompt: 'You are a retention agent. Monitor client activity signals to detect churn risk. Identify disengaged accounts and generate personalized re-engagement strategies before the client considers cancelling.'
  },
  {
    key: 'platform_connection_agent',
    name: 'Platform Connection Agent',
    description: 'Assists clients in connecting their social accounts, verifies OAuth tokens, and flags broken or expired connections.',
    phase: 2,
    category: 'onboarding',
    trigger_event: 'SocialAccount.created',
    input_entities: ['SocialAccount', 'Company', 'OnboardingProfile'],
    output_entities: ['SocialAccount', 'AgentJob', 'ActivityLog'],
    job_type: 'other',
    is_enabled: false,
    requires_human_review: false,
    default_model: 'gpt-4o-mini',
    estimated_cost_usd: 0.001,
    system_prompt: 'You are a platform connection agent. Verify social media account connections, detect expired OAuth tokens, and guide clients through reconnecting broken integrations.'
  },
];