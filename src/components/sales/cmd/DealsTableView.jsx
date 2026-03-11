import React, { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STAGE_ORDER = [
  'new_lead',
  'contacted',
  'qualified',
  'demo_scheduled',
  'proposal_sent',
  'negotiation',
  'closed_won',
  'closed_lost',
];

const STAGE_COLORS = {
  new_lead: 'bg-slate-700 text-slate-300',
  contacted: 'bg-blue-900/40 text-blue-300',
  qualified: 'bg-cyan-900/40 text-cyan-300',
  demo_scheduled: 'bg-violet-900/40 text-violet-300',
  proposal_sent: 'bg-amber-900/40 text-amber-300',
  negotiation: 'bg-orange-900/40 text-orange-300',
  closed_won: 'bg-emerald-900/40 text-emerald-300',
  closed_lost: 'bg-red-900/40 text-red-300',
};

export default function DealsTableView({ deals = [] }) {
  const [sortBy, setSortBy] = useState('deal_value');
  const [sortOrder, setSortOrder] = useState('desc');

  const sorted = [...deals].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'deal_value' || sortBy === 'probability') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    } else if (sortBy === 'stage') {
      aVal = STAGE_ORDER.indexOf(aVal) || 999;
      bVal = STAGE_ORDER.indexOf(bVal) || 999;
    }

    return sortOrder === 'asc' ? aVal > bVal ? 1 : -1 : bVal > aVal ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              {[
                { key: 'company_name', label: 'Company' },
                { key: 'contact_name', label: 'Contact' },
                { key: 'stage', label: 'Stage' },
                { key: 'deal_value', label: 'Deal Value' },
                { key: 'assigned_to', label: 'Owner' },
                { key: 'lead_source', label: 'Source' },
                { key: 'next_followup_date', label: 'Next Follow-Up' },
                { key: 'closing_date', label: 'Est. Close' },
                { key: '', label: '' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => col.key && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap ${
                    col.key ? 'cursor-pointer hover:text-slate-300' : ''
                  }`}
                >
                  {col.label}
                  {col.key === sortBy && (
                    <span className="ml-1 text-slate-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-slate-500 text-sm">
                  No deals yet
                </td>
              </tr>
            ) : (
              sorted.map(deal => {
                const isOverdue = deal.next_followup_date && new Date(deal.next_followup_date) < new Date();

                return (
                  <tr key={deal.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white max-w-xs truncate">
                      {deal.company_name}
                    </td>
                    <td className="px-4 py-3 text-slate-400 truncate">
                      {deal.contact_name || deal.email || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          STAGE_COLORS[deal.stage] || STAGE_COLORS.new_lead
                        }`}
                      >
                        {deal.stage?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-400">
                      ${(deal.deal_value / 1000).toFixed(0)}k
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {deal.assigned_to?.split('@')[0] || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {deal.lead_source || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {deal.next_followup_date ? (
                        <span className={isOverdue ? 'text-red-400 font-semibold' : 'text-slate-400'}>
                          {new Date(deal.next_followup_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {isOverdue && (
                            <AlertCircle className="w-3 h-3 inline ml-1 text-red-400" />
                          )}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {deal.closing_date
                        ? new Date(deal.closing_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300 h-7">
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}