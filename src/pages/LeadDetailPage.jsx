import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import LeadOutreachPanel from '../components/leads/LeadOutreachPanel';
import LeadGapAuditPanel from '../components/leads/LeadGapAuditPanel';
import LeadTemplatesPanel from '../components/leads/LeadTemplatesPanel';
import {
  ArrowLeft, Edit, Save, X, ExternalLink, Phone, Mail, Globe,
  Calendar, AlertCircle, CheckCircle2, RefreshCw, ChevronDown
} from 'lucide-react';

const STATUSES = [
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'replied', label: 'Replied' },
  { value: 'audit_requested', label: 'Audit Requested' },
  { value: 'audit_sent', label: 'Audit Sent' },
  { value: 'interested', label: 'Interested' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
  { value: 'no_response', label: 'No Response' },
];

const STATUS_COLORS = {
  new: 'bg-slate-700 text-slate-300',
  contacted: 'bg-blue-900 text-blue-300',
  replied: 'bg-violet-900 text-violet-300',
  audit_requested: 'bg-amber-900 text-amber-300',
  audit_sent: 'bg-orange-900 text-orange-300',
  interested: 'bg-rose-900 text-rose-300',
  proposal_sent: 'bg-cyan-900 text-cyan-300',
  closed_won: 'bg-emerald-900 text-emerald-300',
  closed_lost: 'bg-red-900 text-red-300',
  no_response: 'bg-slate-800 text-slate-500',
};

const SOURCES = ['google_maps', 'facebook', 'linkedin', 'referral', 'website', 'manual', 'other'];
const PRIORITIES = ['low', 'medium', 'high'];

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const lbl = 'block text-xs font-semibold text-slate-400 mb-1';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const TABS = ['Overview', 'Outreach', 'Gap Audit', 'Templates', 'Notes'];

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities.SalesLead.filter({ id });
    if (data.length > 0) {
      setLead(data[0]);
      setForm(data[0]);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const update = async (fields) => {
    const updated = { ...lead, ...fields };
    await base44.entities.SalesLead.update(id, fields);
    setLead(updated);
    setForm(updated);
    return updated;
  };

  const quickStatus = async (status) => {
    const today = new Date().toISOString().split('T')[0];
    const extra = {};
    if (status === 'contacted') {
      extra.last_contacted = today;
      if (!lead.date_first_contacted) extra.date_first_contacted = today;
      extra.outreach_sent = true;
      extra.outreach_date = today;
      extra.next_follow_up = addDays(2);
    } else if (status === 'replied') {
      extra.reply_received = true;
      extra.reply_date = today;
    } else if (status === 'audit_sent') {
      extra.audit_status = 'sent';
      extra.audit_sent_date = today;
      extra.next_follow_up = addDays(2);
    } else if (status === 'interested') {
      extra.last_contacted = today;
    }
    await update({ status, ...extra });
  };

  const saveEdit = async () => {
    setSaving(true);
    await update(form);
    setSaving(false);
    setEditMode(false);
  };

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (loading) return (
    <AgencyLayout>
      <div className="p-6 space-y-3">
        {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-slate-900 rounded-xl animate-pulse" />)}
      </div>
    </AgencyLayout>
  );

  if (!lead) return (
    <AgencyLayout>
      <div className="p-6 text-center">
        <p className="text-slate-400">Lead not found.</p>
        <Link to="/agency/leads" className="text-blue-400 text-sm mt-2 block">← Back to Leads</Link>
      </div>
    </AgencyLayout>
  );

  const statusLabel = STATUSES.find(s => s.value === lead.status)?.label || lead.status || 'New Lead';
  const statusColor = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
  const isOverdue = lead.next_follow_up && new Date(lead.next_follow_up + 'T12:00:00') < new Date();

  return (
    <AgencyLayout>
      <div className="p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/agency/leads')} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{lead.business_name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{statusLabel}</span>
                {lead.priority && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    lead.priority === 'high' ? 'bg-red-900 text-red-300' :
                    lead.priority === 'medium' ? 'bg-amber-900 text-amber-300' : 'bg-slate-700 text-slate-400'
                  }`}>{lead.priority} priority</span>
                )}
                {lead.contact_name && <span className="text-slate-400 text-sm">{lead.contact_name}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {editMode ? (
              <>
                <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg">
                  <Save className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setEditMode(false); setForm(lead); }} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Bar */}
        {!editMode && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
            <div className="flex gap-2 flex-wrap">
              {['contacted', 'replied', 'audit_requested', 'audit_sent', 'interested', 'proposal_sent', 'closed_won', 'closed_lost'].map(s => {
                const st = STATUSES.find(x => x.value === s);
                return (
                  <button key={s} onClick={() => quickStatus(s)}
                    disabled={lead.status === s}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                      lead.status === s ? 'bg-blue-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}>
                    {st?.label}
                  </button>
                );
              })}
              <button onClick={() => { const d = addDays(2); update({ next_follow_up: d }); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 transition-colors">
                📅 Set Follow-Up +2 days
              </button>
            </div>

            {/* Follow-up status */}
            {lead.next_follow_up && (
              <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
                <AlertCircle className="w-3.5 h-3.5" />
                {isOverdue ? 'OVERDUE — ' : 'Next follow-up: '}{fmtDate(lead.next_follow_up)}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-slate-800 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left: Contact Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</p>
              {editMode ? (
                <div className="space-y-3">
                  <div><label className={lbl}>Business Name *</label><input value={form.business_name || ''} onChange={e => setF('business_name', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Contact Name</label><input value={form.contact_name || ''} onChange={e => setF('contact_name', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Phone</label><input value={form.phone || ''} onChange={e => setF('phone', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Email</label><input value={form.email || ''} onChange={e => setF('email', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Website</label><input value={form.website || ''} onChange={e => setF('website', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Facebook URL</label><input value={form.facebook_url || ''} onChange={e => setF('facebook_url', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>LinkedIn URL</label><input value={form.linkedin_url || ''} onChange={e => setF('linkedin_url', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Google Business Profile URL</label><input value={form.gbp_url || ''} onChange={e => setF('gbp_url', e.target.value)} className={inp} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={lbl}>City</label><input value={form.city || ''} onChange={e => setF('city', e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>State</label><input value={form.state || ''} onChange={e => setF('state', e.target.value)} className={inp} /></div>
                  </div>
                  <div><label className={lbl}>Industry</label><input value={form.industry || ''} onChange={e => setF('industry', e.target.value)} className={inp} /></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {lead.contact_name && <InfoRow icon="👤" label={lead.contact_name} />}
                  {lead.phone && <InfoRow icon="📞" label={lead.phone} href={`tel:${lead.phone}`} />}
                  {lead.email && <InfoRow icon="📧" label={lead.email} href={`mailto:${lead.email}`} />}
                  {lead.website && <InfoRow icon="🌐" label={lead.website} href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} ext />}
                  {lead.facebook_url && <InfoRow icon="📘" label="Facebook Page" href={lead.facebook_url} ext />}
                  {lead.linkedin_url && <InfoRow icon="💼" label="LinkedIn" href={lead.linkedin_url} ext />}
                  {lead.gbp_url && <InfoRow icon="🟢" label="Google Business Profile" href={lead.gbp_url} ext />}
                  {(lead.city || lead.state) && <InfoRow icon="📍" label={[lead.city, lead.state].filter(Boolean).join(', ')} />}
                  {lead.industry && <InfoRow icon="🏢" label={lead.industry} />}
                </div>
              )}
            </div>

            {/* Right: Lead Meta */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Details</p>
              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <label className={lbl}>Status</label>
                    <select value={form.status || 'new'} onChange={e => setF('status', e.target.value)} className={inp}>
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Priority</label>
                    <select value={form.priority || 'medium'} onChange={e => setF('priority', e.target.value)} className={inp}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Lead Source</label>
                    <select value={form.lead_source || 'manual'} onChange={e => setF('lead_source', e.target.value)} className={inp}>
                      {SOURCES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div><label className={lbl}>Estimated Value ($)</label><input type="number" value={form.estimated_value || ''} onChange={e => setF('estimated_value', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Date First Contacted</label><input type="date" value={form.date_first_contacted || ''} onChange={e => setF('date_first_contacted', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Last Contacted</label><input type="date" value={form.last_contacted || ''} onChange={e => setF('last_contacted', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Next Follow-Up</label><input type="date" value={form.next_follow_up || ''} onChange={e => setF('next_follow_up', e.target.value)} className={inp} /></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <InfoRow icon="📌" label={`Source: ${(lead.lead_source || 'manual').replace('_', ' ')}`} />
                  {lead.estimated_value && <InfoRow icon="💰" label={`Est. Value: $${Number(lead.estimated_value).toLocaleString()}`} />}
                  {lead.date_first_contacted && <InfoRow icon="📅" label={`First contacted: ${fmtDate(lead.date_first_contacted)}`} />}
                  {lead.last_contacted && <InfoRow icon="📆" label={`Last contacted: ${fmtDate(lead.last_contacted)}`} />}
                  {lead.next_follow_up && (
                    <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      {isOverdue ? 'OVERDUE: ' : 'Follow-up: '}{fmtDate(lead.next_follow_up)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pain Points / Opportunity */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:col-span-2 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opportunity Intelligence</p>
              {editMode ? (
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className={lbl}>Pain Points</label><textarea value={form.pain_points || ''} onChange={e => setF('pain_points', e.target.value)} rows={3} className={inp + ' resize-none'} /></div>
                  <div><label className={lbl}>Opportunity Notes</label><textarea value={form.opportunity_notes || ''} onChange={e => setF('opportunity_notes', e.target.value)} rows={3} className={inp + ' resize-none'} /></div>
                  <div><label className={lbl}>Final Outcome</label><input value={form.final_outcome || ''} onChange={e => setF('final_outcome', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Internal Notes</label><textarea value={form.internal_notes || ''} onChange={e => setF('internal_notes', e.target.value)} rows={3} className={inp + ' resize-none'} /></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {lead.pain_points && <div><p className="text-xs text-slate-500 mb-1">Pain Points</p><p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.pain_points}</p></div>}
                  {lead.opportunity_notes && <div><p className="text-xs text-slate-500 mb-1">Opportunity Notes</p><p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.opportunity_notes}</p></div>}
                  {lead.final_outcome && <div><p className="text-xs text-slate-500 mb-1">Final Outcome</p><p className="text-sm text-slate-300">{lead.final_outcome}</p></div>}
                  {lead.internal_notes && <div><p className="text-xs text-slate-500 mb-1">Internal Notes</p><p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.internal_notes}</p></div>}
                  {!lead.pain_points && !lead.opportunity_notes && !lead.internal_notes && (
                    <p className="text-slate-700 text-sm italic">No notes yet. Click Edit to add.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Outreach' && <LeadOutreachPanel lead={lead} onUpdate={update} />}
        {activeTab === 'Gap Audit' && <LeadGapAuditPanel lead={lead} onUpdate={update} />}
        {activeTab === 'Templates' && <LeadTemplatesPanel lead={lead} />}

        {activeTab === 'Notes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Log</p>
            {lead.notes ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {lead.notes.split('\n\n').filter(Boolean).map((entry, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg px-3 py-2">
                    <p className="text-xs text-slate-400 whitespace-pre-wrap">{entry}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-700 text-sm italic">No activity logged yet.</p>
            )}
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}

function InfoRow({ icon, label, href, ext }) {
  const content = (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-base">{icon}</span>
      <span className={href ? 'text-blue-400 hover:text-blue-300 flex items-center gap-1' : 'text-slate-300'}>{label}{ext && <ExternalLink className="w-3 h-3 inline ml-1" />}</span>
    </div>
  );
  return href ? <a href={href} target={ext ? '_blank' : undefined} rel="noopener noreferrer">{content}</a> : content;
}