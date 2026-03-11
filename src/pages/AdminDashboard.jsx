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

import ExecutiveKPIStrip from '@/components/operations/ExecutiveKPIStrip';
import RevenueMomentumPanel from '@/components/operations/RevenueMomentumPanel';
import PipelineSnapshot from '@/components/operations/PipelineSnapshot';
import DeliveryWorkloadPanel from '@/components/operations/DeliveryWorkloadPanel';
import ClientHealthPanel from '@/components/operations/ClientHealthPanel';
import PublishingMomentumStrip from '@/components/operations/PublishingMomentumStrip';
import OperationalRisksPanel from '@/components/operations/OperationalRisksPanel';
import QuickCommandBar from '@/components/operations/QuickCommandBar';
import BusinessHealthScore from '@/components/operations/BusinessHealthScore';
import NextBestExecutiveAction from '@/components/operations/NextBestExecutiveAction';
import ClosingThisMonthSpotlight from '@/components/operations/ClosingThisMonthSpotlight';
import TeamPerformanceSnapshot from '@/components/operations/TeamPerformanceSnapshot';
import ActivityFeed from '@/components/command/ActivityFeed';

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
           <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-6 sticky top-0 z-10">
             <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
               <div>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-violet-900/50 border border-violet-700 rounded-lg">
                     <Zap className="w-5 h-5 text-violet-400" />
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold text-white">Agency Operations</h1>
                     <p className="text-slate-400 text-sm mt-0.5">Real-time visibility into revenue, delivery, publishing, and client activity</p>
                   </div>
                 </div>
               </div>
               <div className="flex items-center gap-2 flex-wrap">
                 <Link to={createPageUrl('AdminSales')}>
                   <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
                     <Target className="w-4 h-4" /> Sales Dashboard
                   </Button>
                 </Link>
                 <Link to={createPageUrl('AdminVideoPublishing')}>
                   <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
                     <PlayCircle className="w-4 h-4" /> Publishing
                   </Button>
                 </Link>
               </div>
             </div>
           </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

            {/* Quick Command Bar */}
            <QuickCommandBar />

            {/* Business Health Score & Next Best Action */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BusinessHealthScore />
              </div>
              <NextBestExecutiveAction />
            </div>

            {/* Executive KPI Strip */}
            <ExecutiveKPIStrip />

            {/* Publishing Momentum */}
            <PublishingMomentumStrip />

            {/* Main 3-column Grid: Revenue + Pipeline + Closing Spotlight + Delivery + Client Health + Team */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RevenueMomentumPanel />
                  <PipelineSnapshot />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DeliveryWorkloadPanel />
                  <ClientHealthPanel />
                </div>
              </div>
              <div className="space-y-6">
                <ClosingThisMonthSpotlight />
                <TeamPerformanceSnapshot />
              </div>
            </div>

            {/* Operational Risks */}
            <OperationalRisksPanel />

            {/* Activity Feed */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" />
                Recent Activity
              </h3>
              <ActivityFeed />
            </div>

          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}