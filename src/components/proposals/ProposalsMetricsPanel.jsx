import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { FileText, Eye, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProposalsMetricsPanel() {
  const { data: proposals = [] } = useQuery({
    queryKey: ['proposals-metrics'],
    queryFn: () => base44.entities.Proposal.list('-created_date', 500),
    initialData: [],
  });

  const now = new Date();
  const thisWeek = proposals.filter(p => {
    const d = new Date(p.sent_at || p.created_date);
    return (now - d) < 7 * 86400000 && p.status !== 'draft';
  }).length;

  const viewedToday = proposals.filter(p => {
    if (!p.last_viewed_date) return false;
    const d = new Date(p.last_viewed_date);
    return d.toDateString() === now.toDateString();
  }).length;

  const acceptedThisMonth = proposals.filter(p => {
    if (p.status !== 'accepted' && p.status !== 'won') return false;
    const d = new Date(p.accepted_at || p.updated_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const awaitingResponse = proposals.filter(p => {
    return ['sent', 'viewed'].includes(p.status) && p.views > 0;
  }).length;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 text-sm">Proposals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link to={createPageUrl('ProposalsList')}>
          <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Sent This Week</p>
                <p className="text-xl font-bold text-slate-900">{thisWeek}</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to={createPageUrl('ProposalsList')}>
          <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Viewed Today</p>
                <p className="text-xl font-bold text-slate-900">{viewedToday}</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to={createPageUrl('ProposalsList')}>
          <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Accepted This Month</p>
                <p className="text-xl font-bold text-slate-900">{acceptedThisMonth}</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to={createPageUrl('ProposalsList')}>
          <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Awaiting Response</p>
                <p className="text-xl font-bold text-slate-900">{awaitingResponse}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}