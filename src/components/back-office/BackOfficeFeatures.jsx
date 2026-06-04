import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function BackOfficeFeatures() {
  return (
    <section id="features" className="py-24 px-6 bg-slate-950 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-32">

        {/* Feature 1: Dispatch & Scheduling (Text Left, Mockup Right) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black text-xl mb-6">
              1
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Dispatch & Scheduling</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              See every job, every tech, every day — at a glance. Assign, reschedule, and track progress without phone calls or sticky notes.
            </p>
            <ul className="space-y-4">
              {['Drag-and-drop job scheduling', 'Tech assignments with status tracking', 'Real-time job progress updates'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            {/* Mock Dispatch Board */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="font-bold text-white">Today's Board</div>
              <div className="text-sm text-slate-400">4 Jobs</div>
            </div>
            <div className="space-y-3">
              {/* Job Row 1 */}
              <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-slate-700/50">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-300">08:00 AM</span>
                    <span className="font-semibold text-white">Smith Residence</span>
                  </div>
                  <div className="text-sm text-slate-400">AC Tune-up & Inspection</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  Completed
                </div>
              </div>
              {/* Job Row 2 */}
              <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-slate-700/50">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-300">10:30 AM</span>
                    <span className="font-semibold text-white">Main St Diner</span>
                  </div>
                  <div className="text-sm text-slate-400">Walk-in Cooler Repair</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                  In Progress
                </div>
              </div>
              {/* Job Row 3 */}
              <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-slate-700/50 opacity-70">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-300">01:00 PM</span>
                    <span className="font-semibold text-white">Johnson HVAC</span>
                  </div>
                  <div className="text-sm text-slate-400">Thermostat Install</div>
                </div>
                <div className="px-3 py-1 rounded-full border border-emerald-500 text-emerald-500 text-xs font-bold">
                  Scheduled
                </div>
              </div>
              {/* Job Row 4 */}
              <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-slate-700/50 opacity-70">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-300">03:30 PM</span>
                    <span className="font-semibold text-white">Rivera Home</span>
                  </div>
                  <div className="text-sm text-slate-400">Furnace Maintenance</div>
                </div>
                <div className="px-3 py-1 rounded-full border border-emerald-500 text-emerald-500 text-xs font-bold">
                  Scheduled
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Invoicing & Payments (Mockup Left, Text Right) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative flex justify-center">
            {/* Mock Invoice Card */}
            <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="bg-slate-50 border-b border-slate-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Invoice</div>
                    <div className="text-slate-900 font-black text-xl">#1047</div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                    PAID
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-600 mb-2">$2,847.00</div>
                <div className="text-sm text-slate-500">Billed to: Sarah Jenkins</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">Carrier AC Unit</span>
                  <span className="text-slate-900 font-bold">$2,150.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">Installation Labor</span>
                  <span className="text-slate-900 font-bold">$540.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">Copper Line Set</span>
                  <span className="text-slate-900 font-bold">$87.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">Thermostat Programming</span>
                  <span className="text-slate-900 font-bold">$70.00</span>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-black text-slate-900">$2,847.00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black text-xl mb-6">
              2
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Invoicing & Payments</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Create invoices from completed jobs in one click. Track what's paid, what's overdue, and stop chasing customers for money.
            </p>
            <ul className="space-y-4">
              {['Generate invoices from job records', 'Payment status tracking', 'Overdue invoice alerts'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 3: Mobile Field View (Text Left, Mockup Right) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black text-xl mb-6">
              3
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Mobile Field View</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Your techs see today's jobs, customer info, and can update status from their phone. No training needed.
            </p>
            <ul className="space-y-4">
              {['Today\'s schedule at a glance', 'Customer info and job history', 'One-tap status updates'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            {/* Mock Phone Frame */}
            <div className="w-[300px] h-[600px] bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] p-4 relative shadow-2xl overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-1/2 mx-auto"></div>
              
              <div className="mt-6 mb-6">
                <div className="text-slate-400 text-sm">Welcome back,</div>
                <div className="text-white font-bold text-xl">Mike R.</div>
                <div className="text-emerald-400 text-sm font-medium mt-1">Today • Oct 14</div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {/* Mobile Job Card 1 */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-bold">10:30 AM</span>
                    <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">In Progress</span>
                  </div>
                  <div className="mb-4">
                    <div className="text-slate-300 font-medium">Main St Diner</div>
                    <div className="text-slate-500 text-sm">124 Main St, Suite B</div>
                    <div className="text-slate-400 text-sm mt-2 bg-slate-900/50 p-2 rounded-lg">Walk-in Cooler Repair</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-slate-700 text-white text-xs font-bold py-2 rounded-lg">Nav</button>
                    <button className="bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg">Complete</button>
                  </div>
                </div>

                {/* Mobile Job Card 2 */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 opacity-75">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-bold">01:00 PM</span>
                    <span className="text-xs font-bold text-slate-400 border border-slate-600 px-2 py-1 rounded-full">Scheduled</span>
                  </div>
                  <div className="mb-4">
                    <div className="text-slate-300 font-medium">Johnson HVAC</div>
                    <div className="text-slate-500 text-sm">882 Oak Avenue</div>
                    <div className="text-slate-400 text-sm mt-2 bg-slate-900/50 p-2 rounded-lg">Thermostat Install</div>
                  </div>
                  <button className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg">Start Job</button>
                </div>
              </div>

              {/* Mobile Bottom Nav */}
              <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between px-4 text-slate-500">
                <div className="w-6 h-6 rounded bg-blue-500"></div>
                <div className="w-6 h-6 rounded bg-slate-700"></div>
                <div className="w-6 h-6 rounded bg-slate-700"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}