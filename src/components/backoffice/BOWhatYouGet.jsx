import React from 'react';

export default function BOWhatYouGet() {
  const screens = [
    { icon: "📊", title: "Dashboard", desc: "Revenue, active jobs, overdue invoices — your whole business at a glance" },
    { icon: "👥", title: "Customers", desc: "Contact info, job history, and notes all in one searchable place" },
    { icon: "🚚", title: "Dispatch", desc: "Schedule jobs, assign techs, and track progress in real time" },
    { icon: "💰", title: "Invoicing", desc: "Create, send, and track invoices — see what's paid and what's overdue" },
    { icon: "📋", title: "Expenses", desc: "Log expenses by category, vendor, and date. See where money goes" },
    { icon: "🔧", title: "Inventory", desc: "Track parts, set low-stock alerts, and know what's on the truck" },
    { icon: "📱", title: "Field View", desc: "Mobile-first view for techs — today's jobs, customer info, status updates" },
    { icon: "⚡", title: "Custom", desc: "Need something specific? We build screens around your actual workflow" },
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#E8613A] font-bold text-sm tracking-widest uppercase mb-3">WHAT YOU GET</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">7 Screens. Everything Covered.</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Each screen is designed for how service businesses actually work — not how software companies think they work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {screens.map((item, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 hover:border-slate-700 transition-all shadow-lg hover:-translate-y-1">
              <div className="text-4xl mb-4 bg-slate-800/50 w-14 h-14 rounded-xl flex items-center justify-center border border-slate-700/50 shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}