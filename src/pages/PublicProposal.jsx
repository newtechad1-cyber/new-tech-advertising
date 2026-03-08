import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PublicProposalContent from '@/components/proposals/PublicProposalContent';

export default function PublicProposal() {
  const { public_token } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [public_token]);

  const load = async () => {
    try {
      const response = await fetch('/api/proposalActions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', token: public_token }),
      });
      const json = await response.json();
      if (json.success) {
        const data = json.proposal;
        const parsed = {
          ...data,
          deliverables: typeof data.deliverables === 'string' ? JSON.parse(data.deliverables) : data.deliverables || [],
          faq_items: typeof data.faq_items === 'string' ? JSON.parse(data.faq_items) : data.faq_items || [],
          testimonial_blocks: typeof data.testimonial_blocks === 'string' ? JSON.parse(data.testimonial_blocks) : data.testimonial_blocks || [],
          roi_inputs: typeof data.roi_inputs === 'string' ? JSON.parse(data.roi_inputs) : data.roi_inputs || {},
        };
        setProposal(parsed);

        // Track view
        await fetch('/api/proposalActions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view', token: public_token }),
        });
      } else {
        setError(json.error || 'Proposal not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Proposal Not Found</h1>
          <p className="text-slate-500">{error || 'This proposal may have been removed or expired.'}</p>
        </div>
      </div>
    );
  }

  return <PublicProposalContent proposal={proposal} isAdminPreview={false} />;
}