import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';
import { CheckSquare, Calendar, FileText, BarChart2, AlertCircle } from 'lucide-react';

const FRIENDLY_STATUS = {
  'Pending Client Review': 'Waiting for Your Approval',
  'Pending Internal Review': 'Being Reviewed Internally',
  'Approved': 'Approved',
  'Rejected': 'Changes Requested',
  'Revision Requested': 'Changes Requested',
  'Scheduled': 'Scheduled',
  'Published': 'Posted',
  'Blocked': 'Needs Attention',
};

export default function PortalDashboard() {
  const { user, client, portalUser, loading: authLoading, error: authError } = usePortalClient();
  const [data, setData] = useState({ approvals: [], posts: [], campaigns: [], notes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client?.id) return;
    const cid = client.id;
    Promise.all([
      base44.entities.ApprovalRequest.filter({ client_id: cid }),
      base44.entities.CampaignPost.filter({ client_id: cid }),
      base44.entities.Campaign.filter({ client_id: cid }),
      base44.entities.ClientPortalNote.filter({ client_id: cid, visibility: 'Client Visible' }),
    ]).then(([approvals, posts, campaigns, notes]) => {
      setData({ approvals, posts, campaigns, notes });
      setLoading(false);
    });
  }, [client?.id]);

  if (authLoading || loading) return <LoadingScreen />;
  if (authError) return <ErrorScreen msg={authError} />;

  const now = new Date();
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const pendingApprovals = data.approvals.filter(a => a.status === 'Pending Client Review');
  const scheduledThisWeek = data.posts.filter(p => p.scheduled_date && new Date(p.scheduled_date) >= now && new Date(p.scheduled_date) <= weekEnd && p.publishing_status !== 'Published');
  const publishedThisMonth = data.posts.filter(p => p.published_at && new Date(p.published_at) >= monthStart);
  const activeCampaigns = data.campaigns.filter(c => c.status === 'Active');
  const recentNotes = data.notes.slice(0, 3);
  const upcoming = data.posts.filter(p => p.scheduled_date && new Date(p.scheduled_date) >= now).sort((a,b) => a.scheduled_date.localeCompare(b.scheduled_date)).slice(0, 5);
  const recentPublished = data.posts.filter(p => p.publishing_status === 'Published').sort((a,b) => (b.published_at||'').localeCompare(a.published_at||'')).slice(0, 5);

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-5xl mx-auto space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with {client?.business_name || 'your account'} this week.</p>
        </div>

        {/* Alert: pending approvals */}
        {pendingApprovals.length > 0 && (
          <Link to="/portal/approvals" className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100 transition-colors">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">You have {pendingApprovals.length} item{pendingApprovals.length !== 1 ? 's' : ''} waiting for your approval</p>
              <p className="text-xs text-amber-600 mt-0.5">Tap to review →</p>
            </div>
          </Link>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Awaiting Approval', value: pendingApprovals.length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', href: '/portal/approvals', icon: CheckSquare },
            { label: 'Scheduled This Week', value: scheduledThisWeek.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', href: '/portal/calendar', icon: Calendar },
            { label: 'Posted This Month', value: publishedThisMonth.length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', href: '/portal/content', icon: FileText },
            { label: 'Active Campaigns', value: activeCampaigns.length, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200', href: '/portal/performance', icon: BarChart2 },
          ].map(card => (
            <Link key={card.label} to={card.href} className={`border rounded-2xl p-4 flex flex-col gap-2 hover:shadow-sm transition-all ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-xs text-slate-500 leading-tight">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming posts */}
          <Section title="Coming Up" action={{ label: 'View Calendar', href: '/portal/calendar' }}>
            {upcoming.length === 0 ? <EmptyState msg="No posts scheduled yet." /> : upcoming.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.platform} · {p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0">Scheduled</span>
              </div>
            ))}
          </Section>

          {/* Recent published */}
          <Section title="Recently Posted" action={{ label: 'View All', href: '/portal/content' }}>
            {recentPublished.length === 0 ? <EmptyState msg="Nothing published yet." /> : recentPublished.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.platform} · {p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0">Posted</span>
              </div>
            ))}
          </Section>

          {/* Pending approvals preview */}
          {pendingApprovals.length > 0 && (
            <Section title="Needs Your Approval" action={{ label: 'Review All', href: '/portal/approvals' }}>
              {pendingApprovals.slice(0, 3).map(a => (
                <Link key={a.id} to="/portal/approvals" className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-4 px-4 transition-colors rounded-xl">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.request_type} · {a.due_date ? `Due ${new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No due date'}</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0">Review →</span>
                </Link>
              ))}
            </Section>
          )}

          {/* Agency messages */}
          {recentNotes.length > 0 && (
            <Section title="Messages from Your Team" action={{ label: 'View All', href: '/portal/messages' }}>
              {recentNotes.map(n => (
                <div key={n.id} className="py-3 border-b border-slate-100 last:border-0">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message_body}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.created_date ? new Date(n.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link to="/portal/approvals" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors">
            <CheckSquare className="w-4 h-4" /> Review Approvals
          </Link>
          <Link to="/portal/calendar" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
            <Calendar className="w-4 h-4" /> View Calendar
          </Link>
          <Link to="/portal/content" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
            <FileText className="w-4 h-4" /> View Published Content
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}

function Section({ title, action, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-700">{title}</h2>
        {action && <Link to={action.href} className="text-xs text-blue-600 hover:text-blue-700 font-medium">{action.label} →</Link>}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ msg }) {
  return <p className="text-sm text-slate-400 py-4 text-center">{msg}</p>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function ErrorScreen({ msg }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-4xl mb-3">🔒</p>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Access Not Found</h1>
        <p className="text-slate-500 text-sm">{msg}</p>
        <p className="text-xs text-slate-400 mt-4">Contact your agency to get access to the client portal.</p>
      </div>
    </div>
  );
}