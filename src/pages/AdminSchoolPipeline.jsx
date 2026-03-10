import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const stages = [
  { key: 'new', label: 'New Leads', color: 'bg-slate-50' },
  { key: 'contacted', label: 'Contacted', color: 'bg-orange-50' },
  { key: 'replied', label: 'Replied', color: 'bg-cyan-50' },
  { key: 'demo_scheduled', label: 'Demo Scheduled', color: 'bg-green-50' },
  { key: 'pilot', label: 'Pilot', color: 'bg-purple-50' },
  { key: 'won', label: 'Won', color: 'bg-green-100' },
];

export default function AdminSchoolPipeline() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['school_leads_pipeline'],
    queryFn: () => base44.entities.SchoolLeads.list(),
    initialData: [],
  });

  const leadsByStage = useMemo(() => {
    const grouped = {};
    stages.forEach(stage => {
      grouped[stage.key] = [];
    });

    leads.forEach((lead) => {
      if (grouped.hasOwnProperty(lead.outreach_status)) {
        grouped[lead.outreach_status].push(lead);
      }
    });

    return grouped;
  }, [leads]);

  const totalValue = leads.filter(l => l.client_status === 'customer').length;
  const conversionRate = leads.length > 0 ? ((leads.filter(l => l.outreach_status === 'won').length / leads.length) * 100).toFixed(1) : 0;

  if (isLoading) {
    return <div className="p-8 text-center">Loading pipeline...</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Sales Pipeline</h1>
          <p className="text-slate-600 mt-2">Visual view of leads by stage</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
            <div className="text-sm text-slate-600">Total Leads</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
            <div className="text-sm text-slate-600">Conversion Rate</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-700">{totalValue}</div>
            <div className="text-sm text-slate-600">Customers</div>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {stages.map((stage) => (
            <div key={stage.key} className={`rounded-lg border border-slate-200 ${stage.color} overflow-hidden`}>
              <div className="bg-white border-b border-slate-200 p-4">
                <div className="font-bold text-slate-900">{stage.label}</div>
                <div className="text-2xl font-bold text-slate-600">{leadsByStage[stage.key].length}</div>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {leadsByStage[stage.key].map((lead) => (
                  <Link key={lead.id} to={createPageUrl('AdminSchoolLeadDetail') + `?id=${lead.id}`}>
                    <div className="bg-white rounded border border-slate-200 p-3 hover:shadow-md transition cursor-pointer">
                      <div className="text-sm font-semibold text-slate-900 truncate">{lead.school_name}</div>
                      <div className="text-xs text-slate-600 truncate">{lead.city}, {lead.state}</div>
                      {lead.demo_booked && (
                        <div className="text-xs text-green-700 font-medium mt-1">📅 Demo booked</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Lost Column */}
        <div className="rounded-lg border border-slate-200 bg-red-50 overflow-hidden">
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="font-bold text-slate-900">Lost</div>
            <div className="text-2xl font-bold text-red-600">{leads.filter(l => l.outreach_status === 'lost').length}</div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
            {leads.filter(l => l.outreach_status === 'lost').map((lead) => (
              <Link key={lead.id} to={createPageUrl('AdminSchoolLeadDetail') + `?id=${lead.id}`}>
                <div className="bg-white rounded border border-slate-200 p-3 hover:shadow-md transition cursor-pointer">
                  <div className="text-sm font-semibold text-slate-900 truncate">{lead.school_name}</div>
                  <div className="text-xs text-slate-600 truncate">{lead.city}, {lead.state}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Link to={createPageUrl('AdminSchoolLeads')}>
            <Button variant="outline">Back to Leads</Button>
          </Link>
          <Link to={createPageUrl('AdminSchoolOutreach')}>
            <Button variant="outline">View Campaigns</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}