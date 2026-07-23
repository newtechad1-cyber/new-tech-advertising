import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, FolderKanban } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import ProblemSection from '../components/home-conversion/ProblemSection';
import SolutionSection from '../components/home-conversion/SolutionSection';
import FounderSection from '../components/home-conversion/FounderSection';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import FAQSection from '../components/home-conversion/FAQSection';

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead
        title="Practical AI and Growth Systems for Small Business | NTA"
        description="New Tech Advertising helps local businesses strengthen their foundation, get found, build trust, improve follow-up, and grow through practical systems and AI."
      />
      <MarketingNav />

      <main>
        <HeroSection />
        <ProblemSection />

        <section className="py-20 px-6 bg-slate-950 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-5">
                The NTA Digital Growth Office™
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
                Bring the important parts of your business into one practical system.
              </h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                NTA connects the parts that influence growth so your website, customer relationships, business knowledge, everyday work, and practical AI support move in the same direction.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-5">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Growth Foundation</h3>
                <p className="text-slate-400 leading-relaxed">
                  Website, visibility, content, reviews, and the information customers need to choose your business confidently.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
                <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-5">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Customer Relationships</h3>
                <p className="text-slate-400 leading-relaxed">
                  Lead capture, customer information, communication, follow-up, referrals, and long-term relationship building.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
                <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-5">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Connected Operations</h3>
                <p className="text-slate-400 leading-relaxed">
                  Business knowledge, tasks, reporting, useful automation, and practical AI assistance built around how you work.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-slate-300 font-medium mb-6">
                We build the right pieces in the right order—not another disconnected package.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/growth-conversation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  Start a Growth Conversation <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/free-audit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-slate-700"
                >
                  Take the Free Business Gap Audit <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-sm text-slate-500 mt-4 max-w-2xl mx-auto">
                The free audit provides a useful first-pass assessment. A deeper paid diagnostic is available only when more evidence and a detailed roadmap would help.
              </p>
            </div>
          </div>
        </section>

        <SolutionSection />
        <FounderSection />
        <CombinedReviewsSection />

        <section className="py-16 bg-slate-900/50 border-y border-slate-800/50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Want to understand the thinking behind NTA?</h2>
            <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              The NTA Point of View explains the business experience, principles, and practical approach behind the systems we build.
            </p>
            <Link
              to="/point-of-view"
              className="inline-flex items-center gap-2 px-7 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700"
            >
              Explore the NTA Point of View <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <FAQSection />
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is the NTA Growth Conversation?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The NTA Growth Conversation is a free discovery process that helps us understand your goals, what is happening now, and what you are ready to change. We confirm what we heard before recommending next steps.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the free Business Gap Audit?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The free Business Gap Audit is a first-pass assessment that helps identify visible gaps, immediate priorities, and useful next steps. When a business needs deeper evidence, analysis, and a detailed Growth Roadmap, NTA may offer a separate paid deep-dive audit before implementation begins.'
                }
              },
              {
                '@type': 'Question',
                name: 'How does New Tech Advertising help a local business grow?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'NTA helps local businesses strengthen their website and growth foundation, improve visibility, build trust, strengthen customer follow-up, and connect practical AI and automation into one useful system.'
                }
              },
              {
                '@type': 'Question',
                name: 'Does New Tech Advertising serve businesses outside Iowa?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. New Tech Advertising is based in Mason City, Iowa and can work with local businesses and organizations in other parts of the United States.'
                }
              },
              {
                '@type': 'Question',
                name: 'What types of businesses does NTA work with?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'NTA primarily helps local service businesses, restaurants, retailers, contractors, and other small businesses that need clearer marketing, stronger customer relationships, better follow-up, and practical growth systems.'
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
