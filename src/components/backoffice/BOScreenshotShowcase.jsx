import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, CalendarDays, FileText, Receipt, Package, Smartphone } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/974077883_app-screen-dashboard.png' },
  { id: 'customers', label: 'Customers', icon: Users, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/e606ab743_app-screen-customers.png' },
  { id: 'dispatch', label: 'Dispatch', icon: CalendarDays, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/1f439612b_app-screen-dispatch.png' },
  { id: 'invoicing', label: 'Invoicing', icon: FileText, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/37cbf036d_app-screen-invoicing.png' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/54410b5c8_app-screen-expenses.png' },
  { id: 'inventory', label: 'Inventory', icon: Package, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/b65777872_app-screen-inventory.png' },
  { id: 'field-view', label: 'Field View', icon: Smartphone, src: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/d9fcdfe65_app-screen-field-view.png' },
];

export default function BOScreenshotShowcase() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-4">
            TAKE A TOUR
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Everything You Need, Nothing You Don't
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Click through the tabs below to explore how the custom back-office streamlines every part of your daily operations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-2 mb-10 pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => {
            const isActive = activeTab.id === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Browser Frame Showcase */}
        <div className="relative max-w-5xl mx-auto">
          {/* Subtle green radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative bg-slate-900 rounded-t-3xl border border-slate-800 p-2 shadow-2xl overflow-hidden z-10 min-h-[300px]">
            <div className="bg-slate-950 rounded-t-2xl overflow-hidden border border-slate-800 relative">
              
              {/* Browser Header */}
              <div className="w-full h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2 relative z-20">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              
              {/* Image Container */}
              <div className="relative w-full bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeTab.id}
                    src={activeTab.src}
                    alt={activeTab.label}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-auto block"
                  />
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}