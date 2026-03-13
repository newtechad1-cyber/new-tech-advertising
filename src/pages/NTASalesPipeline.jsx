import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import AdminLayout from '@/components/admin/AdminLayout';
import PipelineStageColumn from '@/components/sales/pipeline/PipelineStageColumn';
import PipelineMetrics from '@/components/sales/pipeline/PipelineMetrics';
import NewOpportunityModal from '@/components/sales/pipeline/NewOpportunityModal';
import OpportunityDetailModal from '@/components/sales/pipeline/OpportunityDetailModal';

const stages = [
  'new_lead',
  'discovery',
  'demo',
  'proposal',
  'decision',
  'closed_won',
  'closed_lost',
];

export default function NTASalesPipeline() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authUser = await base44.auth.me();
        if (!authUser || authUser.role !== 'admin') {
          navigate('/');
          return;
        }
        setUser(authUser);

        // Load all opportunities
        const opps = await base44.entities.SalesOpportunity.list('-created_date', 500);
        setOpportunities(opps);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleCreateOpportunity = async (formData) => {
    try {
      const newOpp = await base44.entities.SalesOpportunity.create({
        ...formData,
        stage: 'new_lead',
        deal_room_slug: `${formData.company_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      });
      setOpportunities([newOpp, ...opportunities]);
      setShowNewModal(false);
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  const handleMoveStage = async (oppId, newStage) => {
    try {
      const opp = opportunities.find((o) => o.id === oppId);
      const updated = await base44.entities.SalesOpportunity.update(oppId, {
        stage: newStage,
        days_in_stage: 0,
      });

      setOpportunities(
        opportunities.map((o) => (o.id === oppId ? updated : o))
      );
      setSelectedOpp(null);
    } catch (error) {
      console.error('Error moving opportunity:', error);
    }
  };

  const handleUpdateOpp = async (oppId, data) => {
    try {
      const updated = await base44.entities.SalesOpportunity.update(oppId, data);
      setOpportunities(
        opportunities.map((o) => (o.id === oppId ? updated : o))
      );
      setSelectedOpp(null);
    } catch (error) {
      console.error('Error updating opportunity:', error);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Update stage
    await handleMoveStage(draggableId, destination.droppableId);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const opportunitiesByStage = {};
  stages.forEach((stage) => {
    opportunitiesByStage[stage] = opportunities.filter((opp) => opp.stage === stage);
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sales Pipeline</h1>
          <p className="text-slate-400">Manage prospects through each stage to close</p>
        </div>

        {/* Metrics */}
        <PipelineMetrics opportunities={opportunities} />

        {/* Pipeline Kanban */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {stages.map((stage) => (
                <PipelineStageColumn
                  key={stage}
                  stage={stage}
                  opportunities={opportunitiesByStage[stage]}
                  onCardClick={(opp) => setSelectedOpp(opp)}
                  onAddNew={() => setShowNewModal(true)}
                />
              ))}
            </div>
          </div>
        </DragDropContext>

        {/* Modals */}
        {showNewModal && (
          <NewOpportunityModal
            onClose={() => setShowNewModal(false)}
            onCreate={handleCreateOpportunity}
          />
        )}

        {selectedOpp && (
          <OpportunityDetailModal
            opportunity={selectedOpp}
            onClose={() => setSelectedOpp(null)}
            onUpdate={handleUpdateOpp}
            onMove={handleMoveStage}
          />
        )}
      </div>
    </AdminLayout>
  );
}