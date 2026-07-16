import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, Mail,
  MessageCircle, Radio, Search, UserCheck, Users, Loader2
} from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);

const JOURNEY = [
  {
    title: '1. Find the right business',
    oldSchool: 'Drive around and notice who may need help',
    online: 'Build a focused prospect list from local businesses, referrals, chambers, LinkedIn, and website activity',
    icon: Search,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    title: '2. Introduce yourself',
    oldSchool: 'Walk in, say hello, and see if they have time',
    online: 'Send a short personal email, message, or make a phone call without forcing a pitch',
    icon: MessageCircle,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  },
  {
    title: '3. Keep showing up',
    oldSchool: 'Stop back later and bring something useful',
    online: 'Follow up respectfully and invite them to the NTA Journal only with permission',
    icon: Mail,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  },
  {
    title: '4. Earn the conversation',
    oldSchool: 'Sit down and learn what is happening in their business',
    online: 'Use the NTA Growth Conversation, Business Score, audit, or a relevant lesson',
    icon: Users,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  },
  {
    title: '5. Recommend the next step',
    oldSchool: 'Recommend airtime only when it fits',
    online: 'Open a personalized sales room, roadmap, or proposal tied to the problem they described',
    icon: CheckCircle2,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
];

export default function OnlineSalesJourney({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      base44.entities.SalesLead.list('-created_date', 500),
      base44.entities.Subscriber.list('-created_date', 500),
      base44.entities.EmailTemplate.list('-created_date', 100),
    ]).then(([leadData, subscriberData, emailData]) => {
      if (!mounted) return;
      setLeads(leadData || []);
      setSubscribers(subscriberData || []);
      setEmails(emailData || []);
    }).catch(() => {
      if (!mounted) return;
      setLeads([]);
      setSubscribers([]);
      setEmails([]);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const metrics = useMemo(() => {
    const activeLeads = leads.filter(lead => !lead.archived && !['closed_won', 'closed_lost'].includes(lead.status));
    const due = activeLeads.filter(lead => lead.next_follow_up && lead.next_follow_up <= today());
    return {
      prospects: activeLeads.length,
      followUps: due.length,
      subscribers: subscribers.filter(sub => sub.status === 'active').length,
      journalDrafts: emails.filter(email => email.type === 'broadcast' && email.status !== 'sent').length,
    };
  }, [leads, subscribers, emails]);

  if (loading) {
    return <div className="py-16 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Connecting the sales journey…</div>;
  }

  return (
    <div className="space-y-7">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.18em]">NTA Online Sales Journey</p>
            <h2 className="text-2xl font-bold text-white mt-2">Your old sales method—without driving around</h2>
            <p className="text-slate-300 mt-2 leading-relaxed">
              Find the right people, introduce yourself, keep showing up with something useful, earn the conversation, and recommend only what fits. AI handles research, reminders, records, and repetition. You keep the human relationship.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onNavigate('leads')} className="bg-amber-600 hover:bg-amber-700">
              <Search className="w-4 h-4 mr-2" /> Work Prospects
            </Button>
            <Button onClick={() => onNavigate('journal')} className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="w-4 h-4 mr-2" /> Build Journal
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Prospects', value: metrics.prospects, icon: Search, color: 'text-amber-400' },
          { label: 'Follow-ups Due', value: metrics.followUps, icon: CalendarDays, color: 'text-red-400' },
          { label: 'Journal Subscribers', value: metrics.subscribers, icon: UserCheck, color: 'text-orange-400' },
          { label: 'Journal Drafts', value: metrics.journalDrafts, icon: BookOpen, color: 'text-blue-400' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${item.color}`} />
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              </div>
              <p className="text-slate-400 text-xs mt-3">{item.label}</p>
            </div>
          );
        })}
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <h3 className="text-white font-bold">The connected process</h3>
            <p className="text-slate-500 text-sm">Every contact has a next step. Nobody disappears into a spreadsheet.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
          {JOURNEY.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={`relative border rounded-xl p-4 ${step.color}`}>
                <Icon className="w-5 h-5 mb-3" />
                <h4 className="text-white text-sm font-bold">{step.title}</h4>
                <p className="text-slate-500 text-xs mt-3 font-semibold uppercase tracking-wide">Then</p>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{step.oldSchool}</p>
                <p className="text-slate-500 text-xs mt-3 font-semibold uppercase tracking-wide">Now</p>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{step.online}</p>
                {index < JOURNEY.length - 1 && <ArrowRight className="hidden xl:block absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 z-10" />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" /><h3 className="text-white font-bold">Weekly trust rhythm</h3></div>
          <div className="mt-4 space-y-3 text-sm">
            <button onClick={() => onNavigate('journal')} className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-3 text-left">
              <span><strong className="text-white">NTA Journal</strong><span className="block text-slate-500 text-xs">One useful weekly email; teach, do not overwhelm</span></span><ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
              <span><strong className="text-white">NTA Growth Show</strong><span className="block text-slate-500 text-xs">One weekly conversation that becomes clips, posts, and lessons</span></span><Radio className="w-4 h-4 text-violet-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-amber-400" /><h3 className="text-white font-bold">Simple daily habit</h3></div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              'Add 3–5 good prospects',
              'Make 3 personal introductions',
              'Complete every due follow-up',
              'Invite interested people to the Journal',
            ].map(item => <div key={item} className="bg-slate-800 rounded-lg p-3 text-slate-300 flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />{item}</div>)}
          </div>
          <p className="text-slate-500 text-xs mt-4">The goal is not mass cold email. It is consistent, permission-based relationship building supported by automation.</p>
        </div>
      </section>
    </div>
  );
}
