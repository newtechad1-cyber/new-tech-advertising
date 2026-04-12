import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const COLS = ['Idea Ready', 'Script Ready', 'In HeyGen', 'Video Created', 'Needs Posting', 'Posted'];

const COL_MAP = {
  'Idea Ready':     { script_status: 'Idea',          posted_status: 'Not Created' },
  'Script Ready':   { script_status: 'Script Ready',  posted_status: 'Not Created' },
  'In HeyGen':      { script_status: 'In Production', posted_status: 'Not Created' },
  'Video Created':  { script_status: 'Complete',      posted_status: 'Created' },
  'Needs Posting':  { script_status: 'Complete',      posted_status: 'Created' },
  'Posted':         { script_status: 'Complete',      posted_status: 'Posted' },
};

const COL_COLORS = {
  'Idea Ready':    'border-slate-600',
  'Script Ready':  'border-blue-700',
  'In HeyGen':     'border-violet-700',
  'Video Created': 'border-amber-600',
  'Needs Posting': 'border-orange-600',
  'Posted':        'border-emerald-700',
};

const PRIORITY_COLORS = { High: 'text-red-400', Medium: 'text-amber-400', Low: 'text-slate-500' };

function assignCol(item) {
  if (item.posted_status === 'Posted') return 'Posted';
  if (item.script_status === 'Complete' && item.posted_status === 'Created') return 'Video Created';
  if (item.script_status === 'In Production') return 'In HeyGen';
  if (item.script_status === 'Script Ready') return 'Script Ready';
  return 'Idea Ready';
}

export default function NTAProductionQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => base44.entities.NTAContent.list('-created_date', 500).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const colMap = COLS.reduce((acc, c) => { acc[c] = items.filter(i => assignCol(i) === c); return acc; }, {});

  const moveForward = async (item) => {
    const currentCol = assignCol(item);
    const idx = COLS.indexOf(currentCol);
    if (idx >= COLS.length - 1) return;
    const nextCol = COLS[idx + 1];
    const update = COL_MAP[nextCol];
    await base44.entities.NTAContent.update(item.id, update);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...update } : i));
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-xl font-black text-white mb-1">Production Queue</h1>
      <p className="text-slate-500 text-sm mb-5">Click → to advance a video to the next stage</p>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto">{COLS.map(c => <div key={c} className="flex-shrink-0 w-44 h-40 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
          {COLS.map(col => (
            <div key={col} className={`flex-shrink-0 w-52 bg-slate-900 border ${COL_COLORS[col]} rounded-xl p-3`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-300">{col}</p>
                <span className="text-xs text-slate-600 font-bold">{colMap[col].length}</span>
              </div>
              <div className="space-y-2">
                {colMap[col].map(item => (
                  <div key={item.id} className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg p-2.5 group transition-colors">
                    <p className="text-xs font-semibold text-white leading-tight">{item.video_title}</p>
                    {item.topic && <p className="text-xs text-slate-500 mt-0.5 truncate">{item.topic}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-bold ${PRIORITY_COLORS[item.priority] || 'text-slate-500'}`}>{item.priority}</span>
                      <div className="flex gap-1">
                        {item.outreach_compatible && <span className="text-xs bg-sky-900/60 text-sky-400 px-1 py-0.5 rounded">OUT</span>}
                        {col !== 'Posted' && (
                          <button onClick={() => moveForward(item)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-semibold transition-colors">→</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {colMap[col].length === 0 && <p className="text-slate-700 text-xs text-center py-4">Empty</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}