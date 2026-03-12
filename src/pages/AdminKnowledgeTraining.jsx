import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, ComposedChart, Area, AreaChart } from 'recharts';

const ROLE_CONFIG = {
  sales: { label: 'Sales', emoji: '🎯', color: '#3b82f6' },
  client_success: { label: 'Client Success', emoji: '👥', color: '#10b981' },
  operations: { label: 'Operations', emoji: '⚙️', color: '#8b5cf6' },
  marketing: { label: 'Marketing', emoji: '📢', color: '#f59e0b' },
  leadership: { label: 'Leadership', emoji: '👔', color: '#ec4899' },
  partner: { label: 'Partner', emoji: '🤝', color: '#06b6d4' },
};

const CERTIFICATION_CONFIG = {
  trainee: { label: 'Trainee', badge: 'bg-red-100 text-red-700', color: '#ef4444' },
  certified: { label: 'Certified', badge: 'bg-yellow-100 text-yellow-700', color: '#f59e0b' },
  advanced: { label: 'Advanced', badge: 'bg-blue-100 text-blue-700', color: '#3b82f6' },
  expert: { label: 'Expert', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
};

export default function AdminKnowledgeTraining() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterCertification, setFilterCertification] = useState('all');

  useEffect(() => {
    base44.entities.TrainingProgressProfile.list('-training_completion_percent', 100)
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading training progress…</div>
      </div>
    );
  }

  // Filter profiles
  const filtered = profiles.filter(p => {
    if (filterRole !== 'all' && p.role_category !== filterRole) return false;
    if (filterCertification !== 'all' && p.certification_level !== filterCertification) return false;
    return true;
  });

  // KPIs
  const trainingCount = profiles.filter(p => p.certification_level === 'trainee').length;
  const certifiedCount = profiles.filter(p => p.certification_level !== 'trainee').length;
  const avgCompletion = profiles.length > 0
    ? Math.round(profiles.reduce((sum, p) => sum + (p.training_completion_percent || 0), 0) / profiles.length)
    : 0;
  const advancedAndExpertCount = profiles.filter(p => p.certification_level === 'advanced' || p.certification_level === 'expert').length;
  const readinessIndex = profiles.length > 0
    ? Math.round(profiles.reduce((sum, p) => sum + (p.competency_score || 0), 0) / profiles.length)
    : 0;

  // Certification distribution
  const certDistribution = Object.keys(CERTIFICATION_CONFIG).map(cert => ({
    name: CERTIFICATION_CONFIG[cert].label,
    count: profiles.filter(p => p.certification_level === cert).length,
    color: CERTIFICATION_CONFIG[cert].color,
  })).filter(item => item.count > 0);

  // Role-based progress
  const roleProgress = Object.keys(ROLE_CONFIG).map(role => {
    const roleProfiles = profiles.filter(p => p.role_category === role);
    return {
      name: ROLE_CONFIG[role].label,
      avgCompletion: roleProfiles.length > 0
        ? Math.round(roleProfiles.reduce((sum, p) => sum + (p.training_completion_percent || 0), 0) / roleProfiles.length)
        : 0,
      memberCount: roleProfiles.length,
      color: ROLE_CONFIG[role].color,
    };
  }).filter(item => item.memberCount > 0);

  // Insights
  const insights = [];

  const salesProfiles = profiles.filter(p => p.role_category === 'sales');
  const certifiedSales = salesProfiles.filter(p => p.certification_level !== 'trainee');
  if (certifiedSales.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Sales Onboarding Training Improving Close Consistency',
      description: `${certifiedSales.length}/${salesProfiles.length} sales team members certified. Training improving deal closure predictability.`,
      action: '🎯 Continue monthly sales playbook updates; focus on advanced closing techniques',
    });
  }

  const opsProfiles = profiles.filter(p => p.role_category === 'operations');
  const lowOpsTraining = opsProfiles.filter(p => (p.training_completion_percent || 0) < 50);
  if (lowOpsTraining.length > 0 && opsProfiles.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Operations Training Lagging Behind Production Growth',
      description: `${lowOpsTraining.length} operations team members below 50% training completion. Ops capacity at risk.`,
      action: '⚠️ Prioritize operations SOP training; schedule intensive 2-week certification program',
    });
  }

  const partnerProfiles = profiles.filter(p => p.role_category === 'partner');
  const partnerCertified = partnerProfiles.filter(p => p.certification_level !== 'trainee');
  if (partnerCertified.length > 0 && partnerProfiles.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Partner Certification Readiness Increasing',
      description: `${partnerCertified.length}/${partnerProfiles.length} partner reps certified. Channel expansion capability growing.`,
      action: '🤝 Build partner expert tier; create white-label certification program',
    });
  }

  const traineeCt = profiles.filter(p => p.certification_level === 'trainee').length;
  if (traineeCt > 3) {
    insights.push({
      type: 'alert',
      title: `${traineeCt} Team Members Still in Trainee Status`,
      description: 'Significant portion of team not yet certified. Knowledge gaps may impact execution quality.',
      action: '📚 Establish clear trainee-to-certified progression timeline; assign mentors',
    });
  }

  const lowCompetency = profiles.filter(p => (p.competency_score || 0) < 60);
  if (lowCompetency.length > 2) {
    insights.push({
      type: 'alert',
      title: `${lowCompetency.length} Team Members Below Competency Threshold`,
      description: 'Low competency scores indicate knowledge gaps. Coaching and support needed.',
      action: '🎓 Schedule 1-on-1 coaching sessions; identify learning barriers',
    });
  }

  const expertCount = profiles.filter(p => p.certification_level === 'expert').length;
  if (expertCount > 0) {
    insights.push({
      type: 'positive',
      title: `${expertCount} Expert-Level Team Member(s) Building Organizational Knowledge`,
      description: 'Expert-certified staff available for mentoring and advanced responsibilities.',
      action: '⭐ Leverage experts as internal trainers; document their best practices',
    });
  }

  const handleCertificationUpdate = async (profileId, newLevel) => {
    await base44.entities.TrainingProgressProfile.update(profileId, { certification_level: newLevel });
    setProfiles(profiles.map(p => p.id === profileId ? { ...p, certification_level: newLevel } : p));
    setSelectedProfile(null);
  };

  const getCompletionColor = (completion) => {
    if (completion >= 80) return 'bg-emerald-500';
    if (completion >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionTextColor = (completion) => {
    if (completion >= 80) return 'text-emerald-600';
    if (completion >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🎓</div>
            <h1 className="text-3xl font-black text-slate-900">Training Progress Dashboard</h1>
          </div>
          <p className="text-slate-600 text-sm">Track team member training completion, certification, and knowledge competency</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">In Training</p>
            <p className="text-3xl font-black text-red-600">{trainingCount}</p>
            <p className="text-xs text-slate-600 mt-2">Trainee status</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Certified</p>
            <p className="text-3xl font-black text-emerald-600">{certifiedCount}</p>
            <p className="text-xs text-slate-600 mt-2">Beyond trainee</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Avg Completion</p>
            <p className="text-3xl font-black text-blue-600">{avgCompletion}%</p>
            <p className="text-xs text-slate-600 mt-2">All team members</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Advanced+Expert</p>
            <p className="text-3xl font-black text-purple-600">{advancedAndExpertCount}</p>
            <p className="text-xs text-slate-600 mt-2">Expert capacity</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Readiness Index</p>
            <p className="text-3xl font-black text-cyan-600">{readinessIndex}%</p>
            <p className="text-xs text-slate-600 mt-2">Knowledge readiness</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Roles</option>
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={filterCertification}
            onChange={(e) => setFilterCertification(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Levels</option>
            <option value="trainee">Trainee</option>
            <option value="certified">Certified</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* SECTION 2 — Team Training Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Team Training Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(profile => {
              const roleConfig = ROLE_CONFIG[profile.role_category];
              const certConfig = CERTIFICATION_CONFIG[profile.certification_level];
              const completionColor = getCompletionColor(profile.training_completion_percent || 0);
              return (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className="rounded-xl p-5 text-left transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{profile.team_member_name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{roleConfig.emoji} {roleConfig.label}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${certConfig.badge} capitalize flex-shrink-0`}>
                      {certConfig.label}
                    </span>
                  </div>

                  {/* Training completion bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Training</span>
                      <span className={`text-sm font-bold ${getCompletionTextColor(profile.training_completion_percent || 0)}`}>
                        {profile.training_completion_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${completionColor}`}
                        style={{ width: `${profile.training_completion_percent || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Competency meter */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Competency</span>
                      <span className="text-sm font-bold text-slate-700">{profile.competency_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${profile.competency_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Workflows */}
                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    {profile.completed_workflows_count || 0}/{profile.assigned_workflows_count || 0} workflows
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Certification Distribution */}
        {certDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Certification Level Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={certDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Members']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {certDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 6 — Role-Based Progress */}
        {roleProgress.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Training Progress by Role</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roleProgress} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [Math.round(val) + '%', 'Avg Completion']}
                />
                <Bar dataKey="avgCompletion" radius={[6, 6, 0, 0]}>
                  {roleProgress.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Training Intelligence & Recommendations</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '✓' : '⚠️'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-black ${insight.type === 'positive' ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm mt-1 ${insight.type === 'positive' ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {insight.description}
                      </p>
                      <div className={`mt-3 text-xs font-bold ${insight.type === 'positive' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {insight.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {ROLE_CONFIG[selectedProfile.role_category].emoji} {ROLE_CONFIG[selectedProfile.role_category].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${CERTIFICATION_CONFIG[selectedProfile.certification_level].badge} capitalize`}>
                    {CERTIFICATION_CONFIG[selectedProfile.certification_level].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedProfile.team_member_name}</h3>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Progress section */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Training Progress</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Completion</span>
                      <span className="text-lg font-black text-slate-900">{selectedProfile.training_completion_percent || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getCompletionColor(selectedProfile.training_completion_percent || 0)}`}
                        style={{ width: `${selectedProfile.training_completion_percent || 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Competency Score</span>
                      <span className="text-lg font-black text-slate-900">{selectedProfile.competency_score || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${selectedProfile.competency_score || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow tracking */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Assigned Workflows</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-slate-900">{selectedProfile.completed_workflows_count || 0}</p>
                    <p className="text-xs text-slate-600 mt-1">Completed</p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-slate-900">{(selectedProfile.assigned_workflows_count || 0) - (selectedProfile.completed_workflows_count || 0)}</p>
                    <p className="text-xs text-slate-600 mt-1">Remaining</p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-slate-900">{selectedProfile.assigned_workflows_count || 0}</p>
                    <p className="text-xs text-slate-600 mt-1">Total</p>
                  </div>
                </div>
              </div>

              {/* Last activity */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Last Training Activity</p>
                <p className="text-sm text-slate-700">{selectedProfile.last_training_activity_date || 'No activity recorded'}</p>
              </div>

              {/* Competency reasoning */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Competency Assessment</p>
                <p className="text-sm text-slate-700">
                  Current competency score of {selectedProfile.competency_score || 0}% reflects completion of {selectedProfile.completed_workflows_count || 0}/{selectedProfile.assigned_workflows_count || 0} assigned training workflows. Focus areas identified for continued development.
                </p>
              </div>
            </div>

            {/* Certification Actions */}
            <div className="space-y-2">
              {selectedProfile.certification_level === 'trainee' && (
                <>
                  <button
                    onClick={() => handleCertificationUpdate(selectedProfile.id, 'certified')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Promote to Certified
                  </button>
                  <button
                    onClick={() => handleCertificationUpdate(selectedProfile.id, 'certified')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🎓 Flag for Coaching
                  </button>
                </>
              )}
              {selectedProfile.certification_level === 'certified' && (
                <>
                  <button
                    onClick={() => handleCertificationUpdate(selectedProfile.id, 'advanced')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⬆️ Promote to Advanced
                  </button>
                  <button
                    onClick={() => handleCertificationUpdate(selectedProfile.id, 'trainee')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    📚 Additional Training Needed
                  </button>
                </>
              )}
              {selectedProfile.certification_level === 'advanced' && (
                <>
                  <button
                    onClick={() => handleCertificationUpdate(selectedProfile.id, 'expert')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⭐ Promote to Expert
                  </button>
                  <button
                    onClick={() => handleCertificationUpdate(selectedProfile.id, 'certified')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⬇️ Revert to Certified
                  </button>
                </>
              )}
              {selectedProfile.certification_level === 'expert' && (
                <button
                  onClick={() => handleCertificationUpdate(selectedProfile.id, 'advanced')}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⬇️ Revert to Advanced
                </button>
              )}
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                ➕ Assign Additional Training
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}