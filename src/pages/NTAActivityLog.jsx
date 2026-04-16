import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, RefreshCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  submission: 'bg-blue-900 text-blue-300',
  company_created: 'bg-emerald-900 text-emerald-300',
  opportunity_created: 'bg-violet-900 text-violet-300',
  opportunity_updated: 'bg-purple-900 text-purple-300',
  stage_change: 'bg-cyan-900 text-cyan-300',
  task_created: 'bg-amber-900 text-amber-300',
  task_completed: 'bg-green-900 text-green-300',
  webhook_sent: 'bg-blue-900 text-blue-300',
  webhook_failed: 'bg-red-900 text-red-300',
  won: 'bg-green-900 text-green-300',
  lost: 'bg-red-900 text-red-300',
  note: 'bg-slate-700 text-slate-300',
  system: 'bg-slate-700 text-slate-400',
};

export default function NTAActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NTAActivity.list('-created_date', 300);
    setActivities(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const types = [...new Set(activities.map(a => a.activity_type).filter(Boolean))];

  const filtered = activities.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.details?.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || a.activity_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-slate-400" />Activity Log</h1>
              <p className="text-slate-400 text-sm">{activities.length} entries</p>
            </div>
          </div>
          <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-44"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-slate-500 text-xs">{filtered.length} entries</span>
        </div>

        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No activity yet</div>
        ) : (
          <div className="space-y-1.5 relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-800" />
            {filtered.map(a => (
              <div key={a.id} className="flex items-start gap-4 pl-8 relative">
                <div className="absolute left-2.5 top-3 w-2 h-2 rounded-full bg-slate-700 border-2 border-slate-600 flex-shrink-0" />
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex-1 hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-white text-sm font-medium">{a.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`${TYPE_COLORS[a.activity_type] || 'bg-slate-700 text-slate-400'} border-0 text-xs`}>{a.activity_type}</Badge>
                      <span className="text-slate-600 text-xs">{new Date(a.created_date).toLocaleString()}</span>
                    </div>
                  </div>
                  {a.details && <p className="text-slate-400 text-xs mt-1">{a.details}</p>}
                  {a.source_system && <p className="text-slate-600 text-xs mt-0.5">via {a.source_system}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}