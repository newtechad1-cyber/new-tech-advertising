import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Loader2, Sparkles, Send, Eye, Copy, Pencil, FileText, Globe, Share2, ShieldCheck, MonitorPlay } from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: 'website_new', label: 'New Website', icon: Globe, color: 'text-orange-400' },
  { value: 'website_rebuild', label: 'Website Rebuild', icon: Globe, color: 'text-orange-400' },
  { value: 'social_diy', label: 'Social Media DIY', icon: Share2, color: 'text-pink-400' },
  { value: 'social_dfy', label: 'Social Media DFY', icon: Share2, color: 'text-pink-400' },
  { value: 'ada_compliance', label: 'ADA Compliance', icon: ShieldCheck, color: 'text-blue-400' },
  { value: 'streaming_tv', label: 'Streaming TV Ads', icon: MonitorPlay, color: 'text-purple-400' },
];

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  sent: 'bg-blue-900 text-blue-300',
  viewed: 'bg-yellow-900 text-yellow-300',
  accepted: 'bg-green-900 text-green-300',
  declined: 'bg-red-900 text-red-300',
};

export default function ProposalManager() {
  const [proposals, setProposals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [viewProposal, setViewProposal] = useState(null);
  const [form, setForm] = useState({
    lead_id: '', service_type: 'website_rebuild',
    business_name: '', contact_name: '', contact_email: '',
    setup_fee: '', monthly_fee: '', notes: ''
  });

  useEffect(() => {
    Promise.all([
      base44.entities.ServiceProposal.list('-created_date', 100),
      base44.entities.Lead.list('-created_date', 200)
    ]).then(([p, l]) => {
      setProposals(p);
      setLeads(l);
      setLoading(false);
    });
  }, []);

  const handleLeadSelect = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setForm(f => ({
        ...f,
        lead_id: leadId,
        business_name: lead.business_name || '',
        contact_name: lead.name || '',
        contact_email: lead.email || ''
      }));
    }
  };

  const generateProposal = async () => {
    if (!form.service_type || !form.business_name) { toast.error('Service type and business name required'); return; }
    setGenerating(true);
    const lead = leads.find(l => l.id === form.lead_id);
    const serviceLabel = SERVICE_OPTIONS.find(s => s.value === form.service_type)?.label;

    const prompt = `You are a professional marketing agency proposal writer for New Tech Advertising.

Write a compelling, professional proposal for a ${serviceLabel} service.

Business: ${form.business_name}
Contact: ${form.contact_name}
Industry: ${lead?.industry || 'local business'}
Location: ${lead?.city ? `${lead.city}, ${lead.state}` : 'Midwest'}
Website: ${lead?.website || 'N/A'}
Special Notes: ${form.notes || 'None'}

Write a proposal that includes:
1. **Executive Summary** - Brief overview of the opportunity
2. **Our Understanding of Your Needs** - Tailored to their business
3. **Proposed Solution** - Detailed description of the ${serviceLabel} service
4. **What's Included** - Bullet list of deliverables
5. **Timeline** - Realistic project timeline
6. **Investment** - Professional pricing narrative (do not use specific numbers, say "See pricing summary below")
7. **Why New Tech Advertising** - 3-4 compelling differentiators
8. **Next Steps** - Clear call to action

Write in a professional but friendly tone. Use markdown formatting. Keep it to 600-800 words.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });

    const payload = {
      ...form,
      setup_fee: form.setup_fee ? parseFloat(form.setup_fee) : null,
      monthly_fee: form.monthly_fee ? parseFloat(form.monthly_fee) : null,
      proposal_content: result,
      pricing_summary: form.setup_fee || form.monthly_fee
        ? `Setup: $${form.setup_fee || 0} | Monthly: $${form.monthly_fee || 0}/mo`
        : 'Custom pricing — see proposal',
      status: 'draft'
    };

    const saved = await base44.entities.ServiceProposal.create(payload);
    setProposals(prev => [saved, ...prev]);

    if (form.lead_id) {
      await base44.entities.Lead.update(form.lead_id, { status: 'proposal_sent' });
    }

    setGenerating(false);
    setShowCreate(false);
    setViewProposal(saved);
    toast.success('Proposal generated!');
  };

  const updateStatus = async (id, status) => {
    await base44.entities.ServiceProposal.update(id, { status });
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    if (viewProposal?.id === id) setViewProposal(prev => ({ ...prev, status }));
    toast.success(`Status updated to ${status}`);
  };

  const copyProposal = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const serviceIcon = (type) => {
    const s = SERVICE_OPTIONS.find(o => o.value === type);
    if (!s) return null;
    const Icon = s.icon;
    return <Icon className={`w-3 h-3 ${s.color}`} />;
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold text-lg">Proposals</h2>
          <p className="text-slate-400 text-sm">{proposals.length} proposals total</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-blue-700 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" /> New Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {['draft','sent','viewed','accepted','declined'].map(s => (
          <div key={s} className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{proposals.filter(p => p.status === s).length}</p>
            <p className="text-slate-500 text-xs mt-0.5 capitalize">{s}</p>
          </div>
        ))}
      </div>

      {/* Proposals list */}
      {proposals.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FileText className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p>No proposals yet. Generate your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map(p => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {serviceIcon(p.service_type)}
                      <p className="font-semibold text-white">{p.business_name}</p>
                    </div>
                    <Badge className={`${STATUS_COLORS[p.status]} border-0 text-xs capitalize`}>{p.status}</Badge>
                    <span className="text-slate-500 text-xs">{SERVICE_OPTIONS.find(s => s.value === p.service_type)?.label}</span>
                  </div>
                  {p.contact_name && <p className="text-slate-400 text-sm mt-0.5">{p.contact_name} · {p.contact_email}</p>}
                  {p.pricing_summary && <p className="text-emerald-400 text-xs mt-1">{p.pricing_summary}</p>}
                  <p className="text-slate-600 text-xs mt-1">{new Date(p.created_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => setViewProposal(p)} className="text-slate-300 hover:text-white h-8 text-xs">
                    <Eye className="w-3 h-3 mr-1.5" />View
                  </Button>
                  <Select value={p.status} onValueChange={v => updateStatus(p.id, v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white h-8 text-xs w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['draft','sent','viewed','accepted','declined'].map(s => <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Proposal Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-400" />Generate Proposal</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Link to Lead (optional)</label>
              <Select value={form.lead_id} onValueChange={handleLeadSelect}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select a lead..." /></SelectTrigger>
                <SelectContent>
                  {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.business_name} — {l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Service Type *</label>
              <Select value={form.service_type} onValueChange={v => setForm(f => ({...f, service_type: v}))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Business Name *</label>
                <Input value={form.business_name} onChange={e => setForm(f => ({...f, business_name: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Contact Name</label>
                <Input value={form.contact_name} onChange={e => setForm(f => ({...f, contact_name: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Setup Fee ($)</label>
                <Input type="number" value={form.setup_fee} onChange={e => setForm(f => ({...f, setup_fee: e.target.value}))} placeholder="999" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Monthly Fee ($)</label>
                <Input type="number" value={form.monthly_fee} onChange={e => setForm(f => ({...f, monthly_fee: e.target.value}))} placeholder="299" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Special Notes for AI (optional)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2} placeholder="Any special context, pain points, or details to include..." className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={generateProposal} disabled={generating} className="bg-blue-700 hover:bg-blue-600 flex-1">
                {generating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate with AI</>}
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Proposal Dialog */}
      <Dialog open={!!viewProposal} onOpenChange={() => setViewProposal(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewProposal?.business_name} — {SERVICE_OPTIONS.find(s => s.value === viewProposal?.service_type)?.label}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copyProposal(viewProposal?.proposal_content)} className="text-xs border-slate-700 text-slate-300 h-8">
                  <Copy className="w-3 h-3 mr-1.5" />Copy
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {viewProposal && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`${STATUS_COLORS[viewProposal.status]} border-0 capitalize`}>{viewProposal.status}</Badge>
                {viewProposal.pricing_summary && <span className="text-emerald-400 text-sm font-medium">{viewProposal.pricing_summary}</span>}
                <Select value={viewProposal.status} onValueChange={v => updateStatus(viewProposal.id, v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['draft','sent','viewed','accepted','declined'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 prose prose-invert prose-sm max-w-none">
                {viewProposal.proposal_content?.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-white font-bold text-lg mt-4 mb-2">{line.replace('## ','')}</h2>;
                  if (line.startsWith('# ')) return <h1 key={i} className="text-white font-bold text-xl mt-4 mb-2">{line.replace('# ','')}</h1>;
                  if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-semibold mt-3">{line.replace(/\*\*/g,'')}</p>;
                  if (line.startsWith('- ') || line.startsWith('• ')) return <p key={i} className="text-slate-300 text-sm ml-4">• {line.replace(/^[-•] /,'')}</p>;
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}