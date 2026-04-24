import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, TrendingUp, DollarSign, Zap, Globe, Award } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

const COLORS = ['#60a5fa', '#4ade80', '#fb923c', '#a78bfa', '#facc15', '#f87171', '#34d399', '#818cf8'];

export default function AdminPlatform() {
  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => base44.asServiceRole.entities.ResellerAccounts.list('-created_date', 200)
  });

  const { data: resellerClients = [] } = useQuery({
    queryKey: ['reseller_clients_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerClients.list('-created_date', 500)
  });

  const { data: resellerRevenue = [] } = useQuery({
    queryKey: ['reseller_revenue_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerRevenue.list('-period_start', 500)
  });

  const { data: signupLinks = [] } = useQuery({
    queryKey: ['signup_links_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerSignupLinks.list()
  });

  const { data: billingCustomers = [] } = useQuery({
    queryKey: ['billing_customers_all'],
    queryFn: () => base44.asServiceRole.entities.BillingCustomers.list()
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['sales_deals'],
    queryFn: () => base44.asServiceRole.entities.SalesDeal.list('-created_date', 200)
  });

  // Platform Metrics
  const totalMRR = billingCustomers.filter(b => b.billing_status === 'active').reduce((s, b) => s + (b.monthly_amount || 0), 0);
  const resellerMRR = resellerClients.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value || 0), 0);
  const totalCommissionsPaid = resellerRevenue.filter(r => r.payout_status === 'paid').reduce((s, r) => s + (r.commission_amount || 0), 0);
  const activeResellers = resellers.filter(r => r.status === 'active').length;
  const pipelineValue = deals.filter(d => !['closed_won','closed_lost'].includes(d.stage)).reduce((s, d) => s + (d.deal_value || 0), 0);
  const totalSignupClicks = signupLinks.reduce((s, l) => s + (l.clicks || 0), 0);
  const totalSignupConversions = signupLinks.reduce((s, l) => s + (l.conversions || 0), 0);

  // Reseller performance table
  const resellerPerf = resellers.map(r => {
    const rClients = resellerClients.filter(c => c.reseller_id === r.id);
    const rRevenue = resellerRevenue.filter(rev => rev.reseller_id === r.id);
    const rLinks = signupLinks.filter(l => l.reseller_id === r.id);
    return {
      ...r,
      clientCount: rClients.length,
      activeClients: rClients.filter(c => c.status === 'active').length,
      mrr: rClients.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value || 0), 0),
      totalCommission: rRevenue.reduce((s, r) => s + (r.commission_amount || 0), 0),
      pendingCommission: rRevenue.filter(r => r.payout_status === 'pending').reduce((s, r) => s + (r.commission_amount || 0), 0),
      linkConversions: rLinks.reduce((s, l) => s + (l.conversions || 0), 0)
    };
  }).sort((a, b) => b.mrr - a.mrr);

  // Client growth by month
  const clientGrowthMap = {};
  resellerClients.forEach(c => {
    const m = c.start_date?.slice(0, 7) || c.created_date?.slice(0, 7);
    if (!m) return;
    clientGrowthMap[m] = (clientGrowthMap[m] || 0) + 1;
  });
  const clientGrowthData = Object.entries(clientGrowthMap).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([month, count]) => ({ month, count }));

  // Revenue distribution pie
  const revenueByReseller = resellerPerf.slice(0, 6).map(r => ({ name: r.reseller_name, value: r.mrr })).filter(r => r.value > 0);

  // Status distribution
  const statusData = ['active','trial','paused','churned'].map(s => ({
    name: s,
    value: resellerClients.filter(c => c.status === s).length
  })).filter(d => d.value > 0);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Platform Overview</h1>
              <p className="text-slate-500 mt-1">NTA SaaS Operating System — Full funnel analytics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('AdminResellers')}>Resellers</Button>
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('AdminResellerRevenue')}>Revenue</Button>
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('AdminFinance')}>Finance</Button>
            </div>
          </div>

          {/* Platform KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Platform MRR', value: `$${totalMRR.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Active Resellers', value: activeResellers, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Reseller Clients', value: resellerClients.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Sales Pipeline', value: `$${pipelineValue.toLocaleString()}`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Reseller MRR', value: `$${resellerMRR.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Commissions Paid', value: `$${totalCommissionsPaid.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Signup Link Clicks', value: totalSignupClicks, icon: Globe, color: 'text-slate-600', bg: 'bg-slate-100' },
              { label: 'Link Conversions', value: totalSignupConversions, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
            ].map(m => (
              <Card key={m.label}>
                <CardContent className="p-5 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${m.bg}`}><m.icon className={`w-5 h-5 ${m.color}`} /></div>
                  <div><p className="text-xs text-slate-500">{m.label}</p><p className="text-xl font-bold text-slate-900">{m.value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Client Growth */}
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Reseller Client Growth</CardTitle></CardHeader>
              <CardContent>
                {clientGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={clientGrowthData}>
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#60a5fa" fill="#60a5fa33" name="New Clients" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-400">No client data yet</div>
                )}
              </CardContent>
            </Card>

            {/* Client Status Distribution */}
            <Card>
              <CardHeader><CardTitle>Client Status</CardTitle></CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={55}>
                          {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {statusData.map((s, i) => (
                        <div key={s.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="capitalize text-slate-600">{s.name}</span>
                          </div>
                          <span className="font-semibold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-400">No data yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Revenue Distribution */}
          {revenueByReseller.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Revenue Distribution by Reseller</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueByReseller}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} name="MRR" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Reseller Performance Table */}
          <Card>
            <CardHeader><CardTitle>Reseller Performance</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-3 px-4 font-semibold">Reseller</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Clients</th>
                    <th className="text-left py-3 px-4 font-semibold">Active</th>
                    <th className="text-left py-3 px-4 font-semibold">MRR</th>
                    <th className="text-left py-3 px-4 font-semibold">Commission</th>
                    <th className="text-left py-3 px-4 font-semibold">Pending</th>
                    <th className="text-left py-3 px-4 font-semibold">Link CVR</th>
                    <th className="text-left py-3 px-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {resellerPerf.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-slate-400">No resellers yet.</td></tr>}
                  {resellerPerf.map(r => (
                    <tr key={r.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="font-semibold">{r.reseller_name}</p>
                        <p className="text-xs text-slate-500">{r.contact_email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={r.status === 'active' ? 'bg-green-100 text-green-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100'}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold">{r.clientCount}</td>
                      <td className="py-3 px-4 text-green-700 font-bold">{r.activeClients}</td>
                      <td className="py-3 px-4 font-bold">${r.mrr.toLocaleString()}</td>
                      <td className="py-3 px-4 text-green-700">${r.totalCommission.toLocaleString()}</td>
                      <td className="py-3 px-4 text-orange-600">${r.pendingCommission.toLocaleString()}</td>
                      <td className="py-3 px-4">{r.linkConversions} signups</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl(`AdminResellerClients?reseller_id=${r.id}`)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}