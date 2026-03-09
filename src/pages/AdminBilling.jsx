import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Calendar, Users, CreditCard } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

const billingStatusColors = {
  active: 'bg-green-100 text-green-800',
  trialing: 'bg-blue-100 text-blue-800',
  past_due: 'bg-orange-100 text-orange-800',
  suspended: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-700',
  incomplete: 'bg-yellow-100 text-yellow-800'
};

export default function AdminBilling() {
  const [tab, setTab] = useState('stripe');
  const [search, setSearch] = useState('');

  // Stripe Billing Customers
  const { data: billingCustomers = [] } = useQuery({
    queryKey: ['billing_customers_all'],
    queryFn: () => base44.asServiceRole.entities.BillingCustomers.list('-created_date', 500)
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['billing_invoices_all'],
    queryFn: () => base44.asServiceRole.entities.BillingInvoices.list('-invoice_date', 500)
  });

  const { data: finTxns = [] } = useQuery({
    queryKey: ['finance_txns'],
    queryFn: () => base44.asServiceRole.entities.FinanceTransactions.list('-date', 500)
  });

  // Legacy contract/subscription data
  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.asServiceRole.entities.Contracts.list('-renewal_date', 500)
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.asServiceRole.entities.Subscriptions.list()
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  // Stripe Metrics
  const activeBilling = billingCustomers.filter(b => b.billing_status === 'active');
  const stripeMRR = activeBilling.reduce((s, b) => s + (b.monthly_amount || 0), 0);
  const failedPayments = billingCustomers.filter(b => b.billing_status === 'past_due' || b.billing_status === 'suspended');
  const suspended = billingCustomers.filter(b => b.billing_status === 'suspended');

  // Revenue from finance txns for growth chart
  const monthMap = {};
  finTxns.filter(t => t.type === 'revenue').forEach(t => {
    const month = t.date?.slice(0, 7);
    if (!month) return;
    monthMap[month] = (monthMap[month] || 0) + t.amount;
  });
  const revenueChart = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([month, revenue]) => ({ month, revenue }));

  // Legacy metrics
  const legacyMRR = subscriptions.filter(s => s.subscription_status === 'active').reduce((sum, s) => sum + (s.recurring_amount || 0), 0);
  const getCompanyName = (id) => companies.find(c => c.id === id)?.company_name || 'Unknown';

  const filteredBilling = billingCustomers.filter(b =>
    !search || b.company_name?.toLowerCase().includes(search.toLowerCase()) || b.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContracts = contracts.filter(c => {
    if (!search) return true;
    const co = companies.find(co => co.id === c.company_id);
    return co?.company_name?.toLowerCase().includes(search.toLowerCase()) || c.contract_name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Billing Dashboard</h1>
              <p className="text-slate-500 mt-1">Stripe subscriptions, MRR, and payment health</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = createPageUrl('AdminFinance')}>
              Finance →
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Stripe MRR', value: `$${stripeMRR.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Active Subs', value: activeBilling.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Failed Payments', value: failedPayments.length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Suspended', value: suspended.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Total Invoiced', value: `$${invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-100' },
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

          {/* Revenue Growth Chart */}
          {revenueChart.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Revenue Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueChart}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#4ade80" fill="#4ade8033" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Tabs: Stripe Billing vs Legacy Contracts */}
          <div className="flex gap-3 mb-2">
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="stripe">Stripe Subscriptions</TabsTrigger>
              <TabsTrigger value="failed">Failed / Suspended</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="contracts">Legacy Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="stripe">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold">Company</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Plan</th>
                        <th className="text-left py-3 px-4 font-semibold">MRR</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Next Billing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBilling.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-400">No billing customers yet.</td></tr>
                      )}
                      {filteredBilling.map(b => (
                        <tr key={b.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold">{b.company_name || '—'}</td>
                          <td className="py-3 px-4 text-slate-500">{b.email}</td>
                          <td className="py-3 px-4">{b.plan_name || '—'}</td>
                          <td className="py-3 px-4 font-bold text-green-700">${(b.monthly_amount || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={billingStatusColors[b.billing_status] || 'bg-slate-100'}>
                              {b.billing_status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-xs">{b.current_period_end || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="failed">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-red-50">
                        <th className="text-left py-3 px-4 font-semibold">Company</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Failed Count</th>
                        <th className="text-left py-3 px-4 font-semibold">Last Failed</th>
                        <th className="text-left py-3 px-4 font-semibold">MRR at Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedPayments.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-slate-400">No failed payments.</td></tr>
                      )}
                      {failedPayments.map(b => (
                        <tr key={b.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold">{b.company_name || '—'}</td>
                          <td className="py-3 px-4 text-slate-500">{b.email}</td>
                          <td className="py-3 px-4"><Badge className={billingStatusColors[b.billing_status]}>{b.billing_status}</Badge></td>
                          <td className="py-3 px-4 font-bold text-red-600">{b.failed_payment_count || 0}</td>
                          <td className="py-3 px-4 text-xs text-slate-500">{b.last_payment_failed_at?.split('T')[0] || '—'}</td>
                          <td className="py-3 px-4 font-bold text-orange-600">${(b.monthly_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Description</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-slate-400">No invoices yet.</td></tr>
                      )}
                      {invoices.slice(0, 100).map(inv => (
                        <tr key={inv.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{inv.invoice_date}</td>
                          <td className="py-3 px-4 font-bold">${(inv.amount || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={inv.status === 'paid' ? 'bg-green-100 text-green-800' : inv.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100'}>
                              {inv.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{inv.description || '—'}</td>
                          <td className="py-3 px-4 flex gap-2">
                            {inv.invoice_pdf_url && <Button size="sm" variant="ghost" asChild><a href={inv.invoice_pdf_url} target="_blank">PDF</a></Button>}
                            {inv.hosted_invoice_url && <Button size="sm" variant="outline" asChild><a href={inv.hosted_invoice_url} target="_blank">View</a></Button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left py-3 px-4 font-semibold">Company</th>
                        <th className="text-left py-3 px-4 font-semibold">Contract</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Monthly Value</th>
                        <th className="text-left py-3 px-4 font-semibold">Renewal Date</th>
                        <th className="text-left py-3 px-4 font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.slice(0, 50).map(c => (
                        <tr key={c.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{getCompanyName(c.company_id)}</td>
                          <td className="py-3 px-4 font-semibold">{c.contract_name}</td>
                          <td className="py-3 px-4">
                            <Badge className={c.status === 'active' ? 'bg-green-100 text-green-800' : c.status === 'expiring' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100'}>
                              {c.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold">${(c.monthly_value || 0).toFixed(0)}</td>
                          <td className="py-3 px-4 text-xs">{c.renewal_date || c.end_date}</td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl(`AdminBillingContract?id=${c.id}`)}>Open</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}