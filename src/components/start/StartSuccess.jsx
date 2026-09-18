import { Link } from 'react-router-dom';
import { CheckCircle2, Phone, MessageSquare, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';
const EMAIL = 'info@newtechadvertising.com';
const CALENDAR_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';
const SMS_BODY = encodeURIComponent('Hey Rick, I started a free growth conversation and wanted to continue.');

function openGrowthGuide() {
  window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
    detail: { source: 'start_success_talk_office' },
  }));
}

export default function StartSuccess({ name }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </motion.div>

      <h2 className="text-3xl font-black text-white mb-4">
        {name ? `${name}, your conversation request is in.` : 'Your conversation request is in.'}
      </h2>
      <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
        Rick will reach out to listen and help you sort through what's on your mind. There's no package to choose and nothing to buy. You can also continue in whatever way feels natural.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl mb-10 text-left">
        {/* Continue the conversation */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-white mb-3">Continue the Conversation</h3>
          <p className="text-slate-400 text-sm mb-5 flex-grow">
            Pick whatever feels natural. Call, text, email, book a time, or talk through the Digital Growth Guide.
          </p>
          <div className="space-y-2.5">
            <a href={`tel:+1${PHONE}`} className="flex items-center gap-3 text-slate-200 hover:text-white text-sm transition-colors">
              <Phone className="w-4 h-4 text-blue-400" /> Call Rick: {PHONE_DISPLAY}
            </a>
            <a href={`sms:+1${PHONE}?body=${SMS_BODY}`} className="flex items-center gap-3 text-slate-200 hover:text-white text-sm transition-colors">
              <MessageSquare className="w-4 h-4 text-blue-400" /> Text Rick
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-slate-200 hover:text-white text-sm transition-colors">
              <Mail className="w-4 h-4 text-blue-400" /> {EMAIL}
            </a>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-200 hover:text-white text-sm transition-colors">
              <Calendar className="w-4 h-4 text-blue-400" /> Book a time to talk
            </a>
            <button type="button" onClick={openGrowthGuide} className="flex items-center gap-3 text-slate-200 hover:text-white text-sm transition-colors text-left">
              <MessageSquare className="w-4 h-4 text-blue-400" /> Talk to My Office™
            </button>
          </div>
        </div>

        {/* Keep learning */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 flex flex-col h-full">
          <div className="text-3xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-white mb-2">Keep Learning While You Wait</h3>
          <p className="text-slate-400 text-sm mb-6 flex-grow">
            Explore plain-English answers to common business questions. No account is needed to keep learning.
          </p>
          <div className="mt-auto">
            <Link
              to="/knowledge/questions"
              className="block w-full text-center bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors mb-2"
            >
              Browse Business Questions →
            </Link>
            <p className="text-center text-slate-500 text-xs">No account is needed to keep learning</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-sm">
        Questions anytime? Call or text Rick: <a href={`tel:+1${PHONE}`} className="text-blue-400 hover:text-blue-300">{PHONE_DISPLAY}</a>
      </p>
    </div>
  );
}