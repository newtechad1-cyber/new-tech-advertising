import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function DIYCheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          navigate('/');
          return;
        }

        // Fetch subscription
        const subs = await base44.entities.DIYSubscription.filter(
          { user_email: user.email, status: 'active' },
          '-created_date',
          1
        );

        if (subs.length > 0) {
          setSubscription(subs[0]);
        }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome to Your Growth System
          </h1>
          <p className="text-xl text-slate-400 mb-2">
            Your DIY Growth System is now active
          </p>
          <p className="text-slate-500">
            {subscription?.business_name && `${subscription.business_name} • `}
            $99/month • Cancel anytime
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Next 3 Steps</h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-600 text-white font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Complete Your Onboarding</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Tell us about your business, goals, and marketing challenges (takes 5 mins)
                </p>
                <Button
                  onClick={() => navigate('/client/diy-onboarding')}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2 px-4 rounded flex items-center gap-2 w-fit"
                >
                  Start Onboarding
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 pt-6 border-t border-slate-800">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Launch Your First Campaign</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Use the AI tools to create your first piece of content (article, social posts, or video)
                </p>
                <Button
                  onClick={() => navigate('/client/diy-dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded flex items-center gap-2 w-fit"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 pt-6 border-t border-slate-800">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Build Weekly Momentum</h3>
                <p className="text-slate-400 text-sm">
                  Follow your weekly marketing plan to stay consistent and build visibility
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included Reminder */}
        <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-600/20 rounded-xl p-6 mb-8">
          <h3 className="text-white font-bold mb-4">Your DIY Growth System Includes:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              AI Website Growth Tools
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              AI Video Creation Studio
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              Social Media Planner
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              Lead & ROI Tracker
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              Weekly Marketing Direction
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              Email Support
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Questions?</h3>
          <p className="text-slate-400 text-sm mb-4">
            We're here to help. Email us at <span className="text-white font-semibold">support@newtechadvertising.com</span> or click the chat button in your dashboard.
          </p>
          <a
            href="mailto:support@newtechadvertising.com"
            className="text-violet-400 hover:text-violet-300 font-semibold text-sm"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}