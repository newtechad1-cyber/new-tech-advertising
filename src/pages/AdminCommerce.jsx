import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Plus } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminCommerce() {
  const [search, setSearch] = useState('');

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.asServiceRole.entities.Contracts.filter({ status: 'active' })
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers'],
    queryFn: () => base44.asServiceRole.entities.ClientVisibleOffers.list()
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  // Metrics
  const activeOffers = offers.filter(o => o.status === 'active' && o.visible_to_client).length;
  const renewalOffers = offers.filter(o => o.offer_type === 'renewal').length;
  const upgradeOffers = offers.filter(o => o.offer_type === 'upgrade').length;

  let filtered = contracts;
  if (search) {
    filtered = filtered.filter(c => {
      const company = companies.find(co => co.id === c.company_id);
      return company?.company_name.toLowerCase().includes(search.toLowerCase());
    });
  }

  const getCompanyName = (id) => companies.find(c => c.id === id)?.company_name || 'Unknown';

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Commerce Management</h1>
            <p className="text-slate-600">Manage client-facing offers, proposals, and visibility</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Active Contracts</p>
                <p className="text-3xl font-bold text-slate-900">{contracts.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Visible Offers</p>
                <p className="text-3xl font-bold text-blue-600">{activeOffers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Renewal Offers</p>
                <p className="text-3xl font-bold text-orange-600">{renewalOffers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Upgrade Offers</p>
                <p className="text-3xl font-bold text-green-600">{upgradeOffers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="companies">
            <TabsList className="mb-6">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
            </TabsList>

            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-6">
              <div className="mb-4">
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Active Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Company</th>
                          <th className="text-left py-3 px-4 font-semibold">Plan</th>
                          <th className="text-left py-3 px-4 font-semibold">Subscription Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Visible Offers</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.slice(0, 50).map(contract => {
                          const companyOffers = offers.filter(o => o.company_id === contract.company_id && o.visible_to_client);
                          return (
                            <tr key={contract.id} className="border-b hover:bg-slate-50">
                              <td className="py-3 px-4 font-semibold">{getCompanyName(contract.company_id)}</td>
                              <td className="py-3 px-4 text-xs">{contract.contract_type}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">active</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className="bg-blue-100 text-blue-800">{companyOffers.length}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.location.href = createPageUrl(`AdminCommerceCompany?id=${contract.company_id}`)}
                                >
                                  Manage
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">All Offers</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Offer
                </Button>
              </div>

              <div className="space-y-3">
                {offers.map(offer => {
                  const company = companies.find(c => c.id === offer.company_id);
                  return (
                    <Card key={offer.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-slate-900">{offer.title}</p>
                              <Badge variant="outline">{offer.offer_type}</Badge>
                              <Badge className={offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {offer.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{company?.company_name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {offer.visible_to_client ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs">Visible</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-slate-400">
                                <EyeOff className="w-4 h-4" />
                                <span className="text-xs">Hidden</span>
                              </div>
                            )}
                            <Button size="sm" variant="ghost">Edit</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}