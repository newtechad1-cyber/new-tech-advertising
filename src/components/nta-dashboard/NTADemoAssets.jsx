import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Copy, Check } from 'lucide-react';

const PLACEMENTS = ['Hero explanation', 'Audit walkthrough', 'Why this matters', 'CTA reinforcement'];

const PLACEMENT_COLORS = {
  'Hero explanation':   'bg-blue-900 text-blue-300',
  'Audit walkthrough':  'bg-violet-900 text-violet-300',
  'Why this matters':   'bg-amber-900 text-amber-300',
  'CTA reinforcement':  'bg-emerald-900 text-emerald-300',
};

export default function NTADemoAssets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    base44.entities.NTAContent.filter({ demo_compatible: true }).then(d => { setItems(d); setLoading(false); });
  }, []);

  const filtered = filter ? items.filter(i => i.demo_placement === filter) : items;

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-xl font-black text-white mb-1">Demo / Sales Page Assets</h1>
      <p className="text-slate-500 text-sm mb-4">{items.length} demo-compatible videos</p>

      {/* Placement filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!filter ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>All</button>
        {PLACEMENTS.map(p => (
          <button key={p} onClick={() => setFilter(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{p}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-500 text-sm">No demo-compatible videos yet. Mark videos as "Demo Compatible" in the Content Library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-colors space-y-3">
              <div>
                <p className="text-sm font-bold text-white">{item.video_title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.topic || item.funnel_stage}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.demo_placement && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${PLACEMENT_COLORS[item.demo_placement] || 'bg-slate-700 text-slate-300'}`}>{item.demo_placement}</span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.posted_status === 'Posted' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>{item.posted_status}</span>
                {item.outreach_compatible && <span className="text-xs bg-sky-900 text-sky-400 px-1.5 py-0.5 rounded font-bold">Outreach</span>}
              </div>
              {item.funnel_stage && (
                <div className="bg-slate-800 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Vertical fit</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{item.funnel_stage} · {item.format || 'Video'}</p>
                </div>
              )}
              {item.youtube_description && (
                <div className="flex items-center justify-between bg-slate-800/60 rounded px-2.5 py-1.5 gap-2">
                  <p className="text-xs text-slate-400 truncate flex-1">Embed suggestion</p>
                  <button onClick={() => copy(`<iframe src="..." title="${item.video_title}"></iframe>`, item.id)}
                    className="flex-shrink-0 text-slate-500 hover:text-white transition-colors">
                    {copied === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}