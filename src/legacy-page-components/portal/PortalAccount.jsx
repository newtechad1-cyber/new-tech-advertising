import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';

export default function PortalAccount() {
  const { user, client, portalUser, loading: authLoading } = usePortalClient();
  const [pref, setPref] = useState(null);
  const [portalUsers, setPortalUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client?.id) return;
    Promise.all([
      base44.entities.ClientApprovalPreference.filter({ client_id: client.id }),
      base44.entities.ClientPortalUser.filter({ client_id: client.id }),
    ]).then(([prefs, users]) => {
      setPref(prefs[0] || null);
      setPortalUsers(users);
      setLoading(false);
    });
  }, [client?.id]);

  if (authLoading || loading) return <Loader />;

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account</h1>
          <p className="text-slate-500 text-sm mt-1">Your portal access and account settings.</p>
        </div>

        {/* Business card */}
        <Card title="Your Business">
          <Row label="Business" value={client?.business_name || '—'} />
          <Row label="Website" value={client?.website || '—'} />
          <Row label="City / State" value={client?.city ? `${client.city}, ${client.state}` : '—'} />
          <Row label="Contact" value={client?.primary_contact || '—'} />
          <Row label="Email" value={client?.email || '—'} />
          <Row label="Phone" value={client?.phone || '—'} />
        </Card>

        {/* Your access */}
        <Card title="Your Access">
          <Row label="Name" value={portalUser?.full_name || user?.full_name || '—'} />
          <Row label="Email" value={portalUser?.email || user?.email || '—'} />
          <Row label="Role" value={portalUser?.role || '—'} />
          <Row label="Access" value={portalUser?.access_status || 'Active'} />
        </Card>

        {/* Approval preferences */}
        {pref && (
          <Card title="Approval Preferences">
            <Row label="Approval Mode" value={pref.approval_mode || '—'} />
            <Row label="Review Required" value={pref.approvals_required ? 'Yes' : 'No'} />
            <Row label="Default Reviewer" value={pref.default_approver_name || '—'} />
            <Row label="Default Email" value={pref.default_approver_email || '—'} />
            <Row label="SLA" value={pref.approval_sla_days ? `${pref.approval_sla_days} days` : '—'} />
            <Row label="Auto-approve if no response" value={pref.auto_approve_if_no_response ? 'Yes' : 'No'} />
          </Card>
        )}

        {/* Team members */}
        {portalUsers.length > 1 && (
          <Card title="Portal Team">
            <div className="space-y-2 pt-1">
              {portalUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{u.full_name || u.email}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{u.role}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <p className="text-xs text-slate-400 text-center">Need to update your settings? Contact New Tech Advertising.</p>
      </div>
    </PortalLayout>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
      <h2 className="text-sm font-bold text-slate-700 mb-3">{title}</h2>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 font-medium text-right max-w-[200px] truncate">{value}</p>
    </div>
  );
}

function Loader() { return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>; }