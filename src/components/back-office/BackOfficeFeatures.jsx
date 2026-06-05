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
          <div className="flex justify-center lg:justify-end">
            <img 
              src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/1f439612b_app-screen-dispatch.png" 
              alt="Dispatch & Scheduling screenshot" 
              className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
            />
          </div>
        </div>

        {/* Feature 2: Invoicing & Payments (Mockup Left, Text Right) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <img 
              src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/37cbf036d_app-screen-invoicing.png" 
              alt="Invoicing & Payments screenshot" 
              className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
            />
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
          <div className="flex justify-center lg:justify-end">
            <img 
              src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/74571269b_app-screen-field-view-real.png" 
              alt="Mobile Field View screenshot" 
              className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}