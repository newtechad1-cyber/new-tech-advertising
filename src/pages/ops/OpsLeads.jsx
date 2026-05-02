import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Search, RefreshCw, Phone, Mail } from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-900/50 text-blue-400',
  contacted: 'bg-amber-900/40 text-amber-400',
  qualified: 'bg-emerald-900/40 text-emerald-400',
  unresponsive: 'bg-slate-800 text-slate-500',
};

export default function OpsLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SalesLead.list('-created_date', 200);
    setLeads(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    await base44.entities.SalesLead.update(id, { status });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.business_name?.toLowerCase().includes(search.toLowerCase()) || l.contact_name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSource = sourceFilter === 'all' || l.lead_source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const websiteLeads = leads.filter(l => l.lead_source === 'website').length;
  const newLeads = leads.filter(l => l.status === 'new').length;

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Leads</h1>
            <p className="text-slate-500 text-sm">{leads.length} total · {newLeads} new · {websiteLeads} from website</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'New', count: leads.filter(l => l.status === 'new').length, color: 'text-blue-400' },
            { label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'text-amber-400' },
            { label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: 'text-emerald-400' },
            { label: 'Unresponsive', count: leads.filter(l => l.status === 'unresponsive').length, color: 'text-slate-500' },
          ].map(k => (
            <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${k.color}`}>{k.count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            {['new','contacted','qualified','unresponsive'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Sources</option>
            {['website','cold_outreach','referral','walk_in','other'].map(v => <option key={v} value={v}>{v.replace(/_/g,' ')}</option>)}
          </select>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No leads match your filters.</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{l.business_name}</p>
                      {l.website && <a href={l.website.startsWith('http') ? l.website : `https://${l.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400">{l.website}</a>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="space-y-0.5">
                        {l.contact_name && <p className="text-slate-300 text-xs">{l.contact_name}</p>}
                        {l.phone && <a href={`tel:${l.phone}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</a>}
                        {l.email && <a href={`mailto:${l.email}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</a>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] || STATUS_COLORS.new}`}>{l.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{l.lead_source?.replace(/_/g,' ') || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{l.created_date ? new Date(l.created_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <select value={l.status} onChange={e => handleStatusChange(l.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500">
                        {['new','contacted','qualified','unresponsive'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </OpsLayout>
  );
}