import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Phone, Calendar, Star } from 'lucide-react';
import HVACVideoBlock from '../components/hvac-funnel/HVACVideoBlock';

const NEXT_STEPS = [
  { icon: Phone, num: '01', title: 'We\'ll Call You Within 24 Hours', desc: 'Rick or a team member will reach out to confirm your info and ask a few quick questions about your business.' },
  { icon: Calendar, num: '02', title: 'We Build Your Demo System', desc: 'Our team creates a custom preview of your HVAC Growth System — video, website, and content plan — in 3–5 business days.' },
  { icon: Star, num: '03', title: 'You Review and Decide', desc: 'We walk you through everything on a 30-minute call. You decide if it\'s right for you — zero pressure, no commitment.' },
];

export default function HVACFunnelThankYou() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">NTA</div>
          <span className="font-bold text-slate-800 text-sm">HVAC Growth System</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-12 pb-16 space-y-10 text-center">
        {/* Confirmation */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">You're In! 🎉</h1>
          <p className="text-slate-600 text-lg max-w-sm mx-auto">
            Your request has been received. We'll be in touch within 24 hours to get started on your free HVAC demo system.
          </p>
        </div>

        {/* Video */}
        <HVACVideoBlock title="What Happens Next — A Message from Rick" subtitle="Watch this quick video about what to expect" />

        {/* Next steps */}
        <div className="space-y-4 text-left">
          <h2 className="text-xl font-black text-slate-900 text-center">What Happens Next</h2>
          {NEXT_STEPS.map(({ icon: Icon, num, title, desc }) => (
            <div key={num} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">{num}</div>
              <div>
                <p className="font-bold text-slate-900 mb-1">{title}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 space-y-2">
          <div className="flex justify-center gap-1">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />)}</div>
          <p className="text-lg font-bold">"Best marketing investment I've made for my HVAC business. Phone's been ringing more than ever."</p>
          <p className="text-blue-200 text-sm">— Tony B., TBH Heating & Air</p>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <p className="text-slate-500 text-sm">Questions? Reach out directly:</p>
          <a href="tel:+16415550100" className="text-blue-600 font-bold text-lg hover:text-blue-500">(641) 555-0100</a>
          <p className="text-slate-400 text-xs">or email rick@newtech.ad</p>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm transition-colors">
          ← Return to NTA Homepage
        </Link>
      </div>
    </div>
  );
}