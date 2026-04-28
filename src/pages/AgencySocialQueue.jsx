import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import TutorialHighlight from '../components/agency/TutorialHighlight.jsx';
import { Plus, X, Send, Pencil, Trash2, CheckCircle, Zap, ExternalLink, AlertCircle } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';
const PLATFORMS = ['facebook','instagram','linkedin','x','threads','google_business_profile','youtube','tiktok'];
const PLATFORM_EMOJI = { facebook:'📘', instagram:'📷', linkedin:'💼', x:'𝕏', threads:'🧵', google_business_profile:'🟢', youtube:'▶️', tiktok:'🎵' };

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  scheduled: 'bg-blue-900/50 text-blue-300',
  published: 'bg-emerald-900/50 text-emerald-300',
  failed: 'bg-red-900/50 text-red-300',
  cancelled: 'bg-slate-800 text-slate-600',
};

export default function AgencySocialQueue() {
  const [posts, setPosts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ platform: 'facebook', post_text: '', media_url: '', scheduled_time: '', publish_status: 'draft', campaign_id: '', client_id: '' });

  const params = new URLSearchParams(window.location.search);
  const dateFilter = params.get('date'); // 'today' or null
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [p, c, cl] = await Promise.all([
      base44.entities.SocialPostQueue.list('-created_date', 200),
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.Clients.filter({ archived: false }),
    ]);
    setPosts(p); setCampaigns(c); setClients(cl); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    await base44.entities.SocialPostQueue.create(form);
    setShowModal(false);
    setSaving(false);
    load();
  };

  const updateStatus = async (id, publish_status) => {
    await base44.entities.SocialPostQueue.update(id, { publish_status });
    setPosts(p => p.map(post => post.id === id ? { ...post, publish_status } : post));
  };

  const cancelPost = async (post) => {
    if (!confirm(`Cancel this post? "${(post.post_text || '').slice(0, 40)}..."`)) return;
    await base44.entities.SocialPostQueue.update(post.id, { publish_status: 'cancelled' });
    // Unlink the source asset so it can be re-queued
    if (post.asset_id) {
      const assetUpdate = { queued: false };
      // If asset was in scheduled status, revert to approved
      const linked = await base44.entities.NTAContentAsset.filter({ id: post.asset_id }).catch(() => []);
      if (linked[0]?.status === 'scheduled') assetUpdate.status = 'approved';
      await base44.entities.NTAContentAsset.update(post.asset_id, assetUpdate).catch(() => {});
    }
    setPosts(p => p.map(p2 => p2.id === post.id ? { ...p2, publish_status: 'cancelled' } : p2));
  };

  const deletePost = async (post) => {
    if (!confirm(`Delete this post permanently? This cannot be undone.`)) return;
    await base44.entities.SocialPostQueue.delete(post.id);
    // Unlink the source asset
    if (post.asset_id) {
      const assetUpdate = { queued: false };
      const linked = await base44.entities.NTAContentAsset.filter({ id: post.asset_id }).catch(() => []);
      if (linked[0]?.status === 'scheduled') assetUpdate.status = 'approved';
      await base44.entities.NTAContentAsset.update(post.asset_id, assetUpdate).catch(() => {});
    }
    setPosts(p => p.filter(p2 => p2.id !== post.id));
  };

  const markPublished = async (id) => {
    await base44.entities.SocialPostQueue.update(id, { publish_status: 'published' });
    setPosts(p => p.map(post => post.id === id ? { ...post, publish_status: 'published' } : post));
  };

  const [promotingId, setPromotingId] = useState(null); // id of post currently being promoted
  const [editPostModal, setEditPostModal] = useState(null);
  const [editPostForm, setEditPostForm] = useState({});

  // Map platform → PublishingQueue provider (same values for supported platforms)
  const PUBLISHABLE_PROVIDERS = ['facebook', 'instagram', 'google_business_profile', 'youtube'];

  const sendToPublisher = async (post) => {
    // Duplicate guard
    if (post.sent_to_publisher || post.publishing_queue_id) {
      alert(`Already sent to publisher.\nPublishingQueue ID: ${post.publishing_queue_id || '(unknown)'}\nGo to Publishing Ops to check status.`);
      return;
    }

    // Eligibility checks
    if (!post.client_id) {
      await base44.entities.SocialPostQueue.update(post.id, { publisher_error: 'Missing client_id — cannot look up channel connection.' });
      setPosts(p => p.map(x => x.id === post.id ? { ...x, publisher_error: 'Missing client_id' } : x));
      return;
    }
    if (!post.post_text?.trim()) {
      await base44.entities.SocialPostQueue.update(post.id, { publisher_error: 'Missing post text.' });
      setPosts(p => p.map(x => x.id === post.id ? { ...x, publisher_error: 'Missing post text' } : x));
      return;
    }
    if (!PUBLISHABLE_PROVIDERS.includes(post.platform)) {
      const err = `Platform "${post.platform}" is not supported by the publishing engine (only Facebook, Instagram, GBP, YouTube).`;
      await base44.entities.SocialPostQueue.update(post.id, { publisher_error: err });
      setPosts(p => p.map(x => x.id === post.id ? { ...x, publisher_error: err } : x));
      return;
    }

    setPromotingId(post.id);

    // Look up ChannelConnection for this client + provider
    const conns = await base44.entities.ChannelConnection.filter({ client_id: post.client_id, provider: post.platform });
    const validConn = conns.find(c => ['ready', 'connected', 'connected_no_destination'].includes(c.status));

    if (!validConn) {
      const err = `No publishing connection found for this client + ${post.platform}. Go to Channel Connections to connect this channel.`;
      await base44.entities.SocialPostQueue.update(post.id, { publisher_error: err });
      setPosts(p => p.map(x => x.id === post.id ? { ...x, publisher_error: err } : x));
      setPromotingId(null);
      return;
    }

    // Build PublishingQueue record
    const publishStatus = post.scheduled_time ? 'scheduled' : 'queued';
    const pqRecord = await base44.entities.PublishingQueue.create({
      client_id: post.client_id,
      connection_id: validConn.id,
      provider: post.platform,
      content_type: post.media_url ? 'image_post' : 'text_post',
      body_text: post.post_text,
      caption: post.post_text,
      media_urls: post.media_url ? [post.media_url] : [],
      scheduled_for: post.scheduled_time || null,
      approval_status: 'approved',
      publish_status: publishStatus,
      source_content_id: post.asset_id || post.id,
      source_wizard: 'social_queue',
      ...(post.campaign_id ? { notes: `campaign_id:${post.campaign_id}` } : {}),
    });

    // Stamp the SocialPostQueue item
    await base44.entities.SocialPostQueue.update(post.id, {
      publishing_queue_id: pqRecord.id,
      sent_to_publisher: true,
      publish_status: publishStatus,
      publisher_error: null,
    });

    // Log the promotion
    await base44.entities.PostingLog.create({
      queue_id: pqRecord.id,
      client_id: post.client_id,
      provider: post.platform,
      event_type: 'scheduled',
      status: 'info',
      event_time: new Date().toISOString(),
      message: `SocialPostQueue promoted to PublishingQueue — social_queue_id=${post.id} publishing_queue_id=${pqRecord.id}`,
      payload: JSON.stringify({ social_queue_id: post.id, publishing_queue_id: pqRecord.id, client_id: post.client_id, provider: post.platform }),
    }).catch(() => {}); // non-blocking log

    setPosts(p => p.map(x => x.id === post.id ? { ...x, sent_to_publisher: true, publishing_queue_id: pqRecord.id, publish_status: publishStatus, publisher_error: null } : x));
    setPromotingId(null);
  };

  const openEditPost = (post) => {
    setEditPostForm({ post_text: post.post_text || '', scheduled_time: post.scheduled_time || '', media_url: post.media_url || '' });
    setEditPostModal(post);
  };

  const saveEditPost = async () => {
    await base44.entities.SocialPostQueue.update(editPostModal.id, editPostForm);
    setPosts(p => p.map(post => post.id === editPostModal.id ? { ...post, ...editPostForm } : post));
    setEditPostModal(null);
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // If ?date=today, show only scheduled posts for today
  const dateFiltered = dateFilter === 'today'
    ? posts.filter(p => p.publish_status === 'scheduled' && p.scheduled_time?.startsWith(todayStr))
    : posts;

  const filtered = dateFiltered.filter(p => filterPlatform === 'all' || p.platform === filterPlatform);
  const scheduled = posts.filter(p => p.publish_status === 'scheduled').length;
  const published = posts.filter(p => p.publish_status === 'published').length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Social Queue</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {dateFilter === 'today' ? `Showing scheduled posts for today (${todayStr})` : 'Scheduled and published posts across all platforms'}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> Add Post
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-3xl font-black text-blue-400">{scheduled}</p><p className="text-xs text-slate-500 mt-0.5">Scheduled</p></div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-3xl font-black text-emerald-400">{published}</p><p className="text-xs text-slate-500 mt-0.5">Published</p></div>
        </div>

        {/* Platform filter pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterPlatform('all')} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filterPlatform === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>All</button>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setFilterPlatform(p)} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filterPlatform === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {PLATFORM_EMOJI[p]} {p.replace(/_/g,' ')}
            </button>
          ))}
        </div>

        {/* Table */}
        <TutorialHighlight id="social-queue-table">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <Send className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              {dateFilter === 'today' ? (
                <>
                  <p className="text-slate-400 text-sm font-semibold mb-1">No posts scheduled for today in the Social Queue.</p>
                  <p className="text-slate-600 text-xs max-w-sm mx-auto">Dashboard may show scheduled assets from Content Queue — those need to be approved and queued first. Go to <a href="/agency/approval-center" className="text-blue-400 hover:underline">Approval Center</a> to queue approved content.</p>
                </>
              ) : (
                <p className="text-slate-600 text-sm">No posts in queue.</p>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">{['Platform','Post Text','Scheduled','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{PLATFORM_EMOJI[p.platform]} {p.platform?.replace(/_/g,' ')}</td>
                    <td className="px-4 py-3"><p className="text-white text-sm truncate max-w-[280px]">{p.post_text || '—'}</p></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.scheduled_time ? new Date(p.scheduled_time).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.publish_status] || 'bg-slate-700 text-slate-400'}`}>{p.publish_status}</span></td>
                    <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        <select value={p.publish_status} onChange={e => updateStatus(p.id, e.target.value)}
                          className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5">
                          <option value="draft">Draft</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="queued">Queued</option>
                          <option value="published">Published</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={() => openEditPost(p)} title="Edit" className="p-1.5 text-slate-500 hover:text-blue-400 bg-slate-800 hover:bg-slate-700 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                        {p.publish_status !== 'published' && (
                          <button onClick={() => markPublished(p.id)} title="Mark Published" className="p-1.5 text-slate-500 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-lg"><CheckCircle className="w-3.5 h-3.5" /></button>
                        )}
                        {!['cancelled','published'].includes(p.publish_status) && (
                          <button onClick={() => cancelPost(p)} title="Cancel (unlinks asset)" className="p-1.5 text-slate-500 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                        {p.publish_status === 'cancelled' && (
                          <button onClick={() => deletePost(p)} title="Delete permanently" className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                      {/* Send to Publisher bridge */}
                      {!['cancelled','published'].includes(p.publish_status) && (
                        p.sent_to_publisher || p.publishing_queue_id ? (
                          <a href="/agency/publishing-ops" title="View in Publishing Ops"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                            <ExternalLink className="w-3 h-3" /> In Publisher Queue
                          </a>
                        ) : (
                          <button
                            onClick={() => sendToPublisher(p)}
                            disabled={promotingId === p.id || !p.client_id || !p.post_text}
                            title={!p.client_id ? 'Set a client first' : !p.post_text ? 'Post text required' : 'Promote to PublishingQueue for real publishing'}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-violet-900/40 hover:bg-violet-900/70 text-violet-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            <Zap className="w-3 h-3" />
                            {promotingId === p.id ? 'Sending...' : 'Send to Publisher'}
                          </button>
                        )
                      )}
                      {/* Publisher error */}
                      {p.publisher_error && (
                        <p className="text-xs text-red-400 flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          {p.publisher_error}
                        </p>
                      )}
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </TutorialHighlight>
      </div>

      {/* Edit Post Modal */}
      {editPostModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Edit Post</h2>
              <button onClick={() => setEditPostModal(null)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={LBL}>Post Text</label><textarea value={editPostForm.post_text} onChange={e => setEditPostForm(p => ({ ...p, post_text: e.target.value }))} rows={4} className={IN} /></div>
              <div><label className={LBL}>Media URL</label><input value={editPostForm.media_url} onChange={e => setEditPostForm(p => ({ ...p, media_url: e.target.value }))} className={IN} /></div>
              <div><label className={LBL}>Scheduled Time</label><input type="datetime-local" value={editPostForm.scheduled_time} onChange={e => setEditPostForm(p => ({ ...p, scheduled_time: e.target.value }))} className={IN} /></div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setEditPostModal(null)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={saveEditPost} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Add Post to Queue</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={LBL}>Platform</label>
                <select value={form.platform} onChange={e => f('platform', e.target.value)} className={IN}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Post Text *</label><textarea value={form.post_text} onChange={e => f('post_text', e.target.value)} rows={4} className={IN} /></div>
              <div><label className={LBL}>Media URL</label><input value={form.media_url} onChange={e => f('media_url', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Scheduled Time</label><input type="datetime-local" value={form.scheduled_time} onChange={e => f('scheduled_time', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Campaign</label>
                <select value={form.campaign_id} onChange={e => f('campaign_id', e.target.value)} className={IN}>
                  <option value="">None</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Client</label>
                <select value={form.client_id} onChange={e => f('client_id', e.target.value)} className={IN}>
                  <option value="">Internal</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving || !form.post_text} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Add Post'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}