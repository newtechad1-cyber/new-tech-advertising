import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Loader2, Kanban } from 'lucide-react';
import ForecastWidget from '@/components/sales/pipeline/ForecastWidget';
import BoardControls from '@/components/sales/pipeline/BoardControls';
import PipelineColumn from '@/components/sales/pipeline/PipelineColumn';
import AddOpportunityModal from '@/components/sales/pipeline/AddOpportunityModal';
import QuickActionModal from '@/components/sales/pipeline/QuickActionModal';

const STAGES = [
  'new_lead', 'contacted', 'discovery', 'demo_scheduled',
  'demo_completed', 'proposal_sent', 'verbal_yes', 'closed_won', 'closed_lost'
];

export default function NTASalesPipeline() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', owner: 'all', industry: 'all', source: 'all' });
  const [valueView, setValueView] = useState('value');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // { action, opportunity }

  const load = useCallback(async () => {
    try {
      const data = await base44.entities.SalesOpportunity.list('-updated_date', 200);
      setOpportunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = opportunities.filter(o => {
    if (filters.search && !o.company_name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.owner !== 'all' && o.assigned_owner !== filters.owner) return false;
    if (filters.industry !== 'all' && o.industry !== filters.industry) return false;
    if (filters.source !== 'all' && o.source !== filters.source) return false;
    return true;
  });

  const byStage = STAGES.reduce((acc, stage) => {
    acc[stage] = filtered.filter(o => o.stage === stage);
    return acc;
  }, {});

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const newStage = destination.droppableId;
    const opp = opportunities.find(o => o.id === draggableId);
    if (!opp || opp.stage === newStage) return;

    // Optimistic update
    setOpportunities(prev => prev.map(o => o.id === draggableId ? { ...o, stage: newStage } : o));

    try {
      const updates = {
        stage: newStage,
        last_activity_date: format(new Date(), 'yyyy-MM-dd'),
      };
      if (newStage === 'closed_won') updates.closed_date = format(new Date(), 'yyyy-MM-dd');
      if (newStage === 'proposal_sent') updates.proposal_sent_date = format(new Date(), 'yyyy-MM-dd');
      if (newStage === 'demo_scheduled') updates.demo_date = format(new Date(), 'yyyy-MM-dd');

      await base44.entities.SalesOpportunity.update(draggableId, updates);

      // Automation triggers
      await runAutomation(newStage, opp);
    } catch (e) {
      console.error(e);
      setOpportunities(prev => prev.map(o => o.id === draggableId ? { ...o, stage: opp.stage } : o));
    }
  };

  const runAutomation = async (newStage, opp) => {
    if (newStage === 'closed_won') {
      // Trigger onboarding
      console.log(`[Automation] Closed Won → Trigger onboarding for ${opp.company_name}`);
    }
    if (newStage === 'verbal_yes') {
      console.log(`[Automation] Verbal Yes → Send onboarding prep reminder for ${opp.company_name}`);
    }
  };

  const handleAction = (action, opportunity) => {
    setActiveAction({ action, opportunity });
  };

  const handleActionConfirm = async (action, opp, data) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let updates = { last_activity_date: today };

    if (action === 'log_call') {
      updates.last_activity_date = data.date || today;
      if (data.notes) updates.notes = (opp.notes ? opp.notes + '\n' : '') + `[Call ${data.date || today}]: ${data.notes}`;
    }
    if (action === 'schedule_demo') {
      updates.demo_date = data.date ? data.date.split('T')[0] : today;
      updates.stage = 'demo_scheduled';
      updates.next_step_description = 'Demo confirmed';
    }
    if (action === 'create_proposal') {
      updates.stage = 'proposal_sent';
      updates.proposal_sent_date = today;
      updates.proposal_value = parseFloat(data.proposal_value) || opp.deal_value;
    }
    if (action === 'mark_won') {
      updates.stage = 'closed_won';
      updates.closed_date = today;
    }
    if (action === 'mark_lost') {
      updates.stage = 'closed_lost';
      updates.closed_date = today;
      updates.lost_reason = data.lost_reason;
    }
    if (action === 'move_stage' && data.targetStage) {
      updates.stage = data.targetStage;
    }
    if (action === 'send_email') {
      updates.last_activity_date = today;
      if (data.notes) updates.notes = (opp.notes ? opp.notes + '\n' : '') + `[Email ${today}]: ${data.notes}`;
    }

    try {
      await base44.entities.SalesOpportunity.update(opp.id, updates);
      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, ...updates } : o));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const created = await base44.entities.SalesOpportunity.create({
        ...formData,
        stage: 'new_lead',
        last_activity_date: format(new Date(), 'yyyy-MM-dd'),
      });
      setOpportunities(prev => [created, ...prev]);
      setShowAddModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl">
              <Kanban className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">NTA Sales Pipeline</h1>
              <p className="text-slate-500 text-sm">Drag deals through stages · {filtered.length} active opportunities</p>
            </div>
          </div>
        </div>
        {/* Forecast widget */}
        <ForecastWidget opportunities={filtered} />
      </div>

      {/* Board Controls */}
      <BoardControls
        filters={filters}
        setFilters={setFilters}
        valueView={valueView}
        setValueView={setValueView}
        onNewLead={() => setShowAddModal(true)}
        opportunities={opportunities}
      />

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-3 p-4 overflow-x-auto h-full" style={{ height: 'calc(100vh - 280px)' }}>
            {STAGES.map((stage) => (
              <PipelineColumn
                key={stage}
                stageId={stage}
                opportunities={byStage[stage]}
                onAction={handleAction}
                valueView={valueView}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddOpportunityModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Quick Action Modal */}
      {activeAction && (
        <QuickActionModal
          action={activeAction.action}
          opportunity={activeAction.opportunity}
          onClose={() => setActiveAction(null)}
          onConfirm={handleActionConfirm}
        />
      )}
    </div>
  );
}