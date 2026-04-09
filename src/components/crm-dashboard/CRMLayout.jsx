import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Archive, ChevronLeft, Menu, X, FileText, Building2 } from 'lucide-react';

const NAV = [
  { label: 'Daily Command', href: '/dashboard', icon: LayoutDashboard },
  { label: 'All Leads', href: '/dashboard/leads', icon: Users },
  { label: 'Archived Leads', href: '/dashboard/archived', icon: Archive },
  { label: 'Clients', href: '/clients', icon: Building2 },
  { label: 'Content Center', href: '/content-center', icon: FileText },
];

export default function CRMLayout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${open ? 'w-56' : 'w-14'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200`}>
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-800">
          {open && <span className="font-bold text-sm text-slate-100">NTA CRM</span>}
          <button onClick={() => setOpen(!open)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            {open ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                title={!open ? label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {open && label}
              </Link>
            );
          })}
        </nav>
        {open && (
          <div className="px-3 py-3 border-t border-slate-800">
            <a href="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Website
            </a>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}