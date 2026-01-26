import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CheckCircle2, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function StreamingCreativePayment() {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadProposal();
  }, []);

  useEffect(() => {
    handleReturnFromStripe();
  }, [proposal]);

  const loadProposal = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const proposalId = urlParams.get('proposal_id');

      if (!proposalId) {
        console.error('No proposal_id provided');
        return;
      }

      const proposals = await base44.entities.Proposal.filter({ id: proposalId });
      
      if (proposals.length > 0) {
        const loadedProposal = proposals[0];
        setProposal(loadedProposal);

        // Redirect if payment already done or not required
        if (loadedProposal.creative_payment_status === 'paid' || 
            loadedProposal.creative_payment_status === 'not_required') {
          window.location.href = `${createPageUrl('StreamingOnboarding')}?proposal_id=${proposalId}`;
        }
      }
    } catch (error) {
      console.error('Error loading proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnFromStripe = async () => {
    if (!proposal) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paid = urlParams.get('paid');

    if (paid === '1' && proposal.creative_payment_status !== 'paid') {
      try {
        await base44.entities.Proposal.update(proposal.id, {
          creative_payment_status: 'paid',
          creative_paid_at: new Date().toISOString()
        });

        await base44.asServiceRole.entities.ActivityLog.create({
          event_type: 'creative_paid',
          summary: 'Creative payment completed via Stripe link',
          metadata: {
            proposal_id: proposal.id,
            creative_option: proposal.creative_option,
            creative_fee: proposal.creative_fee
          },
          user_email: proposal.created_by || 'system'
        });

        setShowConfirmation(true);
        setProposal({
          ...proposal,
          creative_payment_status: 'paid',
          creative_paid_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }
  };

  const handlePaymentClick = () => {
    if (proposal?.creative_payment_link) {
      window.open(proposal.creative_payment_link, '_blank');
    }
  };

  const handleContinueToOnboarding = () => {
    window.location.href = `${createPageUrl('StreamingOnboarding')}?proposal_id=${proposal.id}`;
  };

  const getCreativeOptionLabel = (option) => {
    const labels = {
      ai_assisted: 'AI-Assisted Commercial',
      hybrid: 'Hybrid Commercial',
      existing_video: 'Existing Video'
    };
    return labels[option] || option;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">Proposal not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaidOrNotRequired = proposal.creative_payment_status === 'paid' || 
                              proposal.creative_payment_status === 'not_required';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {showConfirmation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">Payment received</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Next Step: Commercial Creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700">
              To begin creating your commercial, please complete the one-time creative payment below.
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Selected Creative Option:</span>
                <Badge className="bg-blue-600 text-white">
                  {getCreativeOptionLabel(proposal.creative_option)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xl font-bold">
                <span className="text-slate-900">Creative Fee:</span>
                <span className="text-blue-600 flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {proposal.creative_fee}
                </span>
              </div>
            </div>

            {!isPaidOrNotRequired && proposal.creative_payment_link && (
              <Button 
                onClick={handlePaymentClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                size="lg"
              >
                {proposal.creative_fee === 195 ? 'Pay $195 (Secure)' : 
                 proposal.creative_fee === 495 ? 'Pay $495 (Secure)' : 
                 'Complete Payment (Secure)'}
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            )}

            {isPaidOrNotRequired && (
              <Button 
                onClick={handleContinueToOnboarding}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                size="lg"
              >
                Continue to Onboarding
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </Button>
            )}

            {!proposal.creative_payment_link && !isPaidOrNotRequired && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 text-center">
                  Payment link not yet available. Please contact support.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}