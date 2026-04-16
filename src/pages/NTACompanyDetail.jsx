import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Building2, Loader2, Users, Target, FolderKanban, Megaphone, CheckSquare, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'opportunities', label: 'Opportunities', icon: Target },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'activity', label: 'Activity', icon: Activity },
];

export default function NTACompanyDetail() {
  const id = window.location.pathname.split('/').pop();
  const [company, setCompany] = useState(null);
  const [tab, setTab] = useState('overview');
  const [contacts, setContacts] = useState([]);
  const [opps, setOpps] = useState([]);
  const [projects, setProjects] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [co, ct, op, pr, ca, tk, ac] = await Promise.all([
        base44.entities.NTACompany.filter({ id }),
        base44.entities.NTAContact.filter({ company_id: id }),
        base44.entities.NTAOpportunity.filter({ company_id: id }),
        base44.entities.NTAClientProject.filter({ company_id: id }),
        base44.entities.NTACampaign.filter({ company_id: id }),
        base44.entities.NTATask.filter({ company_id: id }, '-created_date', 50),
        base44.entities.NTAActivity.filter({ company_id: id }, '-created_date', 50),
      ]);
      setCompany(co[0] || null);
      setContacts(ct);
      setOpps(op);
      setProjects(pr);
      setCampaigns(ca);
      setTasks(tk);
      setActivities(ac);
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 text-slate-400 animate-spin" /></div>;
  if (!company) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Company not found</div>;

  const statusColor = company.active_client ? 'text-green-400' : 'text-slate-400';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/nta/companies" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-3"><ArrowLeft className="w-3 h-3" />Companies</Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{company.company_name}</h1>
                <Badge className={`${company.active_client ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-400'} border-0`}>{company.active_client ? 'Active Client' : company.lifecycle_stage}</Badge>
              </div>
              <div className="flex gap-4 text-slate-400 text-sm mt-1 flex-wrap">
                {company.website && <span>{company.website}</span>}
                {company.email && <span>{company.email}</span>}
                {company.city && <span>{company.city}{company.state ? `, ${company.state}` : ''}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6">
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${tab === t.id ? 'border-violet-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
                <Icon className="w-3.5 h-3.5" />{t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-slate-300 font-semibold text-sm">Company Info</h3>
              {[['Name', company.company_name], ['Website', company.website], ['Email', company.email], ['Phone', company.phone], ['Industry', company.industry], ['Source', company.source], ['Stage', company.lifecycle_stage]].map(([k,v]) => v ? (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">{k}</span>
                  <span className="text-slate-200 text-xs">{v}</span>
                </div>
              ) : null)}
            </div>
            <div className="space-y-3">
              {[
                { label: 'Open Opportunities', value: opps.filter(o => o.status === 'open').length, color: 'text-violet-400' },
                { label: 'Active Projects', value: projects.filter(p => p.status === 'in_progress').length, color: 'text-cyan-400' },
                { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length, color: 'text-orange-400' },
                { label: 'Open Tasks', value: tasks.filter(t => t.status === 'todo').length, color: 'text-amber-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{label}</span>
                  <span className={`text-2xl font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div className="space-y-2">
            {contacts.length === 0 ? <p className="text-slate-500 text-sm">No contacts yet</p> : contacts.map(c => (
              <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{c.name}</p>
                  {c.is_primary && <Badge className="bg-violet-900 text-violet-300 border-0 text-xs">Primary</Badge>}
                  {c.role && <span className="text-slate-500 text-xs">{c.role}</span>}
                </div>
                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                  {c.email && <span>{c.email}</span>}
                  {c.phone && <span>{c.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'opportunities' && (
          <div className="space-y-2">
            {opps.length === 0 ? <p className="text-slate-500 text-sm">No opportunities yet</p> : opps.map(o => (
              <div key={o.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{o.opportunity_name}</p>
                  <Badge className="bg-violet-900 text-violet-300 border-0 text-xs">{o.stage}</Badge>
                </div>
                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                  <span>{o.offer_type}</span>
                  {o.estimated_value && <span>${o.estimated_value.toLocaleString()}</span>}
                  {o.next_step_due && <span>Due: {o.next_step_due}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-2">
            {projects.length === 0 ? <p className="text-slate-500 text-sm">No projects yet</p> : projects.map(p => (
              <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{p.project_name}</p>
                  <Badge className="bg-cyan-900 text-cyan-300 border-0 text-xs">{p.status}</Badge>
                </div>
                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                  <span>{p.project_type}</span>
                  {p.due_date && <span>Due: {p.due_date}</span>}
                  {p.owner && <span>Owner: {p.owner}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'campaigns' && (
          <div className="space-y-2">
            {campaigns.length === 0 ? <p className="text-slate-500 text-sm">No campaigns yet</p> : campaigns.map(c => (
              <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{c.campaign_name}</p>
                  <Badge className="bg-orange-900 text-orange-300 border-0 text-xs">{c.status}</Badge>
                </div>
                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                  <span>{c.campaign_type}</span>
                  <span>{c.channel}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'tasks' && (
          <div className="space-y-2">
            {tasks.length === 0 ? <p className="text-slate-500 text-sm">No tasks yet</p> : tasks.map(t => (
              <div key={t.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{t.title}</p>
                  <div className="flex gap-2">
                    <Badge className={`border-0 text-xs ${t.status === 'done' ? 'bg-green-900 text-green-300' : t.status === 'in_progress' ? 'bg-blue-900 text-blue-300' : 'bg-slate-700 text-slate-400'}`}>{t.status}</Badge>
                    <Badge className={`border-0 text-xs ${t.priority === 'urgent' ? 'bg-red-900 text-red-300' : t.priority === 'high' ? 'bg-orange-900 text-orange-300' : 'bg-slate-700 text-slate-400'}`}>{t.priority}</Badge>
                  </div>
                </div>
                {t.due_date && <p className="text-slate-500 text-xs mt-1">Due: {t.due_date}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'activity' && (
          <div className="space-y-2">
            {activities.length === 0 ? <p className="text-slate-500 text-sm">No activity yet</p> : activities.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{a.title}</p>
                    <Badge className="bg-slate-700 text-slate-400 border-0 text-xs">{a.activity_type}</Badge>
                  </div>
                  {a.details && <p className="text-slate-400 text-xs mt-1">{a.details}</p>}
                  <p className="text-slate-600 text-xs mt-1">{new Date(a.created_date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}