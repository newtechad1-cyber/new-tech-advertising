import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function DIYBillingSettings() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          navigate('/');
          return;
        }

        const subs = await base44.entities.DIYSubscription.filter(
          { user_email: user.email },
          '-created_date',
          1
        );

        if (subs.length === 0) {
          navigate('/nta/diy-growth-system');
          return;
        }

        setSubscription(subs[0]);
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'text-green-400';
      case 'past_due':
        return 'text-yellow-400';
      case 'cancelled':
      case 'incomplete':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trialing';
      case 'past_due':
        return 'Past Due - Action Required';
      case 'cancelled':
        return 'Cancelled';
      case 'incomplete':
        return 'Incomplete';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
          <p className="text-slate-400">Manage your DIY Growth System plan</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Current Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Current Plan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Plan Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Plan Type</p>
                  <p className="text-2xl font-bold text-white">DIY Growth System</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Monthly Cost</p>
                    <p className="text-3xl font-bold text-white">$99</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Next Renewal</p>
                    <p className="text-white font-semibold">
                      {subscription?.next_renewal_date
                        ? new Date(subscription.next_renewal_date).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Status</p>
                  <span className={`inline-flex items-center gap-2 font-semibold ${getStatusColor(subscription?.billing_status)}`}>
                    <div className={`w-2 h-2 rounded-full ${subscription?.billing_status === 'active' ? 'bg-green-400' : 'bg-slate-400'}`} />
                    {getStatusLabel(subscription?.billing_status)}
                  </span>
                </div>

                {subscription?.billing_status === 'past_due' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-semibold text-sm mb-1">Payment Action Required</p>
                      <p className="text-slate-300 text-sm">Your payment failed. Please update your payment method to continue using DIY.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 rounded-lg p-6 h-fit">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Options */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Ready to Upgrade?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Guided Growth',
                  price: '$299/mo',
                  description: 'Add monthly strategy help and coaching',
                  benefits: ['Monthly strategy calls', 'Priority support', 'Personalized growth plan'],
                },
                {
                  name: 'Done-For-You',
                  price: '$1,200/mo',
                  description: 'We handle all execution',
                  benefits: ['Full content creation', 'Video production', 'Dedicated account manager'],
                },
                {
                  name: 'Premium Authority',
                  price: '$3,000+/mo',
                  description: 'Market dominance strategy',
                  benefits: ['Streaming TV ads', 'Premium visibility stack', 'Growth team'],
                },
              ].map((plan, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-violet-400 font-semibold text-lg mb-2">{plan.price}</p>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="text-slate-300 text-xs flex gap-2">
                        <span className="text-green-500 flex-shrink-0">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <a href="mailto:sales@newtechadvertising.com">
                    <Button variant="outline" className="w-full">
                      Learn More
                      <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Billing History</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-white font-semibold">DIY Growth System - Monthly</p>
                    <p className="text-slate-400 text-sm">March 13, 2026</p>
                  </div>
                </div>
                <p className="text-white font-semibold">$99.00</p>
              </div>
              <p className="text-slate-400 text-sm text-center py-4">
                More invoices will appear here as you continue your subscription
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-slate-300 mb-6">
              Canceling your subscription will immediately remove access to all DIY tools. Your data will be retained for 30 days.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Cancel Subscription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}