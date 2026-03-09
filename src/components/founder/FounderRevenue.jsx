import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

function RevStat({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function FounderRevenue() {
  const { data: transactions = [] } = useQuery({ queryKey: ['founder-transactions'], queryFn: () => base44.entities.BillingTransactions.list('-created_date', 200) });
  const { data: invoices = [] } = useQuery({ queryKey: ['founder-invoices'], queryFn: () => base44.entities.BillingInvoices.list('-created_date', 200) });
  const { data: resellerRevenue = [] } = useQuery({ queryKey: ['founder-reseller-rev'], queryFn: () => base44.entities.ResellerRevenue.list('-created_date', 100) });
  const { data: expenses = [] } = useQuery({ queryKey: ['founder-expenses'], queryFn: () => base44.entities.Expenses.list('-created_date', 100) });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const collected = transactions.filter(t => t.status === 'succeeded' && new Date(t.created_date) >= startOfMonth).reduce((s, t) => s + (t.amount || 0), 0);
  const newRevenue = invoices.filter(i => i.status === 'paid' && new Date(i.created_date) >= startOfMonth).reduce((s, i) => s + (i.amount || 0), 0);
  const failed = invoices.filter(i => (i.status === 'failed' || i.status === 'past_due') && new Date(i.created_date) >= startOfMonth);
  const failedAmount = failed.reduce((s, i) => s + (i.amount || 0), 0);
  const pastDue = invoices.filter(i => i.status === 'past_due').length;
  const commissions = resellerRevenue.filter(r => new Date(r.created_date) >= startOfMonth).reduce((s, r) => s + (r.commission_amount || 0), 0);
  const monthExpenses = expenses.filter(e => new Date(e.created_date) >= startOfMonth).reduce((s, e) => s + (e.amount || 0), 0);
  const netRevenue = collected - commissions - monthExpenses;

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const rev = transactions.filter(t => { const td = new Date(t.created_date); return t.status === 'succeeded' && td >= d && td <= end; }).reduce((s, t) => s + (t.amount || 0), 0);
    return { month: d.toLocaleDateString('en-US', { month: 'short' }), revenue: rev };
  });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-green-400" />
        <h2 className="text-sm font-bold text-white">Revenue Snapshot</h2>
        <span className="text-xs text-gray-500 ml-auto">This month</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <RevStat label="Collected" value={`$${collected.toLocaleString()}`} color="text-green-400" />
        <RevStat label="New Revenue" value={`$${newRevenue.toLocaleString()}`} color="text-blue-400" />
        <RevStat label="Net (after costs)" value={`$${Math.max(0, netRevenue).toLocaleString()}`} color={netRevenue >= 0 ? 'text-green-400' : 'text-red-400'} />
        <RevStat label="Failed Payments" value={`$${failedAmount.toLocaleString()}`} sub={`${failed.length} invoices`} color={failed.length > 0 ? 'text-red-400' : 'text-gray-400'} />
        <RevStat label="Past Due Accounts" value={pastDue} color={pastDue > 0 ? 'text-red-400' : 'text-gray-400'} />
        <RevStat label="Commissions Owed" value={`$${commissions.toLocaleString()}`} color="text-yellow-400" />
      </div>
      <div className="flex-1 min-h-[140px]">
        <p className="text-xs text-gray-500 mb-2">Revenue collected — last 6 months</p>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}