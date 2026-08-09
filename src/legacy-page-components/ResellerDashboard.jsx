import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, AlertCircle, Zap, Link as LinkIcon, Activity } from 'lucide-react';

export default function ResellerDashboard() {
  const navigate = useNavigate();
  const [resellerTenant, setResellerTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user's reseller tenant
  useEffect(() => {
    const loadTenant = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          navigate('/');
          return;
        }

        // Get user's tenant assignments
        const assignments = await base44.entities.TenantUserAssignment.filter({
          userId: user.id,
          status: 'active'
        });

        if (!assignments || assignments.length === 0) {
          navigate('/');
          return;
        }

        // Get the tenant
        const tenant = await base44.entities.Tenant.read(assignments[0].tenantId);
        if (!tenant || tenant.tenantType !== 'reseller') {
          navigate('/');
          return;
        }

        setResellerTenant(tenant);
      } catch (error) {
        console.error('Error loading tenant:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, [navigate]);

  // Fetch reseller data
  const { data: stats } = useQuery({
    queryKey: ['reseller-stats', resellerTenant?.tenantId],
    enabled: !!resellerTenant,
    queryFn: async () => {
      const [maps, reseller, brand] = await Promise.all([
        base44.entities.TenantOrganizationMap.filter({ tenantId: resellerTenant.tenantId }),
        base44.entities.ResellerProfile.filter({ tenantId: resellerTenant.tenantId }, null, 1),
        base44.entities.BrandProfile.filter({ tenantId: resellerTenant.tenantId }, null, 1)
      ]);

      const clientOrgIds = maps?.map(m => m.organizationId) || [];
      const subscriptions = clientOrgIds.length > 0 
        ? await base44.entities.DIYSubscription.filter({ user_email: { $exists: true } })
        : [];

      return {
        clientCount: maps?.length || 0,
        subscriptionCount: subscriptions?.length || 0,
        reseller: reseller?.[0],
        brand: brand?.[0],
        maps
      };
    }
  });

  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['reseller-clients', resellerTenant?.tenantId],
    enabled: !!stats?.maps,
    queryFn: async () => {
      const clientOrgIds = stats.maps.map(m => m.organizationId);
      if (clientOrgIds.length === 0) return [];
      
      const orgs = await Promise.all(
        clientOrgIds.map(id => base44.entities.Organization.read(id))
      );
      return orgs.filter(o => o);
    }
  });

  // Fetch recent activity
  const { data: recentActivity } = useQuery({
    queryKey: ['reseller-activity', resellerTenant?.tenantId],
    enabled: !!resellerTenant,
    queryFn: async () => {
      return await base44.entities.ActivityEvent.filter(
        { organizationId: { $in: stats?.maps?.map(m => m.organizationId) || [] } },
        '-timestamp',
        20
      );
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const atRiskClients = clients?.filter(c => c.status === 'at_risk') || [];
  const upgradeReadyClients = clients?.filter(c => 
    c.subscriptionPlan === 'diy' && c.status === 'active'
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{resellerTenant?.tenantName}</h1>
              <p className="text-slate-600 mt-1">
                {stats?.reseller?.companyName || 'Reseller Dashboard'}
              </p>
            </div>
            <Button onClick={() => navigate('/reseller/brand-settings')}>
              Brand Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Clients</p>
                <p className="text-3xl font-bold mt-2">{stats?.clientCount || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Subscriptions</p>
                <p className="text-3xl font-bold mt-2">{stats?.subscriptionCount || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">At-Risk Clients</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{atRiskClients.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6 bg-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700">Upgrade Ready</p>
                <p className="text-3xl font-bold mt-2 text-amber-600">{upgradeReadyClients.length}</p>
              </div>
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients">
          <TabsList className="mb-6">
            <TabsTrigger value="clients">Client Management</TabsTrigger>
            <TabsTrigger value="at-risk">At-Risk Clients</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade Ready</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Clients Table */}
          <TabsContent value="clients">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Client Name</th>
                      <th className="px-4 py-3 text-left">Industry</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Health</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients?.map(client => (
                      <tr key={client.id} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{client.businessName}</td>
                        <td className="px-4 py-3 text-slate-600">{client.industry || '-'}</td>
                        <td className="px-4 py-3">
                          <Badge>{client.subscriptionPlan}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{client.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${75}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(!clients || clients.length === 0) && (
                <div className="text-center py-8 text-slate-500">
                  No clients yet. Start by inviting your first client.
                </div>
              )}
            </Card>
          </TabsContent>

          {/* At-Risk Clients */}
          <TabsContent value="at-risk">
            <div className="space-y-4">
              {atRiskClients.map(client => (
                <Card key={client.id} className="p-6 border-red-200 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-red-900">{client.businessName}</h3>
                      <p className="text-sm text-red-700 mt-1">Churn Risk: High</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {atRiskClients.length === 0 && (
                <Card className="p-8 text-center text-slate-500">
                  No at-risk clients. Great job!
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Upgrade Ready */}
          <TabsContent value="upgrade">
            <div className="space-y-4">
              {upgradeReadyClients.map(client => (
                <Card key={client.id} className="p-6 border-amber-200 bg-amber-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-amber-900">{client.businessName}</h3>
                      <p className="text-sm text-amber-700 mt-1">High engagement - Ready for Guided Growth</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Send Offer
                      </Button>
                      <Button size="sm" variant="outline">
                        View Analytics
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {upgradeReadyClients.length === 0 && (
                <Card className="p-8 text-center text-slate-500">
                  No clients are ready for upgrade yet.
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Activity */}
          <TabsContent value="activity">
            <Card className="p-6">
              <div className="space-y-3">
                {recentActivity?.map(event => (
                  <div key={event.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Activity className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.eventType.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {(!recentActivity || recentActivity.length === 0) && (
                <div className="text-center py-8 text-slate-500">
                  No recent activity.
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}