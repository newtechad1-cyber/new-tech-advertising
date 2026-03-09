import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

const TYPES = ['revenue', 'expense', 'commission', 'refund'];
const CATEGORIES = ['subscription','setup_fee','overage','ad_spend','tools_software','payroll','commission','refund','other_income','other_expense'];
const typeColors = { revenue: 'bg-green-100 text-green-800', expense: 'bg-red-100 text-red-800', commission: 'bg-blue-100 text-blue-800', refund: 'bg-orange-100 text-orange-800' };

export default function AdminFinance() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [form, setForm] = useState({ type: 'revenue', amount: '', category: 'subscription', date: new Date().toISOString().split('T')[0], notes: '', company_id: '' });

  const { data: txns = [] } = useQuery({
    queryKey: ['finance_txns'],
    queryFn: () => base44.asServiceRole.entities.FinanceTransactions.list('-date', 500)
  });

  const { data: billingCustomers = [] } = useQuery({
    queryKey: ['billing_customers_all'],
    queryFn: () => base44.asServiceRole.entities.BillingCustomers.list()
  });

  const createTxn = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.FinanceTransactions.create({ ...data, amount: parseFloat(data.amount), source: 'manual' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['finance_txns'] }); setShowAdd(false); }
  });

  // Metrics
  const revenue = txns.filter(t => t.type === 'revenue').reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const commissions = txns.filter(t => t.type === 'commission').reduce((s, t) => s + t.amount, 0);
  const refunds = txns.filter(t => t.type === 'refund').reduce((s, t) => s + t.amount, 0);
  const netProfit = revenue - expenses - commissions - refunds;

  const mrr = billingCustomers
    .filter(b => b.billing_status === 'active')
    .reduce((s, b) => s + (b.monthly_amount || 0), 0);

  // Monthly chart data
  const monthMap = {};
  txns.forEach(t => {
    const month = t.date?.slice(0, 7);
    if (!month) return;
    if (!monthMap[month]) monthMap[month] = { month, revenue: 0, expenses: 0, profit: 0 };
    if (t.type === 'revenue') monthMap[month].revenue += t.amount;
    if (t.type === 'expense' || t.type === 'commission') monthMap[month].expenses += t.amount;
  });
  Object.values(monthMap).forEach(m => { m.profit = m.revenue - m.expenses; });
  const chartData = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);

  const filtered = typeFilter === 'all' ? txns : txns.filter(t => t.type === typeFilter);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Finance</h1>
              <p className="text-slate-500 mt-1">Revenue, expenses, and profit tracking</p>
            </div>
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" />Log Transaction</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); createTxn.mutate(form); }} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Type</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Amount ($)</label>
                      <Input required type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="500.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Date</label>
                      <Input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Notes</label>
                    <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                    <Button type="submit" disabled={createTxn.isPending}>{createTxn.isPending ? 'Saving...' : 'Save'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'MRR', value: `$${mrr.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Total Expenses', value: `$${(expenses + commissions).toLocaleString()}`, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Refunds', value: `$${refunds.toLocaleString()}`, icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Net Profit', value: `$${netProfit.toLocaleString()}`, icon: netProfit >= 0 ? TrendingUp : TrendingDown, color: netProfit >= 0 ? 'text-emerald-600' : 'text-red-600', bg: netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50' },
            ].map(m => (
              <Card key={m.label}>
                <CardContent className="p-5 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${m.bg}`}><m.icon className={`w-5 h-5 ${m.color}`} /></div>
                  <div>
                    <p className="text-xs text-slate-500">{m.label}</p>
                    <p className="text-xl font-bold text-slate-900">{m.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Revenue vs Expenses (Monthly)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#4ade80" fill="#4ade8033" name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stroke="#f87171" fill="#f8717133" name="Expenses" />
                    <Area type="monotone" dataKey="profit" stroke="#60a5fa" fill="#60a5fa22" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transactions</CardTitle>
              <div className="flex gap-2">
                {['all', ...TYPES].map(t => (
                  <Button key={t} size="sm" variant={typeFilter === t ? 'default' : 'outline'} onClick={() => setTypeFilter(t)} className="capitalize text-xs">{t}</Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Notes</th>
                      <th className="text-left py-3 px-4 font-semibold">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="py-10 text-center text-slate-400">No transactions yet.</td></tr>
                    )}
                    {filtered.slice(0, 100).map(t => (
                      <tr key={t.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">{t.date}</td>
                        <td className="py-3 px-4"><Badge className={typeColors[t.type] || 'bg-slate-100'}>{t.type}</Badge></td>
                        <td className="py-3 px-4 capitalize text-slate-600">{t.category?.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4">
                          <span className={t.type === 'revenue' ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                            {t.type === 'revenue' ? '+' : '-'}${(t.amount || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{t.notes || '—'}</td>
                        <td className="py-3 px-4"><Badge variant="outline" className="text-xs">{t.source || 'manual'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}