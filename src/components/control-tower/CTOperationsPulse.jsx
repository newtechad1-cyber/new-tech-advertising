import React from 'react';

const StatusBar = ({ label, count, color, urgency }) => (
  <div className="flex-1">
    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-600 mb-2">{label}</p>
    <div className={`${color} rounded-2xl p-3 text-center border ${urgency ? 'border-current/50' : 'border-current/20'}`}>
      <p className="text-xl font-black text-white">{count}</p>
    </div>
  </div>
);

export default function CTOperationsPulse({ data }) {
  const overdue = data.overdue > 3; // Highlight if significant backlog
  
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-3xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-200">Operations Fulfillment Pulse</h2>
        {overdue && <span className="text-[10px] font-bold text-rose-400 uppercase">⚠ Overdue Alert</span>}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatusBar label="Queued" count={data.queued} color="bg-slate-700/40 text-slate-400" />
        <StatusBar label="In Progress" count={data.inProgress} color="bg-blue-900/40 text-blue-400" />
        <StatusBar label="Review" count={data.review} color="bg-amber-900/40 text-amber-400" />
        <StatusBar label="Overdue" count={data.overdue} color="bg-rose-900/40 text-rose-400" urgency={overdue} />
      </div>
    </div>
  );
}