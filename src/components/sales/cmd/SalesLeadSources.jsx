import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Globe } from 'lucide-react';

const SOURCE_COLORS = {
  website: '#3b82f6', referral: '#22c55e', cold_outreach: '#f59e0b',
  social_media: '#a855f7', ad_campaign: '#ef4444', event: '#06b6d4',
  partner: '#f97316', other: '#6b7280',
};

const SOURCE_LABELS = {
  website: 'Website', referral: 'Referral', cold_outreach: 'Cold Outreach',
  social_media: 'Social Media', ad_campaign: 'Paid Ads', event: 'Event',
  partner: 'Partner', other: 'Other',
};

export default function SalesLeadSources() {
  const { data: leads = [] } = useQuery({ queryKey: ['sc-leads'], queryFn: () => base44.entities.SalesLeads.list('-created_date', 500) });

  const grouped = leads.reduce((acc, l) => {
    const src = l.lead_source || 'other';
    if (!acc[src]) acc[src] = { total: 0, converted: 0 };
    acc[src].total++;
    if (l.status === 'converted') acc[src].converted++;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([src, vals]) => ({
    source: SOURCE_LABELS[src] || src,
    key: src,
    count: vals.total,
    converted: vals.converted,
    convRate: vals.total > 0 ? Math.round((vals.converted / vals.total) * 100) : 0,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-5">
        <Globe className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-bold text-white">Lead Source Intelligence</h2>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-sm">No lead source data available</div>
      ) : (
        <>
          <div className="mb-6" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="source" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                  formatter={(v, name) => [v, name === 'count' ? 'Total Leads' : name]}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry) => <Cell key={entry.key} fill={SOURCE_COLORS[entry.key] || '#6b7280'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-xs text-gray-600 px-2 pb-1 border-b border-gray-800">
              <span>Source</span><span className="text-center">Leads</span><span className="text-center">Converted</span><span className="text-right">Conv. Rate</span>
            </div>
            {data.map(row => (
              <div key={row.key} className="grid grid-cols-4 text-xs px-2 py-1.5 rounded-md hover:bg-gray-800 transition-colors items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SOURCE_COLORS[row.key] || '#6b7280' }} />
                  <span className="text-gray-300">{row.source}</span>
                </div>
                <span className="text-center text-gray-400">{row.count}</span>
                <span className="text-center text-gray-400">{row.converted}</span>
                <span className={`text-right font-bold ${row.convRate >= 30 ? 'text-green-400' : row.convRate > 0 ? 'text-yellow-400' : 'text-gray-600'}`}>{row.convRate}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}