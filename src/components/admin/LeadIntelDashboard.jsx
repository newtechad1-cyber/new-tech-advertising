import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, MapPin, Globe, Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  new:            { label: 'New',            color: 'bg-blue-100 text-blue-800',   icon: Clock },
  contacted:      { label: 'Contacted',      color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  qualified:      { label: 'Qualified',      color: 'bg-purple-100 text-purple-800', icon: TrendingUp },
  proposal_sent:  { label: 'Proposal Sent',  color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  won:            { label: 'Won',            color: 'bg-green-100 text-green-800',  icon: CheckCircle },
  lost:           { label: 'Lost',           color: 'bg-red-100 text-red-800',     icon: XCircle },
};

function StatCard({ label, value, icon: Icon, color = 'text-slate-700' }) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="p-2 bg-slate-100 rounded-lg">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

export default function LeadIntelDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads-dashboard'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
    refetchInterval: 30000,
  });

  const { data: locationPages = [] } = useQuery({
    queryKey: ['location-pages-summary'],
    queryFn: () => base44.entities.LocationPage.list('-conversions', 100),
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const conversionRate = total > 0 ? Math.round((wonLeads / total) * 100) : 0;

  // Source breakdown
  const sourceCounts = leads.reduce((acc, l) => {
    const s = l.source || 'unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Status breakdown
  const statusCounts = leads.reduce((acc, l) => {
    const s = l.status || 'new';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Location pages with conversions
  const topPages = locationPages.filter(p => p.conversions > 0).slice(0, 8);

  // ── Filtered leads ─────────────────────────────────────────────────────────
  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      l.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  if (isLoading) return <div className="p-6 text-center text-slate-500">Loading lead data...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Intelligence Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Incoming leads from CRM webhook · auto-refreshes every 30s</p>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={total} icon={Users} color="text-blue-600" />
        <StatCard label="New / Unworked" value={newLeads} icon={Clock} color="text-yellow-600" />
        <StatCard label="Closed Won" value={wonLeads} icon={CheckCircle} color="text-green-600" />
        <StatCard label="Win Rate" value={`${conversionRate}%`} icon={TrendingUp} color="text-purple-600" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ── Status Breakdown ── */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Status Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                <span className="font-semibold">{statusCounts[key] || 0}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Source Breakdown ── */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Lead Sources
          </h3>
          <div className="space-y-2">
            {Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, count]) => (
              <div key={src} className="flex items-center justify-between text-sm">
                <span className="capitalize text-slate-600">{src.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.round((count / total) * 100)}%` }}
                    />
                  </div>
                  <span className="font-semibold w-5 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(sourceCounts).length === 0 && (
              <p className="text-xs text-slate-400">No source data yet</p>
            )}
          </div>
        </Card>

        {/* ── Top Location Pages ── */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Top Converting Pages
          </h3>
          <div className="space-y-2">
            {topPages.map(page => (
              <div key={page.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 truncate max-w-[140px]" title={page.title}>
                  {page.city}, {page.state_code} — {page.service_slug?.replace(/-/g, ' ')}
                </span>
                <Badge variant="outline" className="text-green-700 border-green-300 shrink-0">
                  {page.conversions} conv.
                </Badge>
              </div>
            ))}
            {topPages.length === 0 && (
              <p className="text-xs text-slate-400">No conversions tracked yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Lead Table ── */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              className="pl-8"
              placeholder="Search by business, name, or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.keys(sourceCounts).map(src => (
                <SelectItem key={src} value={src}>{src.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Business</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Service Interest</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.slice(0, 50).map(lead => {
                const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                return (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{lead.business_name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.city}{lead.state ? `, ${lead.state}` : ''}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{lead.service_interest?.replace(/_/g, ' ') || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{lead.source?.replace(/_/g, ' ') || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {lead.created_date ? new Date(lead.created_date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No leads match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
          {filtered.length > 50 && (
            <p className="text-xs text-center text-slate-400 py-3">Showing 50 of {filtered.length} results</p>
          )}
        </div>
      </Card>
    </div>
  );
}