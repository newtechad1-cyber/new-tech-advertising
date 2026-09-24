import { useEffect } from 'react';
import { Link, useLocation, useParams, Navigate, useNavigate } from 'react-router-dom';
import LessonArticle from '@/components/knowledge/LessonArticle';
import { ChevronRight, Clock, CheckCircle, ArrowLeft, ArrowRight, User, BookOpen, List, Quote } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import ContentNextSteps from '@/components/knowledge/ContentNextSteps';
import { getLessonBySlug, getCollectionBySlug, getConnectedLessonResources } from '@/data/masterCurriculum';
import { getLessonSearchMetadata } from '@/config/seoMetadata';
import { getJourneyMemory, updateJourneyMemory, addCompletedModule } from '@/lib/journeyMemory';

export default function KnowledgeLesson() {
  const { collectionSlug: routeCollectionSlug, lessonSlug: routeLessonSlug } = useParams();
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const collectionSlug = routeCollectionSlug || segments[1];
  const lessonSlug = routeLessonSlug || segments[2];
  const navigate = useNavigate();
  
  const collection = getCollectionBySlug(collectionSlug);
  const lesson = getLessonBySlug(collectionSlug, lessonSlug);
  
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
  const lessonIndex = collection.lessons.findIndex(item => item.slug === lesson.slug);
  const lessonPosition = lessonIndex >= 0 ? lessonIndex + 1 : lesson.id;
  const totalLessons = collection.lessons.length;
  const isLifetimeCollection = collection.slug === 'what-a-lifetime-in-business-taught-me';
  const isLifetimeFinalLesson = isLifetimeCollection && lessonIndex === totalLessons - 1;
  const connectedResources = getConnectedLessonResources(collectionSlug, lessonSlug);
  const lessonSeo = getLessonSearchMetadata(collectionSlug, lesson);

  const markComplete = () => {
    addCompletedModule(lesson.id);
    if (lesson.nextLessonSlug) {
      navigate(`/knowledge/${collection.slug}/${lesson.nextLessonSlug}`);
    } else if (isLifetimeFinalLesson) {
      navigate('/knowledge/turning-what-a-business-knows-into-an-asset');
    } else if (collection.nextCollectionSlug) {
      navigate(`/knowledge/${collection.nextCollectionSlug}`);
    }
  };

  const prevLesson = lessonIndex > 0 ? collection.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 && lessonIndex < totalLessons - 1
    ? collection.lessons[lessonIndex + 1]
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={lessonSeo.title}
        description={lessonSeo.description}
        canonical={lessonSeo.canonical}
        articleData={{
          title: lesson.title,
          description: lessonSeo.description,
          author: "Rick Hesse",
          datePublished: isLifetimeCollection ? undefined : lesson.publishedDate || "2026-07-15",
          dateModified: isLifetimeCollection ? undefined : lesson.modifiedDate || "2026-07-23",
          slug: `/knowledge/${collection.slug}/${lesson.slug}`
        }}
        learningData={{
          name: lesson.title,
          description: lessonSeo.description,
          educationalLevel: lesson.level || "Beginner",
          learningResourceType: "lesson"
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        <header className="pt-24 pb-12 px-6 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2" aria-label="Breadcrumb">
              <Link to="/knowledge" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Knowledge Library
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <Link to={`/knowledge/${collection.slug}`} className="hover:text-white transition-colors">
                {collection.title}
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-white font-medium">Lesson {lessonPosition}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                to={`/knowledge/${collection.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-blue-300 font-bold text-xs uppercase tracking-widest hover:bg-blue-500/20 transition-colors"
              >
                <List className="w-3.5 h-3.5" /> {isLifetimeCollection ? 'Featured Series · NTA Point of View · ' : ''}Lesson {lessonPosition} of {totalLessons}
              </Link>
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-slate-800 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Rick Hesse</p>
                  <p className="text-xs text-slate-500">{isLifetimeCollection ? 'NTA Point of View' : 'Your Digital Growth Guide™'}</p>
                </div>
              </div>
              <Link to={`/knowledge/${collection.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">
                <List className="w-4 h-4" /> {isLifetimeCollection ? `Back to collection: ${collection.title}` : `View all ${totalLessons} ${collection.title} lessons`}
              </Link>
            </div>
          </div>
        </header>

        <article className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <LessonArticle content={lesson.content} />

            {lesson.readerResponse && (
              <section
                className="mt-12 rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6 md:p-8"
                aria-labelledby="reader-response-heading"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                  {lesson.readerResponse.label || 'A reader’s response'}
                </p>
                <Quote className="mt-5 h-8 w-8 text-blue-400/70" aria-hidden="true" />
                <blockquote className="mt-3">
                  <p id="reader-response-heading" className="text-2xl font-medium leading-relaxed text-white md:text-3xl">
                    “{lesson.readerResponse.quote}”
                  </p>
                  <footer className="mt-5 text-sm font-bold text-slate-200">
                    — {lesson.readerResponse.attribution}
                  </footer>
                </blockquote>
                {lesson.readerResponse.context && (
                  <p className="mt-5 text-sm leading-6 text-slate-400">
                    {lesson.readerResponse.context}
                  </p>
                )}
              </section>
            )}

            {connectedResources.length > 0 && (
              <aside className="mt-16 border-t border-slate-800 pt-10" aria-labelledby="keep-exploring-heading">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Continue Learning</p>
                <h2 id="keep-exploring-heading" className="text-2xl font-black text-white mb-3">
                  Keep exploring this idea
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  If this raised a useful question, these are the next few lessons worth reading.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connectedResources.map(resource => (
                    <Link
                      key={resource.path}
                      to={resource.path}
                      className="group rounded-2xl border border-slate-800 bg-slate-900/55 p-5 transition-colors hover:border-blue-500/60 hover:bg-slate-900"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        {resource.type}{resource.collectionTitle ? ` · ${resource.collectionTitle}` : ''}
                      </p>
                      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-400">
                        {resource.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 group-hover:text-blue-300">
                        Read this next <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </article>

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

        {isLifetimeFinalLesson && (
          <section className="px-6 py-14 border-t border-slate-800 bg-slate-900/30">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Continue the idea</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">A lifetime of experience becomes more useful when a business can keep learning from it.</h2>
              <p className="text-slate-400 leading-relaxed mb-7">Continue exploring practical AI, collaboration, business knowledge, and the connected Digital Growth Office through these NTA lessons.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/knowledge/turning-what-a-business-knows-into-an-asset" className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-blue-500/50"><p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Business Knowledge</p><p className="font-bold text-white">Turning What a Business Knows Into an Asset</p></Link>
                <Link to="/knowledge/ai-foundations" className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-blue-500/50"><p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Practical AI</p><p className="font-bold text-white">AI Foundations</p></Link>
                <Link to="/knowledge/building-a-small-business-with-ai" className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-blue-500/50"><p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Collaboration</p><p className="font-bold text-white">Building a Small Business With AI</p></Link>
                <Link to="/operating-system" className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-blue-500/50"><p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Connected System</p><p className="font-bold text-white">The Digital Growth Office™</p></Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <ContentNextSteps
              title={lesson.title}
              path={`/knowledge/${collection.slug}/${lesson.slug}`}
            />
          </div>
        </section>

        <nav className="border-t border-slate-800 bg-slate-950 py-8 px-6" aria-label="Lesson navigation">
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
              <Link to={`/knowledge/${collection.slug}`} className="group flex flex-1 items-center gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors flex-shrink-0">
                  <List className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Series overview</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Back to {collection.title}</span>
                </div>
              </Link>
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
            ) : isLifetimeFinalLesson ? (
              <Link to="/knowledge/turning-what-a-business-knows-into-an-asset" className="group flex flex-1 items-center justify-end gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-right">
                <div><span className="text-xs text-blue-400 uppercase tracking-wider block mb-1">Continue Learning</span><span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Turning What a Business Knows Into an Asset</span></div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0"><ArrowRight className="w-5 h-5" /></div>
              </Link>
            ) : collection.nextCollectionSlug ? (
              <Link to={`/knowledge/${collection.nextCollectionSlug}`} className="group flex flex-1 items-center justify-end gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-right">
                <div>
                  <span className="text-xs text-blue-400 uppercase tracking-wider block mb-1">Next Learning Series</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">Continue Journey</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ) : (
              <Link to={`/knowledge/${collection.slug}`} className="group flex flex-1 items-center justify-end gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-right">
                <div>
                  <span className="text-xs text-blue-400 uppercase tracking-wider block mb-1">Series Complete</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Review all lessons</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors flex-shrink-0">
                  <List className="w-5 h-5" />
                </div>
              </Link>
            )}
          </div>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
