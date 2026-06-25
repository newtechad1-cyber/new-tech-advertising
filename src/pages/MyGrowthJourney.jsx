import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Compass, Activity, Map, Users, Brain, CheckCircle2, Download, Milestone, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { getJourneyMemory } from '@/lib/journeyMemory';
import NextStepEngine from '@/components/recommendations/NextStepEngine';

export default function MyGrowthJourney() {
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setMemory(getJourneyMemory());
  }, []);

  const handleExportPDF = () => {
    setIsExporting(true);
    // Prepare future PDF export
    setTimeout(() => {
      setIsExporting(false);
      alert('PDF Export feature is being prepared for a future update.');
    }, 1500);
  };

  if (!memory) return null;

  // Build the timeline based on Journey Memory
  const timelineEvents = [
    {
      id: 'discovery',
      title: 'Discovery Started',
      description: 'You began your journey and established your baseline goals.',
      icon: Compass,
      completed: memory.guideState?.step > 0 || memory.completedConversations?.length > 0,
      date: 'Completed'
    },
    {
      id: 'business-score',
      title: 'Business Score™ Evaluated',
      description: memory.businessScore 
        ? `You scored ${memory.businessScore.overall}/100 across 6 foundational categories.` 
        : 'Evaluate your current operations to uncover blind spots.',
      icon: Activity,
      completed: !!memory.businessScore,
      date: memory.businessScore ? 'Completed' : 'Pending'
    },
    {
      id: 'roadmap',
      title: 'Growth Roadmap™ Created',
      description: memory.roadmaps?.length > 0 
        ? 'You generated a personalized digital strategy document.' 
        : 'Turn your Business Score into an actionable roadmap.',
      icon: Map,
      completed: memory.roadmaps?.length > 0,
      date: memory.roadmaps?.length > 0 ? 'Completed' : 'Pending'
    },
    {
      id: 'learning',
      title: 'AI Learning Progress',
      description: Object.keys(memory.learningProgress || {}).length > 0 
        ? 'You are actively mastering AI tools for your local business.' 
        : 'Start a learning path in the AI Learning Center™.',
      icon: Brain,
      completed: Object.keys(memory.learningProgress || {}).length > 0,
      date: Object.keys(memory.learningProgress || {}).length > 0 ? 'In Progress' : 'Pending'
    },
    {
      id: 'relationship',
      title: 'Relationship Builder™',
      description: memory.completedModules?.includes('relationship_builder') 
        ? 'You completed the Relationship Builder module.' 
        : 'Learn how to transform connections into digital growth.',
      icon: Users,
      completed: memory.completedModules?.includes('relationship_builder'),
      date: memory.completedModules?.includes('relationship_builder') ? 'Completed' : 'Pending'
    }
  ];

  const completedCount = timelineEvents.filter(e => e.completed).length;
  const progressPercentage = Math.round((completedCount / timelineEvents.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 pt-20 pb-12 px-6 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4 text-blue-400">
              <Target className="w-6 h-6" />
              <span className="font-bold tracking-wider uppercase text-sm">Progress Tracker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              My Growth Journey™
            </h1>
            <p className="text-xl text-slate-400">
              {memory.visitor?.name ? `${memory.visitor.name}, ` : ''}You've already come farther than you realize.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{isExporting ? 'Preparing...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 relative z-10">
        
        {/* Progress Overview */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 mb-12 shadow-lg flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 relative shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" className="stroke-slate-800 fill-none" strokeWidth="12" />
              <circle 
                cx="64" 
                cy="64" 
                r="56" 
                className="stroke-blue-500 fill-none transition-all duration-1000 ease-out" 
                strokeWidth="12" 
                strokeDasharray="351.8" 
                strokeDashoffset={351.8 - (351.8 * progressPercentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{progressPercentage}%</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Operating System Mastery</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              You have completed {completedCount} out of {timelineEvents.length} foundational milestones. 
              Keep engaging with the modules to unlock more insights and elevate your digital readiness.
            </p>
            {memory.businessScore && (
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-semibold text-sm">
                <Activity className="w-4 h-4 mr-2" />
                Current Business Score: {memory.businessScore.overall}/100
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[27px] md:before:ml-[29px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-800 before:to-slate-800">
          
          {timelineEvents.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
            >
              {/* Icon / Marker */}
              <div className={`flex items-center justify-center w-14 h-14 rounded-full border-4 border-slate-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-colors duration-500 ${
                event.completed ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
              }`}>
                {event.completed ? <CheckCircle2 className="w-6 h-6" /> : <event.icon className="w-6 h-6" />}
              </div>

              {/* Card */}
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border transition-all duration-300 ${
                event.completed 
                  ? 'bg-slate-900/80 border-slate-700 shadow-md' 
                  : 'bg-slate-900/30 border-slate-800/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-xl font-bold ${event.completed ? 'text-white' : 'text-slate-400'}`}>
                    {event.title}
                  </h4>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${event.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                  {event.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center ${
                    event.completed ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {event.completed ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
                    {event.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">You've already come farther than you realize.</h2>
          <button onClick={() => navigate('/operating-system')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-900/20">
            <span>Return to Operating System</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      <NextStepEngine />
    </div>
  );
}