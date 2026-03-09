import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Star } from 'lucide-react';

export default function ResellerMetrics({ clients = [], commissions = [] }) {
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalMonthlyRevenue = clients
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + (c.monthly_value || 0), 0);

  const pendingCommissions = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  const paidCommissions = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  const metrics = [
    { label: 'Active Clients', value: activeClients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Monthly Revenue', value: `$${totalMonthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Commissions', value: `$${pendingCommissions.toFixed(2)}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Paid Out', value: `$${paidCommissions.toFixed(2)}`, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map(m => (
        <Card key={m.label}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${m.bg}`}>
              <m.icon className={`w-6 h-6 ${m.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{m.label}</p>
              <p className="text-2xl font-bold text-slate-900">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}