import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp, UserCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TrialHeader from '../components/trial/TrialHeader';
import TrialStatusBar from '../components/trial/TrialStatusBar';
import { createPageUrl } from '@/utils';

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
        <span className="font-semibold text-slate-800">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</div>}
    </div>
  );
}

export default function TrialSlug() {
  const { slug } = useParams();
  const [account, setAccount] = useState(null);
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const accounts = await base44.entities.TrialAccount.filter({ slug });
        if (!accounts.length) { setNotFound(true); setLoading(false); return; }
        const acct = accounts[0];
        setAccount(acct);
        const landings = await base44.entities.PortalLanding.filter({ account_id: acct.id });
        if (landings.length) setLanding(landings[0]);
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-6">This trial link doesn't exist or has expired.</p>
        <Link to="/start"><Button className="bg-blue-600 hover:bg-blue-700">Start a New Trial</Button></Link>
      </div>
    </div>
  );

  const s = landing?.sections_json || {};
  const features = s.features?.items || [];
  const testimonials = s.testimonials?.items || [];
  const faq = s.faq?.items || [];
  const steps = s.how_it_works?.steps || [];
  const whatToExpect = s.what_to_expect?.items || [];
  const finalCTA = s.final_cta || {};
  const businessName = account.name;
  const onboardingPath = `/start/${slug}/onboarding`;

  const showOnboarding = ['submitted', 'draft'].includes(account.trial_status);

  return (
    <div className="bg-white">
      <TrialHeader slug={slug} ctaLabel={showOnboarding ? "Complete Your Onboarding" : "Start My 7-Day Free Trial"} />

      {/* Hero */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-blue-500/20 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-400/30">
            Welcome, {businessName}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {landing?.headline || "This Is Where the Work Gets Done"}
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your trial account has been created. Complete your onboarding and we'll have everything configured within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {showOnboarding ? (
              <Link to={onboardingPath}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 font-bold shadow-xl">
                  Complete Your Onboarding →
                </Button>
              </Link>
            ) : (
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 font-bold shadow-xl">
                  Go to Your Dashboard →
                </Button>
              </Link>
            )}
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 gap-2 bg-transparent">
                <UserCircle className="w-5 h-5" /> Existing Client Sign In
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            {(landing?.hero_bullets || ['No credit card required', 'Full platform access', 'Cancel anytime']).map(b => (
              <span key={b} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <section className="py-10 bg-blue-50 border-b border-blue-100">
        <div className="max-w-2xl mx-auto px-6">
          <TrialStatusBar status={account.trial_status} />
          {showOnboarding && (
            <div className="mt-5 text-center">
              <Link to={onboardingPath}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  Complete Your Brand Info →
                </Button>
              </Link>
              <p className="text-xs text-slate-400 mt-2">Takes about 5 minutes. We'll handle the rest.</p>
            </div>
          )}
        </div>
      </section>

      {/* What Makes This Different */}
      {s.what_makes_different && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{s.what_makes_different.heading}</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">{s.what_makes_different.body}</p>
              </div>
              <div className="space-y-3">
                {(s.what_makes_different.bullets || []).map(b => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">{s.features.heading}</h2>
              <p className="text-lg text-slate-500">{s.features.subheading}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(f => (
                <div key={f.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What to Expect */}
      {whatToExpect.length > 0 && (
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">{s.what_to_expect?.heading}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {whatToExpect.map(item => (
                <div key={item.heading} className="bg-white/10 border border-white/20 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-2">{item.heading}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {steps.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{s.how_it_works?.heading}</h2>
            <div className="space-y-8">
              {steps.map(step => (
                <div key={step.number} className="flex gap-6 items-start">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">{step.number}</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Step {step.number} — {step.title}</h3>
                    <p className="text-slate-600 mb-1">{step.body}</p>
                    <p className="text-sm text-blue-600 font-medium">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{s.testimonials?.heading}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map(t => (
                <div key={t.author} className="bg-white rounded-xl p-6 border border-slate-200">
                  <p className="text-lg text-slate-800 italic mb-3">"{t.quote}"</p>
                  <p className="text-slate-500 text-sm mb-4">{t.detail}</p>
                  <p className="font-semibold text-slate-900">— {t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">{s.faq?.heading}</h2>
            <div className="space-y-3">
              {faq.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{finalCTA.heading || "Your account will be ready tomorrow."}</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">{finalCTA.body || ''}</p>
          {(finalCTA.bullets || []).length > 0 && (
            <div className="flex flex-wrap justify-center gap-5 mb-10 text-sm text-blue-100">
              {finalCTA.bullets.map(b => (
                <span key={b} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-300" />{b}</span>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showOnboarding ? (
              <Link to={onboardingPath}>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 font-bold">
                  Complete Your Onboarding →
                </Button>
              </Link>
            ) : (
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 font-bold">
                  Go to Your Dashboard →
                </Button>
              </Link>
            )}
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent gap-2">
                <UserCircle className="w-5 h-5" /> Existing Client Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-3">New Tech Advertising</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{s.footer?.tagline || ''}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/start" className="hover:text-blue-400 transition-colors">Start Free Trial</Link></li>
              <li><Link to={createPageUrl('Dashboard')} className="hover:text-blue-400 transition-colors">Client Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to={createPageUrl('Contact')} className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
              <li><Link to={createPageUrl('PrivacyPolicy')} className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to={createPageUrl('TermsOfService')} className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} New Tech Advertising. All rights reserved.
        </div>
      </footer>
    </div>
  );
}