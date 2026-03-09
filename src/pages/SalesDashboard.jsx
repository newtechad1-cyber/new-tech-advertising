import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import AddDealModal from '@/components/sales/AddDealModal';
import { createPageUrl } from '@/utils';

const STAGE_COLORS = {
  new_lead: '#94a3b8', contacted: '#60a5fa', demo_scheduled: '#a78bfa',
  proposal_sent: '#fb923c', negotiation: '#facc15', closed_won: '#4ade80', closed_lost: '#f87171'
};

const SOURCE_COLORS = ['#60a5fa','#4ade80','#fb923c','#a78bfa','#facc15','#f87171','#34d399'];

export default function SalesDashboard() {
  const { data: deals = [] } = useQuery({
    queryKey: ['sales_deals'],
    queryFn: () => base44.asServiceRole.entities.SalesDeals.list('-created_date', 200)
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['sales_leads'],
    queryFn: () => base44.asServiceRole.entities.SalesLeads.list('-created_date', 100)
  });

  const now = new Date();
  const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
  const pipelineValue = activeDeals.reduce((s, d) => s + (d.deal_value || 0), 0);
  const closingThisMonth = deals.filter(d => {
    if (!d.closing_date || d.stage === 'closed_lost') return false;
    const cd = new Date(d.closing_date);
    return cd.getMonth() === now.getMonth() && cd.getFullYear() === now.getFullYear();
  });
  const closingValue = closingThisMonth.reduce((s, d) => s + (d.deal_value || 0), 0);
  const wonThisMonth = deals.filter(d => {
    if (d.stage !== 'closed_won' || !d.updated_date) return false;
    const u = new Date(d.updated_date);
    return u.getMonth() === now.getMonth() && u.getFullYear() === now.getFullYear();
  });
  const wonValue = wonThisMonth.reduce((s, d) => s + (d.deal_value || 0), 0);

  // Stage breakdown
  const stageData = ['new_lead','contacted','demo_scheduled','proposal_sent','negotiation'].map(stage => ({
    label: stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    count: deals.filter(d => d.stage === stage).length,
    value: deals.filter(d => d.stage === stage).reduce((s, d) => s + (d.deal_value || 0), 0)
  })).filter(s => s.count > 0);

  // Lead source breakdown
  const sourceMap = {};
  leads.forEach(l => { sourceMap[l.lead_source] = (sourceMap[l.lead_source] || 0) + 1; });
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  // Recent deals
  const recentDeals = deals.slice(0, 8);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Sales Dashboard</h1>
              <p className="text-slate-500 mt-1">Pipeline overview and deal tracking</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('SalesLeads')}>
                Leads
              </Button>
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('SalesPipeline')}>
                Pipeline Board
              </Button>
              <AddDealModal />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Closing This Month', value: `$${closingValue.toLocaleString()}`, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Won This Month', value: `$${wonValue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'New Leads', value: leads.filter(l => l.status === 'new').length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(m => (
              <Card key={m.label}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${m.bg}`}><m.icon className={`w-6 h-6 ${m.color}`} /></div>
                  <div>
                    <p className="text-xs text-slate-500">{m.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts + Closing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pipeline by Stage */}
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Pipeline by Stage</CardTitle></CardHeader>
              <CardContent>
                {stageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stageData}>
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                      <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-400">No active deals yet</div>
                )}
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader><CardTitle>Lead Sources</CardTitle></CardHeader>
              <CardContent>
                {sourceData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={sourceData} dataKey="value" cx="50%" cy="50%" outerRadius={60}>
                          {sourceData.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-2">
                      {sourceData.map((s, i) => (
                        <div key={s.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                            <span className="capitalize text-slate-600">{s.name}</span>
                          </div>
                          <span className="font-semibold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-400">No leads yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Closing This Month + Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Closing This Month</CardTitle>
                <Badge className="bg-orange-100 text-orange-800">{closingThisMonth.length} deals</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {closingThisMonth.length === 0 && <p className="text-sm text-slate-400">No deals closing this month.</p>}
                {closingThisMonth.slice(0, 6).map(d => (
                  <div key={d.id} className="flex items-center justify-between p-2 border border-slate-200 rounded-lg text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{d.company_name}</p>
                      <p className="text-xs text-slate-500">{d.closing_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">${(d.deal_value || 0).toLocaleString()}</p>
                      <Badge variant="outline" className="text-xs capitalize">{d.stage.replace(/_/g, ' ')}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Deals</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl('SalesPipeline')}>
                  View Board <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentDeals.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-2 border border-slate-200 rounded-lg text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{d.company_name}</p>
                      <p className="text-xs text-slate-500">{d.plan || 'No plan'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(d.deal_value || 0).toLocaleString()}</p>
                      <Badge
                        className="text-xs"
                        style={{ background: STAGE_COLORS[d.stage] + '33', color: STAGE_COLORS[d.stage] }}
                      >
                        {d.stage.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminNav>
  );
}