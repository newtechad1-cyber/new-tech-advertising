import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Settings, Users } from 'lucide-react';
import ResellerMetrics from '@/components/reseller/ResellerMetrics';
import AddClientModal from '@/components/reseller/AddClientModal';
import ResellerClientTable from '@/components/reseller/ResellerClientTable';
import { createPageUrl } from '@/utils';

export default function ResellerDashboard() {
  const [user, setUser] = useState(null);
  const [reseller, setReseller] = useState(null);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const accounts = await base44.entities.ResellerAccounts.filter({ contact_email: u.email });
      if (accounts.length > 0) setReseller(accounts[0]);
    };
    load();
  }, []);

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller_clients', reseller?.id],
    queryFn: () => base44.entities.ResellerClients.filter({ reseller_id: reseller.id }),
    enabled: !!reseller?.id
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ['reseller_commissions', reseller?.id],
    queryFn: () => base44.entities.ResellerCommissions.filter({ reseller_id: reseller.id }),
    enabled: !!reseller?.id
  });

  const { data: branding = null } = useQuery({
    queryKey: ['branding', reseller?.id],
    queryFn: () => base44.entities.WhiteLabelBranding.filter({ reseller_id: reseller.id, active: true }).then(b => b[0]),
    enabled: !!reseller?.id
  });

  if (!reseller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Reseller Portal</h2>
            <p className="text-slate-600">Your reseller account is not set up yet. Please contact us to get started.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {branding?.logo_url && (
            <img src={branding.logo_url} alt={branding.brand_name} className="h-8 object-contain" />
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">{branding?.brand_name || reseller.reseller_name}</h1>
            <p className="text-xs text-slate-500">Reseller Partner Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={reseller.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {reseller.status}
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl('ResellerBranding')}>
            <Settings className="w-4 h-4 mr-1" /> Branding
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Metrics */}
        <ResellerMetrics clients={clients} commissions={commissions} />

        {/* Recent Commission Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clients</CardTitle>
              <AddClientModal resellerId={reseller.id} />
            </CardHeader>
            <CardContent className="p-0 pt-0">
              <ResellerClientTable clients={clients.slice(0, 10)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Commissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {commissions.length === 0 && (
                <p className="text-sm text-slate-500">No commissions recorded yet.</p>
              )}
              {commissions.slice(0, 6).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{c.period_label}</p>
                    <p className="text-xs text-slate-500">{c.commission_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${(c.commission_amount || 0).toFixed(2)}</p>
                    <Badge className={
                      c.status === 'paid' ? 'bg-green-100 text-green-800' :
                      c.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {c.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm"
                onClick={() => window.location.href = createPageUrl('ResellerClients')}>
                View All Clients →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reseller Info */}
        <Card>
          <CardHeader><CardTitle>Your Account</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500">Commission Rate</p>
              <p className="font-bold text-slate-900">{reseller.commission_rate}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Commission Model</p>
              <p className="font-bold text-slate-900">{reseller.commission_model}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">White Label</p>
              <Badge className={reseller.white_label_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {reseller.white_label_enabled ? 'Enabled' : 'Not Enabled'}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500">Contact</p>
              <p className="font-bold text-slate-900">{reseller.contact_email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}