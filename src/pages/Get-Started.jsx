import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { createAgencyLead } from '@/lib/createAgencyLead';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const SERVICE_OPTIONS = [
  { value: 'diy_saas', label: 'DIY — I\'ll run it myself ($99/mo)' },
  { value: 'dfy_managed', label: 'Done-For-You — manage it for me ($399/mo)' },
  { value: 'ada_rebuild', label: 'ADA Compliance / Website Rebuild' },
  { value: 'streaming_tv', label: 'Streaming TV Advertising' },
  { value: 'not_sure', label: 'Not sure yet — help me decide' },
];

export default function GetStarted() {
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '',
    industry: '', service_interest: 'not_sure', message: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // STEP 1 — Create SalesLead + SalesDeal FIRST (canonical intake path)
      const { salesLead, salesDeal } = await createAgencyLead({
        business_name: form.business_name,
        contact_name:  form.name,
        email:         form.email,
        phone:         form.phone,
        industry:      form.industry,
        lead_source:   'website',
        notes:         form.message || '',
      });
      console.log('[GetStarted] Lead created', salesLead.id, salesDeal.id);

      // STEP 2 — Mirror to NTA Unified Intake (non-blocking)
      base44.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'get_started',
        mapping_confidence: 'hardcoded',
        mapping_notes: 'Get-Started.jsx /get-started; offer_type derived from service_interest',
        detected_route: '/get-started',
        detected_component: 'GetStarted',
        source_system: 'website',
        source_page: '/get-started',
        service_interest: form.service_interest,
        name: form.name,
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        notes: form.message || '',
        priority: 'high',
        is_high_intent: true,
      }).catch(err => console.warn('[GetStarted] NTA mirror failed:', err.message));

      // STEP 3 — Create or find Company
      const company = await base44.entities.Company.create({
        business_name: form.business_name,
        industry: form.industry,
        email: form.email,
        phone: form.phone,
        status: 'lead',
        source: 'website',
        service_tracks: [form.service_interest].filter(s => s !== 'not_sure'),
      });

      // STEP 4 — Create Lead
      await base44.entities.Lead.create({
        company_id: company.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        business_name: form.business_name,
        industry: form.industry,
        service_interest: form.service_interest,
        message: form.message,
        status: 'new',
        source: 'website',
      });

      // STEP 5 — Send notification email
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA — New Trial Signup',
        to: 'rick@newtechadvertising.com',
        subject: `New Trial Signup: ${form.business_name}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business_name}\nIndustry: ${form.industry}\nService: ${form.service_interest}\nMessage: ${form.message}`,
      });

      setStep(2);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 py-4 px-6">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Link to={createPageUrl('Home')}>
              <img src={LOGO_URL} alt="NTA" className="h-9 w-auto" />
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 py-12">
          <div className="w-full max-w-3xl text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Welcome to NTA! 🎉</h1>
            <p className="text-slate-400 text-lg mb-12">
              Your account is being set up. Here's what happens next:
            </p>

            {/* Stepper */}
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 mb-16 text-left md:text-center mx-auto max-w-2xl">
              {/* Line connector (desktop only) */}
              <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-800 -z-10"></div>

              {/* Step 1 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 z-10">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">You signed up</h3>
                  <p className="text-slate-500 text-sm">We got your info and we're building your profile</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 z-10 animate-pulse ring-4 ring-violet-600/30">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">We review your business</h3>
                  <p className="text-slate-500 text-sm">We'll customize your dashboard based on your industry and goals</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 z-10">
                  <span className="text-slate-500 font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-slate-400 font-bold mb-1">You're live</h3>
                  <p className="text-slate-600 text-sm">Your marketing system is ready to use</p>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
              {/* Left Card */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 flex flex-col">
                <div className="text-3xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-white mb-2">Get Set Up With Rick</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1">
                  15-minute call to walk through your new system, answer questions, and make sure everything fits your business.
                </p>
                <div className="mt-auto">
                  <a
                    href="https://calendar.app.google/p6ieYanvwhixXxZ67"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors mb-2"
                  >
                    Book Kickoff Call →
                  </a>
                  <p className="text-center text-slate-500 text-xs">Recommended — gets you live faster</p>
                </div>
              </div>

              {/* Right Card */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 flex flex-col">
                <div className="text-3xl mb-4">💻</div>
                <h3 className="text-xl font-bold text-white mb-2">Jump Into the Platform</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1">
                  Log in and start exploring. Your dashboard, content tools, and campaign builder are ready.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/Login"
                    className="block w-full text-center bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors mb-2"
                  >
                    Go to Dashboard →
                  </Link>
                  <p className="text-center text-slate-500 text-xs">We'll email your login details shortly</p>
                </div>
              </div>
            </div>

            <p className="text-slate-500">
              Questions anytime? Call or text Rick: <a href="tel:6414208816" className="text-violet-400 hover:text-violet-300 transition-colors">641-420-8816</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img src={LOGO_URL} alt="NTA" className="h-9 w-auto" />
          </Link>
          <Link to={createPageUrl('Book-Call')} className="text-slate-400 hover:text-white text-sm transition-colors">
            Prefer a call? →
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5" /> Start your free 14-day trial
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Start Free Trial</h1>
            <p className="text-slate-400">No credit card required. We'll set everything up for you.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name *</Label>
                <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business Name *</Label>
                <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</Label>
                <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@smithplumbing.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone *</Label>
                <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Industry</Label>
              <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. HVAC, Restaurant, Law Firm" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">What are you most interested in? *</Label>
              <select
                required
                value={form.service_interest}
                onChange={e => set('service_interest', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {SERVICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Anything else? (optional)</Label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={3}
                placeholder="Tell us your biggest marketing challenge..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-violet-600/30"
            >
              {submitting ? 'Submitting…' : 'Start My Free Trial'}
              {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            <p className="text-center text-slate-600 text-xs">
              14-day free trial · No credit card · Cancel anytime
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}