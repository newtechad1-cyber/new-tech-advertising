import React from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import AuditFormSection from '@/components/audit/AuditFormSection';
import { Phone, MessageSquare } from 'lucide-react';

const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';
const SMS_BODY = encodeURIComponent("Hey, can you look at my website?");

export default function FreeAudit() {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <SEOHead
        title="Free AI Visibility Audit | New Tech Advertising"
        description="Get a free AI visibility audit. We show you exactly how AI and search engines see your business — and what to fix first. NTA Mason City IA."
      />
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Free AI Visibility Audit
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Find out how AI search engines, Google, and your customers see your business online — and get a prioritized action plan to fix it.
          </p>
        </div>
      </section>

      {/* Audit Form Section */}
      <section className="flex-1">
        <AuditFormSection variant="standalone" />
      </section>

      {/* Prefer to Talk */}
      <section className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-4">Prefer to talk?</h3>
          <p className="text-slate-400 mb-6">Call or text Rick directly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:+1${PHONE}`}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" /> Call: {PHONE_DISPLAY}
            </a>
            <a
              href={`sms:+1${PHONE}?body=${SMS_BODY}`}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageSquare className="w-5 h-5" /> Text: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
