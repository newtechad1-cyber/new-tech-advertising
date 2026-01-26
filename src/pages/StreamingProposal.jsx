import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, DollarSign, Video } from 'lucide-react';

export default function StreamingProposal() {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    loadProposal();
  }, []);

  const loadProposal = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const proposalId = urlParams.get('id');

      if (!proposalId) {
        console.error('No proposal ID provided');
        return;
      }

      const proposals = await base44.entities.Proposal.filter({ id: proposalId });
      
      if (proposals.length > 0) {
        const loadedProposal = proposals[0];
        setProposal(loadedProposal);
        setSelectedOption(loadedProposal.creative_option || '');
      }
    } catch (error) {
      console.error('Error loading proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = async (option) => {
    setSelectedOption(option);
    setSaving(true);

    try {
      let creative_fee = 0;
      let creative_payment_status = 'pending';

      if (option === 'ai_assisted') {
        creative_fee = 195;
      } else if (option === 'hybrid') {
        creative_fee = 495;
      } else if (option === 'existing_video') {
        creative_fee = 0;
        creative_payment_status = 'not_required';
      }

      await base44.entities.Proposal.update(proposal.id, {
        creative_option: option,
        creative_fee: creative_fee,
        creative_payment_status: creative_payment_status
      });

      setProposal({
        ...proposal,
        creative_option: option,
        creative_fee: creative_fee,
        creative_payment_status: creative_payment_status
      });
    } catch (error) {
      console.error('Error updating proposal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleApproveProposal = async () => {
    try {
      await base44.entities.Proposal.update(proposal.id, {
        status: 'accepted',
        response_date: new Date().toISOString()
      });

      // Redirect based on payment status
      if (proposal.creative_payment_status === 'pending') {
        window.location.href = `/streaming/creative-payment?proposal_id=${proposal.id}`;
      } else if (proposal.creative_payment_status === 'not_required' || proposal.creative_payment_status === 'paid') {
        window.location.href = `/streaming-onboarding?proposal_id=${proposal.id}`;
      }
    } catch (error) {
      console.error('Error approving proposal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading proposal...</p>
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

  const creativeOptions = [
    {
      value: 'ai_assisted',
      title: 'AI-Assisted Commercial (Most Common)',
      price: 195,
      description: 'Quick turnaround using AI-powered video creation'
    },
    {
      value: 'hybrid',
      title: 'Hybrid Commercial',
      price: 495,
      description: 'Combination of AI and professional editing'
    },
    {
      value: 'existing_video',
      title: 'Already have a finished commercial',
      price: 0,
      description: 'Use your existing video creative'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Streaming TV Advertising Proposal</CardTitle>
                <Badge className="bg-blue-100 text-blue-700">
                  {proposal.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {proposal.budget_range && (
              <div className="flex items-center gap-2 text-slate-600 mb-3">
                <DollarSign className="w-4 h-4" />
                <span>Monthly Budget: {proposal.budget_range}</span>
              </div>
            )}
            {proposal.proposal_details && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {proposal.proposal_details}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Creative Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Commercial Creative (Required)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {creativeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${selectedOption === option.value 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'}
                  `}
                >
                  <input
                    type="radio"
                    name="creative_option"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    disabled={saving}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">
                        {option.title}
                      </span>
                      <span className="font-bold text-slate-900">
                        ${option.price}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                  {selectedOption === option.value && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>

            {selectedOption && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>One-time creative fee:</span>
                  <span className="text-blue-600">
                    ${proposal.creative_fee || 0}
                  </span>
                </div>
                <p className="text-sm text-slate-600 italic">
                  Note: This is not traditional TV production. No crews. No studios.
                </p>
              </div>
            )}

            {saving && (
              <p className="text-sm text-blue-600 text-center">Saving selection...</p>
            )}
          </CardContent>
        </Card>

        {/* Approval Button */}
        {selectedOption && proposal.status !== 'accepted' && (
          <Card>
            <CardContent className="py-6">
              <Button 
                onClick={handleApproveProposal}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Approve Proposal & Continue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}