import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const WEBHOOK_URL = 'https://grateful-lynx-44.convex.site/api/webhook/lead';

/**
 * Reusable AI Visibility Audit form section.
 * Can be embedded on any page (homepage, services, standalone).
 *
 * Props:
 *   variant: 'standalone' | 'inline' (default 'inline')
 *   heading: override heading text
 *   subheading: override subheading text
 */
export default function AuditFormSection({
  variant = 'inline',
  heading = 'Get Your Free AI Visibility Audit',
  subheading = "Find out exactly how customers and AI search engines see your business — and what to fix first.",
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    business_name: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    marketing_challenge: '',
  });
  // Anti-spam: honeypot + page-load timestamp
  const [_hp, setHp] = useState('');
  const [pageLoadTs] = useState(() => Date.now());

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fullName = `${form.first_name} ${form.last_name}`.trim();

    try {
      // 1. Call ntaUnifiedIntake (Base44 entity system)
      try {
        await base44.functions.invoke('ntaUnifiedIntake', {
          submission_type: 'free_audit_request',
          source_system: 'website',
          source_page: window.location.pathname,
          name: fullName,
          business_name: form.business_name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          industry: '',
          notes: form.marketing_challenge
            ? `Marketing challenge: ${form.marketing_challenge}`
            : 'Requested free AI visibility audit',
        });
      } catch (err) {
        console.warn('ntaUnifiedIntake call failed:', err);
      }

      // 2. Fire webhook to Viktor (Convex → Slack pipeline)
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'Y24RdJ7OjvX8lrcjPRDCYcusOnAspC9DbYkqJtY1Zb0',
          source: 'nta-website',
          form: '/free-audit',
          name: fullName,
          first_name: form.first_name,
          last_name: form.last_name,
          business_name: form.business_name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          city: form.city,
          marketing_challenge: form.marketing_challenge,
          service_interest: '',
          notes: form.marketing_challenge
            ? `Marketing challenge: ${form.marketing_challenge}`
            : 'Requested free AI visibility audit',
          timestamp: new Date().toISOString(),
          _hp,
          _ts: pageLoadTs,
        }),
      }).catch(err => console.log('Webhook failed:', err));

      setSubmitted(true);
      setForm({
        first_name: '', last_name: '', business_name: '',
        email: '', phone: '', city: '', website: '', marketing_challenge: '',
      });
    } catch (err) {
      toast.error('Something went wrong. Please try again or call 641-420-8816.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`${variant === 'standalone' ? '' : 'py-20 px-6'}`}>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
          <p className="text-slate-300 text-lg">
            Thanks! Rick will have your audit report ready within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variant === 'standalone' ? '' : 'py-20 px-6'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — Value props */}
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>
            <p className="text-slate-400 text-lg mb-8">{subheading}</p>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Shield, text: 'How AI search engines see (or miss) your business' },
                { icon: Zap, text: 'Your top 3 visibility gaps costing you customers' },
                { icon: Clock, text: 'A prioritized action plan — delivered within 24 hours' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-slate-300">
                  <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <p className="text-slate-400 text-sm">
                <strong className="text-white">100% free. No credit card. No spam.</strong><br />
                A real person audits your business and sends you a detailed PDF report with specific, actionable recommendations.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="company_url">Company URL</label>
                <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={e => setHp(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm font-semibold">First Name <span className="text-red-400">*</span></Label>
                  <Input required value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Jane" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm font-semibold">Last Name <span className="text-red-400">*</span></Label>
                  <Input required value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Smith" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">Business Name <span className="text-red-400">*</span></Label>
                <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm font-semibold">Email <span className="text-red-400">*</span></Label>
                  <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm font-semibold">Phone <span className="text-red-400">*</span></Label>
                  <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">City / Area <span className="text-red-400">*</span></Label>
                <Input required value={form.city} onChange={e => set('city', e.target.value)} placeholder="Mason City, IA" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">Website URL <span className="text-slate-500">(optional)</span></Label>
                <Input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbusiness.com" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 h-auto" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-semibold">What's your biggest marketing challenge right now? <span className="text-slate-500">(optional)</span></Label>
                <textarea
                  value={form.marketing_challenge}
                  onChange={e => set('marketing_challenge', e.target.value)}
                  placeholder="e.g. Not showing up on Google, no time for social media..."
                  rows={3}
                  className="w-full rounded-md bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 h-auto text-lg rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  {submitting ? 'Submitting...' : 'Get My Free Audit'}
                  {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
                <p className="text-center text-slate-500 text-xs mt-3">
                  Free · No credit card · Report delivered within 24 hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
