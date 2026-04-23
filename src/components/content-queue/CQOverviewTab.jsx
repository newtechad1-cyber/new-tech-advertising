import React from 'react';
import { Plus, Send, Eye, Calendar } from 'lucide-react';
import { CQStatusBadge, CQApprovalBadge } from './CQUtils';

export default function CQOverviewTab({ items, clients, campaigns, onNewContent, onTabChange, onAssign }) {
  const active = items.filter(i => i.queue_status !== 'Archived');
  const recent = [...active].slice(0, 6);
  const toReview = active.filter(i => i.approval_status === 'Pending' || i.review_status === 'Unreviewed').slice(0, 5);
  const readyToSchedule = active.filter(i => i.queue_status === 'Ready to Schedule').slice(0, 5);
  const needsRevision = active.filter(i => i.approval_status === 'Revision Needed').slice(0, 5);
  const assigned = active.filter(i => i.queue_status === 'Assigned to Campaign').slice(0, 5);

  const internal = active.filter(i => !i.client_id);
  const forClients = active.filter(i => !!i.client_id);
  const aiGenerated = active.filter(i => i.source_type === 'AI Generated');

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plus,     label: 'Add Content',      action: onNewContent,                                   color: 'bg-blue-600 hover:bg-blue-500 text-white' },
          { icon: Eye,      label: 'Review Queue',      action: () => onTabChange('review'),                   color: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white' },
          { icon: Send,     label: 'Assign to Campaign',action: () => onAssign(active.filter(i => i.approval_status === 'Approved' && i.queue_status === 'Ready to Schedule')), color: 'bg-violet-800 hover:bg-violet-700 border border-violet-700 text-violet-100' },
          { icon: Calendar, label: 'View Scheduled',    action: () => onTabChange('scheduled'),                color: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white' },
        ].map(q => (
          <button key={q.label} onClick={q.action} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${q.color}`}>
            <q.icon className="w-4 h-4 flex-shrink-0" />{q.label}
          </button>
        ))}
      </div>

      {/* Snapshot */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'NTA Internal', value: internal.length, color: 'text-blue-400' },
          { label: 'Client Content', value: forClients.length, color: 'text-violet-400' },
          { label: 'AI Generated', value: aiGenerated.length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Section title="Newest Content" action={{ label: 'View All', onClick: () => onTabChange('queue') }}>
          {recent.length === 0 ? <Empty message="No content yet" action={{ label: 'Add Content', onClick: onNewContent }} /> :
            recent.map(i => <ItemRow key={i.id} item={i} />)}
        </Section>

        <Section title="Awaiting Review" action={{ label: 'Review All', onClick: () => onTabChange('review') }}>
          {toReview.length === 0 ? <Empty message="Review queue is clear ✅" /> :
            toReview.map(i => <ItemRow key={i.id} item={i} showApproval />)}
        </Section>

        <Section title="Ready to Schedule" action={{ label: 'Assign', onClick: () => onTabChange('assign') }}>
          {readyToSchedule.length === 0 ? <Empty message="No items ready yet" /> :
            readyToSchedule.map(i => <ItemRow key={i.id} item={i} showQueue />)}
        </Section>

        <Section title="Needs Revision" highlight={needsRevision.length > 0}>
          {needsRevision.length === 0 ? <Empty message="No revisions needed ✅" /> :
            needsRevision.map(i => <ItemRow key={i.id} item={i} showApproval />)}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, action, highlight }) {
  return (
    <div className={`bg-slate-900 border rounded-xl overflow-hidden ${highlight ? 'border-orange-900/60' : 'border-slate-800'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
        {action && <button onClick={action.onClick} className="text-xs text-blue-500 hover:text-blue-300">{action.label} →</button>}
      </div>
      <div className="divide-y divide-slate-800/60">{children}</div>
    </div>
  );
}

function ItemRow({ item, showApproval, showQueue }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{item.content_title}</p>
        <p className="text-xs text-slate-500">{item.business_name || 'NTA'} · {item.content_type} · {item.platform_recommended || '—'}</p>
      </div>
      {showApproval && <CQApprovalBadge status={item.approval_status} />}
      {showQueue && <CQStatusBadge status={item.queue_status} />}
      {!showApproval && !showQueue && <CQStatusBadge status={item.queue_status} />}
    </div>
  );
}

function Empty({ message, action }) {
  return (
    <div className="px-4 py-8 text-center">
      <p className="text-slate-600 text-sm mb-2">{message}</p>
      {action && <button onClick={action.onClick} className="text-xs text-blue-500 hover:text-blue-300 font-semibold">{action.label} →</button>}
    </div>
  );
}