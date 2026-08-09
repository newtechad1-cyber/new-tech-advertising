import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileText, Video, BookOpen, Map, CheckSquare, 
  LayoutTemplate, Download, ChevronRight, Filter, 
  Briefcase, Users, Brain, ShieldCheck
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

const CATEGORIES = [
  'All', 'Business Guides', 'AI Guides', 'Marketing Guides', 
  'Community Resources', 'Checklists', 'Templates', 
  'Videos', 'Case Studies', 'Roadmaps'
];

const AUDIENCES = ['All Audiences', 'Business Owner', 'Community Partner', 'AI Learner'];

const ASSETS = [
  {
    id: 1,
    title: 'The AI Shift: From Search to Answers',
    description: 'A comprehensive guide on how AI is changing local search behavior and what to do about it.',
    category: 'AI Guides',
    audience: 'Business Owner',
    type: 'PDF',
    icon: BookOpen,
    size: '3.2 MB',
    featured: true
  },
  {
    id: 2,
    title: 'NTA Growth Framework Roadmap',
    description: 'The exact step-by-step roadmap used to scale local service businesses.',
    category: 'Roadmaps',
    audience: 'Business Owner',
    type: 'PDF',
    icon: Map,
    size: '1.8 MB',
    featured: true
  },
  {
    id: 3,
    title: 'Community Partner Presentation Deck',
    description: 'Slide deck for presenting the NTA ecosystem to local chambers and groups.',
    category: 'Community Resources',
    audience: 'Community Partner',
    type: 'PPTX',
    icon: LayoutTemplate,
    size: '15.4 MB',
    featured: false
  },
  {
    id: 4,
    title: 'Website Accessibility (ADA) Checklist',
    description: 'Ensure your digital storefront is accessible to all users and protected from liability.',
    category: 'Checklists',
    audience: 'Business Owner',
    type: 'PDF',
    icon: CheckSquare,
    size: '0.9 MB',
    featured: false
  },
  {
    id: 5,
    title: 'Intro to Prompt Engineering for Local Marketing',
    description: 'Learn how to write effective prompts to generate localized content.',
    category: 'AI Guides',
    audience: 'AI Learner',
    type: 'PDF',
    icon: Brain,
    size: '4.1 MB',
    featured: false
  },
  {
    id: 6,
    title: 'Johnson Heating: 300% Lead Growth Case Study',
    description: 'Video breakdown of how an HVAC company dominated their local market.',
    category: 'Case Studies',
    audience: 'Business Owner',
    type: 'Video',
    icon: Video,
    size: '8 Mins',
    featured: true
  },
  {
    id: 7,
    title: 'Local SEO Strategy Template 2025',
    description: 'Fill-in-the-blank template for planning your local content strategy.',
    category: 'Templates',
    audience: 'Marketing Guides',
    type: 'DOCX',
    icon: FileText,
    size: '1.1 MB',
    featured: false
  },
  {
    id: 8,
    title: 'Ecosystem Partner Onboarding Guide',
    description: 'Complete checklist and guide for new NTA Community Partners.',
    category: 'Community Resources',
    audience: 'Community Partner',
    type: 'PDF',
    icon: Users,
    size: '2.5 MB',
    featured: false
  }
];

export default function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeAudience, setActiveAudience] = useState('All Audiences');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAssets = useMemo(() => {
    return ASSETS.filter(asset => {
      const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            asset.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || asset.category === activeCategory;
      const matchesAudience = activeAudience === 'All Audiences' || asset.audience === activeAudience;
      
      return matchesSearch && matchesCategory && matchesAudience;
    });
  }, [searchQuery, activeCategory, activeAudience]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      <SEOHead 
        title="Resource Library™ | NTA"
        description="Downloadable business guides, AI checklists, roadmaps, and templates for local business growth."
      />

      {/* Header */}
      <header className="relative py-16 md:py-24 border-b border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Library™</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Access our complete collection of business guides, AI implementation checklists, roadmaps, and community presentations.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl transition-opacity opacity-0 group-focus-within:opacity-100"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-5 w-6 h-6 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search for guides, templates, or topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 text-lg shadow-2xl"
              />
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="absolute right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors md:hidden"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className={`md:w-64 shrink-0 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">Audience</h3>
            <div className="space-y-1">
              {AUDIENCES.map(aud => (
                <button
                  key={aud}
                  onClick={() => setActiveAudience(aud)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeAudience === aud 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">Resource Type</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeCategory === cat 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  {activeCategory === cat && <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Resource Grid */}
        <div className="flex-1">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
              <p className="text-slate-400">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveAudience('All Audiences'); }}
                className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredAssets.map(asset => (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-3xl p-6 transition-all group flex flex-col h-full relative overflow-hidden"
                  >
                    {asset.featured && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-lg">
                        Featured
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-500/10 transition-colors">
                        <asset.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="pt-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-md">
                            {asset.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors leading-tight">
                          {asset.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3">
                      {asset.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="bg-slate-950 px-2 py-1 rounded-md border border-slate-800">{asset.type}</span>
                        <span>{asset.size}</span>
                      </div>
                      <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-xl">
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}