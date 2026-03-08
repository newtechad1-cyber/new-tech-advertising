import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png';

const TABS = [
  { id: 'analytics', label: 'Dashboard' },
  { id: 'fulfillment', label: 'Fulfillment', path: 'ClientFulfillment' },
  { id: 'submissions', label: 'Content' },
  { id: 'social', label: 'Social' },
  { id: 'videos', label: 'Video' },
  { id: 'proposals', label: 'Leads' },
  { id: 'subscription', label: 'Billing' },
  { id: 'resources', label: 'Settings' },
];

export default function AppNav({ activeTab, onTabChange, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to={createPageUrl('Dashboard')}>
            <img
              src={LOGO_URL}
              alt="New Tech Advertising"
              className="h-8 w-auto"
            />
          </Link>

          {/* Right: Upgrade + user (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-8 px-4 text-sm"
              onClick={() => onTabChange('subscription')}
            >
              <ArrowUpCircle className="w-4 h-4 mr-1.5" />
              Upgrade to DFY
            </Button>
            {user && (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-slate-600 hidden lg:block">{user.full_name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Tab nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1 -mb-px overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg">
          <nav className="px-4 py-2 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-slate-100 flex flex-col gap-2">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
              onClick={() => { onTabChange('subscription'); setMobileOpen(false); }}
            >
              <ArrowUpCircle className="w-4 h-4 mr-1.5" />
              Upgrade to DFY
            </Button>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 py-1 text-center"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}