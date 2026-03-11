import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useResellerContext } from '@/components/context/useResellerContext';
import { createPageUrl } from '@/utils';

export default function ResellerNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { reseller, branding } = useResellerContext();

  const navItems = [
    { label: 'Dashboard', url: createPageUrl('ResellerDashboard') },
    { label: 'Clients', url: createPageUrl('ResellerClients') },
    { label: 'Publishing', url: createPageUrl('ResellerPublishing') },
    { label: 'Approvals', url: createPageUrl('ResellerApprovals') },
    { label: 'Reports', url: createPageUrl('ResellerReports') },
  ];

  const settingItems = [
    { label: 'Branding', url: createPageUrl('ResellerSettingsBranding') },
    { label: 'Domain', url: createPageUrl('ResellerSettingsDomain') },
    { label: 'Features', url: createPageUrl('ResellerSettingsFeatures') },
    { label: 'Team', url: createPageUrl('ResellerSettingsTeam') },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {branding?.logo_url && (
              <img src={branding.logo_url} alt={branding.brand_name} className="h-8 object-contain" />
            )}
            <div>
              <h1 className="text-lg font-bold text-white">{branding?.brand_name}</h1>
              <p className="text-xs text-slate-400">Reseller Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg">
              <LogOut className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-6 border-t border-slate-700 pt-4">
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 ml-auto border-l border-slate-700 pl-6">
            <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 space-y-2 border-t border-slate-700 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className="block text-sm font-semibold text-slate-400 hover:text-white py-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-700 mt-2 pt-2">
              {settingItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  className="block text-sm font-semibold text-slate-400 hover:text-white py-2"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}