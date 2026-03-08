import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, AlertCircle, Users, DollarSign, CheckCircle2, Clock, 
  AlertTriangle, Zap, ArrowUpRight, ArrowDownRight, Filter, Download
} from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import ExecutiveSummaryCards from '@/components/executive/ExecutiveSummaryCards.jsx';
import RevenueOverview from '@/components/executive/RevenueOverview.jsx';
import ClientHealthPortfolio from '@/components/executive/ClientHealthPortfolio.jsx';
import RenewalsRadar from '@/components/executive/RenewalsRadar.jsx';
import FulfillmentLoad from '@/components/executive/FulfillmentLoad.jsx';
import OperationsRisk from '@/components/executive/OperationsRisk.jsx';
import CommunicationWatchlist from '@/components/executive/CommunicationWatchlist.jsx';
import StrategyReadiness from '@/components/executive/StrategyReadiness.jsx';
import OwnerActionQueue from '@/components/executive/OwnerActionQueue.jsx';
import AccountSpotlights from '@/components/executive/AccountSpotlights.jsx';
import CopilotSummary from '@/components/executive/CopilotSummary.jsx';

export default function AdminExecutive() {
  const [timePeriod, setTimePeriod] = useState('30d');
  const [filters, setFilters] = useState({});

  // Fetch executive summary
  const { data: summary, isLoading } = useQuery({
    queryKey: ['executive-summary', timePeriod, filters],
    queryFn: async () => {
      const response = await base44.functions.invoke('getExecutiveDashboardSummary', {
        time_period: timePeriod,
        filters: filters
      });
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav currentPage="executive" />
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading executive dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage="executive" />
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-gray-600 mt-1">Complete business overview: revenue, clients, operations, and growth</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Snapshot
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Summary Cards - Top Row */}
          <ExecutiveSummaryCards data={summary} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Left Column - Revenue & Pipeline */}
            <div className="lg:col-span-2 space-y-6">
              <RevenueOverview data={summary} />
              <ClientHealthPortfolio data={summary} />
              <RenewalsRadar data={summary} />
            </div>

            {/* Right Column - Priority Alerts & Spotlights */}
            <div className="space-y-6">
              <OperationsRisk data={summary} />
              <AccountSpotlights data={summary} />
            </div>
          </div>

          {/* Owner Action Queue - Full Width */}
          <div className="mt-8">
            <OwnerActionQueue data={summary} />
          </div>

          {/* Bottom Row - Operations & Communication */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <FulfillmentLoad data={summary} />
            <CommunicationWatchlist data={summary} />
          </div>

          {/* Strategy & Reporting */}
          <div className="mt-8">
            <StrategyReadiness data={summary} />
          </div>

        </div>
      </div>
    </div>
  );
}