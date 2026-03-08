import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, ExternalLink, RefreshCw } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-slate-100 text-slate-500'
};

export default function ProposalTracker() {
  const qc = useQueryClient();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals-tracker'],
    queryFn: () => base44.entities.Proposal.list('-created_date', 50)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Proposal.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals-tracker'] });
      toast.success('Proposal updated');
    }
  });

  const recordView = (proposal) => {
    base44.functions.invoke('onProposalViewed', { proposal_id: proposal.id }).then(() => {
      qc.invalidateQueries({ queryKey: ['proposals-tracker'] });
      toast.success('View recorded');
    });
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading proposals...</div>;

  const active = proposals.filter(p => !['rejected', 'expired'].includes(p.status));
  const archived = proposals.filter(p => ['rejected', 'expired'].includes(p.status));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border">
        <div className="flex items-center gap-2 p-4 border-b">
          <FileText className="w-4 h-4 text-blue-500" />
          <h2 className="font-semibold text-gray-800">Active Proposals ({active.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3">Proposal</th>
                <th className="text-left px-4 py-3">Service</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Views</th>
                <th className="text-left px-4 py-3">Sent</th>
                <th className="text-left px-4 py-3">Last Viewed</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {active.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{p.title}</p>
                    {p.business_name && <p className="text-xs text-gray-400">{p.business_name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{p.service_type?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${STATUS_STYLES[p.status]}`}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <span className={`font-medium ${(p.views || 0) >= 2 ? 'text-orange-600' : 'text-gray-700'}`}>
                        {p.views || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {p.sent_at ? format(new Date(p.sent_at), 'MMM d') : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {p.last_viewed_date
                      ? formatDistanceToNow(new Date(p.last_viewed_date), { addSuffix: true })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.proposal_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={p.proposal_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => recordView(p)} title="Record a view">
                        <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {active.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">No active proposals.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}