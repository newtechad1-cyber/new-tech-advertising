import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Search, TrendingUp, MonitorSmartphone, 
  Lightbulb, ShieldCheck, PlayCircle, BookOpen, Bot, LayoutTemplate
} from 'lucide-react';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCVideoCard from '@/components/learning-center/LCVideoCard';
import LCAIFaqSection from '@/components/learning-center/LCAIFaqSection';
import { useLearningContent } from '@/hooks/useLearningContent';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { cn } from '@/lib/utils';
import SEOHead from '@/components/shared/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function LearningCenter() {
  const { data, isLoading } = useLearningContent();
  const videos = data?.videos || [];

  const { data: blogPosts } = useQuery({
    queryKey: ['learningCenterBlogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-published_date', 6)
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden flex flex-col">
      <SEOHead 
        title="AI Learning Center | New Tech Advertising"
        description="Free marketing resources, guides & videos for small business owners. Learn about AI search optimization, social media, Google Business & more."
      />
      <MarketingNav />
      
      <main className="flex-grow">
      {/* 1. Hero Section */}
      <header className="relative pt-24 pb-20 px-6 text-center border-b border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            <BookOpen className="w-4 h-4" />
            NTA AI Learning Center
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

      {/* 2. Learning Paths Section */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Growth Guide Prompt */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-16 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden">
                  <img src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png" alt="Growth Guide" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Not sure where to start?</h3>
                  <p className="text-slate-400">Ask the Growth Guide — it'll recommend the right track based on your business.</p>
                </div>
              </div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-nta-guide'))}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all whitespace-nowrap"
              >
                Ask the Growth Guide <Bot className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Choose Your Learning Path</h2>
            <p className="text-slate-400 text-lg">Pick the track that fits where you are. Each one builds on the last — just follow the steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Start Here */}
            <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)] transition-all">
              <div className="h-2 w-full bg-emerald-500" />
              <div className="p-8 flex-grow flex flex-col">
                <div className="text-4xl mb-4">🟢</div>
                <h3 className="text-2xl font-bold text-white mb-2">I'm New to AI — Start Here</h3>
                <p className="text-emerald-400 font-semibold text-sm mb-4">5 guides · ~25 min</p>
                <p className="text-slate-400 mb-8 flex-grow">Understand what changed, how AI search works, and what tools actually matter for your business.</p>
                
                <div className="space-y-4 mb-8">
                  <PathLink num="1" title="What Changed Online" to="/what-changed-online" color="emerald" />
                  <PathLink num="2" title="AI Visibility Basics" to="/ai-visibility-basics" color="emerald" />
                  <PathLink num="3" title="SEO vs AI Search" to="/seo-vs-ai-search" color="emerald" />
                  <PathLink num="4" title="Practical AI For Small Businesses" to="/practical-ai-for-small-businesses" color="emerald" />
                  <PathLink num="5" title="The Role of AI in Local Marketing" to="/role-of-ai-in-local-marketing" color="emerald" />
                </div>
                
                <Link to="/what-changed-online" className="mt-auto block w-full text-center bg-slate-900 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-semibold py-3 rounded-xl transition-colors">
                  Start Track →
                </Link>
              </div>
            </div>

            {/* Card 2: Fix My Marketing */}
            <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] transition-all">
              <div className="h-2 w-full bg-blue-500" />
              <div className="p-8 flex-grow flex flex-col">
                <div className="text-4xl mb-4">🔵</div>
                <h3 className="text-2xl font-bold text-white mb-2">Fix My Marketing</h3>
                <p className="text-blue-400 font-semibold text-sm mb-4">6 guides · ~30 min</p>
                <p className="text-slate-400 mb-8 flex-grow">Stop wasting money on campaigns that don't work. Build systems that generate leads on autopilot.</p>
                
                <div className="space-y-4 mb-8">
                  <PathLink num="1" title="Growth Systems vs Campaigns" to="/growth-systems-vs-campaigns" color="blue" />
                  <PathLink num="2" title="Websites as Salespeople" to="/websites-as-salespeople" color="blue" />
                  <PathLink num="3" title="Reputation is Now a Growth Engine" to="/reputation-is-now-a-growth-engine" color="blue" />
                  <PathLink num="4" title="Building Digital Trust" to="/building-digital-trust" color="blue" />
                  <PathLink num="5" title="Campaigns vs Authority" to="/campaigns-vs-authority" color="blue" />
                  <PathLink num="6" title="The Hidden Cost of Outdated Marketing" to="/hidden-cost-of-outdated-marketing" color="blue" />
                </div>
                
                <Link to="/growth-systems-vs-campaigns" className="mt-auto block w-full text-center bg-slate-900 hover:bg-blue-900/30 text-blue-400 border border-blue-500/30 font-semibold py-3 rounded-xl transition-colors">
                  Start Track →
                </Link>
              </div>
            </div>

            {/* Card 3: Show Me Real Results */}
            <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] transition-all">
              <div className="h-2 w-full bg-purple-500" />
              <div className="p-8 flex-grow flex flex-col">
                <div className="text-4xl mb-4">🟣</div>
                <h3 className="text-2xl font-bold text-white mb-2">Show Me Real Results</h3>
                <p className="text-purple-400 font-semibold text-sm mb-4">5 stories · ~20 min</p>
                <p className="text-slate-400 mb-8 flex-grow">See how real local businesses in North Iowa transformed their marketing with NTA.</p>
                
                <div className="space-y-4 mb-8">
                  <PathLink num="1" title="Johnson Heating & AC Case Study" to="/case-study/johnson-heating" color="purple" />
                  <PathLink num="2" title="Monson Plumbing Case Study" to="/case-study/monson-plumbing" color="purple" />
                  <PathLink num="3" title="Papa Everett's Pizza Case Study" to="/case-study/papa-everetts" color="purple" />
                  <PathLink num="4" title="Founder's Story" to="/i-was-early-again" color="purple" />
                  <PathLink num="5" title="Video Storytelling Builds Confidence" to="/video-storytelling-builds-confidence" color="purple" />
                </div>
                
                <Link to="/case-study/johnson-heating" className="mt-auto block w-full text-center bg-slate-900 hover:bg-purple-900/30 text-purple-400 border border-purple-500/30 font-semibold py-3 rounded-xl transition-colors">
                  Start Track →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Guides Section */}
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

        <div className="mt-12 mb-6">
          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/MsiyOAZrCNo" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              title="I Was Early Again: Why I Built North Iowa's First AI Marketing Agency" 
            />
          </div>
        </div>

        <div className="mt-6">
          <Link to="/i-was-early-again" className="group relative block bg-slate-900 border border-slate-800 rounded-3xl p-8 overflow-hidden hover:border-indigo-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full group-hover:bg-indigo-600/10 transition-colors" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 h-full">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-4">
                  Founder's Story
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  I Was Early Again: Why I Built North Iowa's First AI Marketing Agency
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg max-w-3xl">
                  Why Rick Hesse built New Tech Advertising. A story about seeing technology early, from QR codes to AI, and why small businesses in North Iowa need to act now.
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center text-indigo-500 font-semibold group-hover:gap-2 transition-all">
                Read Story <ArrowRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </Link>
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
               "We built this AI learning center because small businesses are being sold snake oil by agencies using 'AI' as a buzzword. We want to show you exactly how it actually works, and how to use it practically to get more customers."
              </p>
            </div>
          </div>
        </div>
      </section>

      <LCAIFaqSection />

      {/* Latest from the Blog Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Latest from the Blog</h2>
            <p className="text-slate-400 text-lg">Deeper dives on specific industries, tools, and strategies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts?.map(post => (
              <Link key={post.id} to={`/blogpost?slug=${post.slug || post.id}`} className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] transition-all h-full">
                <div className="w-full aspect-[16/9] bg-slate-900 relative">
                  {post.category && (
                    <span className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      {post.category}
                    </span>
                  )}
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <LayoutTemplate className="w-10 h-10 text-slate-700" />
                    </div>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6 flex-grow line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto inline-flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/Blog" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-8 py-4 rounded-xl transition-all text-lg">
              View All Articles <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Watch + Learn Section */}
      <section id="videos" className="bg-slate-950 py-24">
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
            {isLoading ? (
              <p className="text-slate-400">Loading videos...</p>
            ) : (
              videos.slice(0, 3).map(video => (
                <LCVideoCard key={video.id} video={video} />
              ))
            )}
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
              link="/case-study/johnson-heating"
            />
            <ExampleCard 
              name="Monson Plumbing" 
              industry="Home Services"
              insight="Captured 40% more emergency calls by optimizing their GBP for zero-click searches instead of just website clicks."
              link="/case-study/monson-plumbing"
            />
            <ExampleCard 
              name="Papa Everett’s Pizza" 
              industry="Restaurant"
              insight="Using automated AI review management to build a massive trust moat against local competitors."
              link="/case-study/papa-everetts"
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

function PathLink({ num, title, to, color }) {
  const colorClass = 
    color === 'emerald' ? 'text-emerald-400 group-hover:text-emerald-300 bg-emerald-500/10' :
    color === 'blue' ? 'text-blue-400 group-hover:text-blue-300 bg-blue-500/10' :
    'text-purple-400 group-hover:text-purple-300 bg-purple-500/10';

  return (
    <Link to={to} className="group flex items-start gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${colorClass}`}>
        {num}
      </div>
      <span className="text-slate-300 group-hover:text-white transition-colors text-sm leading-snug">{title}</span>
    </Link>
  );
}

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

function TopicList({ title, icon: IconComponent, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-blue-400">
          <IconComponent className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-4">
        {children}
      </ul>
    </div>
  );
}

function TopicLink({ title, to }) {
  return (
    <li>
      <Link to={to} className="group flex items-start gap-3 text-slate-400 hover:text-blue-400 transition-colors">
        <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-600 group-hover:text-blue-400" />
        <span className="leading-snug">{title}</span>
      </Link>
    </li>
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

function ExampleCard({ name, industry, insight, link = "#" }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-colors flex flex-col h-full">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{industry}</span>
      <h3 className="text-xl font-bold text-white mb-4">{name}</h3>
      <p className="text-slate-400 leading-relaxed flex-1">"{insight}"</p>
      <div className="mt-6 pt-6 border-t border-slate-800">
        <Link to={link} className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 group">
          <PlayCircle className="w-4 h-4 mr-2 group-hover:text-blue-300" />
          View Case Study
        </Link>
      </div>
    </div>
  );
}