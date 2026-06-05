import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Building2, Target, DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Questions
const QUESTIONS = [
  {
    id: 'industry',
    title: 'What industry are you in?',
    icon: Building2,
    options: [
      { label: 'Home Services / Trades', value: 'trades' },
      { label: 'Professional Services', value: 'professional' },
      { label: 'Healthcare / Medical', value: 'healthcare' },
      { label: 'Retail / Restaurant', value: 'retail' },
      { label: 'Other', value: 'other' }
    ]
  },
  {
    id: 'goal',
    title: 'What is your primary marketing goal?',
    icon: Target,
    options: [
      { label: 'Get more leads quickly', value: 'leads' },
      { label: 'Build brand awareness', value: 'brand' },
      { label: 'Automate marketing tasks', value: 'automation' },
      { label: 'Improve local SEO', value: 'seo' }
    ]
  },
  {
    id: 'time',
    title: 'How much time can you dedicate to marketing per week?',
    icon: Clock,
    options: [
      { label: 'Less than 1 hour (Do it for me)', value: 'none' },
      { label: '1-3 hours (I need guidance)', value: 'some' },
      { label: '4+ hours (I want to learn and do it)', value: 'lots' }
    ]
  },
  {
    id: 'team',
    title: 'Who currently handles your marketing?',
    icon: Users,
    options: [
      { label: 'Just me (Solo)', value: 'solo' },
      { label: 'Internal team member', value: 'team' },
      { label: 'An outside agency', value: 'agency' },
      { label: 'Nobody right now', value: 'nobody' }
    ]
  },
  {
    id: 'budget',
    title: 'What is your comfortable monthly marketing budget?',
    icon: DollarSign,
    options: [
      { label: 'Under $200 (DIY focus)', value: 'diy' },
      { label: '$500 - $1,500 (Hybrid / Guided)', value: 'hybrid' },
      { label: '$2,000+ (Full Service / DFY)', value: 'dfy' }
    ]
  }
];

export default function PricingWizard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (step <= QUESTIONS.length) {
      setTimeout(() => {
        if (step === QUESTIONS.length) {
          setIsAnalyzing(true);
          setTimeout(() => {
            setIsAnalyzing(false);
            setStep(step + 1);
          }, 1500);
        } else {
          setStep(step + 1);
        }
      }, 300);
    }
  };

  const currentQuestion = QUESTIONS[step - 1];

  const getRecommendation = () => {
    if (answers.time === 'none' || answers.budget === 'dfy') {
      return {
        name: 'Growth Accelerator',
        price: 497,
        tier: 'Guided Growth',
        description: 'Perfect for businesses that need hands-on guidance and done-for-you execution.',
        link: '/book-call'
      };
    } else if (answers.time === 'lots' || answers.budget === 'diy') {
      return {
        name: 'DIY Social',
        price: 97,
        tier: 'Self-Service',
        description: 'The best way to start building your marketing momentum using AI tools.',
        link: '/nta/diy-growth-system?plan=diy_social'
      };
    } else {
      return {
        name: 'DIY Marketing Suite',
        price: 197,
        tier: 'Advanced Tools',
        description: 'Everything you need to run your marketing AND your business from one place.',
        link: '/nta/diy-growth-system?plan=diy_suite'
      };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-20">
      <div className="max-w-3xl mx-auto w-full px-6 flex-1 flex flex-col">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Step {Math.min(step, QUESTIONS.length)} of {QUESTIONS.length}</span>
            <span>{Math.round(((Math.min(step, QUESTIONS.length) - 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-600 transition-all duration-500 ease-out"
              style={{ width: `${((Math.min(step, QUESTIONS.length) - 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center pb-20">
          <AnimatePresence mode="wait">
            {step <= QUESTIONS.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-8 text-violet-400">
                  {currentQuestion.icon && <currentQuestion.icon className="w-8 h-8" />}
                  <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                    {currentQuestion.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(currentQuestion.id, option.value)}
                      className={`w-full text-left p-6 rounded-xl border transition-all duration-200 flex items-center justify-between group
                        ${answers[currentQuestion.id] === option.value 
                          ? 'bg-violet-600/20 border-violet-500 text-white' 
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                    >
                      <span className="text-lg font-medium">{option.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${answers[currentQuestion.id] === option.value ? 'border-violet-500 bg-violet-500' : 'border-slate-600 group-hover:border-slate-400'}
                      `}>
                        {answers[currentQuestion.id] === option.value && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                {step > 1 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="mt-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Analyzing your needs...</h2>
                <p className="text-slate-400">Finding the perfect growth system for your business</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold mb-4">
                    Analysis Complete
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Your Recommended Plan</h2>
                  <p className="text-slate-400 text-lg">Based on your business profile, here is the most effective path forward.</p>
                </div>

                <Card className="bg-gradient-to-b from-slate-900 to-slate-900/50 border-slate-800 p-8 max-w-2xl mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target className="w-48 h-48" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-violet-400 font-semibold tracking-wider uppercase text-sm mb-2">
                      {getRecommendation().tier}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{getRecommendation().name}</h3>
                    <p className="text-slate-400 mb-8">{getRecommendation().description}</p>
                    
                    <div className="flex items-end gap-2 mb-8">
                      <span className="text-5xl font-bold text-white">${getRecommendation().price}</span>
                      <span className="text-slate-400 mb-1">/month</span>
                    </div>

                    <a href={getRecommendation().link}>
                      <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2">
                        Get Started <ArrowUpRight className="w-5 h-5" />
                      </Button>
                    </a>

                    <div className="mt-6 text-center">
                      <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-300 text-sm underline underline-offset-4">
                        Retake Assessment
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}