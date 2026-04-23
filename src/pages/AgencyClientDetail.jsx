import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import {
  ArrowLeft, Settings2, Edit, Megaphone, FileText, Shield,
  Globe, Phone, Mail, MapPin, Building2, CheckCircle, Circle,
  AlertTriangle, ExternalLink, Loader2, Plus, Share2, RefreshCw,
  ChevronRight, Tag, Briefcase, UserCircle, Activity, Radio,
  BookOpen, Calendar, Send, Video, X
} from 'lucide-react';

const STATUS_COLORS = {
  active_client: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  lead: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  paused: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  former_client: 'bg-slate-600/40 text-slate-400 border-slate-600/30',
};
const STATUS_LABELS = { active_client: 'Active Client', lead: 'Lead', paused: 'Paused', former_client: 'Former' };

const SETUP_STAGE_ORDER = [
  'Intake', 'Business Setup', 'Services Setup', 'Channel Setup',
  'Approval Setup', 'Portal Setup', 'Campaign Defaults', 'Content Defaults',
  'Kickoff Ready', 'Complete',
];

const CHANNEL_PROVIDERS = [
  { id: 'facebook', label: 'Facebook', emoji: '📘' },
  { id: 'instagram', label: 'Instagram', emoji: '📷' },
  { id: 'google_business_profile', label: 'Google Business', emoji: '🟢' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️' },
];

export default function AgencyClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [setup, setSetup] = useState(null);
  const [company, setCompany] = useState(null);
  const [contact, setContact] = useState(null);
  const [lead, setLead] = useState(null);
  const [deal, setDeal] = useState(null);
  const [connections, setConnections] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [spokeCampaigns, setSpokeCampaigns] = useState([]);
  const [contentAssets, setContentAssets] = useState([]);
  const [approvalItems, setApprovalItems] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initializingSetup, setInitializingSetup] = useState(false);

  // Create modals
  const [createCampaignModal, setCreateCampaignModal] = useState(false);
  const [createSpokeModal, setCreateSpokeModal] = useState(false);
  const [createInsightModal, setCreateInsightModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ campaign_name: '', campaign_type: 'Social Posting', objective: '' });
  const [spokeForm, setSpokeForm] = useState({ campaign_name: '', pillar: '', core_theme: '', target_audience: '' });
  const [insightForm, setInsightForm] = useState({ title: '', headline: '' });
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const c = await base44.entities.Clients.get(id);
    setClient(c);
    setEditForm({ ...c });

    const [setups, connections, campaigns, spoke, assets, approvals, posts] = await Promise.all([
      base44.entities.ClientSetupStatus.filter({ client_id: id }),
      base44.entities.ChannelConnection.filter({ client_id: id }),
      base44.entities.Campaign.filter({ client_id: id }),
      base44.entities.SpokeCampaign.filter({ client_id: id }),
      base44.entities.NTAContentAsset.filter({ client_id: id }),
      base44.entities.ApprovalItem.filter({ client_id: id }),
      base44.entities.SocialPostQueue.filter({ client_id: id }),
    ]);

    setSetup(setups[0] || null);
    setConnections(connections);
    setCampaigns(campaigns);
    setSpokeCampaigns(spoke);
    setContentAssets(assets);
    setApprovalItems(approvals);
    setSocialPosts(posts);

    // NTA company + contact lookup
    // Priority 1: canonical company_id stored on the Clients record
    // Priority 2 (LEGACY FALLBACK): email match — for records synced before company_id was stored
    // Priority 3 (LEGACY FALLBACK): business_name text match — least reliable, avoid for new records
    {
      let co = null;
      if (c?.company_id) {
        // Canonical path — direct ID lookup
        const companyRecord = await base44.entities.NTACompany.get(c.company_id).catch(() => null);
        co = companyRecord || null;
      }
      if (!co && c?.email) {
        // LEGACY FALLBACK: email-based match for older synced records
        const res = await base44.entities.NTACompany.filter({ email: c.email });
        if (res.length > 0) co = res[0];
      }
      if (!co && c?.business_name) {
        // LEGACY FALLBACK: name-based match — unreliable if names differ; do not use for new records
        const res = await base44.entities.NTACompany.filter({ company_name: c.business_name });
        if (res.length > 0) co = res[0];
      }
      setCompany(co || null);

      if (co) {
        const contacts = await base44.entities.NTAContact.filter({ company_id: co.id, is_primary: true });
        setContact(contacts[0] || null);
      }
    }

    // Linked lead / deal
    if (c?.converted_client_id === id || c?.id) {
      const leads = await base44.entities.SalesLead.filter({ converted_client_id: id });
      if (leads.length > 0) {
        setLead(leads[0]);
        const deals = await base44.entities.SalesDeal.filter({ lead_id: leads[0].id });
        setDeal(deals[0] || null);
      }
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const initializeSetup = async () => {
    setInitializingSetup(true);
    const created = await base44.entities.ClientSetupStatus.create({
      client_id: id,
      business_name: client?.business_name || '',
      setup_status: 'Not Started',
      onboarding_stage: 'Intake',
      percent_complete: 0,
    });
    setSetup(created);
    setInitializingSetup(false);
    navigate(`/agency/clients/${id}/setup`);
  };

  const createCampaign = async () => {
    if (!campaignForm.campaign_name.trim()) return;
    setCreating(true);
    const created = await base44.entities.Campaign.create({
      ...campaignForm, client_id: id, business_name: client?.business_name || '', status: 'Draft',
    });
    setCampaigns(p => [created, ...p]);
    setCreateCampaignModal(false);
    setCampaignForm({ campaign_name: '', campaign_type: 'Social Posting', objective: '' });
    setCreating(false);
  };

  const createSpoke = async () => {
    if (!spokeForm.campaign_name.trim()) return;
    setCreating(true);
    const slug = spokeForm.campaign_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const created = await base44.entities.SpokeCampaign.create({
      ...spokeForm, client_id: id, campaign_slug: slug, status: 'draft',
    });
    setSpokeCampaigns(p => [created, ...p]);
    setCreateSpokeModal(false);
    setSpokeForm({ campaign_name: '', pillar: '', core_theme: '', target_audience: '' });
    setCreating(false);
  };

  const createInsightPage = async () => {
    if (!insightForm.title.trim()) return;
    setCreating(true);
    const slug = insightForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // Always stamp client_id (canonical Clients.id) and campaign_id on new InsightPages
    await base44.entities.InsightPage.create({
      ...insightForm,
      campaign_id: campaigns[0]?.id || '',
      client_id: id, // canonical: Clients.id
      publish_status: 'draft',
      slug,
    });
    setCreateInsightModal(false);
    setInsightForm({ title: '', headline: '' });
    setCreating(false);
    navigate('/agency/insight-pages');
  };

  const saveEdit = async () => {
    setSaving(true);
    await base44.entities.Clients.update(id, editForm);
    setClient({ ...client, ...editForm });
    setEditModal(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
        </div>
      </AgencyLayout>
    );
  }

  if (!client) {
    return (
      <AgencyLayout>
        <div className="p-8 text-center">
          <p className="text-slate-400">Client not found.</p>
          <Link to="/agency/clients" className="text-blue-400 text-sm mt-2 inline-block">← Back to Clients</Link>
        </div>
      </AgencyLayout>
    );
  }

  const pct = setup?.percent_complete ?? 0;
  const stageIndex = SETUP_STAGE_ORDER.indexOf(setup?.onboarding_stage || 'Intake');
  const connectedChannels = connections.filter(c => c.status === 'connected');

  return (
    <AgencyLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start gap-3">
          <Link to="/agency/clients" className="mt-1 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-white leading-tight">{client.business_name}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[client.status] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                {STATUS_LABELS[client.status] || client.status}
              </span>
              {deal?.stage === 'Closed Won' && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-emerald-300">
                  🏆 Converted
                </span>
              )}
            </div>
            {(client.city || client.state) && (
              <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {[client.city, client.state].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Primary Action Bar ── */}
        <div className="flex flex-wrap gap-2">
          {setup ? (
            <Link to={`/agency/clients/${id}/setup`} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
              <Settings2 className="w-4 h-4" /> Setup Wizard
            </Link>
          ) : (
            <button onClick={initializeSetup} disabled={initializingSetup}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
              {initializingSetup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {initializingSetup ? 'Initializing...' : 'Initialize Onboarding'}
            </button>
          )}
          <button onClick={() => { setEditForm({ ...client }); setEditModal(true); }}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Edit className="w-4 h-4" /> Edit Client
          </button>
          <button onClick={() => setCreateCampaignModal(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-3.5 h-3.5" /><Megaphone className="w-4 h-4" /> Campaign
          </button>
          <button onClick={() => setCreateSpokeModal(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-3.5 h-3.5" /><Radio className="w-4 h-4" /> Spoke
          </button>
          <button onClick={() => setCreateInsightModal(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-3.5 h-3.5" /><BookOpen className="w-4 h-4" /> Insight Page
          </button>
          <Link to={`/agency/approval-center?client=${id}`}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Shield className="w-4 h-4" /> Approvals
            {approvalItems.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-black text-xs font-black px-1.5 py-0.5 rounded-full leading-none">
                {approvalItems.filter(a => a.status === 'pending').length}
              </span>
            )}
          </Link>
          <Link to={`/agency/publishing-calendar?client=${id}`}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Calendar className="w-4 h-4" /> Calendar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── Fulfillment Summary ── */}
            <FulfillmentSection
              clientId={id}
              campaigns={campaigns}
              spokeCampaigns={spokeCampaigns}
              contentAssets={contentAssets}
              approvalItems={approvalItems}
              socialPosts={socialPosts}
              onCreateCampaign={() => setCreateCampaignModal(true)}
              onCreateSpoke={() => setCreateSpokeModal(true)}
              onCreateInsight={() => setCreateInsightModal(true)}
            />

            {/* Onboarding Status */}
            <Section title="Onboarding Status" icon={Activity}>
              {setup ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{setup.onboarding_stage || 'Intake'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{setup.setup_status || 'Not Started'}</p>
                    </div>
                    <span className={`text-2xl font-black ${pct >= 80 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-blue-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {/* Stage pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {SETUP_STAGE_ORDER.map((stage, idx) => {
                      const done = idx < stageIndex;
                      const active = idx === stageIndex;
                      return (
                        <span key={stage} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          done ? 'bg-emerald-900/40 text-emerald-400' :
                          active ? 'bg-blue-600/30 text-blue-300 ring-1 ring-blue-500/50' :
                          'bg-slate-800 text-slate-600'
                        }`}>
                          {done ? '✓ ' : active ? '→ ' : ''}{stage}
                        </span>
                      );
                    })}
                  </div>
                  {setup.next_actions && (
                    <div className="bg-slate-800/60 rounded-xl p-3">
                      <p className="text-xs font-bold text-slate-400 mb-1">Next Actions</p>
                      <p className="text-xs text-slate-300 whitespace-pre-wrap">{setup.next_actions}</p>
                    </div>
                  )}
                  {setup.internal_blockers && (
                    <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Blockers
                      </p>
                      <p className="text-xs text-amber-300">{setup.internal_blockers}</p>
                    </div>
                  )}
                  <Link
                    to={`/agency/clients/${id}/setup`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Continue Setup Wizard <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm mb-1">No onboarding setup started yet.</p>
                  <p className="text-slate-600 text-xs mb-4">Initialize to track setup progress and manage the client workflow.</p>
                  <button
                    onClick={initializeSetup}
                    disabled={initializingSetup}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-4 py-2 rounded-xl"
                  >
                    {initializingSetup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Initialize Onboarding
                  </button>
                </div>
              )}
            </Section>

            {/* Contact Info */}
            <Section title="Contact Info" icon={UserCircle}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {client.primary_contact && <InfoRow icon={UserCircle} label="Contact" value={client.primary_contact} />}
                {client.email && <InfoRow icon={Mail} label="Email" value={client.email} href={`mailto:${client.email}`} />}
                {client.phone && <InfoRow icon={Phone} label="Phone" value={client.phone} href={`tel:${client.phone}`} />}
                {client.website && <InfoRow icon={Globe} label="Website" value={client.website} href={client.website.startsWith('http') ? client.website : `https://${client.website}`} ext />}
                {(client.city || client.state) && <InfoRow icon={MapPin} label="Location" value={[client.city, client.state].filter(Boolean).join(', ')} />}
              </div>
              {contact && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Contact (NTA)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contact.name && <InfoRow icon={UserCircle} label="Name" value={contact.name} />}
                    {contact.email && <InfoRow icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />}
                    {contact.phone && <InfoRow icon={Phone} label="Phone" value={contact.phone} />}
                    {contact.role && <InfoRow icon={Briefcase} label="Role" value={contact.role} />}
                  </div>
                </div>
              )}
            </Section>

            {/* Business Info */}
            <Section title="Business Info" icon={Building2}>
              <div className="space-y-3">
                {client.core_services && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Core Services</p>
                    <p className="text-sm text-slate-300">{client.core_services}</p>
                  </div>
                )}
                {client.target_keywords && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Target Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {client.target_keywords.split(',').map(k => (
                        <span key={k} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{k.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {client.brand_voice && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Brand Voice</p>
                    <p className="text-sm text-slate-300">{client.brand_voice}</p>
                  </div>
                )}
                {setup?.tone_of_voice && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Tone of Voice</p>
                    <p className="text-sm text-slate-300">{setup.tone_of_voice}</p>
                  </div>
                )}
                {setup?.primary_brand_color && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Brand Color</p>
                    <div className="w-5 h-5 rounded-full border border-slate-600" style={{ backgroundColor: setup.primary_brand_color }} />
                    <span className="text-xs text-slate-400 font-mono">{setup.primary_brand_color}</span>
                  </div>
                )}
                {setup?.posting_frequency && (
                  <InfoRow icon={Activity} label="Posting Frequency" value={setup.posting_frequency} />
                )}
              </div>
            </Section>

            {/* Notes */}
            {(client.notes || setup?.setup_notes || setup?.kickoff_notes) && (
              <Section title="Notes / Internal Status" icon={FileText}>
                <div className="space-y-3">
                  {client.notes && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Client Notes</p>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{client.notes}</p>
                    </div>
                  )}
                  {setup?.setup_notes && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Setup Notes</p>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{setup.setup_notes}</p>
                    </div>
                  )}
                  {setup?.kickoff_notes && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Kickoff Notes</p>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{setup.kickoff_notes}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-5">

            {/* Quick Links */}
            <Section title="Operations Links" icon={Megaphone}>
              <div className="space-y-1.5">
                <QuickLink to={`/agency/campaigns?client=${id}`} icon={Megaphone} label="Campaigns" count={campaigns.length} />
                <QuickLink to={`/agency/spoke-campaigns`} icon={Radio} label="Spoke Campaigns" count={spokeCampaigns.length} />
                <QuickLink to={`/agency/content-asset?client=${id}`} icon={FileText} label="Content Assets" count={contentAssets.length} />
                <QuickLink to={`/agency/approval-center?client=${id}`} icon={Shield} label="Approval Center" count={approvalItems.filter(a=>a.status==='pending').length || undefined} />
                <QuickLink to={`/agency/publishing-calendar?client=${id}`} icon={Calendar} label="Publishing Calendar" />
                <QuickLink to={`/agency/social-queue?client=${id}`} icon={Send} label="Social Queue" count={socialPosts.filter(p=>p.publish_status==='scheduled').length || undefined} />
                <QuickLink to={`/agency/insight-pages`} icon={BookOpen} label="Insight Pages" />
                <QuickLink to={`/agency/portal-manager?client=${id}`} icon={UserCircle} label="Client Portal" />
              </div>
            </Section>

            {/* Channel Connections */}
            <Section title="Channel Connections" icon={Share2}>
              <div className="space-y-2">
                {CHANNEL_PROVIDERS.map(p => {
                  const conn = connections.find(c => c.provider === p.id);
                  const isConnected = conn?.status === 'connected';
                  return (
                    <div key={p.id} className={`flex items-center justify-between rounded-lg px-3 py-2 ${isConnected ? 'bg-emerald-950/30' : 'bg-slate-800/50'}`}>
                      <span className="text-sm text-white">{p.emoji} {p.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isConnected ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-500'}`}>
                        {conn?.status || 'Not Set'}
                      </span>
                    </div>
                  );
                })}
                <Link
                  to="/agency/channel-connections"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Manage Connections
                </Link>
              </div>
            </Section>

            {/* Sales / Lead Link */}
            {(lead || deal) && (
              <Section title="Sales Origin" icon={Tag}>
                <div className="space-y-2 text-sm">
                  {lead && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Source Lead</p>
                      <p className="text-white font-semibold">{lead.business_name || lead.contact_name || '—'}</p>
                      {lead.lead_source && <p className="text-xs text-slate-400 mt-0.5">{lead.lead_source}</p>}
                    </div>
                  )}
                  {deal && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Deal</p>
                      <p className="text-white font-semibold">{deal.deal_name || '—'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{deal.stage}</span>
                        {deal.value && <span className="text-xs text-emerald-400 font-bold">${Number(deal.value).toLocaleString()}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* NTA Company link */}
            {company && (
              <Section title="NTA Record" icon={Building2}>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-white mb-1">{company.company_name}</p>
                  <p className="text-xs text-slate-400">{company.lifecycle_stage} · {company.status}</p>
                  <Link
                    to={`/nta/companies/${company.id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> View NTA Company
                  </Link>
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* ── Create Campaign Modal ── */}
      {createCampaignModal && (
        <CreateModal title="Create Campaign" onClose={() => setCreateCampaignModal(false)} onSave={createCampaign} saving={creating} disabled={!campaignForm.campaign_name.trim()}>
          <Field label="Campaign Name *">
            <input value={campaignForm.campaign_name} onChange={e => setCampaignForm(p=>({...p,campaign_name:e.target.value}))} placeholder="e.g. Spring Promotion" className={INP} />
          </Field>
          <Field label="Type">
            <select value={campaignForm.campaign_type} onChange={e => setCampaignForm(p=>({...p,campaign_type:e.target.value}))} className={INP}>
              {['Social Posting','Promo Campaign','Seasonal Campaign','Lead Generation','Offer Launch','Video Campaign'].map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Objective">
            <input value={campaignForm.objective} onChange={e => setCampaignForm(p=>({...p,objective:e.target.value}))} placeholder="e.g. Drive spring service calls" className={INP} />
          </Field>
        </CreateModal>
      )}

      {/* ── Create Spoke Campaign Modal ── */}
      {createSpokeModal && (
        <CreateModal title="Create Spoke Campaign" onClose={() => setCreateSpokeModal(false)} onSave={createSpoke} saving={creating} disabled={!spokeForm.campaign_name.trim()}>
          <Field label="Campaign Name *">
            <input value={spokeForm.campaign_name} onChange={e => setSpokeForm(p=>({...p,campaign_name:e.target.value}))} placeholder="e.g. HVAC Authority" className={INP} />
          </Field>
          <Field label="Pillar">
            <input value={spokeForm.pillar} onChange={e => setSpokeForm(p=>({...p,pillar:e.target.value}))} placeholder="e.g. Local Authority" className={INP} />
          </Field>
          <Field label="Core Theme">
            <input value={spokeForm.core_theme} onChange={e => setSpokeForm(p=>({...p,core_theme:e.target.value}))} placeholder="e.g. HVAC tips & trust" className={INP} />
          </Field>
          <Field label="Target Audience">
            <input value={spokeForm.target_audience} onChange={e => setSpokeForm(p=>({...p,target_audience:e.target.value}))} placeholder="e.g. Homeowners in Mason City" className={INP} />
          </Field>
        </CreateModal>
      )}

      {/* ── Create Insight Page Modal ── */}
      {createInsightModal && (
        <CreateModal title="Create Insight Page" onClose={() => setCreateInsightModal(false)} onSave={createInsightPage} saving={creating} disabled={!insightForm.title.trim()}>
          <Field label="Page Title *">
            <input value={insightForm.title} onChange={e => setInsightForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Why Local HVAC Matters" className={INP} />
          </Field>
          <Field label="Headline">
            <input value={insightForm.headline} onChange={e => setInsightForm(p=>({...p,headline:e.target.value}))} placeholder="e.g. The Hidden Cost of Ignoring Your HVAC" className={INP} />
          </Field>
        </CreateModal>
      )}

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">Edit Client</h3>
              <button onClick={() => setEditModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { key: 'business_name', label: 'Business Name *' },
                { key: 'primary_contact', label: 'Primary Contact' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone' },
                { key: 'website', label: 'Website' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
                { key: 'core_services', label: 'Core Services' },
                { key: 'target_keywords', label: 'Target Keywords' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={editForm[f.key] || ''}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Brand Voice</label>
                <textarea
                  value={editForm.brand_voice || ''}
                  onChange={e => setEditForm(p => ({ ...p, brand_voice: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Status</label>
                <select
                  value={editForm.status || 'active_client'}
                  onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Notes</label>
                <textarea
                  value={editForm.notes || ''}
                  onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-900 px-5 py-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={saveEdit}
                disabled={saving || !editForm.business_name?.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditModal(false)} className="px-4 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

// ── Small reusable components ─────────────────────────────────────────────────

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href, ext }) {
  const content = (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-sm font-medium truncate ${href ? 'text-blue-400' : 'text-slate-200'}`}>{value}</p>
      </div>
    </div>
  );
  if (href) return <a href={href} target={ext ? '_blank' : undefined} rel="noopener noreferrer">{content}</a>;
  return content;
}

function QuickLink({ to, icon: Icon, label, count }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {count !== undefined && count > 0 && (
          <span className="text-xs font-bold bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">{count}</span>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
    </Link>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────
const INP = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}

function CreateModal({ title, onClose, onSave, saving, disabled, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">{children}</div>
        <div className="px-5 py-4 border-t border-slate-800 flex gap-3">
          <button onClick={onSave} disabled={saving || disabled}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm">
            {saving ? 'Creating...' : 'Create'}
          </button>
          <button onClick={onClose} className="px-4 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Fulfillment Section ───────────────────────────────────────────────────────
const STATUS_DOT = {
  Draft: 'bg-slate-500', Planned: 'bg-blue-500', Active: 'bg-emerald-500',
  Completed: 'bg-slate-400', Paused: 'bg-amber-500', Cancelled: 'bg-red-600',
  draft: 'bg-slate-500', active: 'bg-emerald-500', completed: 'bg-slate-400',
};

function FulfillmentSection({ clientId, campaigns, spokeCampaigns, contentAssets, approvalItems, socialPosts, onCreateCampaign, onCreateSpoke, onCreateInsight }) {
  const hasAnything = campaigns.length > 0 || spokeCampaigns.length > 0 || contentAssets.length > 0;
  const pendingApprovals = approvalItems.filter(a => a.status === 'pending').length;
  const scheduledPosts = socialPosts.filter(p => p.publish_status === 'scheduled').length;
  const publishedPosts = socialPosts.filter(p => p.publish_status === 'published').length;
  const draftAssets = contentAssets.filter(a => a.status === 'draft').length;
  const approvedAssets = contentAssets.filter(a => a.approval_status === 'approved').length;

  if (!hasAnything) {
    return (
      <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-8 text-center">
        <Megaphone className="w-10 h-10 text-slate-700 mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">No campaigns or content yet</p>
        <p className="text-slate-500 text-sm mb-6">Start by creating a campaign, then build spoke campaigns and content assets.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={onCreateCampaign}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /><Megaphone className="w-4 h-4" /> Create Campaign
          </button>
          <button onClick={onCreateSpoke}
            className="flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /><Radio className="w-4 h-4" /> Spoke Campaign
          </button>
          <button onClick={onCreateInsight}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /><BookOpen className="w-4 h-4" /> Insight Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPITile icon={Megaphone} label="Campaigns" value={campaigns.length} color="text-blue-400" />
        <KPITile icon={Radio} label="Spoke Campaigns" value={spokeCampaigns.length} color="text-violet-400" />
        <KPITile icon={FileText} label="Content Assets" value={contentAssets.length} color="text-amber-400" sub={draftAssets > 0 ? `${draftAssets} draft` : approvedAssets > 0 ? `${approvedAssets} approved` : undefined} />
        <KPITile icon={Send} label="Social Posts" value={scheduledPosts + publishedPosts} color="text-emerald-400" sub={scheduledPosts > 0 ? `${scheduledPosts} scheduled` : undefined} />
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovals > 0 && (
        <Link to={`/agency/approval-center?client=${clientId}`}
          className="flex items-center justify-between bg-amber-950/40 border border-amber-700/50 rounded-xl px-4 py-3 hover:bg-amber-950/60 transition-colors">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-bold text-amber-300">{pendingApprovals} item{pendingApprovals > 1 ? 's' : ''} awaiting approval</p>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-500" />
        </Link>
      )}

      {/* Campaigns */}
      {campaigns.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Campaigns</h3>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/agency/campaigns?client=${clientId}`} className="text-xs text-blue-400 hover:text-blue-300">View All →</Link>
              <button onClick={onCreateCampaign} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-800">
            {campaigns.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[c.status] || 'bg-slate-600'}`} />
                  <p className="text-sm text-white truncate">{c.campaign_name}</p>
                  {c.campaign_type && <span className="text-xs text-slate-600 hidden sm:inline">{c.campaign_type}</span>}
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spoke Campaigns */}
      {spokeCampaigns.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Spoke Campaigns</h3>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/agency/spoke-campaigns" className="text-xs text-blue-400 hover:text-blue-300">View All →</Link>
              <button onClick={onCreateSpoke} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-800">
            {spokeCampaigns.slice(0, 4).map(c => (
              <Link key={c.id} to={`/agency/spoke-campaigns/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[c.status] || 'bg-slate-600'}`} />
                  <p className="text-sm text-white truncate">{c.campaign_name}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content Assets */}
      {contentAssets.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Content Assets</h3>
            </div>
            <Link to={`/agency/content-asset?client=${clientId}`} className="text-xs text-blue-400 hover:text-blue-300">View All →</Link>
          </div>
          <div className="divide-y divide-slate-800">
            {contentAssets.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between px-5 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[a.status] || 'bg-slate-600'}`} />
                  <p className="text-sm text-white truncate">{a.asset_name}</p>
                  {a.platform && <span className="text-xs text-slate-600">{a.platform}</span>}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  a.approval_status === 'approved' ? 'bg-emerald-900/50 text-emerald-300' :
                  a.approval_status === 'rejected' ? 'bg-red-900/50 text-red-300' :
                  'bg-slate-800 text-slate-500'
                }`}>{a.approval_status || a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KPITile({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}