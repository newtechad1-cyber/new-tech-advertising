import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, Eye, Edit2, Copy, Send, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-indigo-100 text-indigo-700',
  negotiation: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',
  expired: 'bg-slate-200 text-slate-700',
};

export default function ProposalsList() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Proposal.list('-created_date', 500);
    setProposals(data);
    setLoading(false);
  };

  const copyLink = (token) => {
    if (!token) { toast.error('Not yet sent'); return; }
    const url = `${window.location.origin}/proposal/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied');
  };

  const deleteProposal = async (id) => {
    if (!confirm('Delete this proposal?')) return;
    await base44.entities.Proposal.delete(id);
    setProposals(prev => prev.filter(p => p.id !== id));
    toast.success('Deleted');
  };

  const filtered = proposals.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const stats = {
    sent: proposals.filter(p => p.status !== 'draft').length,
    viewed: proposals.filter(p => p.status === 'viewed' || p.views > 0).length,
    accepted: proposals.filter(p => p.status === 'accepted' || p.status === 'won').length,
    avgValue: proposals.length > 0
      ? Math.round(proposals.reduce((s, p) => s + (p.estimated_value || 0), 0) / proposals.length)
      : 0,
  };

  const FILTERS = [
    { value: 'all', label: 'All Proposals' },
    { value: 'draft', label: 'Drafts' },
    { value: 'sent', label: 'Sent' },
    { value: 'viewed', label: 'Viewed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'won', label: 'Won' },
  ];

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Proposals</h1>
              <p className="text-sm text-slate-500">{proposals.length} total · {stats.sent} sent</p>
            </div>
            <Link to={createPageUrl('ProposalBuilder')}>
              <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4" />New Proposal
              </Button>
            </Link>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Sent', value: stats.sent },
                { label: 'Viewed', value: stats.viewed },
                { label: 'Accepted', value: stats.accepted },
                { label: 'Avg Value', value: stats.avgValue > 0 ? `$${(stats.avgValue / 1000).toFixed(1)}k` : '—' },
              ].map(s => (
                <Card key={s.label} className="p-4 bg-white border-0 shadow-sm">
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === f.value
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No proposals {filter !== 'all' ? 'in this status' : 'yet'}</p>
                <Link to={createPageUrl('ProposalBuilder')}>
                  <Button size="sm" className="mt-4 gap-1.5"><Plus className="w-3.5 h-3.5" />Create One</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 bg-white">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-600">Title</th>
                      <th className="text-left p-4 font-medium text-slate-600">Company</th>
                      <th className="text-left p-4 font-medium text-slate-600">Service</th>
                      <th className="text-left p-4 font-medium text-slate-600">Status</th>
                      <th className="text-left p-4 font-medium text-slate-600">Views</th>
                      <th className="text-left p-4 font-medium text-slate-600">Value</th>
                      <th className="text-left p-4 font-medium text-slate-600">Sent</th>
                      <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-900 max-w-xs truncate">{p.title}</td>
                        <td className="p-4 text-slate-600">{p.business_name || '—'}</td>
                        <td className="p-4 text-slate-600 text-xs">{(p.service_type || '').replace(/_/g, ' ')}</td>
                        <td className="p-4">
                          <Badge className={STATUS_COLORS[p.status] || 'bg-slate-100 text-slate-700'}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600">{p.views || 0}</td>
                        <td className="p-4 text-slate-600 font-semibold">
                          {p.estimated_value ? `$${p.estimated_value.toLocaleString()}` : '—'}
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          {p.sent_at ? format(new Date(p.sent_at), 'MMM d') : '—'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={createPageUrl(`ProposalBuilder?id=${p.id}`)}>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600">
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            {p.id && (
                              <Link to={createPageUrl(`ProposalPreview?id=${p.id}`)} target="_blank">
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600">
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-green-600"
                              onClick={() => copyLink(p.public_token)}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                              onClick={() => deleteProposal(p.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}