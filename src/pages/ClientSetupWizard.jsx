import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import {
  ArrowLeft, ArrowRight, CheckCircle, Circle, Save, RefreshCw,
  Building2, Briefcase, Globe, Share2, Shield, MonitorSmartphone,
  Megaphone, FileText, ClipboardList, Star, AlertTriangle, ExternalLink
} from 'lucide-react';

const STEPS = [
  { id: 1, key: 'intake_form_completed',        icon: Building2,         label: 'Business Basics',      short: 'Basics' },
  { id: 2, key: 'services_defined',             icon: Briefcase,         label: 'Services & Offers',    short: 'Services' },
  { id: 3, key: 'website_info_completed',       icon: Globe,             label: 'Website & Brand',      short: 'Brand' },
  { id: 4, key: 'channels_connected',           icon: Share2,            label: 'Channel Connections',  short: 'Channels' },
  { id: 5, key: 'approval_settings_completed',  icon: Shield,            label: 'Approval Preferences', short: 'Approvals' },
  { id: 6, key: 'client_portal_ready',          icon: MonitorSmartphone, label: 'Client Portal',        short: 'Portal' },
  { id: 7, key: 'campaign_defaults_completed',  icon: Megaphone,         label: 'Campaign Defaults',    short: 'Campaigns' },
  { id: 8, key: 'content_settings_completed',   icon: FileText,          label: 'Content Preferences',  short: 'Content' },
  { id: 9, key: 'kickoff_notes_completed',      icon: ClipboardList,     label: 'Kickoff / Handoff',    short: 'Kickoff' },
  { id: 10, key: null,                           icon: Star,              label: 'Review & Complete',    short: 'Complete' },
];

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';

export default function ClientSetupWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [setup, setSetup] = useState(null);
  const [approval, setApproval] = useState(null);
  const [portalUsers, setPortalUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientForm, setClientForm] = useState({});
  const [setupForm, setSetupForm] = useState({});
  const [approvalForm, setApprovalForm] = useState({});
  const [showCampaignPrompt, setShowCampaignPrompt] = useState(false);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    const [c, setups, approvals, pu, conn, camp] = await Promise.all([
      base44.entities.Clients.get(id),
      base44.entities.ClientSetupStatus.filter({ client_id: id }),
      base44.entities.ClientApprovalPreference.filter({ client_id: id }),
      base44.entities.ClientPortalUser.filter({ client_id: id }),
      base44.entities.ChannelConnection.filter({ client_id: id }),
      base44.entities.Campaign.filter({ client_id: id }),
    ]);
    setClient(c);
    setPortalUsers(pu);
    setConnections(conn);
    setCampaigns(camp);

    const s = setups[0] || null;
    setSetup(s);
    setSetupForm(s ? { ...s } : { client_id: id, business_name: c?.business_name || '' });

    const a = approvals[0] || null;
    setApproval(a);
    setApprovalForm(a ? { ...a } : { client_id: id, business_name: c?.business_name || '' });

    setClientForm({ ...c });
    setLoading(false);
  };

  // Infer step completion from real data
  const inferredStatus = {
    intake_form_completed:       !!(client?.email && client?.phone),
    services_defined:            !!(client?.core_services),
    website_info_completed:      !!(client?.website),
    channels_connected:          connections.some(c => c.status === 'connected'),
    approval_settings_completed: !!(approval?.id),
    client_portal_ready:         portalUsers.some(u => u.access_status === 'Active'),
    campaign_defaults_completed: campaigns.length > 0,
    content_settings_completed:  !!(setupForm?.tone_of_voice || client?.brand_voice),
    kickoff_notes_completed:     !!(setupForm?.kickoff_notes),
  };

  const completedCount = STEPS.slice(0, 9).filter(s => (setup?.[s.key] ?? inferredStatus[s.key])).length;
  const pct = Math.round((completedCount / 9) * 100);

  const saveClientForm = async () => {
    await base44.entities.Clients.update(id, {
      business_name: clientForm.business_name,
      email: clientForm.email,
      phone: clientForm.phone,
      city: clientForm.city,
      state: clientForm.state,
      website: clientForm.website,
      notes: clientForm.notes,
      primary_contact: clientForm.primary_contact,
      core_services: clientForm.core_services,
      brand_voice: clientForm.brand_voice,
      target_keywords: clientForm.target_keywords,
    });
  };

  const saveSetupForm = async (extraFields = {}) => {
    const payload = { ...setupForm, ...extraFields, percent_complete: pct, business_name: client?.business_name || '' };
    if (setup?.id) {
      const updated = await base44.entities.ClientSetupStatus.update(setup.id, payload);
      setSetup(updated);
      setSetupForm(updated);
    } else {
      const created = await base44.entities.ClientSetupStatus.create(payload);
      setSetup(created);
      setSetupForm(created);
    }
  };

  const saveApprovalForm = async () => {
    const payload = { ...approvalForm, client_id: id, business_name: client?.business_name || '' };
    if (approval?.id) {
      await base44.entities.ClientApprovalPreference.update(approval.id, payload);
    } else {
      const created = await base44.entities.ClientApprovalPreference.create(payload);
      setApproval(created);
    }
  };

  const markStep = async (stepKey, done = true) => {
    await saveSetupForm({ [stepKey]: done, setup_status: 'In Progress' });
  };

  const handleSaveAndNext = async () => {
    setSaving(true);
    try {
      const currentStep = STEPS[step - 1];
      if (step === 1) {
        await saveClientForm();
        await saveSetupForm({ intake_form_completed: true, setup_status: 'In Progress', started_date: setup?.started_date || new Date().toISOString() });
      } else if (step === 2) {
        await saveSetupForm({ services_defined: !!(setupForm.primary_services || clientForm.core_services) });
      } else if (step === 3) {
        await saveClientForm();
        await saveSetupForm({ website_info_completed: !!(clientForm.website) });
      } else if (step === 5) {
        await saveApprovalForm();
        await saveSetupForm({ approval_settings_completed: true });
        setApproval(approvalForm);
      } else if (step === 9) {
        await saveSetupForm({ kickoff_notes_completed: !!(setupForm.kickoff_notes) });
      } else if (step === 10) {
        await saveSetupForm({ setup_status: 'Completed', completed_date: new Date().toISOString(), percent_complete: 100 });
        setShowCampaignPrompt(true);
        setSaving(false);
        return;
      } else {
        if (currentStep.key) await saveSetupForm({});
      }
      if (step < 10) setStep(s => s + 1);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AgencyLayout><div className="p-8 text-slate-500 text-sm">Loading...</div></AgencyLayout>;
  if (!client) return <AgencyLayout><div className="p-8 text-slate-500 text-sm">Client not found.</div></AgencyLayout>;

  return (
    <AgencyLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 pt-5 pb-0 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Link to={`/agency/clients/${id}`} className="text-slate-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white truncate">{client.business_name} — Client Setup</h1>
              <p className="text-xs text-slate-500 mt-0.5">Step {step} of 10 · {pct}% complete</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${pct === 100 ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>{setup?.setup_status || 'Not Started'}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Step nav */}
          <div className="flex gap-0.5 overflow-x-auto pb-0">
            {STEPS.map((s) => {
              const isDone = s.key ? (setup?.[s.key] ?? inferredStatus[s.key]) : pct === 100;
              const isActive = step === s.id;
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setStep(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    isActive ? 'border-blue-500 text-blue-400' :
                    isDone ? 'border-emerald-600 text-emerald-500' :
                    'border-transparent text-slate-500 hover:text-slate-300'
                  }`}>
                  {isDone && !isActive ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <Icon className="w-3 h-3 flex-shrink-0" />}
                  <span className="hidden sm:inline">{s.short}</span>
                  <span className="inline sm:hidden">{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && <Step1 form={clientForm} setForm={setClientForm} />}
          {step === 2 && <Step2 form={setupForm} setForm={setSetupForm} client={clientForm} />}
          {step === 3 && <Step3 form={clientForm} setForm={setClientForm} setupForm={setupForm} setSetupForm={setSetupForm} />}
          {step === 4 && <Step4 clientId={id} connections={connections} onRefresh={load} />}
          {step === 5 && <Step5 form={approvalForm} setForm={setApprovalForm} />}
          {step === 6 && <Step6 clientId={id} client={client} portalUsers={portalUsers} onRefresh={load} />}
          {step === 7 && <Step7 form={setupForm} setForm={setSetupForm} campaigns={campaigns} clientId={id} client={client} onRefresh={load} />}
          {step === 8 && <Step8 form={setupForm} setForm={setSetupForm} client={clientForm} setClientForm={setClientForm} />}
          {step === 9 && <Step9 form={setupForm} setForm={setSetupForm} />}
          {step === 10 && <Step10 client={client} setup={setup} setupForm={setupForm} inferredStatus={inferredStatus} connections={connections} portalUsers={portalUsers} campaigns={campaigns} approval={approval} pct={pct} />}
        </div>

        {/* Footer nav */}
        <div className="flex-shrink-0 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button onClick={async () => { setSaving(true); await saveSetupForm({}); setSaving(false); }} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg">
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
            {step < 10 ? (
              <button onClick={handleSaveAndNext} disabled={saving} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
                Save & Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSaveAndNext} disabled={saving} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg">
                <CheckCircle className="w-4 h-4" /> Mark Setup Complete
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Post-setup campaign prompt */}
      {showCampaignPrompt && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="text-center">
              <p className="text-2xl mb-2">🎉</p>
              <h2 className="text-lg font-bold text-white">Client setup complete!</h2>
              <p className="text-sm text-slate-400 mt-1">Ready to create your first campaign for <span className="text-white font-semibold">{client?.business_name}</span>?</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => navigate(`/agency/spoke-campaigns?client_id=${id}`)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors"
              >
                Create Campaign →
              </button>
              <button
                onClick={() => navigate(`/agency/clients/${id}`)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition-colors"
              >
                Later — Go to Client
              </button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

// ── Step Components ──────────────────────────────────────────────────────────

function Step1({ form, setForm }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <StepShell title="Client / Business Basics" desc="Confirm or complete core business info. This updates the existing client record — no duplicates created.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Business Name *"><input value={form.business_name || ''} onChange={e => f('business_name', e.target.value)} className={IN} /></Field>
        <Field label="Primary Contact Name"><input value={form.primary_contact || ''} onChange={e => f('primary_contact', e.target.value)} className={IN} /></Field>
        <Field label="Email"><input type="email" value={form.email || ''} onChange={e => f('email', e.target.value)} className={IN} /></Field>
        <Field label="Phone"><input value={form.phone || ''} onChange={e => f('phone', e.target.value)} className={IN} /></Field>
        <Field label="Website"><input value={form.website || ''} onChange={e => f('website', e.target.value)} placeholder="https://" className={IN} /></Field>
        <Field label="City"><input value={form.city || ''} onChange={e => f('city', e.target.value)} className={IN} /></Field>
        <Field label="State"><input value={form.state || ''} onChange={e => f('state', e.target.value)} className={IN} /></Field>
        <Field label="Industry / Business Type"><input value={form.industry || ''} onChange={e => f('industry', e.target.value)} className={IN} /></Field>
      </div>
      <Field label="Internal Notes"><textarea value={form.notes || ''} onChange={e => f('notes', e.target.value)} rows={3} className={IN} /></Field>
    </StepShell>
  );
}

function Step2({ form, setForm, client }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <StepShell title="Services & Offer Setup" desc="Define what this client sells, their key offers, and target audience. Used for content and campaign planning.">
      <Field label="Primary Services (existing: from client record)">
        <input value={form.primary_services || client?.core_services || ''} onChange={e => f('primary_services', e.target.value)} placeholder={client?.core_services || 'e.g. HVAC, Roofing, Dental...'} className={IN} />
      </Field>
      <Field label="Secondary Services"><input value={form.secondary_services || ''} onChange={e => f('secondary_services', e.target.value)} className={IN} /></Field>
      <Field label="Top Priority Offers"><input value={form.top_offers || ''} onChange={e => f('top_offers', e.target.value)} placeholder="Main offer or promotion..." className={IN} /></Field>
      <Field label="Target Audience"><input value={form.target_audience || ''} onChange={e => f('target_audience', e.target.value)} placeholder="Homeowners, 30-55, Iowa..." className={IN} /></Field>
      <Field label="Service Locations / Markets"><input value={form.service_locations || ''} onChange={e => f('service_locations', e.target.value)} placeholder="Mason City, Ames, Waterloo..." className={IN} /></Field>
      <Field label="Upsell Opportunities"><textarea value={form.upsell_notes || ''} onChange={e => f('upsell_notes', e.target.value)} rows={2} className={IN} placeholder="Future upsells or add-ons..." /></Field>
    </StepShell>
  );
}

function Step3({ form, setForm, setupForm, setSetupForm }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const sf = (k, v) => setSetupForm(p => ({ ...p, [k]: v }));
  return (
    <StepShell title="Website & Brand Assets" desc="Capture website, domain, and brand identity details.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Website URL"><input value={form.website || ''} onChange={e => f('website', e.target.value)} placeholder="https://" className={IN} /></Field>
        <Field label="Domain Status"><input value={setupForm.domain_status || ''} onChange={e => sf('domain_status', e.target.value)} placeholder="Live, In progress, Pending..." className={IN} /></Field>
        <Field label="Hosting / Access Notes"><input value={setupForm.hosting_notes || ''} onChange={e => sf('hosting_notes', e.target.value)} className={IN} /></Field>
        <Field label="Analytics Status"><input value={setupForm.analytics_status || ''} onChange={e => sf('analytics_status', e.target.value)} placeholder="Installed, Missing, GA4..." className={IN} /></Field>
        <Field label="Primary Brand Color (hex)"><input value={setupForm.primary_brand_color || ''} onChange={e => sf('primary_brand_color', e.target.value)} placeholder="#3B82F6" className={IN} /></Field>
        <Field label="Brand Tagline"><input value={setupForm.brand_tagline || ''} onChange={e => sf('brand_tagline', e.target.value)} className={IN} /></Field>
      </div>
      <Field label="Logo URL or Asset Link"><input value={setupForm.logo_url || ''} onChange={e => sf('logo_url', e.target.value)} placeholder="https://..." className={IN} /></Field>
      <Field label="Brand Voice / Tone (existing client field)"><textarea value={form.brand_voice || ''} onChange={e => f('brand_voice', e.target.value)} rows={2} className={IN} /></Field>
    </StepShell>
  );
}

function Step4({ clientId, connections, onRefresh }) {
  const PROVIDERS = [
    { id: 'facebook', label: 'Facebook', emoji: '📘' },
    { id: 'instagram', label: 'Instagram', emoji: '📷' },
    { id: 'google_business_profile', label: 'Google Business Profile', emoji: '🟢' },
    { id: 'youtube', label: 'YouTube', emoji: '▶️' },
  ];
  const getConn = (provider) => connections.find(c => c.provider === provider);

  return (
    <StepShell title="Channel Connections" desc="View and manage OAuth channel connections for this client. Connect or reconnect via Channel Connections page.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROVIDERS.map(p => {
          const conn = getConn(p.id);
          const isConnected = conn?.status === 'connected';
          return (
            <div key={p.id} className={`rounded-xl border p-4 flex items-center justify-between ${isConnected ? 'border-emerald-800/60 bg-emerald-950/20' : 'border-slate-700 bg-slate-900'}`}>
              <div>
                <p className="text-sm font-semibold text-white">{p.emoji} {p.label}</p>
                {conn ? (
                  <p className={`text-xs mt-0.5 ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>{conn.status} · {conn.external_account_name || conn.selected_destination_name || '—'}</p>
                ) : (
                  <p className="text-xs text-slate-600 mt-0.5">Not connected</p>
                )}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isConnected ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-500'}`}>
                {conn?.status || 'Not set'}
              </span>
            </div>
          );
        })}
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mt-2">
        <p className="text-xs text-slate-400 mb-3">To connect or reconnect channels, use the Channel Connections page.</p>
        <a href="/agency/channel-connections" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg">
          <ExternalLink className="w-3.5 h-3.5" /> Open Channel Connections
        </a>
      </div>
      <p className="text-xs text-slate-600 mt-1">LinkedIn, X, and TikTok connections are managed separately.</p>
    </StepShell>
  );
}

function Step5({ form, setForm }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const MODES = ['No Client Approval Needed', 'Approve Every Post', 'Approve Campaigns Only', 'Approve Only Promotional Content', 'Manual Selection Per Post'];
  return (
    <StepShell title="Approval Preferences" desc="Configure how this client reviews and approves content. Saved directly to the Approval Workflow system.">
      <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
        <input type="checkbox" id="approvals_required" checked={form.approvals_required || false} onChange={e => f('approvals_required', e.target.checked)} className="accent-blue-500" />
        <label htmlFor="approvals_required" className="text-sm text-white cursor-pointer">Client approvals required</label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Approval Mode">
          <select value={form.approval_mode || 'No Client Approval Needed'} onChange={e => f('approval_mode', e.target.value)} className={IN}>
            {MODES.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="SLA Days (response window)">
          <input type="number" value={form.approval_sla_days ?? 3} onChange={e => f('approval_sla_days', parseInt(e.target.value))} className={IN} />
        </Field>
        <Field label="Default Approver Name"><input value={form.default_approver_name || ''} onChange={e => f('default_approver_name', e.target.value)} className={IN} /></Field>
        <Field label="Default Approver Email"><input type="email" value={form.default_approver_email || ''} onChange={e => f('default_approver_email', e.target.value)} className={IN} /></Field>
      </div>
      <div className="flex flex-col gap-2">
        {[['auto_approve_if_no_response', 'Auto-approve if no response by deadline'], ['require_final_internal_check', 'Require final internal review before publishing']].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl cursor-pointer">
            <input type="checkbox" checked={form[key] || false} onChange={e => f(key, e.target.checked)} className="accent-blue-500" />
            <span className="text-sm text-white">{label}</span>
          </label>
        ))}
      </div>
      <Field label="Notes"><textarea value={form.notes || ''} onChange={e => f('notes', e.target.value)} rows={2} className={IN} /></Field>
    </StepShell>
  );
}

function Step6({ clientId, client, portalUsers, onRefresh }) {
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'Approver', access_status: 'Active' });
  const [saving, setSaving] = useState(false);

  const addUser = async () => {
    if (!newUser.email) return;
    setSaving(true);
    await base44.entities.ClientPortalUser.create({ ...newUser, client_id: clientId, business_name: client?.business_name || '' });
    setNewUser({ full_name: '', email: '', role: 'Approver', access_status: 'Active' });
    setSaving(false);
    onRefresh();
  };

  return (
    <StepShell title="Client Portal Access" desc="Set up portal access for the client. Active portal users get access to /portal dashboard.">
      {portalUsers.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800">{['Name', 'Email', 'Role', 'Status'].map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-800">
              {portalUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="px-3 py-2.5 text-white text-sm">{u.full_name || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs">{u.email}</td>
                  <td className="px-3 py-2.5"><span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{u.role}</span></td>
                  <td className="px-3 py-2.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.access_status === 'Active' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{u.access_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Add Portal User</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name"><input value={newUser.full_name} onChange={e => setNewUser(p => ({ ...p, full_name: e.target.value }))} className={IN} /></Field>
          <Field label="Email *"><input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className={IN} /></Field>
          <Field label="Role">
            <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className={IN}>
              {['Owner', 'Manager', 'Approver', 'Viewer'].map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
        </div>
        <button onClick={addUser} disabled={saving || !newUser.email} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
          {saving ? 'Adding...' : 'Add Portal User'}
        </button>
      </div>
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3 mt-2">
        <p className="text-xs text-slate-400">Client portal is available at: <span className="text-blue-400 font-mono">/portal</span></p>
      </div>
    </StepShell>
  );
}

function Step7({ form, setForm, campaigns, clientId, client, onRefresh }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const [creating, setCreating] = useState(false);

  const createDefaultCampaign = async () => {
    setCreating(true);
    await base44.entities.Campaign.create({
      campaign_name: `${client?.business_name} — Monthly Campaign`,
      client_id: clientId, business_name: client?.business_name || '',
      campaign_type: 'Social Posting', status: 'Planned',
    });
    setCreating(false);
    onRefresh();
  };

  return (
    <StepShell title="Campaign Defaults" desc="Set default targeting and frequency for future campaigns. These guide campaign creation — not locked in.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Preferred Platforms"><input value={form.preferred_platforms || ''} onChange={e => f('preferred_platforms', e.target.value)} placeholder="Facebook, Instagram, GBP..." className={IN} /></Field>
        <Field label="Posting Frequency Target"><input value={form.posting_frequency || ''} onChange={e => f('posting_frequency', e.target.value)} placeholder="3x/week, Daily, Mon/Wed/Fri..." className={IN} /></Field>
        <Field label="Content Types Preferred"><input value={form.content_types_preferred || ''} onChange={e => f('content_types_preferred', e.target.value)} placeholder="Videos, Carousels, Posts..." className={IN} /></Field>
        <Field label="Geographic Targeting"><input value={form.geographic_targeting || ''} onChange={e => f('geographic_targeting', e.target.value)} placeholder="Mason City, 50-mile radius..." className={IN} /></Field>
      </div>
      <Field label="CTA Defaults"><input value={form.cta_defaults || ''} onChange={e => f('cta_defaults', e.target.value)} placeholder="Call us, Book online, Visit us..." className={IN} /></Field>
      {campaigns.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Existing Campaigns ({campaigns.length})</p>
          {campaigns.slice(0, 3).map(c => <p key={c.id} className="text-sm text-slate-300 py-0.5">{c.campaign_name} · <span className="text-xs text-slate-500">{c.status}</span></p>)}
          <a href="/agency/campaigns" target="_blank" className="inline-flex items-center gap-1 text-xs text-blue-400 mt-2"><ExternalLink className="w-3 h-3" /> Manage Campaigns</a>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">No campaigns created yet.</p>
          <button onClick={createDefaultCampaign} disabled={creating} className="text-xs px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {creating ? 'Creating...' : '+ Create First Campaign'}
          </button>
        </div>
      )}
    </StepShell>
  );
}

function Step8({ form, setForm, client, setClientForm }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const cf = (k, v) => setClientForm(p => ({ ...p, [k]: v }));
  return (
    <StepShell title="Content Preferences" desc="Define tone, topics, and media expectations. Feeds into content generation and approval workflows.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tone of Voice"><input value={form.tone_of_voice || client?.brand_voice || ''} onChange={e => f('tone_of_voice', e.target.value)} placeholder="Professional, Friendly, Bold..." className={IN} /></Field>
        <Field label="Preferred Post Mix"><input value={form.preferred_post_mix || ''} onChange={e => f('preferred_post_mix', e.target.value)} placeholder="40% video, 40% carousel, 20% text..." className={IN} /></Field>
        <Field label="Topics to Emphasize"><input value={form.topics_to_emphasize || ''} onChange={e => f('topics_to_emphasize', e.target.value)} className={IN} /></Field>
        <Field label="Topics to Avoid"><input value={form.topics_to_avoid || ''} onChange={e => f('topics_to_avoid', e.target.value)} className={IN} /></Field>
      </div>
      <Field label="Brand Voice / Style (synced with client record)">
        <textarea value={client?.brand_voice || ''} onChange={e => cf('brand_voice', e.target.value)} rows={2} className={IN} />
      </Field>
      <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl cursor-pointer">
        <input type="checkbox" checked={form.client_provides_media || false} onChange={e => f('client_provides_media', e.target.checked)} className="accent-blue-500" />
        <span className="text-sm text-white">Client provides their own media (photos/videos)</span>
      </label>
      <Field label="Target Keywords (synced with client record)">
        <input value={client?.target_keywords || ''} onChange={e => setClientForm(p => ({ ...p, target_keywords: e.target.value }))} className={IN} />
      </Field>
    </StepShell>
  );
}

function Step9({ form, setForm }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <StepShell title="Internal Kickoff & Handoff" desc="Complete internal readiness before launching. Record blockers, next steps, and owner assignment.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Assigned Owner"><input value={form.assigned_owner || ''} onChange={e => f('assigned_owner', e.target.value)} placeholder="Team member responsible..." className={IN} /></Field>
        <Field label="Kickoff Date (optional)"><input type="date" value={form.kickoff_date || ''} onChange={e => f('kickoff_date', e.target.value)} className={IN} /></Field>
      </div>
      <Field label="Internal Blockers"><textarea value={form.internal_blockers || ''} onChange={e => f('internal_blockers', e.target.value)} rows={2} placeholder="What's stopping us from launching?" className={IN} /></Field>
      <Field label="Missing Items"><textarea value={form.missing_items || ''} onChange={e => f('missing_items', e.target.value)} rows={2} placeholder="Assets, credentials, info still needed..." className={IN} /></Field>
      <Field label="Next Actions"><textarea value={form.next_actions || ''} onChange={e => f('next_actions', e.target.value)} rows={2} placeholder="Step-by-step next actions..." className={IN} /></Field>
      <Field label="Kickoff Notes / Summary"><textarea value={form.kickoff_notes || ''} onChange={e => f('kickoff_notes', e.target.value)} rows={3} placeholder="Internal summary for the team..." className={IN} /></Field>
    </StepShell>
  );
}

function Step10({ client, setup, setupForm, inferredStatus, connections, portalUsers, campaigns, approval, pct }) {
  const STEP_CHECKS = [
    { label: 'Business Basics',     done: setupForm?.intake_form_completed ?? inferredStatus.intake_form_completed },
    { label: 'Services Defined',    done: setupForm?.services_defined ?? inferredStatus.services_defined },
    { label: 'Website & Brand',     done: setupForm?.website_info_completed ?? inferredStatus.website_info_completed },
    { label: 'Channels Connected',  done: setupForm?.channels_connected ?? inferredStatus.channels_connected },
    { label: 'Approval Settings',   done: setupForm?.approval_settings_completed ?? inferredStatus.approval_settings_completed },
    { label: 'Client Portal Ready', done: setupForm?.client_portal_ready ?? inferredStatus.client_portal_ready },
    { label: 'Campaign Defaults',   done: setupForm?.campaign_defaults_completed ?? inferredStatus.campaign_defaults_completed },
    { label: 'Content Preferences', done: setupForm?.content_settings_completed ?? inferredStatus.content_settings_completed },
    { label: 'Kickoff Notes',       done: setupForm?.kickoff_notes_completed ?? inferredStatus.kickoff_notes_completed },
  ];
  const done = STEP_CHECKS.filter(s => s.done).length;
  const missing = STEP_CHECKS.filter(s => !s.done).map(s => s.label);

  return (
    <StepShell title="Review & Complete Setup" desc="Final readiness check before marking this client operational.">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-black text-white">{client?.business_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">Setup readiness score</p>
          </div>
          <div className={`text-4xl font-black ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-5">
          <div className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STEP_CHECKS.map(s => (
            <div key={s.label} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${s.done ? 'bg-emerald-950/30' : 'bg-slate-800'}`}>
              {s.done ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />}
              <span className={`text-sm ${s.done ? 'text-emerald-300' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
        {missing.length > 0 && (
          <div className="mt-4 bg-amber-950/30 border border-amber-900/50 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-400 mb-1">⚠ Incomplete Steps</p>
            <p className="text-xs text-amber-300">{missing.join(', ')}</p>
          </div>
        )}
      </div>
    </StepShell>
  );
}

// ── Shared helpers ───────────────────────────────────────────────────────────

function StepShell({ title, desc, children }) {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {desc && <p className="text-sm text-slate-400 mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className={LBL}>{label}</label>
      {children}
    </div>
  );
}