import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, CheckCircle, Circle, PlayCircle, BookOpen, FileText } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { getCollectionBySlug } from '@/data/masterCurriculum';
import { flagshipArticleToolsVsSystem } from '@/data/flagshipArticles';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function KnowledgeCollection() {
  const { collectionSlug } = useParams();
  const navigate = useNavigate();
  const collection = getCollectionBySlug(collectionSlug);
  
  if (!collection) {
    return <Navigate to="/knowledge" replace />;
  }

  const memory = getJourneyMemory();
  const completedLessons = memory.completedModules || [];
  
  const completedCount = collection.lessons.filter(l => completedLessons.includes(l.id)).length;
  const totalCount = collection.lessons.length;
  const isComplete = completedCount === totalCount;
  
  // Find first unfinished lesson for "Start/Continue" logic
  const nextUnfinishedLesson = collection.lessons.find(l => !completedLessons.includes(l.id));

  // Determine what happens when user clicks the main CTA button
  const handlePrimaryCTA = () => {
    if (isComplete) {
      // Review mode: start from lesson 1 again
      navigate(`/knowledge/${collection.slug}/${collection.lessons[0].slug}`);
    } else if (nextUnfinishedLesson) {
      // Continue or Start
      navigate(`/knowledge/${collection.slug}/${nextUnfinishedLesson.slug}`);
    }
  };

  const getStatusText = () => {
    if (isComplete) return 'Review Collection';
    if (completedCount > 0) return 'Continue Journey';
    return 'Start Collection';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [collectionSlug]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={`${collection.title} | NTA Knowledge Library`}
        description={collection.description}
        collectionData={{
          name: collection.title,
          description: collection.description,
          numberOfItems: collection.lessons.length,
          hasPart: collection.lessons.map(lesson => ({
            name: lesson.title,
            url: `/knowledge/${collection.slug}/${lesson.slug}`
          }))
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-16 px-6 border-b border-slate-800">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
              <Link to="/knowledge" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Knowledge Library
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{collection.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Collection {collection.id} of 7
              </span>
              {isComplete && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completed
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              {collection.title}
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
              {collection.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={handlePrimaryCTA}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isComplete 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                }`}
              >
                {isComplete ? <FileText className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                {getStatusText()}
              </button>

              <div className="flex flex-col items-center sm:items-start text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-32 bg-slate-800 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
                  </div>
                  <span className={completedCount > 0 ? 'text-blue-400' : ''}>{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{completedCount} of {totalCount} lessons completed</span>
                  <span>•</span>
                  <span>~1 hour total</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LESSONS LIST */}
        <section className="py-16 px-6 bg-slate-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Lessons in this Collection</h2>
            
            <div className="space-y-4">
              {collection.lessons.map((lesson, idx) => {
                const isLessonComplete = completedLessons.includes(lesson.id);
                const isNextUnfinished = nextUnfinishedLesson && lesson.id === nextUnfinishedLesson.id;

                return (
                  <Link 
                    key={lesson.id} 
                    to={`/knowledge/${collection.slug}/${lesson.slug}`}
                    className={`group block p-6 rounded-2xl border transition-all ${
                      isLessonComplete 
                        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                        : isNextUnfinished
                          ? 'bg-slate-900 border-blue-500/30 hover:border-blue-500/60 shadow-lg shadow-blue-900/5'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 mt-1 md:mt-0">
                          {isLessonComplete ? (
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                          ) : isNextUnfinished ? (
                            <PlayCircle className="w-6 h-6 text-blue-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-700" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lesson {lesson.id}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.readingTime}</span>
                          </div>
                          <h3 className={`text-lg font-bold transition-colors ${
                            isLessonComplete ? 'text-slate-300 group-hover:text-white' : 'text-white group-hover:text-blue-400'
                          }`}>
                            {lesson.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="md:w-1/3 flex-shrink-0 text-sm text-slate-400 leading-relaxed md:border-l md:border-slate-800 md:pl-6">
                        {lesson.takeaway}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* END OF COLLECTION TRANSITIONS */}
            <div className="mt-16 pt-12 border-t border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-center">
              {collection.previousCollectionSlug ? (
                <Link to={`/knowledge/${collection.previousCollectionSlug}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  ← Previous Collection
                </Link>
              ) : (
                <div /> // Spacing
              )}

              {collection.nextCollectionSlug ? (
                <Link to={`/knowledge/${collection.nextCollectionSlug}`} className="bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700 px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Next Collection <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <span className="text-slate-400 text-sm font-medium">You've reached the end of the current curriculum.</span>
                  <Link to="/gap-audit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                    Run a Free Visibility Audit
                  </Link>
                </div>
              )}
            </div>

            {/* RELATED FLAGSHIP (If it's the 6th or 7th collection, feature the flagship article) */}
            {(collection.id === 6 || collection.id === 7) && (
              <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 text-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">
                  Featured NTA Perspective
                </span>
                <h3 className="text-2xl font-black text-white mb-4">{flagshipArticleToolsVsSystem.title}</h3>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                  {flagshipArticleToolsVsSystem.primaryAudience}
                </p>
                <Link to={`/knowledge/articles/${flagshipArticleToolsVsSystem.slug}`} className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  Read the Flagship Article
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}