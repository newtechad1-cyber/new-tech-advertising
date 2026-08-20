import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, DollarSign, Video } from 'lucide-react';

export default function StreamingProposal() {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    loadProposal();
  }, []);

  const loadProposal = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const proposalId = urlParams.get('proposal_id') || urlParams.get('id');

      if (!proposalId) {
        setProposal('missing');
        setLoading(false);
        return;
      }

      const proposals = await base44.entities.Proposal.filter({ id: proposalId });
      
      if (proposals.length > 0) {
        const loadedProposal = proposals[0];
        setProposal(loadedProposal);
        setSelectedOption(loadedProposal.creative_option || '');
      } else {
        await base44.asServiceRole.entities.ActivityLog.create({
          event_type: 'error',
          summary: 'Proposal not found',
          metadata: {
            proposalId,
            page: '/streaming-proposal'
          }
        });
        setProposal(null);
      }
    } catch (error) {
      console.error('Error loading proposal:', error);
      setProposal(null);
    } finally {
      setLoading(false);
    }
  };

  // This legacy public route is intentionally read-only. Proposal approval,
  // creative selection, and payment state must be established by the signed
  // payment workflow or the token-protected public proposal flow.
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading proposal...</p>
      </div>
    );
  }

  if (proposal === 'missing') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">Missing proposal_id. Please use the link from your confirmation email.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center space-y-2">
            <p className="text-slate-600">Proposal not found. Please contact 641-420-8816.</p>
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
              Commercial Creative (Reference)
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
                    disabled
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

          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-5 text-sm text-amber-900">
            This legacy proposal view is read-only. To approve or continue, use the
            secure proposal link from New Tech Advertising or contact our team at
            641-420-8816.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}