import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Save, Eye, Copy, Send } from 'lucide-react';
import { toast } from 'sonner';
import DeliverablesEditor from '@/components/proposals/builder/DeliverablesEditor';
import FAQEditor from '@/components/proposals/builder/FAQEditor';
import ROIEditor from '@/components/proposals/builder/ROIEditor';
import TestimonialsEditor from '@/components/proposals/builder/TestimonialsEditor';
import { createPageUrl } from '@/utils';

const SECTIONS = [
  { id: 'basic', label: '1. Basic Info', emoji: '📋' },
  { id: 'summary', label: '2. Executive Summary', emoji: '📄' },
  { id: 'problem', label: '3. Problem', emoji: '⚠️' },
  { id: 'solution', label: '4. Solution', emoji: '💡' },
  { id: 'deliverables', label: '5. Deliverables', emoji: '✅' },
  { id: 'timeline', label: '6. Timeline', emoji: '⏱️' },
  { id: 'pricing', label: '7. Pricing', emoji: '💰' },
  { id: 'roi', label: '8. ROI Projection', emoji: '📈' },
  { id: 'testimonials', label: '9. Social Proof', emoji: '⭐' },
  { id: 'faq', label: '10. FAQ', emoji: '❓' },
  { id: 'video', label: '11. Video', emoji: '🎬' },
  { id: 'acceptance', label: '12. Acceptance', emoji: '🎯' },
];

const SERVICE_TYPES = [
  'diy_saas', 'dfy_managed', 'ada_rebuild', 'streaming_tv',
  'video_production', 'local_seo', 'social_media', 'other'
];

export default function ProposalBuilder() {
  const [params] = useSearchParams();
  const proposalId = params.get('id');
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(!!proposalId);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [companies, setCompanies] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    load();
  }, [proposalId]);

  const load = async () => {
    try {
      const [comps, leads_data] = await Promise.all([
        base44.entities.Company?.list?.('-updated_date', 100) || [],
        base44.entities.Lead?.list?.('-updated_date', 100) || [],
      ]);
      setCompanies(comps || []);
      setLeads(leads_data || []);

      if (proposalId) {
        const p = await base44.entities.Proposal.filter({ id: proposalId });
        if (p.length > 0) {
          const data = p[0];
          const parsed = {
            ...data,
            deliverables: data.deliverables ? JSON.parse(data.deliverables) : [],
            faq_items: data.faq_items ? JSON.parse(data.faq_items) : [],
            testimonial_blocks: data.testimonial_blocks ? JSON.parse(data.testimonial_blocks) : [],
            roi_inputs: data.roi_inputs ? JSON.parse(data.roi_inputs) : {},
          };
          setProposal(parsed);
        }
      } else {
        setProposal({
          title: '', business_name: '', company_id: '', lead_id: '', service_type: 'other',
          assigned_admin_user_id: '', status: 'draft', pipeline_stage: 'lead',
          executive_summary: '', problem_summary: '', solution_summary: '',
          deliverables: [], timeline_summary: '', pricing_summary: '',
          faq_items: [], testimonial_blocks: [], roi_inputs: {}, roi_projection_summary: '',
          proposal_video_url: '', cta_text: 'Approve This Proposal', acceptance_terms: '',
          monthly_fee: 0, one_time_fee: 0, estimated_value: 0, contract_term: 'month_to_month',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => {
    setProposal(prev => ({ ...prev, [field]: value }));
  };

  const save = async (mark_sent = false) => {
    if (!proposal.title) { toast.error('Proposal title required'); return; }
    setSaving(true);
    try {
      const data = {
        ...proposal,
        deliverables: JSON.stringify(proposal.deliverables || []),
        faq_items: JSON.stringify(proposal.faq_items || []),
        testimonial_blocks: JSON.stringify(proposal.testimonial_blocks || []),
        roi_inputs: JSON.stringify(proposal.roi_inputs || {}),
      };
      delete data.id;
      delete data.created_date;
      delete data.updated_date;

      if (mark_sent && !proposal.public_token) {
        data.public_token = 'token_' + Math.random().toString(36).substr(2, 12);
        data.status = 'sent';
        data.pipeline_stage = 'proposal_sent';
        data.sent_at = new Date().toISOString();
      }

      if (proposalId) {
        await base44.entities.Proposal.update(proposalId, data);
        toast.success('Proposal updated');
      } else {
        const created = await base44.entities.Proposal.create(data);
        toast.success('Proposal created');
        window.location.href = createPageUrl(`ProposalBuilder?id=${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (!proposal.public_token) { toast.error('Save and send first'); return; }
    const url = `${window.location.origin}/proposal/${proposal.public_token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!proposal) return null;

  return (
    <AdminGuard>
      <div className="flex h-screen bg-slate-100">
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">Proposal Sections</h2>
            <p className="text-xs text-slate-500">{proposal.title || 'Untitled Proposal'}</p>
          </div>
          <div className="p-3 space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === s.id
                    ? 'bg-violet-600 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="mr-2">{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">{SECTIONS.find(s => s.id === activeTab)?.label}</h1>
            <div className="flex gap-2">
              {proposalId && (
                <>
                  <Button size="sm" variant="outline" onClick={copyLink} className="gap-1.5">
                    <Copy className="w-3.5 h-3.5" />Copy Link
                  </Button>
                  <a href={createPageUrl(`ProposalPreview?id=${proposalId}`)} target="_blank">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Eye className="w-3.5 h-3.5" />Preview
                    </Button>
                  </a>
                </>
              )}
              <Button size="sm" onClick={() => save()} disabled={saving} className="gap-1.5">
                <Save className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save'}
              </Button>
              {proposal.status === 'draft' && proposalId && (
                <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => save(true)} disabled={saving}>
                  <Send className="w-3.5 h-3.5" />Send Proposal
                </Button>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {/* BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Proposal Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">Proposal Title *</label>
                          <Input value={proposal.title} onChange={e => update('title', e.target.value)} placeholder="e.g., Streaming TV Campaign" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">Business Name</label>
                          <Input value={proposal.business_name} onChange={e => update('business_name', e.target.value)} placeholder="Client business" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">Service Type</label>
                          <select value={proposal.service_type} onChange={e => update('service_type', e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white">
                            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">Contract Term</label>
                          <select value={proposal.contract_term || 'month_to_month'} onChange={e => update('contract_term', e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white">
                            {['month_to_month', '6_months', '12_months', '24_months'].map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">One-Time Fee ($)</label>
                          <Input type="number" value={proposal.one_time_fee} onChange={e => update('one_time_fee', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">Monthly Fee ($)</label>
                          <Input type="number" value={proposal.monthly_fee} onChange={e => update('monthly_fee', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-600 mb-1 block">Est. Total Value ($)</label>
                          <Input type="number" value={proposal.estimated_value} onChange={e => update('estimated_value', parseFloat(e.target.value) || 0)} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* SUMMARY */}
              {activeTab === 'summary' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Executive Summary</h3>
                  <Textarea value={proposal.executive_summary} onChange={e => update('executive_summary', e.target.value)} placeholder="Brief overview of the offer..." rows={6} className="resize-none" />
                </Card>
              )}

              {/* PROBLEM */}
              {activeTab === 'problem' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Problem Statement</h3>
                  <Textarea value={proposal.problem_summary} onChange={e => update('problem_summary', e.target.value)} placeholder="What challenge are they facing..." rows={6} className="resize-none" />
                </Card>
              )}

              {/* SOLUTION */}
              {activeTab === 'solution' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Solution Summary</h3>
                  <Textarea value={proposal.solution_summary} onChange={e => update('solution_summary', e.target.value)} placeholder="How you're solving it..." rows={6} className="resize-none" />
                </Card>
              )}

              {/* DELIVERABLES */}
              {activeTab === 'deliverables' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">What's Included</h3>
                  <DeliverablesEditor value={proposal.deliverables} onChange={v => update('deliverables', v)} />
                </Card>
              )}

              {/* TIMELINE */}
              {activeTab === 'timeline' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Timeline & Phases</h3>
                  <Textarea value={proposal.timeline_summary} onChange={e => update('timeline_summary', e.target.value)} placeholder="Phase 1: Discovery...\nPhase 2: Implementation...\nPhase 3: Launch..." rows={6} className="resize-none" />
                </Card>
              )}

              {/* PRICING */}
              {activeTab === 'pricing' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Pricing Summary</h3>
                  <Textarea value={proposal.pricing_summary} onChange={e => update('pricing_summary', e.target.value)} placeholder="Pricing details, payment schedule, etc..." rows={6} className="resize-none" />
                </Card>
              )}

              {/* ROI */}
              {activeTab === 'roi' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">ROI Projection</h3>
                  <ROIEditor
                    value={proposal.roi_inputs}
                    onChange={v => update('roi_inputs', v)}
                    summary={proposal.roi_projection_summary}
                    onSummaryChange={v => update('roi_projection_summary', v)}
                  />
                </Card>
              )}

              {/* TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Social Proof & Testimonials</h3>
                  <TestimonialsEditor value={proposal.testimonial_blocks} onChange={v => update('testimonial_blocks', v)} />
                </Card>
              )}

              {/* VIDEO */}
              {activeTab === 'video' && (
                <Card className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Video Explainer</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Video URL (YouTube, Vimeo, etc)</label>
                      <Input value={proposal.proposal_video_url} onChange={e => update('proposal_video_url', e.target.value)} placeholder="https://youtube.com/..." />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Thumbnail URL (optional)</label>
                      <Input value={proposal.proposal_thumbnail_url} onChange={e => update('proposal_thumbnail_url', e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </Card>
              )}

              {/* ACCEPTANCE */}
              {activeTab === 'acceptance' && (
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Acceptance Section</h3>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">CTA Button Text</label>
                    <Input value={proposal.cta_text} onChange={e => update('cta_text', e.target.value)} placeholder="Approve This Proposal" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Acceptance Terms (optional)</label>
                    <Textarea value={proposal.acceptance_terms} onChange={e => update('acceptance_terms', e.target.value)} placeholder="By clicking approve, you agree to..." rows={4} className="resize-none" />
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}