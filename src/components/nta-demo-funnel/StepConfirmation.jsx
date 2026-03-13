import React from 'react';
import { CheckCircle2, Calendar, Clock, Mail, PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PREP_STEPS = [
  { icon: '🌐', title: 'Know Your Top 3 Competitors', desc: 'We\'ll show you live data on what they\'re doing — and where you can beat them.' },
  { icon: '📊', title: 'Have Your Revenue Goal in Mind', desc: 'We\'ll map a growth path from where you are to where you want to be.' },
  { icon: '🤔', title: 'Write Down Your Biggest Frustration', desc: 'What\'s the #1 thing your current marketing isn\'t delivering? We\'ll address it.' },
];

export default function StepConfirmation({ data, booking }) {
  return (
    <div>
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">You're Booked!</h2>
        <p className="text-slate-500 text-sm">
          A calendar invite has been sent to <strong>{data.contact_email}</strong>
        </p>
      </div>

      {/* Booking summary */}
      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
        <p className="text-blue-900 font-black text-sm mb-4">Your Strategy Session Details</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-blue-900 text-sm font-bold">{booking?.demo_display_date || booking?.demo_date}</p>
              <p className="text-blue-600 text-xs">Demo date</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-blue-900 text-sm font-bold">{booking?.demo_time} Central Time</p>
              <p className="text-blue-600 text-xs">30 minutes · Live platform walkthrough</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-blue-900 text-sm font-bold">{data.contact_email}</p>
              <p className="text-blue-600 text-xs">Calendar invite + meeting link sent here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video placeholder */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden mb-6">
        <div className="aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer group hover:bg-slate-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
            <PlayCircle className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">Meet Your Strategist</p>
            <p className="text-slate-400 text-xs mt-0.5">2-min intro • What to expect in your session</p>
          </div>
        </div>
      </div>

      {/* Prep steps */}
      <div className="mb-6">
        <p className="text-slate-900 font-black text-sm mb-3">Get the Most From Your Demo</p>
        <div className="space-y-3">
          {PREP_STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className="text-slate-900 text-sm font-bold">{step.title}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What happens next */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white mb-4">
        <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-3 text-slate-400">What Happens Next</p>
        <div className="space-y-2">
          {[
            'Confirmation email with calendar invite (check spam)',
            '24-hour reminder with session prep guide',
            'Day-of reminder 1 hour before your session',
            'Live 30-min demo tailored to your market',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xs font-black">{i + 1}</span>
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      <Link to="/nta/home"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
        Return to NTA Home <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}