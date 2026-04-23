import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, X, Video, CheckCircle } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';

const STATUS_COLORS = {
  not_started: 'bg-slate-700 text-slate-400',
  script_ready: 'bg-amber-900/50 text-amber-300',
  in_production: 'bg-blue-900/50 text-blue-300',
  completed: 'bg-emerald-900/50 text-emerald-300',
  failed: 'bg-red-900/50 text-red-300',
};

export default function AgencyVideoQueue() {
  const [videos, setVideos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', script: '', avatar_template: '', voice: '', render_status: 'not_started', campaign_id: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [v, c] = await Promise.all([
      base44.entities.NTAVideoAsset.list('-created_date', 100),
      base44.entities.SpokeCampaign.list('-created_date', 100),
    ]);
    setVideos(v); setCampaigns(c); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    await base44.entities.NTAVideoAsset.create(form);
    setShowModal(false);
    setForm({ title: '', script: '', avatar_template: '', voice: '', render_status: 'not_started', campaign_id: '' });
    setSaving(false);
    load();
  };

  const updateStatus = async (id, render_status) => {
    await base44.entities.NTAVideoAsset.update(id, { render_status });
    setVideos(p => p.map(v => v.id === id ? { ...v, render_status } : v));
  };

  const scriptsReady = videos.filter(v => v.render_status === 'script_ready').length;
  const inProd = videos.filter(v => v.render_status === 'in_production').length;
  const completed = videos.filter(v => v.render_status === 'completed').length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Video Queue</h1>
            <p className="text-slate-500 text-sm mt-0.5">AI video assets tied to spoke campaigns</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> New Video Asset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[['Scripts Ready', scriptsReady, 'text-amber-400'],['In Production', inProd, 'text-blue-400'],['Completed', completed, 'text-emerald-400']].map(([l,v,c]) => (
            <div key={l} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className={`text-3xl font-black ${c}`}>{v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : videos.length === 0 ? (
            <div className="p-10 text-center"><Video className="w-8 h-8 text-slate-700 mx-auto mb-2" /><p className="text-slate-600 text-sm">No video assets yet.</p></div>
          ) : videos.map(v => (
            <div key={v.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{v.title}</p>
                <p className="text-xs text-slate-500">{v.avatar_template || 'No avatar'} · {v.voice || 'Default voice'}</p>
                {v.render_url && <a href={v.render_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-0.5 block">View render →</a>}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[v.render_status] || 'bg-slate-700 text-slate-400'}`}>{v.render_status?.replace(/_/g,' ')}</span>
                <select value={v.render_status} onChange={e => updateStatus(v.id, e.target.value)}
                  className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5">
                  <option value="not_started">Not Started</option>
                  <option value="script_ready">Script Ready</option>
                  <option value="in_production">In Production</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">New Video Asset</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['title','Title *'],['avatar_template','Avatar Template'],['voice','Voice'],['render_url','Render URL (when ready)']].map(([k,l]) => (
                <div key={k}><label className={LBL}>{l}</label><input value={form[k] || ''} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} className={IN} /></div>
              ))}
              <div><label className={LBL}>Campaign</label>
                <select value={form.campaign_id} onChange={e => setForm(p => ({...p, campaign_id: e.target.value}))} className={IN}>
                  <option value="">No Campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Script</label><textarea value={form.script} onChange={e => setForm(p => ({...p, script: e.target.value}))} rows={4} className={IN} /></div>
              <div><label className={LBL}>Status</label>
                <select value={form.render_status} onChange={e => setForm(p => ({...p, render_status: e.target.value}))} className={IN}>
                  <option value="not_started">Not Started</option>
                  <option value="script_ready">Script Ready</option>
                  <option value="in_production">In Production</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving || !form.title} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}