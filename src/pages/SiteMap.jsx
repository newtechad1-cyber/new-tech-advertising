import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Home, Rocket, Settings, Globe, FolderInput, Wrench, ChevronDown, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';

// ── The 7 Core Operational Pages ────────────────────────────────────────────────
const CORE_PAGES = [
  { path: '/',                    label: 'Homepage',         page: 'Home',             desc: 'Marketing entry point — all CTAs originate here' },
  { path: '/start',               label: 'Start Free Trial', page: 'Get-Started',      desc: 'Trial signup → creates Company, Lead, Subscription' },
  { path: '/onboarding',          label: 'Onboarding',       page: 'ClientOnboarding', desc: 'Brand intake → triggers AuthorityPlan + ContentCampaign agents' },
  { path: '/dashboard',           label: 'Dashboard',        page: 'Dashboard',        desc: 'Client home — analytics, content, billing, proposals' },
  { path: '/dashboard?tab=content', label: 'Dashboard / Content', page: 'Dashboard',  desc: 'Content submissions view — ?tab=content' },
  { path: '/dashboard?tab=calendar', label: 'Dashboard / Calendar', page: 'Dashboard', desc: 'Content calendar / scheduled queue — ?tab=calendar' },
  { path: '/admin',               label: 'Admin',            page: 'AdminDashboard',   desc: 'Internal ops hub — leads, projects, AI jobs, settings' },
];

// ── Supporting Pages by Category ────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'marketing',
    label: 'Marketing Pages',
    icon: Globe,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    desc: 'Public-facing brand and content pages. SEO-driven, no auth required.',
    pages: [
      { label: 'AI Marketing Platform',    page: 'AiMarketingPlatform',     path: '/platform' },
      { label: 'Social Media Marketing',   page: 'SocialMediaMarketing',    path: '/social-media-marketing' },
      { label: 'AI Social Media',          page: 'AiSocialMedia',           path: '→ redirects to platform' },
      { label: 'AI Videos',                page: 'AiVideos',                path: '/videos' },
      { label: 'Local Visibility',         page: 'LocalVisibility',         path: '/local-visibility' },
      { label: 'Local Business Marketing', page: 'LocalBusinessMarketing',  path: '/local-business' },
      { label: 'Industries Hub',           page: 'IndustriesHub',           path: '/industries' },
      { label: 'HVAC Marketing',           page: 'HvacMarketing',           path: '/industries/hvac' },
      { label: 'Restaurant Social Media',  page: 'RestaurantSocialMedia',   path: '/industries/restaurants' },
      { label: 'Industries: Nonprofits',   page: 'IndustriesNonprofits',    path: '/industries/nonprofits' },
      { label: 'Industries: Professionals',page: 'IndustriesProfessionals', path: '/industries/professionals' },
      { label: 'Industries: Trades',       page: 'IndustriesServiceTrades', path: '/industries/service-trades' },
      { label: 'About',                    page: 'About',                   path: '/about' },
      { label: 'Blog',                     page: 'Blog',                    path: '/blog' },
      { label: 'Our Work',                 page: 'OurWork',                 path: '/our-work' },
      { label: 'Privacy Policy',           page: 'PrivacyPolicy',           path: '/privacy' },
      { label: 'Terms of Service',         page: 'TermsOfService',          path: '/terms' },
    ],
  },
  {
    id: 'services',
    label: 'Service Pages',
    icon: Globe,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    desc: 'Dedicated service landing pages. Each links to a matching intake funnel.',
    pages: [
      { label: 'Social Media Management',  page: 'SocialMediaManagement',  path: '/services/social-media' },
      { label: 'Website Rebuild',          page: 'Website-Rebuild',        path: '/services/website-rebuild',   canonical: true },
      { label: 'WebsiteRebuild',           page: 'WebsiteRebuild',         path: '→ redirects to Website-Rebuild' },
      { label: 'ADA Accessibility',        page: 'AdaAccessibility',       path: '/services/ada-compliance' },
      { label: 'Ada Compliance',           page: 'Ada-Compliance',         path: '/ada-compliance' },
      { label: 'Streaming TV',             page: 'Streaming-TV',           path: '/services/streaming-tv',      canonical: true },
      { label: 'StreamingTV',              page: 'StreamingTV',            path: '→ redirects to Streaming-TV' },
      { label: 'AI Video Studio',          page: 'AiVideoStudio',          path: '/services/video-studio' },
      { label: 'AI Advertising',           page: 'AiAdvertising',          path: '/services/ai-advertising' },
      { label: 'AI SEO',                   page: 'AiSeo',                  path: '/services/ai-seo' },
      { label: 'AI Websites',              page: 'AiWebsites',             path: '/services/ai-websites' },
    ],
  },
  {
    id: 'intake',
    label: 'Project Intake Pages',
    icon: FolderInput,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    desc: 'Lead capture and project qualification funnels. Each writes Lead + Opportunity.',
    pages: [
      { label: 'Free Audit',           page: 'Free-Audit',          path: '/free-audit' },
      { label: 'Book a Call',          page: 'Book-Call',           path: '/book-call' },
      { label: 'ADA Intake',           page: 'AdaIntake',           path: '/funnels/ada-intake' },
      { label: 'ADA Onboarding',       page: 'AdaOnboarding',       path: '/funnels/ada-onboarding' },
      { label: 'ADA Quote',            page: 'AdaQuote',            path: '/funnels/ada-quote' },
      { label: 'Rebuild Intake',       page: 'Rebuild-Intake',      path: '/funnels/rebuild-intake',   canonical: true },
      { label: 'RebuildIntake',        page: 'RebuildIntake',       path: '→ redirects to Rebuild-Intake' },
      { label: 'RebuildIntakePretty',  page: 'RebuildIntakePretty', path: '→ redirects to Rebuild-Intake' },
      { label: 'Rebuild Proposal',     page: 'RebuildProposal',     path: '/proposal/rebuild/:id' },
      { label: 'Streaming Intake',     page: 'StreamingIntake',     path: '/funnels/streaming-intake' },
      { label: 'Streaming Proposal',   page: 'StreamingProposal',   path: '/proposal/streaming/:id' },
      { label: 'Contact',              page: 'Contact',             path: '/contact' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Tools',
    icon: Wrench,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    desc: 'Internal operations. Admin role required. Accessed via /admin.',
    pages: [
      { label: 'Admin Dashboard',        page: 'AdminDashboard',        path: '/admin' },
      { label: 'CRM Hub',                page: 'CRMHub',                path: '/admin/crm' },
      { label: 'Leads Dashboard',        page: 'LeadsDashboard',        path: '/admin/leads' },
      { label: 'Lead Detail',            page: 'LeadDetail',            path: '/admin/leads/:id' },
      { label: 'Operations Hub',         page: 'OperationsHub',         path: '/admin/operations' },
      { label: 'AI Operations',          page: 'AiOperations',          path: '/admin/ai-ops' },
      { label: 'Agent Architecture',     page: 'AgentArchitecture',     path: '/admin/agents' },
      { label: 'Admin Blog',             page: 'AdminBlog',             path: '/admin/blog' },
      { label: 'Admin Onboarding Queue', page: 'AdminOnboardingQueue',  path: '/admin/onboarding' },
      { label: 'Admin Video Queue',      page: 'AdminVideoQueue',       path: '/admin/video-queue' },
      { label: 'Admin Video Detail',     page: 'AdminVideoDetail',      path: '/admin/video/:id' },
      { label: 'Admin Video Generator',  page: 'AdminVideoGenerator',   path: '/admin/video-generator' },
      { label: 'Global Settings',        page: 'GlobalSettings',        path: '/admin/settings/global' },
      { label: 'Admin Settings',         page: 'AdminSettings',         path: '/admin/settings' },
      { label: 'Social Accounts',        page: 'SocialAccounts',        path: '/admin/social' },
      { label: 'Content Queue',          page: 'ContentQueue',          path: '/admin/content-queue' },
      { label: 'Content Studio',         page: 'ContentStudio',         path: '/admin/content-studio' },
      { label: 'Scheduled Queue',        page: 'ScheduledQueue',        path: '/admin/scheduled' },
      { label: 'Chatbot Management',     page: 'ChatbotManagement',     path: '/admin/chatbots' },
      { label: 'Authority Map',          page: 'AuthorityMap',          path: '/admin/authority-map' },
      { label: 'Workflow Map',           page: 'WorkflowMap',           path: '/admin/workflow-map' },
      { label: 'Debug OAuth',            page: 'DebugOAuthConnections', path: '/admin/debug-oauth' },
    ],
  },
];

function CategorySection({ cat }) {
  const [open, setOpen] = useState(true);
  const Icon = cat.icon;
  return (
    <div className={`border rounded-2xl overflow-hidden ${cat.border}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full text-left px-5 py-4 flex items-center gap-3 ${cat.bg} hover:opacity-90 transition-opacity`}
      >
        <Icon className={`w-5 h-5 ${cat.color}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${cat.color}`}>{cat.label}</span>
            <span className="text-slate-500 text-xs">({cat.pages.length} pages)</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{cat.desc}</p>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </button>
      {open && (
        <div className="bg-slate-950 divide-y divide-slate-800">
          {cat.pages.map(p => (
            <div key={p.page} className="px-5 py-2.5 flex items-center justify-between gap-4 hover:bg-slate-900/40">
              <div className="flex-1 min-w-0">
                <span className="text-white text-sm font-medium">{p.label}</span>
                {p.canonical && <span className="ml-2 text-[10px] bg-green-900/50 text-green-400 border border-green-700/30 px-1.5 py-0.5 rounded-full">canonical</span>}
                <p className="text-slate-500 text-xs font-mono">{p.path}</p>
              </div>
              {!p.path.startsWith('→') && (
                <Link to={createPageUrl(p.page)} className="text-slate-600 hover:text-violet-400 transition-colors flex-shrink-0" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteMap() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-violet-400" /> Site Map & Page Inventory
          </h1>
          <p className="text-slate-400 mt-1">The 7 core operational pages and all supporting pages by category.</p>
        </div>

        {/* Core 7 */}
        <div className="border border-violet-500/30 rounded-2xl overflow-hidden">
          <div className="bg-violet-500/10 px-5 py-4 flex items-center gap-3">
            <Rocket className="w-5 h-5 text-violet-400" />
            <div>
              <h2 className="font-bold text-violet-300 text-sm">Core Operational Pages</h2>
              <p className="text-slate-400 text-xs mt-0.5">The primary workflow — every user journey passes through these 7 pages.</p>
            </div>
          </div>
          <div className="bg-slate-950 divide-y divide-slate-800">
            {CORE_PAGES.map((p, i) => (
              <div key={p.path} className="px-5 py-3 flex items-start gap-4 hover:bg-slate-900/40">
                <span className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{p.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <code className="text-violet-300 text-xs font-mono bg-slate-800 px-1.5 py-0.5 rounded">{p.path}</code>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{p.desc}</p>
                </div>
                <Link to={createPageUrl(p.page)} className="text-slate-600 hover:text-violet-400 transition-colors flex-shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Category sections */}
        {CATEGORIES.map(cat => <CategorySection key={cat.id} cat={cat} />)}

      </div>
    </div>
  );
}