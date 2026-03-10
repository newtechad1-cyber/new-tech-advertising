import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight } from 'lucide-react';

const statusColors = {
  new: 'bg-slate-100 text-slate-800',
  researched: 'bg-blue-100 text-blue-800',
  ready_for_outreach: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-orange-100 text-orange-800',
  opened: 'bg-amber-100 text-amber-800',
  replied: 'bg-cyan-100 text-cyan-800',
  demo_scheduled: 'bg-green-100 text-green-800',
  demo_completed: 'bg-emerald-100 text-emerald-800',
  pilot: 'bg-purple-100 text-purple-800',
  won: 'bg-green-600 text-white',
  lost: 'bg-red-100 text-red-800',
};

export default function AdminSchoolLeads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { data: leads, isLoading } = useQuery({
    queryKey: ['school_leads'],
    queryFn: () => base44.entities.SchoolLeads.list(),
    initialData: [],
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.school_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = !filterCity || lead.city?.toLowerCase() === filterCity.toLowerCase();
      const matchesDistrict = !filterDistrict || lead.district_name?.toLowerCase().includes(filterDistrict.toLowerCase());
      const matchesStatus = !filterStatus || lead.outreach_status === filterStatus;

      return matchesSearch && matchesCity && matchesDistrict && matchesStatus;
    });
  }, [leads, searchQuery, filterCity, filterDistrict, filterStatus]);

  const citiesSet = new Set(leads.map(l => l.city));
  const districtsSet = new Set(leads.map(l => l.district_name));
  const statusesSet = new Set(leads.map(l => l.outreach_status));

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">School Leads</h1>
          <p className="text-slate-600 mt-2">Manage school prospects and outreach campaigns</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Search</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by school name, contact, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">City</label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">All Cities</option>
                  {Array.from(citiesSet).sort().map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">District</label>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">All Districts</option>
                  {Array.from(districtsSet).sort().map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  {Array.from(statusesSet).sort().map(status => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
            <div className="text-sm text-slate-600">Total Leads</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{leads.filter(l => l.outreach_status === 'contacted').length}</div>
            <div className="text-sm text-slate-600">Contacted</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-600">{leads.filter(l => l.demo_booked).length}</div>
            <div className="text-sm text-slate-600">Demo Booked</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-700">{leads.filter(l => l.client_status === 'customer').length}</div>
            <div className="text-sm text-slate-600">Customers</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-600">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No leads found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">School</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">District</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Contact</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">City</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Next Followup</th>
                    <th className="px-6 py-3 text-right font-semibold text-slate-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">{lead.school_name}</td>
                      <td className="px-6 py-4 text-slate-600">{lead.district_name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="text-sm">{lead.contact_name}</div>
                        <div className="text-xs text-slate-500">{lead.contact_email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lead.city}, {lead.state}</td>
                      <td className="px-6 py-4">
                        <Badge className={statusColors[lead.outreach_status] || 'bg-slate-100 text-slate-800'}>
                          {lead.outreach_status?.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={createPageUrl('AdminSchoolLeadDetail') + `?id=${lead.id}`}>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-6 flex gap-3">
          <Link to={createPageUrl('AdminSchoolOutreach')}>
            <Button variant="outline">View Campaigns</Button>
          </Link>
          <Link to={createPageUrl('AdminSchoolPipeline')}>
            <Button variant="outline">View Pipeline</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}