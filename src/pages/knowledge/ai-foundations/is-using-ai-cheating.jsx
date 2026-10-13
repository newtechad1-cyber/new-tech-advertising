import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import LessonMediaOptions from '@/components/knowledge/LessonMediaOptions';
import { AI_CONFUSION_PATH, lesson17 as lesson } from '@/data/aiFoundationsLesson17';
import { getJourneyMemory, addCompletedModule, updateLearningProgress, updateJourneyMemory } from '@/lib/journeyMemory';

const COLLECTION_PATH = '/knowledge/ai-foundations';
const PREVIOUS_PATH = COLLECTION_PATH + '/how-do-you-put-ai-to-work-in-a-real-business';
const PROGRESS_KEY = 'ai-foundations:' + lesson.slug;
const SOURCE_HEADING = '\n\n## Sources and further reading';
const sourceIndex = lesson.content.indexOf(SOURCE_HEADING);
const mainContent = sourceIndex >= 0 ? lesson.content.slice(0, sourceIndex) : lesson.content;
const sourceContent = sourceIndex >= 0 ? lesson.content.slice(sourceIndex) : '';
const linkStyle = '[&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:break-words [&_a]:text-blue-300 [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4';

export default function AIConfusionLesson() {
  const [isComplete, setIsComplete] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setIsComplete(Boolean(getJourneyMemory().learningProgress[PROGRESS_KEY]));
    updateJourneyMemory({ lastVisitedLessonId: lesson.id });
    if (!window.location.hash) window.scrollTo(0, 0);
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
        canonical={AI_CONFUSION_PATH}
        articleData={{ title: lesson.title, description: lesson.searchDescription, author: 'Rick Hesse', dateModified: lesson.modifiedDate, slug: AI_CONFUSION_PATH }}
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
              <span aria-hidden="true">/</span><span>Lesson 17</span>
            </nav>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-cyan-300">NTA Point of View · {lesson.readingTime} · {lesson.level}</p>
            <h1 className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl">{lesson.title}</h1>
            <p className="mb-6 text-xl leading-8 text-slate-300">Understanding the tool without giving up your judgment.</p>
            <p className="text-base leading-7 text-slate-300">Your experience, other people’s research, and practical examples can be part of one conversation. Follow the sources and decide what the evidence actually supports.</p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-slate-700 pt-6">
              <p className="text-sm font-semibold text-white">By Rick Hesse</p>
              <a href="#lesson-sources" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-500 px-4 py-2 font-semibold text-cyan-200 hover:border-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Explore the 9 sources <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12 sm:px-0">
          <LessonMediaOptions path={AI_CONFUSION_PATH} />
          <div className="mb-10 rounded-xl border border-cyan-400/25 bg-cyan-950/15 p-5 text-sm leading-7">
            <p><strong className="text-white">How to read this lesson:</strong> Personal examples explain the idea. Linked sources support particular factual claims. The connections and conclusions are my NTA Point of View, not endorsements from the organizations cited.</p>
          </div>
          <div id="lesson-reading" className="scroll-mt-24">
            <LessonArticle content={mainContent} preserveParagraphs className={linkStyle} />
          </div>
          <section id="lesson-sources" aria-label="Sources and further reading" className="mt-14 scroll-mt-24 border-t border-slate-700 pt-2">
            <LessonArticle content={sourceContent} preserveParagraphs className={linkStyle} />
          </section>
          <aside className="mt-14 rounded-2xl border border-cyan-500/25 bg-cyan-950/15 p-6 md:p-8" aria-labelledby="key-takeaway-heading">
            <h2 id="key-takeaway-heading" className="text-sm font-bold uppercase tracking-widest text-cyan-300">Key takeaway</h2>
            <p className="mt-4 text-xl leading-8 text-white">{lesson.takeaway}</p>
          </aside>
          <nav aria-labelledby="continue-learning-heading" className="mt-14">
            <h2 id="continue-learning-heading" className="text-2xl font-bold text-white">Keep exploring the connections</h2>
            <p className="mt-3 leading-7">Continue with the related NTA lessons on judgment, experience, and finding your voice.</p>
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
            <Link to={PREVIOUS_PATH} className="inline-flex items-center gap-2 text-blue-200 underline underline-offset-4"><ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />Previous lesson: Putting AI to work</Link>
            <Link to={COLLECTION_PATH} className="inline-flex items-center gap-2 text-blue-200 underline underline-offset-4">Back to AI Foundations<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          </nav>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
