import React from 'react';

export default function BOAppPreview() {
  return (
    <section className="px-6 pb-24 max-w-[1200px] mx-auto">
      <div className="rounded-2xl border border-slate-800 bg-[#0B1120] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col relative z-10">
        
        {/* Browser Header */}
        <div className="bg-slate-900 px-4 py-3 flex items-center gap-4 border-b border-slate-800">
          <div className="flex gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="bg-slate-950 text-slate-400 text-xs md:text-sm px-4 py-1.5 rounded-md flex-1 max-w-xl mx-auto text-center font-mono border border-slate-800 truncate">
            johnson-backoffice.newtechadvertising.com
          </div>
          <div className="w-12 shrink-0 hidden md:block"></div> {/* Spacer to balance */}
        </div>

        {/* App Content */}
        <div className="flex bg-[#0B1120] text-sm h-[500px] md:h-[600px] overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900/50 border-r border-slate-800 p-4 hidden md:flex flex-col gap-2 shrink-0">
            <div className="text-[#10B981] font-bold mb-6 px-3 tracking-wider text-xs">JOHNSON HEATING</div>
            {['Dashboard', 'Customers', 'Dispatch', 'Invoicing', 'Expenses', 'Inventory', 'Field View'].map((item, i) => (
              <div key={i} className={`px-3 py-2.5 rounded-lg font-medium transition-colors ${i === 0 ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'} cursor-default`}>
                {item}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8 bg-[#0B1120] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <button className="bg-[#10B981] text-white px-5 py-2 rounded-lg font-bold shadow-md shadow-emerald-900/20">
                + New Job
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="text-slate-400 mb-2 font-medium">Active Jobs</div>
                <div className="text-3xl font-bold text-white">12</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="text-slate-400 mb-2 font-medium">Revenue This Month</div>
                <div className="text-3xl font-bold text-white">$14,280</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="text-slate-400 mb-2 font-medium">Overdue Invoices</div>
                <div className="text-3xl font-bold text-red-400">2</div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hidden md:block">
              <div className="px-6 py-4 border-b border-slate-800 font-semibold text-white">Recent Jobs</div>
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Service</th>
                    <th className="px-6 py-3 font-medium">Tech</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-slate-800">
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Sarah Jenkins</td>
                    <td className="px-6 py-4">A/C Diagnostic & Repair</td>
                    <td className="px-6 py-4 text-slate-400">Mike R.</td>
                    <td className="px-6 py-4"><span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md text-xs font-bold">In Progress</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Dave's Diner</td>
                    <td className="px-6 py-4">Commercial Furnace Install</td>
                    <td className="px-6 py-4 text-slate-400">John S.</td>
                    <td className="px-6 py-4"><span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2.5 py-1 rounded-md text-xs font-bold">Completed</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-white">Tom Haverford</td>
                    <td className="px-6 py-4">Annual Maintenance</td>
                    <td className="px-6 py-4 text-slate-400">Mike R.</td>
                    <td className="px-6 py-4"><span className="border border-[#10B981]/50 text-[#10B981] px-2.5 py-1 rounded-md text-xs font-bold">Scheduled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Table Stand-in */}
            <div className="md:hidden space-y-4">
              <div className="text-white font-bold mb-2">Recent Jobs</div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white">Sarah Jenkins</div>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-bold">In Progress</span>
                </div>
                <div className="text-slate-400">A/C Diagnostic & Repair</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white">Dave's Diner</div>
                  <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-0.5 rounded text-xs font-bold">Completed</span>
                </div>
                <div className="text-slate-400">Commercial Furnace Install</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}