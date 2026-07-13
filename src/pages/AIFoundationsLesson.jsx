import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, PlayCircle, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import ReactMarkdown from 'react-markdown';
import { aiFoundationsLessons } from '@/data/aiFoundations';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';
import { getJourneyMemory, updateLearningProgress } from '@/lib/journeyMemory';

export default function AIFoundationsLesson() {
  const { slug } = useParams();
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonIndex = useMemo(() => {
    return aiFoundationsLessons.findIndex(l => l.slug === slug);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      const memory = getJourneyMemory();
      const progress = memory.learningProgress || {};
      setIsCompleted(!!progress[`ai-foundations:${slug}`]);
    }
  }, [slug]);

  const handleMarkComplete = () => {
    updateLearningProgress(`ai-foundations:${slug}`, true);
    setIsCompleted(true);
  };

  if (lessonIndex === -1) {
    return <Navigate to="/knowledge/ai-foundations" replace />;
  }

  const lesson = aiFoundationsLessons[lessonIndex];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title={`${lesson.title} | AI Foundations | NTA`}
        description={lesson.description}
      />
      <MarketingNav />

      {/* Collection Navigation Header */}
      <div className="pt-24 pb-6 px-6 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/knowledge/ai-foundations" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline-block">AI Foundations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:inline-block"></span>
            <span className="text-sm font-medium text-slate-300">Lesson {lessonIndex + 1} of {aiFoundationsLessons.length}</span>
          </div>
        </div>
      </div>

      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
              <BrainCircuit className="w-4 h-4" /> {lesson.level}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              {lesson.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Key Takeaway */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8 mb-12 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-3">Key Takeaway</h3>
            <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
              {lesson.takeaway}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-ul:text-slate-300 mb-16">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>

          {/* Related Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-12 border-t border-slate-800">
            {lesson.relatedVideos?.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-300 font-bold flex items-center gap-2 mb-4">
                  <PlayCircle className="w-5 h-5 text-blue-400" /> Watch & Learn
                </h3>
                <ul className="space-y-3">
                  {lesson.relatedVideos.map((v, i) => (
                    <li key={i}>
                      <Link to={v.link} className="text-blue-400 hover:text-blue-300 text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> <span>{v.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {lesson.relatedModules?.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-slate-300 font-bold flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-emerald-400" /> OS Modules
                </h3>
                <ul className="space-y-3">
                  {lesson.relatedModules.map((m, i) => (
                    <li key={i}>
                      <Link to={m.link} className="text-emerald-400 hover:text-emerald-300 text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> <span>{m.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> Lesson Complete
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-semibold border border-slate-700 hover:border-slate-600"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-400" /> Mark Lesson Complete
              </button>
            )}
          </div>

          <TrackBottomNav 
            prevLink={lessonIndex > 0 ? `/knowledge/ai-foundations/${aiFoundationsLessons[lessonIndex - 1].slug}` : null}
            prevText="← Previous Lesson"
            nextLink={lesson.nextLessonSlug ? `/knowledge/ai-foundations/${lesson.nextLessonSlug}` : "/knowledge/ai-foundations"}
            nextText={lesson.nextLessonSlug ? "Continue Learning →" : "Complete Collection →"}
            color="blue"
          />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}