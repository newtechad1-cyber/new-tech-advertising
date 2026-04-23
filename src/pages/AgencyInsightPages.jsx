import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, X, ExternalLink, FileText } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';
const STATUS_COLORS = { draft: 'bg-slate-700 text-slate-400', published: 'bg-emerald-900/50 text-emerald-300', archived: 'bg-slate-800 text-slate-600' };

const BLANK = { title: '', slug: '', headline: '', subheadline: '', article_body: '', video_url: '', cta_text: '', cta_link: '', campaign_id: '', publish_status: 'draft' };

export default function AgencyInsightPages() {
  const [pages, setPages] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [filterCampaign, setFilterCampaign] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const camp = params.get('campaign');
    if (camp) { setFilterCampaign(camp); setForm(p => ({ ...p, campaign_id: camp })); }
    load();
  }, []);

  const load = async () => {
    const [pg, c] = await Promise.all([
      base44.entities.InsightPage.list('-created_date', 200),
      base44.entities.SpokeCampaign.list('-created_date', 100),
    ]);
    setPages(pg); setCampaigns(c); setLoading(false);
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await base44.entities.InsightPage.create({ ...form, slug });
    setShowModal(false);
    setForm(BLANK);
    setSaving(false);
    load();
  };

  const togglePublish = async (page) => {
    const newStatus = page.publish_status === 'published' ? 'draft' : 'published';
    await base44.entities.InsightPage.update(page.id, { publish_status: newStatus });
    load();
  };

  const campMap = Object.fromEntries(campaigns.map(c => [c.id, c]));
  const filtered = pages.filter(p => !filterCampaign || p.campaign_id === filterCampaign);
  const published = pages.filter(p => p.publish_status === 'published').length;
  const drafts = pages.filter(p => p.publish_status === 'draft').length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Insight Pages</h1>
            <p className="text-slate-500 text-sm mt-0.5">Authority content pages linked to spoke campaigns</p>
          </div>
          <div className="flex gap-2">
            <Link to="/insights" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-lg">
              <ExternalLink className="w-3.5 h-3.5" /> Public View
            </Link>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
              <Plus className="w-4 h-4" /> New Insight Page
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-2xl font-black text-white">{pages.length}</p><p className="text-xs text-slate-500">Total</p></div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-2xl font-black text-emerald-400">{published}</p><p className="text-xs text-slate-500">Published</p></div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-2xl font-black text-slate-400">{drafts}</p><p className="text-xs text-slate-500">Drafts</p></div>
        </div>

        {/* Campaign filter */}
        <div className="flex gap-2">
          <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2">
            <option value="">All Campaigns</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
          </select>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-sm mb-3">No insight pages yet.</p>
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 text-xs px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"><Plus className="w-3.5 h-3.5" /> Create First Insight</button>
            </div>
          ) : filtered.map(page => (
            <div key={page.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{page.title}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[page.publish_status]}`}>{page.publish_status}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{page.headline || '—'} · Campaign: {campMap[page.campaign_id]?.campaign_name || 'Unlinked'}</p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">/insights/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {page.publish_status === 'published' && (
                  <Link to={`/insights/${page.slug}`} target="_blank" className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> View
                  </Link>
                )}
                <Link to={`/agency/content-asset?insight=${page.id}&campaign=${page.campaign_id}`} className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">
                  Assets
                </Link>
                <button onClick={() => togglePublish(page)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${page.publish_status === 'published' ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-emerald-800/50 hover:bg-emerald-800 text-emerald-300'}`}>
                  {page.publish_status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">New Insight Page</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={LBL}>Campaign *</label>
                <select value={form.campaign_id} onChange={e => f('campaign_id', e.target.value)} className={IN}>
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
                </select>
              </div>
              {[['title','Title *'],['slug','URL Slug (auto-generated if blank)'],['headline','Headline'],['subheadline','Subheadline'],['video_url','Video URL'],['cta_text','CTA Button Text'],['cta_link','CTA Link']].map(([k,l]) => (
                <div key={k}><label className={LBL}>{l}</label><input value={form[k] || ''} onChange={e => f(k, e.target.value)} className={IN} /></div>
              ))}
              <div><label className={LBL}>Article Body (Markdown)</label>
                <textarea value={form.article_body} onChange={e => f('article_body', e.target.value)} rows={6} className={IN} placeholder="Write article content in Markdown..." />
              </div>
              <div><label className={LBL}>Publish Status</label>
                <select value={form.publish_status} onChange={e => f('publish_status', e.target.value)} className={IN}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.campaign_id} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Create Insight Page'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}