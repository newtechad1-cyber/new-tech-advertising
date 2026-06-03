import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Mail, Phone, Building, User, Target, Plus, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const STAGES = [
  { id: 'new', title: 'New Leads', color: 'border-slate-200' },
  { id: 'contacted', title: 'Contacted', color: 'border-blue-200' },
  { id: 'interested', title: 'Interested', color: 'border-purple-200' },
  { id: 'proposal_sent', title: 'Proposal Sent', color: 'border-amber-200' },
  { id: 'closed_won', title: 'Closed Won', color: 'border-green-200' },
  { id: 'closed_lost', title: 'Closed Lost', color: 'border-red-200' }
];

export default function NTASalesPipeline() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-sales-leads'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getClientLeads', {});
      return res.data.leads || [];
    }
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      await base44.entities.SalesLead.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-sales-leads']);
    }
  });

  const saveLeadMutation = useMutation({
    mutationFn: async (leadData) => {
      if (leadData.id) {
        return await base44.entities.SalesLead.update(leadData.id, leadData);
      } else {
        return await base44.entities.SalesLead.create(leadData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-sales-leads']);
      toast({ title: 'Lead saved successfully' });
      setIsModalOpen(false);
    }
  });

  const [columns, setColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState({});

  useEffect(() => {
    if (leads.length > 0) {
      const newCols = {};
      STAGES.forEach(stage => {
        newCols[stage.id] = leads.filter(l => (l.status || 'new') === stage.id);
      });
      setColumns(newCols);
    } else {
      const newCols = {};
      STAGES.forEach(stage => { newCols[stage.id] = []; });
      setColumns(newCols);
    }
  }, [leads]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);
    
    movedItem.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    });

    // Background update
    updateLeadStatus.mutate({ id: draggableId, status: destination.droppableId });
    toast({ title: 'Lead status updated' });
  };

  const handleOpenModal = (lead = null) => {
    setSelectedLead(lead || { business_name: '', contact_name: '', email: '', estimated_value: '', status: 'new' });
    setIsModalOpen(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    saveLeadMutation.mutate(selectedLead);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading pipeline...</div>;

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col bg-slate-50/30">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Manage lead progression through drag-and-drop stages.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Lead
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 flex-1 items-start">
          {STAGES.map(stage => (
            <div key={stage.id} className="min-w-[320px] w-[320px] flex flex-col bg-slate-100 rounded-xl p-3 border border-slate-200 shadow-inner max-h-full">
              <div className="flex justify-between items-center mb-3 px-2 pt-1">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  {stage.title}
                </h3>
                <Badge variant="secondary" className="bg-white text-slate-600 shadow-sm">{columns[stage.id]?.length || 0}</Badge>
              </div>
              
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 min-h-[150px] overflow-y-auto pr-1 ${snapshot.isDraggingOver ? 'bg-slate-200/50 rounded-lg' : ''}`}
                  >
                    {columns[stage.id]?.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleOpenModal(lead)}
                            className={`shadow-sm border-l-4 ${stage.color} cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20 rotate-1' : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="font-semibold text-[15px] mb-1.5 flex justify-between items-start">
                                <span className="line-clamp-1">{lead.business_name || 'Unnamed Business'}</span>
                                {lead.estimated_value && (
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    ${lead.estimated_value}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 mt-3">
                                {(lead.contact_name || lead.first_name) && (
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <User className="w-3.5 h-3.5 text-slate-400" /> {lead.contact_name || `${lead.first_name} ${lead.last_name}`}
                                  </div>
                                )}
                                {lead.email && (
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {lead.email}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                <Badge variant="outline" className="text-[10px] uppercase bg-slate-50 text-slate-500 border-slate-200">
                                  {lead.lead_source || 'Manual'}
                                </Badge>
                                {lead.priority === 'high' && <Target className="w-4 h-4 text-red-500" />}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLead.id ? 'Edit Lead' : 'New Lead'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveLead} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name *</Label>
                <Input required value={selectedLead.business_name || ''} onChange={e => setSelectedLead({...selectedLead, business_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input value={selectedLead.contact_name || ''} onChange={e => setSelectedLead({...selectedLead, contact_name: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={selectedLead.email || ''} onChange={e => setSelectedLead({...selectedLead, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Estimated Value ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input type="number" className="pl-9" value={selectedLead.estimated_value || ''} onChange={e => setSelectedLead({...selectedLead, estimated_value: parseFloat(e.target.value)})} />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveLeadMutation.isPending}>
                {saveLeadMutation.isPending ? 'Saving...' : 'Save Lead'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}