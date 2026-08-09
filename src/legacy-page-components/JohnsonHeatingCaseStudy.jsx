import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import { Link } from 'react-router-dom';
import { Clock, ShieldAlert, BadgeCheck, MonitorSmartphone, Star, Video, Layers, Workflow, DollarSign } from 'lucide-react';

export default function JohnsonHeatingCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
      <SEOHead 
        title="Johnson Heating & AC Case Study | 14-Year Digital Growth | New Tech Advertising"
        description="How Johnson Heating & AC went from phone book ads to #1 in local search with AI-powered marketing. A 14-year case study in trust, automation, and structural growth."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Johnson Heating & AC Case Study | 14-Year Digital Growth",
          "description": "How Johnson Heating & AC went from phone book ads to #1 in local search with AI-powered marketing. A 14-year case study in trust, automation, and structural growth.",
          "author": {
            "@type": "Person",
            "name": "Rick Hesse"
          },
          "publisher": {
            "@type": "Organization",
            "name": "New Tech Advertising"
          }
        })
      }} />

      <MarketingNav />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Case Study</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6">
            From Phone Books to AI Reviews
          </h1>
          <p className="text-2xl font-semibold text-slate-300 mb-6 italic">
            "I Hate Tech, But My Guy Made It Easy."
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A 14-Year Case Study of Trust, Automation, and Structural Growth at Johnson Heating and AC
          </p>
        </div>
      </section>

      {/* SECTION 1 - The Challenge */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">The Challenge: A Master Craftsman in a Digital World</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              Tony Johnson is an elite, highly credentialed HVAC technician and an exceptionally principled small business owner. He stays on the absolute leading edge of physical trade technologies — Bryant climate controls, custom ductless mini-splits, and high-efficiency modern residential boiler systems. But regarding digital marketing, Tony drew a clear line: he had zero desire to learn digital logistics. He simply demanded it be executed transparently, professionally, and honestly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Clock className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Time Depletion</h3>
              <p className="text-slate-400 leading-relaxed">Daily hours belonged to fieldwork, quality assurance, and crew management with no bandwidth for algorithm adjustments or content calendars.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ShieldAlert className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Aversion to Out-of-State Agencies</h3>
              <p className="text-slate-400 leading-relaxed">Tony prioritizes regional accountability and direct handshakes, distrusting corporate marketing groups located out of state.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <BadgeCheck className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Strict Business Integrity</h3>
              <p className="text-slate-400 leading-relaxed">Operating with complete transparency, Tony refuses to use manipulative metrics or high-pressure maintenance agreements.</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/30 rounded-3xl p-10 md:p-14 text-center max-w-4xl mx-auto relative overflow-hidden">
            <p className="text-xl md:text-2xl text-blue-100 font-medium italic leading-relaxed relative z-10">
              "I wanted a local expert I could talk to directly. I didn't want to manage software or track analytics dashboards; I needed a partner who treats my company like their own and just handles the technology."
            </p>
            <p className="text-blue-400 font-bold mt-6 relative z-10">— Tony Johnson, Owner, Johnson Heating and AC</p>
          </div>
        </div>
      </section>

      {/* SECTION 2 - The Solution (Timeline) */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">The Solution: A 14-Year Orchestrated Evolution</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-blue-500/50 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-blue-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-white mb-3">Phase 1 - Architectural Independence</h3>
                <p className="text-slate-400 leading-relaxed">Designed and deployed Johnson Heating's first fully custom WordPress web presence built completely from scratch. This provided a reliable, scaleable digital home base that grew alongside his service offerings.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-blue-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-white mb-3">Phase 2 - Transitioning from Legacy Advertising</h3>
                <p className="text-slate-400 leading-relaxed">Once digital infrastructure began tracking verified local inbound inquiries, Tony executed a major budget shift: completely eliminating all legacy print ads and local phone book contracts. This saved thousands in annual capital leaks, shifting focus to high-intent web placement.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-blue-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-white mb-3">Phase 3 - Multi-Channel Visibility</h3>
                <p className="text-slate-400 leading-relaxed">Strategically engineered an introductory social media page into an omnipresent 5-channel social media ecosystem. Synchronized local directory profiles to build structured map citations, ensuring perfect NAP (Name, Address, Phone) alignment.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 - The Modern Era */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">The Modern Era: AI-Driven Optimization</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                <MonitorSmartphone className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">High-Conversion Structural Redesign</h3>
              <p className="text-slate-400 leading-relaxed">Full front-to-back engineering restructure with advanced booking functionality and seamless device rendering.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Enhanced Reputational Scale</h3>
              <p className="text-slate-400 leading-relaxed">Automated review generation architecture on Google securing top-rated positioning in regional map packs with AI summaries highlighting core values.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                <Video className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Education-Driven Domain Authority</h3>
              <p className="text-slate-400 leading-relaxed">On-demand video directory of technical tips positioning the brand as the immediate authority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - Proactive Efficiency */}
      <section className="py-20 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Proactive Efficiency: Auditing the Back-Office</h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Many trade enterprises navigate hidden "software bloat" — paying for disconnected web tools, dispatch software licenses, and separate invoicing (QuickBooks, legacy field apps) that accumulate to over $8,000 in annual licensing costs.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                By bringing these functions under one umbrella, we simplified the operational workflow while drastically reducing software expenses.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <Layers className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Unified Backend Framework</h3>
                  <p className="text-slate-400 leading-relaxed">Centralized AI-driven All-in-One Operating System linking all core business operations.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <Workflow className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Eliminating Friction</h3>
                  <p className="text-slate-400 leading-relaxed">Unifying customer dispatch, mobile invoicing, scheduling, and CRM into a single dashboard.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Eliminating Overhead</h3>
                  <p className="text-slate-400 leading-relaxed">Replacing $8,000/year in platform costs with a fully managed system requiring zero internal staff training.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-blue-900 border-t border-blue-800 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-6">Ready to delegate the tech headaches?</h2>
          <p className="text-xl text-blue-200 mb-10">Let's structure your company's custom digital engine.</p>
          <Link to="/book-call" className="inline-flex items-center justify-center bg-white text-blue-900 hover:bg-slate-100 font-bold px-10 py-5 rounded-xl transition-all shadow-xl text-lg mb-8">
            Book a Call
          </Link>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-300 font-medium">
            <a href="tel:6414208816" className="hover:text-white transition-colors">641-420-8816</a>
            <span className="hidden sm:block text-blue-500">•</span>
            <a href="mailto:info@newtechadvertising.com" className="hover:text-white transition-colors">info@newtechadvertising.com</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}