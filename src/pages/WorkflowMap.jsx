import React, { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import AdminNav from '../components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Map, Globe, UserPlus, Settings, LayoutDashboard, Video,
  BarChart2, DollarSign, Briefcase, ArrowRight, ChevronDown,
  ChevronRight, Database, Zap, BrainCircuit, BookOpen, Eye,
  GitBranch, AlertTriangle, CheckCircle2, Copy
} from 'lucide-react';

// ─── Master Workflow Definition ───────────────────────────────────────────────

const WORKFLOW_GROUPS = [
  {
    id: 'marketing',
    label: 'Marketing Pages',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    icon: Globe,
    description: 'Traffic acquisition — routes users into lead capture flows',
    pipeline_position: 1,
    pages: [
      {
        name: 'Home', page: 'Home',
        purpose: 'Primary brand landing page — converts visitors to leads',
        entities_read: [],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['TrialStart', 'Book-Call', 'Free-Audit', 'Contact'],
        cta: 'Start Trial / Book Call / Free Audit',
      },
      {
        name: 'Platform', page: 'AiMarketingPlatform',
        purpose: 'Platform feature showcase for DFY and DIY prospects',
        entities_read: [],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['TrialStart', 'Book-Call'],
        cta: 'Start Trial / Book Call',
      },
      {
        name: 'Pricing', page: 'Home',
        purpose: 'Pricing tiers — routes to correct intake based on plan selection',
        entities_read: [],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['TrialStart', 'Book-Call', 'Rebuild-Intake'],
        cta: 'Select Plan → Intake',
      },
      {
        name: 'About', page: 'About',
        purpose: 'Brand credibility and team page',
        entities_read: [],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['Contact', 'Book-Call'],
        cta: 'Contact / Book Call',
      },
      {
        name: 'Contact', page: 'Contact',
        purpose: 'General inquiry form — captures contact details',
        entities_read: [],
        entities_written: ['Lead', 'Company'],
        agents_triggered: ['Lead Qualification Agent'],
        next_steps: ['Book-Call'],
        cta: 'Submit Inquiry',
      },
      {
        name: 'Blog', page: 'Blog',
        purpose: 'SEO content hub — drives organic traffic',
        entities_read: ['BlogPost'],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['TrialStart', 'Contact'],
        cta: 'Read → CTA to Trial',
      },
      {
        name: 'Industries', page: 'IndustriesHub',
        purpose: 'Industry-specific landing pages for targeted traffic',
        entities_read: [],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['Free-Audit', 'Book-Call'],
        cta: 'Free Audit / Book Call',
      },
    ],
  },
  {
    id: 'lead_capture',
    label: 'Lead Capture Pages',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    icon: UserPlus,
    description: 'Converts traffic into qualified leads and trial accounts',
    pipeline_position: 2,
    pages: [
      {
        name: 'Start Trial', page: 'TrialStart',
        purpose: 'DIY SaaS trial signup — creates full account and subscription',
        entities_read: [],
        entities_written: ['Company', 'Contact', 'Lead', 'UserAccount', 'Subscription', 'OnboardingProfile'],
        agents_triggered: ['Lead Qualification Agent', 'Onboarding Setup Agent'],
        next_steps: ['TrialOnboarding'],
        cta: 'Create Free Trial',
      },
      {
        name: 'Book Call', page: 'Book-Call',
        purpose: 'DFY strategy call booking for managed service prospects',
        entities_read: [],
        entities_written: ['Company', 'Contact', 'Lead', 'Opportunity'],
        agents_triggered: ['Lead Qualification Agent', 'Follow-Up Agent'],
        next_steps: ['AdminOnboardingQueue'],
        cta: 'Schedule Discovery Call',
      },
      {
        name: 'Free Audit', page: 'Free-Audit',
        purpose: 'Marketing audit landing page for SMB prospects',
        entities_read: [],
        entities_written: ['Company', 'Contact', 'Lead'],
        agents_triggered: ['Lead Qualification Agent'],
        next_steps: ['Book-Call'],
        cta: 'Get Free Audit',
      },
      {
        name: 'ADA Intake', page: 'AdaIntake',
        purpose: 'ADA compliance project intake form',
        entities_read: [],
        entities_written: ['Lead', 'Opportunity', 'NtaProject', 'Company'],
        agents_triggered: ['Lead Qualification Agent', 'Project Fulfillment Agent'],
        next_steps: ['AdminOnboardingQueue'],
        cta: 'Submit ADA Request',
      },
      {
        name: 'Rebuild Intake', page: 'Rebuild-Intake',
        purpose: 'Website rebuild project intake form',
        entities_read: [],
        entities_written: ['Lead', 'Opportunity', 'NtaProject', 'Company'],
        agents_triggered: ['Lead Qualification Agent', 'Project Fulfillment Agent'],
        next_steps: ['AdminOnboardingQueue'],
        cta: 'Submit Rebuild Request',
      },
      {
        name: 'Streaming Intake', page: 'StreamingIntake',
        purpose: 'Streaming TV campaign intake form',
        entities_read: [],
        entities_written: ['Lead', 'Opportunity', 'NtaProject', 'Company'],
        agents_triggered: ['Lead Qualification Agent', 'Project Fulfillment Agent'],
        next_steps: ['AdminOnboardingQueue'],
        cta: 'Start Streaming Campaign',
      },
    ],
  },
  {
    id: 'onboarding',
    label: 'Onboarding Pages',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    icon: Settings,
    description: 'Client setup — brand intake, social connections, strategy generation',
    pipeline_position: 3,
    pages: [
      {
        name: 'Trial Onboarding', page: 'TrialOnboarding',
        purpose: 'Multi-step onboarding for new DIY trial accounts',
        entities_read: ['Company', 'Subscription'],
        entities_written: ['OnboardingProfile', 'BrandProfile', 'SocialAccount'],
        agents_triggered: ['Brand Intake Agent', 'Authority Plan Agent', 'Campaign Planning Agent'],
        next_steps: ['Dashboard'],
        cta: 'Complete Onboarding → Dashboard',
      },
      {
        name: 'Client Onboarding', page: 'ClientOnboarding',
        purpose: 'Full DFY client onboarding with asset collection',
        entities_read: ['Company', 'Subscription', 'NtaProposal'],
        entities_written: ['OnboardingProfile', 'BrandProfile', 'AssetBundle', 'SocialAccount'],
        agents_triggered: ['Brand Intake Agent', 'Authority Plan Agent', 'Campaign Planning Agent'],
        next_steps: ['Dashboard'],
        cta: 'Submit Assets → Strategy Generation',
      },
      {
        name: 'Social Accounts', page: 'SocialAccounts',
        purpose: 'Connect and manage social media platform integrations',
        entities_read: ['SocialAccount', 'Company'],
        entities_written: ['SocialAccount'],
        agents_triggered: ['Platform Connection Agent'],
        next_steps: ['Dashboard', 'ContentStudio'],
        cta: 'Connect Channels',
      },
      {
        name: 'Onboarding Thank You', page: 'OnboardThankYou',
        purpose: 'Confirmation page after onboarding completion',
        entities_read: ['OnboardingProfile'],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['Dashboard'],
        cta: 'Go to Dashboard',
      },
    ],
  },
  {
    id: 'client_app',
    label: 'Client App Pages',
    color: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    icon: LayoutDashboard,
    description: 'Core client experience — content production, scheduling, and performance',
    pipeline_position: 4,
    pages: [
      {
        name: 'Dashboard', page: 'Dashboard',
        purpose: 'Client command center — overview of all active workflows',
        entities_read: ['Subscription', 'MarketingPlan', 'ContentItem', 'ScheduledPost', 'AgentJob', 'PerformanceReport'],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['ContentStudio', 'ScheduledQueue', 'SocialAccounts'],
        cta: 'View Content / Approve Posts',
      },
      {
        name: 'Content Studio', page: 'ContentStudio',
        purpose: 'Review, approve, edit, and submit content items',
        entities_read: ['ContentItem', 'ContentCampaign', 'BrandProfile'],
        entities_written: ['ContentItem'],
        agents_triggered: ['Content Agent', 'Video Script Agent', 'Scheduling Agent'],
        next_steps: ['ScheduledQueue'],
        cta: 'Approve Content → Schedule',
      },
      {
        name: 'Scheduled Queue', page: 'ScheduledQueue',
        purpose: 'Content calendar and publishing queue management',
        entities_read: ['ScheduledPost', 'ContentItem', 'SocialAccount'],
        entities_written: ['ScheduledPost'],
        agents_triggered: ['Publishing Agent', 'Scheduling Agent'],
        next_steps: ['ContentStudio'],
        cta: 'Manage Schedule / Publish',
      },
      {
        name: 'AI Video Studio', page: 'AiVideoStudio',
        purpose: 'AI-powered video creation from scripts and brand assets',
        entities_read: ['BrandProfile', 'ContentItem', 'AssetBundle'],
        entities_written: ['AssetBundle', 'ContentItem'],
        agents_triggered: ['Video Script Agent', 'Image Prompt Agent', 'Video Production Agent'],
        next_steps: ['ContentStudio', 'ScheduledQueue'],
        cta: 'Generate Video → Review',
      },
      {
        name: 'Analytics', page: 'Dashboard',
        purpose: 'Performance reporting and AI-generated insights',
        entities_read: ['PerformanceReport', 'ScheduledPost', 'ContentItem'],
        entities_written: [],
        agents_triggered: ['Insight Agent', 'Upgrade Opportunity Agent'],
        next_steps: ['ContentStudio'],
        cta: 'View Reports / Take Action',
      },
      {
        name: 'Content Drafts', page: 'ContentDrafts',
        purpose: 'Review AI-generated draft content before approval',
        entities_read: ['ContentItem', 'ContentCampaign'],
        entities_written: ['ContentItem'],
        agents_triggered: ['Content Agent'],
        next_steps: ['ContentStudio'],
        cta: 'Approve / Edit Drafts',
      },
    ],
  },
  {
    id: 'sales_dfy',
    label: 'DFY / Sales Pages',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    icon: DollarSign,
    description: 'Proposal acceptance, upgrades, and DFY service activation',
    pipeline_position: 5,
    pages: [
      {
        name: 'Proposal View', page: 'RebuildProposal',
        purpose: 'Client-facing proposal acceptance with e-signature and deposit',
        entities_read: ['NtaProposal', 'Company'],
        entities_written: ['NtaProposal', 'Opportunity'],
        agents_triggered: ['Billing Agent'],
        next_steps: ['ClientOnboarding'],
        cta: 'Accept Proposal → Pay Deposit',
      },
      {
        name: 'Streaming Proposal', page: 'StreamingProposal',
        purpose: 'Streaming TV campaign proposal and creative payment',
        entities_read: ['NtaProposal', 'Company'],
        entities_written: ['NtaProposal', 'Invoice'],
        agents_triggered: ['Billing Agent', 'Project Fulfillment Agent'],
        next_steps: ['StreamingOnboarding'],
        cta: 'Accept & Pay → Production',
      },
      {
        name: 'Upgrade / Pricing', page: 'Home',
        purpose: 'Plan upgrade flow — creates subscription change request',
        entities_read: ['Subscription'],
        entities_written: ['Opportunity', 'ServiceRequest'],
        agents_triggered: ['Offer Recommendation Agent', 'Billing Agent'],
        next_steps: ['ClientOnboarding', 'Dashboard'],
        cta: 'Upgrade Plan',
      },
      {
        name: 'Get Started', page: 'Get-Started',
        purpose: 'General CTA page routing to the right intake by service type',
        entities_read: [],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['TrialStart', 'Book-Call', 'Rebuild-Intake'],
        cta: 'Choose Service Path',
      },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Pages',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/10',
    icon: Briefcase,
    description: 'Internal operations — CRM, fulfillment, AI oversight',
    pipeline_position: 6,
    pages: [
      {
        name: 'Admin Dashboard', page: 'AdminDashboard',
        purpose: 'Central admin hub with links to all operations modules',
        entities_read: ['Lead', 'Opportunity', 'NtaProject', 'Subscription', 'Invoice', 'AgentJob'],
        entities_written: [],
        agents_triggered: [],
        next_steps: ['CRMHub', 'OperationsHub', 'AdminOnboardingQueue', 'AiOperations'],
        cta: 'Navigate to Module',
      },
      {
        name: 'CRM Hub', page: 'CRMHub',
        purpose: 'Lead pipeline, client management, and email marketing',
        entities_read: ['Lead', 'Company', 'Contact', 'Opportunity', 'ActivityLog'],
        entities_written: ['Lead', 'Opportunity', 'Contact'],
        agents_triggered: ['Lead Qualification Agent', 'Follow-Up Agent'],
        next_steps: ['OperationsHub', 'AdminOnboardingQueue'],
        cta: 'Qualify Lead / Create Opportunity',
      },
      {
        name: 'Operations Hub', page: 'OperationsHub',
        purpose: 'Prospect → Proposal → Project fulfillment workflow tracker',
        entities_read: ['Opportunity', 'NtaProposal', 'NtaProject', 'Company'],
        entities_written: ['NtaProposal', 'NtaProject', 'Invoice'],
        agents_triggered: ['Project Fulfillment Agent', 'Billing Agent'],
        next_steps: ['AdminOnboardingQueue'],
        cta: 'Create Proposal / Track Project',
      },
      {
        name: 'Onboarding Queue', page: 'AdminOnboardingQueue',
        purpose: 'Review new trial accounts, approve brand profiles, trigger authority plans',
        entities_read: ['OnboardingProfile', 'BrandProfile', 'Company', 'AgentJob'],
        entities_written: ['OnboardingProfile', 'BrandProfile', 'MarketingPlan'],
        agents_triggered: ['Brand Intake Agent', 'Authority Plan Agent'],
        next_steps: ['AiOperations'],
        cta: 'Approve Brand → Launch Strategy',
      },
      {
        name: 'Admin Video Queue', page: 'AdminVideoQueue',
        purpose: 'Manage video generation jobs, review outputs, approve renders',
        entities_read: ['AgentJob', 'AssetBundle', 'ContentItem'],
        entities_written: ['AssetBundle', 'ContentItem'],
        agents_triggered: ['Video Production Agent'],
        next_steps: ['ContentStudio'],
        cta: 'Approve Video → Schedule',
      },
      {
        name: 'AI Operations', page: 'AiOperations',
        purpose: 'Monitor AI tasks, budgets, cost ledger, artifacts, and memory',
        entities_read: ['AgentJob', 'AiTask', 'AiBudget', 'AiCostLedger', 'AiArtifact', 'AiMemory'],
        entities_written: ['AiBudget', 'AiMemory'],
        agents_triggered: [],
        next_steps: ['AgentArchitecture'],
        cta: 'Run Tasks / Manage Budgets',
      },
      {
        name: 'Agent Architecture', page: 'AgentArchitecture',
        purpose: 'Configure, enable/disable, and monitor all 22 AI agents',
        entities_read: ['AiAgent'],
        entities_written: ['AiAgent'],
        agents_triggered: [],
        next_steps: [],
        cta: 'Configure Agents',
      },
    ],
  },
];

const PIPELINE_FLOW = [
  { label: 'Traffic', color: 'bg-sky-600' },
  { label: 'Lead Capture', color: 'bg-blue-600' },
  { label: 'Qualification', color: 'bg-indigo-600' },
  { label: 'Onboarding', color: 'bg-cyan-600' },
  { label: 'Strategy', color: 'bg-violet-600' },
  { label: 'Content', color: 'bg-fuchsia-600' },
  { label: 'Scheduling', color: 'bg-pink-600' },
  { label: 'Publishing', color: 'bg-rose-600' },
  { label: 'Reporting', color: 'bg-amber-600' },
  { label: 'Upsell', color: 'bg-orange-600' },
  { label: 'Billing', color: 'bg-green-600' },
];

// ─── Canonical Route Map ──────────────────────────────────────────────────────

const CANONICAL_ROUTES = [
  {
    group: 'Marketing (Public)',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    routes: [
      { path: '/', label: 'Homepage', page: 'Home', cta: '/start, /book-call, /free-audit' },
      { path: '/platform', label: 'Platform Overview', page: 'AiMarketingPlatform' },
      { path: '/platform/ai-marketing-platform', label: 'AI Marketing Platform', page: 'AiMarketingPlatform' },
      { path: '/platform/social-media-tools', label: 'Social Media Tools', page: 'AiSocialMedia' },
      { path: '/platform/video-studio', label: 'Video Studio', page: 'AiVideoStudio' },
      { path: '/platform/content-automation', label: 'Content Automation', page: 'AiMarketingPlatform' },
      { path: '/platform/analytics', label: 'Analytics', page: 'AiMarketingPlatform' },
      { path: '/services', label: 'Services Hub', page: 'Home' },
      { path: '/services/social-media-management', label: 'Social Media Management', page: 'SocialMediaManagement' },
      { path: '/services/website-rebuild', label: 'Website Rebuild', page: 'WebsiteRebuild' },
      { path: '/services/ada-compliance', label: 'ADA Compliance', page: 'AdaAccessibility' },
      { path: '/services/streaming-tv', label: 'Streaming TV', page: 'StreamingTV' },
      { path: '/services/local-visibility', label: 'Local Visibility', page: 'LocalVisibility' },
      { path: '/industries', label: 'Industries Hub', page: 'IndustriesHub' },
      { path: '/industries/hvac', label: 'HVAC', page: 'HvacMarketing' },
      { path: '/industries/restaurants', label: 'Restaurants', page: 'RestaurantSocialMedia' },
      { path: '/industries/service-trades', label: 'Service Trades', page: 'IndustriesServiceTrades' },
      { path: '/industries/professionals', label: 'Professionals', page: 'IndustriesProfessionals' },
      { path: '/industries/nonprofits', label: 'Nonprofits', page: 'IndustriesNonprofits' },
      { path: '/pricing', label: 'Pricing', page: 'Home' },
      { path: '/about', label: 'About', page: 'About' },
      { path: '/contact', label: 'Contact', page: 'Contact' },
      { path: '/blog', label: 'Blog', page: 'Blog' },
      { path: '/blog/:slug', label: 'Blog Post', page: 'BlogPost' },
      { path: '/our-work', label: 'Our Work / Portfolio', page: 'OurWork' },
    ],
  },
  {
    group: 'Lead Capture & Funnels',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    routes: [
      { path: '/start', label: 'Start Free Trial', page: 'TrialStart', writes: 'Company, Contact, Lead, UserAccount, Subscription, OnboardingProfile', next: '/onboarding/start' },
      { path: '/free-audit', label: 'Free Audit', page: 'Free-Audit', writes: 'Company, Contact, Lead(type=free_audit)', next: '/book-call or nurture' },
      { path: '/book-call', label: 'Book Strategy Call', page: 'Book-Call', writes: 'Company, Contact, Lead(type=book_call), Opportunity', next: '/proposal/:id' },
      { path: '/funnels/rebuild-intake', label: 'Website Rebuild Intake', page: 'Rebuild-Intake', writes: 'Lead, Opportunity, Project(website_rebuild)', next: '/proposal/:id' },
      { path: '/funnels/ada-intake', label: 'ADA Compliance Intake', page: 'AdaIntake', writes: 'Lead, Opportunity, Project(ada)', next: '/proposal/:id' },
      { path: '/funnels/streaming-intake', label: 'Streaming TV Intake', page: 'StreamingIntake', writes: 'Lead, Opportunity, Project(streaming_tv)', next: '/proposal/:id' },
      { path: '/proposal/:id', label: 'Proposal View', page: 'RebuildProposal', writes: 'Proposal', triggers: 'Billing Agent, Project Fulfillment Agent' },
    ],
  },
  {
    group: 'Onboarding',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    routes: [
      { path: '/onboarding/start', label: 'Onboarding — Business Info', page: 'TrialOnboarding', writes: 'OnboardingProfile' },
      { path: '/onboarding/profile', label: 'Onboarding — Brand Profile', page: 'TrialOnboarding', writes: 'BrandProfile', triggers: 'Authority Plan Agent, Campaign Planning Agent' },
      { path: '/onboarding/complete', label: 'Onboarding Complete', page: 'OnboardThankYou', next: '/dashboard' },
    ],
  },
  {
    group: 'Client App (/dashboard)',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    routes: [
      { path: '/dashboard', label: 'Main Dashboard', page: 'Dashboard', reads: 'Subscription, MarketingPlan, ContentItem, ScheduledPost, AgentJob, PerformanceReport' },
      { path: '/dashboard/content', label: 'Content Studio', page: 'ContentStudio', writes: 'ContentItem', triggers: 'Content Agent, Video Script Agent' },
      { path: '/dashboard/calendar', label: 'Calendar / Queue', page: 'ScheduledQueue', writes: 'ScheduledPost', triggers: 'Scheduling Agent, Publishing Agent' },
      { path: '/dashboard/video', label: 'Video Studio', page: 'AiVideoStudio', writes: 'AssetBundle, ContentItem(video)', triggers: 'Video Script Agent, Video Production Agent' },
      { path: '/dashboard/social', label: 'Social Accounts', page: 'SocialAccounts', writes: 'SocialAccount', triggers: 'Platform Connection Agent' },
      { path: '/dashboard/analytics', label: 'Analytics', page: 'Dashboard', reads: 'PerformanceReport', triggers: 'Insight Agent, Upgrade Opportunity Agent' },
      { path: '/dashboard/reports', label: 'Reports', page: 'Dashboard', reads: 'PerformanceReport — generated by Reporting Agent' },
      { path: '/dashboard/settings', label: 'Settings', page: 'Dashboard' },
      { path: '/dashboard/billing', label: 'Billing', page: 'Dashboard', reads: 'Subscription, Invoice', triggers: 'Billing Agent, Retention Agent' },
    ],
  },
  {
    group: 'Admin (/admin)',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    routes: [
      { path: '/admin', label: 'Admin Hub', page: 'AdminDashboard' },
      { path: '/admin/leads', label: 'Leads', page: 'CRMHub' },
      { path: '/admin/opportunities', label: 'Opportunities', page: 'OperationsHub' },
      { path: '/admin/onboarding', label: 'Onboarding Queue', page: 'AdminOnboardingQueue' },
      { path: '/admin/projects', label: 'Projects', page: 'OperationsHub' },
      { path: '/admin/video-queue', label: 'Video Queue', page: 'AdminVideoQueue' },
      { path: '/admin/agent-jobs', label: 'Agent Jobs', page: 'AiOperations' },
      { path: '/admin/invoices', label: 'Invoices', page: 'OperationsHub' },
      { path: '/admin/settings', label: 'Settings', page: 'AdminSettings' },
    ],
  },
  {
    group: 'Utility / System',
    color: 'text-slate-400',
    bg: 'bg-slate-800/50',
    border: 'border-slate-700/30',
    routes: [
      { path: '/login', label: 'Login', page: '(auth — platform handled)' },
      { path: '/logout', label: 'Logout', page: '(auth — platform handled)' },
      { path: '/oauth/callback', label: 'OAuth Callback', page: 'OauthCallback' },
      { path: '/webhooks/stripe', label: 'Stripe Webhook', page: '(backend function)' },
      { path: '/webhooks/social', label: 'Social Webhook', page: '(backend function)' },
    ],
  },
];

const REDIRECT_RULES = [
  // Services
  { from: 'Streaming-TV', to: '/services/streaming-tv', reason: 'Canonical service route' },
  { from: 'StreamingTV', to: '/services/streaming-tv', reason: 'Duplicate — merge with canonical' },
  { from: 'Streaming-Intake', to: '/funnels/streaming-intake', reason: 'Canonical funnel route' },
  { from: 'Website-Rebuild', to: '/services/website-rebuild', reason: 'Canonical service route' },
  { from: 'Rebuild', to: '/services/website-rebuild', reason: 'Duplicate — merge with canonical' },
  { from: 'WebsiteRebuild', to: '/services/website-rebuild', reason: 'Duplicate page name' },
  { from: 'Rebuild-Intake', to: '/funnels/rebuild-intake', reason: 'Canonical funnel route' },
  { from: 'RebuildIntake', to: '/funnels/rebuild-intake', reason: 'Duplicate page name' },
  { from: 'RebuildIntakePretty', to: '/funnels/rebuild-intake', reason: 'Variant — deprecate' },
  { from: 'Ada', to: '/services/ada-compliance', reason: 'Canonical service route' },
  { from: 'Ada-Compliance', to: '/services/ada-compliance', reason: 'Canonical service route' },
  { from: 'AdaAccessibility', to: '/services/ada-compliance', reason: 'Duplicate page name' },
  { from: 'AdaIntake', to: '/funnels/ada-intake', reason: 'Canonical funnel route' },
  // Platform
  { from: 'AiSocialMedia', to: '/platform/social-media-tools', reason: 'Canonical platform route' },
  { from: 'AiSocialMediaSmallBusiness', to: '/platform/social-media-tools', reason: 'Variant — consolidate' },
  { from: 'AiVideos', to: '/platform/video-studio', reason: 'Canonical platform route' },
  { from: 'AiVideoStudio', to: '/dashboard/video', reason: 'App route — auth required' },
  { from: 'AiMarketingPlatform', to: '/platform', reason: 'Canonical platform route' },
  { from: 'AiWebsites', to: '/services/website-rebuild', reason: 'Merge under services' },
  { from: 'AiSeo', to: '/platform', reason: 'Merge under platform' },
  { from: 'AiAdvertising', to: '/platform', reason: 'Merge under platform' },
  // Industries
  { from: 'Industry', to: '/industries', reason: 'Generic — redirect to hub' },
  { from: 'IndustryTrades', to: '/industries/service-trades', reason: 'Canonical industry route' },
  { from: 'IndustrySmall', to: '/industries', reason: 'Merge with hub' },
  { from: 'IndustrySmallLocal', to: '/industries', reason: 'Merge with hub' },
  { from: 'IndustriesSmallLocal', to: '/industries', reason: 'Duplicate' },
  { from: 'IndustryNonprofit', to: '/industries/nonprofits', reason: 'Canonical industry route' },
  { from: 'IndustryNonprofits', to: '/industries/nonprofits', reason: 'Duplicate page name' },
  { from: 'IndustryProfessional', to: '/industries/professionals', reason: 'Canonical industry route' },
  { from: 'IndustryProfessionals', to: '/industries/professionals', reason: 'Duplicate page name' },
  { from: 'IndustryServiceTrades', to: '/industries/service-trades', reason: 'Duplicate page name' },
  // Onboarding
  { from: 'OnboardingStart', to: '/onboarding/start', reason: 'Canonical onboarding route' },
  { from: 'Onboarding', to: '/onboarding/start', reason: 'Generic — redirect to start' },
  { from: 'TrialOnboarding', to: '/onboarding/start', reason: 'Canonical onboarding route' },
  { from: 'OnboardThankYou', to: '/onboarding/complete', reason: 'Canonical complete route' },
  { from: 'SetupComplete', to: '/onboarding/complete', reason: 'Duplicate' },
  // Lead capture
  { from: 'TrialStart', to: '/start', reason: 'Canonical trial route' },
  { from: 'TrialSlug', to: '/start', reason: 'Variant — consolidate' },
  { from: 'Get-Started', to: '/start', reason: 'Redirect to canonical start' },
  { from: 'Free-Audit', to: '/free-audit', reason: 'Canonical audit route' },
  { from: 'Book-Call', to: '/book-call', reason: 'Canonical call route' },
  // Streaming
  { from: 'StreamingOnboarding', to: '/onboarding/start', reason: 'Merge into unified onboarding' },
  { from: 'StreamingDashboard', to: '/dashboard', reason: 'Merge into main dashboard' },
  { from: 'StreamingThankYou', to: '/onboarding/complete', reason: 'Use canonical complete page' },
  { from: 'StreamingProposal', to: '/proposal/:id', reason: 'Canonical proposal route' },
  // Admin
  { from: 'LeadsDashboard', to: '/admin/leads', reason: 'Canonical admin route' },
  { from: 'LeadDetail', to: '/admin/leads', reason: 'Merge into CRM hub' },
  { from: 'AdminOnboardingQueue', to: '/admin/onboarding', reason: 'Canonical admin route' },
  { from: 'AdminVideoQueue', to: '/admin/video-queue', reason: 'Canonical admin route' },
  { from: 'AdminVideoDetail', to: '/admin/video-queue', reason: 'Merge into queue' },
  { from: 'AdminVideoGenerator', to: '/admin/video-queue', reason: 'Merge into queue' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function EntityPill({ name, type }) {
  const colors = {
    read: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
    written: 'bg-violet-900/50 text-violet-300 border-violet-700/50',
    agent: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
    next: 'bg-slate-800 text-slate-300 border-slate-700',
  };
  return (
    <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded border font-medium ${colors[type]}`}>
      {name}
    </span>
  );
}

function PageRow({ page }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = page.entities_read.length > 0 || page.entities_written.length > 0 || page.agents_triggered.length > 0;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-800/50 transition-colors"
        onClick={() => hasDetail && setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-white font-semibold text-sm">{page.name}</span>
            {page.agents_triggered.length > 0 && (
              <span className="text-xs bg-amber-900/40 text-amber-300 border border-amber-700/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />{page.agents_triggered.length} agent{page.agents_triggered.length > 1 ? 's' : ''}
              </span>
            )}
            {page.entities_written.length > 0 && (
              <span className="text-xs bg-violet-900/40 text-violet-300 border border-violet-700/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Database className="w-2.5 h-2.5" />writes {page.entities_written.length}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs">{page.purpose}</p>
          <p className="text-slate-500 text-xs mt-1">CTA: <span className="text-slate-400">{page.cta}</span></p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={createPageUrl(page.page)}
            onClick={e => e.stopPropagation()}
            className="text-slate-500 hover:text-violet-400 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {hasDetail && (
            expanded
              ? <ChevronDown className="w-4 h-4 text-slate-500" />
              : <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800 pt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-400" /> Reads
            </p>
            {page.entities_read.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {page.entities_read.map(e => <EntityPill key={e} name={e} type="read" />)}
              </div>
            ) : <span className="text-slate-600 text-xs">none</span>}
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Database className="w-3 h-3 text-violet-400" /> Writes
            </p>
            {page.entities_written.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {page.entities_written.map(e => <EntityPill key={e} name={e} type="written" />)}
              </div>
            ) : <span className="text-slate-600 text-xs">none</span>}
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Agents Triggered
            </p>
            {page.agents_triggered.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {page.agents_triggered.map(a => <EntityPill key={a} name={a} type="agent" />)}
              </div>
            ) : <span className="text-slate-600 text-xs">none</span>}
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-green-400" /> Next Steps
            </p>
            {page.next_steps.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {page.next_steps.map(n => <EntityPill key={n} name={n} type="next" />)}
              </div>
            ) : <span className="text-slate-600 text-xs">end of flow</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupSection({ group }) {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = group.icon;

  return (
    <div className={`border rounded-2xl overflow-hidden ${group.borderColor}`}>
      <button
        onClick={() => setCollapsed(c => !c)}
        className={`w-full text-left px-5 py-4 flex items-center gap-3 ${group.bgColor} hover:opacity-90 transition-opacity`}
      >
        <Icon className={`w-5 h-5 ${group.color}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-sm ${group.color}`}>{group.label}</h3>
            <span className="text-slate-500 text-xs">({group.pages.length} pages)</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{group.description}</p>
        </div>
        {collapsed ? <ChevronRight className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {!collapsed && (
        <div className="p-4 space-y-3 bg-slate-950">
          {group.pages.map(page => <PageRow key={page.name} page={page} />)}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function WorkflowMap() {
  const [activeView, setActiveView] = useState('pages'); // 'pages' | 'pipeline' | 'entities'

  // Aggregate all entity write points across all pages
  const entityWriteMap = {};
  const entityReadMap = {};
  WORKFLOW_GROUPS.forEach(group => {
    group.pages.forEach(page => {
      page.entities_written.forEach(e => {
        if (!entityWriteMap[e]) entityWriteMap[e] = [];
        entityWriteMap[e].push({ page: page.name, group: group.label });
      });
      page.entities_read.forEach(e => {
        if (!entityReadMap[e]) entityReadMap[e] = [];
        entityReadMap[e].push({ page: page.name, group: group.label });
      });
    });
  });
  const allEntities = [...new Set([...Object.keys(entityWriteMap), ...Object.keys(entityReadMap)])].sort();

  // Aggregate all agent trigger points
  const agentTriggerMap = {};
  WORKFLOW_GROUPS.forEach(group => {
    group.pages.forEach(page => {
      page.agents_triggered.forEach(a => {
        if (!agentTriggerMap[a]) agentTriggerMap[a] = [];
        agentTriggerMap[a].push({ page: page.name, group: group.label });
      });
    });
  });

  const totalPages = WORKFLOW_GROUPS.reduce((s, g) => s + g.pages.length, 0);
  const totalAgentTriggers = Object.keys(agentTriggerMap).length;
  const totalEntitiesWritten = Object.keys(entityWriteMap).length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <AdminNav />
        <div className="flex-1 lg:pl-60">

          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Map className="w-6 h-6 text-violet-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Master Workflow Map</h1>
                  <p className="text-slate-400 text-sm">Every page, entity, agent, and workflow step — the full NTA system architecture</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'pages', label: 'Page Map', icon: BookOpen },
                  { id: 'pipeline', label: 'Pipeline', icon: ArrowRight },
                  { id: 'entities', label: 'Entity Index', icon: Database },
                ].map(v => {
                  const Icon = v.icon;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveView(v.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeView === v.id ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />{v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Pages Mapped', value: totalPages, icon: BookOpen, color: 'text-violet-400' },
                { label: 'Workflow Groups', value: WORKFLOW_GROUPS.length, icon: Map, color: 'text-sky-400' },
                { label: 'Agents Referenced', value: totalAgentTriggers, icon: BrainCircuit, color: 'text-amber-400' },
                { label: 'Entities Written', value: totalEntitiesWritten, icon: Database, color: 'text-green-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── View: Pipeline Flow ── */}
            {activeView === 'pipeline' && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">End-to-End Business Pipeline</h2>
                <p className="text-slate-400 text-sm">Every client journey follows this path from first touch to recurring billing.</p>

                {/* Linear pipeline */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {PIPELINE_FLOW.map((step, i) => (
                      <React.Fragment key={step.label}>
                        <div className={`${step.color} rounded-lg px-4 py-2 text-white text-sm font-bold`}>
                          {step.label}
                        </div>
                        {i < PIPELINE_FLOW.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Detailed flow table */}
                <div className="space-y-3">
                  {[
                    { stage: 'Traffic', pages: ['Home', 'Platform', 'Blog', 'Industries'], trigger: 'Visitor arrives via SEO, ads, or referral', next: 'Lead Capture CTA' },
                    { stage: 'Lead Capture', pages: ['TrialStart', 'Book-Call', 'Free-Audit', 'AdaIntake'], trigger: 'User submits form or starts trial', next: 'Lead Qualification Agent fires' },
                    { stage: 'Qualification', pages: ['CRMHub', 'LeadsDashboard'], trigger: 'Lead scored and routed by AI agent', next: 'Sales follow-up or trial activation' },
                    { stage: 'Onboarding', pages: ['TrialOnboarding', 'ClientOnboarding', 'SocialAccounts'], trigger: 'Subscription activated or proposal accepted', next: 'Brand Intake + Authority Plan Agents fire' },
                    { stage: 'Strategy', pages: ['AdminOnboardingQueue'], trigger: 'OnboardingProfile completed', next: 'MarketingPlan + ContentCampaigns created' },
                    { stage: 'Content Production', pages: ['ContentStudio', 'AiVideoStudio', 'ContentDrafts'], trigger: 'MarketingPlan activated', next: 'Content Agent generates posts' },
                    { stage: 'Scheduling', pages: ['ScheduledQueue', 'ContentStudio'], trigger: 'ContentItem approved', next: 'Scheduling Agent assigns times' },
                    { stage: 'Publishing', pages: ['ScheduledQueue'], trigger: 'ScheduledPost.scheduled_at <= now', next: 'Publishing Agent posts to platforms' },
                    { stage: 'Reporting', pages: ['Dashboard', 'AiOperations'], trigger: 'Monthly cron or manual trigger', next: 'Reporting Agent generates PerformanceReport' },
                    { stage: 'Upsell', pages: ['Dashboard', 'CRMHub'], trigger: 'PerformanceReport created', next: 'Upgrade Opportunity + Offer Rec Agents fire' },
                    { stage: 'Billing', pages: ['OperationsHub', 'AdminDashboard'], trigger: 'Subscription billing date or upgrade', next: 'Billing Agent creates Invoice' },
                  ].map(row => (
                    <div key={row.stage} className="bg-slate-900 border border-slate-700 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Stage</p>
                        <p className="text-white font-bold text-sm">{row.stage}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Pages</p>
                        <div className="flex flex-wrap gap-1">
                          {row.pages.map(p => <EntityPill key={p} name={p} type="next" />)}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Trigger</p>
                        <p className="text-slate-300 text-xs">{row.trigger}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Next</p>
                        <p className="text-slate-300 text-xs">{row.next}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── View: Entity Index ── */}
            {activeView === 'entities' && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Entity Usage Index</h2>
                <p className="text-slate-400 text-sm">Every entity, where it's written, and where it's read.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {allEntities.map(entity => (
                    <div key={entity} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Database className="w-4 h-4 text-slate-400" />
                        <p className="text-white font-semibold text-sm">{entity}</p>
                      </div>
                      {entityWriteMap[entity] && (
                        <div className="mb-2">
                          <p className="text-violet-400 text-[10px] uppercase tracking-wide mb-1">Written by</p>
                          <div className="flex flex-wrap gap-1">
                            {entityWriteMap[entity].map((w, i) => (
                              <span key={i} className="text-[10px] bg-violet-900/40 text-violet-300 border border-violet-700/30 px-1.5 py-0.5 rounded">{w.page}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {entityReadMap[entity] && (
                        <div>
                          <p className="text-blue-400 text-[10px] uppercase tracking-wide mb-1">Read by</p>
                          <div className="flex flex-wrap gap-1">
                            {entityReadMap[entity].map((r, i) => (
                              <span key={i} className="text-[10px] bg-blue-900/40 text-blue-300 border border-blue-700/30 px-1.5 py-0.5 rounded">{r.page}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── View: Page Map ── */}
            {activeView === 'pages' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-900/50 border border-blue-700/50 inline-block" />Reads entity</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-violet-900/50 border border-violet-700/50 inline-block" />Writes entity</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-900/50 border border-amber-700/50 inline-block" />Triggers agent</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700 inline-block" />Next step</span>
                  <span className="text-slate-600">— click any page row to expand details</span>
                </div>
                {WORKFLOW_GROUPS.map(group => <GroupSection key={group.id} group={group} />)}
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminGuard>
  );
}