import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Kanban, FileText, Globe, ChevronLeft, Menu } from 'lucide-react';

const NAV = [
  { label: 'Dashboard',      href: '/agency',          icon: LayoutDashboard },
  { label: 'Clients',        href: '/agency/clients',   icon: Users },
  { label: 'Pipeline',       href: '/agency/pipeline',  icon: Kanban },
  { label: 'Content Center', href: '/agency/content',   icon: FileText },
  { label: 'Websites',       href: '/agency/websites',  icon: Globe },
];

export default function AgencyLayout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <aside className={`${open ? 'w-52' : 'w-14'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200`}>
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-800">
          {open && (
            <div>
              <p className="font-black text-sm text-white leading-none">NTA Agency</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Operations</p>
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="p-1.5 text-slate-500 hover:text-white rounded-lg ml-auto">
            {open ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/agency' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                title={!open ? label : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {open && label}
              </Link>
            );
          })}
        </nav>

        {open && (
          <div className="px-3 py-3 border-t border-slate-800 space-y-1">
            <a href="/" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">← Public Site</a>
            <a href="/dashboard" className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">← CRM (Legacy)</a>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}