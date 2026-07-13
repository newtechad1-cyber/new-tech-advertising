import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search, Filter, Home, BookOpen } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function KnowledgeLibraryLayout({ 
  title, 
  subtitle, 
  breadcrumbCurrent,
  categories = [],
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  seoTitle,
  seoDescription,
  children 
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <SEOHead 
        title={seoTitle || `${title} | NTA Knowledge Center`} 
        description={seoDescription || subtitle} 
      />
      <MarketingNav />
      
      {/* Header & Breadcrumbs */}
      <div className="bg-slate-950 text-white pt-10 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/brand-book" className="hover:text-white transition-colors flex items-center gap-1"><BookOpen className="w-4 h-4" /> Brand Book</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white" aria-current="page">{breadcrumbCurrent}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search library..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  aria-label="Search"
                />
              </div>
            </div>

            <div className="lg:hidden mb-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-medium"
              >
                <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> Categories</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
              </button>
            </div>

            <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Categories</h3>
              </div>
              <ul className="p-2 space-y-1">
                <li>
                  <button 
                    onClick={() => onCategoryChange('All')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === 'All' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => onCategoryChange(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}