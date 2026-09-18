import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageSquare } from 'lucide-react';

export default function StartConversationSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <div className="bg-gradient-to-b from-slate-800/40 to-slate-900/50 border border-slate-700 rounded-3xl p-10 md:p-16 relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none" />
        <h2 className="text-2xl md:text-4xl font-black text-white mb-6 relative z-10 leading-snug">
          Start With a Conversation About Your Restaurant.
        </h2>
        <div className="relative z-10 space-y-3 text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10 text-left">
          <p>You don't have to know what technology you need.</p>
          <p>You don't have to decide whether you need a new website.</p>
          <p>
            You don't have to know whether the problem is marketing, operations, communication, training, customer
            experience, or something else.
          </p>
          <p>Start with what's happening in the restaurant.</p>
          <p>NTA will listen, ask questions, and help you begin understanding what might make sense next.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 relative z-10">
          <Link
            to="/start"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_24px_rgba(59,130,246,0.3)]"
          >
            Start a Free Growth Conversation <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="tel:6414208816"
            className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all text-base"
          >
            <Phone className="w-4 h-4 text-blue-400" /> 641-420-8816
          </a>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-300 text-sm transition-colors relative z-10"
        >
          <MessageSquare className="w-4 h-4" /> Or reach Talk to My Office&trade;
        </Link>
      </div>
    </section>
  );
}