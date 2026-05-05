import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, FileText, BarChart2,
  ChevronLeft, Menu, ChevronDown, ChevronRight, Target,
  Send, Megaphone, Shield, Calendar, BarChart, Radio, BookOpen, Globe, Wifi, Link2,
  BookOpenCheck, HelpCircle, X, Search, Zap
} from 'lucide-react';
import { TutorialProvider, useTutorial } from './TutorialContext';
import TutorialOverlay from './TutorialOverlay';

const NAV = [
  { label: 'Dashboard',           href: '/agency',                      icon: LayoutDashboard, exact: true },
  { label: 'Lead Pipeline',       href: '/agency/leads/pipeline',       icon: TrendingUp },
  { label: 'Leads',               href: '/agency/leads',                icon: Target },
  { label: 'Gap Audits',          href: '/agency/gap-audits',           icon: Search },
  { label: 'AI Gap Scanner',      href: '/agency/ai-gap-scanner',       icon: Zap },
  { label: 'Clients',             href: '/agency/clients',              icon: Users },
  { label: 'Content Library',      href: '/agency/content-library',      icon: FileText },
  { label: 'Content Center',      href: '/agency/content',              icon: FileText },
  { label: 'Campaigns',           href: '/agency/campaigns',            icon: Megaphone },
  { label: 'Spoke Campaigns',     href: '/agency/spoke-campaigns',      icon: Radio },
  { label: 'Insight Pages',       href: '/agency/insight-pages',        icon: BookOpen },
  { label: 'Approval Center',     href: '/agency/approval-center',      icon: Shield },
  { label: 'Publishing Calendar', href: '/agency/publishing-calendar',  icon: Calendar },
  { label: 'Channel Connections', href: '/agency/channel-connections',  icon: Wifi },
  { label: 'Client Channel Setup', href: '/agency/channel-setup',       icon: Link2 },
  { label: 'Performance',         href: '/agency/campaign-performance', icon: BarChart },
  { label: 'Websites',            href: '/agency/websites',             icon: Globe },
];

function AgencyLayoutInner({ children }) {
  const { pathname, search } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const { start, toggleHelp, helpMode, active: tutorialActive } = useTutorial();

  const toggleSection = (label) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href, exact) => {
    if (!href) return false;
    const fullPath = pathname + search;
    if (exact) return pathname === href;
    return pathname === href || fullPath.startsWith(href);
  };

  const isSectionActive = (item) => {
    if (item.href) return isActive(item.href, item.exact);
    return item.children?.some(c => isActive(c.href));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-14' : 'w-56'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200`}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-800 flex-shrink-0">
          {!collapsed && (
            <div>
              <p className="font-black text-sm text-white leading-none">NTA</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Agency Command</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-slate-500 hover:text-white rounded-lg ml-auto"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isSectionActive(item);

            // Simple link
            if (item.href && !item.children) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && item.label}
                </Link>
              );
            }

            // Section with children
            const open = openSections[item.label] ?? active;
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleSection(item.label)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </>
                  )}
                </button>
                {!collapsed && open && (
                  <div className="ml-4 pl-3 border-l border-slate-800 mt-0.5 space-y-0.5 mb-1">
                    {item.children.map(child => (
                      <Link
                        key={child.label + child.href}
                        to={child.href}
                        className={`block px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive(child.href) ? 'bg-blue-600/20 text-blue-300' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-slate-800 flex-shrink-0 space-y-1">
          {!collapsed && (
            <a href="/" className="block text-xs text-slate-600 hover:text-slate-400 transition-colors">← Public Site</a>
          )}
          {/* Help mode toggle */}
          <button
            onClick={toggleHelp}
            title="Toggle Help Mode"
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              helpMode ? 'bg-blue-700/30 text-blue-300' : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (helpMode ? 'Help On' : 'Help')}
          </button>
          {/* Start tutorial */}
          <button
            onClick={start}
            title="Start Guided Workflow"
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <BookOpenCheck className="w-4 h-4 flex-shrink-0" />
            {!collapsed && 'Guided Workflow'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {children}
      </main>

      {/* Tutorial overlay rendered at layout level so it covers everything */}
      <TutorialOverlay />
    </div>
  );
}

export default function AgencyLayout({ children }) {
  return (
    <TutorialProvider>
      <AgencyLayoutInner>{children}</AgencyLayoutInner>
    </TutorialProvider>
  );
}