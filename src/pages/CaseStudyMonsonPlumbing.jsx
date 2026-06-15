import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { ArrowRight, ArrowLeft, CheckCircle2, Globe, Wrench, Search, Star, Phone, Users } from 'lucide-react';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

export default function CaseStudyMonsonPlumbing() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="Monson Plumbing Case Study | NTA"
        description="How a multi-generation Mason City plumbing company went from zero online presence to dominant local visibility with a full digital rebuild."
      />
      <MarketingNav />
      <div className="flex-grow pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-6">
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/learning-center" className="hover:text-white transition-colors">Learning Center</Link>
            <span>›</span>
            <span className="text-slate-300">Monson Plumbing</span>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-purple-400 font-bold uppercase tracking-wider">Show Me Real Results</span>
              <span className="text-slate-400 font-medium">Step 2 of 5</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }} />
            </div>
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Monson Plumbing, Heating & Excavating — From Zero to Dominant Online
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              How a multi-generation Mason City plumbing company went from almost no digital footprint to a professional online presence that generates calls.
            </p>
          </header>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { value: 'Multi-Gen', label: 'Family business legacy', icon: Users },
              { value: 'Full Rebuild', label: 'Website + marketing system', icon: Globe },
              { value: 'Mason City', label: 'Dominant local presence', icon: Search },
              { value: '3 Services', label: 'Plumbing, heating, excavating', icon: Wrench },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* The Challenge */}
          <article className="prose prose-invert prose-lg max-w-none prose-a:text-purple-400 hover:prose-a:text-purple-300">
            <h2 className="text-2xl font-bold text-white mt-10 mb-4">The Challenge</h2>
            <p>
              Monson Plumbing, Heating & Excavating has served the Mason City area for generations. Jay Monson runs the kind of business that gets recommended at the hardware store and trusted by neighbors — but that reputation lived almost entirely offline. When NTA started working with Monson Plumbing, they were starting from near zero online.
            </p>
            <p>
              The problems were common for established trade businesses:
            </p>
            <ul className="space-y-2 text-slate-300 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> No professional website — potential customers searching online couldn't find them</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> Younger homeowners defaulting to Google for plumber searches instead of asking neighbors</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> Competitors with websites and reviews were capturing calls that should have been Monson's</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> Three distinct service lines (plumbing, heating, excavating) with no way to showcase all of them</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">What We Built Together</h2>
            <p>
              NTA didn't just build Monson Plumbing a website — we built a complete digital presence from scratch, designed to match the quality of their real-world reputation.
            </p>
          </article>

          {/* What We Built — Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {[
              {
                icon: Globe,
                title: 'Professional Website',
                description: 'monsonplumbing.com — a clean, fast, mobile-first website that clearly communicates all three service lines. Built with structured data so AI search engines can understand and recommend the business.',
              },
              {
                icon: Search,
                title: 'AI Search Optimization',
                description: 'Optimized for both traditional Google search and AI-powered recommendations. When someone asks ChatGPT or Google AI for a plumber in Mason City, Monson shows up.',
              },
              {
                icon: Star,
                title: 'Local Reputation Building',
                description: 'Google Business Profile optimization, review collection strategy, and consistent business information across every platform — building the trust signals that matter most.',
              },
              {
                icon: Phone,
                title: 'Consistent Content Strategy',
                description: 'Regular social media presence and educational content that keeps Monson Plumbing visible between emergency calls. When someone needs a plumber, they already know the name.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-a:text-purple-400 hover:prose-a:text-purple-300">
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Transformation</h2>
            <p>
              The difference between "before NTA" and "after NTA" for Monson Plumbing is night and day:
            </p>
          </article>

          {/* Before/After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-rose-500">Before</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• No website at all</li>
                <li>• Invisible to online searches</li>
                <li>• Relied entirely on word-of-mouth</li>
                <li>• No reviews visible online</li>
                <li>• Younger customers couldn't find them</li>
                <li>• Three service lines with no visibility</li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-500">After</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Professional website showcasing all services</li>
                <li>• Shows up in local search results</li>
                <li>• Word-of-mouth now reinforced by digital presence</li>
                <li>• Growing online review profile</li>
                <li>• Website converts visitors into calls</li>
                <li>• AI search engines recommend the business</li>
              </ul>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3 my-8">
            {[
              'Went from zero online presence to a professional, AI-optimized website that ranks locally',
              'All three service lines (plumbing, heating, excavating) clearly presented and searchable',
              'Google Business Profile optimized and actively generating visibility',
              'Consistent content strategy keeps the business top-of-mind in the community',
              'Digital presence now matches the quality of their real-world reputation',
              'New customer acquisition channel that didn\'t exist before — online search',
            ].map((result, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-900/50 border border-slate-800/50 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm leading-relaxed">{result}</span>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-a:text-purple-400 hover:prose-a:text-purple-300">
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Why It Works</h2>
            <p>
              Monson Plumbing proves that it's never too late to build a real online presence. Even a business with zero digital footprint can become the dominant local option — if the system is built right. The key wasn't spending a fortune on ads. It was building a <em>foundation</em>: a website that converts, content that builds trust, and a consistent presence that keeps them visible.
            </p>
            <p>
              For trade businesses especially, the bar online is still low. Most plumbers, electricians, and HVAC companies have mediocre websites and inconsistent information. Building a genuinely professional digital presence creates an immediate competitive advantage — and it compounds over time.
            </p>

            <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 my-10 not-prose">
              <p className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-2">The Takeaway</p>
              <p className="text-white text-lg font-medium leading-relaxed">
                A multi-generation plumbing company went from invisible online to the dominant digital presence in Mason City — not by outspending competitors, but by building a professional system from the ground up.
              </p>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Starting From Scratch?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">Get a free AI visibility audit to see exactly where your business stands — even if you don't have a website yet.</p>
            <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
              Get Your Free AI Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col">
            <Link to="/case-study/johnson-heating" className="text-slate-400 hover:text-white font-medium mb-4 flex items-center gap-1 transition-colors self-start">
              <ArrowLeft className="w-4 h-4" /> Previous: Johnson Heating & AC
            </Link>
            <Link to="/case-study/papa-everetts" className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
              Next: Papa Everett's Pizza <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </main>
        
        <LCRelatedArticles 
          articles={[
            {
              tag: "Websites",
              title: "Websites as Salespeople",
              description: "Your website should be your best salesperson, not a digital brochure.",
              link: "/websites-as-salespeople",
              date: "Guide"
            },
            {
              tag: "Reputation",
              title: "Reputation Is Now a Growth Engine",
              description: "How reviews and trust signals drive real business growth.",
              link: "/reputation-is-now-a-growth-engine",
              date: "Guide"
            },
            {
              tag: "Trust",
              title: "Building Digital Trust",
              description: "How to build the kind of online presence that converts visitors into customers.",
              link: "/building-digital-trust",
              date: "Guide"
            }
          ]}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
