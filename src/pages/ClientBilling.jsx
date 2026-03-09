import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  trialing: 'bg-blue-100 text-blue-800',
  past_due: 'bg-orange-100 text-orange-800',
  suspended: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-700'
};

const invoiceStatusColors = {
  paid: 'bg-green-100 text-green-800',
  open: 'bg-blue-100 text-blue-800',
  void: 'bg-slate-100 text-slate-700',
  uncollectible: 'bg-red-100 text-red-800'
};

export default function ClientBilling() {
  const [syncing, setSyncing] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: billingCustomers = [] } = useQuery({
    queryKey: ['billing_customer_me'],
    queryFn: () => base44.entities.BillingCustomers.filter({ email: user?.email }),
    enabled: !!user?.email
  });

  const billingCustomer = billingCustomers[0];

  const { data: invoices = [] } = useQuery({
    queryKey: ['billing_invoices_me', billingCustomer?.id],
    queryFn: () => base44.entities.BillingInvoices.filter({ billing_customer_id: billingCustomer.id }),
    enabled: !!billingCustomer?.id
  });

  const syncInvoices = async () => {
    if (!billingCustomer) return;
    setSyncing(true);
    await base44.functions.invoke('stripeSubscriptionManager', {
      action: 'sync_invoices',
      billing_customer_id: billingCustomer.id
    });
    queryClient.invalidateQueries({ queryKey: ['billing_invoices_me'] });
    setSyncing(false);
  };

  const sortedInvoices = [...invoices].sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date));

  if (!billingCustomer) {
    return (
      <AdminNav>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">No Billing Account</h2>
              <p className="text-slate-500">Your billing account hasn't been set up yet. Contact your account manager.</p>
            </CardContent>
          </Card>
        </div>
      </AdminNav>
    );
  }

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
            <p className="text-slate-500 mt-1">Manage your subscription and invoices</p>
          </div>

          {/* Current Plan */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Current Plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{billingCustomer.plan_name || 'Standard Plan'}</h2>
                  <p className="text-slate-500 mt-1">${(billingCustomer.monthly_amount || 0).toLocaleString()}/month</p>
                </div>
                <Badge className={statusColors[billingCustomer.billing_status] || 'bg-slate-100'}>
                  {billingCustomer.billing_status}
                </Badge>
              </div>

              {billingCustomer.billing_status === 'past_due' && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-900">Payment Past Due</p>
                    <p className="text-sm text-orange-700">Please update your payment method to avoid service interruption.</p>
                  </div>
                </div>
              )}

              {billingCustomer.billing_status === 'suspended' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Account Suspended</p>
                    <p className="text-sm text-red-700">Your account has been suspended due to failed payments. Please contact support.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current Period</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">
                      {billingCustomer.current_period_start} → {billingCustomer.current_period_end}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Next Billing Date</p>
                  <p className="text-sm font-medium">{billingCustomer.current_period_end || '—'}</p>
                </div>
              </div>

              {billingCustomer.cancel_at_period_end && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠ Cancels at end of billing period: {billingCustomer.current_period_end}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" />Payment Method</CardTitle></CardHeader>
            <CardContent>
              {billingCustomer.stripe_payment_method_id ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                  <span className="text-sm">Card on file</span>
                  <Badge variant="outline" className="ml-auto">Default</Badge>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No payment method on file. Contact support to update.</p>
              )}
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Invoices</CardTitle>
              <Button size="sm" variant="outline" onClick={syncInvoices} disabled={syncing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Refresh'}
              </Button>
            </CardHeader>
            <CardContent>
              {sortedInvoices.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No invoices yet.</p>
              ) : (
                <div className="space-y-2">
                  {sortedInvoices.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">${(inv.amount || 0).toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{inv.invoice_date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={invoiceStatusColors[inv.status] || 'bg-slate-100'}>{inv.status}</Badge>
                        {inv.invoice_pdf_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={inv.invoice_pdf_url} target="_blank" rel="noopener noreferrer">PDF</a>
                          </Button>
                        )}
                        {inv.hosted_invoice_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}