import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Loader2, Shield, Users, ChevronDown } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import OBHeader from '@/components/onboarding-cmd/OBHeader';
import OBProgressTracker from '@/components/onboarding-cmd/OBProgressTracker';
import OBClientChecklist from '@/components/onboarding-cmd/OBClientChecklist';
import OBChannelHub from '@/components/onboarding-cmd/OBChannelHub';
import OBFulfillmentQueue from '@/components/onboarding-cmd/OBFulfillmentQueue';
import OBContentPlan from '@/components/onboarding-cmd/OBContentPlan';
import OBCommunicationTimeline from '@/components/onboarding-cmd/OBCommunicationTimeline';
import OBEducationPanel from '@/components/onboarding-cmd/OBEducationPanel';

const CHECKLIST_POINTS = {
  brand_assets: 10, website_structure: 15, social_platforms: 20, google_business: 15,
  service_areas: 10, content_plan: 20, intake_form: 10,
};

function computeReadiness(completedTasks, connectedChannels, taskStatuses) {
  const totalChecklistPts = Object.values(CHECKLIST_POINTS).reduce((a, b) => a + b, 0);
  const earnedChecklistPts = completedTasks.reduce((s, id) => s + (CHECKLIST_POINTS[id] || 0), 0);
  const checklistPct = (earnedChecklistPts / totalChecklistPts) * 40; // 40% weight
  const channelPct = (connectedChannels.length / 5) * 25; // 25% weight
  const fulfillmentDone = Object.values(taskStatuses).filter(s => s === 'completed').length;
  const fulfillmentPct = (fulfillmentDone / 8) * 35; // 35% weight
  return Math.min(100, Math.round(checklistPct + channelPct + fulfillmentPct));
}

export default function NTAOnboardingCenter() {
  const urlParams = new URLSearchParams(window.location.search);
  const obId = urlParams.get('id');
  const isAdmin = urlParams.get('view') !== 'client';

  const [onboardings, setOnboardings] = useState([]);
  const [selectedId, setSelectedId] = useState(obId || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Local interactive state
  const [completedTasks, setCompletedTasks] = useState([]);
  const [connectedChannels, setConnectedChannels] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState({});

  useEffect(() => {
    base44.entities.ClientOnboarding.list('-created_date', 50)
      .then(data => {
        setOnboardings(data);
        if (!selectedId && data.length > 0) setSelectedId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const onboarding = onboardings.find(o => o.id === selectedId) || null;

  // Compute live readiness
  const readiness = computeReadiness(completedTasks, connectedChannels, taskStatuses);

  // Persist readiness changes
  useEffect(() => {
    if (!onboarding) return;
    const timer = setTimeout(() => {
      base44.entities.ClientOnboarding.update(onboarding.id, {
        readiness_score: readiness,
        channels_connected: connectedChannels.length >= 3,
        content_plan_approved: completedTasks.includes('content_plan'),
        intake_completed: completedTasks.includes('intake_form'),
      }).catch(console.error);
    }, 1500);
    return () => clearTimeout(timer);
  }, [readiness, completedTasks, connectedChannels]);

  const handleTaskToggle = (taskId) => {
    setCompletedTasks(prev => prev.includes(taskId) ? prev.filter(x => x !== taskId) : [...prev, taskId]);
  };

  const handleChannelConnect = (channelId, connect) => {
    setConnectedChannels(prev => connect ? [...prev, channelId] : prev.filter(x => x !== channelId));
  };

  const handleTaskStatusChange = (taskId, status) => {
    setTaskStatuses(prev => ({ ...prev, [taskId]: status }));
  };

  const handleCreateOnboarding = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newOb = await base44.entities.ClientOnboarding.create({
      company_name: 'New Client',
      package_tier: 'authority',
      stage: 'intake',
      readiness_score: 0,
      kickoff_date: today,
      status: 'active',
    });
    setOnboardings(prev => [newOb, ...prev]);
    setSelectedId(newOb.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <NTACommandNav />
      {/* Top admin bar */}
      {isAdmin && (
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center gap-4">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-xs font-bold">Operator View</span>

          <div className="relative ml-2">
            <button onClick={() => setShowPicker(s => !s)}
              className="flex items-center gap-2 text-white text-sm font-semibold bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 hover:bg-slate-700">
              <span className="max-w-[200px] truncate">{onboarding?.company_name || 'Select client'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showPicker && (
              <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-20 min-w-72 max-h-80 overflow-y-auto">
                {onboardings.map(o => (
                  <button key={o.id} onClick={() => { setSelectedId(o.id); setShowPicker(false); setCompletedTasks([]); setConnectedChannels([]); setTaskStatuses({}); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${o.id === selectedId ? 'bg-blue-600/15' : ''}`}>
                    <div>
                      <p className="text-white text-sm font-medium">{o.company_name}</p>
                      <p className="text-slate-500 text-xs capitalize">{o.package_tier} · {o.stage?.replace('_', ' ')} · {o.readiness_score || 0}% ready</p>
                    </div>
                  </button>
                ))}
                <button onClick={handleCreateOnboarding} className="w-full px-4 py-3 text-blue-400 text-sm font-semibold hover:bg-slate-700 border-t border-slate-700 text-left">
                  + New Onboarding Record
                </button>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a href={`/nta/onboarding?id=${selectedId}&view=client`} target="_blank"
              className="flex items-center gap-2 text-xs px-3 py-1.5 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <Users className="w-3 h-3" /> Preview Client View
            </a>
          </div>
        </div>
      )}

      {onboarding ? (
        <>
          {/* Header */}
          <OBHeader onboarding={{ ...onboarding, readiness_score: readiness }} isAdmin={isAdmin} />

          {/* Main layout */}
          <div className="grid grid-cols-12 gap-0">
            {/* Left sidebar: Progress + Checklist */}
            <div className="col-span-3 border-r border-slate-800 p-5 space-y-5 min-h-screen">
              <OBProgressTracker onboarding={onboarding} />
              <OBClientChecklist completed={completedTasks} onToggle={handleTaskToggle} />
            </div>

            {/* Main content */}
            <div className="col-span-6 border-r border-slate-800 p-5 space-y-6">
              <OBContentPlan industry={onboarding.industry} />
              <OBCommunicationTimeline />
              <OBEducationPanel />
              {isAdmin && (
                <OBFulfillmentQueue taskStatuses={taskStatuses} onStatusChange={handleTaskStatusChange} />
              )}
            </div>

            {/* Right sidebar: Channels + summary */}
            <div className="col-span-3 p-5 space-y-5">
              <OBChannelHub connected={connectedChannels} onConnect={handleChannelConnect} />

              {/* Readiness breakdown */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-white font-bold text-sm mb-3">Launch Readiness Breakdown</h3>
                {[
                  { label: 'Client Setup', pct: Math.round((completedTasks.length / 7) * 100), color: '#3b82f6' },
                  { label: 'Channel Connections', pct: Math.round((connectedChannels.length / 5) * 100), color: '#8b5cf6' },
                  { label: 'Fulfillment Progress', pct: Math.round((Object.values(taskStatuses).filter(s => s === 'completed').length / 8) * 100), color: '#10b981' },
                ].map((item, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                  <p className="text-slate-400 text-xs mb-1">Overall Readiness</p>
                  <p className="text-3xl font-black" style={{ color: readiness >= 80 ? '#10b981' : readiness >= 50 ? '#f59e0b' : '#3b82f6' }}>
                    {readiness}%
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    {readiness >= 90 ? '🚀 Ready to launch!' : readiness >= 60 ? '🔄 Almost there' : '⚙️ Setup in progress'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-white text-2xl font-black mb-3">No Onboarding Records</h2>
            <p className="text-slate-400 text-sm mb-5">Create a new onboarding record to get started.</p>
            <button onClick={handleCreateOnboarding} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors">
              + Create Onboarding Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}