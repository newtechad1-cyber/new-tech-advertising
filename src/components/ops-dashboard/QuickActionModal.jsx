import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500";
const selectCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500";

// --- Individual forms ---

function NewProspectForm({ onDone }) {
  const [form, setForm] = useState({ business_name: '', contact_name: '', email: '', phone: '', website: '', industry: '', city: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.functions.invoke('ntaProspectSubmitted', form);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Business Name *"><input required className={inputCls} value={form.business_name} onChange={e => set('business_name', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Contact Name"><input className={inputCls} value={form.contact_name} onChange={e => set('contact_name', e.target.value)} /></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email"><input className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} /></Field>
        <Field label="Website"><input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://…" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Industry"><input className={inputCls} value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="HVAC, Plumbing…" /></Field>
        <Field label="City"><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Mason City" /></Field>
      </div>
      <button type="submit" disabled={saving} className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl disabled:opacity-50">
        {saving ? 'Creating…' : 'Create Prospect + Start Gap Audit'}
      </button>
    </form>
  );
}

function NewClientForm({ onDone }) {
  const [form, setForm] = useState({ business_name: '', contact_name: '', email: '', phone: '', website: '', industry: '', service_area: '', status: 'onboarding' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Client.create(form);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Business Name *"><input required className={inputCls} value={form.business_name} onChange={e => set('business_name', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Contact Name"><input className={inputCls} value={form.contact_name} onChange={e => set('contact_name', e.target.value)} /></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email"><input className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} /></Field>
        <Field label="Website"><input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Industry"><input className={inputCls} value={form.industry} onChange={e => set('industry', e.target.value)} /></Field>
        <Field label="Service Area"><input className={inputCls} value={form.service_area} onChange={e => set('service_area', e.target.value)} placeholder="Mason City, IA" /></Field>
      </div>
      <Field label="Status">
        <select className={selectCls} value={form.status} onChange={e => set('status', e.target.value)}>
          {['onboarding','active','paused','churned'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <button type="submit" disabled={saving} className="w-full py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl disabled:opacity-50">
        {saving ? 'Creating…' : 'Create Client'}
      </button>
    </form>
  );
}

function NewCampaignForm({ onDone }) {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ client_id: '', campaign_name: '', season: 'year_round', service_focus: '', offer: '', location: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    base44.entities.Client.list('-created_date', 100).then(setClients);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Campaign.create({ ...form, status: 'planning' });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Client *">
        <select required className={selectCls} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
          <option value="">Select client…</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
      </Field>
      <Field label="Campaign Name *"><input required className={inputCls} value={form.campaign_name} onChange={e => set('campaign_name', e.target.value)} placeholder="Summer AC Campaign" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Season">
          <select className={selectCls} value={form.season} onChange={e => set('season', e.target.value)}>
            {['spring','summer','fall','winter','year_round','custom'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Service Focus"><input className={inputCls} value={form.service_focus} onChange={e => set('service_focus', e.target.value)} placeholder="AC Tune-Up" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Offer"><input className={inputCls} value={form.offer} onChange={e => set('offer', e.target.value)} placeholder="Free estimate" /></Field>
        <Field label="Location"><input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Mason City, IA" /></Field>
      </div>
      <p className="text-xs text-slate-500">Creating a campaign will auto-generate content: landing page, Facebook ads, social posts, video script, and SEO pages.</p>
      <button type="submit" disabled={saving} className="w-full py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl disabled:opacity-50">
        {saving ? 'Creating…' : 'Create Campaign + Generate Content'}
      </button>
    </form>
  );
}

function SeasonalForm({ onDone }) {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ client_id: '', season: 'spring', service_focus: '', offer: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const SEASON_HINTS = {
    spring: 'AC checkups, tune-ups, spring prep',
    summer: 'AC repair, emergency cooling',
    fall: 'Furnace tune-ups, winter prep',
    winter: 'No heat emergencies, furnace repair, boiler service',
    year_round: 'General maintenance, all-season',
    custom: 'Custom focus',
  };

  useEffect(() => {
    base44.entities.Client.list('-created_date', 100).then(setClients);
  }, []);

  const handleGenerate = async () => {
    if (!form.client_id) return;
    setLoading(true);
    const res = await base44.functions.invoke('ntaSeasonalCampaignGenerator', form);
    setResult(res.data);
    setLoading(false);
  };

  if (result) return (
    <div className="space-y-3">
      <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-xl p-4">
        <p className="text-emerald-300 font-bold text-sm mb-1">✓ Seasonal Campaign Generated!</p>
        <p className="text-white text-sm font-medium">{result.campaign_name}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Object.entries(result.assets_created || {}).map(([k, v]) => (
            <div key={k} className="bg-slate-800 rounded-lg px-2 py-1.5 text-center">
              <p className="text-white font-bold text-base">{v}</p>
              <p className="text-slate-500 text-xs">{k.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onDone} className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl">Done — View Campaigns</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <Field label="Client *">
        <select className={selectCls} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
          <option value="">Select client…</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
      </Field>
      <Field label="Season *">
        <select className={selectCls} value={form.season} onChange={e => set('season', e.target.value)}>
          {['spring','summer','fall','winter','year_round','custom'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <p className="text-xs text-blue-400 bg-blue-950/40 rounded-lg px-3 py-2">{SEASON_HINTS[form.season]}</p>
      <Field label="Service Focus"><input className={inputCls} value={form.service_focus} onChange={e => set('service_focus', e.target.value)} placeholder="AC Tune-Up, Furnace Repair…" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Offer"><input className={inputCls} value={form.offer} onChange={e => set('offer', e.target.value)} placeholder="Free 21-point inspection" /></Field>
        <Field label="Location"><input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Mason City, IA" /></Field>
      </div>
      <p className="text-xs text-slate-500">Generates: campaign, landing page, 10 posts, 3 FB ads, 1 Google ad, 1 video script, 5 FAQs, 5 SEO pages. Takes ~20 sec.</p>
      <button onClick={handleGenerate} disabled={loading || !form.client_id}
        className="w-full py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" /> Generating…</> : <><Zap className="w-4 h-4" /> Generate Full Campaign Pack</>}
      </button>
    </div>
  );
}

function WeeklyForm({ onDone }) {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    base44.entities.Client.list('-created_date', 100).then(setClients);
  }, []);

  const handleGenerate = async () => {
    if (!clientId) return;
    setLoading(true);
    await base44.functions.invoke('ntaWeeklyContentGenerator', { client_id: clientId });
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="space-y-3">
      <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-xl p-4">
        <p className="text-emerald-300 font-bold text-sm mb-1">✓ Weekly Content Generated!</p>
        <p className="text-slate-400 text-sm">3 Facebook posts, 1 promo post, 1 educational post, 1 video script, 1 ad refresh, 1 SEO topic — all saved as drafts.</p>
      </div>
      <button onClick={onDone} className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl">View Content Assets</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <Field label="Client *">
        <select className={selectCls} value={clientId} onChange={e => setClientId(e.target.value)}>
          <option value="">Select client…</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
      </Field>
      <div className="bg-slate-800/60 rounded-xl px-3 py-3 text-xs text-slate-400 space-y-1">
        <p className="text-slate-300 font-semibold mb-1">Generates this week:</p>
        {['3 Facebook posts (tip, story, local)','1 Promotional post with offer CTA','1 Educational post / how-to','1 Short video script (30-45 sec)','1 Ad refresh idea','1 SEO / blog topic'].map(i => (
          <p key={i} className="flex items-center gap-2"><span className="text-blue-400">✓</span>{i}</p>
        ))}
      </div>
      <button onClick={handleGenerate} disabled={loading || !clientId}
        className="w-full py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" /> Generating…</> : <><Zap className="w-4 h-4" /> Generate Weekly Content</>}
      </button>
    </div>
  );
}

function MonthlyReportForm({ onDone }) {
  const navigate = useNavigate();
  return (
    <div className="text-center py-4 space-y-3">
      <p className="text-slate-400 text-sm">Go to the Reports module to select a client and month, then generate a full AI-powered monthly report.</p>
      <button onClick={() => { onDone(); navigate('/ops/reports'); }}
        className="w-full py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl">
        Go to Reports →
      </button>
    </div>
  );
}

// --- Config ---
const MODAL_CONFIG = {
  prospect: { title: 'New Prospect', subtitle: 'Creates a Prospect record + triggers Gap Audit', Form: NewProspectForm },
  client: { title: 'New Client', subtitle: 'Add a client to the system', Form: NewClientForm },
  campaign: { title: 'New Campaign', subtitle: 'Creates campaign and auto-generates content pack', Form: NewCampaignForm },
  seasonal: { title: 'Seasonal Campaign Generator', subtitle: 'Full AI content pack for any season', Form: SeasonalForm },
  weekly: { title: 'Weekly Content Generator', subtitle: 'Generate one week of content for a client', Form: WeeklyForm },
  report: { title: 'Monthly Report', subtitle: 'Generate AI-powered monthly performance report', Form: MonthlyReportForm },
};

export default function QuickActionModal({ type, onClose, onDone }) {
  const config = MODAL_CONFIG[type];
  if (!config) return null;
  const { title, subtitle, Form } = config;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-white font-bold text-base">{title}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white ml-3 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <Form onDone={onDone} />
        </div>
      </div>
    </div>
  );
}