import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, X, Send } from 'lucide-react';

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
                      <select value={p.publish_status} onChange={e => updateStatus(p.id, e.target.value)}
                        className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5">
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

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