import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

const payoutColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

export default function ResellerRevenue() {
  const [reseller, setReseller] = useState(null);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const accounts = await base44.entities.ResellerAccounts.filter({ contact_email: u.email });
      if (accounts.length > 0) setReseller(accounts[0]);
    };
    load();
  }, []);

  const { data: revenue = [] } = useQuery({
    queryKey: ['reseller_revenue', reseller?.id],
    queryFn: () => base44.entities.ResellerRevenue.filter({ reseller_id: reseller.id }),
    enabled: !!reseller?.id
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller_clients', reseller?.id],
    queryFn: () => base44.entities.ResellerClients.filter({ reseller_id: reseller.id }),
    enabled: !!reseller?.id
  });

  const totalEarned = revenue.reduce((s, r) => s + (r.commission_amount || 0), 0);
  const totalPaid = revenue.filter(r => r.payout_status === 'paid').reduce((s, r) => s + (r.commission_amount || 0), 0);
  const totalPending = revenue.filter(r => r.payout_status === 'pending').reduce((s, r) => s + (r.commission_amount || 0), 0);
  const mrr = clients.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value || 0), 0);

  // Monthly chart
  const monthMap = {};
  revenue.forEach(r => {
    const m = r.period_start?.slice(0, 7);
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { month: m, gross: 0, commission: 0 };
    monthMap[m].gross += r.gross_revenue || 0;
    monthMap[m].commission += r.commission_amount || 0;
  });
  const chartData = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);

  if (!reseller) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Revenue & Commissions</h1>
          <p className="text-xs text-slate-500">{reseller.reseller_name}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl('ResellerDashboard')}>
          ← Dashboard
        </Button>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Client MRR', value: `$${mrr.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Earned', value: `$${totalEarned.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Payout', value: `$${totalPending.toLocaleString()}`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Total Paid', value: `$${totalPaid.toLocaleString()}`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(m => (
            <Card key={m.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${m.bg}`}><m.icon className={`w-5 h-5 ${m.color}`} /></div>
                <div><p className="text-xs text-slate-500">{m.label}</p><p className="text-xl font-bold">{m.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Commission Rate Info */}
        <Card>
          <CardContent className="p-5 flex items-center gap-6">
            <div><p className="text-xs text-slate-500">Your Commission Rate</p><p className="text-3xl font-bold text-slate-900">{reseller.commission_rate}%</p></div>
            <div className="h-12 w-px bg-slate-200" />
            <div><p className="text-xs text-slate-500">Commission Model</p><p className="font-semibold capitalize">{reseller.commission_model?.replace(/_/g, ' ')}</p></div>
            <div className="h-12 w-px bg-slate-200" />
            <div><p className="text-xs text-slate-500">Active Clients</p><p className="text-xl font-bold text-green-700">{clients.filter(c => c.status === 'active').length}</p></div>
            {reseller.stripe_connect_account_id && (
              <>
                <div className="h-12 w-px bg-slate-200" />
                <div><p className="text-xs text-slate-500">Stripe Connect</p><Badge className="bg-green-100 text-green-800">Connected</Badge></div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Monthly Commission History</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="gross" fill="#e2e8f0" name="Client Revenue" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="commission" fill="#4ade80" name="Your Commission" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Revenue Records */}
        <Card>
          <CardHeader><CardTitle>Commission Records</CardTitle></CardHeader>
          <CardContent className="p-0">
            {revenue.length === 0 ? (
              <p className="p-6 text-sm text-slate-400 text-center">No commission records yet. Revenue will appear here once clients are billed.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-3 px-4 font-semibold">Period</th>
                    <th className="text-left py-3 px-4 font-semibold">Gross Revenue</th>
                    <th className="text-left py-3 px-4 font-semibold">Rate</th>
                    <th className="text-left py-3 px-4 font-semibold">Commission</th>
                    <th className="text-left py-3 px-4 font-semibold">Source</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {[...revenue].sort((a, b) => b.period_start?.localeCompare(a.period_start)).map(r => (
                    <tr key={r.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{r.period_label}</td>
                      <td className="py-3 px-4">${(r.gross_revenue || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">{r.commission_rate}%</td>
                      <td className="py-3 px-4 font-bold text-green-700">${(r.commission_amount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 capitalize text-slate-500">{r.source}</td>
                      <td className="py-3 px-4"><Badge className={payoutColors[r.payout_status] || 'bg-slate-100'}>{r.payout_status}</Badge></td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{r.paid_at || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}