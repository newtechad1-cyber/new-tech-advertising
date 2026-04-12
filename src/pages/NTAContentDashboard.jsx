import React, { useState } from 'react';
import {
  LayoutDashboard, Library, Film, Calendar, Mail, Monitor,
  BarChart2, Settings, ChevronLeft, Menu, Zap, Users
} from 'lucide-react';
import NTAOverview from '../components/nta-dashboard/NTAOverview';
import NTAContentLibrary from '../components/nta-dashboard/NTAContentLibrary';
import NTAProductionQueue from '../components/nta-dashboard/NTAProductionQueue';
import NTAPostingCalendar from '../components/nta-dashboard/NTAPostingCalendar';
import NTAOutreachContent from '../components/nta-dashboard/NTAOutreachContent';
import NTADemoAssets from '../components/nta-dashboard/NTADemoAssets';
import NTAAnalytics from '../components/nta-dashboard/NTAAnalytics';
import NTASettings from '../components/nta-dashboard/NTASettings';
import NTALeadContentMatch from '../components/nta-dashboard/NTALeadContentMatch';

const NAV = [
  { id: 'overview',    label: 'Overview',           icon: LayoutDashboard },
  { id: 'library',     label: 'Content Library',     icon: Library },
  { id: 'production',  label: 'Production Queue',    icon: Film },
  { id: 'calendar',    label: 'Posting Calendar',    icon: Calendar },
  { id: 'outreach',    label: 'Outreach Content',    icon: Mail },
  { id: 'demo',        label: 'Demo Assets',         icon: Monitor },
  { id: 'analytics',   label: 'Analytics',           icon: BarChart2 },
  { id: 'settings',    label: 'Settings',            icon: Settings },
  { id: 'leadmatch',   label: 'Lead Content Match',  icon: Users },
];

const SECTIONS = {
  overview:   NTAOverview,
  library:    NTAContentLibrary,
  production: NTAProductionQueue,
  calendar:   NTAPostingCalendar,
  outreach:   NTAOutreachContent,
  demo:       NTADemoAssets,
  analytics:  NTAAnalytics,
  settings:   NTASettings,
  leadmatch:  NTALeadContentMatch,
};

export default function NTAContentDashboard() {
  const [active, setActive] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  const Section = SECTIONS[active] || NTAOverview;

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-14' : 'w-60'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200`}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-slate-800 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-xs text-white leading-none">NTA</p>
                <p className="text-slate-500 text-xs leading-none mt-0.5">Video Command</p>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-slate-500 hover:text-white rounded-lg ml-auto flex-shrink-0">
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)} title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active === id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && label}
            </button>
          ))}
        </nav>

        {/* Contact footer */}
        {!collapsed && (
          <div className="px-3 py-3 border-t border-slate-800 flex-shrink-0">
            <p className="text-xs font-semibold text-slate-300">Rick Hesse</p>
            <p className="text-xs text-slate-500">New Tech Advertising</p>
            <a href="https://newtech.ad" className="text-xs text-blue-500 hover:text-blue-400 mt-0.5 block">newtech.ad</a>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <Section onNavigate={setActive} />
      </main>
    </div>
  );
}