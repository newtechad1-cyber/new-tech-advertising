import { Link } from 'react-router-dom';
import { 
  ArrowRight, BookOpen, Compass, ShieldCheck, TrendingUp, MonitorSmartphone, Target
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { getJourneyMemory } from '@/lib/journeyMemory';
import { aiFoundationsLessons } from '@/data/aiFoundations';

export default function LearningCenter() {
  const memory = getJourneyMemory();
  const businessProgress = memory.learningProgress?.businessFoundations || { completed: [] };
  const aiProgress = memory.learningProgress?.aiFoundations || { completed: [] };

  const collections = [
    {
      id: 'business-foundations',
      title: 'Business Foundations',
      description: 'The core principles of sustainable local business growth in the digital age.',
      icon: Target,
      color: 'emerald',
      path: '/knowledge/business-foundations',
      lessons: 7,
      difficulty: 'Beginner',
      time: '35 min',
      progress: Math.round((businessProgress.completed.length / 7) * 100) || 0
    },
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Practical, actionable understanding of how AI impacts search, operations, and marketing.',
      icon: MonitorSmartphone,
      color: 'blue',
      path: '/knowledge/ai-foundations',
      lessons: aiFoundationsLessons.length,
      difficulty: 'Beginner',
      time: 'About 90 min',
      progress: Math.round((aiProgress.completed.length / aiFoundationsLessons.length) * 100) || 0
    },
    {
      id: 'digital-visibility',
      title: 'Digital Visibility',
      description: 'Understanding zero-click searches, AI overviews, and how to get found today.',
      icon: Compass,
      color: 'purple',
      path: '/what-changed-online',
      lessons: 5,
      difficulty: 'Intermediate',
      time: '25 min',
      progress: 0
    },
    {
      id: 'growth-systems',
      title: 'Growth Systems',
      description: 'Why traditional campaigns fail and how to build automated lead generation machines.',
      icon: TrendingUp,
      color: 'orange',
      path: '/growth-systems-vs-campaigns',
      lessons: 4,
      difficulty: 'Intermediate',
      time: '20 min',
      progress: 0
    },
    {
      id: 'trust-relationships',
      title: 'Trust & Relationships',
      description: 'Using reputation, reviews, and accessibility as your primary growth engines.',
      icon: ShieldCheck,
      color: 'indigo',
      path: '/building-digital-trust',
      lessons: 3,
      difficulty: 'Advanced',
      time: '15 min',
      progress: 0
    },
    {
      id: 'founder-lessons',
      title: 'Founder Lessons',
      description: 'Insights and stories from Rick Hesse on navigating technological shifts.',
      icon: BookOpen,
      color: 'slate',
      path: '/i-was-early-again',
      lessons: 5,
      difficulty: 'All Levels',
      time: '25 min',
      progress: 0
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden flex flex-col">
      <SEOHead 
        title="Practical AI and Business Growth Lessons | NTA Knowledge Library"
        description="A connected curriculum for small-business owners: practical AI, business foundations, customer trust, durable relationships, owner knowledge, digital visibility, and growth systems."
        collectionData={{
          name: 'NTA Knowledge Library',
          description: 'Connected lessons that help small-business owners understand growth, preserve their knowledge, and use AI under human direction.',
          numberOfItems: collections.length,
          hasPart: collections.map(({ title: name, path: url }) => ({ name, url }))
        }}
      />
      <MarketingNav />
      
      <main className="flex-grow">
        <header className="relative pt-24 pb-20 px-6 text-center border-b border-slate-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
              <BookOpen className="w-4 h-4" />
              NTA Knowledge Library
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-[1.1] text-white tracking-tight">
              Learn To Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Growth Systems</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-medium">
              Learn how businesses really grow, how customers decide who to trust, and how to turn your experience and judgment into useful systems with AI—without giving up control of your business.
            </p>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map(collection => (
              <Link 
                key={collection.id} 
                to={collection.path} 
                className="group flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all shadow-lg relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-${collection.color}-500`} />
                <div className={`w-14 h-14 bg-${collection.color}-500/10 rounded-2xl flex items-center justify-center mb-6 text-${collection.color}-400 group-hover:scale-110 transition-transform`}>
                  <collection.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {collection.title}
                </h3>
                
                <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                  {collection.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                    {collection.difficulty}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                    {collection.lessons} Lessons
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                    {collection.time}
                  </span>
                </div>
                
                {collection.progress > 0 ? (
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                      <span>Progress</span>
                      <span className="text-blue-400">{collection.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${collection.progress}%` }}></div>
                    </div>
                    <div className="inline-flex items-center text-blue-400 font-semibold text-sm group-hover:text-blue-300 transition-colors">
                      Continue Learning <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto inline-flex items-center text-slate-300 font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    Start Collection <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
