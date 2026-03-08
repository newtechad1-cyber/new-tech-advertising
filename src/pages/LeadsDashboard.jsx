import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, Users, TrendingUp, Download, BookOpen, Loader2, Mail, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  consultation_scheduled: 'bg-orange-100 text-orange-700',
  proposal_sent: 'bg-indigo-100 text-indigo-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-slate-100 text-slate-500',
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'consultation_scheduled', label: 'Consultation Scheduled' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'won', label: 'Converted Client' },
  { value: 'lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  'funnel_page', 'blog_article', 'case_study', 'authority_guide', 'video_page', 'seo_page', 'website', 'referral', 'social_media', 'other'
];

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(null);

  // Support deep-link from Alert Center: ?lead_id=xxx
  const highlightLeadId = new URLSearchParams(window.location.search).get('lead_id');

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Lead.list('-created_date', 200);
      setLeads(data);
    } catch (err) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().then(() => {
      // If deep-linked from alert center, auto-select the lead
      if (highlightLeadId) {
        setLeads(prev => {
          const found = prev.find(l => l.id === highlightLeadId);
          if (found) setSelectedLead(found);
          return prev;
        });
      }
    });
  }, []);

  const updateStatus = async (lead, newStatus) => {
    await base44.entities.Lead.update(lead.id, { status: newStatus });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === lead.id) setSelectedLead(l => ({ ...l, status: newStatus }));
    toast.success('Status updated');
  };

  const sendFollowUp = async (lead, step) => {
    setSendingEmail(lead.id + '-' + step);
    try {
      const res = await base44.functions.invoke('sendLeadFollowUpEmail', { lead_id: lead.id, step });
      if (res.data?.success) {
        toast.success(`Email #${step} sent to ${lead.email}`);
        await load();
      } else {
        toast.error('Failed to send email');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSendingEmail(null);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Name', 'Business', 'Email', 'Phone', 'City', 'Source', 'Service', 'Status', 'Guide Downloaded', 'Trial Started', 'Date'],
      ...filteredLeads.map(l => [
        l.name, l.business_name, l.email, l.phone, l.city,
        l.source, l.funnel_service || l.service_interest, l.status,
        l.guide_downloaded ? 'Yes' : 'No',
        l.trial_started ? 'Yes' : 'No',
        new Date(l.created_date).toLocaleDateString()
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nta-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = !search || [l.name, l.business_name, l.email, l.city].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  // Stats
  const totalLeads = leads.length;
  const guidesDownloaded = leads.filter(l => l.guide_downloaded).length;
  const trialsStarted = leads.filter(l => l.trial_started).length;
  const consultationsBooked = leads.filter(l => l.status === 'consultation_scheduled').length;
  const converted = leads.filter(l => l.status === 'won').length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 pt-14 lg:pt-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 sticky top-14 lg:top-0 z-10">
          <Link to={createPageUrl('AdminDashboard')}>
            <Button variant="ghost" size="sm" className="gap-1 text-slate-500">← Admin Hub</Button>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700">Leads Dashboard</span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh</Button>
            <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-3.5 h-3.5 mr-1.5" />Export CSV</Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => window.open(createPageUrl('FunnelPage?service=streaming-tv-advertising'), '_blank')}>
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />View Funnel
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-blue-600' },
              { label: 'Guides Downloaded', value: guidesDownloaded, icon: BookOpen, color: 'text-purple-600' },
              { label: 'Trials Started', value: trialsStarted, icon: TrendingUp, color: 'text-green-600' },
              { label: 'Consultations', value: consultationsBooked, icon: Mail, color: 'text-orange-600' },
              { label: 'Converted', value: converted, icon: TrendingUp, color: 'text-emerald-600' },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="pt-4 pb-3 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* List */}
            <div className="flex-1 min-w-0">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search leads..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="All Sources" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {SOURCE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No leads found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLeads.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`w-full text-left bg-white border rounded-xl p-4 hover:border-blue-300 transition-all ${selectedLead?.id === lead.id ? 'border-blue-400 shadow-sm' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge className={`text-xs ${STATUS_COLORS[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                              {STATUS_OPTIONS.find(s => s.value === lead.status)?.label || lead.status}
                            </Badge>
                            {lead.guide_downloaded && <span className="text-xs text-purple-600 font-medium">📖 Guide</span>}
                            {lead.trial_started && <span className="text-xs text-green-600 font-medium">✅ Trial</span>}
                          </div>
                          <p className="font-semibold text-slate-900 truncate">{lead.business_name} — {lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.email} {lead.city ? `· ${lead.city}` : ''} · {new Date(lead.created_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{(lead.source || 'website').replace(/_/g, ' ')}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedLead && (
              <div className="w-full lg:w-80 shrink-0">
                <Card className="sticky top-24">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{selectedLead.business_name}</CardTitle>
                      <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
                    </div>
                    <p className="text-sm text-slate-500">{selectedLead.name}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="space-y-1.5">
                      {selectedLead.email && <p>✉️ <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a></p>}
                      {selectedLead.phone && <p>📞 {selectedLead.phone}</p>}
                      {selectedLead.city && <p>📍 {selectedLead.city}</p>}
                      {selectedLead.industry && <p>🏢 {selectedLead.industry}</p>}
                      {selectedLead.funnel_service && <p>🎯 Funnel: {selectedLead.funnel_service.replace(/-/g, ' ')}</p>}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Update Status</p>
                      <Select value={selectedLead.status} onValueChange={v => updateStatus(selectedLead, v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Send Follow-Up Email</p>
                      <div className="space-y-1.5">
                        {[1, 2, 3, 4].map(step => (
                          <Button
                            key={step}
                            size="sm"
                            variant={selectedLead.follow_up_sequence_step >= step ? 'outline' : 'default'}
                            className={`w-full text-xs justify-start ${selectedLead.follow_up_sequence_step >= step ? 'border-green-300 text-green-700' : ''}`}
                            onClick={() => sendFollowUp(selectedLead, step)}
                            disabled={!!sendingEmail}
                          >
                            {sendingEmail === selectedLead.id + '-' + step ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                            ) : selectedLead.follow_up_sequence_step >= step ? (
                              '✓ '
                            ) : (
                              `Email #${step}: `
                            )}
                            {['Welcome + Guide', 'Case Study', '3 Mistakes', 'Free Consultation'][step - 1]}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedLead.message && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</p>
                        <p className="text-xs text-slate-600 bg-slate-50 rounded p-2">{selectedLead.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}