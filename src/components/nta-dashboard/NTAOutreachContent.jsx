import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Copy, Check } from 'lucide-react';

const OUTREACH_STAGES = [
  { label: 'First Outreach', funnel: 'Awareness', desc: 'Best for cold intro emails' },
  { label: 'Follow-Up', funnel: 'Consideration', desc: 'Authority-building follow-ups' },
  { label: 'Close Reinforcement', funnel: 'Close', desc: 'Close-stage reinforcement' },
  { label: 'Demo Support', funnel: 'Demo', desc: 'Demo or before-after videos' },
];

export default function NTAOutreachContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    base44.entities.NTAContent.filter({ outreach_compatible: true }).then(d => { setItems(d); setLoading(false); });
  }, []);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-xl font-black text-white mb-1">Outreach Content</h1>
      <p className="text-slate-500 text-sm mb-5">{items.length} outreach-compatible videos</p>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          {OUTREACH_STAGES.map(stage => {
            const stageItems = items.filter(i => i.funnel_stage === stage.funnel);
            return (
              <div key={stage.label} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-sm font-bold text-white">{stage.label}</h2>
                  <span className="text-xs text-slate-500">{stage.desc}</span>
                  <span className="text-xs text-slate-600 ml-auto">{stageItems.length} videos</span>
                </div>
                {stageItems.length === 0 ? (
                  <p className="text-slate-700 text-sm bg-slate-900 border border-slate-800 rounded-xl px-4 py-4">No outreach-compatible videos for this stage yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stageItems.map(item => (
                      <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div>
                          <p className="text-sm font-bold text-white">{item.video_title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.topic || item.funnel_stage}</p>
                        </div>
                        {item.outreach_use_case && (
                          <div className="bg-slate-800 rounded-lg p-2.5">
                            <p className="text-xs font-semibold text-slate-400 mb-1">Why it fits</p>
                            <p className="text-xs text-slate-300">{item.outreach_use_case}</p>
                          </div>
                        )}
                        {item.cta && (
                          <div className="bg-slate-800 rounded-lg p-2.5">
                            <p className="text-xs font-semibold text-slate-400 mb-1">CTA Angle</p>
                            <p className="text-xs text-slate-300">{item.cta}</p>
                          </div>
                        )}
                        {/* Quick copy snippets */}
                        <div className="space-y-1.5">
                          {item.facebook_caption && (
                            <CopyBlock label="Email Snippet" value={item.facebook_caption} id={`em-${item.id}`} copied={copied} onCopy={copy} />
                          )}
                          {item.youtube_description && (
                            <CopyBlock label="Follow-Up Snippet" value={item.youtube_description} id={`fu-${item.id}`} copied={copied} onCopy={copy} />
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          {item.demo_compatible && <span className="text-xs bg-pink-900/50 text-pink-300 px-2 py-0.5 rounded font-bold">Demo Compatible</span>}
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${item.posted_status === 'Posted' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>{item.posted_status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function CopyBlock({ label, value, id, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between bg-slate-800/60 rounded px-2.5 py-1.5 gap-2">
      <p className="text-xs text-slate-500 truncate flex-1">{label}</p>
      <button onClick={() => onCopy(value, id)} className="flex-shrink-0 text-slate-500 hover:text-white transition-colors">
        {copied === id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}