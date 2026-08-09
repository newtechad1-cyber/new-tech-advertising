import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StreamingOnboarding() {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposal();
  }, []);

  const loadProposal = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const proposalId = urlParams.get('proposal_id');

      if (proposalId) {
        const proposals = await base44.entities.Proposal.filter({ id: proposalId });
        if (proposals.length > 0) {
          setProposal(proposals[0]);
        }
      }
    } catch (error) {
      console.error('Error loading proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Streaming TV Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">
              Welcome! Your creative payment has been confirmed. We'll begin creating your commercial shortly.
            </p>
            {proposal && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  Proposal ID: {proposal.id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}