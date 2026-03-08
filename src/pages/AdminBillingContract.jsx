import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Calendar, AlertCircle } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminBillingContract() {
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('id');

  const { data: contract = null, isLoading } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => base44.asServiceRole.entities.Contracts.filter({ id: contractId }).then(r => r[0]),
    enabled: !!contractId
  });

  const { data: subscription = null } = useQuery({
    queryKey: ['subscription', contract?.id],
    queryFn: () => base44.asServiceRole.entities.Subscriptions.filter({ contract_id: contract?.id }).then(r => r[0]),
    enabled: !!contract?.id
  });

  const { data: lineItems = [] } = useQuery({
    queryKey: ['line_items', contract?.id],
    queryFn: () => base44.asServiceRole.entities.ContractLineItems.filter({ contract_id: contract?.id }),
    enabled: !!contract?.id
  });

  const { data: billingEvents = [] } = useQuery({
    queryKey: ['billing_events', contract?.id],
    queryFn: () => base44.asServiceRole.entities.BillingEvents.filter({ contract_id: contract?.id }),
    enabled: !!contract?.id
  });

  const { data: company = null } = useQuery({
    queryKey: ['company', contract?.company_id],
    queryFn: () => base44.asServiceRole.entities.Companies.filter({ id: contract?.company_id }).then(c => c[0]),
    enabled: !!contract?.company_id
  });

  const { data: plan = null } = useQuery({
    queryKey: ['plan', contract?.plan_id],
    queryFn: () => base44.asServiceRole.entities.Plans.filter({ id: contract?.plan_id }).then(p => p[0]),
    enabled: !!contract?.plan_id
  });

  const { data: entitlements = [] } = useQuery({
    queryKey: ['entitlements', plan?.id],
    queryFn: () => base44.asServiceRole.entities.PlanEntitlements.filter({ plan_id: plan?.id }),
    enabled: !!plan?.id
  });

  const { data: usage = [] } = useQuery({
    queryKey: ['usage_meters', contract?.id],
    queryFn: () => base44.asServiceRole.entities.UsageMeters.filter({ contract_id: contract?.id }),
    enabled: !!contract?.id
  });

  if (isLoading || !contract) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      expiring: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.draft;
  };

  const recurringLineItems = lineItems.filter(item => item.recurring);
  const oneTimeLineItems = lineItems.filter(item => !item.recurring);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{contract.contract_name}</h1>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className={getStatusColor(contract.status)}>
                {contract.status}
              </Badge>
              <Badge variant="outline">{contract.contract_type}</Badge>
              <Badge variant="outline">{contract.billing_frequency}</Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="line_items">Line Items</TabsTrigger>
              <TabsTrigger value="entitlements">Entitlements & Usage</TabsTrigger>
              <TabsTrigger value="timeline">Billing Timeline</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contract Details */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contract Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Company</p>
                        <p className="font-semibold text-slate-900">{company?.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Scope</p>
                        <p className="text-slate-900">{contract.scope_summary}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Start Date</p>
                          <p className="font-semibold text-slate-900">{contract.start_date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Renewal Date</p>
                          <p className="font-semibold text-slate-900">{contract.renewal_date || contract.end_date}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Auto Renew</p>
                          <p className="text-slate-900">{contract.auto_renew ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Plan</p>
                          <p className="text-slate-900">{plan?.plan_name || 'Custom'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription */}
                  {subscription && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Subscription Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">Status</p>
                          <Badge className={subscription.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {subscription.subscription_status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">Billing</p>
                          <Badge variant="outline">{subscription.billing_status}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">Recurring Amount</p>
                          <p className="font-semibold">${(subscription.recurring_amount || 0).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">Next Invoice</p>
                          <p className="text-slate-900">{subscription.next_invoice_date}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600">Monthly Value</p>
                      <p className="text-2xl font-bold text-green-600">${(contract.monthly_value || 0).toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Total Contract Value</p>
                      <p className="text-2xl font-bold text-slate-900">${(contract.total_contract_value || 0).toFixed(0)}</p>
                    </div>
                    {contract.expansion_value > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-slate-600">Expansion/Add-ons</p>
                        <p className="text-lg font-bold text-blue-600">${(contract.expansion_value || 0).toFixed(0)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Line Items Tab */}
            <TabsContent value="line_items" className="space-y-6">
              {recurringLineItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recurring Charges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recurringLineItems.map(item => (
                        <div key={item.id} className="p-3 border border-slate-200 rounded-lg flex justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{item.item_name}</p>
                            <p className="text-xs text-slate-600">{item.item_type}</p>
                          </div>
                          <p className="font-semibold text-slate-900">
                            ${((item.quantity || 1) * (item.unit_price || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {oneTimeLineItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>One-Time Charges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {oneTimeLineItems.map(item => (
                        <div key={item.id} className="p-3 border border-slate-200 rounded-lg flex justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{item.item_name}</p>
                            <p className="text-xs text-slate-600">{item.item_type}</p>
                          </div>
                          <p className="font-semibold text-slate-900">
                            ${((item.quantity || 1) * (item.unit_price || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Entitlements Tab */}
            <TabsContent value="entitlements">
              {entitlements.length > 0 ? (
                <div className="space-y-3">
                  {entitlements.map(ent => {
                    const usageItem = usage.find(u => u.meter_type === ent.entitlement_type);
                    const used = usageItem?.used_quantity || 0;
                    const included = ent.included_quantity || 0;
                    const percent = included > 0 ? (used / included) * 100 : 0;
                    
                    return (
                      <Card key={ent.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-slate-900">{ent.entitlement_name}</p>
                            <Badge className={percent > 100 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                              {used} / {included}
                            </Badge>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={percent > 100 ? 'bg-red-600' : 'bg-green-600'}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-slate-600">
                    No entitlements defined for this plan
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              {billingEvents.length > 0 ? (
                <div className="space-y-2">
                  {billingEvents.map(event => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{event.event_type}</p>
                            <p className="text-sm text-slate-600 mt-1">{event.summary}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{event.status}</Badge>
                            <p className="text-xs text-slate-600 mt-2">{event.event_date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-slate-600">
                    No billing events recorded
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}