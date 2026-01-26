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
  const [checking, setChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    loadProposal();
  }, []);

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

  const handlePaymentClick = () => {
    if (proposal?.creative_payment_link) {
      window.open(proposal.creative_payment_link, '_blank');
      setShowHelper(true);
    }
  };

  const handleConfirmPayment = async () => {
    setChecking(true);
    setErrorMessage('');

    try {
      const response = await base44.functions.invoke('confirmCreativePayment', {
        proposal_id: proposal.id
      });

      if (response.data.confirmed) {
        // Payment confirmed, redirect to onboarding
        window.location.href = `${createPageUrl('StreamingOnboarding')}?proposal_id=${proposal.id}`;
      } else {
        setErrorMessage('Payment not confirmed yet. Please try again in a moment.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setErrorMessage('Unable to verify payment. Please try again.');
    } finally {
      setChecking(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
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

            {proposal.creative_payment_link && (
              <div className="space-y-4">
                <Button 
                  onClick={handlePaymentClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  size="lg"
                >
                  Complete Creative Payment
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>

                {showHelper && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-700 text-center">
                      After payment, return here and click "I've Paid"
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleConfirmPayment}
                  disabled={checking}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {checking ? (
                    'Checking payment...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      I've Paid
                    </>
                  )}
                </Button>

                {errorMessage && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-700 text-center">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!proposal.creative_payment_link && (
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