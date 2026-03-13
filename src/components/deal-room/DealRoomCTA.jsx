import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DealRoomCTA({ opportunity, onSelectPlan }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 border border-blue-500">
      <h2 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Marketing?</h2>
      <p className="text-blue-100 mb-8">
        Schedule a 15-minute strategy call to explore the best plan for {opportunity.company_name}.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => onSelectPlan('schedule_call')}
          className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Strategy Call
        </Button>
        <Button
          onClick={() => onSelectPlan('accept')}
          className="flex-1 border-2 border-white text-white hover:bg-white/10 font-semibold"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Accept Proposal
        </Button>
      </div>
    </div>
  );
}