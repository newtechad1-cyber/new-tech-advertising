import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Search, ClipboardList, CheckCircle2, Circle, ChevronRight } from 'lucide-react';

const STAGES = [
  "Intake",
  "Business Setup",
  "Services Setup",
  "Channel Setup",
  "Approval Setup",
  "Portal Setup",
  "Campaign Defaults",
  "Content Defaults",
  "Kickoff Ready",
  "Complete"
];

export default function OpsOnboarding() {
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    // Fetch all ClientSetupStatus records
    const data = await base44.entities.ClientSetupStatus.list('-created_date', 100);
    setSetups(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = setups.filter(s => !search || s.business_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-purple-400" /> Onboarding</h1>
            <p className="text-slate-500 text-sm">Track client onboarding progress and setup workflows.</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search onboarding clients..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-slate-900 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => {
              const stageIndex = STAGES.indexOf(s.onboarding_stage);
              const progress = Math.max(5, (stageIndex / (STAGES.length - 1)) * 100);
              
              return (
                <div key={s.id} onClick={() => setModal(s)} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-xl p-4 cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-base">{s.business_name || 'Unknown Client'}</h3>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Stage: <span className="text-white">{s.onboarding_stage}</span></span>
                      <span className="text-purple-400 font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{s.setup_notes || 'No recent notes.'}</p>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-slate-500 text-sm col-span-full">No active onboarding records.</p>}
          </div>
        )}
      </div>

      {modal && <OnboardingModal record={modal} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </OpsLayout>
  );
}

function OnboardingModal({ record, onSave, onClose }) {
  const [form, setForm] = useState(record);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.ClientSetupStatus.update(record.id, form);
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">Onboarding: {record.business_name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Current Stage</label>
            <select value={form.onboarding_stage} onChange={e => setForm({...form, onboarding_stage: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-800">
            {[
              { key: 'intake_form_completed', label: 'Intake Completed' },
              { key: 'services_defined', label: 'Services Defined' },
              { key: 'website_info_completed', label: 'Website Info Ready' },
              { key: 'channels_connected', label: 'Channels Connected' },
              { key: 'approval_settings_completed', label: 'Approvals Set Up' },
              { key: 'client_portal_ready', label: 'Portal Ready' }
            ].map(item => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[item.key] || false} onChange={e => setForm({...form, [item.key]: e.target.checked})} className="hidden" />
                {form[item.key] ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : <Circle className="w-4 h-4 text-slate-600" />}
                <span className={`text-sm ${form[item.key] ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Setup Notes</label>
            <textarea value={form.setup_notes || ''} onChange={e => setForm({...form, setup_notes: e.target.value})} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none"></textarea>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Update Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}