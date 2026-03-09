import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Zap, Building2, Mail, Phone, User, Globe, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const GOALS = ['Get more leads', 'Improve my website', 'Rank on Google', 'Manage social media', 'Build a video presence', 'Replace my agency'];
const PLANS = [{ key: 'starter', label: 'Starter — $297/mo' }, { key: 'growth', label: 'Growth — $597/mo' }, { key: 'pro', label: 'Pro — $997/mo' }];

export default function StartTrial() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: '', company_name: '', email: '', phone: '', business_type: '', current_website: '', main_goal: '', selected_plan: 'growth' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const sessionKey = localStorage.getItem('nta_session') || crypto.randomUUID();

      // Upsert prospect
      const existingProspects = await base44.entities.SalesProspects.filter({ email: form.email });
      let prospectId;
      if (existingProspects.length > 0) {
        await base44.entities.SalesProspects.update(existingProspects[0].id, {
          status: 'trial_started',
          full_name: form.full_name,
          company_name: form.company_name,
          phone: form.phone,
          industry: form.business_type,
          last_activity_at: new Date().toISOString(),
          recommended_plan: form.selected_plan,
        });
        prospectId = existingProspects[0].id;
      } else {
        const p = await base44.entities.SalesProspects.create({
          full_name: form.full_name,
          company_name: form.company_name,
          email: form.email,
          phone: form.phone,
          industry: form.business_type,
          status: 'trial_started',
          recommended_plan: form.selected_plan,
          first_seen_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        });
        prospectId = p.id;
      }

      // Create trial request record
      await base44.entities.TrialRequests.create({ ...form, status: 'new', prospect_id: prospectId });

      // Track event
      await base44.functions.invoke('trackSalesEvent', {
        event_type: 'cta_start_trial',
        page_path: '/start-trial',
        session_key: sessionKey,
        prospect_id: prospectId,
      });

      // Notify team
      base44.integrations.Core.SendEmail({
        from_name: 'NTA — New Trial Request',
        to: 'rick@newtechadvertising.com',
        subject: `New Trial Request: ${form.company_name}`,
        body: `Name: ${form.full_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.company_name}\nType: ${form.business_type}\nWebsite: ${form.current_website}\nGoal: ${form.main_goal}\nPlan: ${form.selected_plan}`,
      }).catch(() => {});

      setStep(3);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-3">You're In!</h1>
          <p className="text-slate-400 mb-2">We'll reach out within <strong className="text-white">2 business hours</strong> to schedule your setup call.</p>
          <p className="text-slate-500 text-sm mb-8">Setup typically takes 48 hours. Then your marketing system runs automatically.</p>
          <Link to={createPageUrl('Book-Call')} className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all text-sm mb-3">
            Book your onboarding call <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to={createPageUrl('Home')} className="text-slate-500 hover:text-white text-sm transition-colors block">← Back to home</Link>
          <p className="text-slate-600 text-xs mt-5">Questions? <a href="tel:6414208816" className="text-violet-400">641-420-8816</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 py-4 px-6 flex items-center justify-between">
        <Link to={createPageUrl('Home')}><img src={LOGO} alt="NTA" className="h-9 w-auto" /></Link>
        <span className="text-slate-500 text-sm">Already a customer? <a href="#" className="text-violet-400">Sign in</a></span>
      </header>

      <div className="flex-1 max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700 text-violet-300 text-sm px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Start Your Free Trial
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Let's Get Your Marketing Running</h1>
          <p className="text-slate-400">Fill in the basics. We'll handle the rest. Setup takes 48 hours.</p>
        </div>

        {/* Trust line */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
          {['Done-for-you setup — we build it', 'No long contracts required', 'Cancel any time'].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-slate-300 py-1">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> {t}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-2xl p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><Label className="text-slate-300 mb-1.5 flex items-center gap-1.5 text-xs"><User className="w-3.5 h-3.5" />Full Name *</Label>
              <Input required value={form.full_name} onChange={e => set('full_name', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Jane Smith" /></div>
            <div><Label className="text-slate-300 mb-1.5 flex items-center gap-1.5 text-xs"><Building2 className="w-3.5 h-3.5" />Business Name *</Label>
              <Input required value={form.company_name} onChange={e => set('company_name', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="Smith Plumbing" /></div>
            <div><Label className="text-slate-300 mb-1.5 flex items-center gap-1.5 text-xs"><Mail className="w-3.5 h-3.5" />Email *</Label>
              <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="jane@business.com" /></div>
            <div><Label className="text-slate-300 mb-1.5 flex items-center gap-1.5 text-xs"><Phone className="w-3.5 h-3.5" />Phone *</Label>
              <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="(555) 123-4567" /></div>
          </div>
          <div><Label className="text-slate-300 mb-1.5 flex items-center gap-1.5 text-xs"><Building2 className="w-3.5 h-3.5" />Business Type *</Label>
            <Input required value={form.business_type} onChange={e => set('business_type', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. HVAC, Restaurant, Plumbing…" /></div>
          <div><Label className="text-slate-300 mb-1.5 flex items-center gap-1.5 text-xs"><Globe className="w-3.5 h-3.5" />Current Website (optional)</Label>
            <Input value={form.current_website} onChange={e => set('current_website', e.target.value)} className="bg-slate-800 border-slate-700 text-white" placeholder="https://yourbusiness.com" /></div>
          <div>
            <Label className="text-slate-300 mb-2 flex items-center gap-1.5 text-xs"><Target className="w-3.5 h-3.5" />Main Goal</Label>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map(g => (
                <button key={g} type="button" onClick={() => set('main_goal', g)}
                  className={`text-xs py-2 px-3 rounded-lg border transition-all text-left ${form.main_goal === g ? 'bg-violet-700 border-violet-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-slate-300 mb-2 text-xs">Select Your Plan</Label>
            <div className="space-y-2">
              {PLANS.map(p => (
                <button key={p.key} type="button" onClick={() => set('selected_plan', p.key)}
                  className={`w-full text-sm py-2.5 px-4 rounded-lg border transition-all text-left font-medium ${form.selected_plan === p.key ? 'bg-violet-700 border-violet-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}>{p.label}</button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-violet-600/20">
            {submitting ? 'Submitting…' : <>Start My Trial <ArrowRight className="w-5 h-5 ml-2" /></>}
          </Button>
          <p className="text-center text-slate-600 text-xs">No credit card required for trial · Setup in 48 hours</p>
        </form>
      </div>
    </div>
  );
}