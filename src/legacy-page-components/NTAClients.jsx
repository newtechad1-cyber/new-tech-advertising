import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, RefreshCw, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NTAClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NTACompany.filter({ active_client: true, archived: false }, '-created_date', 200);
    setClients(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || [c.company_name, c.email, c.website, c.city].some(v => v?.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-green-400" />Active Clients</h1>
              <p className="text-slate-400 text-sm">{clients.length} clients</p>
            </div>
          </div>
          <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="bg-slate-800 border-slate-700 text-white pl-8 h-8 text-xs" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No active clients found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(c => (
              <Link key={c.id} to={`/nta/companies/${c.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-green-700 transition-all cursor-pointer h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{c.company_name}</p>
                      {c.industry && <p className="text-slate-500 text-xs mt-0.5">{c.industry}</p>}
                      <div className="flex gap-2 text-xs text-slate-500 mt-2 flex-wrap">
                        {c.city && <span>{c.city}{c.state ? `, ${c.state}` : ''}</span>}
                      </div>
                      {c.primary_contact_name && (
                        <p className="text-slate-400 text-xs mt-1">Contact: {c.primary_contact_name}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}