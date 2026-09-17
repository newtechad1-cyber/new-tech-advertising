import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, MessageCircle } from 'lucide-react';

const BOOKING_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';
const RICK_PHONE_HREF = 'tel:+16414208816';
const RICK_SMS_HREF = 'sms:+16414208816?body=Hey%2C%20I%20would%20like%20to%20talk%20about%20my%20business.';
const RICK_EMAIL_HREF = 'mailto:info@newtechadvertising.com?subject=Growth%20Conversation';

export default function BCBookingSection() {
  const [opened, setOpened] = useState(false);

  const openTalkToOffice = () => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source: 'book_call', question: 'I would like to talk about my business.' },
    }));
  };

  return (
    <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Would a scheduled conversation help?
        </h2>

        <p className="text-xl text-slate-300 mb-8">
          Choose a time if that is the easiest next step. The purpose is to understand the situation, answer the question in front of you, and decide what—if anything—makes sense next.
        </p>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="inline-flex items-center gap-2 px-12 py-6 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-1"
        >
          <Clock className="w-5 h-5" />
          Choose a Time with Rick <ArrowRight className="w-5 h-5" />
        </a>

        {opened && (
          <div className="mt-5 flex items-center justify-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Choose your time in the calendar. Your appointment is booked when the calendar confirms it.
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/45 p-6">
          <p className="text-sm leading-6 text-slate-300">
            A calendar is not the only way to continue. Talk to My Office™: call, text, email, or start a conversation—whichever is easiest for you.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            <button type="button" onClick={openTalkToOffice} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 px-4 py-2 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-400/10">
              <MessageCircle className="w-4 h-4" /> Talk to My Office™
            </button>
            <a href={RICK_PHONE_HREF} className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:border-slate-400 hover:bg-slate-800">Call 641-420-8816</a>
            <a href={RICK_SMS_HREF} className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:border-slate-400 hover:bg-slate-800">Text</a>
            <a href={RICK_EMAIL_HREF} className="rounded-lg border border-slate-600 px-4 py-2 text-white hover:border-slate-400 hover:bg-slate-800">Email</a>
          </div>
        </div>

        <p className="mt-7 text-sm leading-6 text-slate-300">
          Prefer a personal follow-up? <Link to="/contact?from=%2Fbook-call&topic=Growth%20Conversation" className="rounded font-semibold text-cyan-200 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Tell Rick what you would like to discuss</Link> and choose email, call, or text on the contact form.
        </p>

        <p className="text-slate-400 text-sm mt-8">
          NTA will not begin paid diagnostic or implementation work unless the scope, price, and next step are clearly agreed.
        </p>
      </div>
    </section>
  );
}