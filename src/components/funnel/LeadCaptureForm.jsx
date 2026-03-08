import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LeadCaptureForm({ 
  serviceSlug = '', 
  sourcePage = '', 
  ctaLabel = 'Download Free Guide',
  compact = false,
  onSuccess 
}) {
  const [form, setForm] = useState({ name: '', business_name: '', email: '', phone: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.business_name) {
      toast.error('Please fill in name, business name, and email');
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Lead.create({
        ...form,
        source: 'funnel_page',
        funnel_service: serviceSlug,
        lead_source_page: sourcePage,
        guide_downloaded: true,
        status: 'new'
      });

      // Trigger step 1 follow-up email
      base44.functions.invoke('sendLeadFollowUpEmail', { lead_id: undefined, step: 1 })
        .catch(() => {}); // Fire and forget

      setSubmitted(true);
      toast.success('Success! Check your email.');
      onSuccess?.();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <p className="font-bold text-lg">You're in! Check your inbox.</p>
        <p className="text-sm text-slate-500">We'll send your free guide + follow up with next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${compact ? '' : ''}`}>
      <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
        <Input
          placeholder="Your Name *"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <Input
          placeholder="Business Name *"
          value={form.business_name}
          onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
          required
        />
        <Input
          type="email"
          placeholder="Email Address *"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
        <Input
          placeholder="Phone Number"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
        {!compact && (
          <Input
            placeholder="City"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            className="sm:col-span-2"
          />
        )}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-semibold"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        {ctaLabel}
      </Button>
      <p className="text-xs text-center text-slate-400">No spam. Unsubscribe anytime.</p>
    </form>
  );
}