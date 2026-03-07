import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Edit2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

const GOAL_OPTS = ['leads','traffic','visibility','retention','authority'];
const STAGE_OPTS = ['new','growing','established','mature'];
const STATUS_OPTS = ['draft','active','paused','archived'];

function ProfileForm({ profile, onSave, onCancel }) {
  const [form, setForm] = useState(profile || {
    business_name: '', business_slug: '', website_url: '', industry_slug: '', city: '', state: '',
    service_area: [], core_services: [], secondary_services: [], target_customers: [], brand_tone: [],
    preferred_channels: [], preferred_offer_types: [], business_stage: 'new', team_size_band: '1-5',
    marketing_maturity: 30, content_capacity: 30, video_capacity: 30, sales_followup_capacity: 30,
    has_blog: false, has_video_assets: false, has_email_list: false, has_google_business_profile: false,
    has_reviews: false, has_location_pages: false, has_service_pages: false, has_social_presence: false,
    primary_goal: 'leads', secondary_goal: 'visibility', monthly_lead_goal: 10,
    priority_services_goal: [], priority_locations_goal: [], status: 'active'
  });
  const [saving, setSaving] = useState(false);
  const setArr = (field, val) => setForm(f => ({ ...f, [field]: val.split('\n').map(s => s.trim()).filter(Boolean) }));

  const handleSave = async () => {
    setSaving(true);
    if (profile?.id) await base44.entities.BusinessProfile.update(profile.id, form);
    else await base44.entities.BusinessProfile.create(form);
    setSaving(false);
    onSave();
  };

  const boolFields = ['has_blog','has_video_assets','has_email_list','has_google_business_profile','has_reviews','has_location_pages','has_service_pages','has_social_presence'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['business_name','Business Name *'],['business_slug','Business Slug *'],['website_url','Website URL'],['industry_slug','Industry Slug *'],['city','City *'],['state','State *'],['team_size_band','Team Size'],['timezone','Timezone']].map(([k,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <input value={form[k] || ''} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        ))}
        {[['business_stage', STAGE_OPTS,'Stage'],['primary_goal',GOAL_OPTS,'Primary Goal'],['secondary_goal',GOAL_OPTS,'Secondary Goal'],['status',STATUS_OPTS,'Status']].map(([k,opts,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <select value={form[k] || opts[0]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {[['marketing_maturity','Marketing Maturity (0-100)'],['content_capacity','Content Capacity (0-100)'],['video_capacity','Video Capacity (0-100)'],['sales_followup_capacity','Followup Capacity (0-100)'],['monthly_lead_goal','Monthly Lead Goal']].map(([k,l]) => (
          <div key={k}>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
            <input type="number" min={0} max={100} value={form[k] || 0} onChange={e => setForm(f => ({...f, [k]: +e.target.value}))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
          </div>
        ))}
      </div>
      {[['core_services','Core Services (one per line)'],['secondary_services','Secondary Services (one per line)'],['target_customers','Target Customers (one per line)'],['brand_tone','Brand Tone (one per line)'],['preferred_channels','Preferred Channels (one per line)'],['service_area','Service Area (one per line)'],['priority_services_goal','Priority Services Goal (one per line)'],['priority_locations_goal','Priority Locations Goal (one per line)']].map(([k,l]) => (
        <div key={k}>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{l}</label>
          <textarea rows={2} value={(form[k] || []).join('\n')} onChange={e => setArr(k, e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
        </div>
      ))}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Existing Assets</p>
        <div className="flex flex-wrap gap-3">
          {boolFields.map(k => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[k] || false} onChange={e => setForm(f => ({...f, [k]: e.target.checked}))} className="w-4 h-4 rounded" />
              <span className="text-slate-300 text-sm">{k.replace('has_', '').replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save Profile'}</button>
        <button onClick={onCancel} className="border border-slate-700 text-slate-400 px-5 py-2.5 rounded-xl text-sm hover:border-slate-500">Cancel</button>
      </div>
    </div>
  );
}

export default function BusinessProfileAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(null);

  const load = async () => { setLoading(true); const r = await base44.entities.BusinessProfile.list('-updated_date'); setRecords(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleGenerateIntel = async (profileId) => {
    setGenerating(profileId);
    await base44.functions.invoke('generateBusinessIntelProfile', { business_profile_id: profileId });
    await base44.functions.invoke('generateOpportunitySignals', { business_profile_id: profileId });
    await base44.functions.invoke('generateWeeklyMarketingPlan', { business_profile_id: profileId });
    setGenerating(null);
  };

  const boolFields = ['has_blog','has_video_assets','has_email_list','has_google_business_profile','has_reviews','has_location_pages','has_service_pages','has_social_presence'];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Business Profiles</h1>
            <p className="text-slate-500 text-xs">{records.length} records</p>
          </div>
          <button onClick={() => setCreating(true)} className="ml-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Business
          </button>
        </div>

        {creating && <div className="mb-6"><ProfileForm onSave={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} /></div>}
        {loading ? <div className="text-slate-500 text-sm py-10 text-center">Loading...</div> : (
          <div className="space-y-4">
            {records.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                {editing === r.id ? (
                  <ProfileForm profile={r} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-white font-bold">{r.business_name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>{r.status}</span>
                          <span className="text-violet-400 text-xs">{r.industry_slug}</span>
                          <span className="text-slate-500 text-xs">{r.city}, {r.state}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-slate-400 text-xs">Goal: <span className="text-white">{r.primary_goal}</span></span>
                          <span className="text-slate-400 text-xs">Stage: <span className="text-white">{r.business_stage}</span></span>
                          {r.website_url && <a href={r.website_url} target="_blank" rel="noreferrer" className="text-sky-400 text-xs flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Website</a>}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {boolFields.map(f => (
                            <span key={f} className={`flex items-center gap-1 text-xs ${r[f] ? 'text-green-400' : 'text-slate-600'}`}>
                              {r[f] ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {f.replace('has_','').replace(/_/g,' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleGenerateIntel(r.id)} disabled={generating === r.id}
                          className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all">
                          {generating === r.id ? 'Generating...' : '⚡ Generate Intel'}
                        </button>
                        <Link to={`${createPageUrl('BusinessIntelProfileAdmin')}?business_profile_id=${r.id}`}
                          className="border border-slate-700 text-slate-400 text-xs font-semibold px-3 py-1.5 rounded-lg hover:border-slate-500 hover:text-white transition-all">
                          View Intel
                        </Link>
                        <button onClick={() => setEditing(r.id)} className="text-slate-500 hover:text-white p-1"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {r.core_services?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.core_services.slice(0,5).map((s,i) => <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>)}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}