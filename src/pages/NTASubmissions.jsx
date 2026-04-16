import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Inbox, RefreshCw, Loader2, Search, Zap, Building2, Target, Archive, Eye } from 'lucide-react';
import { triggerTwinAgent } from '@/api/twinClient';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  new: 'bg-blue-900 text-blue-300',
  processing: 'bg-yellow-900 text-yellow-300',
  matched: 'bg-green-900 text-green-300',
  created: 'bg-emerald-900 text-emerald-300',
  failed: 'bg-red-900 text-red-300',
  spam: 'bg-slate-700 text-slate-400',
  archived: 'bg-slate-700 text-slate-500',
};

const WEBHOOK_COLORS = {
  pending: 'bg-slate-700 text-slate-400',
  sent: 'bg-blue-900 text-blue-300',
  success: 'bg-green-900 text-green-300',
  failed: 'bg-red-900 text-red-300',
  skipped: 'bg-slate-700 text-slate-400',
};

export default function NTASubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [webhookFilter, setWebhookFilter] = useState('all');
  const [viewSub, setViewSub] = useState(null);
  const [acting, setActing] = useState({});

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Submission.list('-created_date', 200);
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('webhook_status') === 'failed') setWebhookFilter('failed');
    if (params.get('unmatched') === 'true') setStatusFilter('new');
    load();
  }, []);

  const act = (id, key, fn) => {
    setActing(a => ({ ...a, [`${id}_${key}`]: true }));
    fn().finally(() => setActing(a => ({ ...a, [`${id}_${key}`]: false })));
  };

  const resendWebhook = async (sub) => {
    act(sub.id, 'webhook', async () => {
      const WEBHOOK = 'https://build.twin.so/triggers/66e7b5d6-5948-4eae-90e7-5b040999c124/webhook';
      await triggerTwinAgent(WEBHOOK, { submission_id: sub.id, ...sub });
      await base44.entities.Submission.update(sub.id, { webhook_status: 'sent' });
      toast.success('Webhook resent');
      load();
    });
  };

  const createCompany = async (sub) => {
    act(sub.id, 'company', async () => {
      const company = await base44.entities.NTACompany.create({
        company_name: sub.business_name || sub.name,
        website: sub.website,
        phone: sub.phone,
        email: sub.email,
        city: sub.city,
        state: sub.state,
        source: sub.source_system,
        lifecycle_stage: 'lead',
      });
      await base44.entities.Submission.update(sub.id, {
        matched_company_id: company.id,
        processing_status: 'created',
      });
      await base44.entities.NTAActivity.create({
        company_id: company.id,
        submission_id: sub.id,
        activity_type: 'company_created',
        title: `Company created from submission: ${sub.business_name || sub.name}`,
        source_system: 'nta_submissions',
      });
      toast.success('Company created');
      load();
    });
  };

  const markSpam = async (sub) => {
    act(sub.id, 'spam', async () => {
      await base44.entities.Submission.update(sub.id, { processing_status: 'spam' });
      toast.success('Marked as spam');
      load();
    });
  };

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || [s.business_name, s.name, s.email, s.phone].some(v => v?.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || s.processing_status === statusFilter;
    const matchSource = sourceFilter === 'all' || s.source_system === sourceFilter;
    const matchWebhook = webhookFilter === 'all' || s.webhook_status === webhookFilter;
    return matchSearch && matchStatus && matchSource && matchWebhook;
  });

  const sources = [...new Set(submissions.map(s => s.source_system).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Inbox className="w-5 h-5 text-blue-400" />Submissions</h1>
              <p className="text-slate-400 text-sm">{submissions.length} total · {submissions.filter(s => s.processing_status === 'new').length} new</p>
            </div>
          </div>
          <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
          </div>
          {[
            { label: 'Status', value: statusFilter, set: setStatusFilter, options: ['new','processing','matched','created','failed','spam','archived'] },
            { label: 'Source', value: sourceFilter, set: setSourceFilter, options: sources },
            { label: 'Webhook', value: webhookFilter, set: setWebhookFilter, options: ['pending','sent','success','failed','skipped'] },
          ].map(({ label, value, set, options }) => (
            <Select key={label} value={value} onValueChange={set}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-36">
                <SelectValue placeholder={`All ${label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {label}</SelectItem>
                {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
          <span className="text-slate-500 text-xs">{filtered.length} results</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No submissions match filters</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(s => (
              <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-white">{s.business_name || s.name || 'Unknown'}</p>
                      <Badge className={`${STATUS_COLORS[s.processing_status] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{s.processing_status}</Badge>
                      <Badge className={`${WEBHOOK_COLORS[s.webhook_status] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>webhook: {s.webhook_status}</Badge>
                    </div>
                    <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
                      <span>{s.submission_type}</span>
                      <span>{s.source_system}</span>
                      {s.email && <span>{s.email}</span>}
                      {s.phone && <span>{s.phone}</span>}
                      <span>{new Date(s.created_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => setViewSub(s)} className="h-7 text-xs text-slate-400 hover:text-white">
                      <Eye className="w-3 h-3 mr-1" />View
                    </Button>
                    {!s.matched_company_id && s.processing_status !== 'spam' && (
                      <Button size="sm" onClick={() => createCompany(s)} disabled={acting[`${s.id}_company`]}
                        className="bg-emerald-800 hover:bg-emerald-700 h-7 text-xs">
                        {acting[`${s.id}_company`] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Building2 className="w-3 h-3 mr-1" />}
                        Create Company
                      </Button>
                    )}
                    {s.webhook_status === 'failed' && (
                      <Button size="sm" onClick={() => resendWebhook(s)} disabled={acting[`${s.id}_webhook`]}
                        className="bg-blue-800 hover:bg-blue-700 h-7 text-xs">
                        {acting[`${s.id}_webhook`] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                        Resend
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => markSpam(s)} disabled={acting[`${s.id}_spam`]}
                      className="h-7 text-xs text-slate-500 hover:text-red-400">
                      <Archive className="w-3 h-3 mr-1" />Spam
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!viewSub} onOpenChange={() => setViewSub(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewSub?.business_name || viewSub?.name || 'Submission'}</DialogTitle>
          </DialogHeader>
          {viewSub && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Type', viewSub.submission_type], ['Source', viewSub.source_system],
                  ['Status', viewSub.processing_status], ['Webhook', viewSub.webhook_status],
                  ['Email', viewSub.email || '—'], ['Phone', viewSub.phone || '—'],
                  ['City', viewSub.city || '—'], ['State', viewSub.state || '—'],
                  ['Website', viewSub.website || '—'], ['Priority', viewSub.priority],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-800 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">{k}</p>
                    <p className="text-white mt-0.5 text-xs break-all">{String(v || '—')}</p>
                  </div>
                ))}
              </div>
              {viewSub.notes && (
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Notes</p>
                  <p className="text-slate-300 text-xs">{viewSub.notes}</p>
                </div>
              )}
              {viewSub.webhook_response && (
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Webhook Response</p>
                  <pre className="text-slate-300 text-xs whitespace-pre-wrap">{viewSub.webhook_response}</pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}