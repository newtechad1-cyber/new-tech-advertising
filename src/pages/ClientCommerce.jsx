import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Calendar, TrendingUp, CheckCircle2, Zap } from 'lucide-react';

export default function ClientCommerce() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);

  // Load user and company
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        
        // Get company from user
        const companies = await base44.entities.Companies.filter({ created_by: u.email });
        if (companies.length > 0) {
          setCompany(companies[0]);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  // Fetch contract and subscription
  const { data: contract = null } = useQuery({
    queryKey: ['contract', company?.id],
    queryFn: () => company ? 
      base44.entities.Contracts.filter({ 
        company_id: company.id, 
        status: { $in: ['active', 'expiring', 'paused'] } 
      }).then(c => c[0]) : null,
    enabled: !!company?.id
  });

  const { data: subscription = null } = useQuery({
    queryKey: ['subscription', contract?.id],
    queryFn: () => contract ?
      base44.entities.Subscriptions.filter({ 
        contract_id: contract.id,
        active: true
      }).then(s => s[0]) : null,
    enabled: !!contract?.id
  });

  const { data: plan = null } = useQuery({
    queryKey: ['plan', contract?.plan_id],
    queryFn: () => contract?.plan_id ?
      base44.entities.Plans.filter({ id: contract.plan_id }).then(p => p[0]) : null,
    enabled: !!contract?.plan_id
  });

  const { data: entitlements = [] } = useQuery({
    queryKey: ['entitlements', plan?.id],
    queryFn: () => plan?.id ?
      base44.entities.PlanEntitlements.filter({ plan_id: plan.id, active: true }) : [],
    enabled: !!plan?.id
  });

  const { data: usage = [] } = useQuery({
    queryKey: ['usage', company?.id],
    queryFn: () => company?.id ?
      base44.entities.UsageMeters.filter({ company_id: company.id }).then(u =>
        u.filter(m => {
          const today = new Date();
          const first = new Date(today.getFullYear(), today.getMonth(), 1);
          return new Date(m.period_start) >= first;
        })
      ) : [],
    enabled: !!company?.id
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['client_proposals', company?.id],
    queryFn: () => company?.id ?
      base44.entities.Proposal.filter({ company_id: company.id }).then(p =>
        p.filter(x => x.visible_to_client !== false)
      ) : [],
    enabled: !!company?.id
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['visible_offers', company?.id],
    queryFn: () => company?.id ?
      base44.entities.ClientVisibleOffers.filter({ 
        company_id: company.id,
        visible_to_client: true,
        status: 'active'
      }) : [],
    enabled: !!company?.id
  });

  const { data: billingEvents = [] } = useQuery({
    queryKey: ['billing_events', company?.id],
    queryFn: () => company?.id ?
      base44.entities.BillingEvents.filter({ company_id: company.id }).then(b =>
        b.sort((a, d) => new Date(d.event_date) - new Date(a.event_date)).slice(0, 5)
      ) : [],
    enabled: !!company?.id
  });

  if (!user || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expiring: 'bg-orange-100 text-orange-800',
      paused: 'bg-yellow-100 text-yellow-800',
      trial: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.active;
  };

  const getDaysUntilRenewal = () => {
    if (!contract?.renewal_date) return null;
    const now = new Date();
    const renewal = new Date(contract.renewal_date);
    return Math.floor((renewal - now) / (1000 * 60 * 60 * 24));
  };

  const daysUntilRenewal = getDaysUntilRenewal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Account & Plan</h1>
          <p className="text-slate-600">Manage your subscription, usage, and upcoming renewals</p>
        </div>

        <Tabs defaultValue="plan" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plan">Plan Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage & Services</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
            <TabsTrigger value="account">Account Status</TabsTrigger>
          </TabsList>

          {/* Plan Overview */}
          <TabsContent value="plan" className="space-y-6">
            {contract && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{plan?.plan_name || 'Custom Plan'}</CardTitle>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status === 'active' ? 'Active' : contract.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-700">{plan?.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div>
                          <p className="text-sm text-slate-600">Billing Frequency</p>
                          <p className="font-semibold text-slate-900">{contract.billing_frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Started</p>
                          <p className="font-semibold text-slate-900">{contract.start_date}</p>
                        </div>
                      </div>

                      {plan?.base_price && (
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Plan Price</p>
                          <p className="text-2xl font-bold text-slate-900">${plan.base_price.toFixed(2)} / {contract.billing_frequency}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {entitlements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>What's Included</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {entitlements.map(ent => (
                          <div key={ent.id} className="p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{ent.entitlement_name}</p>
                                <p className="text-xs text-slate-600 mt-1">{ent.description}</p>
                              </div>
                              <Badge variant="outline">
                                {ent.included_quantity} {ent.unit_type || 'per period'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Subscription Status Card */}
                {subscription && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-600">Status</p>
                        <Badge className={subscription.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {subscription.subscription_status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Monthly Amount</p>
                        <p className="text-lg font-bold text-slate-900">${(subscription.recurring_amount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Current Period</p>
                        <p className="text-sm text-slate-900">{subscription.current_period_start} to {subscription.current_period_end}</p>
                      </div>
                      {subscription.next_invoice_date && (
                        <div>
                          <p className="text-xs text-slate-600">Next Invoice</p>
                          <p className="text-sm text-slate-900">{subscription.next_invoice_date}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Usage & Services */}
          <TabsContent value="usage" className="space-y-6">
            {usage.length > 0 ? (
              <div className="space-y-3">
                {usage.map(u => {
                  const ent = entitlements.find(e => e.entitlement_type === u.meter_type);
                  const percent = u.included_quantity ? (u.used_quantity / u.included_quantity) * 100 : 0;
                  
                  return (
                    <Card key={u.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-900">{u.meter_type}</p>
                          <Badge className={percent > 100 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                            {u.used_quantity} / {u.included_quantity}
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={percent > 100 ? 'bg-red-600' : percent > 80 ? 'bg-orange-600' : 'bg-green-600'}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                        {percent > 100 && (
                          <p className="text-xs text-slate-600 mt-2">You've used {Math.round(percent - 100)}% more than included</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-slate-600">
                  No usage data yet for this period
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Proposals */}
          <TabsContent value="proposals" className="space-y-6">
            {proposals.length > 0 || offers.length > 0 ? (
              <div className="space-y-4">
                {proposals.map(prop => (
                  <Card key={prop.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{prop.proposal_title}</CardTitle>
                        <Badge variant="outline">{prop.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {prop.executive_summary && (
                        <p className="text-slate-700">{prop.executive_summary}</p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Full Proposal</Button>
                        <Button size="sm">Request Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {offers.map(offer => (
                  <Card key={offer.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <Badge variant="outline">{offer.offer_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-700">{offer.summary}</p>
                      <div className="flex gap-2">
                        <Button size="sm">Learn More</Button>
                        <Button variant="outline" size="sm">Ask About This</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-slate-600">
                  No proposals or offers at this time
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Renewals */}
          <TabsContent value="renewals" className="space-y-6">
            {contract && (
              <Card>
                <CardHeader>
                  <CardTitle>Renewal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {daysUntilRenewal !== null && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900">
                            Your agreement renews on {contract.renewal_date || contract.end_date}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {daysUntilRenewal > 0 ? (
                              `That's in ${daysUntilRenewal} days`
                            ) : (
                              'This is coming up soon'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {contract.auto_renew && (
                    <p className="text-sm text-slate-600">
                      ✓ Your plan is set to auto-renew. Questions? <Button variant="link" size="sm" className="p-0">Contact us</Button>
                    </p>
                  )}

                  {!contract.auto_renew && (
                    <p className="text-sm text-slate-600">
                      Your plan requires manual renewal. We'll send renewal options as your date approaches.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Account Status */}
          <TabsContent value="account" className="space-y-6">
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-slate-900">Subscription Status</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{subscription.subscription_status}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-900">Billing Status</p>
                    <Badge variant="outline">{subscription.billing_status}</Badge>
                  </div>

                  {billingEvents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-900 mb-2">Recent Activity</p>
                      <div className="space-y-2">
                        {billingEvents.map(evt => (
                          <div key={evt.id} className="text-xs text-slate-600 p-2 bg-slate-50 rounded">
                            <p className="font-semibold text-slate-900">{evt.event_type}</p>
                            <p>{evt.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">Need to make changes?</p>
                    <Button variant="outline" className="w-full">Contact Our Team</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}