import { useEffect } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import LessonArticle from '@/components/knowledge/LessonArticle';
import { ChevronRight, Clock, CheckCircle, ArrowLeft, ArrowRight, User, BookOpen } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { getLessonBySlug, getCollectionBySlug } from '@/data/masterCurriculum';
import { getJourneyMemory, updateJourneyMemory, addCompletedModule } from '@/lib/journeyMemory';

export default function KnowledgeLesson() {
  const { collectionSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  
  const collection = getCollectionBySlug(collectionSlug);
  const lesson = getLessonBySlug(collectionSlug, lessonSlug);
  
  // Auto-record last visited without forcing completion
  useEffect(() => {
    if (lesson) {
      updateJourneyMemory({ lastVisitedLessonId: lesson.id });
      window.scrollTo(0, 0);
    }
  }, [lesson]);

  if (!collection || !lesson) {
    return <Navigate to="/knowledge" replace />;
  }

  const memory = getJourneyMemory();
  const completedLessons = memory.completedModules || [];
  const isComplete = completedLessons.includes(lesson.id);

  const markComplete = () => {
    addCompletedModule(lesson.id);
    // Find next lesson to automatically route
    if (lesson.nextLessonSlug) {
      navigate(`/knowledge/${collection.slug}/${lesson.nextLessonSlug}`);
    } else if (collection.nextCollectionSlug) {
      navigate(`/knowledge/${collection.nextCollectionSlug}`);
    }
  };

  const getPrevLesson = () => {
    if (lesson.id > 1) {
      return collection.lessons[lesson.id - 2];
    }
    return null;
  };

  const getNextLesson = () => {
    if (lesson.nextLessonSlug) {
      return collection.lessons.find(l => l.slug === lesson.nextLessonSlug);
    }
    return null;
  };

  const prevLesson = getPrevLesson();
  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={`${lesson.title} | NTA Knowledge Library`}
        description={lesson.description}
        articleData={{
          title: lesson.title,
          description: lesson.description,
          author: "Rick Hesse",
          datePublished: "2026-07-15",
          dateModified: "2026-07-15",
          slug: `/knowledge/${collection.slug}/${lesson.slug}`
        }}
        learningData={{
          name: lesson.title,
          description: lesson.description,
          educationalLevel: lesson.level || "Beginner",
          learningResourceType: "lesson"
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* BREADCRUMBS & HEADER */}
        <header className="pt-24 pb-12 px-6 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
              <Link to="/knowledge" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Library
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link to={`/knowledge/${collection.slug}`} className="hover:text-white transition-colors">
                {collection.title}
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-white font-medium">Lesson {lesson.id}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">
                Lesson {lesson.id} of 7
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5" /> {lesson.readingTime}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">Level: {lesson.level}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {lesson.title}
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              {lesson.description}
            </p>

            <div className="flex items-center gap-3 border-t border-slate-800 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Rick Hesse</p>
                <p className="text-xs text-slate-500">Your Digital Growth Guide™</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <article className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <LessonArticle content={lesson.content} />
          </div>
        </article>

        {/* KEY TAKEAWAY & ACTIONS */}
        <section className="py-12 px-6 bg-slate-900 border-t border-slate-800">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-2xl p-8 mb-12">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Key Takeaway</h3>
              <p className="text-xl font-medium text-white leading-relaxed">
                {lesson.takeaway}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border border-slate-800 rounded-2xl bg-slate-950">
              <div className="flex-1">
                <h4 className="text-white font-bold mb-1">Progress Check</h4>
                <p className="text-sm text-slate-400">Marking this complete saves your spot.</p>
              </div>
              <button 
                onClick={markComplete}
                disabled={isComplete}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isComplete 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                <CheckCircle className="w-5 h-5" /> 
                {isComplete ? 'Lesson Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </section>

        {/* RELATIONSHIP PATHWAYS / RELATED RESOURCES */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic relationship invite based on collection context */}
              {collection.id < 4 ? (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                  <h4 className="font-bold text-white mb-2">Have a specific question?</h4>
                  <p className="text-sm text-slate-400 mb-4">You don't have to figure it all out alone. Ask Rick directly.</p>
                  <Link to="/contact" className="text-sm font-bold text-blue-400 hover:text-blue-300">Ask Rick a Question →</Link>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                  <h4 className="font-bold text-white mb-2">Ready to apply this?</h4>
                  <p className="text-sm text-slate-400 mb-4">Begin a Growth Conversation to see how this fits your business.</p>
                  <Link to="/book-call" className="text-sm font-bold text-blue-400 hover:text-blue-300">Start a Growth Conversation →</Link>
                </div>
              )}

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                <h4 className="font-bold text-white mb-2">Never miss a lesson</h4>
                <p className="text-sm text-slate-400 mb-4">Get the NTA Journal delivered to your inbox every Monday.</p>
                <Link to="/journal" className="text-sm font-bold text-indigo-400 hover:text-indigo-300">Subscribe to the Journal →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* NAVIGATION BOTTOM */}
        <nav className="border-t border-slate-800 bg-slate-950 py-8 px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between gap-6">
            {prevLesson ? (
              <Link to={`/knowledge/${collection.slug}/${prevLesson.slug}`} className="group flex flex-1 items-center gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors flex-shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Previous Lesson</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">{prevLesson.title}</span>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextLesson ? (
              <Link to={`/knowledge/${collection.slug}/${nextLesson.slug}`} className="group flex flex-1 items-center justify-end gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-right">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Next Lesson</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">{nextLesson.title}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ) : collection.nextCollectionSlug ? (
              <Link to={`/knowledge/${collection.nextCollectionSlug}`} className="group flex flex-1 items-center justify-end gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-right">
                <div>
                  <span className="text-xs text-blue-400 uppercase tracking-wider block mb-1">Next Collection</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">Continue Journey</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ) : (
               <div className="flex-1" />
            )}
          </div>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
