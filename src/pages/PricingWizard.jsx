import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Building2, Target, DollarSign, Clock, LayoutDashboard, ArrowUpRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

import SEOHead from '@/components/shared/SEOHead';
const QUESTIONS = [
  {
    id: 'industry',
    title: 'What type of business do you run?',
    icon: Building2,
    options: [
      { label: 'HVAC / Plumbing / Trades', value: 'trades' },
      { label: 'Restaurant / Bar / Cafe', value: 'restaurant' },
      { label: 'Professional Services (law, dental, medical)', value: 'professional' },
      { label: 'Retail / Local Shop', value: 'retail' },
      { label: 'Other', value: 'other' }
    ]
  },
  {
    id: 'website_status',
    title: 'What is the current state of your website?',
    icon: LayoutDashboard,
    options: [
      { label: "I don't have a website yet", value: 'no_website' },
      { label: "I have a website, but it's outdated or needs fixing", value: 'outdated_website' },
      { label: "I have a good website, but I need more visibility/leads", value: 'good_website' },
      { label: "I have a website and I'm dominating, but I want to scale/automate", value: 'scaling' }
    ]
  },
  {
    id: 'primary_goal',
    title: 'What\'s the #1 thing you want right now?',
    icon: Target,
    options: [
      { label: 'Get my basic online foundation set up right', value: 'foundation' },
      { label: 'Show up on Google and get more consistent leads', value: 'visibility' },
      { label: 'Build a strong reputation and dominate my service area', value: 'authority' },
      { label: 'Become the undisputed market leader with video/streaming', value: 'leadership' },
      { label: 'Automate my business, CRM, and sales follow-ups', value: 'automate' }
    ]
  }
];

export default function PricingWizard() {
  const [step, setStep] = useState(0); // Step 0 is Welcome
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    const currentQIdx = step - 1;
    if (currentQIdx < QUESTIONS.length - 1) {
      setTimeout(() => {
        setStep(step + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setIsAnalyzing(true);
        submitResults();
        setTimeout(() => {
          setIsAnalyzing(false);
          setStep(step + 1);
        }, 1500);
      }, 300);
    }
  };

  const getRecommendation = () => {
    const { website_status, primary_goal } = answers;

    if (website_status === 'no_website' || website_status === 'outdated_website' || primary_goal === 'foundation') {
      return {
        key: 'foundation_launch',
        name: 'Foundation Launch',
        price: 297,
        tier: 'Core Setup',
        description: 'Perfect for businesses with no website or an outdated one. We build your foundation and get you on the map.',
        link: '/book-call',
        cta: 'Book a Strategy Call'
      };
    }
    
    if (primary_goal === 'automate') {
      return {
        key: 'elevate',
        name: 'Elevate',
        price: 1497,
        tier: 'Automation & CRM',
        description: 'Custom AI workflows, CRM, internal process automation, and lead follow-up systems.',
        link: '/book-call',
        cta: 'Book a Strategy Call'
      };
    }

    if (primary_goal === 'leadership' || website_status === 'scaling') {
      return {
        key: 'market_leader',
        name: 'Market Leader',
        price: 897,
        tier: 'Category Dominance',
        description: 'Competitive tracking, streaming/video strategy, advanced SEO, and campaign planning.',
        link: '/book-call',
        cta: 'Book a Strategy Call'
      };
    }

    if (primary_goal === 'authority') {
      return {
        key: 'authority_builder',
        name: 'Authority Builder',
        price: 597,
        tier: 'Trust & Reputation',
        description: 'Deeper content, review campaigns, service-area authority, and AI video assets.',
        link: '/book-call',
        cta: 'Book a Strategy Call'
      };
    }

    return {
      key: 'visibility_growth',
      name: 'Visibility Growth',
      price: 397,
      tier: 'Consistent Leads',
      description: 'Visibility audit, SEO improvements, content, social posting, and review monitoring.',
      link: '/book-call',
      cta: 'Book a Strategy Call'
    };
  };

  const submitResults = async () => {
    try {
      let user_email = '';
      try {
        const user = await base44.auth.me();
        if (user) user_email = user.email;
      } catch (e) {}

      const recommended = getRecommendation();
      
      const payload = {
        ...answers,
        recommended_plan: recommended.name,
        user_email,
        source_url: window.location.href
      };

      await base44.functions.invoke('notifyPricingWizardComplete', payload);
    } catch (err) {
      console.error('Failed to save wizard results:', err);
    }
  };

  const totalSteps = QUESTIONS.length;
  const currentQuestion = step > 0 && step <= totalSteps ? QUESTIONS[step - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative pb-20">
      <SEOHead 
        title="Find Your Plan | New Tech Advertising Pricing"
        description="Find the right AI marketing plan for your business. Interactive pricing wizard to match services with your growth goals."
      />
      <MarketingNav />
      {/* Talk to Rick Fixed Button */}
      <a 
        href="tel:641-420-8816" 
        className="fixed bottom-6 right-6 z-50 bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-full shadow-lg shadow-violet-900/50 flex items-center gap-2 font-semibold transition-all hover:scale-105"
      >
        <Phone className="w-4 h-4" /> Talk to Rick
      </a>

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-12 flex-1 flex flex-col">
        
        {step > 0 && step <= totalSteps && (
          <div className="mb-12">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(((step - 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-600 transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="mb-12 flex justify-center items-center gap-4 text-violet-400">
                  <span className="font-bold tracking-widest uppercase text-sm border border-violet-500/30 px-3 py-1 rounded-full bg-violet-500/10">First AI Agency in Iowa</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Let's Find the Right Growth Plan for Your Business
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  Answer a few quick questions — we'll recommend exactly what fits. Takes about 90 seconds.
                </p>
                <Button 
                  onClick={() => setStep(1)} 
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-xl rounded-xl flex items-center gap-2 mx-auto"
                >
                  Let's Go <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {step > 0 && step <= totalSteps && (
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

                <button 
                  onClick={() => setStep(step - 1)}
                  className="mt-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </motion.div>
            )}

            {isAnalyzing && (
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
            )}

            {step > totalSteps && !isAnalyzing && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold mb-4">
                    Recommended for You
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Your Personalized Plan</h2>
                  <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    Based on your answers, you're a {answers.industry === 'other' ? '' : answers.industry} business owner ready for growth. {getRecommendation().name} gives you exactly what you need.
                  </p>
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
                      <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2 mb-4">
                        {getRecommendation().cta} <ArrowUpRight className="w-5 h-5" />
                      </Button>
                    </a>
                    
                    <a href="/nta/pricing-ladder" className="block text-center w-full">
                      <Button variant="outline" className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700 text-white py-6 text-lg rounded-xl">
                        See All Plans
                      </Button>
                    </a>

                    <div className="mt-8 text-center pt-8 border-t border-slate-800">
                      <p className="text-slate-400 mb-2">Want to talk to a real person first?</p>
                      <p className="text-white font-semibold">Call or text Rick at <a href="tel:641-420-8816" className="text-violet-400">641-420-8816</a></p>
                    </div>

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
      <SiteFooter />
    </div>
  );
}