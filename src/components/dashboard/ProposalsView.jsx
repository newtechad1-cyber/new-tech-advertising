import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function ProposalsView() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const isAdmin = userData?.role === 'admin';
      
      // Fetch all proposals
      const allProposals = await base44.entities.Proposal.list('-created_date');
      
      // Filter based on user role
      let filteredProposals = allProposals;
      
      if (!isAdmin) {
        // Clients can only see proposals with status = "sent"
        filteredProposals = allProposals.filter(p => p.status === 'sent');
      }
      
      setProposals(filteredProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-slate-100 text-slate-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.draft;
  };

  const getServiceLabel = (service) => {
    const labels = {
      streaming_tv: 'Streaming TV',
      ada_rebuild: 'ADA Website Rebuild',
      other: 'Other Service'
    };
    return labels[service] || service;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600">Loading proposals...</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Proposals Yet</h3>
          <p className="text-slate-600">
            {user?.role === 'admin' 
              ? 'No proposals have been created yet.' 
              : 'You don\'t have any proposals at this time.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  {getServiceLabel(proposal.service)}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status}
                  </Badge>
                  {user?.role === 'admin' && proposal.status === 'draft' && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Not visible to client
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.budget_range && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget: {proposal.budget_range}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(proposal.created_date).toLocaleDateString()}</span>
              </div>

              {proposal.sent_date && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Sent: {new Date(proposal.sent_date).toLocaleDateString()}</span>
                </div>
              )}

              {proposal.proposal_details && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {proposal.proposal_details}
                  </p>
                </div>
              )}

              {proposal.service === 'streaming_tv' && proposal.status === 'sent' && (
                <div className="mt-4">
                  <Button
                    onClick={() => window.location.href = `${createPageUrl('StreamingProposal')}?id=${proposal.id}`}
                    className="w-full sm:w-auto"
                  >
                    View & Accept Proposal
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}