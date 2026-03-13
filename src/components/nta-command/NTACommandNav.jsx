import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Share2, Bot, Building2, Target, DollarSign, Menu, X, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Operator',    path: '/nta/operator-command',   icon: LayoutDashboard },
  { label: 'Onboarding',  path: '/nta/onboarding',         icon: Users },
  { label: 'Channels',    path: '/nta/channels',           icon: Share2 },
  { label: 'AI Workforce',path: '/nta/ai-workforce',       icon: Bot },
  { label: 'Resellers',   path: '/nta/reseller-command',   icon: Building2 },
  { label: 'Deal Room',   path: '/nta/deal-room',          icon: Target },
  { label: 'Pricing',     path: '/nta/pricing-stack',      icon: DollarSign },
  { label: 'Acquisition', path: '/nta/acquisition-command',icon: Zap },
];

export default function NTACommandNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1 px-4 h-10 max-w-[1600px] mx-auto">
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest mr-3 whitespace-nowrap">NTA Command</span>
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                <item.icon className="w-3 h-3 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/AdminDashboard" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Admin →
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 h-10">
        <span className="text-xs font-black text-slate-400">NTA Command</span>
        <button onClick={() => setMobileOpen(o => !o)} className="text-slate-400 hover:text-white p-1">
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 grid grid-cols-2 gap-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                isActive(item.path) ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <item.icon className="w-3 h-3" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}