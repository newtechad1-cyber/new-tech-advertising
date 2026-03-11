import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { BarChart3, Plus, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ReportingKPIStrip from '@/components/reporting/ReportingKPIStrip';
import ReportGenerationQueue from '@/components/reporting/ReportGenerationQueue';
import RecentReports from '@/components/reporting/RecentReports';
import ScheduledReports from '@/components/reporting/ScheduledReports';
import ReportDeliveryIssues from '@/components/reporting/ReportDeliveryIssues';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-6 sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-900/50 border border-cyan-700 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">ROI Reporting Engine</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Generate and deliver automated client performance reports</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 gap-1.5">
                  <Plus className="w-4 h-4" /> Generate Report
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

            {/* KPI Strip */}
            <ReportingKPIStrip />

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'queue', label: 'Generation Queue' },
                { id: 'recent', label: 'Recent Reports' },
                { id: 'scheduled', label: 'Scheduled' },
                { id: 'issues', label: 'Issues' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentReports />
                </div>
                <div className="space-y-6">
                  <ScheduledReports />
                  <ReportDeliveryIssues />
                </div>
              </div>
            )}

            {activeTab === 'queue' && <ReportGenerationQueue />}
            {activeTab === 'recent' && <RecentReports />}
            {activeTab === 'scheduled' && <ScheduledReports />}
            {activeTab === 'issues' && <ReportDeliveryIssues />}

          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}