import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Search, TrendingUp, MonitorSmartphone, 
  Lightbulb, ShieldCheck, PlayCircle, BookOpen, Bot, LayoutTemplate
} from 'lucide-react';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCVideoCard from '@/components/learning-center/LCVideoCard';
import { LEARNING_VIDEOS, LEARNING_CATEGORIES } from '@/utils/learningData';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { cn } from '@/lib/utils';

export default function LearningCenter() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden flex flex-col">
      <MarketingNav />
      
      <main className="flex-grow">
      {/* 1. Hero Section */}
      <header className="relative pt-24 pb-20 px-6 text-center border-b border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            <BookOpen className="w-4 h-4" />
            NTA Learning Center
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-[1.1] text-white tracking-tight">
            Practical AI Education For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Small Businesses</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-medium">
            Learn how AI is changing visibility, marketing, customer search, and business growth — without the confusion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              href="#guides"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-8 py-4 rounded-xl transition-all w-full sm:w-auto text-lg"
            >
              Explore Guides
            </a>
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] w-full sm:w-auto text-lg group"
            >
              Get A Free AI Gap Audit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://app.heygen.com/embeds/6d74ae416e5c43328e0856079bdd2a41" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; fullscreen" 
              title="Welcome to the Learning Center"
            />
          </div>

        </div>
      </header>

      {/* 2. Featured Guides Section */}
      <section id="guides" className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-4">Featured Guides</h2>
          <p className="text-slate-400 text-lg">Essential reading to understand the new digital landscape.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Card 1 */}
          <Link to="/what-changed-online" className="group relative block bg-slate-900 border border-slate-800 rounded-3xl p-8 overflow-hidden hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-colors" />
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-6">
                  Start Here
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  What Changed Online
                </h3>
                <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                  The way people find businesses has fundamentally shifted. Understand zero-click searches, AI overviews, and what to do next.
                </p>
              </div>
              <div className="mt-auto flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                Read Guide <ArrowRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </Link>

          <div className="grid grid-rows-3 gap-6">
            <GuideRowCard 
              title="AI Visibility Basics" 
              desc="How ChatGPT and Gemini choose which local businesses to recommend."
              icon={Sparkles}
              link="/ai-visibility-basics"
            />
            <GuideRowCard 
              title="Practical AI For Small Businesses" 
              desc="Real tools you can use today to save time and generate more leads."
              icon={Bot}
              link="/practical-ai-for-small-businesses"
            />
            <GuideRowCard 
              title="SEO vs AI Search" 
              desc="Why traditional SEO is dying and how AI Search Optimization replaces it."
              icon={Search}
              link="/seo-vs-ai-search"
            />
          </div>
        </div>
      </section>

      {/* 3. Learning Categories Section */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Browse By Category</h2>
            <p className="text-slate-400 text-lg">Find exactly what you need to grow your business.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            <CategoryCard title="AI Visibility & Search" icon={Search} link="/learning-center/category/ai-visibility-search" />
            <CategoryCard title="Digital Trust & Reputation" icon={ShieldCheck} link="/learning-center/category/digital-trust-reputation" />
            <CategoryCard title="Modern Marketing Systems" icon={LayoutTemplate} link="/learning-center/category/modern-marketing-systems" />
            <CategoryCard title="Video & CTV Marketing" icon={MonitorSmartphone} link="/learning-center/category/video-ctv-marketing" />
            <CategoryCard title="AI Basics For Small Businesses" icon={Lightbulb} link="/learning-center/category/ai-basics-small-businesses" />
          </div>
        </div>
      </section>

      {/* 4. Why This Matters Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Why Should Local Businesses Care About AI?
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              The internet isn't what it was even a year ago. Customers don't browse websites the same way, and they don't search the same way. If your marketing hasn't adapted, you are becoming invisible.
            </p>
            <div className="space-y-6">
              <MatterItem 
                title="AI is Changing Search" 
                desc="Customers ask AI for answers, not links. If your business data isn't structured for AI, you won't be recommended."
              />
              <MatterItem 
                title="Customer Behavior is Changing" 
                desc="People expect immediate, accurate answers without clicking through 5 different pages on your website."
              />
              <MatterItem 
                title="Websites Alone Are No Longer Enough" 
                desc="An outdated 'brochure' website is a liability. Your digital presence must actively build trust and feed AI engines."
              />
              <MatterItem 
                title="Trust is the Ultimate Currency" 
                desc="With infinite choices, customers choose the business that looks the most credible, active, and authoritative."
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-3xl rounded-full" />
            <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
                <div>
                  <h4 className="text-white font-bold text-lg">The NTA Approach</h4>
                  <p className="text-slate-400 text-sm">Education over hype. Results over vanity metrics.</p>
                </div>
              </div>
              <p className="text-slate-300 italic text-lg leading-relaxed">
                "We built this learning center because small businesses are being sold snake oil by agencies using 'AI' as a buzzword. We want to show you exactly how it actually works, and how to use it practically to get more customers."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Watch + Learn Section */}
      <section className="bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
                <PlayCircle className="w-3.5 h-3.5" />
                Featured Video
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Watch + Learn</h2>
              <p className="text-slate-400 text-lg">Quick, actionable video training on modern visibility.</p>
            </div>
            <Link to="/learning-center/videos" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold gap-2 transition-colors pb-1">
              View All Videos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_VIDEOS.slice(0, 3).map(video => (
              <LCVideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Real Business Examples */}
      <section className="bg-slate-900 border-y border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Real Business Examples</h2>
            <p className="text-slate-400 text-lg">See how practical AI and modern visibility strategies work in the real world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExampleCard 
              name="Johnson Heating & AC" 
              industry="HVAC"
              insight="Dominating local 'near me' AI recommendations through granular service pages and structured review density."
            />
            <ExampleCard 
              name="Monson Plumbing" 
              industry="Home Services"
              insight="Captured 40% more emergency calls by optimizing their GBP for zero-click searches instead of just website clicks."
            />
            <ExampleCard 
              name="Papa Everett’s Pizza" 
              industry="Restaurant"
              insight="Using automated AI review management to build a massive trust moat against local competitors."
            />
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <LCCallToAction 
          type="ai_visibility"
          title="Want To See How Your Business Appears In AI Search?"
          description="Get a comprehensive look at how ChatGPT, Gemini, and Google view your business right now. It's completely free and highly actionable."
          buttonText="Get Your Free AI Audit"
        />
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}

// Subcomponents

function GuideRowCard({ title, desc, icon: IconComponent, link = "#" }) {
  return (
    <Link to={link} className="group flex items-start sm:items-center gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors h-full">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-blue-400" />
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}

function CategoryCard({ title, icon: IconComponent, link = "#" }) {
  return (
    <Link to={link} className="group flex flex-col items-center text-center bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_rgba(37,99,235,0.3)] hover:border-blue-500/30">
      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
        <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
      </div>
      <h3 className="text-white font-bold text-base sm:text-lg">{title}</h3>
    </Link>
  );
}

function MatterItem({ title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
      </div>
      <div>
        <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ExampleCard({ name, industry, insight }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-colors flex flex-col h-full">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{industry}</span>
      <h3 className="text-xl font-bold text-white mb-4">{name}</h3>
      <p className="text-slate-400 leading-relaxed flex-1">"{insight}"</p>
      <div className="mt-6 pt-6 border-t border-slate-800">
        <Link to="#" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 group">
          <PlayCircle className="w-4 h-4 mr-2 group-hover:text-blue-300" />
          View Case Study
        </Link>
      </div>
    </div>
  );
}