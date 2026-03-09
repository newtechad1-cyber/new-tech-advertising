import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Flame, ThermometerSun, Snowflake } from 'lucide-react';

const scoreLabel = (score) => {
  if (score >= 71) return { label: 'Hot', color: 'bg-red-100 text-red-700', icon: Flame };
  if (score >= 41) return { label: 'Warm', color: 'bg-orange-100 text-orange-700', icon: ThermometerSun };
  if (score >= 21) return { label: 'Interested', color: 'bg-blue-100 text-blue-700', icon: ThermometerSun };
  return { label: 'Cold', color: 'bg-slate-200 text-slate-500', icon: Snowflake };
};

export default function AdminDemoMachineSessions() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { base44.entities.DemoSessions.list('-created_date', 200).then(setSessions); }, []);

  const selectSession = async (s) => {
    setSelected(s);
    const ints = await base44.entities.DemoInteractions.filter({ demo_session_id: s.id }, 'created_date');
    setInteractions(ints);
  };

  const filtered = sessions.filter(s =>
    !search || s.session_key?.includes(search) || s.industry?.includes(search) || s.current_step?.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminDemoMachine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="flex-1"><h1 className="text-2xl font-bold">Demo Sessions</h1><p className="text-slate-400 text-sm">{sessions.length} total sessions</p></div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions..." className="pl-9 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {filtered.map(s => {
                const { label, color } = scoreLabel(s.lead_score || 0);
                return (
                  <div key={s.id} onClick={() => selectSession(s)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors ${selected?.id === s.id ? 'bg-blue-900/40 border border-blue-700' : 'bg-slate-900 border border-slate-800 hover:border-slate-600'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 font-mono">{s.session_key?.slice(5, 18)}</span>
                      <Badge className={`text-xs ${color}`}>{label}</Badge>
                    </div>
                    <div className="text-xs text-slate-300">{s.industry || 'General'} · {s.current_step || 'Start'}</div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 bg-slate-700 rounded-full h-1"><div className="bg-blue-500 h-1 rounded-full" style={{ width: `${s.completion_percentage || 0}%` }} /></div>
                      <span className="text-xs text-slate-400">{s.completion_percentage || 0}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-2">
            {selected ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-white text-lg">Session: {selected.session_key?.slice(0, 20)}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-slate-700 text-slate-300">{selected.industry || 'General'}</Badge>
                        <Badge className={scoreLabel(selected.lead_score || 0).color}>{scoreLabel(selected.lead_score || 0).label} · {selected.lead_score || 0} pts</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{selected.completion_percentage || 0}%</div>
                      <div className="text-xs text-slate-400">Completion</div>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Interaction Timeline</h4>
                  {interactions.length === 0 ? (
                    <p className="text-slate-500 text-sm">No interactions recorded yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {interactions.map(int => (
                        <div key={int.id} className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${int.interaction_type === 'cta_click' ? 'bg-green-400' : int.interaction_type === 'roi_use' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-mono text-slate-400">{int.interaction_type}</span>
                            {int.page_path && <span className="text-xs text-slate-500 ml-2">→ {int.page_path}</span>}
                            {int.value && <span className="text-xs text-slate-300 ml-2">· {int.value?.slice(0, 50)}</span>}
                          </div>
                          <span className="text-xs text-slate-600 shrink-0">{new Date(int.created_date).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                Select a session to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}