import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import PillarHero from '@/components/templates/PillarHero';
import InternalLinks from '@/components/templates/InternalLinks';
import PillarCTA from '@/components/templates/PillarCTA';
import { Tv, Copy, RefreshCw, CheckCircle } from 'lucide-react';

const DURATIONS = ['15 seconds', '30 seconds', '60 seconds'];
const TONES = ['Professional', 'Friendly & Conversational', 'Urgent / Limited Time', 'Authoritative', 'Warm & Community-Focused'];

const RELATED = [
  { label: 'Service', title: 'Streaming TV Advertising', desc: 'How CTV ads work for small businesses', href: createPageUrl('StreamingTvAdvertising') },
  { label: 'Tool', title: 'Marketing Plan Generator', desc: 'Build your full marketing strategy', href: createPageUrl('MarketingPlanGenerator') },
  { label: 'System', title: 'The NTA Growth System', desc: 'See the full platform', href: createPageUrl('GrowthSystem') },
];

export default function TvCommercialScriptGenerator() {
  const [form, setForm] = useState({ businessName: '', industry: '', serviceArea: '', offer: '', duration: '30 seconds', tone: 'Professional' });
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!form.businessName || !form.industry || !form.serviceArea) return;
    setLoading(true);
    setScript('');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a ${form.duration} streaming TV commercial script for a local ${form.industry} business.

Business name: ${form.businessName}
Service area: ${form.serviceArea}
Special offer or key message: ${form.offer || 'quality service and free estimates'}
Tone: ${form.tone}

Format the script with:
- OPENING (hook — first 3 seconds)
- BODY (main message with benefits)
- CALL TO ACTION (clear next step)

Keep it tight to the ${form.duration} duration. Write conversational, spoken-word language — not marketing copy. Include a suggested voiceover note.`,
    });
    setScript(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ready = form.businessName && form.industry && form.serviceArea;

  return (
    <div className="bg-slate-950 min-h-screen">
      <MarketingNav />

      <PillarHero
        badge="Free Tool"
        heading="TV Commercial Script Generator"
        subheading="Generate a professional 15, 30, or 60-second streaming TV commercial script for your business in under 60 seconds — powered by AI."
        primaryCta="Generate My Script Below"
        primaryHref="#generator"
      />

      {/* Tool */}
      <section id="generator" className="py-16 px-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center">
                <Tv className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">TV Commercial Script Generator</h2>
                <p className="text-slate-500 text-xs">Fill in the details and get your script in seconds</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Business Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC Heating & Cooling"
                    value={form.businessName}
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Industry / Business Type *</label>
                  <input
                    type="text"
                    placeholder="e.g. HVAC, Plumbing, Restaurant"
                    value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Service Area / City *</label>
                <input
                  type="text"
                  placeholder="e.g. Dallas, TX and surrounding suburbs"
                  value={form.serviceArea}
                  onChange={e => setForm(f => ({ ...f, serviceArea: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Special Offer or Key Message (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. $49 AC tune-up, free estimates, 24/7 emergency service"
                  value={form.offer}
                  onChange={e => setForm(f => ({ ...f, offer: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Script Length</label>
                  <div className="flex gap-2">
                    {DURATIONS.map(d => (
                      <button
                        key={d}
                        onClick={() => setForm(f => ({ ...f, duration: d }))}
                        className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${form.duration === d ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Tone</label>
                  <select
                    value={form.tone}
                    onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {TONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!ready || loading}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating your script...</> : <><Tv className="w-4 h-4" /> Generate My TV Script</>}
              </button>
            </div>

            {/* Output */}
            {script && (
              <div className="mt-6 border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">Your TV Commercial Script</h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Script</>}
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{script}</pre>
                </div>

                {/* Post-tool CTA */}
                <div className="mt-5 bg-violet-950/40 border border-violet-800/30 rounded-xl p-5 text-center">
                  <p className="text-white font-bold text-sm mb-1">Ready to turn this into a real TV ad?</p>
                  <p className="text-slate-400 text-xs mb-4">Our team will produce your commercial and launch it on Hulu, Roku, and 30+ streaming platforms.</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <a href={createPageUrl('Book-Call')} className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all">Book a Call to Launch This Ad</a>
                    <a href={createPageUrl('Get-Started')} className="border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">Start Free Trial</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works explainer */}
      <section className="py-14 px-4 bg-slate-950 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">About This Tool</p>
          <h2 className="text-white font-extrabold text-2xl mb-4">How the TV Script Generator Works</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Our AI is trained on thousands of high-performing local TV and streaming ad scripts. It understands pacing, spoken-word delivery, and call-to-action structure for 15, 30, and 60-second formats. Every script is customized to your business name, industry, service area, and tone — not a template.
          </p>
        </div>
      </section>

      <InternalLinks heading="Related Resources" links={RELATED} />

      <PillarCTA
        heading="Want us to produce your TV ad?"
        subheading="From script to live streaming TV — we handle production, targeting, and launch."
        primaryText="Book a Strategy Call"
        primaryHref={createPageUrl('Book-Call')}
        secondaryText="See Streaming TV Plans"
        secondaryHref={createPageUrl('StreamingTvAdvertising')}
      />

      <SiteFooter />
    </div>
  );
}