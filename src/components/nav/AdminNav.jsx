import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard, Users, TrendingUp, FileText, FolderKanban,
  Share2, MessageSquare, Settings, LogOut, Menu, X,
  Bot, Globe, CreditCard, Bell, Cpu, Target, Briefcase, UserCog, AlertCircle, CheckSquare, Brain, Zap, BarChart2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

// ── Admin navigation — canonical /admin route ──────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Executive',
    items: [
      { label: '⚡ Founder Dashboard', icon: Zap, page: 'AdminFounder' },
      { label: '👔 Executive Dashboard', icon: TrendingUp, page: 'AdminExecutive' },
      { label: '🧠 AI Copilot', icon: Brain, page: 'AdminCopilot' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Command Center', icon: Cpu, page: 'AdminCommandCenter' },
      { label: '🔔 Alert Center', icon: AlertCircle, page: 'AdminAlerts' },
      { label: '🎯 Sales Room HQ', icon: Target, page: 'AdminSalesDashboard' },
      { label: 'Sales Assets', icon: Briefcase, page: 'AdminSalesAssets' },
      { label: 'Sales Prompts', icon: Bot, page: 'AdminSalesPrompts' },
      { label: 'Follow-ups', icon: Bell, page: 'AdminSalesFollowups' },
      { label: 'Leads & CRM', icon: Users, page: 'LeadsDashboard' },
      { label: 'Clients', icon: Briefcase, page: 'AdminClients' },
      { label: 'Users', icon: UserCog, page: 'AdminUsers' },
      { label: 'Proposals', icon: FileText, page: 'ProposalsList' },
      { label: 'Pipeline', icon: FolderKanban, page: 'ProposalPipeline' },
      { label: 'Onboarding', icon: CheckSquare, page: 'AdminOnboarding' },
      { label: 'Fulfillment', icon: Briefcase, page: 'AdminFulfillment' },
      { label: 'Tasks', icon: CheckSquare, page: 'AdminTasks' },
      { label: 'Opportunities', icon: TrendingUp, page: 'OperationsHub' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: '⚡ Content Engine', icon: Zap, page: 'AdminContentEngine' },
      { label: 'Content Queue', icon: Share2, page: 'ContentQueue' },
      { label: 'Content Studio', icon: Bot, page: 'ContentStudio' },
      { label: 'AI Operations', icon: Bot, page: 'AiOperations' },
      { label: 'Video Queue', icon: Globe, page: 'AdminVideoQueue' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Intel Hub', icon: Bot, page: 'IntelAdmin' },
      { label: 'Industry Intel', icon: Bot, page: 'IndustryIntelAdmin' },
      { label: 'Local Market Intel', icon: Globe, page: 'LocalMarketIntelAdmin' },
      { label: 'Business Profiles', icon: Users, page: 'BusinessProfileAdmin' },
      { label: 'Marketing Brain', icon: TrendingUp, page: 'BusinessIntelProfileAdmin' },
      { label: 'Opportunities', icon: TrendingUp, page: 'OpportunitySignalAdmin' },
      { label: 'Weekly Plans', icon: LayoutDashboard, page: 'WeeklyPlanAdmin' },
      { label: 'Performance Signals', icon: Share2, page: 'PerformanceSignalAdmin' },
      { label: 'Workflow Orchestrator', icon: Zap, page: 'AdminOrchestrator' },
      { label: 'Optimizer', icon: TrendingUp, page: 'AdminOptimizer' },
    ],
  },
  {
    label: '🏫 School Story Lab',
    items: [
      { label: 'HD School Admin', icon: LayoutDashboard, href: '/admin/schools/hampton-dumont/dashboard' },
      { label: 'Public School Site', icon: Globe, href: '/schools/hampton-dumont/home' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Blog', icon: FileText, page: 'AdminBlog' },
      { label: 'Social Accounts', icon: Share2, page: 'SocialAccounts' },
      { label: 'Chatbots', icon: MessageSquare, page: 'ChatbotManagement' },
      { label: 'Billing', icon: CreditCard, page: 'AdminDashboard' },
      { label: 'Settings', icon: Settings, page: 'AdminSettings' },
    ],
  },
];

export default function AdminNav({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (page) => {
    const target = createPageUrl(page);
    return location.pathname === target || location.pathname === target + '.html';
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-800">
        <Link to={createPageUrl('AdminDashboard')} onClick={() => setMobileOpen(false)}>
          <img src={LOGO_URL} alt="NTA Admin" className="h-8 w-auto" />
        </Link>
        <span className="text-xs text-slate-500 mt-1 block">Admin Panel</span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map(item => (
                <li key={item.label}>
                  <Link
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.page)
                        ? 'bg-violet-600/20 text-violet-300'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-0.5">
        <Link
          to={createPageUrl('Home')}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Globe className="w-4 h-4" /> View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 h-14 flex items-center justify-between px-4">
        <Link to={createPageUrl('AdminDashboard')}>
          <img src={LOGO_URL} alt="NTA" className="h-7 w-auto" />
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-white p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:pl-56 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}