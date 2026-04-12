import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, X, Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';

const STAGE_COLORS = {
  'New Lead':   'bg-slate-700 text-slate-300',
  'Audit Sent': 'bg-blue-900 text-blue-300',
  'Demo Built': 'bg-violet-900 text-violet-300',
  'Follow-Up':  'bg-amber-900 text-amber-300',
  'Closed':     'bg-emerald-900 text-emerald-300',
};

const PRIORITY_COLORS = {
  High:   'text-red-400 bg-red-400/10',
  Medium: 'text-amber-400 bg-amber-400/10',
  Low:    'text-slate-400 bg-slate-800',
};

const REPLY_COLORS = {
  'No Reply':       'text-slate-500',
  'Opened':         'text-blue-400',
  'Replied':        'text-sky-400',
  'Interested':     'text-emerald-400',
  'Not Interested': 'text-red-400',
};

const BLANK = {
  business_name: '', website: '', email: '', stage: 'New Lead', priority: 'Medium',
  last_contact_date: '', outreach_status: 'Not Started', reply_status: 'No Reply',
  close_page_url: '', notes: '', matched_video_title: '', matched_video_url: '',
  matched_video_topic: '', matched_funnel_stage: '', suggested_use_case: '',
  video_used_outreach: false, video_used_followup: false, video_used_demo: false,
};

function buildOutreachMsg(lead, video) {
  return `Hi ${lead.business_name},\n\nI put together a quick video specifically about businesses like yours — ${video || 'a relevant video'} — that shows exactly how we help local businesses get more leads from their website.\n\nWould love 5 minutes to walk you through it.\n\n— Rick Hesse | New Tech Advertising\nnewtech.ad`;
}

function buildFollowUpMsg(lead, video) {
  return `Hi again ${lead.business_name},\n\nJust following up on the video I sent: "${video || ''}"\n\nHappy to answer any questions or set up a quick call to show you what this could look like for your business.\n\n— Rick | NTA`;
}

function buildEmbedSuggestion(lead, video) {
  return `<!-- Embed on ${lead.close_page_url || lead.website || '[your demo page]'} -->\n<iframe src="${lead.matched_video_url || '[video-url]'}" title="${video}" width="100%" height="400" allowfullscreen></iframe>`;
}

export default function NTALeadContentMatch() {
  const [leads, setLeads] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [copied, setCopied] = useState(null);

  const load = async () => {
    const [l, v] = await Promise.all([
      base44.entities.LeadContentMatch.list('-created_date', 300),
      base44.entities.NTAContent.filter({ outreach_compatible: true }),
    ]);
    setLeads(l);
    setVideos(v);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const save = async () => {
    if (editLead.id) {
      await base44.entities.LeadContentMatch.update(editLead.id, editLead);
    } else {
      await base44.entities.LeadContentMatch.create(editLead);
    }
    setShowForm(false);
    setEditLead(null);
    load();
  };

  const markUsed = async (lead, field) => {
    await base44.entities.LeadContentMatch.update(lead.id, { [field]: true });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, [field]: true } : l));
  };

  const del = async (id) => {
    await base44.entities.LeadContentMatch.delete(id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const openNew = () => { setEditLead({ ...BLANK }); setShowForm(true); };
  const openEdit = (lead) => { setEditLead({ ...lead }); setShowForm(true); };

  // Suggest videos for a lead based on funnel stage matching
  const suggestVideos = (lead) => {
    const stageFunnelMap = { 'New Lead': 'Awareness', 'Audit Sent': 'Awareness', 'Demo Built': 'Demo', 'Follow-Up': 'Consideration', 'Closed': 'Close' };
    const targetFunnel = stageFunnelMap[lead.stage] || 'Awareness';
    const matched = videos.filter(v => v.funnel_stage === targetFunnel);
    const others = videos.filter(v => v.funnel_stage !== targetFunnel);
    return [...matched, ...others].slice(0, 3);
  };

  // Top 3 best videos for today
  const topVideos = videos.slice(0, 3);
  const highPriority = leads.filter(l => l.priority === 'High');
  const activeOutreach = leads.filter(l => ['First Outreach Sent', 'Following Up'].includes(l.outreach_status));
  const replied = leads.filter(l => ['Replied', 'Interested'].includes(l.reply_status));

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Lead Content Match</h1>
          <p className="text-slate-500 text-sm">Match the right video to the right lead at the right stage</p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main lead list */}
          <div className="xl:col-span-3 space-y-6">

            <LeadGroup title="🔥 High Priority" leads={highPriority} videos={videos} onEdit={openEdit} onDel={del} onCopy={copy} onMark={markUsed} copied={copied} suggestFn={suggestVideos} buildOutreach={buildOutreachMsg} buildFollowUp={buildFollowUpMsg} buildEmbed={buildEmbedSuggestion} />
            <LeadGroup title="🟡 Active Outreach" leads={activeOutreach.filter(l => l.priority !== 'High')} videos={videos} onEdit={openEdit} onDel={del} onCopy={copy} onMark={markUsed} copied={copied} suggestFn={suggestVideos} buildOutreach={buildOutreachMsg} buildFollowUp={buildFollowUpMsg} buildEmbed={buildEmbedSuggestion} />
            <LeadGroup title="🟢 Replied / Interested" leads={replied.filter(l => !['High'].includes(l.priority) || !activeOutreach.includes(l))} videos={videos} onEdit={openEdit} onDel={del} onCopy={copy} onMark={markUsed} copied={copied} suggestFn={suggestVideos} buildOutreach={buildOutreachMsg} buildFollowUp={buildFollowUpMsg} buildEmbed={buildEmbedSuggestion} />

            {/* All other leads */}
            {leads.filter(l => l.priority !== 'High' && !activeOutreach.includes(l) && !replied.includes(l)).length > 0 && (
              <LeadGroup title="📋 All Other Leads" leads={leads.filter(l => l.priority !== 'High' && !activeOutreach.includes(l) && !replied.includes(l))} videos={videos} onEdit={openEdit} onDel={del} onCopy={copy} onMark={markUsed} copied={copied} suggestFn={suggestVideos} buildOutreach={buildOutreachMsg} buildFollowUp={buildFollowUpMsg} buildEmbed={buildEmbedSuggestion} />
            )}

            {leads.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <p className="text-slate-500 text-sm mb-3">No leads yet. Add your first lead to start matching content.</p>
                <button onClick={openNew} className="text-blue-500 hover:text-blue-300 text-sm font-semibold">+ Add Lead</button>
              </div>
            )}
          </div>

          {/* Smart suggestions sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Best Content for Today</p>
              {topVideos.length === 0 ? (
                <p className="text-slate-600 text-xs">No outreach-compatible videos yet. Add some in the Content Library.</p>
              ) : (
                <div className="space-y-3">
                  {topVideos.map((v, i) => {
                    const matchedLeads = leads.filter(l => {
                      const stageFunnelMap = { 'New Lead': 'Awareness', 'Audit Sent': 'Awareness', 'Demo Built': 'Demo', 'Follow-Up': 'Consideration', 'Closed': 'Close' };
                      return stageFunnelMap[l.stage] === v.funnel_stage;
                    });
                    return (
                      <div key={v.id} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-1.5">
                          <span className="text-xs font-black text-blue-400 flex-shrink-0">#{i + 1}</span>
                          <p className="text-xs font-semibold text-white leading-tight">{v.video_title}</p>
                        </div>
                        <p className="text-xs text-slate-500 mb-1.5">{v.funnel_stage} · {v.topic || 'General'}</p>
                        {matchedLeads.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Matches:</p>
                            {matchedLeads.slice(0, 2).map(l => (
                              <p key={l.id} className="text-xs text-slate-400 truncate">• {l.business_name}</p>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-emerald-500 mt-1.5">{v.outreach_use_case || 'Great for outreach'}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tracking</p>
              {[
                { label: 'Video Used in Outreach', value: leads.filter(l => l.video_used_outreach).length },
                { label: 'Video Used in Follow-Up', value: leads.filter(l => l.video_used_followup).length },
                { label: 'Video Used in Demo', value: leads.filter(l => l.video_used_demo).length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && editLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="font-bold text-white">{editLead.id ? 'Edit Lead' : 'Add Lead'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5">
              <LeadForm item={editLead} setItem={setEditLead} videos={videos} />
            </div>
            <div className="px-5 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={save} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm">Save</button>
              <button onClick={() => setShowForm(false)} className="px-5 bg-slate-800 text-white py-2.5 rounded-xl text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lead Group ──
function LeadGroup({ title, leads, videos, onEdit, onDel, onCopy, onMark, copied, suggestFn, buildOutreach, buildFollowUp, buildEmbed }) {
  if (leads.length === 0) return null;
  return (
    <div>
      <h2 className="text-sm font-bold text-white mb-3">{title} <span className="text-slate-500 font-normal text-xs">({leads.length})</span></h2>
      <div className="space-y-3">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} suggested={suggestFn(lead)} onEdit={onEdit} onDel={onDel} onCopy={onCopy} onMark={onMark} copied={copied} buildOutreach={buildOutreach} buildFollowUp={buildFollowUp} buildEmbed={buildEmbed} />
        ))}
      </div>
    </div>
  );
}

// ── Lead Card ──
function LeadCard({ lead, suggested, onEdit, onDel, onCopy, onMark, copied, buildOutreach, buildFollowUp, buildEmbed }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors">
      {/* Top row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-white">{lead.business_name}</p>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${STAGE_COLORS[lead.stage] || 'bg-slate-700 text-slate-300'}`}>{lead.stage}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[lead.priority] || ''}`}>{lead.priority}</span>
            {lead.reply_status && lead.reply_status !== 'No Reply' && (
              <span className={`text-xs font-semibold ${REPLY_COLORS[lead.reply_status] || 'text-slate-500'}`}>{lead.reply_status}</span>
            )}
          </div>
          <div className="flex gap-3 mt-0.5 flex-wrap">
            {lead.email && <span className="text-xs text-slate-500">{lead.email}</span>}
            {lead.website && <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-300">{lead.website}</a>}
            {lead.last_contact_date && <span className="text-xs text-slate-600">Last: {lead.last_contact_date}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Tracking badges */}
          <div className="flex gap-1">
            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${lead.video_used_outreach ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-600'}`} title="Outreach">OUT</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${lead.video_used_followup ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-600'}`} title="Follow-Up">FU</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${lead.video_used_demo ? 'bg-emerald-900 text-emerald-400' : 'bg-slate-800 text-slate-600'}`} title="Demo">DEMO</span>
          </div>
          <button onClick={() => onEdit(lead)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg transition-colors">Edit</button>
          <button onClick={() => setExpanded(!expanded)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1.5 rounded-lg transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded: videos + actions */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800 pt-3 space-y-3">
          {/* Matched video (if set) */}
          {lead.matched_video_title && (
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs font-bold text-slate-400 mb-1">Matched Video</p>
              <p className="text-sm font-semibold text-white">{lead.matched_video_title}</p>
              {lead.suggested_use_case && <p className="text-xs text-slate-400 mt-0.5">{lead.suggested_use_case}</p>}
            </div>
          )}

          {/* Suggested videos */}
          {suggested.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Suggested Videos</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {suggested.map(v => (
                  <div key={v.id} className="bg-slate-800 rounded-lg p-2.5 border border-slate-700">
                    <p className="text-xs font-semibold text-white leading-tight truncate">{v.video_title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{v.funnel_stage}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {v.outreach_compatible && <span className="text-xs bg-sky-900/60 text-sky-400 px-1 py-0.5 rounded">Outreach</span>}
                      {v.demo_compatible && <span className="text-xs bg-pink-900/60 text-pink-400 px-1 py-0.5 rounded">Demo</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <ActionBtn label="Copy Outreach" copyId={`out-${lead.id}`} copied={copied}
              onClick={() => onCopy(buildOutreach(lead, lead.matched_video_title), `out-${lead.id}`)} />
            <ActionBtn label="Copy Follow-Up" copyId={`fu-${lead.id}`} copied={copied}
              onClick={() => onCopy(buildFollowUp(lead, lead.matched_video_title), `fu-${lead.id}`)} />
            <ActionBtn label="Copy Embed" copyId={`em-${lead.id}`} copied={copied}
              onClick={() => onCopy(buildEmbed(lead, lead.matched_video_title), `em-${lead.id}`)} />
            {lead.close_page_url && (
              <a href={lead.close_page_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-violet-700 hover:bg-violet-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" /> Demo Page
              </a>
            )}
            {!lead.video_used_outreach && <MarkBtn label="✓ Outreach Used" onClick={() => onMark(lead, 'video_used_outreach')} />}
            {!lead.video_used_followup && <MarkBtn label="✓ Follow-Up Used" onClick={() => onMark(lead, 'video_used_followup')} />}
            {!lead.video_used_demo && <MarkBtn label="✓ Demo Used" onClick={() => onMark(lead, 'video_used_demo')} />}
            <button onClick={() => { if (window.confirm('Delete this lead?')) onDel(lead.id); }}
              className="text-xs font-semibold text-red-500 hover:text-red-400 px-2 py-1.5 rounded-lg transition-colors">Delete</button>
          </div>
          {lead.notes && <p className="text-xs text-slate-500 bg-slate-800/40 rounded-lg px-3 py-2">{lead.notes}</p>}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ label, copyId, copied, onClick }) {
  const isCopied = copied === copyId;
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${isCopied ? 'bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {isCopied ? 'Copied!' : label}
    </button>
  );
}

function MarkBtn({ label, onClick }) {
  return (
    <button onClick={onClick} className="text-xs font-semibold bg-emerald-900/40 hover:bg-emerald-900 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors">{label}</button>
  );
}

// ── Lead Form ──
function LeadForm({ item, setItem, videos }) {
  const set = (k, v) => setItem(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <F label="Business Name *"><input value={item.business_name || ''} onChange={e => set('business_name', e.target.value)} className={inp} /></F>
        <F label="Website"><input value={item.website || ''} onChange={e => set('website', e.target.value)} className={inp} /></F>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <F label="Email"><input type="email" value={item.email || ''} onChange={e => set('email', e.target.value)} className={inp} /></F>
        <F label="Last Contact Date"><input type="date" value={item.last_contact_date || ''} onChange={e => set('last_contact_date', e.target.value)} className={inp} /></F>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <F label="Stage">
          <select value={item.stage || ''} onChange={e => set('stage', e.target.value)} className={inp}>
            {['New Lead','Audit Sent','Demo Built','Follow-Up','Closed'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
        <F label="Priority">
          <select value={item.priority || ''} onChange={e => set('priority', e.target.value)} className={inp}>
            {['High','Medium','Low'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
        <F label="Reply Status">
          <select value={item.reply_status || ''} onChange={e => set('reply_status', e.target.value)} className={inp}>
            {['No Reply','Opened','Replied','Interested','Not Interested'].map(v => <option key={v}>{v}</option>)}
          </select>
        </F>
      </div>
      <F label="Outreach Status">
        <select value={item.outreach_status || ''} onChange={e => set('outreach_status', e.target.value)} className={inp}>
          {['Not Started','First Outreach Sent','Following Up','Demo Sent','Replied'].map(v => <option key={v}>{v}</option>)}
        </select>
      </F>
      <F label="Close / Demo Page URL"><input value={item.close_page_url || ''} onChange={e => set('close_page_url', e.target.value)} className={inp} placeholder="https://..." /></F>

      {/* Video matching */}
      <div className="border-t border-slate-800 pt-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Matched Video</p>
        {videos.length > 0 ? (
          <F label="Select Video">
            <select value={item.matched_video_id || ''} onChange={e => {
              const v = videos.find(v => v.id === e.target.value);
              set('matched_video_id', e.target.value);
              if (v) { set('matched_video_title', v.video_title); set('matched_video_topic', v.topic || ''); set('matched_funnel_stage', v.funnel_stage || ''); }
            }} className={inp}>
              <option value="">— Select a video —</option>
              {videos.map(v => <option key={v.id} value={v.id}>{v.video_title}</option>)}
            </select>
          </F>
        ) : (
          <p className="text-xs text-slate-500">No outreach-compatible videos yet. Add them in the Content Library.</p>
        )}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <F label="Video URL"><input value={item.matched_video_url || ''} onChange={e => set('matched_video_url', e.target.value)} className={inp} placeholder="https://..." /></F>
          <F label="Suggested Use Case"><input value={item.suggested_use_case || ''} onChange={e => set('suggested_use_case', e.target.value)} className={inp} /></F>
        </div>
      </div>

      <F label="Notes"><textarea value={item.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} className={inp + ' resize-none'} /></F>
    </div>
  );
}

function F({ label, children }) {
  return <div><label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>{children}</div>;
}

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';