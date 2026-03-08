import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Eye, EyeOff } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminCommerceCompany() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('id');

  const { data: company = null } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => base44.asServiceRole.entities.Companies.filter({ id: companyId }).then(c => c[0]),
    enabled: !!companyId
  });

  const { data: contract = null } = useQuery({
    queryKey: ['contract', company?.id],
    queryFn: () => company ? 
      base44.asServiceRole.entities.Contracts.filter({ 
        company_id: company.id, 
        status: 'active' 
      }).then(c => c[0]) : null,
    enabled: !!company?.id
  });

  const { data: subscription = null } = useQuery({
    queryKey: ['subscription', contract?.id],
    queryFn: () => contract ?
      base44.asServiceRole.entities.Subscriptions.filter({ 
        contract_id: contract.id,
        active: true
      }).then(s => s[0]) : null,
    enabled: !!contract?.id
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers', company?.id],
    queryFn: () => company ?
      base44.asServiceRole.entities.ClientVisibleOffers.filter({ company_id: company.id }) : [],
    enabled: !!company?.id
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals', company?.id],
    queryFn: () => company ?
      base44.asServiceRole.entities.Proposal.filter({ company_id: company.id }) : [],
    enabled: !!company?.id
  });

  const { data: plan = null } = useQuery({
    queryKey: ['plan', contract?.plan_id],
    queryFn: () => contract?.plan_id ?
      base44.asServiceRole.entities.Plans.filter({ id: contract.plan_id }).then(p => p[0]) : null,
    enabled: !!contract?.plan_id
  });

  const { data: entitlements = [] } = useQuery({
    queryKey: ['entitlements', plan?.id],
    queryFn: () => plan?.id ?
      base44.asServiceRole.entities.PlanEntitlements.filter({ plan_id: plan.id, active: true }) : [],
    enabled: !!plan?.id
  });

  if (!company || !contract) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{company.company_name}</h1>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
            <p className="text-slate-600">Manage what this client can see in their commerce portal</p>
          </div>

          <Tabs defaultValue="contract">
            <TabsList className="mb-6">
              <TabsTrigger value="contract">Contract & Plan</TabsTrigger>
              <TabsTrigger value="offers">Offers & Proposals</TabsTrigger>
              <TabsTrigger value="visibility">Commerce Visibility</TabsTrigger>
            </TabsList>

            {/* Contract Tab */}
            <TabsContent value="contract" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600">Plan</p>
                      <p className="font-semibold text-slate-900">{plan?.plan_name || 'Custom'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Status</p>
                      <Badge className="bg-green-100 text-green-800">{contract.status}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Billing</p>
                      <p className="text-slate-900">{contract.billing_frequency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Monthly Value</p>
                      <p className="text-lg font-bold text-slate-900">${(contract.monthly_value || 0).toFixed(0)}</p>
                    </div>
                  </CardContent>
                </Card>

                {subscription && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-600">Status</p>
                        <Badge className="bg-green-100 text-green-800">{subscription.subscription_status}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Billing Status</p>
                        <Badge variant="outline">{subscription.billing_status}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Amount</p>
                        <p className="text-lg font-bold text-slate-900">${(subscription.recurring_amount || 0).toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {entitlements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Included Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {entitlements.map(ent => (
                      <div key={ent.id} className="flex items-center justify-between p-2 border border-slate-200 rounded">
                        <p className="text-sm font-semibold text-slate-900">{ent.entitlement_name}</p>
                        <Badge variant="outline">{ent.included_quantity} {ent.unit_type}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Client-Visible Offers</h3>
                  {offers.filter(o => o.visible_to_client).length > 0 ? (
                    <div className="space-y-2">
                      {offers.filter(o => o.visible_to_client).map(offer => (
                        <Card key={offer.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{offer.title}</p>
                                <Badge className="mt-1">{offer.offer_type}</Badge>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Visible</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">No visible offers</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Hidden Offers</h3>
                  {offers.filter(o => !o.visible_to_client).length > 0 ? (
                    <div className="space-y-2">
                      {offers.filter(o => !o.visible_to_client).map(offer => (
                        <Card key={offer.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{offer.title}</p>
                                <Badge variant="outline" className="mt-1">{offer.offer_type}</Badge>
                              </div>
                              <Badge variant="outline">Hidden</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">No hidden offers</p>
                  )}
                </div>

                {proposals.filter(p => p.visible_to_client !== false).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Visible Proposals</h3>
                    <div className="space-y-2">
                      {proposals.filter(p => p.visible_to_client !== false).map(prop => (
                        <Card key={prop.id}>
                          <CardContent className="p-4">
                            <p className="font-semibold text-slate-900">{prop.proposal_title}</p>
                            <Badge variant="outline" className="mt-1">{prop.status}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Visibility Tab */}
            <TabsContent value="visibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commerce Portal Visibility Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Show Plan Details</p>
                      <p className="text-xs text-slate-600 mt-1">Client can see their plan and entitlements</p>
                    </div>
                    <Toggle defaultPressed>
                      <Eye className="w-4 h-4" />
                    </Toggle>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Show Usage Tracking</p>
                      <p className="text-xs text-slate-600 mt-1">Client can see usage vs entitlements</p>
                    </div>
                    <Toggle defaultPressed>
                      <Eye className="w-4 h-4" />
                    </Toggle>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Show Renewal Timing</p>
                      <p className="text-xs text-slate-600 mt-1">Client can see contract renewal dates</p>
                    </div>
                    <Toggle defaultPressed>
                      <Eye className="w-4 h-4" />
                    </Toggle>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Show Upgrade Offers</p>
                      <p className="text-xs text-slate-600 mt-1">Client can see expansion/upgrade opportunities</p>
                    </div>
                    <Toggle>
                      <EyeOff className="w-4 h-4" />
                    </Toggle>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">Show Billing Status</p>
                      <p className="text-xs text-slate-600 mt-1">Client can see subscription and billing details</p>
                    </div>
                    <Toggle defaultPressed>
                      <Eye className="w-4 h-4" />
                    </Toggle>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>Client Portal Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Preview as Client
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}