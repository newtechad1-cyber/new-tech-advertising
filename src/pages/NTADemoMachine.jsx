import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Loader2, ChevronDown, Cpu } from 'lucide-react';
import DemoHeader from '@/components/demo-machine/DemoHeader';
import DemoFlowNavigator from '@/components/demo-machine/DemoFlowNavigator';
import DemoCanvas from '@/components/demo-machine/DemoCanvas';
import EngagementPanel from '@/components/demo-machine/EngagementPanel';
import DemoOutcomeModal from '@/components/demo-machine/DemoOutcomeModal';

export default function NTADemoMachine() {
  const urlParams = new URLSearchParams(window.location.search);
  const oppId = urlParams.get('id');

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(oppId || null);
  const [loading, setLoading] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [activeStep, setActiveStep] = useState('pain_discovery');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeModule, setActiveModule] = useState('visibility');
  const [signals, setSignals] = useState([]);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    base44.entities.SalesOpportunity.filter({ stage: 'demo_scheduled' }, '-updated_date', 50)
      .then(data => {
        setOpportunities(data);
        if (!selectedOppId && data.length > 0) setSelectedOppId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const opportunity = opportunities.find(o => o.id === selectedOppId) || null;

  const engagementScore = (() => {
    const SIGNALS_MAP = {
      asked_pricing: 15, viewed_case_studies: 10, asked_roi: 15, took_notes: 10,
      positive_body_language: 8, asked_timeline: 20, asked_competition: 5, mentioned_budget: 12, asked_next_steps: 25,
    };
    const total = Object.values(SIGNALS_MAP).reduce((a, b) => a + b, 0);
    const scored = signals.reduce((s, k) => s + (SIGNALS_MAP[k] || 0), 0);
    return Math.round((scored / total) * 100);
  })();

  const handleStepComplete = (stepId) => {
    setCompletedSteps(prev => prev.includes(stepId) ? prev.filter(s => s !== stepId) : [...prev, stepId]);
  };

  const handleAction = (action) => {
    if (action === 'log_outcome') { setShowOutcomeModal(true); return; }
    if (action === 'deal_room' && opportunity) {
      window.open(`/deal-room/${encodeURIComponent(opportunity.company_name?.toLowerCase().replace(/\s+/g, '-'))}`, '_blank');
      return;
    }
    if (action === 'schedule_followup') { setShowOutcomeModal(true); return; }
    if (action === 'generate_proposal') { setShowOutcomeModal(true); return; }
  };

  const handleOutcomeConfirm = async (action, data) => {
    if (!opportunity) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const updates = { last_activity_date: today };

    if (action === 'move_stage') updates.stage = data.targetStage || 'demo_completed';
    if (action === 'send_proposal') { updates.stage = 'proposal_sent'; updates.proposal_sent_date = today; }
    if (action === 'mark_no_fit') updates.stage = 'closed_lost';
    if (data.notes) updates.notes = (opportunity.notes ? opportunity.notes + '\n' : '') + `[Demo ${today}]: ${data.notes}`;

    try {
      await base44.entities.SalesOpportunity.update(opportunity.id, updates);
      setOpportunities(prev => prev.map(o => o.id === opportunity.id ? { ...o, ...updates } : o));
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading demo machine...</p>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">No Demos Scheduled</h2>
          <p className="text-slate-400 text-sm mb-4">Schedule a demo from the Sales Pipeline to use the Demo Machine.</p>
          <a href="/admin/sales-pipeline" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors">
            Go to Sales Pipeline
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Opportunity picker */}
      <div className="bg-slate-950 border-b border-slate-800/60 px-6 py-2 flex items-center gap-3">
        <span className="text-slate-500 text-xs font-medium">Demo for:</span>
        <div className="relative">
          <button
            onClick={() => setShowPicker(s => !s)}
            className="flex items-center gap-2 text-white text-sm font-semibold bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 hover:bg-slate-700 transition-colors"
          >
            {opportunity?.company_name || 'Select company'}
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {showPicker && (
            <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 min-w-64 overflow-hidden">
              {opportunities.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setSelectedOppId(o.id); setShowPicker(false); setCompletedSteps([]); setSignals([]); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-700 transition-colors ${o.id === selectedOppId ? 'bg-blue-600/15' : ''}`}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{o.company_name}</p>
                    <p className="text-slate-500 text-xs">{o.city} · ${o.deal_value}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {demoActive && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> DEMO LIVE
          </span>
        )}
        <span className="ml-auto text-slate-600 text-xs">{completedSteps.length}/9 steps · Engagement: <span className="text-blue-400 font-semibold">{engagementScore}%</span></span>
      </div>

      {/* Main header */}
      <DemoHeader
        opportunity={opportunity}
        onAction={handleAction}
        demoActive={demoActive}
        setDemoActive={setDemoActive}
      />

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Left: Demo Flow Navigator */}
        <div className="w-64 flex-shrink-0 overflow-hidden">
          <DemoFlowNavigator
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            completedSteps={completedSteps}
            onComplete={handleStepComplete}
          />
        </div>

        {/* Center: Demo Canvas */}
        <div className="flex-1 overflow-hidden border-x border-slate-800 bg-slate-950">
          <DemoCanvas
            opportunity={opportunity}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
          />
        </div>

        {/* Right: Engagement Panel */}
        <div className="w-72 flex-shrink-0 overflow-hidden">
          <EngagementPanel signals={signals} setSignals={setSignals} />
        </div>
      </div>

      {/* Outcome modal */}
      {showOutcomeModal && (
        <DemoOutcomeModal
          onClose={() => setShowOutcomeModal(false)}
          onConfirm={handleOutcomeConfirm}
          opportunity={opportunity}
          engagementScore={engagementScore}
        />
      )}
    </div>
  );
}