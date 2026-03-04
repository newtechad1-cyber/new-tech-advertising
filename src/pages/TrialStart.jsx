import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp, UserCircle, Loader2 } from 'lucide-react';
import TrialHeader from '../components/trial/TrialHeader';
import TrialSignupModal from '../components/trial/TrialSignupModal';
import LiveDashboardPreview from '../components/marketing/LiveDashboardPreview';
import MobileStickyBar from '../components/marketing/MobileStickyBar';
import PersonalizedWelcome from '../components/marketing/PersonalizedWelcome';
import TrialStatusBar from '../components/marketing/TrialStatusBar';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

const FAQS = [
  { q: "What exactly is included in the 7-day free trial?", a: "Full platform access — your configured dashboard, Brand DNA profile, connected social platforms, content approval queue, and a first batch of ready-to-approve content. Everything is set up for you before you log in." },
  { q: "Do I need to know how to use the software?", a: "No. We configure everything during the trial. You just log in, review your content, and approve what you want to go live. We're available if you have questions." },
  { q: "What happens after 7 days?", a: "We'll show you what ran, what performed, and walk through options. Nothing auto-bills. You decide whether to continue — no pressure, no hard sell." },
  { q: "Is this separate from what I already do with New Tech Advertising?", a: "This is the platform that powers our services. Whether you're a new or existing client, this is where your content is managed, approved, and published." },
  { q: "Who manages my account during the trial?", a: "A real person on the NTA team reviews your submission, builds your Brand DNA, and configures your dashboard. You're not on your own." },
];

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

export default function TrialStart() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white">
      <TrialHeader onCTAClick={() => setShowModal(true)} />
      <TrialSignupModal open={showModal} onClose={() => setShowModal(false)} />
      <MobileStickyBar onCTAClick={() => setShowModal(true)} />

      {/* Hero — two-column on desktop */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy + CTA */}
            <div className="text-center lg:text-left">
              <div className="inline-block bg-blue-500/20 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-400/30">
                7-Day Free Trial — No Credit Card Required
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                This Is Where the Work Gets Done
              </h1>
              <p className="text-xl text-slate-300 mb-3 leading-relaxed">
                You're one step away from your client portal.
              </p>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                You've seen what New Tech Advertising offers. This is the platform that powers it — where your content is managed, your brand is built, and your marketing actually runs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-2">
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 font-bold shadow-xl"
                >
                  Start My 7-Day Free Trial
                </Button>
                <Link to={createPageUrl('Dashboard')}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 gap-2 bg-transparent">
                    <UserCircle className="w-5 h-5" />
                    Existing Client Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-500 text-center lg:text-left mb-6">Takes 5 minutes. No credit card.</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 text-sm text-slate-400">
                {['No credit card required', 'Full platform access', 'Cancel anytime'].map(t => (
                  <span key={t} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />{t}</span>
                ))}
              </div>
            </div>
            {/* Right: dashboard preview */}
            <div className="hidden lg:block">
              <LiveDashboardPreview />
            </div>
          </div>
          {/* Mobile: preview below hero text */}
          <div className="mt-10 lg:hidden">
            <LiveDashboardPreview />
          </div>
        </div>
      </section>

      {/* 7-Day Trial Banner */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">7-Day Free Trial</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Submit your business info and we'll build your Brand DNA profile, configure your dashboard, and get your marketing pipeline running — all within your first week, free.
          </p>
          <Button onClick={() => setShowModal(true)} className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-5 font-bold">
            Start My Free Trial
          </Button>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">This isn't just a software signup</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                When you start your trial, a real person on the NTA team reviews your submission, builds your brand profile, and configures your account. You log in to something that's already working.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Your Brand DNA is built from what you tell us — your voice, your audience, your goals",
                "Content is generated around your business specifically, not generic templates",
                "Your social platforms are connected and ready to publish",
                "You can add staff or team members with their own access",
                "Every post goes through your approval before it goes live",
                "You see exactly what's scheduled, what's live, and what's performing",
              ].map(b => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Client Portal, Built Around Your Business</h2>
            <p className="text-lg text-slate-500">Everything you need to see, approve, and track your marketing — in one place.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Your Brand Dashboard", desc: "One place to see everything — scheduled posts, pending approvals, active campaigns, and performance at a glance." },
              { title: "Content Management", desc: "Review and approve every piece of content before it goes out. Or set it and let it run. You control how hands-on you want to be." },
              { title: "Team & User Access", desc: "Add staff, managers, or partners with their own logins. Everyone sees what they need to — nothing more." },
              { title: "Social Connections", desc: "Connect your Facebook, Instagram, LinkedIn, and more. Posts go out directly from the platform — no copying and pasting." },
              { title: "Reporting & Insights", desc: "Track what matters — reach, engagement, content performance. Plain-language summaries, not marketing data dumps." },
              { title: "Brand DNA Profile", desc: "Your voice, your audience, your goals — all on file so every piece of content we create sounds like you, not a template." },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Involvement Preference */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How Involved Do You Want to Be?</h2>
            <p className="text-lg text-slate-500">You set the level. We adjust to it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="border-2 border-blue-200 rounded-xl p-8">
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">Hands-On</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">You're in the Driver's Seat</h3>
              <div className="space-y-3 mb-6">
                {["Use the platform tools yourself to create and schedule", "Review content drafts and publish on your schedule", "Access templates built around your Brand DNA", "The team is available when you need a hand"].map(b => (
                  <div key={b} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" /><p className="text-slate-700 text-sm">{b}</p></div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-5 text-center">
                <p className="font-bold text-blue-900">7-Day Free Trial</p>
                <p className="text-xs text-slate-500">No credit card needed — full access for 7 days.</p>
              </div>
              <Button onClick={() => setShowModal(true)} className="w-full bg-blue-600 hover:bg-blue-700">Start My Free Trial</Button>
            </div>
            <div className="border-2 border-purple-200 rounded-xl p-8">
              <div className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full mb-4">Hands-Off</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">We Run It, You Approve It</h3>
              <div className="space-y-3 mb-6">
                {["NTA creates all content using your Brand DNA", "You get a weekly approval queue — takes minutes", "Posts go live automatically after your sign-off", "Comment & response bots handle engagement 24/7", "Monthly performance reports in plain language"].map(b => (
                  <div key={b} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><p className="text-slate-700 text-sm">{b}</p></div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic mb-5">This is a managed service. We'll walk you through everything before we start — no surprises.</p>
              <Button onClick={() => setShowModal(true)} className="w-full bg-purple-600 hover:bg-purple-700">Apply as a Prospect</Button>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm">Most clients start hands-off and stay that way. Tell us your preference when you sign up.</p>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">What to Expect from the Trial</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { h: "We configure it, you don't have to.", b: "After you submit your brand info, we do the setup. You're not paying to figure out software — you're getting a working account." },
              { h: "Your content sounds like you.", b: "Everything we create uses your Brand DNA — your tone, your audience, your offers. It doesn't sound like it came from a robot." },
              { h: "Nothing goes out without your approval.", b: "Every post hits your approval queue first. You're always in control of what represents your business." },
              { h: "No pressure at the end.", b: "When the trial ends, we'll show you results and talk options. You decide what, if anything, comes next. No auto-billing, no hard sell." },
            ].map(item => (
              <div key={item.h} className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">{item.h}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How the Trial Works</h2>
          <div className="space-y-8">
            {[
              { n: 1, title: "Submit Your Brand Info", body: "Fill out the short intake form. Tell us about your business, your customers, and what you want to achieve.", note: "Takes about 5 minutes." },
              { n: 2, title: "We Build Your Account", body: "We review your submission, build your Brand DNA profile, connect your platforms, and configure your dashboard.", note: "Done within 1 business day." },
              { n: 3, title: "You Log In and Run", body: "Your account is ready. Review your first batch of content, approve what you like, and watch it go live.", note: "We're here the whole time." },
            ].map(s => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">{s.n}</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Step {s.n} — {s.title}</h3>
                  <p className="text-slate-600 mb-1">{s.body}</p>
                  <p className="text-sm text-blue-600 font-medium">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Clients Say After Their Trial</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "I didn't realize how much was happening behind the scenes.", d: "The dashboard showed me exactly what was going out and when. Nothing fell through the cracks.", a: "Wendy Ruby" },
              { q: "It felt like having a marketing team without hiring one.", d: "I approved the content, they handled everything else.", a: "Pete Gardner" },
              { q: "Finally one place for everything.", d: "Social posts, approvals, reports — I stopped digging through emails.", a: "Tony Johnson" },
              { q: "The brand setup was spot-on from day one.", d: "They used what I submitted and the content actually sounded like me.", a: "Jay Monson" },
            ].map(t => (
              <div key={t.a} className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-lg text-slate-800 italic mb-3">"{t.q}"</p>
                <p className="text-slate-500 text-sm mb-4">{t.d}</p>
                <p className="font-semibold text-slate-900">— {t.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Questions About the Trial</h2>
          <div className="space-y-3">
            {FAQS.map(f => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your account will be ready tomorrow.</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
            Submit your business info today. We'll build your Brand DNA profile, configure your dashboard, and have everything ready within one business day — at no cost for 7 days.
          </p>
          <div className="flex flex-wrap justify-center gap-5 mb-10 text-sm text-blue-100">
            {['Brand DNA built for you', 'Ready in 1 business day', 'Full 7-day access'].map(b => (
              <span key={b} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-300" />{b}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowModal(true)} className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 font-bold">
              Start My 7-Day Free Trial
            </Button>
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent gap-2">
                <UserCircle className="w-5 h-5" /> Existing Client Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3">New Tech Advertising</h3>
            <p className="text-slate-400 text-sm leading-relaxed">The client platform behind New Tech Advertising's services — where your brand is managed, your content is created, and your marketing actually runs.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => setShowModal(true)} className="hover:text-blue-400 transition-colors">Start Free Trial</button></li>
              <li><Link to={createPageUrl('Dashboard')} className="hover:text-blue-400 transition-colors">Client Sign In</Link></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Platform Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a></li>
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