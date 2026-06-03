import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';

function TaskCard({ task, color }) {
  let parsed;
  try { parsed = JSON.parse(task); } catch { parsed = { title: task }; }
  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-xl p-3`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-slate-300 text-xs font-semibold flex-1">{parsed.title || task}</p>
        {parsed.priority && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            parsed.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
            parsed.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
            parsed.priority === 'immediate' ? 'bg-green-500/20 text-green-400' :
            'bg-slate-700 text-slate-400'
          }`}>{parsed.priority}</span>
        )}
      </div>
      {parsed.type && <p className="text-slate-600 text-xs mt-0.5">{parsed.type?.replace(/_/g,' ')}</p>}
      {parsed.offer && <p className="text-slate-500 text-xs mt-1">Offer: {parsed.offer}</p>}
      {parsed.platforms && <p className="text-slate-500 text-xs mt-0.5">Platforms: {parsed.platforms}</p>}
    </div>
  );
}

function TaskSection({ label, tasks, color = 'text-violet-400' }) {
  if (!tasks?.length) return null;
  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${color}`}>{label} ({tasks.length})</p>
      <div className="space-y-2">
        {tasks.map((t, i) => <TaskCard key={i} task={t} />)}
      </div>
    </div>
  );
}

export default function WeeklyPlanAdmin() {
  const [plans, setPlans] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBiz, setFilterBiz] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [generating, setGenerating] = useState(null);

  const load = async () => {
    setLoading(true);
    const [ps, bs] = await Promise.all([
      base44.entities.WeeklyMarketingPlan.list('-week_start_date', 20),
      base44.entities.BusinessProfile.list()
    ]);
    setPlans(ps);
    setBusinesses(bs);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = plans.filter(p => !filterBiz || p.business_profile_id === filterBiz);
  const getBizName = (id) => businesses.find(b => b.id === id)?.business_name || '—';

  const handleGenerate = async (bizId) => {
    setGenerating(bizId);
    await base44.functions.invoke('generateWeeklyMarketingPlan', { business_profile_id: bizId });
    await load();
    setGenerating(null);
  };

  return (
    <AdminGuard>
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Weekly Marketing Plans</h1>
            <p className="text-slate-500 text-xs">{filtered.length} plans</p>
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <select value={filterBiz} onChange={e => setFilterBiz(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="">All Businesses</option>
              {businesses.map(b => <option key={b.id} value={b.id}>{b.business_name}</option>)}
            </select>
            {filterBiz && (
              <button onClick={() => handleGenerate(filterBiz)} disabled={generating === filterBiz}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${generating === filterBiz ? 'animate-spin' : ''}`} />
                {generating === filterBiz ? 'Generating...' : 'New Plan'}
              </button>
            )}
          </div>
        </div>

        {loading ? <div className="text-slate-500 text-sm py-20 text-center">Loading...</div> : (
          <div className="space-y-4">
            {filtered.map(plan => (
              <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Calendar className="w-4 h-4 text-violet-400" />
                        <span className="text-white font-bold text-sm">{plan.week_start_date} – {plan.week_end_date}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${plan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>{plan.status}</span>
                        <span className="text-slate-500 text-xs">{getBizName(plan.business_profile_id)}</span>
                        <span className="text-slate-500 text-xs">Conf: {plan.confidence_score}/100</span>
                      </div>
                      <p className="text-white font-semibold text-sm mb-0.5">Theme: {plan.primary_theme}</p>
                      <p className="text-slate-400 text-xs">Offer: {plan.primary_offer}</p>
                    </div>
                    {expanded === plan.id ? <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />}
                  </div>
                </div>
                {expanded === plan.id && (
                  <div className="border-t border-slate-800 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <TaskSection label="Content Tasks" tasks={plan.content_tasks} color="text-violet-400" />
                      <TaskSection label="Video Tasks" tasks={plan.video_tasks} color="text-pink-400" />
                      <TaskSection label="Social Tasks" tasks={plan.social_tasks} color="text-sky-400" />
                      <TaskSection label="Campaign Tasks" tasks={plan.campaign_tasks} color="text-amber-400" />
                      <TaskSection label="SEO Tasks" tasks={plan.seo_tasks} color="text-green-400" />
                      <TaskSection label="Email Tasks" tasks={plan.email_tasks} color="text-cyan-400" />
                    </div>
                    {plan.quick_win_tasks?.length > 0 && (
                      <div className="mt-4 bg-violet-900/20 border border-violet-800/30 rounded-xl p-4">
                        <TaskSection label="⚡ Quick Wins" tasks={plan.quick_win_tasks} color="text-violet-400" />
                      </div>
                    )}
                    {plan.why_this_plan && (
                      <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-500 text-xs font-semibold uppercase mb-2">Why This Plan</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{plan.why_this_plan}</p>
                      </div>
                    )}
                    {plan.source_mix_summary && (
                      <p className="text-slate-600 text-xs mt-3">{plan.source_mix_summary}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="text-slate-500 text-sm py-10 text-center">No plans found. Select a business and click "New Plan" to generate one.</div>}
          </div>
        )}
      </div>
    </div>
    </AdminGuard>
  );
}