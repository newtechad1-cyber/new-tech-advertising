import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Calendar, FileText,
  BarChart2, MessageSquare, User, ChevronLeft, Menu, LogOut
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const NAV = [
  { label: 'Dashboard',      href: '/portal',              icon: LayoutDashboard, exact: true },
  { label: 'Approvals',      href: '/portal/approvals',    icon: CheckSquare },
  { label: 'Calendar',       href: '/portal/calendar',     icon: Calendar },
  { label: 'Content',        href: '/portal/content',      icon: FileText },
  { label: 'Performance',    href: '/portal/performance',  icon: BarChart2 },
  { label: 'Messages',       href: '/portal/messages',     icon: MessageSquare },
  { label: 'Account',        href: '/portal/account',      icon: User },
];

export default function PortalLayout({ children, client, user }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href, exact) => exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-14' : 'w-56'} flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-200`}>
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-100 flex-shrink-0">
          {!collapsed && (
            <div>
              <p className="font-black text-sm text-slate-900 leading-none truncate max-w-[140px]">{client?.business_name || 'My Portal'}</p>
              <p className="text-xs text-slate-400 leading-none mt-0.5">Client Portal</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg ml-auto">
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.label} to={item.href} title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="px-3 py-3 border-t border-slate-100 flex-shrink-0">
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            <button onClick={() => base44.auth.logout('/')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mt-1.5 transition-colors">
              <LogOut className="w-3 h-3" /> Sign out
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}