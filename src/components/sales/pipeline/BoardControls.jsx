import React from 'react';
import { Plus, Search, BarChart2, Hash } from 'lucide-react';

const OWNERS = ['all', 'Sarah Chen', 'Marcus Johnson', 'Alex Rivera', 'Jordan Kim'];
const INDUSTRIES = ['all', 'hvac', 'plumbing', 'roofing', 'landscaping', 'electrical', 'painting', 'fitness', 'restaurant', 'real_estate', 'other'];
const SOURCES = ['all', 'referral', 'website', 'cold_outreach', 'demo_request', 'paid_ad', 'partner', 'event', 'other'];

export default function BoardControls({ filters, setFilters, valueView, setValueView, onNewLead, opportunities }) {
  return (
    <div className="bg-slate-950 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-2 text-sm w-48 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Owner filter */}
        <select
          value={filters.owner}
          onChange={(e) => setFilters(f => ({ ...f, owner: e.target.value }))}
          className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Owners</option>
          {OWNERS.filter(o => o !== 'all').map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {/* Industry filter */}
        <select
          value={filters.industry}
          onChange={(e) => setFilters(f => ({ ...f, industry: e.target.value }))}
          className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer capitalize"
        >
          <option value="all">All Industries</option>
          {INDUSTRIES.filter(i => i !== 'all').map(i => <option key={i} value={i} className="capitalize">{i.replace('_', ' ')}</option>)}
        </select>

        {/* Source filter */}
        <select
          value={filters.source}
          onChange={(e) => setFilters(f => ({ ...f, source: e.target.value }))}
          className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Sources</option>
          {SOURCES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>

        {/* Value / Count toggle */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setValueView('value')}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${valueView === 'value' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart2 className="w-3 h-3" /> Value
          </button>
          <button
            onClick={() => setValueView('count')}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${valueView === 'count' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Hash className="w-3 h-3" /> Count
          </button>
        </div>

        <div className="flex-1" />

        {/* New Lead */}
        <button
          onClick={onNewLead}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Lead
        </button>
      </div>
    </div>
  );
}