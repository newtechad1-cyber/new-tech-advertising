import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function TemplateCard({ title, description, text }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <CopyBtn text={text} />
      </div>
      <div className="bg-slate-900 rounded-lg px-3 py-2.5 mt-2">
        <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function LeadTemplatesPanel({ lead }) {
  const name = lead.contact_name || '[Name]';
  const auditLink = lead.audit_url || '[Audit Link]';

  const templates = [
    {
      title: 'Initial Outreach',
      description: 'First message — cold or warm introduction',
      text: `Hey ${name} — quick question.\n\nI was looking at your business online and noticed a couple things that might be costing you leads.\n\nNot trying to sell you anything — just curious if you'd want me to send a quick 2-minute breakdown?`,
    },
    {
      title: 'Positive Reply',
      description: 'When they say yes — ask where to send it',
      text: `Perfect — I'll put together a quick one for you.\n\nWhat's the best place to send it — here or email?`,
    },
    {
      title: 'Audit Delivery',
      description: 'Send after gap audit is ready',
      text: `Just put this together for you — a couple easy wins you could fix pretty fast.\n\n${auditLink}\n\nIf you want, I can map out exactly how I'd fix this for you step-by-step. No pressure either way.`,
    },
    {
      title: 'Follow-Up 1',
      description: 'Send 2-3 days after initial outreach or audit',
      text: `Hey ${name} — just wanted to make sure you saw this.`,
    },
    {
      title: 'Follow-Up 2',
      description: 'Send 5 days after audit delivery',
      text: `Curious — did anything in that stand out to you?`,
    },
    {
      title: 'Follow-Up 3 / Soft Exit',
      description: 'Last touch — leave door open',
      text: `No worries if now's not the right time. If you ever want a deeper breakdown or help implementing it, just let me know.`,
    },
    {
      title: 'Proposal / Plan Ready',
      description: 'When ready to share the next step plan',
      text: `Hey ${name} — put together a quick breakdown of exactly what I'd do to fix the gaps we talked about.\n\nWant me to send it over?`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Message Templates</p>
        <p className="text-xs text-slate-600">Click Copy to grab any message. Templates auto-fill name and audit link from this lead record.</p>
      </div>

      <div className="space-y-3">
        {templates.map(t => <TemplateCard key={t.title} {...t} />)}
      </div>
    </div>
  );
}