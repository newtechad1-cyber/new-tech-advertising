import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import LessonMediaOptions from '@/components/knowledge/LessonMediaOptions';
import { VIDEO_READING_CONNECTIONS } from '@/data/videoLearningConnections';
import { lesson20 as lesson } from '@/data/aiFoundationsLesson20';
import { getJourneyMemory, addCompletedModule, updateLearningProgress, updateJourneyMemory } from '@/lib/journeyMemory';

const COLLECTION_PATH = '/knowledge/ai-foundations';
const LESSON_PATH = COLLECTION_PATH + '/i-asked-ai-to-seo-my-website-why-wasnt-that-enough';
const PREVIOUS_PATH = COLLECTION_PATH + '/what-is-geo-getting-your-business-ready-for-ai-search';
const PROGRESS_KEY = 'ai-foundations:' + lesson.slug;
const linkStyle = '[&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:break-words [&_a]:text-blue-300 [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4';

export default function AskedAiToSeoLesson() {
  const [isComplete, setIsComplete] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setIsComplete(Boolean(getJourneyMemory().learningProgress[PROGRESS_KEY]));
    updateJourneyMemory({ lastVisitedLessonId: lesson.id });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const markComplete = () => {
    addCompletedModule(lesson.id);
    const memory = updateLearningProgress(PROGRESS_KEY, true);
    const saved = Boolean(memory.learningProgress[PROGRESS_KEY]);
    setIsComplete(saved);
    setSaveFailed(!saved);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
      <SEOHead
        title={lesson.title + ' | NTA Knowledge Library'}
        description={lesson.searchDescription}
        canonical={LESSON_PATH}
        articleData={{ title: lesson.title, description: lesson.searchDescription, author: 'Rick Hesse', datePublished: lesson.publishedDate, dateModified: lesson.modifiedDate, slug: LESSON_PATH }}
        learningData={{ name: lesson.title, description: lesson.description, educationalLevel: lesson.level, learningResourceType: 'lesson' }}
      />
      <MarketingNav />
      <main>
        <header className="border-b border-slate-800 bg-slate-900/30 px-6 pb-12 pt-28">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <Link to="/knowledge" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-white"><BookOpen className="h-4 w-4" aria-hidden="true" />Knowledge Library</Link>
              <span aria-hidden="true">/</span>
              <Link to={COLLECTION_PATH} className="underline underline-offset-4 hover:text-white">AI Foundations</Link>
              <span aria-hidden="true">/</span><span>Lesson 20</span>
            </nav>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-cyan-300">NTA Point of View · {lesson.readingTime} · {lesson.level}</p>
            <h1 className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl">{lesson.title}</h1>
            <p className="mb-6 text-xl leading-8 text-slate-300">{lesson.subtitle}</p>
            <p className="text-base leading-7 text-slate-300">{lesson.description}</p>
            <div className="mt-8 border-t border-slate-700 pt-6"><p className="text-sm font-semibold text-white">By Rick Hesse</p></div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12">
          <LessonMediaOptions path={LESSON_PATH} />
          {!VIDEO_READING_CONNECTIONS.some(connection => connection.href === LESSON_PATH) && <section aria-label="Available lesson formats" className="mb-10 rounded-2xl border border-cyan-400/25 bg-slate-900 p-5">
            <p className="text-sm font-bold text-cyan-200">Read / Watch / Listen</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#lesson-reading" className="inline-flex min-h-12 items-center rounded-lg bg-blue-600 px-5 py-3 font-bold text-white">Read the lesson</a>
              <span className="inline-flex min-h-12 items-center rounded-lg border border-slate-600 px-4 py-3 text-sm text-slate-300">Watch · recording in progress</span>
              <span className="inline-flex min-h-12 items-center rounded-lg border border-slate-600 px-4 py-3 text-sm text-slate-300">Listen · available after recording</span>
            </div>
          </section>}
          <div className="mb-10 rounded-xl border border-cyan-400/25 bg-cyan-950/15 p-5 text-sm leading-7">
            <p><strong className="text-white">How to read this lesson:</strong> Personal examples explain the idea. Linked sources support particular factual claims. The connections and conclusions are my NTA Point of View, not endorsements from the organizations cited.</p>
          </div>
          <div id="lesson-reading" className="scroll-mt-24">
            <LessonArticle content={lesson.content} preserveParagraphs className={linkStyle} />
          </div>
          <aside className="mt-14 rounded-2xl border border-cyan-500/25 bg-cyan-950/15 p-6 md:p-8" aria-labelledby="key-takeaway-heading">
            <h2 id="key-takeaway-heading" className="text-sm font-bold uppercase tracking-widest text-cyan-300">Key takeaway</h2>
            <p className="mt-4 text-xl leading-8 text-white">{lesson.takeaway}</p>
          </aside>
          <nav aria-labelledby="continue-learning-heading" className="mt-14">
            <h2 id="continue-learning-heading" className="text-2xl font-bold text-white">Keep exploring the connections</h2>
            <p className="mt-3 leading-7">Continue with related lessons on AI search, prompting, and human judgment.</p>
            <div className="mt-6 grid gap-4">
              {lesson.relatedLessons.map(resource => (
                <Link key={resource.link} to={resource.link} className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900 p-5 font-semibold text-blue-200 hover:border-blue-400 hover:text-white">
                  {resource.label}<ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </nav>
          <div className="mt-12 rounded-xl border border-slate-700 p-6">
            <p className="mb-4 text-sm leading-6">Mark this lesson complete to keep your place on this device.</p>
            <button type="button" onClick={markComplete} disabled={isComplete} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500 disabled:bg-slate-800 disabled:text-cyan-200"><CheckCircle className="h-5 w-5" aria-hidden="true" />{isComplete ? 'Lesson completed' : 'Mark as complete'}</button>
            {saveFailed && <p role="alert" className="mt-4 text-sm text-amber-200">Your browser could not save your reading progress. You can still read every lesson.</p>}
          </div>
          <nav aria-label="Lesson navigation" className="mt-10 flex flex-col justify-between gap-6 border-t border-slate-700 pt-7 sm:flex-row">
            <Link to={PREVIOUS_PATH} className="inline-flex items-center gap-2 text-blue-200 underline underline-offset-4"><ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />Previous lesson: What Is GEO?</Link>
            <Link to={COLLECTION_PATH} className="inline-flex items-center gap-2 text-blue-200 underline underline-offset-4">Back to AI Foundations<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          </nav>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}