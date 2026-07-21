import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import { howBusinessesTurnTrustIntoLastingRelationshipsLessons } from '@/data/howBusinessesTurnTrustIntoLastingRelationships';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';
import { getJourneyMemory, updateLearningProgress } from '@/lib/journeyMemory';
import RelatedContent from '@/components/knowledge/RelatedContent';

export default function HowBusinessesTurnTrustIntoLastingRelationshipsLesson() {
  const { slug } = useParams();
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonIndex = useMemo(() => {
    return howBusinessesTurnTrustIntoLastingRelationshipsLessons.findIndex(l => l.slug === slug);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      const memory = getJourneyMemory();
      const progress = memory.learningProgress || {};
      setIsCompleted(!!progress[`how-businesses-turn-trust-into-lasting-relationships:${slug}`]);
    }
  }, [slug]);

  const handleMarkComplete = () => {
    updateLearningProgress(`how-businesses-turn-trust-into-lasting-relationships:${slug}`, true);
    setIsCompleted(true);
  };

  if (lessonIndex === -1) {
    return <Navigate to="/knowledge/how-businesses-turn-trust-into-lasting-relationships" replace />;
  }

  const lesson = howBusinessesTurnTrustIntoLastingRelationshipsLessons[lessonIndex];
  const totalLessons = howBusinessesTurnTrustIntoLastingRelationshipsLessons.length;
  const currentStep = lessonIndex + 1;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title={`${lesson.title} | How Businesses Turn Trust Into Lasting Relationships | NTA Knowledge Library`}
        description={lesson.description}
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        
        {/* Lesson Header */}
        <header className="px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
              <Link to="/learning-center" className="hover:text-white transition-colors">Knowledge Library</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <Link to="/knowledge/how-businesses-turn-trust-into-lasting-relationships" className="hover:text-white transition-colors">How Businesses Turn Trust Into Lasting Relationships</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-blue-400">Lesson {currentStep}</span>
            </div>

            <TrackProgress trackName="How Businesses Turn Trust Into Lasting Relationships" currentStep={currentStep} totalSteps={totalLessons} color="blue" />

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight mt-6">
              {lesson.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><BrainCircuit className="w-4 h-4 text-blue-500" /> {lesson.level}</span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">{lesson.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6">
          
          {/* Key Takeaway Box */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 mb-12 shadow-lg shadow-blue-900/5">
            <h2 className="flex items-center gap-2 text-blue-400 font-bold mb-3 uppercase tracking-wide text-sm">
              <CheckCircle2 className="w-5 h-5" /> Key Takeaway
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed font-medium">
              {lesson.takeaway}
            </p>
          </div>

          {/* Lesson Content */}
          <LessonArticle content={lesson.content} />

          <RelatedContent lesson={lesson} />

          <div className="mt-12 flex justify-center">
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
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
            prevLink={lessonIndex > 0 ? `/knowledge/how-businesses-turn-trust-into-lasting-relationships/${howBusinessesTurnTrustIntoLastingRelationshipsLessons[lessonIndex - 1].slug}` : null}
            prevText="← Previous Lesson"
            nextLink={lesson.nextLessonSlug ? `/knowledge/how-businesses-turn-trust-into-lasting-relationships/${lesson.nextLessonSlug}` : "/knowledge/how-businesses-turn-trust-into-lasting-relationships"}
            nextText={lesson.nextLessonSlug ? "Continue Learning →" : "Complete Collection →"}
            color="blue"
          />

        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
