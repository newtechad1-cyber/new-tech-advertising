import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Mail, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function HotLeadsPanel() {
  const { data: scores = [], isLoading: scoresLoading } = useQuery({
    queryKey: ['hot-lead-scores'],
    queryFn: () => base44.entities.LeadScore.filter({ status: 'hot' }, '-score', 50)
  });

  const { data: allLeads = [] } = useQuery({
    queryKey: ['all-leads-mini'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200)
  });

  const leadsMap = Object.fromEntries(allLeads.map(l => [l.id, l]));

  const hotLeads = scores
    .map(s => ({ score: s, lead: leadsMap[s.lead_id] }))
    .filter(({ lead }) => !!lead);

  const sendEmail = async (lead) => {
    try {
      await base44.functions.invoke('sendLeadFollowUpEmail', { lead_id: lead.id, step: 1 });
      toast.success(`Follow-up sent to ${lead.email}`);
    } catch {
      toast.error('Failed to send email');
    }
  };

  if (scoresLoading) return <div className="p-8 text-center text-gray-400">Loading hot leads...</div>;

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center gap-2 p-4 border-b">
        <Flame className="w-4 h-4 text-red-500" />
        <h2 className="font-semibold text-gray-800">Hot Leads ({hotLeads.length})</h2>
      </div>

      <div className="divide-y">
        {hotLeads.map(({ score: ls, lead }) => (
          <div key={ls.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{lead.business_name}</p>
                  <Badge className="bg-red-100 text-red-700 text-xs">Score: {ls.score}</Badge>
                  {lead.status && (
                    <Badge variant="outline" className="text-xs">{lead.status.replace(/_/g, ' ')}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{lead.name} · {lead.city || 'N/A'}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Service: {lead.service_interest || lead.funnel_service || 'N/A'} ·
                  Last activity: {ls.last_activity ? formatDistanceToNow(new Date(ls.last_activity), { addSuffix: true }) : 'N/A'}
                </p>
              </div>
              <div className="flex gap-1.5">
                {lead.email && (
                  <Button size="sm" variant="outline" onClick={() => sendEmail(lead)}>
                    <Mail className="w-3.5 h-3.5 mr-1" /> Email
                  </Button>
                )}
                {lead.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${lead.phone}`}><Phone className="w-3.5 h-3.5 mr-1" /> Call</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {hotLeads.length === 0 && (
          <div className="p-10 text-center text-gray-400">No hot leads right now.</div>
        )}
      </div>
    </div>
  );
}