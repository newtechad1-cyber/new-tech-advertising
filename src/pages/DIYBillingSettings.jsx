import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function DIYBillingSettings() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

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

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await base44.entities.DIYSubscription.update(subscription.id, {
        status: 'cancelled',
        billing_status: 'cancelled',
      });
      setSubscription(prev => ({ ...prev, status: 'cancelled', billing_status: 'cancelled' }));
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsCanceling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'trialing':
        return 'text-blue-400';
      case 'past_due':
        return 'text-orange-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-300' };
      case 'trialing':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-300' };
      case 'past_due':
        return { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-300' };
      case 'cancelled':
        return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-300' };
      default:
        return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-300' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">No active subscription found</p>
          <Button onClick={() => navigate('/nta/diy-growth-system')} className="bg-violet-600 hover:bg-violet-700">
            Start DIY Plan
          </Button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(subscription.billing_status || 'active');
  const planPrice = 99;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-6 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/client/diy-dashboard')}
            className="text-slate-400 hover:text-white font-semibold flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-slate-400">Manage your DIY Growth System plan</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Current Plan */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Plan</h2>
              <p className="text-slate-400">DIY Growth System</p>
            </div>
            <div className={`${statusBadge.bg} ${statusBadge.border} border rounded-lg px-4 py-2`}>
              <p className={`${statusBadge.text} text-sm font-bold capitalize`}>
                {subscription.billing_status || 'active'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Price */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <p className="text-slate-400 text-sm font-semibold mb-2">Monthly Price</p>
              <p className="text-3xl font-bold text-white">
                ${planPrice}
                <span className="text-lg text-slate-400">/mo</span>
              </p>
              <p className="text-slate-500 text-xs mt-2">Billed on your renewal date</p>
            </div>

            {/* Renewal Date */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <p className="text-slate-400 text-sm font-semibold">Next Renewal</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {subscription.next_renewal_date
                  ? new Date(subscription.next_renewal_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'TBD'}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                {subscription.billing_status === 'active' ? 'Your subscription renews on this date' : 'Your subscription has been cancelled'}
              </p>
            </div>

            {/* Payment Status */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <p className="text-slate-400 text-sm font-semibold">Payment Status</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <p className="text-white font-bold">All Set</p>
              </div>
              <p className="text-slate-500 text-xs mt-2">No payment issues</p>
            </div>
          </div>

          {/* Alerts */}
          {subscription.billing_status === 'past_due' && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Payment Past Due</p>
                  <p className="text-orange-300 text-sm mt-1">
                    Your payment failed. Please update your payment method to avoid service interruption.
                  </p>
                </div>
              </div>
            </div>
          )}

          {subscription.billing_status === 'cancelled' && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Subscription Cancelled</p>
                  <p className="text-red-300 text-sm mt-1">
                    Your subscription has been cancelled. You'll still have access until the end of your billing period.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manage Billing */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Manage Billing</h2>

          <div className="space-y-4">
            <Button
              onClick={() => window.location.href = 'https://billing.stripe.com/p/login/test'}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 text-base font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Update Payment Method
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => window.location.href = 'https://billing.stripe.com/p/login/test'}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 text-base font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View Invoices
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Upgrade to Guided Growth */}
        <div className="bg-gradient-to-r from-indigo-600/15 to-blue-600/15 border border-indigo-600/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Accelerate?</h2>
          <p className="text-slate-400 mb-6">
            Upgrade to Guided Growth for 1-on-1 strategy calls, a dedicated growth strategist, and advanced AI features.
          </p>
          <Button
            onClick={() => window.location.href = 'mailto:sales@newtechadvertising.com?subject=Upgrade to Guided Growth'}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2"
          >
            Explore Guided Growth
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Cancel Subscription */}
        {subscription.billing_status !== 'cancelled' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Cancel Subscription</h2>
            <p className="text-slate-400 mb-6">
              We'd be sad to see you go, but if you need to cancel, you can do it anytime. No questions asked.
            </p>
            <Button
              onClick={() => setShowCancelModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Cancel My Subscription
            </Button>
            <p className="text-slate-500 text-sm mt-4">
              You'll still have access through the end of your billing period.
            </p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h2>
            <p className="text-slate-400 mb-6">
              You'll still have access to your DIY Growth System through the end of your current billing period.
            </p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
              <p className="text-slate-300 text-sm">
                <span className="text-white font-semibold">Access until:</span> {subscription.next_renewal_date
                  ? new Date(subscription.next_renewal_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'TBD'}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-bold rounded-lg"
              >
                {isCanceling ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700 py-3 font-bold rounded-lg"
              >
                Keep My Subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}