import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, Wrench, Monitor, Star, Phone, Video, Search } from 'lucide-react';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

export default function CaseStudyJohnsonHeating() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="Johnson Heating & AC Case Study | NTA"
        description="How a Mason City HVAC company maintained #1 local visibility for 14 years with AI-powered marketing and a custom back-office system."
      />
      <MarketingNav />
      <div className="flex-grow pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-6">
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/learning-center" className="hover:text-white transition-colors">Learning Center</Link>
            <span>›</span>
            <span className="text-slate-300">Johnson Heating & AC</span>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-purple-400 font-bold uppercase tracking-wider">Show Me Real Results</span>
              <span className="text-slate-400 font-medium">Step 1 of 5</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Johnson Heating & AC — 14 Years of Consistent Growth
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              How a Mason City HVAC company built and maintained #1 local visibility — and replaced expensive business software with a custom AI-powered back-office system.
            </p>
          </header>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { value: '14 Years', label: 'NTA client since 2012', icon: TrendingUp },
              { value: '#1', label: 'HVAC visibility in Mason City', icon: Search },
              { value: 'Full Stack', label: 'Marketing + back-office AI', icon: Monitor },
              { value: '$1,000s Saved', label: 'Software costs eliminated', icon: Star },
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
              Tony Johnson has been running Johnson Heating & AC in Mason City, Iowa for over a decade. Like many established local service businesses, Johnson Heating built its reputation on word-of-mouth and quality work. But as marketing shifted online — and then shifted again to AI-driven search — simply being a great HVAC company wasn't enough to stay visible.
            </p>
            <p>
              The challenges were real:
            </p>
            <ul className="space-y-2 text-slate-300 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> National HVAC chains with massive ad budgets were pushing into the Mason City market</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> Paying for QuickBooks, scheduling software, and multiple disconnected tools was adding up</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> The website was functional but wasn't converting visitors into calls</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> AI search engines like ChatGPT were starting to recommend competitors</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">What We Built Together</h2>
            <p>
              Over 14 years, NTA evolved Johnson Heating's marketing system from a basic website into a fully integrated growth engine. Here's what the system looks like today:
            </p>
          </article>

          {/* What We Built — Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {[
              {
                icon: Monitor,
                title: 'AI-Optimized Website',
                description: 'johnsonheatingandac.com — rebuilt for speed, mobile-first design, and AI search visibility. Structured data helps ChatGPT and Google AI recommend Johnson Heating when customers search for HVAC in Mason City.',
              },
              {
                icon: Wrench,
                title: 'Custom Back-Office System',
                description: 'A full business management app replacing QuickBooks and multiple paid tools — dispatch scheduling, invoicing, inventory tracking, and expense management. All in one system, designed for how Tony actually runs his business.',
              },
              {
                icon: Search,
                title: 'Local SEO & AI Visibility',
                description: 'Consistent NAP data, structured business information, and educational content that signals expertise to both traditional search engines and AI recommendation systems.',
              },
              {
                icon: Video,
                title: 'Video & Social Presence',
                description: 'Regular social media content and video marketing that builds trust before a prospect ever picks up the phone. Consistent posting across Facebook, Instagram, and Google Business Profile.',
              },
              {
                icon: Star,
                title: 'Reputation Management',
                description: 'Automated review collection and monitoring that keeps Johnson Heating\'s star rating visible and fresh across Google, Facebook, and AI search results.',
              },
              {
                icon: Phone,
                title: 'Lead Generation System',
                description: 'Every piece of the system feeds into one goal: the phone rings. Website forms, click-to-call, Google Business profile, social media — all connected into a single lead pipeline.',
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
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Results</h2>
            <p>
              Johnson Heating & AC is the model for what happens when a small local business commits to a long-term marketing system instead of chasing short-term campaigns:
            </p>
          </article>

          {/* Results List */}
          <div className="space-y-3 my-8">
            {[
              'Dominant #1 HVAC visibility in the Mason City market for years running',
              'Eliminated thousands in annual software costs by replacing QuickBooks, scheduling apps, and disconnected tools with one custom system',
              'Website converts visitors to calls with clear trust signals, real reviews, and instant contact options',
              'AI search engines (ChatGPT, Google AI) actively recommend Johnson Heating for HVAC in the Mason City area',
              'Consistent social media presence builds trust before prospects ever call',
              'Back-office system handles dispatch, invoicing, inventory, and expenses — purpose-built for a small HVAC shop',
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
              The secret isn't one magic tactic — it's the <em>system</em>. Johnson Heating doesn't run isolated campaigns. Every piece connects: the website feeds leads, the content builds authority, the reviews build trust, the social media keeps them visible, and the back-office system keeps the business running smoothly. When one piece gets stronger, every other piece benefits.
            </p>
            <p>
              After 14 years, the compounding effect is massive. Johnson Heating didn't get to #1 overnight — they built it steadily, month after month, with a partner who understands that real marketing is infrastructure, not advertising.
            </p>

            <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 my-10 not-prose">
              <p className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-2">The Takeaway</p>
              <p className="text-white text-lg font-medium leading-relaxed">
                A 14-year HVAC company in Mason City competes with national chains — not by outspending them, but by building a connected marketing system that works 24/7 and a back-office that saves thousands in software costs.
              </p>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Want Results Like This?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">Get a free AI visibility audit to see exactly where your business stands — and what a connected marketing system could do for you.</p>
            <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
              Get Your Free AI Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col">
            <Link to="/case-study/monson-plumbing" className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
              Next: Monson Plumbing Case Study <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </main>
        
        <LCRelatedArticles 
          articles={[
            {
              tag: "Visibility",
              title: "AI Visibility Basics",
              description: "How ChatGPT and Gemini choose which local businesses to recommend.",
              link: "/ai-visibility-basics",
              date: "Guide"
            },
            {
              tag: "Systems",
              title: "Growth Systems vs Campaigns",
              description: "Why systems outperform one-off campaigns every time.",
              link: "/growth-systems-vs-campaigns",
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
