import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Eye, Loader2, Pause, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const STATUS_COLORS = {
  not_started: 'bg-slate-100 text-slate-700',
  waiting_on_client: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-indigo-100 text-indigo-700',
  ready_to_launch: 'bg-green-100 text-green-700',
  launched: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-rose-100 text-rose-700',
};

export default function AdminOnboarding() {
  const [workrooms, setWorkrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.OnboardingWorkrooms.list('-created_date', 500);
    setWorkrooms(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    await base44.entities.OnboardingWorkrooms.update(id, { status: newStatus });
    setWorkrooms(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
    toast.success('Status updated');
  };

  const filtered = workrooms.filter(w => {
    if (filter === 'all') return true;
    return w.status === filter;
  });

  if (loading) return (
    <AdminGuard>
      <AdminNav>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </AdminNav>
    </AdminGuard>
  );

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-50">
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Onboarding Workrooms</h1>
              <p className="text-sm text-slate-500">{workrooms.length} total</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', 'not_started', 'waiting_on_client', 'in_progress', 'review', 'ready_to_launch', 'launched'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === f
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No workrooms {filter !== 'all' ? 'in this status' : 'yet'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-white rounded-lg shadow-sm">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-600">Company</th>
                      <th className="text-left p-4 font-medium text-slate-600">Type</th>
                      <th className="text-left p-4 font-medium text-slate-600">Status</th>
                      <th className="text-left p-4 font-medium text-slate-600">Progress</th>
                      <th className="text-left p-4 font-medium text-slate-600">Kickoff</th>
                      <th className="text-left p-4 font-medium text-slate-600">Launch Target</th>
                      <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(w => (
                      <tr key={w.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-900">{w.title}</td>
                        <td className="p-4 text-slate-600 text-xs">{w.onboarding_type.replace(/_/g, ' ')}</td>
                        <td className="p-4">
                          <Badge className={STATUS_COLORS[w.status] || 'bg-slate-100 text-slate-700'}>
                            {w.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${w.progress_percent || 0}%` }} />
                            </div>
                            <span className="text-xs text-slate-500">{w.progress_percent || 0}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          {w.kickoff_call_date ? format(new Date(w.kickoff_call_date), 'MMM d') : '—'}
                        </td>
                        <td className="p-4 text-slate-600 text-xs">
                          {w.launch_target_date ? format(new Date(w.launch_target_date), 'MMM d') : '—'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={createPageUrl(`AdminOnboardingDetail?id=${w.id}`)}>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600">
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            {w.status === 'review' && (
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-green-600"
                                onClick={() => updateStatus(w.id, 'ready_to_launch')}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            {w.status !== 'paused' && w.status !== 'launched' && (
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                                onClick={() => updateStatus(w.id, 'paused')}
                              >
                                <Pause className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}