import React from 'react';

const PipelineStage = ({ label, count, value, color }) => (
  <div className="flex-1">
    <div className={`${color} rounded-2xl p-4 text-center`}>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-700 mb-1">{label}</p>
      <p className="text-2xl font-black text-white mb-2">{count}</p>
      <p className="text-[10px] font-bold text-slate-600">${value.toLocaleString()} value</p>
    </div>
  </div>
);

export default function CTPipelinePulse({ data }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-3xl p-6 mb-8">
      <h2 className="text-sm font-bold text-slate-200 mb-4">Sales Pipeline Pulse</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PipelineStage label="Leads" count={data.leads.count} value={data.leads.value} color="bg-slate-800/40" />
        <PipelineStage label="Demos" count={data.demos.count} value={data.demos.value} color="bg-blue-900/40" />
        <PipelineStage label="Deal Rooms" count={data.dealRooms.count} value={data.dealRooms.value} color="bg-purple-900/40" />
        <PipelineStage label="Closing" count={data.closing.count} value={data.closing.value} color="bg-emerald-900/40" />
      </div>
    </div>
  );
}