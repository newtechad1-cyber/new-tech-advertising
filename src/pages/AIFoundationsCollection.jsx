import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { aiFoundationsLessons } from '@/data/aiFoundations';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function AIFoundationsCollection() {
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Read from Journey Memory
    const memory = getJourneyMemory();
    const progress = memory.learningProgress || {};
    
    const completed = aiFoundationsLessons
      .filter(lesson => progress[`ai-foundations:${lesson.slug}`])
      .map(lesson => lesson.id);
      
    setCompletedLessons(completed);
  }, []);

  const totalLessons = aiFoundationsLessons.length;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100) || 0;
  
  const isAllComplete = completedLessons.length === totalLessons && totalLessons > 0;
  const firstIncompleteLesson = aiFoundationsLessons.find(l => !completedLessons.includes(l.id)) || aiFoundationsLessons[0];
  const primaryButtonText = isAllComplete ? "Review Collection" : completedLessons.length > 0 ? "Continue Journey" : "Start Journey";
  const primaryButtonLink = firstIncompleteLesson ? `/knowledge/ai-foundations/${firstIncompleteLesson.slug}` : "#";

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="AI Foundations Collection | NTA Knowledge Library"
        description="The recommended starting point for understanding AI in business. Learn how modern AI really works and why judgment comes before automation."
      />
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/learning-center" className="hover:text-white transition-colors">Knowledge Library</Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-300">AI Foundations</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
            <BookOpen className="w-4 h-4" /> Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            AI Foundations
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            A practical guide to understanding and applying artificial intelligence in your business.
          </p>
          
          {/* Progress Indicator */}
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-end mb-3">
              <div className="text-left">
                <span className="block text-slate-400 text-sm font-medium mb-1">Your Progress</span>
                <span className="text-white font-bold text-lg">{completedLessons.length} of {totalLessons} Lessons</span>
              </div>
              <div className="text-blue-400 font-bold text-xl">{progressPercent}%</div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-6">
              <Link 
                to={primaryButtonLink}
                className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors text-center"
              >
                {primaryButtonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lesson List */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <PlayCircle className="text-blue-500 w-6 h-6" /> Collection Lessons
          </h2>
          
          <div className="space-y-4">
            {aiFoundationsLessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isNext = !isCompleted && (index === 0 || completedLessons.includes(aiFoundationsLessons[index - 1].id));
              
              return (
                <Link 
                  key={lesson.id}
                  to={`/knowledge/ai-foundations/${lesson.slug}`}
                  className={`block p-6 rounded-2xl border transition-all duration-300 ${
                    isNext 
                      ? 'bg-blue-900/10 border-blue-500/30 hover:border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm ${
                          isNext ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-slate-700 text-slate-500'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                        <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">
                          {lesson.readingTime}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                    
                    <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Continue Exploring */}
      <section className="py-20 px-6 border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">
            Continue Exploring
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block">
                  AI, Humanity & Responsibility
                </span>
                <h3 className="text-3xl font-black text-white mb-4">
                  AI Is a Mirror, Not a God
                </h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  AI is more than a business tool. Explore what it reveals about human behavior, knowledge, faith, power, discernment, and the choices we make.
                </p>
                <Link 
                  to="/knowledge/ai-humanity/ai-is-a-mirror-not-a-god"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Read the Featured Perspective
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}