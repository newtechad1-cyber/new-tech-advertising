import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import RevenuePulseHeader from '@/components/sales/cmd/RevenuePulseHeader';
import PriorityActionPanel from '@/components/sales/cmd/PriorityActionPanel';
import PipelineKanbanBoard from '@/components/sales/cmd/PipelineKanbanBoard';
import DealIntelligencePanel from '@/components/sales/cmd/DealIntelligencePanel';
import UpcomingScheduleStrip from '@/components/sales/cmd/UpcomingScheduleStrip';
import NTAPipelineMetrics from '@/components/sales/cmd/NTAPipelineMetrics';
import QuickActionToolbar from '@/components/sales/cmd/QuickActionToolbar';

export default function AdminSalesCommand() {
  const [viewMode, setViewMode] = useState('operations');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Sales Command Center</h1>
              <p className="text-slate-600 mt-1">
                High-clarity operational dashboard. Reps know who to contact, what to do, and what revenue is close.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('operations')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'operations'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                Operations
              </button>
              <button
                onClick={() => setViewMode('executive')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'executive'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                Executive View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Section 1: Revenue Pulse Header */}
        <div>
          <RevenuePulseHeader />
        </div>

        {/* Section 2: Priority Action Panel */}
        <div>
          <PriorityActionPanel />
        </div>

        {/* Section 3: Pipeline Stage Board */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pipeline Revenue Engine</h2>
          <p className="text-slate-600 mb-6">Kanban board showing deals in motion across 7 stages.</p>
          <PipelineKanbanBoard />
        </div>

        {/* Section 4: Deal Intelligence Panel */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Deal Intelligence</h2>
          <p className="text-slate-600 mb-6">Behavioral signals that reveal closing opportunities.</p>
          <DealIntelligencePanel />
        </div>

        {/* Section 5: Upcoming Schedule */}
        <div>
          <UpcomingScheduleStrip />
        </div>

        {/* Section 6: Conversion Performance */}
        <div>
          <NTAPipelineMetrics />
        </div>

        {/* Executive View Content */}
        {viewMode === 'executive' && (
          <div className="bg-slate-900 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Executive Pipeline Summary</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Pipeline Value</p>
                <p className="text-4xl font-bold">$156,400</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Weighted Forecast (65%)</p>
                <p className="text-4xl font-bold text-green-400">$101,660</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Rep Performance (Avg)</p>
                <p className="text-4xl font-bold">$24,600</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">At-Risk Deals</p>
                <p className="text-4xl font-bold text-red-400">3</p>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="font-bold mb-4">High-Risk Deals Needing Leadership Attention</h3>
              <ul className="space-y-3 text-sm">
                <li>• <strong>Summit Plumbing</strong> - Deal Room stalled (4 days no activity)</li>
                <li>• <strong>Green Landscaping</strong> - Price objection (strategy call scheduled)</li>
                <li>• <strong>Quality Painting</strong> - No demo scheduled (demo completed 7 days ago)</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Toolbar */}
      <QuickActionToolbar />
    </div>
  );
}