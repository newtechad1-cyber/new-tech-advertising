import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ExternalLink, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminGuard from '../components/auth/AdminGuard';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  draft:      { label: 'Draft',       color: 'bg-slate-100 text-slate-600 border-slate-200' },
  submitted:  { label: 'Submitted',   color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_review:  { label: 'In Review',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  configured: { label: 'Configured',  color: 'bg-purple-100 text-purple-700 border-purple-200' },
  ready:      { label: 'Ready',       color: 'bg-green-100 text-green-700 border-green-200' },
  active:     { label: 'Active',      color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>{cfg.label}</span>;
}

function AccountRow({ account, onStatusChange, brandDNA }) {
  const [updating, setUpdating] = useState(false);
  const STATUSES = ['draft', 'submitted', 'in_review', 'configured', 'ready', 'active'];

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    await base44.entities.TrialAccount.update(account.id, { trial_status: newStatus });
    onStatusChange(account.id, newStatus);
    setUpdating(false);
  };

  const trialEnd = account.trial_end_at ? new Date(account.trial_end_at) : null;
  const daysLeft = trialEnd ? Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-4">
        <div>
          <p className="font-semibold text-slate-900">{account.name}</p>
          <p className="text-xs text-slate-500">{account.email}</p>
          <p className="text-xs text-slate-400">{account.location_city}, {account.location_state} · {account.industry}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={account.trial_status} />
      </td>
      <td className="px-4 py-4">
        <span className={`text-xs font-medium ${account.involvement_preference === 'hands_off' ? 'text-purple-600' : account.involvement_preference === 'hands_on' ? 'text-blue-600' : 'text-slate-400'}`}>
          {account.involvement_preference?.replace('_', ' ') || '—'}
        </span>
      </td>
      <td className="px-4 py-4 text-xs text-slate-500">
        {account.trial_start_at ? new Date(account.trial_start_at).toLocaleDateString() : '—'}
        {daysLeft !== null && (
          <span className={`ml-2 font-medium ${daysLeft <= 2 ? 'text-red-500' : daysLeft <= 4 ? 'text-orange-500' : 'text-green-600'}`}>
            ({daysLeft}d left)
          </span>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          {brandDNA ? <CheckCircle className="w-4 h-4 text-green-500" title="Brand DNA submitted" /> : <Clock className="w-4 h-4 text-slate-300" title="No Brand DNA yet" />}
          <span className="text-xs text-slate-500">{brandDNA ? 'Done' : 'Pending'}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Select value={account.trial_status} onValueChange={handleStatus} disabled={updating}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{STATUS_CONFIG[s]?.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {updating && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          <a href={`/start/${account.slug}`} target="_blank" rel="noopener noreferrer" title="View portal">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ExternalLink className="w-3.5 h-3.5 text-slate-400" /></Button>
          </a>
        </div>
      </td>
    </tr>
  );
}

function QueueContent() {
  const [accounts, setAccounts] = useState([]);
  const [brandDNAs, setBrandDNAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const [accts, dnas] = await Promise.all([
      base44.entities.TrialAccount.list('-created_date', 100),
      base44.entities.BrandDNA.list('-created_date', 100),
    ]);
    setAccounts(accts);
    setBrandDNAs(dnas);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = (id, newStatus) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, trial_status: newStatus } : a));
  };

  const filtered = filter === 'all' ? accounts : accounts.filter(a => a.trial_status === filter);
  const counts = accounts.reduce((acc, a) => { acc[a.trial_status] = (acc[a.trial_status] || 0) + 1; return acc; }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trial Onboarding Queue</h1>
            <p className="text-slate-500 text-sm mt-1">{accounts.length} total trial accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button variant="outline" size="sm">← Admin Dashboard</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? 'all' : key)}
              className={`bg-white rounded-lg border p-3 text-center transition-all hover:shadow-sm ${filter === key ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className="text-xl font-bold text-slate-800">{counts[key] || 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{cfg.label}</p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-3" />
            <p>No accounts {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 text-left">Business</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Involvement</th>
                  <th className="px-4 py-3 text-left">Trial Start</th>
                  <th className="px-4 py-3 text-left">Brand DNA</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(account => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    onStatusChange={handleStatusChange}
                    brandDNA={brandDNAs.find(d => d.account_id === account.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOnboardingQueue() {
  return <AdminGuard><QueueContent /></AdminGuard>;
}