import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Plus, Zap, Trash2, Archive, ExternalLink, ChevronDown, CheckSquare, Square,
  LayoutGrid, Table, RefreshCw, X, Edit2, Check
} from 'lucide-react';
import CRMLayout from '../components/crm-dashboard/CRMLayout';

const STATUSES = ['Draft', 'Generated', 'Video Created', 'Posted'];
const STATUS_COLORS = {
  Draft: 'bg-slate-700 text-slate-300',
  Generated: 'bg-blue-600/20 text-blue-300',
  'Video Created': 'bg-violet-600/20 text-violet-300',
  Posted: 'bg-emerald-600/20 text-emerald-300',
  Archived: 'bg-slate-800 text-slate-500',
};

export default function ContentCommandDashboard() {
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [view, setView] = useState('kanban'); // 'kanban' | 'table'
  const [tab, setTab] = useState('command'); // 'command' | 'jobs' | 'clients'
  const [selectedClient, setSelectedClient] = useState('');
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newClient, setNewClient] = useState({ name: '', website: '', services: '', target_keywords: '', industry: '' });
  const [addingClient, setAddingClient] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [c, j] = await Promise.all([
      base44.entities.AgencyClient.filter({ archived: false }),
      base44.entities.ContentJob.list('-created_date', 200),
    ]);
    setClients(c);
    setJobs(j.filter(j => j.status !== 'Archived'));
    if (c.length > 0 && !selectedClient) setSelectedClient(c[0].id);
  };

  const activeClient = clients.find(c => c.id === selectedClient);

  const generate = async () => {
    if (!activeClient) return;
    setGenerating(true);
    const prompt = `
You are a content strategist for a local business marketing agency.

Client: ${activeClient.name}
Website: ${activeClient.website || 'N/A'}
Services: ${activeClient.services || 'general services'}
Keywords: ${activeClient.target_keywords || 'local business'}
Topic: ${topic || 'general brand awareness and local visibility'}

Generate the following as a JSON object:
{
  "blog_article": "A full 600-800 word SEO-optimized blog article in markdown format",
  "video_script": "A 60-90 second HeyGen-compatible video script with scene directions in brackets",
  "social_facebook": "A Facebook post (150-200 words, engaging, with a CTA)",
  "social_linkedin": "A LinkedIn post (professional, 100-150 words)",
  "social_gbp": "A Google Business Profile post (75-100 words, local focus)",
  "image_prompts": "3 AI image generation prompts separated by newlines, each starting with 'Prompt:'"
}
`;
    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          blog_article: { type: 'string' },
          video_script: { type: 'string' },
          social_facebook: { type: 'string' },
          social_linkedin: { type: 'string' },
          social_gbp: { type: 'string' },
          image_prompts: { type: 'string' },
        },
      },
    });
    const job = await base44.entities.ContentJob.create({
      client_id: activeClient.id,
      client_name: activeClient.name,
      content_type: 'Full Pack',
      status: 'Generated',
      topic: topic || 'General Content',
      blog_article: result.blog_article,
      video_script: result.video_script,
      social_facebook: result.social_facebook,
      social_linkedin: result.social_linkedin,
      social_gbp: result.social_gbp,
      image_prompts: result.image_prompts,
    });
    setJobs(prev => [job, ...prev]);
    setTopic('');
    setGenerating(false);
    setExpandedJob(job.id);
    setTab('jobs');
  };

  const updateJob = async (id, data) => {
    await base44.entities.ContentJob.update(id, data);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
  };

  const archiveJob = async (id) => {
    await updateJob(id, { status: 'Archived' });
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const deleteJob = async (id) => {
    await base44.entities.ContentJob.delete(id);
    setJobs(prev => prev.filter(j => j.id !== id));
    setDeleteConfirm(null);
  };

  const archiveClient = async (id) => {
    await base44.entities.AgencyClient.update(id, { archived: true });
    setClients(prev => prev.filter(c => c.id !== id));
    if (selectedClient === id) setSelectedClient(clients.find(c => c.id !== id)?.id || '');
  };

  const addClient = async () => {
    if (!newClient.name.trim()) return;
    setAddingClient(true);
    const c = await base44.entities.AgencyClient.create({ ...newClient, archived: false });
    setClients(prev => [...prev, c]);
    setSelectedClient(c.id);
    setNewClient({ name: '', website: '', services: '', target_keywords: '', industry: '' });
    setAddingClient(false);
    setShowAddClient(false);
  };

  const saveUrl = async (jobId) => {
    await updateJob(jobId, { heygen_video_url: urlInput, status: 'Video Created' });
    setEditingUrl(null);
    setUrlInput('');
  };

  // Daily command groupings
  const toCreate = jobs.filter(j => j.status === 'Draft');
  const readyToPost = jobs.filter(j => j.status === 'Generated' || j.status === 'Video Created');
  const completed = jobs.filter(j => j.status === 'Posted');

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Command</h1>
            <p className="text-slate-400 text-sm mt-0.5">Agency content pipeline — create, track, post</p>
          </div>
          <div className="flex items-center gap-2">
            {['command', 'jobs', 'clients'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {t === 'command' ? '⚡ Daily' : t === 'jobs' ? '📋 Jobs' : '👥 Clients'}
              </button>
            ))}
          </div>
        </div>

        {/* ── DAILY COMMAND TAB ── */}
        {tab === 'command' && (
          <div className="space-y-6">
            {/* Generate block */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-sm font-bold text-slate-200 mb-4">Generate Content Pack</h2>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs text-slate-500 mb-1 block">Client</label>
                  <div className="relative">
                    <select
                      value={selectedClient}
                      onChange={e => setSelectedClient(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-blue-500"
                    >
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1 min-w-[220px]">
                  <label className="text-xs text-slate-500 mb-1 block">Topic / Focus (optional)</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Summer HVAC maintenance tips"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={generate}
                  disabled={generating || !selectedClient}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  {generating ? 'Generating...' : 'Generate Pack'}
                </button>
              </div>
            </div>

            {/* Daily buckets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DailyBucket title="📝 To Create" color="text-slate-400" jobs={toCreate} onExpand={id => { setExpandedJob(id); setTab('jobs'); }} />
              <DailyBucket title="🚀 Ready to Post" color="text-blue-400" jobs={readyToPost} onExpand={id => { setExpandedJob(id); setTab('jobs'); }} />
              <DailyBucket title="✅ Completed" color="text-emerald-400" jobs={completed} onExpand={id => { setExpandedJob(id); setTab('jobs'); }} />
            </div>
          </div>
        )}

        {/* ── JOBS TAB ── */}
        {tab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'kanban' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>
                <LayoutGrid className="w-4 h-4 inline mr-1" />Kanban
              </button>
              <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'table' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>
                <Table className="w-4 h-4 inline mr-1" />Table
              </button>
            </div>

            {view === 'kanban' ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {STATUSES.map(status => (
                  <div key={status} className="flex-shrink-0 w-64 bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>{status}</span>
                      <span className="ml-auto text-xs text-slate-600">{jobs.filter(j => j.status === status).length}</span>
                    </div>
                    <div className="space-y-2">
                      {jobs.filter(j => j.status === status).map(job => (
                        <JobCard key={job.id} job={job} expanded={expandedJob === job.id}
                          onToggle={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                          onUpdate={updateJob} onArchive={archiveJob} onDelete={() => setDeleteConfirm(job.id)}
                          onEditUrl={() => { setEditingUrl(job.id); setUrlInput(job.heygen_video_url || ''); }}
                          editingUrl={editingUrl === job.id} urlInput={urlInput} setUrlInput={setUrlInput} onSaveUrl={() => saveUrl(job.id)}
                          onCancelUrl={() => setEditingUrl(null)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {['Client', 'Topic', 'Type', 'Status', 'FB', 'LI', 'GBP', 'Video', 'Actions'].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 py-3 text-white font-medium">{job.client_name}</td>
                        <td className="px-3 py-3 text-slate-400 max-w-[140px] truncate">{job.topic || '—'}</td>
                        <td className="px-3 py-3 text-slate-400 text-xs">{job.content_type}</td>
                        <td className="px-3 py-3">
                          <select value={job.status} onChange={e => updateJob(job.id, { status: e.target.value })}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[job.status]} bg-transparent`}>
                            {[...STATUSES, 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-3"><Checkbox checked={job.posted_facebook} onChange={v => updateJob(job.id, { posted_facebook: v })} /></td>
                        <td className="px-3 py-3"><Checkbox checked={job.posted_linkedin} onChange={v => updateJob(job.id, { posted_linkedin: v })} /></td>
                        <td className="px-3 py-3"><Checkbox checked={job.posted_gbp} onChange={v => updateJob(job.id, { posted_gbp: v })} /></td>
                        <td className="px-3 py-3">
                          {job.heygen_video_url
                            ? <a href={job.heygen_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">View</a>
                            : <span className="text-slate-600 text-xs">—</span>}
                        </td>
                        <td className="px-3 py-3 flex gap-1">
                          <button onClick={() => { setExpandedJob(job.id === expandedJob ? null : job.id); }} className="p-1 text-slate-500 hover:text-white rounded" title="View">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => archiveJob(job.id)} className="p-1 text-slate-500 hover:text-amber-400 rounded" title="Archive">
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(job.id)} className="p-1 text-slate-500 hover:text-red-400 rounded" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Expanded job detail drawer */}
            {expandedJob && (() => {
              const job = jobs.find(j => j.id === expandedJob);
              if (!job) return null;
              return (
                <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl">
                  <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{job.client_name} — {job.topic || job.content_type}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                    </div>
                    <button onClick={() => setExpandedJob(null)} className="p-2 text-slate-500 hover:text-white rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Status + posting */}
                    <div className="flex flex-wrap gap-4 items-center bg-slate-800 rounded-xl p-4">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Status</label>
                        <select value={job.status} onChange={e => updateJob(job.id, { status: e.target.value })}
                          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
                          {[...STATUSES, 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-4">
                        {[['Facebook', 'posted_facebook'], ['LinkedIn', 'posted_linkedin'], ['GBP', 'posted_gbp']].map(([label, field]) => (
                          <label key={field} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox checked={job[field]} onChange={v => updateJob(job.id, { [field]: v })} />
                            <span className="text-sm text-slate-300">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* HeyGen URL */}
                    <div className="bg-slate-800 rounded-xl p-4">
                      <label className="text-xs font-bold text-slate-400 block mb-2">HeyGen Video URL</label>
                      {editingUrl === job.id ? (
                        <div className="flex gap-2">
                          <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://app.heygen.com/..." />
                          <button onClick={() => saveUrl(job.id)} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingUrl(null)} className="p-2 bg-slate-700 text-slate-400 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {job.heygen_video_url
                            ? <a href={job.heygen_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate flex-1">{job.heygen_video_url}</a>
                            : <span className="text-slate-500 text-sm flex-1">No video linked yet</span>}
                          <button onClick={() => { setEditingUrl(job.id); setUrlInput(job.heygen_video_url || ''); }} className="p-1.5 text-slate-500 hover:text-white rounded-lg bg-slate-700">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content blocks */}
                    {[
                      { label: '📝 Blog Article', field: 'blog_article' },
                      { label: '🎬 Video Script', field: 'video_script' },
                      { label: '📘 Facebook Post', field: 'social_facebook' },
                      { label: '💼 LinkedIn Post', field: 'social_linkedin' },
                      { label: '📍 Google Business Post', field: 'social_gbp' },
                      { label: '🖼️ Image Prompts', field: 'image_prompts' },
                    ].map(({ label, field }) => job[field] ? (
                      <ContentBlock key={field} label={label} content={job[field]} />
                    ) : null)}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── CLIENTS TAB ── */}
        {tab === 'clients' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setShowAddClient(!showAddClient)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Add Client
              </button>
            </div>

            {showAddClient && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">New Client</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { key: 'name', placeholder: 'Business Name *' },
                    { key: 'website', placeholder: 'Website URL' },
                    { key: 'industry', placeholder: 'Industry' },
                    { key: 'services', placeholder: 'Services (comma separated)' },
                    { key: 'target_keywords', placeholder: 'Target Keywords (comma separated)' },
                  ].map(f => (
                    <input key={f.key} placeholder={f.placeholder} value={newClient[f.key]}
                      onChange={e => setNewClient(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addClient} disabled={addingClient || !newClient.name.trim()}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-lg">
                    {addingClient ? 'Saving...' : 'Save Client'}
                  </button>
                  <button onClick={() => setShowAddClient(false)} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm hover:text-white">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(client => (
                <div key={client.id} className={`bg-slate-900 border rounded-xl p-5 ${selectedClient === client.id ? 'border-blue-500' : 'border-slate-800'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{client.name}</p>
                      {client.industry && <p className="text-xs text-slate-500 mt-0.5">{client.industry}</p>}
                    </div>
                    <button onClick={() => archiveClient(client.id)} className="p-1.5 text-slate-600 hover:text-amber-400 rounded-lg transition-colors" title="Archive">
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                  {client.website && (
                    <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-2">
                      <ExternalLink className="w-3 h-3" /> {client.website}
                    </a>
                  )}
                  {client.services && <p className="text-xs text-slate-500 mb-1"><span className="text-slate-400 font-medium">Services:</span> {client.services}</p>}
                  {client.target_keywords && <p className="text-xs text-slate-500"><span className="text-slate-400 font-medium">Keywords:</span> {client.target_keywords}</p>}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-600">{jobs.filter(j => j.client_id === client.id).length} jobs</span>
                    <button onClick={() => { setSelectedClient(client.id); setTab('command'); }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium">Select →</button>
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="col-span-3 text-center py-12 text-slate-600 text-sm">No clients yet. Add your first client above.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Delete Job?</h3>
            <p className="text-slate-400 text-sm mb-5">This is permanent.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteJob(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}

function JobCard({ job, expanded, onToggle, onUpdate, onArchive, onDelete, onEditUrl, editingUrl, urlInput, setUrlInput, onSaveUrl, onCancelUrl }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 group">
      <button onClick={onToggle} className="w-full text-left">
        <p className="text-xs font-semibold text-white truncate">{job.client_name}</p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{job.topic || job.content_type}</p>
      </button>
      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onArchive} className="p-1 text-slate-500 hover:text-amber-400 rounded" title="Archive"><Archive className="w-3 h-3" /></button>
        <button onClick={onDelete} className="p-1 text-slate-500 hover:text-red-400 rounded" title="Delete"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="text-slate-400 hover:text-white transition-colors">
      {checked ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4" />}
    </button>
  );
}

function ContentBlock({ label, content }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-slate-300">{label}</p>
        <button onClick={copy} className="text-xs text-slate-500 hover:text-white transition-colors">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{content}</pre>
    </div>
  );
}

function DailyBucket({ title, color, jobs, onExpand }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-bold ${color}`}>{title}</span>
        <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{jobs.length}</span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {jobs.length === 0 && <p className="text-slate-600 text-xs py-2 text-center">Nothing here.</p>}
        {jobs.map(job => (
          <button key={job.id} onClick={() => onExpand(job.id)}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors group">
            <p className="text-xs font-semibold text-white truncate">{job.client_name}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{job.topic || job.content_type}</p>
          </button>
        ))}
      </div>
    </div>
  );
}