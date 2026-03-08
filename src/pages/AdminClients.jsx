import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, Search, ExternalLink, MapPin, Calendar, Eye } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { formatDistanceToNow } from 'date-fns';

const STATUS_BADGE = {
  active: 'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  draft: 'bg-slate-700 text-slate-400',
  submitted: 'bg-blue-900/40 text-blue-400 border-blue-700',
  in_review: 'bg-amber-900/40 text-amber-400 border-amber-700',
  configured: 'bg-teal-900/40 text-teal-400 border-teal-700',
  ready: 'bg-violet-900/40 text-violet-400 border-violet-700',
};

export default function AdminClients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: trials = [], isLoading } = useQuery({
    queryKey: ['admin-trial-accounts'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 200),
  });

  const filtered = trials.filter(t => {
    const matchSearch = !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.industry?.toLowerCase().includes(search.toLowerCase()) ||
      t.location_city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.trial_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = [...new Set(trials.map(t => t.trial_status).filter(Boolean))];

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <div>
                  <h1 className="text-xl font-bold">Client Accounts</h1>
                  <p className="text-slate-400 text-sm">{trials.length} total trial accounts</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={createPageUrl('AdminOnboardingQueue')}>
                  <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Onboarding Queue
                  </Button>
                </a>
                <a href={createPageUrl('LeadsDashboard')}>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    View All Leads
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {/* Stat summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Clients', value: trials.length, color: 'text-white' },
                { label: 'Active', value: trials.filter(t => t.trial_status === 'active').length, color: 'text-emerald-400' },
                { label: 'In Review', value: trials.filter(t => t.trial_status === 'in_review').length, color: 'text-amber-400' },
                { label: 'Ready', value: trials.filter(t => t.trial_status === 'ready').length, color: 'text-violet-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 w-64"
                  placeholder="Search clients..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  All ({trials.length})
                </button>
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {s?.replace(/_/g, ' ')} ({trials.filter(t => t.trial_status === s).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Client cards */}
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Loading clients...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No clients found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(trial => (
                  <div key={trial.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-base">{trial.name}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{trial.full_name}</p>
                      </div>
                      <Badge className={`text-xs border capitalize ${STATUS_BADGE[trial.trial_status] || 'bg-slate-700 text-slate-400'}`}>
                        {trial.trial_status?.replace(/_/g, ' ') || 'draft'}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      {trial.email && (
                        <div className="flex items-center gap-2">
                          <span>✉️</span> {trial.email}
                        </div>
                      )}
                      {(trial.location_city || trial.location_state) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> {trial.location_city}, {trial.location_state}
                        </div>
                      )}
                      {trial.industry && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3 h-3" /> {trial.industry}
                        </div>
                      )}
                      {trial.created_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Joined {formatDistanceToNow(new Date(trial.created_date), { addSuffix: true })}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-700 flex gap-2">
                      <a href={`mailto:${trial.email}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-xs">
                          Email
                        </Button>
                      </a>
                      <a href={createPageUrl('AdminOnboardingQueue')} className="flex-1">
                        <Button size="sm" className="w-full bg-emerald-700 hover:bg-emerald-600 text-xs gap-1">
                          <Eye className="w-3 h-3" /> Manage
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}