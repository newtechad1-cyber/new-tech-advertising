import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PublicProposalContent from '@/components/proposals/PublicProposalContent';

export default function ProposalPreview() {
  const [params] = useSearchParams();
  const proposalId = params.get('id');
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [proposalId]);

  const load = async () => {
    if (!proposalId) return;
    try {
      const results = await base44.entities.Proposal.filter({ id: proposalId });
      if (results.length > 0) {
        const data = results[0];
        const parsed = {
          ...data,
          deliverables: data.deliverables ? JSON.parse(data.deliverables) : [],
          faq_items: data.faq_items ? JSON.parse(data.faq_items) : [],
          testimonial_blocks: data.testimonial_blocks ? JSON.parse(data.testimonial_blocks) : [],
          roi_inputs: data.roi_inputs ? JSON.parse(data.roi_inputs) : {},
        };
        setProposal(parsed);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!proposal) return <div className="flex items-center justify-center h-screen"><p>Proposal not found</p></div>;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <a href={`javascript:window.history.back()`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />← Back to Editor
            </a>
            <p className="text-sm text-slate-500">Admin Preview</p>
          </div>
        </div>
        <PublicProposalContent proposal={proposal} isAdminPreview={true} />
      </div>
    </AdminGuard>
  );
}