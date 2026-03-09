import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Calendar, DollarSign, Zap, Plus } from 'lucide-react';

const STAGES = [
  { key: 'new_lead', label: 'New Lead' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'demo_scheduled', label: 'Demo Scheduled' },
  { key: 'proposal_sent', label: 'Proposal Sent' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'closed_won', label: 'Closed Won' },
  { key: 'closed_lost', label: 'Closed Lost' }
];

export default function DealModal({ deal, open, onClose }) {
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState('');
  const [activityType, setActivityType] = useState('note');
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const { data: activities = [] } = useQuery({
    queryKey: ['activities', deal?.id],
    queryFn: () => base44.asServiceRole.entities.SalesActivities.filter({ deal_id: deal.id }),
    enabled: !!deal?.id
  });

  const updateDeal = useMutation({
    mutationFn: ({ id, data }) => base44.asServiceRole.entities.SalesDeals.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_deals'] });
      queryClient.invalidateQueries({ queryKey: ['activities', deal?.id] });
    }
  });

  const addActivity = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.SalesActivities.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', deal?.id] });
      setNoteText('');
    }
  });

  const handleStageChange = (stage) => {
    updateDeal.mutate({ id: deal.id, data: { stage } });
    addActivity.mutate({
      deal_id: deal.id,
      activity_type: 'stage_change',
      notes: `Stage changed to: ${STAGES.find(s => s.key === stage)?.label}`,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleLogActivity = () => {
    if (!noteText.trim()) return;
    addActivity.mutate({
      deal_id: deal.id,
      activity_type: activityType,
      notes: noteText,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleConvertToClient = async () => {
    setConverting(true);
    try {
      const company = await base44.asServiceRole.entities.Companies.create({
        company_name: deal.company_name,
        industry: deal.plan || '',
        status: 'active'
      });

      await base44.asServiceRole.entities.SalesDeals.update(deal.id, {
        stage: 'closed_won',
        converted_company_id: company.id
      });

      await base44.asServiceRole.entities.SalesActivities.create({
        deal_id: deal.id,
        activity_type: 'conversion',
        notes: `Converted to client. Company ID: ${company.id}`,
        date: new Date().toISOString().split('T')[0]
      });

      queryClient.invalidateQueries({ queryKey: ['sales_deals'] });
      setConverted(true);
    } catch (e) {
      console.error('Conversion failed:', e);
    }
    setConverting(false);
  };

  if (!deal) return null;

  const isClosedWon = deal.stage === 'closed_won';
  const isActive = !['closed_won', 'closed_lost'].includes(deal.stage);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{deal.company_name}</span>
            <Badge className="bg-blue-100 text-blue-800 font-normal">
              ${(deal.deal_value || 0).toLocaleString()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deal Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl text-sm">
            <div><p className="text-xs text-slate-500">Contact</p><p className="font-semibold">{deal.contact_name || '—'}</p></div>
            <div><p className="text-xs text-slate-500">Plan</p><p className="font-semibold">{deal.plan || '—'}</p></div>
            <div><p className="text-xs text-slate-500">Closing Date</p><p className="font-semibold">{deal.closing_date || '—'}</p></div>
            <div><p className="text-xs text-slate-500">Assigned To</p><p className="font-semibold">{deal.assigned_to || '—'}</p></div>
          </div>

          {/* Stage Selector */}
          {isActive && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Move Stage</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => handleStageChange(s.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      deal.stage === s.key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Convert to Client */}
          {isClosedWon && !deal.converted_company_id && !converted && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="font-semibold text-green-900 mb-1">Ready to Convert</p>
              <p className="text-sm text-green-700 mb-3">This deal is marked Closed Won. Create a client account now.</p>
              <Button onClick={handleConvertToClient} disabled={converting} className="bg-green-700 hover:bg-green-800">
                <Zap className="w-4 h-4 mr-2" />
                {converting ? 'Converting...' : 'Convert to Client'}
              </Button>
            </div>
          )}

          {(deal.converted_company_id || converted) && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
              ✓ Converted to client account
            </div>
          )}

          {/* Log Activity */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Log Activity</p>
            <div className="flex gap-2 mb-2">
              {['note', 'call', 'email', 'meeting', 'follow_up'].map(t => (
                <button
                  key={t}
                  onClick={() => setActivityType(t)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${activityType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a note..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogActivity()}
              />
              <Button size="sm" onClick={handleLogActivity} disabled={addActivity.isPending}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Activity Feed */}
          {activities.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Activity History</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activities.sort((a, b) => new Date(b.date) - new Date(a.date)).map(act => (
                  <div key={act.id} className="flex gap-3 p-2 bg-slate-50 rounded-lg text-xs">
                    <Badge variant="outline" className="text-xs capitalize shrink-0">{act.activity_type.replace('_', ' ')}</Badge>
                    <div className="flex-1">
                      <p className="text-slate-700">{act.notes}</p>
                      <p className="text-slate-400 mt-0.5">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}