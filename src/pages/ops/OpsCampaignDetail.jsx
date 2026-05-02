import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import CampaignProgressTracker from '../../components/ops-dashboard/CampaignProgressTracker';
import CampaignRelatedItems from '../../components/ops-dashboard/CampaignRelatedItems';
import {
  ArrowLeft, RefreshCw, Edit2, Globe, Zap, FileText,
  Search, Megaphone, Share2, Video, Image, CheckSquare,
  Calendar, BarChart2, CheckCircle2, AlertCircle, ExternalLink
} from 'lucide-react';

const STATUS_COLORS = {
  planning: 'bg-slate-700 text-slate-300',
  active: 'bg-emerald-900/40 text-emerald-300',
  paused: 'bg-yellow-900/40 text-yellow-300',
  completed: 'bg-blue-900/40 text-blue-300',
};
const SEASON_ICONS = { spring: '🌱', summer: '☀️', fall: '🍂', winter: '❄️', year_round: '🔄', custom: '⚡' };

function InfoRow({ label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-slate-800 last:border-0">
      <span className="text-slate-500 text-xs font-medium flex-shrink-0 w-32">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1 text-right">
          {value} <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <span className="text-slate-300 text-sm text-right">{value}</span>
      )}
    </div>
  );
}

function ActionBtn({ label, icon: Icon, color, onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${color}`}
    >
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin flex-shrink-0" />
        : <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  );
}

function EditModal({ campaign, clients, onSave, onClose }) {
  const [form, setForm] = useState({ ...campaign });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Campaign.update(campaign.id, form);
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">Edit Campaign</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Client</label>
            <select value={form.client_id} onChange={e => set('client_id', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
          {[
            { key: 'campaign_name', label: 'Campaign Name', required: true },
            { key: 'service_focus', label: 'Service Focus' },
            { key: 'offer', label: 'Offer / CTA' },
            { key: 'location', label: 'Target Location' },
            { key: 'target_audience', label: 'Target Audience' },
            { key: 'landing_page_url', label: 'Landing Page URL' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
              <input required={f.required} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Season</label>
              <select value={form.season} onChange={e => set('season', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['spring','summer','fall','winter','year_round','custom'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['planning','active','paused','completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpsCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [relatedData, setRelatedData] = useState({ seoPages: [], assets: [], videos: [], socialPosts: [], leads: [], reports: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');
  const [runningAction, setRunningAction] = useState(null);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(''), 4000);
  };

  const load = async () => {
    setLoading(true);
    const list = await base44.entities.Campaign.list('-created_date', 500);
    const c = list.find(x => x.id === id);
    if (!c) { navigate('/ops/campaigns'); return; }
    setCampaign(c);

    const [clientList, seoPages, assets, videos, socialPosts, leads, reports] = await Promise.all([
      base44.entities.Client.list('-created_date', 100),
      base44.entities.SEOPage.filter({ campaign_id: id }),
      base44.entities.ContentAsset.filter({ campaign_id: id }),
      base44.entities.VideoScript.filter({ campaign_id: id }),
      base44.entities.SocialPost.filter({ campaign_id: id }),
      base44.entities.Lead.filter({ campaign_id: id }),
      base44.entities.Report.filter({ campaign_id: id }).catch(() => []),
    ]);

    setClients(clientList);
    if (c.client_id) setClient(clientList.find(cl => cl.id === c.client_id) || null);
    setRelatedData({ seoPages, assets, videos, socialPosts, leads, reports });
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const runAction = async (actionKey, fnName, payload, successMsg) => {
    setRunningAction(actionKey);
    const res = await base44.functions.invoke(fnName, payload);
    if (res.data?.success === false || res.data?.error) {
      showToast(res.data?.error || 'Action failed', true);
    } else {
      showToast(successMsg);
    }
    setRunningAction(null);
    load();
  };

  const handleSendApproval = async () => {
    setRunningAction('approval');
    // Move all draft assets for this campaign to pending approval
    const drafts = relatedData.assets.filter(a => a.approval_status === 'pending' || a.status === 'draft');
    await Promise.all(drafts.map(a =>
      base44.entities.ContentAsset.update(a.id, { approval_status: 'pending', status: 'ready' })
    ));
    showToast(`✓ ${drafts.length} assets sent to approval queue`);
    setRunningAction(null);
    load();
  };

  const handleSchedulePosts = async () => {
    setRunningAction('schedule');
    const approved = relatedData.assets.filter(a => a.approval_status === 'approved' && a.status !== 'scheduled');
    let count = 0;
    // Schedule approved posts 3 days apart starting tomorrow
    for (let i = 0; i < approved.length; i++) {
      const schedDate = new Date();
      schedDate.setDate(schedDate.getDate() + 1 + i * 3);
      await base44.entities.ContentAsset.update(approved[i].id, {
        status: 'scheduled',
        scheduled_date: schedDate.toISOString(),
      });
      count++;
    }
    showToast(`✓ ${count} approved assets scheduled`);
    setRunningAction(null);
    load();
  };

  const handleGenerateReport = async () => {
    setRunningAction('report');
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await base44.entities.Report.create({
      client_id: campaign.client_id,
      campaign_id: id,
      report_month: month,
      leads_generated: relatedData.leads.length,
      pages_created: relatedData.seoPages.length,
      posts_published: relatedData.socialPosts.filter(p => p.status === 'published').length,
      videos_created: relatedData.videos.length,
      summary: `Monthly report for ${campaign.campaign_name} — ${month}. ${relatedData.leads.length} leads, ${relatedData.seoPages.length} SEO pages, ${relatedData.videos.length} videos.`,
    });
    showToast('✓ Monthly report created');
    setRunningAction(null);
    load();
  };

  // Derive progress stages from related data
  const progress = campaign ? {
    strategy: true, // always done if campaign exists
    landing_page: relatedData.assets.some(a => a.asset_type === 'landing_page'),
    seo_pages: relatedData.seoPages.length > 0,
    ads: relatedData.assets.some(a => a.asset_type === 'ad_copy'),
    social_posts: relatedData.socialPosts.length > 0,
    video: relatedData.videos.length > 0,
    approval: relatedData.assets.some(a => a.approval_status === 'approved'),
    launch: campaign.status === 'active' || campaign.status === 'completed',
    report: relatedData.reports.length > 0,
  } : {};

  if (loading) return (
    <OpsLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </OpsLayout>
  );

  if (!campaign) return null;

  return (
    <OpsLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${toast.isError ? 'bg-red-600' : 'bg-emerald-600'} text-white`}>
          {toast.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="p-6 space-y-5 max-w-5xl mx-auto">
        {/* Back + Header */}
        <div>
          <button onClick={() => navigate('/ops/campaigns')} className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Campaigns
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{campaign.campaign_name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${STATUS_COLORS[campaign.status] || 'bg-slate-700 text-slate-400'}`}>{campaign.status}</span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                  {SEASON_ICONS[campaign.season]} {campaign.season?.replace('_', ' ')}
                </span>
              </div>
              {client && <p className="text-slate-400 text-sm mt-1">{client.business_name} · {client.industry || 'Local Service'}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <CampaignProgressTracker progress={progress} />

        {/* Two-col layout */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT: Overview */}
          <div className="lg:col-span-1 space-y-4">
            {/* Campaign Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Campaign Details</h2>
              <InfoRow label="Service Focus" value={campaign.service_focus} />
              <InfoRow label="Offer / CTA" value={campaign.offer} />
              <InfoRow label="Target Location" value={campaign.location} />
              <InfoRow label="Target Audience" value={campaign.target_audience} />
              <InfoRow label="Landing Page" value={campaign.landing_page_url ? '↗ View Page' : null} href={campaign.landing_page_url} />
              <InfoRow label="Start Date" value={campaign.start_date} />
              <InfoRow label="End Date" value={campaign.end_date} />
            </div>

            {/* Client Info */}
            {client && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Client</h2>
                <InfoRow label="Business" value={client.business_name} />
                <InfoRow label="Industry" value={client.industry} />
                <InfoRow label="Service Area" value={client.service_area} />
                <InfoRow label="Contact" value={client.contact_name} />
                <InfoRow label="Phone" value={client.call_number || client.phone} />
                <InfoRow label="Website" value={client.website ? '↗ View' : null} href={client.website} />
              </div>
            )}

            {/* Notes */}
            {campaign.notes && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{campaign.notes}</p>
              </div>
            )}
          </div>

          {/* RIGHT: Actions + Related */}
          <div className="lg:col-span-2 space-y-5">

            {/* Action Buttons */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Generate Content</h2>
              <div className="grid grid-cols-2 gap-2">
                <ActionBtn
                  label="Landing Page Copy"
                  icon={Globe}
                  color="bg-blue-700 hover:bg-blue-600 text-white"
                  loading={runningAction === 'landing'}
                  onClick={() => runAction('landing', 'ntaGenerateCampaignContent', { campaign_id: id, type: 'landing_page' }, '✓ Landing page copy generated')}
                />
                <ActionBtn
                  label="SEO Pages"
                  icon={Search}
                  color="bg-purple-700 hover:bg-purple-600 text-white"
                  loading={runningAction === 'seo'}
                  onClick={() => runAction('seo', 'ntaGenerateCampaignContent', { campaign_id: id, type: 'seo_pages' }, '✓ SEO pages generated')}
                />
                <ActionBtn
                  label="Facebook Ads"
                  icon={Megaphone}
                  color="bg-indigo-700 hover:bg-indigo-600 text-white"
                  loading={runningAction === 'ads'}
                  onClick={() => runAction('ads', 'ntaGenerateCampaignContent', { campaign_id: id, type: 'facebook_ads' }, '✓ Facebook ads generated')}
                />
                <ActionBtn
                  label="Social Posts"
                  icon={Share2}
                  color="bg-teal-700 hover:bg-teal-600 text-white"
                  loading={runningAction === 'social'}
                  onClick={() => runAction('social', 'ntaGenerateCampaignContent', { campaign_id: id, type: 'social_posts' }, '✓ Social posts generated')}
                />
                <ActionBtn
                  label="Video Script"
                  icon={Video}
                  color="bg-rose-700 hover:bg-rose-600 text-white"
                  loading={runningAction === 'video'}
                  onClick={() => runAction('video', 'ntaGenerateCampaignContent', { campaign_id: id, type: 'video_script' }, '✓ Video script generated')}
                />
                <ActionBtn
                  label="Image Overlay Text"
                  icon={Image}
                  color="bg-orange-700 hover:bg-orange-600 text-white"
                  loading={runningAction === 'overlay'}
                  onClick={() => runAction('overlay', 'ntaGenerateCampaignContent', { campaign_id: id, type: 'image_overlay' }, '✓ Image overlay text generated')}
                />
              </div>

              <div className="border-t border-slate-800 mt-3 pt-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Workflow Actions</h2>
                <div className="grid grid-cols-3 gap-2">
                  <ActionBtn
                    label="Send to Approval"
                    icon={CheckSquare}
                    color="bg-yellow-700 hover:bg-yellow-600 text-white"
                    loading={runningAction === 'approval'}
                    onClick={handleSendApproval}
                  />
                  <ActionBtn
                    label="Schedule Posts"
                    icon={Calendar}
                    color="bg-slate-600 hover:bg-slate-500 text-white"
                    loading={runningAction === 'schedule'}
                    onClick={handleSchedulePosts}
                  />
                  <ActionBtn
                    label="Monthly Report"
                    icon={BarChart2}
                    color="bg-sky-700 hover:bg-sky-600 text-white"
                    loading={runningAction === 'report'}
                    onClick={handleGenerateReport}
                  />
                </div>
              </div>
            </div>

            {/* Related Items */}
            <CampaignRelatedItems data={relatedData} campaignId={id} />
          </div>
        </div>
      </div>

      {editing && (
        <EditModal
          campaign={campaign}
          clients={clients}
          onSave={() => { setEditing(false); load(); }}
          onClose={() => setEditing(false)}
        />
      )}
    </OpsLayout>
  );
}