import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users, UserCheck, Search, Megaphone, Globe, FileText,
  Video, Share2, CheckSquare, Target, Bell, BarChart2,
  ChevronLeft, Menu, ExternalLink, Home,
  ClipboardList, FileSignature, FolderOpen, Brain
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const NAV = [
  { label: 'Dashboard', href: '/ops', icon: Home, exact: true },
  { label: 'AI Monitor', href: '/ops/ai-monitor', icon: Brain },
  { label: 'Prospects', href: '/ops/prospects', icon: Target },
  { label: 'Clients', href: '/ops/clients', icon: UserCheck },
  { label: 'Onboarding', href: '/ops/onboarding', icon: ClipboardList },
  { label: 'Agreements', href: '/ops/agreements', icon: FileSignature },
  { label: 'Documents', href: '/ops/documents', icon: FolderOpen },
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
  const [pendingCount, setPendingCount] = useState(0);
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    base44.entities.ContentAsset.filter({ approval_status: 'pending' }).then(r => setPendingCount(r.length)).catch(() => {});
    base44.entities.Lead.filter({ status: 'new' }).then(r => setNewLeads(r.length)).catch(() => {});
  }, [pathname]);

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
                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {item.href === '/ops/approvals' && pendingCount > 0 && (
                  <span className={`${collapsed ? 'absolute -top-0.5 -right-0.5' : ''} bg-yellow-500 text-black text-xs font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none`}>
                    {pendingCount}
                  </span>
                )}
                {item.href === '/ops/leads' && newLeads > 0 && (
                  <span className={`${collapsed ? 'absolute -top-0.5 -right-0.5' : ''} bg-blue-500 text-white text-xs font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none`}>
                    {newLeads}
                  </span>
                )}
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