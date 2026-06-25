import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Lock, PlayCircle, Award, ArrowRight, BookOpen, Brain, Zap, Target, Users, Shield, Briefcase, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';

export default function AILearningCenter() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('nta_learning_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const markComplete = (lessonId) => {
    const newProgress = { ...progress, [lessonId]: true };
    setProgress(newProgress);
    localStorage.setItem('nta_learning_progress', JSON.stringify(newProgress));
  };

  const paths = [
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Master the basics of artificial intelligence and its practical business applications.',
      icon: Brain,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      lessons: [
        { id: 'f1', title: 'What is AI for Small Business?', duration: '15 min', req: null },
        { id: 'f2', title: 'The AI Trust Framework', duration: '20 min', req: 'f1' },
        { id: 'f3', title: 'Identifying AI Opportunities', duration: '25 min', req: 'f2' }
      ]
    },
    {
      id: 'ai-marketing',
      title: 'AI for Marketing',
      description: 'Leverage AI to create content, optimize campaigns, and drive visibility.',
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      lessons: [
        { id: 'm1', title: 'AI Content Generation', duration: '20 min', req: 'f3' },
        { id: 'm2', title: 'Predictive Ad Targeting', duration: '30 min', req: 'm1' }
      ]
    },
    {
      id: 'ai-sales',
      title: 'AI for Sales',
      description: 'Accelerate deal cycles and improve closing rates with AI assistance.',
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      lessons: [
        { id: 's1', title: 'Automated Lead Scoring', duration: '15 min', req: 'f3' },
        { id: 's2', title: 'AI Sales Follow-ups', duration: '25 min', req: 's1' }
      ]
    },
    {
      id: 'ai-customer-service',
      title: 'AI for Customer Service',
      description: 'Enhance customer experience with intelligent, always-on support.',
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      lessons: [
        { id: 'cs1', title: 'Intelligent Chatbots', duration: '20 min', req: 'f3' },
        { id: 'cs2', title: 'Automated Ticket Routing', duration: '20 min', req: 'cs1' }
      ]
    },
    {
      id: 'ai-productivity',
      title: 'AI Productivity',
      description: 'Streamline daily operations and eliminate repetitive tasks.',
      icon: Zap,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      lessons: [
        { id: 'p1', title: 'AI Meeting Assistants', duration: '15 min', req: 'f3' },
        { id: 'p2', title: 'Document Analysis', duration: '25 min', req: 'p1' }
      ]
    },
    {
      id: 'ai-automation',
      title: 'AI Automation',
      description: 'Build intelligent workflows that connect your entire tech stack.',
      icon: Activity,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      lessons: [
        { id: 'a1', title: 'Workflow Orchestration', duration: '30 min', req: 'f3' },
        { id: 'a2', title: 'Self-Healing Processes', duration: '35 min', req: 'a1' }
      ]
    },
    {
      id: 'ai-leadership',
      title: 'AI Leadership',
      description: 'Guide your organization through AI transformation securely.',
      icon: Shield,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      lessons: [
        { id: 'l1', title: 'Change Management for AI', duration: '25 min', req: 'f3' },
        { id: 'l2', title: 'Data Privacy & Ethics', duration: '30 min', req: 'l1' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <SEOHead title="AI Learning Center | NTA" description="Structured learning paths for AI adoption in small business." />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Brain className="w-4 h-4" /> Structured Learning Platform
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI Learning Center™
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-400 max-w-2xl mx-auto">
            Master the NTA Operating System with guided, role-based learning paths.
          </motion.p>
        </div>

        <div className="space-y-12">
          {paths.map((path, pIdx) => {
            const pathCompleted = path.lessons.every(l => progress[l.id]);
            const pathProgress = Math.round((path.lessons.filter(l => progress[l.id]).length / path.lessons.length) * 100);

            return (
              <motion.div 
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl ${path.bg} ${path.color} flex items-center justify-center shrink-0`}>
                      <path.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{path.title}</h2>
                      <p className="text-slate-400">{path.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      {pathCompleted && <Award className="w-6 h-6 text-emerald-400" />}
                      <span className="text-2xl font-bold text-white">{pathProgress}%</span>
                    </div>
                    <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${pathCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pathProgress}%` }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/50 bg-slate-900/20">
                  {path.lessons.map((lesson, lIdx) => {
                    const isCompleted = progress[lesson.id];
                    const isLocked = lesson.req && !progress[lesson.req];
                    
                    return (
                      <div key={lesson.id} className={`p-6 flex items-center justify-between gap-4 transition-colors ${isLocked ? 'opacity-50' : 'hover:bg-slate-800/30'}`}>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => !isLocked && markComplete(lesson.id)}
                            disabled={isLocked}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isCompleted 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : isLocked
                                  ? 'border-slate-700 bg-slate-800/50 text-slate-600'
                                  : 'border-slate-600 hover:border-blue-500 text-transparent hover:text-blue-500'
                            }`}
                          >
                            {isLocked ? <Lock className="w-4 h-4" /> : <CheckCircle className="w-5 h-5" />}
                          </button>
                          <div>
                            <h3 className="font-semibold text-white">{lIdx + 1}. {lesson.title}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" /> {lesson.duration}
                              </span>
                              {isLocked && (
                                <span className="text-xs text-rose-400">Prerequisite required</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          disabled={isLocked}
                          onClick={() => !isLocked && markComplete(lesson.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isCompleted
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : isLocked
                                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          <PlayCircle className="w-4 h-4" />
                          {isCompleted ? 'Review' : 'Start Lesson'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}