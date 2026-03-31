import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, RefreshCw, Users, Send, ChevronDown, ChevronUp, CheckCircle, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';

const CAMPAIGNS = [
  {
    id: 'audit_demo_followup',
    name: 'Website Audit + Demo Follow-Up',
    description: 'Nurture sequence for prospects after audit/demo',
  },
];

const DEFAULT_SEQUENCE = [
  {
    name: 'Day 0 – Audit + Demo Delivery',
    subject: 'Your free website audit is ready, {{first_name}}',
    sequence_day: 0,
    body: `<p>Hi {{first_name}},</p>
<p>Thank you for reaching out! I've put together a personalized website audit for <strong>{{business_name}}</strong>.</p>
<p>👉 <a href="{{audit_link}}">View Your Website Audit Report</a></p>
<p>I've also recorded a short demo showing exactly what we'd do to modernize your site and start driving more local leads.</p>
<p>🎬 <a href="{{demo_link}}">Watch Your Personalized Demo</a></p>
<p>Any questions? Just reply to this email — I read every one.</p>
<p>— Rick<br>New Tech Advertising</p>`,
  },
  {
    name: 'Day 1 – Value Follow-Up',
    subject: 'What a modern website is actually worth (for {{business_name}})',
    sequence_day: 1,
    body: `<p>Hi {{first_name}},</p>
<p>Just wanted to make sure you had a chance to see your audit.</p>
<p>Here's the thing most business owners don't realize: a slow or outdated website doesn't just look bad — it actively sends customers to your competitors every single day.</p>
<p>Our clients typically see their first new inbound lead within 30 days of launch.</p>
<p>📋 <a href="{{audit_link}}">Review your audit again here</a></p>
<p>Or if you're ready to talk through your options:</p>
<p>📅 <a href="{{booking_link}}">Book a 15-Minute Strategy Call</a></p>
<p>No pressure — just a conversation.</p>
<p>— Rick</p>`,
  },
  {
    name: 'Day 3 – Pattern Interrupt',
    subject: 'Quick question for you, {{first_name}}',
    sequence_day: 3,
    body: `<p>Hi {{first_name}},</p>
<p>I'll keep this short.</p>
<p>Most local businesses we work with tell us the same thing: <em>"I knew I needed a better website, I just kept putting it off."</em></p>
<p>What's holding you back?</p>
<p>Reply with one word — cost, time, trust, or something else — and I'll personally respond with how we handle it.</p>
<p>Alternatively, you can <a href="{{demo_link}}">watch the demo for {{business_name}} here</a> if you haven't yet.</p>
<p>— Rick</p>`,
  },
  {
    name: 'Day 5 – Soft Close',
    subject: 'Still thinking it over? Here\'s what to expect',
    sequence_day: 5,
    body: `<p>Hi {{first_name}},</p>
<p>If you're still weighing your options, here's exactly what working with us looks like:</p>
<ul>
<li>✅ Week 1: Strategy call + site plan</li>
<li>✅ Week 2–3: Design + build</li>
<li>✅ Week 4: Launch + SEO setup</li>
<li>✅ Ongoing: Content, rankings, results</li>
</ul>
<p>Most clients go from first call to a live, ranking website in under 30 days.</p>
<p>📅 <a href="{{booking_link}}">Book your strategy call here</a> — takes 2 minutes to schedule.</p>
<p>— Rick</p>`,
  },
  {
    name: 'Day 7 – Final Email',
    subject: 'Last message about your audit, {{first_name}}',
    sequence_day: 7,
    body: `<p>Hi {{first_name}},</p>
<p>This is my last follow-up — I don't want to keep showing up in your inbox if the timing isn't right.</p>
<p>But I do want to leave you with this:</p>
<p>Your audit report will stay live. When you're ready, <a href="{{audit_link}}">you can access it here</a>.</p>
<p>And when you're ready to take the next step, I'm one click away:</p>
<p>📅 <a href="{{booking_link}}">Schedule a call here</a></p>
<p>Wishing you and {{business_name}} nothing but growth.</p>
<p>— Rick<br>New Tech Advertising<br>641-420-8816</p>`,
  },
];

export default function Autoresponder() {
  const [activeTab, setActiveTab] = useState('sequences');
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(CAMPAIGNS[0].id);
  const [form, setForm] = useState({ name: '', subject: '', body: '', sequence_day: 0, status: 'active' });
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  // Lead form
  const [leadForm, setLeadForm] = useState({ name: '', email: '', business_name: '', audit_link: '', demo_link: '' });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => { loadSequences(); }, [activeCampaign]);

  const loadSequences = async () => {
    setLoading(true);
    setSeedDone(false);
    const data = await base44.entities.EmailTemplate.filter({ type: activeCampaign }, 'sequence_day');
    setSequences(data);
    setLoading(false);
  };

  const save = async () => {
    const payload = { ...form, type: activeCampaign, sequence_day: parseInt(form.sequence_day) || 0 };
    if (editing) await base44.entities.EmailTemplate.update(editing.id, payload);
    else await base44.entities.EmailTemplate.create(payload);
    reset(); loadSequences();
  };

  const remove = async (id) => { await base44.entities.EmailTemplate.delete(id); loadSequences(); };
  const startEdit = (e) => {
    setEditing(e);
    setForm({ name: e.name, subject: e.subject, body: e.body, sequence_day: e.sequence_day ?? 0, status: e.status || 'active' });
    setShowForm(true);
  };
  const reset = () => {
    setEditing(null);
    setForm({ name: '', subject: '', body: '', sequence_day: 0, status: 'active' });
    setShowForm(false);
  };

  const seedDefaultSequence = async () => {
    setSeeding(true);
    for (const email of DEFAULT_SEQUENCE) {
      await base44.entities.EmailTemplate.create({ ...email, type: activeCampaign, status: 'active' });
    }
    setSeeding(false);
    setSeedDone(true);
    loadSequences();
  };

  const addLeadAndTrigger = async () => {
    if (!leadForm.name || !leadForm.email) return;
    setSending(true);
    setSendResult(null);
    try {
      // Send Day 0 immediately
      const res = await base44.functions.invoke('sendAutoresponderSequence', {
        campaign_type: activeCampaign,
        day: 0,
        ...leadForm,
      });
      setSendResult({ success: true, message: `Day 0 email sent to ${leadForm.email}` });
    } catch (err) {
      setSendResult({ success: false, message: err.message || 'Send failed' });
    } finally {
      setSending(false);
    }
  };

  const BOOKING_LINK = 'https://calendar.app.google/p6ieYanvwhixXxZ67';

  const previewBody = (body) => {
    if (!body) return '';
    return body
      .replace(/\{\{first_name\}\}/gi, leadForm.name || 'John')
      .replace(/\{\{business_name\}\}/gi, leadForm.business_name || 'Acme Plumbing')
      .replace(/\{\{audit_link\}\}/gi, leadForm.audit_link || '#')
      .replace(/\{\{demo_link\}\}/gi, leadForm.demo_link || '#')
      .replace(/\{\{booking_link\}\}/gi, BOOKING_LINK);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Autoresponder Sequences</h2>
          <p className="text-slate-400 text-sm">Automated email campaigns with dynamic merge tags</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'sequences' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('sequences')}
            className={activeTab === 'sequences' ? 'bg-cyan-600 hover:bg-cyan-700' : 'text-slate-400'}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Sequences
          </Button>
          <Button
            variant={activeTab === 'leads' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('leads')}
            className={activeTab === 'leads' ? 'bg-violet-600 hover:bg-violet-700' : 'text-slate-400'}
          >
            <Users className="w-4 h-4 mr-2" /> Add Lead & Send
          </Button>
        </div>
      </div>

      {/* Campaign Selector */}
      <div className="flex gap-2 flex-wrap">
        {CAMPAIGNS.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCampaign(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${activeCampaign === c.id ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-700'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* ── SEQUENCES TAB ── */}
      {activeTab === 'sequences' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs">Use merge tags: <code className="text-cyan-400">{"{{first_name}}"}</code> <code className="text-cyan-400">{"{{business_name}}"}</code> <code className="text-cyan-400">{"{{audit_link}}"}</code> <code className="text-cyan-400">{"{{demo_link}}"}</code> <code className="text-cyan-400">{"{{booking_link}}"}</code></p>
            <div className="flex gap-2">
              {sequences.length === 0 && !loading && (
                <Button onClick={seedDefaultSequence} disabled={seeding} className="bg-emerald-600 hover:bg-emerald-700 text-sm">
                  {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {seeding ? 'Seeding...' : 'Seed Default 5-Email Sequence'}
                </Button>
              )}
              <Button onClick={() => { reset(); setShowForm(true); }} className="bg-cyan-600 hover:bg-cyan-700 text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Email
              </Button>
            </div>
          </div>

          {seedDone && (
            <div className="flex items-center gap-2 p-3 bg-emerald-900/40 border border-emerald-700 rounded-xl text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" /> 5-email sequence loaded successfully.
            </div>
          )}

          {showForm && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Email Name</label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Day 0 – Audit Delivery" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Send on Day #</label>
                  <Input type="number" value={form.sequence_day} onChange={e => setForm({ ...form, sequence_day: e.target.value })} min="0" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Subject Line</label>
                  <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject (use {{first_name}} etc)" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Email Body</label>
                <div className="bg-white rounded-lg">
                  <ReactQuill theme="snow" value={form.body} onChange={val => setForm(f => ({ ...f, body: val }))} style={{ minHeight: '200px' }} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={save} className="bg-cyan-600 hover:bg-cyan-700">{editing ? 'Update' : 'Add'} Email</Button>
                <Button variant="ghost" onClick={reset} className="text-slate-400">Cancel</Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : sequences.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No emails yet. Click "Seed Default 5-Email Sequence" to get started fast.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...sequences].sort((a, b) => (a.sequence_day ?? 0) - (b.sequence_day ?? 0)).map((e) => (
                <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xs flex-shrink-0 text-center leading-tight">
                      Day<br />{e.sequence_day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm">{e.name}</h3>
                      <p className="text-slate-400 text-xs truncate">Subject: {e.subject}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setExpandedDay(expandedDay === e.id ? null : e.id)} className="text-slate-400 text-xs">
                        {expandedDay === e.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(e)} className="text-slate-400 h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(e.id)} className="text-red-500 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  {expandedDay === e.id && (
                    <div className="border-t border-slate-800 p-4">
                      <p className="text-slate-500 text-xs mb-2 font-semibold uppercase tracking-wider">Preview (with sample data)</p>
                      <div
                        className="bg-white text-slate-800 rounded-lg p-4 text-sm prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewBody(e.body) }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── LEAD ASSIGNMENT TAB ── */}
      {activeTab === 'leads' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-bold">Add Lead & Trigger Sequence</h3>
            <p className="text-slate-400 text-sm">Fill in the lead details. Day 0 email sends immediately. Days 1, 3, 5, 7 are sent manually or via scheduled automation.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Lead Name *</label>
                <Input value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="John Smith" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Email Address *</label>
                <Input type="email" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="john@company.com" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Business Name</label>
                <Input value={leadForm.business_name} onChange={e => setLeadForm({ ...leadForm, business_name: e.target.value })} placeholder="Acme Plumbing" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Audit Link</label>
                <Input value={leadForm.audit_link} onChange={e => setLeadForm({ ...leadForm, audit_link: e.target.value })} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 text-sm mb-1 block">Demo Link</label>
                <Input value={leadForm.demo_link} onChange={e => setLeadForm({ ...leadForm, demo_link: e.target.value })} placeholder="https://loom.com/..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={addLeadAndTrigger}
                disabled={sending || !leadForm.name || !leadForm.email}
                className="bg-violet-600 hover:bg-violet-700 w-full"
              >
                {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {sending ? 'Sending Day 0 Email...' : 'Add Lead & Send Day 0 Email Now'}
              </Button>
            </div>

            {sendResult && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${sendResult.success ? 'bg-emerald-900/40 border-emerald-700 text-emerald-400' : 'bg-red-900/40 border-red-700 text-red-400'}`}>
                {sendResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : null}
                {sendResult.message}
              </div>
            )}
          </div>

          {/* Manual send for follow-up days */}
          {sequences.length > 0 && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-3">
              <h3 className="text-white font-bold text-sm">Send Follow-Up Emails Manually</h3>
              <p className="text-slate-400 text-xs">Once you have a lead's info filled in above, you can fire any day in the sequence.</p>
              <div className="flex flex-wrap gap-2">
                {[...sequences].sort((a, b) => (a.sequence_day ?? 0) - (b.sequence_day ?? 0)).map(e => (
                  <button
                    key={e.id}
                    onClick={async () => {
                      if (!leadForm.email || !leadForm.name) return alert('Fill in lead name and email first.');
                      setSending(true); setSendResult(null);
                      try {
                        await base44.functions.invoke('sendAutoresponderSequence', { campaign_type: activeCampaign, day: e.sequence_day, ...leadForm });
                        setSendResult({ success: true, message: `Day ${e.sequence_day} email sent to ${leadForm.email}` });
                      } catch (err) {
                        setSendResult({ success: false, message: err.message });
                      } finally { setSending(false); }
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-700 border border-slate-700 hover:border-cyan-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Send Day {e.sequence_day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}