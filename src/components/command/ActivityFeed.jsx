import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

function FeedItem({ icon, text, time, color }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className={`text-base shrink-0 mt-0.5`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 leading-snug">{text}</p>
        <p className="text-xs text-slate-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  const { data: leads = [] } = useQuery({
    queryKey: ['cc-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 10)
  });
  const { data: blogs = [] } = useQuery({
    queryKey: ['cc-blogs'],
    queryFn: () => base44.entities.BlogPost.list('-created_date', 5)
  });
  const { data: cases = [] } = useQuery({
    queryKey: ['cc-cases'],
    queryFn: () => base44.entities.CaseStudy.list('-created_date', 5)
  });
  const { data: notifs = [] } = useQuery({
    queryKey: ['cc-notifs'],
    queryFn: () => base44.entities.SalesNotification.list('-created_date', 10)
  });
  const { data: trials = [] } = useQuery({
    queryKey: ['cc-trials'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 5)
  });

  const allEvents = [
    ...leads.slice(0, 5).map(l => ({
      icon: '👤',
      text: `New lead: ${l.business_name || l.name} from ${l.city || 'Unknown'}`,
      date: new Date(l.created_date)
    })),
    ...blogs.slice(0, 3).map(b => ({
      icon: '📝',
      text: `Blog published: "${b.title}"`,
      date: new Date(b.created_date)
    })),
    ...cases.slice(0, 3).map(c => ({
      icon: '📊',
      text: `Case study created: ${c.business_name} (${c.industry})`,
      date: new Date(c.created_date)
    })),
    ...notifs.slice(0, 5).map(n => ({
      icon: n.notification_type === 'hot_lead' ? '🔥' : n.notification_type === 'proposal_viewed' ? '👀' : '⚡',
      text: n.title,
      date: new Date(n.created_date)
    })),
    ...trials.slice(0, 3).map(t => ({
      icon: '🚀',
      text: `Trial started: ${t.name} (${t.industry})`,
      date: new Date(t.created_date)
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 15);

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-2 divide-y divide-slate-700/50">
        {allEvents.length === 0 && (
          <div className="py-8 text-center text-slate-500">No activity yet.</div>
        )}
        {allEvents.map((e, i) => (
          <FeedItem
            key={i}
            icon={e.icon}
            text={e.text}
            time={formatDistanceToNow(e.date, { addSuffix: true })}
          />
        ))}
      </div>
    </div>
  );
}