import React from 'react';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { openSchedulingCalendar, BOOKING_EXTERNAL_URL } from '@/components/config/bookingConfig';

export default function BCBookingSection() {
  return (
    <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to unlock your growth?
        </h2>

        <p className="text-xl text-slate-300 mb-8">
          Pick a time that works for you. We'll call within 2 business hours to confirm.
        </p>

        <p className="text-slate-400 italic mb-10 pb-10 border-b border-slate-700/50">
          "No pressure. No generic pitch. Just a real strategy conversation about how to grow your business."
        </p>

        <button
          onClick={() => openSchedulingCalendar()}
          className="inline-flex items-center gap-2 px-12 py-6 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-1 mb-8"
        >
          <Clock className="w-5 h-5" />
          Choose Your Time <ArrowRight className="w-5 h-5" />
        </button>

        <div className="space-y-3">
          {[
            'Calendar opens instantly',
            'Call confirmed in 2 hours',
            'Recorded + notes sent after',
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-slate-400">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <p className="text-slate-600 text-sm mt-12">
          Questions? Call <a href="tel:6414208816" className="text-blue-400 hover:text-blue-300">641-420-8816</a> or email{' '}
          <a href="mailto:rick@newtechadvertising.com" className="text-blue-400 hover:text-blue-300">rick@newtechadvertising.com</a>
        </p>
      </div>
    </section>
  );
}