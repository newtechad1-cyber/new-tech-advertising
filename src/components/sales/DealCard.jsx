import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User } from 'lucide-react';

const stageColors = {
  new_lead: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-700',
  demo_scheduled: 'bg-purple-100 text-purple-700',
  proposal_sent: 'bg-orange-100 text-orange-700',
  negotiation: 'bg-yellow-100 text-yellow-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800'
};

export default function DealCard({ deal, onClick, isDragging }) {
  const isClosingThisMonth = deal.closing_date && (() => {
    const d = new Date(deal.closing_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  })();

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all select-none ${isDragging ? 'shadow-xl rotate-1 opacity-90' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        <div>
          <p className="font-semibold text-slate-900 text-sm leading-tight">{deal.company_name}</p>
          {deal.contact_name && <p className="text-xs text-slate-500 mt-0.5">{deal.contact_name}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-green-700">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="font-bold text-sm">{(deal.deal_value || 0).toLocaleString()}</span>
          </div>
          {deal.plan && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">{deal.plan}</Badge>
          )}
        </div>

        {deal.closing_date && (
          <div className={`flex items-center gap-1 text-xs ${isClosingThisMonth ? 'text-orange-600 font-semibold' : 'text-slate-500'}`}>
            <Calendar className="w-3 h-3" />
            {deal.closing_date}
            {isClosingThisMonth && <span className="ml-1 text-orange-600">· This month</span>}
          </div>
        )}

        {deal.assigned_to && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <User className="w-3 h-3" />
            {deal.assigned_to}
          </div>
        )}
      </CardContent>
    </Card>
  );
}