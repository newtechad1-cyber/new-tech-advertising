import React, { useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { RefreshCw, ExternalLink, Zap } from 'lucide-react';

import FounderKPIRow from '@/components/founder/FounderKPIRow.jsx';
import FounderRevenue from '@/components/founder/FounderRevenue.jsx';
import FounderSales from '@/components/founder/FounderSales.jsx';
import FounderDelivery from '@/components/founder/FounderDelivery.jsx';
import FounderResellers from '@/components/founder/FounderResellers.jsx';
import FounderPlatformHealth from '@/components/founder/FounderPlatformHealth.jsx';
import FounderActionList from '@/components/founder/FounderActionList.jsx';

const QUICK_LINKS = [
  { label: 'QA', page: 'AdminQA' },
  { label: 'Billing', page: 'AdminBilling' },
  { label: 'Pipeline', page: 'SalesPipeline' },
  { label: 'Resellers', page: 'AdminResellers' },
  { label: 'Clients', page: 'AdminClients' },
  { label: 'System Health', page: 'AdminSystemHealth' },
];

export default function AdminFounder() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gray-950">
        {/* Cockpit Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 sticky top-0 z-20">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-none">Founder Dashboard</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              {QUICK_LINKS.map(l => (
                <button
                  key={l.label}
                  onClick={() => window.location.href = createPageUrl(l.page)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors flex items-center gap-1"
                >
                  {l.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                onClick={() => setRefreshKey(k => k + 1)}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-5">
          {/* Row 1: KPI Cards */}
          <FounderKPIRow key={`kpi-${refreshKey}`} />

          {/* Row 2: Revenue + Action List */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            <div className="xl:col-span-3">
              <FounderRevenue key={`rev-${refreshKey}`} />
            </div>
            <div className="xl:col-span-2">
              <FounderActionList key={`actions-${refreshKey}`} />
            </div>
          </div>

          {/* Row 3: Sales + Platform Health */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <FounderSales key={`sales-${refreshKey}`} />
            <FounderPlatformHealth key={`health-${refreshKey}`} />
          </div>

          {/* Row 4: Delivery + Resellers */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <FounderDelivery key={`delivery-${refreshKey}`} />
            <FounderResellers key={`resellers-${refreshKey}`} />
          </div>
        </div>
      </div>
    </AdminNav>
  );
}