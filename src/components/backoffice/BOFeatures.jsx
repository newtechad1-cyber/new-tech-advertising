import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function BOFeatures() {
  return (
    <section id="features" className="py-24 px-6 max-w-[1100px] mx-auto space-y-32">
      
      {/* Feature 1: Text Left, Mockup Right */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2">
          <div className="w-12 h-12 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">1</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Dispatch & Scheduling</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            See every job, every tech, every day — at a glance. Assign, reschedule, and track progress without phone calls or sticky notes.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Drag-and-drop job scheduling
            </li>
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Tech assignments with status tracking
            </li>
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Real-time job progress updates
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="text-white font-bold mb-4 border-b border-slate-800 pb-3 flex justify-between items-center">
              <span>Today's Dispatch</span>
              <span className="text-xs text-slate-400 font-normal">Updated Just Now</span>
            </div>
            <div className="space-y-3">
              <div className="bg-[#0B1120] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-xs font-bold tracking-wider text-slate-500 mb-1">08:00 AM — MIKE R.</div>
                  <div className="font-bold text-white text-base">Sarah Jenkins</div>
                  <div className="text-sm text-slate-400">A/C Diagnostic & Repair</div>
                </div>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">IN PROGRESS</span>
              </div>
              <div className="bg-[#0B1120] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-xs font-bold tracking-wider text-slate-500 mb-1">10:30 AM — JOHN S.</div>
                  <div className="font-bold text-white text-base">Dave's Diner</div>
                  <div className="text-sm text-slate-400">Commercial Furnace</div>
                </div>
                <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">COMPLETED</span>
              </div>
              <div className="bg-[#0B1120] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-xs font-bold tracking-wider text-slate-500 mb-1">01:00 PM — MIKE R.</div>
                  <div className="font-bold text-white text-base">Tom Haverford</div>
                  <div className="text-sm text-slate-400">Annual Maintenance</div>
                </div>
                <span className="border border-[#10B981]/30 text-[#10B981] px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">SCHEDULED</span>
              </div>
              <div className="bg-[#0B1120] p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-xs font-bold tracking-wider text-slate-500 mb-1">02:30 PM — JOHN S.</div>
                  <div className="font-bold text-white text-base">April Ludgate</div>
                  <div className="text-sm text-slate-400">New Install Estimate</div>
                </div>
                <span className="border border-[#10B981]/30 text-[#10B981] px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">SCHEDULED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Mockup Left, Text Right */}
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 w-full">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-start border-b border-slate-800 pb-6 mb-6">
              <div>
                <div className="text-2xl font-black text-white mb-1">Invoice #1047</div>
                <div className="text-slate-400 font-medium">Billed to: Sarah Jenkins</div>
              </div>
              <span className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-3 py-1.5 rounded-lg text-sm font-bold tracking-wide">PAID</span>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-300 items-center">
                <span className="font-medium">Carrier AC Unit</span>
                <span className="text-slate-400">$2,150.00</span>
              </div>
              <div className="flex justify-between text-slate-300 items-center">
                <span className="font-medium">Installation Labor</span>
                <span className="text-slate-400">$540.00</span>
              </div>
              <div className="flex justify-between text-slate-300 items-center">
                <span className="font-medium">Copper Line Set</span>
                <span className="text-slate-400">$87.00</span>
              </div>
              <div className="flex justify-between text-slate-300 items-center">
                <span className="font-medium">Thermostat Programming</span>
                <span className="text-slate-400">$70.00</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-6">
              <span className="text-lg font-bold text-white">Total Amount</span>
              <span className="text-4xl font-black text-[#10B981]">$2,847.00</span>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="w-12 h-12 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">2</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Invoicing & Payments</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Create invoices from completed jobs in one click. Track what's paid, what's overdue, and stop chasing customers for money.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Generate invoices from job records
            </li>
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Payment status tracking
            </li>
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Overdue invoice alerts
            </li>
          </ul>
        </div>
      </div>

      {/* Feature 3: Text Left, Mockup Right */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2">
          <div className="w-12 h-12 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">3</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Mobile Field View</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Your techs see today's jobs, customer info, and can update status from their phone. No training needed.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Today's schedule at a glance
            </li>
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> Customer info and job history
            </li>
            <li className="flex items-start gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-[#10B981] w-6 h-6 shrink-0 mt-0.5"/> One-tap status updates
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 w-full flex justify-center">
          {/* Phone Mockup */}
          <div className="w-[320px] bg-slate-900 border-[10px] border-slate-800 rounded-[3rem] p-5 shadow-2xl relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
            
            <div className="pt-6 pb-4 border-b border-slate-800/50 mb-4">
              <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-1">TECH VIEW — MIKE R.</div>
              <div className="text-white font-black text-xl">Today's Jobs</div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div className="text-xs font-bold tracking-wider text-slate-500 mb-2">08:00 AM</div>
                <div className="text-white font-bold text-lg leading-tight mb-1">Sarah Jenkins</div>
                <div className="text-slate-400 text-sm mb-3">1422 Elm St.</div>
                <div className="bg-[#10B981]/10 text-[#10B981] px-3 py-1.5 rounded-lg text-sm font-medium mb-4 inline-block">
                  A/C Diagnostic & Repair
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors py-2.5 rounded-xl text-sm font-bold shadow-md">
                  In Progress
                </button>
              </div>

              <div className="bg-[#0B1120] p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden opacity-70">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700"></div>
                <div className="text-xs font-bold tracking-wider text-slate-500 mb-2">01:00 PM</div>
                <div className="text-white font-bold text-lg leading-tight mb-1">Tom Haverford</div>
                <div className="text-slate-400 text-sm mb-3">8920 Oak Dr.</div>
                <div className="bg-[#10B981]/10 text-[#10B981] px-3 py-1.5 rounded-lg text-sm font-medium mb-4 inline-block">
                  Annual Maintenance
                </div>
                <button className="w-full border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 transition-colors py-2.5 rounded-xl text-sm font-bold">
                  Start Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}