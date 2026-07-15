import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Circle, PlayCircle, BookMarked, BrainCircuit, Lightbulb, Users, Target, Search } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { masterCurriculumMap, collectionsOrder } from '@/data/masterCurriculum';
import { flagshipArticleToolsVsSystem } from '@/data/flagshipArticles';
import { getJourneyMemory, resetJourneyMemory } from '@/lib/journeyMemory';

export default function KnowledgeLibrary() {
  const memory = getJourneyMemory();
  const completedLessons = memory.completedModules || [];
  
  // Calculate progress
  const completedCount = completedLessons.filter(id => typeof id === 'number').length;
  const totalLessons = 49;
  
  // Determine overall status
  const lastVisitedLessonId = memory.lastVisitedLessonId || null;
  const lastVisitedLesson = lastVisitedLessonId 
    ? masterCurriculumMap.find(l => l.lessonNumber === lastVisitedLessonId)
    : null;

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your reading progress?")) {
      resetJourneyMemory();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="NTA Knowledge Library | Understand How Businesses Really Grow"
        description="The NTA Knowledge Library is a connected learning journey for business owners. These are not ordinary blog posts. Learn principles of growth, trust, and AI."
        collectionData={{
          name: "NTA Knowledge Library",
          description: "The NTA Knowledge Library is a connected learning journey for business owners. These are not ordinary blog posts. Learn principles of growth, trust, and AI.",
          numberOfItems: 7,
          hasPart: collectionsOrder.map(col => ({
            name: col.title,
            url: `/knowledge/${col.slug}`
          }))
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-16 px-6 text-center border-b border-slate-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              The NTA Knowledge Library
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Understand How Businesses <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Really Grow</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              The NTA Knowledge Library is a connected learning journey for business owners. These are not ordinary blog posts. Each lesson helps you understand one important principle about growth, trust, relationships, advertising, artificial intelligence, and building a business that can keep learning.
            </p>

            <p className="text-sm text-slate-500 mb-10 max-w-xl mx-auto">
              You do not have to complete everything at once. Begin with the question that matters most to you, or follow the complete journey one lesson at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to={lastVisitedLesson ? lastVisitedLesson.canonicalUrl : '/knowledge/business-foundations'} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {completedCount > 0 ? (
                  <><PlayCircle className="w-5 h-5" /> Continue the Journey</>
                ) : (
                  <><PlayCircle className="w-5 h-5" /> Start the Journey</>
                )}
              </Link>
              <a 
                href="#collections" 
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <BookMarked className="w-5 h-5 text-slate-400" /> Explore the Collections
              </a>
            </div>

            {/* PROGRESS SUMMARY */}
            {completedCount > 0 && (
              <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-xl p-6 max-w-2xl mx-auto text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-white font-bold mb-1">Your Progress</h3>
                  <p className="text-sm text-slate-400">You've completed {completedCount} of {totalLessons} lessons.</p>
                  {lastVisitedLesson && (
                    <p className="text-xs text-blue-400 mt-2">
                      Last visited: {lastVisitedLesson.lessonTitle} ({lastVisitedLesson.collectionTitle})
                    </p>
                  )}
                </div>
                <div className="w-full md:w-32">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{Math.round((completedCount / totalLessons) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(completedCount / totalLessons) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* WHERE SHOULD I BEGIN */}
        <section className="py-20 px-6 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-10 text-center">Where Should I Begin?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  q: "If you want to understand NTA:", 
                  a: "Begin with Business Foundations.", 
                  link: "/knowledge/business-foundations",
                  icon: <Target className="w-5 h-5 text-indigo-400" />
                },
                { 
                  q: "If you need more consistent growth:", 
                  a: "Begin with The Truth About Business Growth.", 
                  link: "/knowledge/truth-about-business-growth",
                  icon: <Lightbulb className="w-5 h-5 text-amber-400" />
                },
                { 
                  q: "If customers are not choosing you:", 
                  a: "Begin with How Customers Decide Who to Trust.", 
                  link: "/knowledge/how-customers-decide-who-to-trust",
                  icon: <Users className="w-5 h-5 text-green-400" />
                },
                { 
                  q: "If you want better customer relationships:", 
                  a: "Begin with How Businesses Turn Trust Into Lasting Relationships.", 
                  link: "/knowledge/how-businesses-turn-trust-into-lasting-relationships",
                  icon: <CheckCircle className="w-5 h-5 text-rose-400" />
                },
                { 
                  q: "If too much knowledge depends on you:", 
                  a: "Begin with Turning What a Business Knows Into an Asset.", 
                  link: "/knowledge/turning-what-a-business-knows-into-an-asset",
                  icon: <BookOpen className="w-5 h-5 text-sky-400" />
                },
                { 
                  q: "If you want to understand AI:", 
                  a: "Begin with AI Foundations.", 
                  link: "/knowledge/ai-foundations",
                  icon: <BrainCircuit className="w-5 h-5 text-purple-400" />
                },
                { 
                  q: "If your business feels digitally disconnected:", 
                  a: "Begin with What Is Digital Trust? (Building a Business Customers Can Find and Understand).", 
                  link: "/knowledge/what-is-digital-trust",
                  icon: <Search className="w-5 h-5 text-blue-400" />
                }
              ].map((item, idx) => (
                <Link key={idx} to={item.link} className="group block p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 transition-all flex flex-col h-full">
                  <div className="mb-4 bg-slate-950 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-800">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">{item.q}</h3>
                  <p className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{item.a}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FLAGSHIP ARTICLE BANNER */}
        <section className="py-12 px-6 border-y border-slate-800 bg-slate-900/30">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">
                Featured NTA Perspective
              </span>
              <h2 className="text-3xl font-black text-white mb-4">
                {flagshipArticleToolsVsSystem.title}
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Business owners are sold advertising campaigns, AI tools, lead-generation platforms, and automation every day. But access to another tool is not the same as having a system that makes it useful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/knowledge/articles/${flagshipArticleToolsVsSystem.slug}`} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-center">
                  Read the Flagship Article
                </Link>
                {/* Secondary Button: Watch the Growth Show Episode - hidden until a real URL exists */}
                {/* <button className="border border-slate-700 bg-slate-800 text-slate-300 font-semibold px-6 py-3 rounded-xl hover:bg-slate-700 hover:text-white transition-colors text-center">Watch the Growth Show Episode</button> */}
              </div>
            </div>
            <div className="w-full md:w-1/3 flex-shrink-0 relative">
              <div className="aspect-square bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center p-8 text-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                <BrainCircuit className="w-16 h-16 text-indigo-500/50 mb-4 mx-auto" />
                <p className="text-sm font-bold text-white relative z-10 italic">"A tool gives you a capability. A system gives that capability direction."</p>
              </div>
            </div>
          </div>
        </section>

        {/* COLLECTIONS LIST */}
        <section id="collections" className="py-20 px-6 bg-slate-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white mb-4">The Complete Curriculum</h2>
              <p className="text-slate-400">Seven collections. 49 lessons. One connected system.</p>
            </div>

            <div className="space-y-6">
              {collectionsOrder.map((collection, idx) => {
                const collectionLessons = collection.lessons;
                const collCompleted = collectionLessons.filter(l => completedLessons.includes(l.id)).length;
                const isComplete = collCompleted === 7;
                
                // Next unfinished lesson
                const nextUnfinished = collectionLessons.find(l => !completedLessons.includes(l.id));

                return (
                  <div key={collection.id} className="relative group">
                    {/* Connecting line */}
                    {idx < collectionsOrder.length - 1 && (
                      <div className="absolute left-6 top-20 bottom-[-24px] w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors z-0 hidden sm:block" />
                    )}

                    <div className="relative z-10 bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                      {/* Number circle */}
                      <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-black text-lg border-2 ${isComplete ? 'bg-blue-600 border-blue-500 text-white' : collCompleted > 0 ? 'bg-slate-800 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                        {collection.id}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {collection.title}
                          </h3>
                          {isComplete && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-400 leading-relaxed mb-6">
                          {collection.description}
                        </p>

                        {/* Progress and actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/50 pt-6">
                          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <span>7 lessons</span>
                            <span>•</span>
                            <span>~1 hour total</span>
                            <span>•</span>
                            <span className={collCompleted > 0 ? 'text-blue-400' : ''}>{collCompleted}/7 finished</span>
                          </div>

                          <Link 
                            to={`/knowledge/${collection.slug}`}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm text-center transition-all ${
                              isComplete 
                                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' 
                                : collCompleted > 0 
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            }`}
                          >
                            {isComplete ? 'Review Collection' : collCompleted > 0 ? 'Continue' : 'Start'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* RESET PROGRESS */}
        {completedCount > 0 && (
          <section className="py-12 border-t border-slate-800 text-center">
            <button 
              onClick={handleReset}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Reset All Progress
            </button>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}