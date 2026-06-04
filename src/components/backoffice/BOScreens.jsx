import React from 'react';

const screens = [
  {
    icon: "📊",
    title: "Dashboard",
    description: "Revenue, active jobs, overdue invoices — your whole business at a glance"
  },
  {
    icon: "👥",
    title: "Customers",
    description: "Contact info, job history, and notes all in one searchable place"
  },
  {
    icon: "🚚",
    title: "Dispatch",
    description: "Schedule jobs, assign techs, and track progress in real time"
  },
  {
    icon: "💰",
    title: "Invoicing",
    description: "Create, send, and track invoices — see what's paid and what's overdue"
  },
  {
    icon: "📋",
    title: "Expenses",
    description: "Log expenses by category, vendor, and date. See where money goes"
  },
  {
    icon: "🔧",
    title: "Inventory",
    description: "Track parts, set low-stock alerts, and know what's on the truck"
  },
  {
    icon: "📱",
    title: "Field View",
    description: "Mobile-first view for techs — today's jobs, customer info, status updates"
  },
  {
    icon: "⚡",
    title: "Custom",
    description: "Need something specific? We build screens around your actual workflow"
  }
];

export default function BOScreens() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">
            WHAT YOU GET
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            7 Screens. Everything Covered.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            Each screen is designed for how service businesses actually work — not how software companies think they work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {screens.map((screen, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/80 transition-colors shadow-sm">
              <div className="text-3xl mb-4 bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700/50">
                {screen.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{screen.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{screen.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}