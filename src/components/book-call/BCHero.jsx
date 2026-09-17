import { useState } from 'react';
import { ArrowRight, CheckCircle, MessageCircle, Zap } from 'lucide-react';

const BOOKING_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';
const RICK_PHONE_HREF = 'tel:+16414208816';
const RICK_SMS_HREF = 'sms:+16414208816?body=Hey%2C%20I%20would%20like%20to%20talk%20about%20my%20business.';
const RICK_EMAIL_HREF = 'mailto:info@newtechadvertising.com?subject=Growth%20Conversation';

export default function BCHero() {
  const [opened, setOpened] = useState(false);

  const openTalkToOffice = () => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source: 'book_call', question: 'I would like to talk about my business.' },
    }));
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold mb-8">
          <Zap className="w-3.5 h-3.5" />
          A free Growth Conversation with Rick
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">
          Choose a Time to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Talk with Rick
          </span>
        </h1>

        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
          Tell Rick what you want to improve and where you need help. We’ll begin with your business, explore a practical first step, and discuss the scope and price together when paid work would be useful.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpened(true)}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-lg font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-1"
          >
            Choose a Time with Rick <ArrowRight className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={openTalkToOffice}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-600 bg-slate-900/80 px-8 py-5 text-lg font-bold text-white hover:border-slate-400 hover:bg-slate-800"
          >
            <MessageCircle className="w-5 h-5" /> Talk to My Office™
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-300">
          <a href={RICK_PHONE_HREF} className="hover:text-white hover:underline">Call 641-420-8816</a>
          <a href={RICK_SMS_HREF} className="hover:text-white hover:underline">Text</a>
          <a href={RICK_EMAIL_HREF} className="hover:text-white hover:underline">Email</a>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Call, text, email, or start a conversation—whichever is easiest for you.
        </p>

        {opened && (
          <div className="mt-5 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Choose your time in the calendar. Your appointment is booked when the calendar confirms it.
          </div>
        )}
      </div>
    </section>
  );
}