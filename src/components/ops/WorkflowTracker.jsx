import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Plus, Loader2, CheckCircle2, Circle, Clock, AlertCircle,
  Globe, Share2, ShieldCheck, MonitorPlay, ChevronDown, ChevronRight, User
} from 'lucide-react';

const SERVICE_CONFIGS = {
  website_new: {
    label: 'New Website', icon: Globe, color: 'text-orange-400', bg: 'bg-orange-900/30',
    steps: [
      { id: 'intake', label: 'Intake Form Received' },
      { id: 'discovery', label: 'Discovery Call Scheduled' },
      { id: 'proposal_approved', label: 'Proposal Approved & Paid' },
      { id: 'content_gather', label: 'Content & Assets Gathered' },
      { id: 'design', label: 'Design Mockup Sent' },
      { id: 'design_approved', label: 'Design Approved' },
      { id: 'development', label: 'Development In Progress' },
      { id: 'review', label: 'Client Review / Revisions' },
      { id: 'launch', label: 'Site Launched' },
      { id: 'handoff', label: 'Handoff & Training Complete' },
    ]
  },
  website_rebuild: {
    label: 'Website Rebuild', icon: Globe, color: 'text-orange-400', bg: 'bg-orange-900/30',
    steps: [
      { id: 'intake', label: 'Intake Form Received' },
      { id: 'audit', label: 'Current Site Audited' },
      { id: 'proposal_approved', label: 'Proposal Approved & Paid' },
      { id: 'content_gather', label: 'Content & Assets Gathered' },
      { id: 'rebuild', label: 'Rebuild In Progress' },
      { id: 'review', label: 'Client Review' },
      { id: 'launch', label: 'New Site Launched' },
    ]
  },
  social_diy: {
    label: 'Social Media DIY', icon: Share2, color: 'text-pink-400', bg: 'bg-pink-900/30',
    steps: [
      { id: 'signup', label: 'Account Created' },
      { id: 'onboarding', label: 'Onboarding Call Completed' },
      { id: 'brand_dna', label: 'Brand DNA Completed' },
      { id: 'tools_setup', label: 'DIY Tools & Templates Provided' },
      { id: 'training', label: 'Training Session Done' },
      { id: 'active', label: 'Client Publishing Independently' },
    ]
  },
  social_dfy: {
    label: 'Social Media DFY', icon: Share2, color: 'text-pink-400', bg: 'bg-pink-900/30',
    steps: [
      { id: 'intake', label: 'Intake & Brand DNA Received' },
      { id: 'strategy', label: 'Content Strategy Created' },
      { id: 'first_batch', label: 'First Content Batch Approved' },
      { id: 'accounts_connected', label: 'Social Accounts Connected' },
      { id: 'scheduled', label: 'First Month Scheduled' },
      { id: 'active', label: 'Ongoing Fulfillment Active' },
    ]
  },
  ada_compliance: {
    label: 'ADA Compliance', icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-900/30',
    steps: [
      { id: 'intake', label: 'Intake Form Received' },
      { id: 'audit', label: 'Accessibility Audit Complete' },
      { id: 'proposal_approved', label: 'Proposal Approved & Paid' },
      { id: 'remediation', label: 'Remediation In Progress' },
      { id: 'testing', label: 'Accessibility Testing Done' },
      { id: 'report', label: 'Compliance Report Delivered' },
      { id: 'monitoring', label: 'Ongoing Monitoring Active' },
    ]
  },
  streaming_tv: {
    label: 'Streaming TV Ads', icon: MonitorPlay, color: 'text-purple-400', bg: 'bg-purple-900/30',
    steps: [
      { id: 'intake', label: 'Intake Form Received' },
      { id: 'discovery', label: 'Campaign Brief Confirmed' },
      { id: 'proposal_approved', label: 'Proposal Approved & Paid' },
      { id: 'creative_brief', label: 'Creative Brief Approved' },
      { id: 'production', label: 'Ad Production In Progress' },
      { id: 'review', label: 'Client Ad Review' },
      { id: 'launch', label: 'Campaign Launched' },
      { id: 'reporting', label: 'Reporting Active' },
    ]
  }
};

const STAGE_COLORS = {
  intake: 'bg-slate-700 text-slate-300',
  proposal: 'bg-blue-900 text-blue-300',
  onboarding: 'bg-yellow-900 text-yellow-300',
  in_progress: 'bg-indigo-900 text-indigo-300',
  review: 'bg-purple-900 text-purple-300',
  delivered: 'bg-teal-900 text-teal-300',
  complete: 'bg-green-900 text-green-300',
};

function WorkflowCard({ workflow, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SERVICE_CONFIGS[workflow.service_type];
  if (!cfg) return null;
  const Icon = cfg.icon;
  const steps = workflow.steps || cfg.steps.map(s => ({ ...s, status: 'pending' }));
  const completedCount = steps.filter(s => s.status === 'complete').length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const toggleStep = async (stepId) => {
    const updatedSteps = steps.map(s => {
      if (s.id === stepId) {
        const newStatus = s.status === 'complete' ? 'pending' : 'complete';
        return { ...s, status: newStatus, completed_at: newStatus === 'complete' ? new Date().toISOString() : null };
      }
      return s;
    });
    const allDone = updatedSteps.every(s => s.status === 'complete');
    const newStage = allDone ? 'complete' : workflow.stage;
    await base44.entities.ServiceWorkflow.update(workflow.id, { steps: updatedSteps, stage: newStage });
    onUpdate(workflow.id, { steps: updatedSteps, stage: newStage });
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${cfg.bg} border-slate-700`}>
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${cfg.color}`} />
              <p className="font-semibold text-white truncate">{workflow.business_name}</p>
            </div>
            <Badge className={`${STAGE_COLORS[workflow.stage] || 'bg-slate-700 text-slate-300'} border-0 text-xs capitalize`}>
              {workflow.stage?.replace('_',' ')}
            </Badge>
            <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-white text-sm font-bold">{progress}%</p>
              <p className="text-slate-500 text-xs">{completedCount}/{steps.length} steps</p>
            </div>
            {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 bg-slate-700 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
        </div>
        {workflow.client_email && (
          <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
            <User className="w-3 h-3" />{workflow.client_email}
            {workflow.due_date && <span className="ml-2 text-orange-400">Due: {workflow.due_date}</span>}
          </p>
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-700/50 px-4 pb-4 pt-3">
          <div className="space-y-2">
            {steps.map(step => (
              <button
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className="flex items-center gap-3 w-full text-left group"
              >
                {step.status === 'complete'
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  : step.status === 'in_progress'
                    ? <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    : step.status === 'blocked'
                      ? <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0 group-hover:text-slate-400 transition-colors" />
                }
                <span className={`text-sm ${step.status === 'complete' ? 'text-slate-400 line-through' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
                  {step.label}
                </span>
                {step.completed_at && (
                  <span className="text-slate-600 text-xs ml-auto">{new Date(step.completed_at).toLocaleDateString()}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkflowTracker() {
  const [workflows, setWorkflows] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [form, setForm] = useState({ lead_id: '', service_type: 'website_rebuild', business_name: '', client_email: '', assigned_to: '', due_date: '', notes: '' });

  useEffect(() => {
    Promise.all([
      base44.entities.ServiceWorkflow.list('-created_date', 200),
      base44.entities.Lead.list('-created_date', 200)
    ]).then(([w, l]) => { setWorkflows(w); setLeads(l); setLoading(false); });
  }, []);

  const handleLeadSelect = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) setForm(f => ({ ...f, lead_id: leadId, business_name: lead.business_name || '', client_email: lead.email || '' }));
  };

  const createWorkflow = async () => {
    if (!form.service_type || !form.business_name) { toast.error('Service type and business name required'); return; }
    const cfg = SERVICE_CONFIGS[form.service_type];
    const steps = cfg.steps.map(s => ({ ...s, status: 'pending' }));
    const created = await base44.entities.ServiceWorkflow.create({ ...form, steps, stage: 'intake' });
    setWorkflows(prev => [created, ...prev]);
    setShowCreate(false);
    setForm({ lead_id: '', service_type: 'website_rebuild', business_name: '', client_email: '', assigned_to: '', due_date: '', notes: '' });
    toast.success('Workflow created!');
  };

  const handleUpdate = (id, updates) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const filtered = workflows.filter(w => {
    const matchType = filterType === 'all' || w.service_type === filterType;
    const matchStage = filterStage === 'all' || w.stage === filterStage;
    return matchType && matchStage;
  });

  const activeCount = workflows.filter(w => !['complete'].includes(w.stage)).length;

  if (loading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold text-lg">Service Fulfillment</h2>
          <p className="text-slate-400 text-sm">{activeCount} active workflows · {workflows.length} total</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-green-700 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" /> New Workflow
        </Button>
      </div>

      {/* Service type stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(SERVICE_CONFIGS).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button key={key} onClick={() => setFilterType(filterType === key ? 'all' : key)}
              className={`bg-slate-800 rounded-xl p-3 text-center transition-all border ${filterType === key ? 'border-slate-500 ring-1 ring-slate-500' : 'border-slate-700 hover:border-slate-600'}`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${cfg.color}`} />
              <p className="text-lg font-bold text-white">{workflows.filter(w => w.service_type === key).length}</p>
              <p className="text-slate-500 text-xs leading-tight mt-0.5">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {Object.keys(STAGE_COLORS).map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_',' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Workflows */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p>No workflows yet. Start one after a proposal is accepted!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(w => (
            <WorkflowCard key={w.id} workflow={w} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Create Service Workflow</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Link to Lead (optional)</label>
              <Select value={form.lead_id} onValueChange={handleLeadSelect}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select a lead..." /></SelectTrigger>
                <SelectContent>{leads.map(l => <SelectItem key={l.id} value={l.id}>{l.business_name} — {l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Service Type *</label>
              <Select value={form.service_type} onValueChange={v => setForm(f => ({...f, service_type: v}))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(SERVICE_CONFIGS).map(([k,v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Business Name *</label>
                <Input value={form.business_name} onChange={e => setForm(f => ({...f, business_name: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Client Email</label>
                <Input value={form.client_email} onChange={e => setForm(f => ({...f, client_email: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Assigned To</label>
                <Input value={form.assigned_to} onChange={e => setForm(f => ({...f, assigned_to: e.target.value}))} placeholder="team@newtech.com" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Due Date</label>
                <Input type="date" value={form.due_date} onChange={e => setForm(f => ({...f, due_date: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={createWorkflow} className="bg-green-700 hover:bg-green-600 flex-1">Create Workflow</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}