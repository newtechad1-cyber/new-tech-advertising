import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const SIGNAL_TYPES = ['content_performance','video_performance','campaign_performance','offer_performance','seo_performance','social_performance','email_performance','lead_performance','sales_performance'];
const CATEGORIES = ['content','video','campaign','offer','seo','social','email','crm'];
const CHANNELS = ['website','facebook','instagram','linkedin','youtube','email','streaming_tv','google_business_profile'];
const SOURCE_STATES = ['assumed','inferred','observed','proven'];

function SignalForm({ businesses, onSave, onCancel }) {
  const [form, setForm] = useState({
    business_profile_id: businesses[0]?.id || '',
    signal_type: 'social_performance', signal_category: 'social',
    source_system: '', recorded_at: new Date().toISOString(),
    channel: 'facebook', topic: '', impressions: 0, clicks: 0, engagements: 0,
    leads: 0, calls: 0, revenue: 0, conversion_rate: 0, cost: 0, cost_per_lead: 0,
    attribution_confidence: 50, signal_confidence_score: 50, source_state: 'observed', notes: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.PerformanceSignal.create(form);
    setSaving(false);
    onSave();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 mb-6">
      <h3 className="text-white font-bold text-sm">Log Performance Signal</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Business *</label>
          <select value={form.business_profile_id} onChange={e => setForm(f => ({...f, business_profile_id: e.target.value}))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
            {businesses.map(b => <option key={b.id} value={b.id}>{b.business_name}</option>)}
          </select>
        </div>
        {[['signal_type', SIGNAL_TYPES,'Signal Type'],['signal_category',CATEGORIES,'Category'],['channel',CHANNELS,'Channel'],['source_state',SOURCE_STATES,'Source State']].map(([k,opts,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <select value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
              {opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Topic / Content Name</label>
          <input value={form.topic} onChange={e => setForm(f => ({...f, topic: e.target.value}))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Source System</label>
          <input placeholder="e.g. Meta Ads, Google Analytics" value={form.source_system} onChange={e => setForm(f => ({...f, source_system: e.target.value}))}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[['impressions','Impressions'],['clicks','Clicks'],['engagements','Engagements'],['leads','Leads'],['calls','Calls'],['revenue','Revenue ($)'],['cost','Cost ($)'],['cost_per_lead','CPL ($)'],['conversion_rate','Conv. Rate (%)'],['attribution_confidence','Attribution Conf'],['signal_confidence_score','Signal Conf']].map(([k,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <input type="number" min={0} value={form[k] || 0} onChange={e => setForm(f => ({...f, [k]: +e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Notes</label>
        <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Log Signal'}</button>
        <button onClick={onCancel} className="border border-slate-700 text-slate-400 px-5 py-2.5 rounded-xl text-sm hover:border-slate-500">Cancel</button>
      </div>
    </div>
  );
}

export default function PerformanceSignalAdmin() {
  const [signals, setSignals] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filterBiz, setFilterBiz] = useState('');

  const load = async () => {
    setLoading(true);
    const [sigs, biz] = await Promise.all([
      base44.entities.PerformanceSignal.list('-recorded_at', 50),
      base44.entities.BusinessProfile.list()
    ]);
    setSignals(sigs);
    setBusinesses(biz);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = signals.filter(s => !filterBiz || s.business_profile_id === filterBiz);
  const getBizName = (id) => businesses.find(b => b.id === id)?.business_name || '—';

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Performance Signals</h1>
            <p className="text-slate-500 text-xs">{filtered.length} signals</p>
          </div>
          <div className="ml-auto flex gap-2">
            <select value={filterBiz} onChange={e => setFilterBiz(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="">All Businesses</option>
              {businesses.map(b => <option key={b.id} value={b.id}>{b.business_name}</option>)}
            </select>
            <button onClick={() => setCreating(true)} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Log Signal
            </button>
          </div>
        </div>

        {creating && <SignalForm businesses={businesses} onSave={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} />}

        {loading ? <div className="text-slate-500 text-sm py-20 text-center">Loading...</div> : (
          <div className="space-y-3">
            {filtered.map(sig => (
              <div key={sig.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-bold text-sm">{sig.signal_type?.replace(/_/g,' ')}</span>
                      <span className="text-violet-400 text-xs">{sig.channel?.replace(/_/g,' ')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${sig.source_state === 'proven' ? 'bg-green-500/20 text-green-400' : sig.source_state === 'observed' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{sig.source_state}</span>
                      <span className="text-slate-500 text-xs">{getBizName(sig.business_profile_id)}</span>
                    </div>
                    {sig.topic && <p className="text-slate-400 text-xs mb-2">{sig.topic}</p>}
                    <div className="flex flex-wrap gap-4">
                      {[['Impr', sig.impressions],['Clicks', sig.clicks],['Engmt', sig.engagements],['Leads', sig.leads],['Calls', sig.calls],['Rev', `$${sig.revenue}`],['CPL', `$${sig.cost_per_lead}`]].map(([l,v]) => (
                        <div key={l} className="text-center">
                          <div className="text-white text-xs font-bold">{v || 0}</div>
                          <div className="text-slate-600 text-xs">{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-slate-500 text-xs">{new Date(sig.recorded_at).toLocaleDateString()}</div>
                    <div className="text-slate-500 text-xs mt-0.5">Conf: {sig.signal_confidence_score}</div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-slate-500 text-sm py-10 text-center">No performance signals yet. Log your first signal above.</div>}
          </div>
        )}
      </div>
    </div>
  );
}