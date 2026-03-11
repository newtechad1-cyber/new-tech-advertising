import React from 'react';
import { Clock, CheckCircle, TrendingUp, Zap } from 'lucide-react';

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-slate-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

export default function CalendarSummary({
  needsApproval = 0,
  scheduledThisWeek = 0,
  publishedThisMonth = 0,
  campaignsRunning = 0
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard 
        icon={Clock} 
        label="Needs Your Approval" 
        value={needsApproval} 
        color="bg-amber-500"
      />
      <SummaryCard 
        icon={CheckCircle} 
        label="Scheduled This Week" 
        value={scheduledThisWeek} 
        color="bg-blue-500"
      />
      <SummaryCard 
        icon={TrendingUp} 
        label="Published This Month" 
        value={publishedThisMonth} 
        color="bg-emerald-500"
      />
      <SummaryCard 
        icon={Zap} 
        label="Active Campaigns" 
        value={campaignsRunning} 
        color="bg-violet-500"
      />
    </div>
  );
}