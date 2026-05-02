import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users, UserCheck, Search, Megaphone, Globe, FileText,
  Video, Share2, CheckSquare, Target, Bell, BarChart2,
  ChevronLeft, Menu, ExternalLink, Home
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/ops', icon: Home, exact: true },
  { label: 'Prospects', href: '/ops/prospects', icon: Target },
  { label: 'Clients', href: '/ops/clients', icon: UserCheck },
  { label: 'Gap Audits', href: '/ops/audits', icon: Search },
  { label: 'Campaigns', href: '/ops/campaigns', icon: Megaphone },
  { label: 'SEO Pages', href: '/ops/seo-pages', icon: Globe },
  { label: 'Content Assets', href: '/ops/content', icon: FileText },
  { label: 'Video Scripts', href: '/ops/videos', icon: Video },
  { label: 'Social Queue', href: '/ops/social', icon: Share2 },
  { label: 'Approvals', href: '/ops/approvals', icon: CheckSquare },
  { label: 'Leads', href: '/ops/leads', icon: Users },
  { label: 'Follow-Ups', href: '/ops/followups', icon: Bell },
  { label: 'Reports', href: '/ops/reports', icon: BarChart2 },
];

export default function OpsLayout({ children }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href, exact) => exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-14' : 'w-56'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200`}>
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-800 flex-shrink-0">
          {!collapsed && (
            <div>
              <p className="font-black text-sm text-white leading-none">NTA OPS</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Operations Center</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-slate-500 hover:text-white rounded-lg ml-auto">
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
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
          })}
        </nav>

        <div className="px-3 py-3 border-t border-slate-800 flex-shrink-0 space-y-1">
          {!collapsed && (
            <a href="/" className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
              <ExternalLink className="w-3 h-3" /> Public Site
            </a>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}