import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Zap, Plus, Upload, Settings } from 'lucide-react';

import OnboardingKPIStrip from '@/components/onboarding/OnboardingKPIStrip';
import OnboardingPipelineBoard from '@/components/onboarding/OnboardingPipelineBoard';
import OnboardingHealthPanel from '@/components/onboarding/OnboardingHealthPanel';
import UpcomingLaunchesTimeline from '@/components/onboarding/UpcomingLaunchesTimeline';
import TeamWorkloadView from '@/components/onboarding/TeamWorkloadView';
import QuickActionBar from '@/components/onboarding/QuickActionBar';

export default function AdminOnboarding() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-6 sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-900/50 border border-amber-700 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Client Onboarding</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Activate new clients, configure marketing systems, and move accounts to live delivery</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
                  <Plus className="w-4 h-4" /> Add Client
                </Button>
                <Link to={createPageUrl('AdminSales')}>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
                    <Settings className="w-4 h-4" /> Agency Ops
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

            {/* Quick Action Bar */}
            <QuickActionBar />

            {/* KPI Strip */}
            <OnboardingKPIStrip />

            {/* Main Grid: Pipeline + Health + Team + Launches */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* Main Pipeline Board */}
              <div className="xl:col-span-3">
                <OnboardingPipelineBoard onSelectClient={setSelectedClient} />
              </div>

              {/* Right Sidebar: Health + Launches + Team */}
              <div className="space-y-6">
                <OnboardingHealthPanel />
                <UpcomingLaunchesTimeline />
                <TeamWorkloadView />
              </div>

            </div>

          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}