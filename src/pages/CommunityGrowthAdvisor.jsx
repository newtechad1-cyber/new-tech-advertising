import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Presentation, TrendingDown, Lightbulb, 
  Map, Target, ArrowRight, ShieldCheck, 
  ChevronRight, ChevronLeft, Handshake, BrainCircuit,
  TrendingUp, Star, Building2, Repeat, CheckCircle2
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

const SLIDES = [
  {
    id: 'intro',
    headline: "You Already Have The Relationships.",
    supporting: "The NTA Operating System™ gives you the tools, education, and business growth framework to help local businesses confidently navigate the digital world.",
    icon: Handshake,
    color: "indigo"
  },
  {
    id: 'audience',
    headline: "Who This Is For",
    supporting: "Designed for those who already serve local businesses but want to offer more value.",
    icon: Users,
    color: "blue",
    points: [
      "Media & Radio Sales Representatives",
      "Newspaper & Print Account Executives",
      "Chambers of Commerce & Economic Development",
      "B2B Consultants & Community Leaders",
      "Local Influencers & Connectors"
    ]
  },
  {
    id: 'challenge-1',
    headline: "Traditional Advertising Is Changing",
    supporting: "Local businesses are overwhelmed. They are being pitched disconnected services rather than unified growth strategies.",
    icon: TrendingDown,
    color: "rose",
    bullets: [
      "Fragmented marketing efforts waste budgets",
      "Digital risk is increasing for unprotected businesses",
      "Business owners are tired of being 'sold to'"
    ]
  },
  {
    id: 'challenge-2',
    headline: "Businesses Need Guidance More Than Advertising",
    supporting: "Before they spend another dollar on ads, they need a foundation built on trust, visibility, and a clear roadmap.",
    icon: Lightbulb,
    color: "amber",
    bullets: [
      "They need education over pitches",
      "They need a clear assessment of where they stand",
      "They need a trusted advisor in their corner"
    ]
  },
  {
    id: 'role',
    headline: "Your New Role",
    title: "Community Growth Advisor™",
    supporting: "You become the bridge. You connect local business owners with the education and tools they need, elevating your own position from salesperson to strategic advisor.",
    icon: ShieldCheck,
    color: "emerald"
  },
  {
    id: 'how-it-works',
    headline: "How It Works",
    supporting: "A seamless, professional handoff that protects your relationship and delivers massive value.",
    icon: Map,
    color: "purple",
    flow: [
      { step: 1, title: "Meet Business Owner", desc: "You identify a business that needs growth guidance." },
      { step: 2, title: "Introduce Digital Growth Guide™", desc: "You invite them into the free educational platform." },
      { step: 3, title: "Business Completes Discovery", desc: "They engage with our interactive assessment." },
      { step: 4, title: "Business Score™", desc: "They receive an objective score of their digital health." },
      { step: 5, title: "Growth Roadmap™", desc: "A custom plan is generated for their specific needs." },
      { step: 6, title: "Rick Handles Implementation", desc: "The NTA team does the heavy lifting." },
      { step: 7, title: "You Continue Supporting", desc: "You maintain the relationship and earn recurring revenue." }
    ]
  },
  {
    id: 'benefits',
    headline: "The Benefits",
    supporting: "When you help your community grow, everyone wins.",
    icon: Target,
    color: "blue",
    features: [
      { icon: Repeat, title: "Recurring Revenue", desc: "Build a compounding income stream from every successful referral." },
      { icon: Star, title: "Greater Credibility", desc: "Position yourself as a forward-thinking strategic partner." },
      { icon: Handshake, title: "Better Relationships", desc: "Deepen trust by providing high-value, educational solutions." },
      { icon: Users, title: "More Referrals", desc: "Happy businesses naturally introduce you to other owners." },
      { icon: Building2, title: "Strengthen Your Community", desc: "Help local businesses thrive in the modern digital economy." }
    ]
  },
  {
    id: 'closing',
    headline: "You Don't Need To Become A Marketing Expert.",
    supporting: "The Operating System™ does the teaching.\n\nYou simply introduce businesses to a better way to grow.",
    icon: BrainCircuit,
    color: "indigo",
    isClosing: true
  }
];

export default function CommunityGrowthAdvisor() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      y: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
    },
    exit: (dir) => ({
      zIndex: 0,
      y: dir < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
    })
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  const getColorClasses = (color) => {
    const colors = {
      indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10",
      blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
      rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
      amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
      emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
      purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10"
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      <SEOHead 
        title="Community Growth Advisor™ | NTA"
        description="Discover your role in helping local businesses thrive within the NTA Operating System™."
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 z-50">
        <motion.div 
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <main className="flex-1 relative flex items-center justify-center min-h-[calc(100vh-80px)] p-6 pt-20 pb-24">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center relative z-10"
          >
            {/* Context Badge */}
            {!slide.isClosing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${getColorClasses(slide.color)} text-sm font-semibold tracking-wide uppercase mb-8 shadow-lg`}
              >
                <Icon className="w-4 h-4" /> 
                {slide.title || 'NTA Operating System™'}
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight max-w-3xl"
            >
              {slide.headline}
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed whitespace-pre-line"
            >
              {slide.supporting}
            </motion.p>

            {/* Slide Specific Content */}
            
            {/* Points (Slide 2) */}
            {slide.points && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full max-w-2xl"
              >
                {slide.points.map((point, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${getColorClasses(slide.color).split(' ')[0]}`} />
                    <span className="text-white font-medium">{point}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Bullets (Slide 3 & 4) */}
            {slide.bullets && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 space-y-4 text-left w-full max-w-xl"
              >
                {slide.bullets.map((bullet, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                    <ArrowRight className={`w-6 h-6 shrink-0 mt-0.5 ${getColorClasses(slide.color).split(' ')[0]}`} />
                    <span className="text-lg text-slate-300">{bullet}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Flow (Slide 6) */}
            {slide.flow && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 w-full max-w-3xl text-left relative"
              >
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-800 hidden md:block"></div>
                <div className="space-y-4">
                  {slide.flow.map((item, idx) => (
                    <div key={idx} className="relative flex items-center gap-6">
                      <div className={`hidden md:flex w-12 h-12 rounded-full border border-slate-700 bg-slate-900 shrink-0 items-center justify-center z-10 font-bold ${item.step === 7 ? 'text-indigo-400 border-indigo-500/30' : 'text-slate-400'}`}>
                        {item.step}
                      </div>
                      <div className={`flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 ${item.step === 7 ? 'border-indigo-500/30 bg-indigo-500/5' : ''}`}>
                        <h4 className="text-white font-bold text-lg mb-1">
                          <span className="md:hidden text-slate-500 mr-2">{item.step}.</span>
                          {item.title}
                        </h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Features (Slide 7) */}
            {slide.features && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-4xl"
              >
                {slide.features.map((feature, idx) => {
                  const FIcon = feature.icon;
                  return (
                    <div key={idx} className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 ${idx === slide.features.length - 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${getColorClasses(slide.color)}`}>
                        <FIcon className="w-5 h-5" />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  )
                })}
              </motion.div>
            )}

            {/* Closing Buttons (Slide 8) */}
            {slide.isClosing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-16 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-3xl"
              >
                <button 
                  onClick={() => navigate('/partner-portal')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 text-lg w-full sm:w-auto"
                >
                  Become A Founding Advisor
                </button>
                <button 
                  onClick={() => navigate('/book-call')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-700 w-full sm:w-auto"
                >
                  Schedule Strategy Meeting
                </button>
                <button 
                  onClick={() => navigate('/operating-system')}
                  className="bg-transparent hover:bg-slate-900 text-slate-300 px-8 py-4 rounded-xl font-bold transition-all border border-slate-800 w-full sm:w-auto"
                >
                  Explore OS™
                </button>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-slate-500 text-sm font-medium px-4">
              {currentSlide + 1} / {SLIDES.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentSlide < SLIDES.length - 1 ? (
              <button
                onClick={nextSlide}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Return Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}