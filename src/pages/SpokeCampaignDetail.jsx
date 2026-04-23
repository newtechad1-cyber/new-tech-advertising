import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import {
  ArrowLeft, FileText, Video, Film, Share2, Mail,
  CheckCircle, Clock, Send, Plus, ExternalLink, Zap
} from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';

const PLATFORM_EMOJI = { facebook:'📘', instagram:'📷', linkedin:'💼', x:'𝕏', threads:'🧵', google_business_profile:'🟢', youtube:'▶️', tiktok:'🎵', email:'✉️' };
const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  ready_for_review: 'bg-violet-900/50 text-violet-300',
  needs_reapproval: 'bg-orange-900/50 text-orange-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  scheduled: 'bg-blue-900/50 text-blue-300',
  published: 'bg-teal-900/50 text-teal-300',
  rejected: 'bg-red-900/50 text-red-300',
};

// Progress targets
const TARGETS = {
  insight: 1,
  video: 1,
  short_video: 5,
  social_post: 10,
  email: 3,
};

export default function SpokeCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [assets, setAssets] = useState([]);
  const [insightPages, setInsightPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  // Insight page modal
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [insightForm, setInsightForm] = useState({});
  const [savingInsight, setSavingInsight] = useState(false);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    const [camp, a, ip] = await Promise.all([
      base44.entities.SpokeCampaign.get(id),
      base44.entities.NTAContentAsset.filter({ campaign_id: id }),
      base44.entities.InsightPage.filter({ campaign_id: id }),
    ]);
    setCampaign(camp);
    setAssets(a);
    setInsightPages(ip);
    setLoading(false);
  };

  // ── Action: Create Insight Page (modal pre-fill) ─────────────────────────────
  const openInsightModal = () => {
    setInsightForm({
      title: campaign.campaign_name,
      headline: campaign.campaign_name,
      subheadline: campaign.core_theme || '',
      campaign_id: campaign.id,
      cta_link: campaign.cta_url || '',
      cta_text: 'Get Started',
      publish_status: 'draft',
      article_body: '',
      video_url: '',
      slug: campaign.campaign_slug || campaign.campaign_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
    setShowInsightModal(true);
  };

  const saveInsight = async () => {
    setSavingInsight(true);
    await base44.entities.InsightPage.create(insightForm);
    setShowInsightModal(false);
    setSavingInsight(false);
    load();
  };

  // ── Action: Create Anchor Video ──────────────────────────────────────────────
  const createAnchorVideo = async () => {
    setWorking(true);
    await base44.entities.NTAContentAsset.create({
      asset_name: `${campaign.campaign_name} — Anchor Video`,
      asset_type: 'video',
      platform: 'youtube',
      campaign_id: campaign.id,
      status: 'draft',
      approval_status: 'draft',
      headline: campaign.campaign_name,
      cta: campaign.cta_url || '',
      queued: false,
    });
    setWorking(false);
    load();
  };

  // ── Action: Create Short Video Assets ────────────────────────────────────────
  const createShortVideos = async () => {
    setWorking(true);
    const platforms = ['tiktok', 'instagram', 'instagram', 'youtube', 'tiktok', 'instagram'];
    await Promise.all(platforms.map((platform, i) =>
      base44.entities.NTAContentAsset.create({
        asset_name: `${campaign.campaign_name} — Short Video ${i + 1}`,
        asset_type: 'short_video',
        platform,
        campaign_id: campaign.id,
        status: 'draft',
        approval_status: 'draft',
        queued: false,
      })
    ));
    setWorking(false);
    load();
  };

  // ── Action: Create Social Post Set ───────────────────────────────────────────
  const createSocialPostSet = async () => {
    setWorking(true);
    const platforms = ['facebook','instagram','linkedin','x','threads','google_business_profile','tiktok','facebook','instagram','linkedin'];
    await Promise.all(platforms.map((platform, i) =>
      base44.entities.NTAContentAsset.create({
        asset_name: `${campaign.campaign_name} — Social Post ${i + 1} (${platform})`,
        asset_type: 'social_post',
        platform,
        campaign_id: campaign.id,
        status: 'draft',
        approval_status: 'draft',
        queued: false,
      })
    ));
    setWorking(false);
    load();
  };

  // ── Action: Create Email Sequence ────────────────────────────────────────────
  const createEmailSequence = async () => {
    setWorking(true);
    const emails = [
      `${campaign.campaign_name} — Email 1: Introduction`,
      `${campaign.campaign_name} — Email 2: Value & Proof`,
      `${campaign.campaign_name} — Email 3: CTA & Offer`,
    ];
    await Promise.all(emails.map(name =>
      base44.entities.NTAContentAsset.create({
        asset_name: name,
        asset_type: 'email',
        platform: 'facebook', // fallback; email type
        campaign_id: campaign.id,
        status: 'draft',
        approval_status: 'draft',
        queued: false,
      })
    ));
    setWorking(false);
    load();
  };

  // ── Quick action: Approve all drafts ────────────────────────────────────────
  const approveAllDrafts = async () => {
    setWorking(true);
    const drafts = assets.filter(a => ['draft','ready_for_review','pending_internal'].includes(a.approval_status));
    await Promise.all(drafts.map(a =>
      base44.entities.NTAContentAsset.update(a.id, { approval_status: 'approved', status: 'approved' })
    ));
    setWorking(false);
    load();
  };

  // ── Quick action: Schedule approved assets (sets scheduled_date = now + 1 day) ─
  const scheduleApproved = async () => {
    setWorking(true);
    const approved = assets.filter(a => a.approval_status === 'approved' && !['scheduled','published'].includes(a.status));
    const base = new Date(); base.setDate(base.getDate() + 1);
    await Promise.all(approved.map((a, i) => {
      const d = new Date(base); d.setHours(9 + (i % 8));
      return base44.entities.NTAContentAsset.update(a.id, {
        status: 'scheduled',
        scheduled_date: d.toISOString(),
      });
    }));
    setWorking(false);
    load();
  };

  // ── Asset grouping ───────────────────────────────────────────────────────────
  const groups = {
    video: assets.filter(a => a.asset_type === 'video'),
    short_video: assets.filter(a => a.asset_type === 'short_video'),
    social_post: assets.filter(a => a.asset_type === 'social_post'),
    email: assets.filter(a => a.asset_type === 'email'),
  };

  // ── Progress ─────────────────────────────────────────────────────────────────
  const progress = [
    { label: 'Insight Page', type: 'insight', count: insightPages.length, target: TARGETS.insight, icon: FileText, color: 'text-violet-400' },
    { label: 'Anchor Video', type: 'video', count: groups.video.length, target: TARGETS.video, icon: Video, color: 'text-red-400' },
    { label: 'Short Videos', type: 'short_video', count: groups.short_video.length, target: TARGETS.short_video, icon: Film, color: 'text-amber-400' },
    { label: 'Social Posts', type: 'social_post', count: groups.social_post.length, target: TARGETS.social_post, icon: Share2, color: 'text-blue-400' },
    { label: 'Emails', type: 'email', count: groups.email.length, target: TARGETS.email, icon: Mail, color: 'text-emerald-400' },
  ];

  if (loading) return (
    <AgencyLayout>
      <div className="p-6 text-slate-500 text-sm">Loading campaign...</div>
    </AgencyLayout>
  );

  if (!campaign) return (
    <AgencyLayout>
      <div className="p-6 text-slate-500 text-sm">Campaign not found.</div>
    </AgencyLayout>
  );

  return (
    <AgencyLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <Link to="/agency/spoke-campaigns" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Campaigns
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white">{campaign.campaign_name}</h1>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${campaign.status === 'active' ? 'bg-emerald-900/50 text-emerald-300' : campaign.status === 'completed' ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-400'}`}>{campaign.status}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{[campaign.pillar, campaign.core_theme, campaign.target_audience].filter(Boolean).join(' · ')}</p>
              {campaign.primary_offer && <p className="text-slate-500 text-sm mt-0.5">Offer: {campaign.primary_offer}</p>}
              {campaign.cta_url && <a href={campaign.cta_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3" /> {campaign.cta_url}</a>}
            </div>
            <Link to={`/agency/content-asset?campaign=${campaign.id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-lg">
              View All Assets <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Campaign Progress */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Campaign Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {progress.map(p => {
              const pct = Math.min(100, Math.round((p.count / p.target) * 100));
              const done = p.count >= p.target;
              const Icon = p.icon;
              return (
                <div key={p.type} className={`bg-slate-900 border rounded-xl p-4 ${done ? 'border-emerald-800/50' : 'border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    {done && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className={`text-2xl font-black ${done ? 'text-emerald-400' : p.color}`}>{p.count}<span className="text-slate-600 text-base font-normal">/{p.target}</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.label}</p>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Campaign Actions */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Campaign Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ActionCard
              icon={FileText}
              color="text-violet-400"
              bg="bg-violet-900/20 hover:bg-violet-900/30 border-violet-900/40"
              title="Create Insight Page"
              desc="Build the authority landing page for this campaign"
              onClick={openInsightModal}
              disabled={working}
              badge={insightPages.length > 0 ? `${insightPages.length} existing` : null}
            />
            <ActionCard
              icon={Video}
              color="text-red-400"
              bg="bg-red-900/20 hover:bg-red-900/30 border-red-900/40"
              title="Create Anchor Video"
              desc="YouTube long-form video asset for this campaign"
              onClick={createAnchorVideo}
              disabled={working}
              badge={groups.video.length > 0 ? `${groups.video.length} existing` : null}
            />
            <ActionCard
              icon={Film}
              color="text-amber-400"
              bg="bg-amber-900/20 hover:bg-amber-900/30 border-amber-900/40"
              title="Create Short Video Assets"
              desc="Bulk create 6 short-form videos for TikTok, Reels & Shorts"
              onClick={createShortVideos}
              disabled={working}
            />
            <ActionCard
              icon={Share2}
              color="text-blue-400"
              bg="bg-blue-900/20 hover:bg-blue-900/30 border-blue-900/40"
              title="Create Social Post Set"
              desc="Bulk create 10 posts across all major platforms"
              onClick={createSocialPostSet}
              disabled={working}
            />
            <ActionCard
              icon={Mail}
              color="text-emerald-400"
              bg="bg-emerald-900/20 hover:bg-emerald-900/30 border-emerald-900/40"
              title="Create Email Sequence"
              desc="3-part email sequence: Intro, Value, CTA"
              onClick={createEmailSequence}
              disabled={working}
              badge={groups.email.length > 0 ? `${groups.email.length} existing` : null}
            />
          </div>
          {working && <p className="text-xs text-slate-500 mt-2 animate-pulse">Creating assets…</p>}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link to={`/agency/content-asset?campaign=${campaign.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg border border-slate-700">
              <Zap className="w-3.5 h-3.5" /> Open All Assets
            </Link>
            <button onClick={approveAllDrafts} disabled={working}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 text-sm font-semibold rounded-lg border border-emerald-900/40 disabled:opacity-50">
              <CheckCircle className="w-3.5 h-3.5" /> Approve All Drafts
            </button>
            <button onClick={scheduleApproved} disabled={working}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-sm font-semibold rounded-lg border border-blue-900/40 disabled:opacity-50">
              <Clock className="w-3.5 h-3.5" /> Schedule Approved Assets
            </button>
            <Link to={`/agency/insight-pages?campaign=${campaign.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg border border-slate-700">
              <FileText className="w-3.5 h-3.5" /> Manage Insight Pages
            </Link>
          </div>
        </section>

        {/* Insight Pages for this campaign */}
        {insightPages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Insight Pages</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {insightPages.map(ip => (
                <div key={ip.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{ip.title}</p>
                    <p className="text-xs text-slate-500 font-mono">/insights/{ip.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ip.publish_status === 'published' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>{ip.publish_status}</span>
                    {ip.publish_status === 'published' && (
                      <Link to={`/insights/${ip.slug}`} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Campaign Assets by Group */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Campaign Assets</h2>
          {assets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
              <p className="text-slate-600 text-sm">No assets yet. Use Campaign Actions above to generate content.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {[
                { key: 'video', label: 'Videos', items: groups.video, icon: Video },
                { key: 'short_video', label: 'Short Videos', items: groups.short_video, icon: Film },
                { key: 'social_post', label: 'Social Posts', items: groups.social_post, icon: Share2 },
                { key: 'email', label: 'Emails', items: groups.email, icon: Mail },
              ].filter(g => g.items.length > 0).map(group => (
                <div key={group.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <group.icon className="w-4 h-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-300">{group.label} <span className="text-slate-600 font-normal">({group.items.length})</span></p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
                    {group.items.map(a => (
                      <div key={a.id} className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.asset_name}</p>
                          <p className="text-xs text-slate-500">{PLATFORM_EMOJI[a.platform]} {a.platform?.replace(/_/g,' ')}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] || 'bg-slate-700 text-slate-400'}`}>{a.status?.replace(/_/g,' ')}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${a.approval_status === 'approved' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>{a.approval_status?.replace(/_/g,' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Insight Page Modal */}
      {showInsightModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Create Insight Page</h2>
              <button onClick={() => setShowInsightModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ['title','Title *'],['slug','URL Slug'],['headline','Headline'],['subheadline','Subheadline'],
                ['cta_text','CTA Button Text'],['cta_link','CTA Link'],['video_url','Video URL (optional)'],
              ].map(([k, l]) => (
                <div key={k}><label className={LBL}>{l}</label>
                  <input value={insightForm[k] || ''} onChange={e => setInsightForm(p => ({ ...p, [k]: e.target.value }))} className={IN} />
                </div>
              ))}
              <div><label className={LBL}>Article Body (Markdown)</label>
                <textarea value={insightForm.article_body || ''} onChange={e => setInsightForm(p => ({ ...p, article_body: e.target.value }))} rows={5} className={IN} placeholder="Write content in Markdown..." />
              </div>
              <div><label className={LBL}>Publish Status</label>
                <select value={insightForm.publish_status} onChange={e => setInsightForm(p => ({ ...p, publish_status: e.target.value }))} className={IN}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowInsightModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={saveInsight} disabled={savingInsight || !insightForm.title} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg">
                {savingInsight ? 'Saving...' : 'Create Insight Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

function ActionCard({ icon: Icon, color, bg, title, desc, onClick, disabled, badge }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`text-left border rounded-xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${bg}`}>
      <div className="flex items-start justify-between mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        {badge && <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </button>
  );
}