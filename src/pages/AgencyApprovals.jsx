import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import AgencyLayout from '../components/agency/AgencyLayout';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Plus, CheckCircle, Clock, AlertTriangle, XCircle, RotateCcw, Shield } from 'lucide-react';
import { StatusBadge, isOverdue } from '../components/approvals/ApprovalUtils';
import ApprovalDrawer from '../components/approvals/ApprovalDrawer';
import SendForApprovalModal from '../components/approvals/SendForApprovalModal';

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'internal',  label: 'Internal Review' },
  { id: 'client',    label: 'Client Signoff' },
  { id: 'revisions', label: 'Revisions' },
  { id: 'approved',  label: 'Approved' },
  { id: 'blocked',   label: 'Blocked / Expired' },
  { id: 'settings',  label: 'Settings' },
  { id: 'history',   label: 'History' },
];

export default function AgencyApprovals() {
  const [tab, setTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [queueItems, setQueueItems] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [sendModal, setSendModal] = useState(false);

  const load = async () => {
    setLoading(true);
    const [r, c, p, qi, camp] = await Promise.all([
      base44.entities.ApprovalRequest.list('-created_date', 500),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ClientApprovalPreference.list('-updated_date', 200),
      base44.entities.ContentQueueItem.list('-created_date', 200),
      base44.entities.Campaign.list('-created_date', 200),
    ]);
    setRequests(r);
    setClients(c);
    setPreferences(p);
    setQueueItems(qi);
    setCampaigns(camp);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = {
    internal:  requests.filter(r => r.status === 'Pending Internal Review').length,
    client:    requests.filter(r => r.status === 'Pending Client Review').length,
    revisions: requests.filter(r => r.status === 'Revision Requested').length,
    approved:  requests.filter(r => r.status === 'Approved').length,
    blocked:   requests.filter(r => ['Expired','Rejected','Cancelled'].includes(r.status)).length,
    expiring:  requests.filter(r => r.due_date && !['Approved','Rejected','Cancelled'].includes(r.status) && isOverdue(r.due_date)).length,
  };

  const sharedProps = { requests, clients, preferences, queueItems, campaigns, onRefresh: load, onOpen: setDrawer };

  const renderTab = () => {
    switch (tab) {
      case 'overview':  return <OverviewTab {...sharedProps} stats={stats} onTabChange={setTab} onNew={() => setSendModal(true)} />;
      case 'internal':  return <InternalTab {...sharedProps} />;
      case 'client':    return <ClientTab {...sharedProps} />;
      case 'revisions': return <RevisionsTab {...sharedProps} />;
      case 'approved':  return <ApprovedTab {...sharedProps} />;
      case 'blocked':   return <BlockedTab {...sharedProps} />;
      case 'settings':  return <SettingsTab {...sharedProps} />;
      case 'history':   return <HistoryTab {...sharedProps} />;
      default: return null;
    }
  };

  return (
    <AgencyLayout>
      <div className="flex flex-col">
        <div className="px-6 pt-6 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-xl"><Shield className="w-5 h-5 text-blue-400" /></div>
              <div>
                <h1 className="text-xl font-bold text-white">Approval Workflow</h1>
                <p className="text-slate-500 text-sm mt-0.5">Internal review + client signoff before publishing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setSendModal(true)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                <Plus className="w-3.5 h-3.5" /> New Approval Request
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {[
              { label: 'Waiting on Me',     value: stats.internal,  color: 'text-amber-400',   onClick: () => setTab('internal') },
              { label: 'Waiting on Client', value: stats.client,    color: 'text-blue-400',    onClick: () => setTab('client') },
              { label: 'Revision Needed',   value: stats.revisions, color: 'text-orange-400',  onClick: () => setTab('revisions') },
              { label: 'Approved',          value: stats.approved,  color: 'text-emerald-400', onClick: () => setTab('approved') },
              { label: 'Blocked/Expired',   value: stats.blocked,   color: stats.blocked > 0 ? 'text-red-400' : 'text-slate-500', onClick: () => setTab('blocked') },
              { label: 'Overdue',           value: stats.expiring,  color: stats.expiring > 0 ? 'text-red-400' : 'text-slate-500', onClick: () => setTab('blocked') },
            ].map(s => (
              <button key={s.label} onClick={s.onClick} className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-3 text-left transition-all">
                <p className={`text-2xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-0.5 border-b border-slate-800 overflow-x-auto">
            {TABS.map(t => {
              const badge = t.id === 'internal' ? stats.internal : t.id === 'client' ? stats.client : t.id === 'revisions' ? stats.revisions : 0;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                  {t.label}
                  {badge > 0 && <span className="bg-amber-500 text-black text-xs font-black px-1.5 py-0.5 rounded-full leading-none">{badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
          ) : renderTab()}
        </div>
      </div>

      {drawer && (
        <ApprovalDrawer request={drawer} onClose={() => setDrawer(null)} onUpdated={(updated) => { setDrawer(updated); load(); }} />
      )}
      {sendModal && (
        <SendForApprovalModal
          items={queueItems.slice(0, 1)}
          clients={clients}
          preferences={preferences}
          onClose={() => setSendModal(false)}
          onSaved={() => { setSendModal(false); load(); }}
        />
      )}
    </AgencyLayout>
  );
}

// ── Inline tab components to avoid missing file errors ─────────────────────

function OverviewTab({ requests, stats, onTabChange, onNew, onOpen }) {
  const waitingOnMe = requests.filter(r => r.status === 'Pending Internal Review').slice(0, 5);
  const waitingOnClient = requests.filter(r => r.status === 'Pending Client Review').slice(0, 5);
  const revisions = requests.filter(r => r.status === 'Revision Requested').slice(0, 5);
  const recentApproved = requests.filter(r => r.status === 'Approved').sort((a,b) => (b.decided_at||'').localeCompare(a.decided_at||'')).slice(0, 5);
  const overdue = requests.filter(r => !['Approved','Rejected','Cancelled'].includes(r.status) && isOverdue(r.due_date)).slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Request', action: onNew, cls: 'bg-blue-600 hover:bg-blue-500 text-white' },
          { label: 'Internal Review', action: () => onTabChange('internal'), cls: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white' },
          { label: 'Client Signoff', action: () => onTabChange('client'), cls: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white' },
          { label: 'View Blocked', action: () => onTabChange('blocked'), cls: 'bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-300' },
        ].map(q => <button key={q.label} onClick={q.action} className={`px-4 py-3 rounded-xl text-sm font-semibold ${q.cls}`}>{q.label}</button>)}
      </div>
      {overdue.length > 0 && (
        <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-4">
          <p className="text-sm font-bold text-red-400 mb-2">⚠ {overdue.length} Overdue</p>
          {overdue.map(r => <button key={r.id} onClick={() => onOpen(r)} className="w-full text-left flex justify-between py-1 text-sm text-white hover:text-blue-300"><span>{r.title}</span><span className="text-xs text-red-400">{fmtDate(r.due_date)}</span></button>)}
        </div>
      )}
      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Waiting on Me" action={() => onTabChange('internal')}>{waitingOnMe.length === 0 ? <Empty msg="You're all caught up ✅" /> : waitingOnMe.map(r => <Row key={r.id} r={r} onOpen={onOpen} />)}</Section>
        <Section title="Waiting on Client" action={() => onTabChange('client')}>{waitingOnClient.length === 0 ? <Empty msg="No pending client reviews" /> : waitingOnClient.map(r => <Row key={r.id} r={r} onOpen={onOpen} />)}</Section>
        <Section title="Revision Needed" action={() => onTabChange('revisions')}>{revisions.length === 0 ? <Empty msg="No revisions needed ✅" /> : revisions.map(r => <Row key={r.id} r={r} onOpen={onOpen} />)}</Section>
        <Section title="Recently Approved">{recentApproved.length === 0 ? <Empty msg="No approvals yet" /> : recentApproved.map(r => <Row key={r.id} r={r} onOpen={onOpen} />)}</Section>
      </div>
    </div>
  );
}

function InternalTab({ requests, onRefresh, onOpen }) {
  const [saving, setSaving] = useState(null);
  const items = requests.filter(r => r.status === 'Pending Internal Review');
  const act = async (id, patch, logType, oldStatus) => {
    setSaving(id);
    const now = new Date().toISOString();
    await base44.entities.ApprovalRequest.update(id, { ...patch, ...(patch.status === 'Approved' ? { decided_at: now } : {}) });
    await base44.entities.ApprovalActionLog.create({ approval_request_id: id, action_type: logType, action_by: 'Agency', action_by_role: 'Internal', action_date: now, old_status: oldStatus, new_status: patch.status });
    setSaving(null); onRefresh();
  };
  if (items.length === 0) return <Empty msg="No items pending internal review." full />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]">
        <thead><tr className="border-b border-slate-800">{['Title','Client','Type','Owner','Requested','Due Date','Status','Actions'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map(r => (
            <tr key={r.id} className="hover:bg-slate-800/20">
              <td className="px-3 py-3"><button onClick={() => onOpen(r)} className="font-medium text-white hover:text-blue-300 truncate max-w-[180px] block">{r.title}</button></td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.business_name || 'NTA'}</td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.request_type}</td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.internal_owner || '—'}</td>
              <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(r.requested_date)}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap"><span className={isOverdue(r.due_date) ? 'text-red-400 font-semibold' : 'text-slate-500'}>{r.due_date ? fmtDate(r.due_date) : '—'}</span></td>
              <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-3 py-3">
                <div className="flex gap-1">
                  <button onClick={() => act(r.id, { status: 'Approved', final_decision: 'Approved' }, 'Approved', r.status)} disabled={saving === r.id} className="text-xs px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50">✓</button>
                  <button onClick={() => act(r.id, { status: 'Rejected' }, 'Rejected', r.status)} disabled={saving === r.id} className="text-xs px-2 py-1 bg-red-900/40 border border-red-800 text-red-300 rounded-lg disabled:opacity-50">✗</button>
                  <button onClick={() => act(r.id, { status: 'Pending Client Review', approval_stage: 'Client Review' }, 'Sent for Review', r.status)} disabled={saving === r.id} className="text-xs px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">→ Client</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClientTab({ requests, onRefresh, onOpen }) {
  const [saving, setSaving] = useState(null);
  const [copied, setCopied] = useState(null);
  const items = requests.filter(r => r.status === 'Pending Client Review');

  const manualAct = async (r, status, finalDecision) => {
    setSaving(r.id + status);
    const now = new Date().toISOString();
    await base44.entities.ApprovalRequest.update(r.id, { status, final_decision: finalDecision, decided_at: now });
    await base44.entities.ApprovalActionLog.create({ approval_request_id: r.id, action_type: status === 'Approved' ? 'Approved' : 'Rejected', action_by: 'Agency (Manual)', action_by_role: 'Internal', action_date: now, old_status: r.status, new_status: status });
    setSaving(null); onRefresh();
  };

  const copyLink = (r) => {
    navigator.clipboard.writeText(`${window.location.origin}/approval/${r.signoff_token}`);
    setCopied(r.id); setTimeout(() => setCopied(null), 2000);
  };

  if (items.length === 0) return <Empty msg="No items pending client review." full />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead><tr className="border-b border-slate-800">{['Title','Client','Contact','Type','Sent','Due','Revisions','Status','Actions'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map(r => (
            <tr key={r.id} className="hover:bg-slate-800/20">
              <td className="px-3 py-3"><button onClick={() => onOpen(r)} className="font-medium text-white hover:text-blue-300 truncate max-w-[160px] block">{r.title}</button></td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.business_name || 'NTA'}</td>
              <td className="px-3 py-3 text-xs"><p className="text-slate-300">{r.client_contact_name || '—'}</p><p className="text-slate-500">{r.client_contact_email || ''}</p></td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.request_type}</td>
              <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(r.requested_date)}</td>
              <td className="px-3 py-3 text-xs"><span className={isOverdue(r.due_date) ? 'text-red-400 font-semibold' : 'text-slate-500'}>{r.due_date ? fmtDate(r.due_date) : '—'}</span></td>
              <td className="px-3 py-3 text-center text-slate-400 text-xs">{r.revision_count || 0}</td>
              <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-3 py-3">
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => copyLink(r)} className={`text-xs px-2 py-1 rounded-lg ${copied === r.id ? 'bg-emerald-800 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>{copied === r.id ? '✓ Copied' : 'Copy Link'}</button>
                  <button onClick={() => manualAct(r, 'Approved', 'Approved')} disabled={!!saving} className="text-xs px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50">✓</button>
                  <button onClick={() => manualAct(r, 'Rejected', 'Rejected')} disabled={!!saving} className="text-xs px-2 py-1 bg-red-900/40 border border-red-800 text-red-300 rounded-lg disabled:opacity-50">✗</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RevisionsTab({ requests, onOpen }) {
  const items = requests.filter(r => r.status === 'Revision Requested');
  if (items.length === 0) return <Empty msg="No revision requests outstanding. ✅" full />;
  return (
    <div className="space-y-3">
      {items.map(r => (
        <button key={r.id} onClick={() => onOpen(r)} className="w-full text-left bg-slate-900 border border-orange-900/40 rounded-xl p-5 hover:border-orange-800/60 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div><p className="font-semibold text-white">{r.title}</p><p className="text-xs text-slate-500 mt-0.5">{r.business_name || 'NTA'} · Round {r.revision_count || 1}</p></div>
            <span className="text-xs font-bold text-orange-400 bg-orange-900/30 border border-orange-800 px-2 py-0.5 rounded-full flex-shrink-0">Revision #{r.revision_count || 1}</span>
          </div>
          {r.latest_revision_notes && <div className="mt-3 bg-orange-950/20 border border-orange-900/30 rounded-lg p-3"><p className="text-sm text-orange-200">{r.latest_revision_notes}</p></div>}
        </button>
      ))}
    </div>
  );
}

function ApprovedTab({ requests, onOpen }) {
  const items = requests.filter(r => r.status === 'Approved').sort((a,b) => (b.decided_at||'').localeCompare(a.decided_at||''));
  if (items.length === 0) return <Empty msg="No approved items yet." full />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-800">{['Title','Client','Type','Stage','Approved Date'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map(r => (
            <tr key={r.id} className="hover:bg-slate-800/20 cursor-pointer" onClick={() => onOpen(r)}>
              <td className="px-3 py-3 font-medium text-white">{r.title}</td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.business_name || 'NTA'}</td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.request_type}</td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.approval_stage}</td>
              <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(r.decided_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockedTab({ requests, onRefresh, onOpen }) {
  const [saving, setSaving] = useState(null);
  const items = requests.filter(r => ['Expired','Rejected','Cancelled'].includes(r.status));
  const reactivate = async (r) => {
    setSaving(r.id); await base44.entities.ApprovalRequest.update(r.id, { status: 'Pending Internal Review', final_decision: null }); setSaving(null); onRefresh();
  };
  const manualApprove = async (r) => {
    setSaving(r.id + 'a'); const now = new Date().toISOString();
    await base44.entities.ApprovalRequest.update(r.id, { status: 'Approved', final_decision: 'Approved (Override)', decided_at: now });
    setSaving(null); onRefresh();
  };
  if (items.length === 0) return <Empty msg="No blocked or expired requests." full />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-800">{['Title','Client','Status','Due Date','Actions'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-800/60">
          {items.map(r => (
            <tr key={r.id} className="hover:bg-slate-800/20">
              <td className="px-3 py-3"><button onClick={() => onOpen(r)} className="font-medium text-white hover:text-blue-300">{r.title}</button></td>
              <td className="px-3 py-3 text-slate-400 text-xs">{r.business_name || 'NTA'}</td>
              <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-3 py-3 text-slate-500 text-xs">{r.due_date ? fmtDate(r.due_date) : '—'}</td>
              <td className="px-3 py-3">
                <div className="flex gap-1">
                  <button onClick={() => reactivate(r)} disabled={!!saving} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Reopen</button>
                  <button onClick={() => manualApprove(r)} disabled={!!saving} className="text-xs px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg">Approve</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab({ clients, preferences, onRefresh }) {
  const MODES = ['No Client Approval Needed','Approve Every Post','Approve Campaigns Only','Approve Only Promotional Content','Manual Selection Per Post'];
  const [saving, setSaving] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openEdit = (client) => {
    const pref = preferences.find(p => p.client_id === client.id) || {};
    setForm({ client_id: client.id, business_name: client.business_name, approvals_required: pref.approvals_required || false, approval_mode: pref.approval_mode || 'No Client Approval Needed', default_approver_name: pref.default_approver_name || '', default_approver_email: pref.default_approver_email || '', approval_sla_days: pref.approval_sla_days ?? 3, auto_approve_if_no_response: pref.auto_approve_if_no_response || false, require_final_internal_check: pref.require_final_internal_check || false, notes: pref.notes || '', _id: pref.id || null });
    setEditing(client.id);
  };

  const save = async () => {
    setSaving(form.client_id);
    const { _id, ...payload } = form;
    if (_id) await base44.entities.ClientApprovalPreference.update(_id, payload);
    else await base44.entities.ClientApprovalPreference.create(payload);
    setSaving(null); setEditing(null); onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {clients.map(client => {
          const pref = preferences.find(p => p.client_id === client.id);
          const isOpen = editing === client.id;
          return (
            <div key={client.id} className="border-b border-slate-800 last:border-0">
              <div className="flex items-center justify-between px-5 py-4">
                <div><p className="font-medium text-white">{client.business_name}</p><p className="text-xs text-slate-500">{pref?.approval_mode || 'Not configured'}</p></div>
                <button onClick={() => isOpen ? setEditing(null) : openEdit(client)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">{isOpen ? 'Cancel' : 'Edit'}</button>
              </div>
              {isOpen && (
                <div className="bg-slate-800/30 px-5 pb-5 border-t border-slate-800 space-y-3 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.approvals_required} onChange={e => setForm(f=>({...f,approvals_required:e.target.checked}))} className="accent-blue-500" /><span className="text-sm text-white">Approvals Required</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={LBL}>Mode</label><select value={form.approval_mode} onChange={e => setForm(f=>({...f,approval_mode:e.target.value}))} className={IN}>{MODES.map(m=><option key={m}>{m}</option>)}</select></div>
                    <div><label className={LBL}>SLA Days</label><input type="number" value={form.approval_sla_days} onChange={e => setForm(f=>({...f,approval_sla_days:parseInt(e.target.value)}))} className={IN} /></div>
                    <div><label className={LBL}>Approver Name</label><input value={form.default_approver_name} onChange={e => setForm(f=>({...f,default_approver_name:e.target.value}))} className={IN} /></div>
                    <div><label className={LBL}>Approver Email</label><input value={form.default_approver_email} onChange={e => setForm(f=>({...f,default_approver_email:e.target.value}))} className={IN} /></div>
                  </div>
                  <button onClick={save} disabled={saving === form.client_id} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50">{saving === form.client_id ? 'Saving...' : 'Save'}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryTab({ requests, onOpen }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { base44.entities.ApprovalActionLog.list('-action_date', 200).then(l => { setLogs(l); setLoading(false); }); }, []);
  const reqMap = {}; requests.forEach(r => reqMap[r.id] = r);
  if (loading) return <div className="text-center text-slate-600 py-8">Loading...</div>;
  if (logs.length === 0) return <Empty msg="No history yet." full />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-800">{['Date','Action','By','Request','Client','Notes'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-800/60">
          {logs.map(log => {
            const req = reqMap[log.approval_request_id];
            return (
              <tr key={log.id} className="hover:bg-slate-800/20">
                <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(log.action_date)}</td>
                <td className="px-3 py-3 text-white text-xs font-semibold">{log.action_type}</td>
                <td className="px-3 py-3 text-slate-400 text-xs">{log.action_by || '—'}</td>
                <td className="px-3 py-3">{req ? <button onClick={() => onOpen(req)} className="text-xs text-blue-400 hover:text-blue-300 truncate max-w-[140px] block">{req.title}</button> : <span className="text-slate-600 text-xs">—</span>}</td>
                <td className="px-3 py-3 text-slate-400 text-xs">{req?.business_name || '—'}</td>
                <td className="px-3 py-3 text-slate-500 text-xs truncate max-w-[160px]">{log.notes || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Helpers
function Section({ title, action, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
        {action && <button onClick={action} className="text-xs text-blue-500 hover:text-blue-300">View All →</button>}
      </div>
      <div className="divide-y divide-slate-800/50">{children}</div>
    </div>
  );
}

function Row({ r, onOpen }) {
  return (
    <button onClick={() => onOpen(r)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors gap-2">
      <div className="min-w-0 text-left"><p className="text-sm font-medium text-white truncate">{r.title}</p><p className="text-xs text-slate-500">{r.business_name || 'NTA'} · {r.request_type}</p></div>
      <StatusBadge status={r.status} />
    </button>
  );
}

function Empty({ msg, full }) {
  return <div className={`${full ? 'bg-slate-900 border border-slate-800 rounded-xl ' : ''}p-12 text-center text-slate-600 text-sm`}>{msg}</div>;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const LBL = 'block text-xs text-slate-400 mb-1';
const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500';