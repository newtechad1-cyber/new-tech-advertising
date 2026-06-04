import React from 'react';

export default function RSAppPreview() {
  return (
    <section className="bg-[#0B1120] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-[0_20px_50px_rgba(245,158,11,0.1)] overflow-hidden flex flex-col relative">
          
          {/* Browser Header */}
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-md text-center py-1.5 text-xs text-slate-500 font-mono border border-slate-800">
              yourrestaurant.newtechadvertising.com
            </div>
          </div>
          
          {/* App Body */}
          <div className="flex flex-col md:flex-row flex-1 min-h-[500px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col gap-2">
              <div className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="text-[#F59E0B]">🍽️</span> Restaurant OS
              </div>
              {['Dashboard', 'Menu', 'Orders', 'Reservations', 'Reviews', 'Analytics'].map((item, i) => (
                <div key={item} className={`px-4 py-2 rounded-lg text-sm font-medium ${i === 2 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer'}`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-slate-900 p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Today's Orders</h2>
                <div className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-bold border border-[#10B981]/20">
                  Accepting Orders
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="text-slate-400 text-sm mb-1">Orders Today</div>
                  <div className="text-3xl font-bold text-white">34</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="text-slate-400 text-sm mb-1">Revenue Today</div>
                  <div className="text-3xl font-bold text-white">$1,847<span className="text-sm text-slate-500 font-normal">.00</span></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="text-slate-400 text-sm mb-1">Avg Wait Time</div>
                  <div className="text-3xl font-bold text-white">12 <span className="text-lg text-slate-500 font-normal">min</span></div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-4 px-6 py-3 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div>Order #</div>
                    <div>Customer</div>
                    <div>Items</div>
                    <div className="text-right">Status</div>
                  </div>
                  {[
                    { id: '#1042', name: 'Sarah J.', items: '2x Smash Burger, 1x Fries', status: 'Preparing', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
                    { id: '#1041', name: 'Mike T.', items: '3x Al Pastor Tacos, 1x Chips', status: 'Ready', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
                    { id: '#1040', name: 'Elena R.', items: '1x Cobb Salad, 1x Iced Tea', status: 'Delivered', color: 'bg-slate-800 text-slate-400 border-slate-700' },
                  ].map((order, i) => (
                    <div key={order.id} className={`grid grid-cols-4 px-6 py-4 text-sm items-center ${i !== 2 ? 'border-b border-slate-800' : ''}`}>
                      <div className="font-medium text-white">{order.id}</div>
                      <div className="text-slate-300">{order.name}</div>
                      <div className="text-slate-400 truncate pr-4">{order.items}</div>
                      <div className="text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${order.color}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}