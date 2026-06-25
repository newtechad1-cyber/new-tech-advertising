import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Activity, Map, BookOpen, Users, Share2, TrendingUp, CheckCircle2, Circle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyGrowthJourney() {
  const navigate = useNavigate();

  const milestones = [
    { 
      id: 'discovery', 
      title: 'Discovery Started', 
      status: 'completed', 
      date: 'Completed', 
      icon: Compass, 
      description: 'You took the first step by starting your Digital Growth Guide journey and defining your business challenges.' 
    },
    { 
      id: 'business_score', 
      title: 'Business Score™ Evaluated', 
      status: 'completed', 
      date: 'Completed', 
      icon: Activity, 
      description: 'Established a baseline across six core operational and visibility categories.' 
    },
    { 
      id: 'roadmap', 
      title: 'Growth Roadmap Created', 
      status: 'completed', 
      date: 'Completed', 
      icon: Map, 
      description: 'Generated a step-by-step personalized digital strategy document for your business.' 
    },
    { 
      id: 'ai_learning', 
      title: 'AI Learning', 
      status: 'in-progress', 
      date: 'In Progress', 
      icon: BookOpen, 
      description: 'Exploring the AI Learning Center to empower your business with modern tools.' 
    },
    { 
      id: 'relationship', 
      title: 'Relationship Builder', 
      status: 'upcoming', 
      date: 'Upcoming', 
      icon: Users, 
      description: 'Utilize automated follow-ups and engagement tools to nurture your network.' 
    },
    { 
      id: 'community', 
      title: 'Community Connections', 
      status: 'upcoming', 
      date: 'Upcoming', 
      icon: Share2, 
      description: 'Expand your local presence by leveraging community intelligence and partner networks.' 
    },
    { 
      id: 'improvements', 
      title: 'Business Score Improvements', 
      status: 'upcoming', 
      date: 'Future Milestone', 
      icon: TrendingUp, 
      description: 'Re-evaluate your operations and measure the impact of your executed strategies.' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans py-20 px-6 sm:px-12 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-cyan-900/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-800/50 px-4 py-2 rounded-full text-blue-400 font-medium mb-6"
          >
            <Compass className="w-4 h-4" />
            <span>NTA Operating System™</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6"
          >
            My Growth Journey™
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Track your progress as you build a more visible, efficient, and resilient business.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700">
              <Download className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform md:-translate-x-1/2 rounded-full"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in-progress';
              
              return (
                <motion.div 
                  key={milestone.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-start md:items-center relative ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 z-10 bg-slate-900 shadow-xl">
                    {isCompleted ? (
                      <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-full h-full rounded-full bg-slate-800 border-2 border-blue-400 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                        <Circle className="w-3 h-3 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`w-full pl-20 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className={`bg-slate-900/50 backdrop-blur-sm border ${isCompleted ? 'border-blue-900/50 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : isInProgress ? 'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-slate-800'} p-6 rounded-2xl hover:bg-slate-800/80 transition-colors group`}>
                      <div className={`flex items-center space-x-4 mb-4 ${isEven ? 'md:flex-row-reverse md:space-x-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-blue-500/20 text-blue-400' : isInProgress ? 'bg-blue-900/40 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>
                          <milestone.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${isCompleted || isInProgress ? 'text-white' : 'text-slate-400'}`}>
                            {milestone.title}
                          </h3>
                          <span className={`text-xs font-semibold tracking-wider uppercase ${isCompleted ? 'text-blue-400' : isInProgress ? 'text-blue-300' : 'text-slate-600'}`}>
                            {milestone.date}
                          </span>
                        </div>
                      </div>
                      <p className={`${isCompleted || isInProgress ? 'text-slate-300' : 'text-slate-500'} leading-relaxed`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Message */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center bg-gradient-to-r from-blue-900/20 via-slate-800/50 to-blue-900/20 border border-blue-800/30 p-10 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 relative z-10">
            "You've already come farther than you realize."
          </h2>
          <p className="text-slate-400 mb-8 relative z-10 max-w-xl mx-auto">
            Growth isn't just about where you're going; it's about acknowledging the foundation you've built along the way.
          </p>
          <button 
            onClick={() => navigate('/operating-system')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/20 relative z-10"
          >
            Return to Operating System
          </button>
        </motion.div>

      </div>
    </div>
  );
}