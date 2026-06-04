import React from 'react';

export default function RestAppPreview() {
  return (
    <section className="bg-[#0B1120] py-16 px-6">
      <div className="max-w-5xl mx-auto relative group">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition duration-500" />
        
        {/* Browser Window */}
        <div className="relative bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 bg-slate-900 rounded-md h-7 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
              yourrestaurant.newtechadvertising.com
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-2">
              {['Dashboard', 'Menu', 'Orders', 'Reservations', 'Reviews', 'Analytics'].map((item, i) => (
                <div key={item} className={`px-3 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:text-white hover:bg-slate-800'} transition-colors cursor-pointer`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-[#0B1120] p-8 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6">Today's Orders</h3>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-xs font-semibold mb-1">Orders Today</div>
                  <div className="text-2xl font-bold text-white">34</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-xs font-semibold mb-1">Revenue Today</div>
                  <div className="text-2xl font-bold text-emerald-400">$1,847</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-xs font-semibold mb-1">Avg Wait Time</div>
                  <div className="text-2xl font-bold text-white">12 min</div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-300">#1042</td>
                      <td className="px-4 py-3 text-white font-medium">Sarah Jenkins</td>
                      <td className="px-4 py-3 text-slate-400">2x Double Burger, Fries</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Ready</span></td>
                    </tr>
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-300">#1043</td>
                      <td className="px-4 py-3 text-white font-medium">Mike R.</td>
                      <td className="px-4 py-3 text-slate-400">3x Fish Tacos, Guacamole</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold">Preparing</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-300">#1041</td>
                      <td className="px-4 py-3 text-white font-medium">Emily W.</td>
                      <td className="px-4 py-3 text-slate-400">Caesar Salad, Iced Tea</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-semibold">Delivered</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}