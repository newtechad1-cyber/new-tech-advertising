import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';

const STATUS_COLORS = {
  active:    'bg-green-100 text-green-700',
  planning:  'bg-blue-100 text-blue-700',
  paused:    'bg-amber-100 text-amber-700',
  completed: 'bg-slate-100 text-slate-600',
};

const SOURCE_COLORS = {
  authority_content_seo: '#3b82f6',
  social_authority:      '#8b5cf6',
  outbound_prospecting:  '#f59e0b',
  referral_expansion:    '#10b981',
  territory_campaigns:   '#06b6d4',
  paid_amplification:    '#ec4899',
};

export default function ACQCampaignTable({ campaigns }) {
  const [sort, setSort] = useState({ key: 'revenue_generated', dir: -1 });

  const sorted = [...campaigns].sort((a, b) => {
    const av = a[sort.key] ?? 0, bv = b[sort.key] ?? 0;
    return (av > bv ? 1 : -1) * sort.dir;
  });

  const toggleSort = (key) => setSort(s => ({ key, dir: s.key === key ? -s.dir : -1 }));
  const SortIcon = ({ k }) => sort.key === k ? (sort.dir === -1 ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : null;

  if (!campaigns.length) return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
      <p className="text-slate-400 text-sm">No active campaigns yet. Create your first outreach campaign to start tracking acquisition performance.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-black text-slate-900 text-sm">Active Campaigns</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {[
                { key: 'campaign_name', label: 'Campaign' },
                { key: 'leads_generated', label: 'Leads' },
                { key: 'demos_booked', label: 'Demos' },
                { key: 'closed_won', label: 'Won' },
                { key: 'conversion_rate', label: 'Close %' },
                { key: 'revenue_generated', label: 'Revenue' },
                { key: 'roi', label: 'ROI' },
              ].map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-black text-slate-600 cursor-pointer hover:text-slate-900 whitespace-nowrap select-none">
                  <span className="flex items-center gap-1">{col.label} <SortIcon k={col.key} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SOURCE_COLORS[c.acquisition_source_key] || '#94a3b8' }} />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{c.campaign_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${STATUS_COLORS[c.status] || 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
                        {c.territory && <span className="text-xs text-slate-400">{c.territory}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-bold text-slate-900">{c.leads_generated}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-900">{c.demos_booked}</td>
                <td className="px-4 py-3 text-xs font-bold text-green-600">{c.closed_won}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-900">{c.conversion_rate}%</td>
                <td className="px-4 py-3 text-xs font-black text-slate-900">${c.revenue_generated?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-black ${c.roi > 0 ? 'text-green-600' : c.roi === 0 ? 'text-slate-400' : 'text-red-500'}`}>
                    {c.roi > 0 ? '+' : ''}{c.roi}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}