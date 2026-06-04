import React from 'react';
import { LayoutDashboard, Users, Truck, FileText, Receipt, Package, Smartphone, PenTool } from 'lucide-react';

export default function BOFeaturesGrid() {
  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-emerald-400" />,
      title: "Dashboard",
      description: "Revenue, active jobs, overdue invoices — your whole business at a glance"
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: "Customers",
      description: "Contact info, job history, and notes all in one searchable place"
    },
    {
      icon: <Truck className="w-6 h-6 text-emerald-400" />,
      title: "Dispatch",
      description: "Schedule jobs, assign techs, and track progress in real time"
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-400" />,
      title: "Invoicing",
      description: "Create, send, and track invoices — see what's paid and what's overdue"
    },
    {
      icon: <Receipt className="w-6 h-6 text-emerald-400" />,
      title: "Expenses",
      description: "Log expenses by category, vendor, and date. See where money goes"
    },
    {
      icon: <Package className="w-6 h-6 text-emerald-400" />,
      title: "Inventory",
      description: "Track parts, set low-stock alerts, and know what's on the truck"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      title: "Field View",
      description: "Mobile-first view for techs — today's jobs, customer info, status updates"
    },
    {
      icon: <PenTool className="w-6 h-6 text-emerald-400" />,
      title: "Custom",
      description: "Need something specific? We build screens around your actual workflow"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            WHAT YOU GET
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            7 Screens. Everything Covered.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Each screen is designed for how service businesses actually work — not how software companies think they work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors shadow-lg hover:shadow-xl group">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}