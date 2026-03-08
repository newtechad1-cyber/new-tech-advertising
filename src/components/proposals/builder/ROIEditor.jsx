import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ROIEditor({ value, onChange, summary, onSummaryChange }) {
  const roi = value || { leads_per_month: 20, avg_job_value: 5000, close_rate_percent: 20 };

  const monthlyClients = Math.round((roi.leads_per_month || 0) * (roi.close_rate_percent || 0) / 100);
  const monthlyRevenue = monthlyClients * (roi.avg_job_value || 0);
  const annualRevenue = monthlyRevenue * 12;

  const update = (field, val) => onChange({ ...roi, [field]: parseFloat(val) || 0 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Leads Per Month', field: 'leads_per_month', placeholder: '20' },
          { label: 'Average Job Value ($)', field: 'avg_job_value', placeholder: '5000' },
          { label: 'Est. Close Rate (%)', field: 'close_rate_percent', placeholder: '20' },
        ].map(f => (
          <div key={f.field}>
            <label className="text-xs font-medium text-slate-600 mb-1 block">{f.label}</label>
            <Input
              type="number"
              value={roi[f.field] || ''}
              onChange={e => update(f.field, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Est. New Clients/Mo', value: monthlyClients },
          { label: 'Est. Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}` },
          { label: 'Est. Annual Revenue', value: `$${annualRevenue.toLocaleString()}` },
        ].map(m => (
          <div key={m.label} className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{m.value}</p>
            <p className="text-xs text-slate-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1 block">
          ROI Summary Message <span className="text-slate-400 font-normal">(shown to prospect)</span>
        </label>
        <Textarea
          value={summary || ''}
          onChange={e => onSummaryChange(e.target.value)}
          placeholder="Based on these assumptions, your investment in NTA's platform could generate an estimated $X in new annual revenue. These are conservative projections based on industry averages for your market."
          rows={3}
          className="resize-none text-sm"
        />
      </div>
    </div>
  );
}