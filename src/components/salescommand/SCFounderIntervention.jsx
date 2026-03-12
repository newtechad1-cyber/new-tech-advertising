import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Flame, TrendingUp, Building2, Users2, X, Star, ChevronRight } from 'lucide-react';

const WorkspaceModal = ({ deals, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    <Card className="relative z-10 bg-slate-900 border-violet-700/50 w-full max-w-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
      <CardHeader className="border-b border-slate-800 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" /> Founder Assist Mode — Deal Review Workspace
          </CardTitle>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
        </div>
        <p className="text-xs text-slate-500 mt-1">Direct founder review of high-leverage deal opportunities</p>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {deals.map((deal, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-violet-700/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-sm font-bold text-white">
                  {deal.company_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{deal.company_name}</p>
                  <p className="text-xs text-slate-400">{deal.vertical} · {deal.assigned_rep}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-300">${((deal.deal_value || 0) / 1000).toFixed(0)}k</p>
                <Badge className={`text-[10px] ${deal.urgency === 'hot' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'}`}>
                  {deal.urgency}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-900 rounded-lg p-2 text-xs">
                <p className="text-slate-500 mb-1">Stage</p>
                <p className="text-white capitalize">{deal.stage?.replace(/_/g, ' ')}</p>
              </div>
              <div className="flex-1 bg-slate-900 rounded-lg p-2 text-xs">
                <p className="text-slate-500 mb-1">Win Prob.</p>
                <p className="text-emerald-300 font-bold">{deal.close_probability}%</p>
              </div>
              <div className="flex-1 bg-slate-900 rounded-lg p-2 text-xs">
                <p className="text-slate-500 mb-1">Close Date</p>
                <p className="text-white">{deal.expected_close_date || 'TBD'}</p>
              </div>
            </div>
            {deal.notes && <p className="text-xs text-slate-400 mt-3 p-2 bg-slate-900 rounded-lg">{deal.notes}</p>}
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 bg-violet-700 hover:bg-violet-600 text-xs h-7">
                <Star className="w-3 h-3 mr-1" /> Founder Assist
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                View Full Deal
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default function SCFounderIntervention({ deals = [] }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const topDeals = [...deals]
    .filter(d => d.deal_value >= 15000 && d.stage !== 'closed_lost')
    .sort((a, b) => (b.deal_value || 0) - (a.deal_value || 0))
    .slice(0, 4);

  const stalled = deals.filter(d => d.stage === 'negotiation' && d.urgency !== 'hot').slice(0, 3);
  const enterprise = deals.filter(d => d.deal_value >= 24000).slice(0, 3);
  const whiteLabelPartners = deals.filter(d => d.vertical === 'Agency' || d.deal_type === 'upsell').slice(0, 2);

  const sections = [
    { title: 'High-Value Deals', icon: Crown, color: 'text-amber-400', items: topDeals.length > 0 ? topDeals : [
      { company_name: 'Apex Law Partners', deal_value: 36000, stage: 'negotiation', close_probability: 82, urgency: 'hot', vertical: 'Legal', assigned_rep: 'Sarah L.', notes: 'Annual renewal + AI video upsell pending.' },
      { company_name: 'Metro HVAC Solutions', deal_value: 24000, stage: 'proposal_sent', close_probability: 62, urgency: 'hot', vertical: 'HVAC', assigned_rep: 'Sarah L.' },
    ]},
    { title: 'Stalled Negotiations', icon: Flame, color: 'text-orange-400', items: stalled.length > 0 ? stalled : [
      { company_name: 'Heritage Home Builders', deal_value: 21000, stage: 'negotiation', close_probability: 44, urgency: 'cold', vertical: 'Construction', assigned_rep: 'Jake M.', notes: 'No response in 12 days. Needs founder touch.' },
    ]},
    { title: 'Enterprise Prospects', icon: Building2, color: 'text-blue-400', items: enterprise.length > 0 ? enterprise : [
      { company_name: 'Pacific Coast Realty Group', deal_value: 48000, stage: 'demo_scheduled', close_probability: 38, urgency: 'warm', vertical: 'Real Estate', assigned_rep: 'Tom R.' },
    ]},
    { title: 'White-Label Partners', icon: Users2, color: 'text-violet-400', items: whiteLabelPartners.length > 0 ? whiteLabelPartners : [
      { company_name: 'Agency Collective', deal_value: 60000, stage: 'qualified', close_probability: 55, urgency: 'warm', vertical: 'Agency', assigned_rep: 'Jake M.' },
    ]},
  ];

  const allDeals = sections.flatMap(s => s.items);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Founder Revenue Intervention</h2>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white gap-1 text-xs"
          onClick={() => setWorkspaceOpen(true)}>
          <Crown className="w-3 h-3" /> Enter Founder Assist Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(section => (
          <Card key={section.title} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <section.icon className={`w-4 h-4 ${section.color}`} />{section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              {section.items.map((deal, i) => (
                <div key={i} className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-violet-200">{deal.company_name}</p>
                    <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{deal.vertical}</span>
                    <span className="text-xs font-bold text-emerald-300">${((deal.deal_value || 0) / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full mt-2">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full"
                      style={{ width: `${deal.close_probability || 0}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">{deal.close_probability}% win probability</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {workspaceOpen && <WorkspaceModal deals={allDeals} onClose={() => setWorkspaceOpen(false)} />}
    </div>
  );
}