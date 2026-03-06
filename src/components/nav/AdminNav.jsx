import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard, Users, FileText, Video, Settings,
  Globe, LogOut, Menu, X, Zap, Link2, BrainCircuit
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const NAV_ITEMS = [
  { label: 'Admin Dashboard', href: createPageUrl('AdminDashboard'), icon: LayoutDashboard },
  { label: 'Onboarding Queue', href: createPageUrl('AdminOnboardingQueue'), icon: Users },
  { label: 'Blog', href: createPageUrl('AdminBlog'), icon: FileText },
  { label: 'Video Queue', href: createPageUrl('AdminVideoQueue'), icon: Video },
  { label: 'Integrations', href: createPageUrl('SocialAccounts'), icon: Link2 },
  { label: 'Agent Architecture', href: createPageUrl('AgentArchitecture'), icon: BrainCircuit },
  { label: 'Global Settings', href: createPageUrl('GlobalSettings'), icon: Settings },
];

export default function AdminNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => location.pathname === href || location.pathname === href + '.html';

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col z-20">
        <div className="flex grow flex-col overflow-y-auto bg-slate-950 border-r border-slate-800">
          {/* Logo */}
          <div className="px-4 py-4 border-b border-slate-800">
            <Link to={createPageUrl('AdminDashboard')}>
              <img src={LOGO_URL} alt="New Tech Advertising" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <div className="flex items-center gap-1.5 mt-2">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-semibold tracking-wide">ADMIN PANEL</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-slate-800 space-y-1">
            <Link
              to={createPageUrl('Home')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Globe className="w-4 h-4" />
              View Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-slate-950 border-b border-slate-800 px-4 py-3">
        <Link to={createPageUrl('AdminDashboard')}>
          <img src={LOGO_URL} alt="New Tech Advertising" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xs font-semibold tracking-wide">ADMIN</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-400 hover:text-white p-1"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[53px] z-20 bg-slate-950 overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-slate-800 space-y-1">
              <Link
                to={createPageUrl('Home')}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Globe className="w-4 h-4" />
                View Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}