import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Mail, Phone, MapPin, RefreshCw } from 'lucide-react';

const STATUS_COLORS = {
  'New Lead': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-yellow-100 text-yellow-700',
  'In Review': 'bg-purple-100 text-purple-700',
  'Qualified': 'bg-green-100 text-green-700',
  'Not a Fit': 'bg-slate-100 text-slate-500',
};

const STATUSES = ['New Lead', 'Contacted', 'In Review', 'Qualified', 'Not a Fit'];

export default function AdminRecruitingCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.RecruitingCandidate.list('-submitted_at', 100);
    setCandidates(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.RecruitingCandidate.update(id, { status });
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recruiting Candidates</h1>
              <p className="text-slate-500 text-sm">Join NTA application submissions</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm border border-slate-300 rounded-lg px-4 py-2 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No applications yet.</div>
        ) : (
          <div className="space-y-3">
            {candidates.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-slate-900">{c.full_name}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[c.status] || STATUS_COLORS['New Lead']}`}>{c.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-slate-500">
                      {c.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.city}</span>}
                      {c.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{c.email}</span>}
                      {c.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{c.phone}</span>}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <select
                      value={c.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(c.id, e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {expanded === c.id && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 space-y-4 text-sm">
                    {c.current_role && (
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Current Role</div>
                        <p className="text-slate-600">{c.current_role}</p>
                      </div>
                    )}
                    {c.business_relationships && (
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Business Relationships</div>
                        <p className="text-slate-600">{c.business_relationships}</p>
                      </div>
                    )}
                    {c.interest_reason && (
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Why Interested</div>
                        <p className="text-slate-600">{c.interest_reason}</p>
                      </div>
                    )}
                    {c.submitted_at && (
                      <div className="text-slate-400 text-xs">Submitted: {new Date(c.submitted_at).toLocaleString()}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}