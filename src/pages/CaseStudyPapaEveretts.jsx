import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { ArrowRight, ArrowLeft, CheckCircle2, UtensilsCrossed, Video, Search, Star, Smartphone, TrendingUp } from 'lucide-react';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

export default function CaseStudyPapaEveretts() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="Papa Everett's Pizza Case Study | NTA"
        description="How a local pizza shop used AI-powered marketing to compete with national chains and become the go-to pizza spot in its market."
      />
      <MarketingNav />
      <div className="flex-grow pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-6">
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/learning-center" className="hover:text-white transition-colors">Learning Center</Link>
            <span>›</span>
            <span className="text-slate-300">Papa Everett's Pizza</span>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-purple-400 font-bold uppercase tracking-wider">Show Me Real Results</span>
              <span className="text-slate-400 font-medium">Step 3 of 5</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '60%' }} />
            </div>
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Papa Everett's Pizza — Competing with the Big Chains
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              How a local pizza shop used AI-powered marketing to stand out in the most competitive food category — and become the go-to pizza spot in its community.
            </p>
          </header>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { value: 'Local', label: 'Community-loved restaurant', icon: UtensilsCrossed },
              { value: 'AI-Powered', label: 'Modern visibility strategy', icon: Search },
              { value: 'Video First', label: 'Real content, real people', icon: Video },
              { value: 'Competitive', label: 'Beating national chains locally', icon: TrendingUp },
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
              Pizza is one of the most competitive categories in food. Papa Everett's isn't just competing with the place down the street — they're competing with Domino's, Pizza Hut, and every DoorDash listing that pops up when someone searches "pizza near me." National chains spend millions on advertising, SEO, and app development. A local pizza shop can't match that budget.
            </p>
            <p>
              But here's the thing: local restaurants have something chains never will — authenticity, community connection, and real people behind the counter. The challenge was making those advantages visible online.
            </p>
            <ul className="space-y-2 text-slate-300 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> National pizza chains dominating search results and delivery app listings</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> Customers defaulting to apps like DoorDash instead of ordering direct</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> No way to tell their story or show what makes them different online</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> Blending in with dozens of generic restaurant listings</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">What We Built Together</h2>
            <p>
              NTA built Papa Everett's a marketing system designed specifically for local restaurants — one that plays to their strengths instead of trying to compete with chains on budget.
            </p>
          </article>

          {/* What We Built — Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {[
              {
                icon: Search,
                title: 'AI-Optimized Web Presence',
                description: 'Built specifically for AI search. When someone asks ChatGPT "What\'s the best pizza in [city]?" or searches Google, Papa Everett\'s shows up with the right information, photos, and trust signals.',
              },
              {
                icon: Video,
                title: 'Video Marketing Content',
                description: 'Real video content showing real people making real food. Not stock photos — authentic behind-the-scenes and menu showcase videos that build connection before a customer ever walks in.',
              },
              {
                icon: Star,
                title: 'Local Search Dominance',
                description: 'Google Business Profile optimization, review management, and consistent local signals. When someone within 15 miles searches for pizza, Papa Everett\'s is one of the first results they see.',
              },
              {
                icon: Smartphone,
                title: 'Social Media Presence',
                description: 'Regular posting with real food photos, behind-the-scenes content, and community engagement. Building a following that chooses Papa Everett\'s because they feel like they know the people behind it.',
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
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Restaurant Advantage</h2>
            <p>
              Local restaurants have a massive untapped advantage that chains can never replicate: <em>authenticity</em>. Domino's can't show you the owner tossing dough at 5 AM. They can't tell a real story about a family business. They can't make you feel like you're supporting someone in your community.
            </p>
            <p>
              The marketing system we built for Papa Everett's amplifies those authentic advantages across every digital channel:
            </p>
          </article>

          {/* Strategy Breakdown */}
          <div className="space-y-3 my-8">
            {[
              { title: 'Story over Ads', desc: 'Video and social content tells the Papa Everett\'s story — who they are, how they make their food, why they care. This builds trust that no ad can buy.' },
              { title: 'Reviews as Social Proof', desc: 'Systematic review collection turns happy customers into marketing assets. Real reviews from real locals carry more weight than any chain\'s corporate messaging.' },
              { title: 'AI Search Visibility', desc: 'When AI tools recommend restaurants, they look for depth of information, consistency, and real customer sentiment. Papa Everett\'s is built to win those recommendations.' },
              { title: 'Community Connection', desc: 'Social media that feels like a neighbor, not a corporation. Engaging with local events, celebrating regulars, and showing the human side of the business.' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800/50 p-5 rounded-lg">
                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-a:text-purple-400 hover:prose-a:text-purple-300">
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Results</h2>
          </article>

          {/* Results List */}
          <div className="space-y-3 my-8">
            {[
              'Visible in local search results against national pizza chains with 1,000x the marketing budget',
              'AI search engines recommend Papa Everett\'s as a top local option',
              'Video content humanizes the brand — customers feel connected before they order',
              'Consistent social media presence keeps Papa Everett\'s top-of-mind in the community',
              'Google Business Profile fully optimized with up-to-date hours, menu, and photos',
              'Direct orders increase as customers find them through search instead of delivery apps',
            ].map((result, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-900/50 border border-slate-800/50 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm leading-relaxed">{result}</span>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-a:text-purple-400 hover:prose-a:text-purple-300">
            <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 my-10 not-prose">
              <p className="text-purple-300 text-sm font-semibold uppercase tracking-wider mb-2">The Takeaway</p>
              <p className="text-white text-lg font-medium leading-relaxed">
                A local pizza shop doesn't need a million-dollar ad budget to beat the chains. It needs a system that amplifies what chains can't fake: real people, real food, and a real connection to the community.
              </p>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Own a Restaurant?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">See how your restaurant appears in AI search results — and what you can do to compete with the chains in your area.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                Get Your Free AI Audit <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/restaurants" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all border border-slate-700">
                Restaurant Solutions
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col">
            <Link to="/case-study/monson-plumbing" className="text-slate-400 hover:text-white font-medium mb-4 flex items-center gap-1 transition-colors self-start">
              <ArrowLeft className="w-4 h-4" /> Previous: Monson Plumbing
            </Link>
            <Link to="/i-was-early-again" className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
              Next: Founder's Story <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </main>
        
        <LCRelatedArticles 
          articles={[
            {
              tag: "Restaurants",
              title: "Restaurant Solutions",
              description: "Marketing systems built specifically for local restaurants and food businesses.",
              link: "/restaurants",
              date: "Guide"
            },
            {
              tag: "Video",
              title: "Video Storytelling Builds Confidence",
              description: "How video content creates trust and drives real business results.",
              link: "/video-storytelling-builds-confidence",
              date: "Guide"
            },
            {
              tag: "Visibility",
              title: "AI Visibility Basics",
              description: "How ChatGPT and Gemini choose which local businesses to recommend.",
              link: "/ai-visibility-basics",
              date: "Guide"
            }
          ]}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
