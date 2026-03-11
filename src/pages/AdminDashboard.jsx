/**
 * AdminDashboard — NTA Main Admin Dashboard
 *
 * ROOT CAUSE NOTE (2026-03-11):
 * This file was previously overwritten with School Admin content (AdminShell / Bulldog Story Lab).
 * That caused /admindashboard to render the School Admin interface.
 * Fixed: this page now renders the real NTA admin command center.
 * School admin must use AdminSchoolDashboard exclusively.
 */
import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Cpu, FileText, Clapperboard, Zap, Users, Target, Bell,
  BarChart3, Settings, PlayCircle, Link2, Video, AlertTriangle,
  ArrowRight, Activity
} from 'lucide-react';

import MetricCards from '@/components/command/MetricCards';
import ContentEngineStats from '@/components/command/ContentEngineStats';
import AutopilotStatus from '@/components/command/AutopilotStatus';
import ActivityFeed from '@/components/command/ActivityFeed';
import AlertsSummaryPanel from '@/components/command/AlertsSummaryPanel';

const QUICK_ACTIONS = [
  { label: 'Command Center',    icon: Cpu,         page: 'AdminCommandCenter',      color: 'bg-violet-600 hover:bg-violet-700' },
  { label: 'Generate Blog',     icon: FileText,    page: 'AdminBlog',               color: 'bg-rose-600 hover:bg-rose-700' },
  { label: 'Content Engine',    icon: Zap,         page: 'ContentEngine',           color: 'bg-violet-600 hover:bg-violet-700' },
  { label: 'Video Generator',   icon: Clapperboard,page: 'AiVideoStudio',           color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'Alert Center',      icon: Bell,        page: 'AdminAlerts',             color: 'bg-red-600 hover:bg-red-700' },
  { label: 'Pipeline',          icon: Users,       page: 'ProposalPipeline',        color: 'bg-indigo-600 hover:bg-indigo-700' },
  { label: 'Video Publishing',  icon: PlayCircle,  page: 'AdminVideoPublishing',    color: 'bg-teal-600 hover:bg-teal-700' },
  { label: 'Connections',       icon: Link2,       page: 'AdminConnections',        color: 'bg-cyan-600 hover:bg-cyan-700' },
];

const NAV_TILES = [
  {
    label: 'Publishing Queue',
    desc: 'Monitor all video publishing jobs across Facebook, Instagram, YouTube, TikTok',
    icon: Video,
    page: 'AdminVideoPublishing',
    color: 'border-violet-800/40 hover:border-violet-600',
    iconColor: 'text-violet-400',
  },
  {
    label: 'Channel Connections',
    desc: 'Manage platform connections, token health, and publishing readiness',
    icon: Link2,
    page: 'AdminConnections',
    color: 'border-cyan-800/40 hover:border-cyan-600',
    iconColor: 'text-cyan-400',
  },
  {
    label: 'Video Engine',
    desc: 'AI video studio, requests, renders, and library',
    icon: Clapperboard,
    page: 'AdminAIVideoStudio',
    color: 'border-purple-800/40 hover:border-purple-600',
    iconColor: 'text-purple-400',
  },
  {
    label: 'Sales & Revenue',
    desc: 'Leads, proposals, deals, and client pipeline',
    icon: Target,
    page: 'AdminSalesDashboard',
    color: 'border-amber-800/40 hover:border-amber-600',
    iconColor: 'text-amber-400',
  },
  {
    label: 'Analytics',
    desc: 'Performance reports, traffic, and client metrics',
    icon: BarChart3,
    page: 'AdminAnalytics',
    color: 'border-green-800/40 hover:border-green-600',
    iconColor: 'text-green-400',
  },
  {
    label: 'System Settings',
    desc: 'Users, permissions, system health, and configuration',
    icon: Settings,
    page: 'AdminSettings',
    color: 'border-slate-700 hover:border-slate-500',
    iconColor: 'text-slate-400',
  },
];

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">

          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-5 sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-400" />
                  <h1 className="text-xl font-bold text-white">NTA Admin Dashboard</h1>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">New Tech Advertising — Operations Overview</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={createPageUrl('AdminCommandCenter')}>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
                    <Cpu className="w-4 h-4" /> Command Center
                  </Button>
                </Link>
                <Link to={createPageUrl('AdminAlerts')}>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 gap-1.5">
                    <Bell className="w-4 h-4" /> Alert Center
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-8">

            {/* Quick Actions */}
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {QUICK_ACTIONS.map(({ label, icon: Icon, page, color }) => (
                  <Link key={label} to={createPageUrl(page)}>
                    <Button size="sm" className={`${color} text-white gap-2`}>
                      <Icon className="w-4 h-4" />{label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <MetricCards />

            {/* Main nav tiles */}
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Platform Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {NAV_TILES.map(({ label, desc, icon: Icon, page, color, iconColor }) => (
                  <Link key={label} to={createPageUrl(page)}
                    className={`bg-slate-900 border-2 rounded-xl p-5 transition-all hover:bg-slate-800/60 group ${color}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Content + Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <ContentEngineStats />
                <AutopilotStatus />
              </div>
              <div className="space-y-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Action Required</h2>
                <AlertsSummaryPanel />
                <ActivityFeed />
              </div>
            </div>

          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}