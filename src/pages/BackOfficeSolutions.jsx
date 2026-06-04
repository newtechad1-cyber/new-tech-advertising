import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import BackOfficeProblem from '../components/back-office/BackOfficeProblem';
import BackOfficeFeatures from '../components/back-office/BackOfficeFeatures';
import SEOHead from '../components/shared/SEOHead';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function BackOfficeSolutions() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300">
      <SEOHead 
        title="Back-Office Solutions | Run Your Business Smarter"
        description="Custom business software that replaces QuickBooks, spreadsheets, and manual dispatch. Built specifically for service businesses."
      />
      <MarketingNav />
      
      {/* App Preview / Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-20 px-6 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-8">
            🛠️ Back-Office Solutions for Service Businesses
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight max-w-4xl mx-auto tracking-tight">
            Ditch the Spreadsheets.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Run Your Business From One Screen.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Custom business software that replaces QuickBooks, paper dispatch, and disconnected tools. Built for HVAC, plumbing, and contractor businesses — by someone who actually understands the trade.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <a href="https://johnson-backoffice-f202e3a3.viktor.space" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
              See a Live Demo →
            </a>
            <a href="tel:6414208816" className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 bg-slate-900/50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center gap-2">
              📞 Call 641-420-8816
            </a>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-8 gap-y-3 text-slate-300 font-medium text-sm md:text-base mb-16">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> No monthly QuickBooks fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Works on phone & tablet
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Built in days, not months
            </div>
          </div>
          
          {/* App Preview Image / Mockup Container */}
          <div className="relative max-w-5xl mx-auto bg-slate-900 rounded-t-3xl border border-slate-800 p-2 shadow-2xl overflow-hidden">
            <div className="bg-slate-950 rounded-t-2xl overflow-hidden aspect-[16/9] border border-slate-800 flex items-center justify-center relative">
              {/* Fallback mockup since we don't have a real screenshot */}
              <div className="absolute top-0 w-full h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <div className="mx-auto w-1/3 h-6 bg-slate-800 rounded-md"></div>
              </div>
              <div className="w-full h-full pt-12 flex">
                <div className="w-48 bg-slate-900/50 border-r border-slate-800 p-4 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="h-24 bg-slate-800 rounded-xl flex-1 border border-slate-700/50"></div>
                    <div className="h-24 bg-slate-800 rounded-xl flex-1 border border-slate-700/50"></div>
                    <div className="h-24 bg-slate-800 rounded-xl flex-1 border border-slate-700/50"></div>
                  </div>
                  <div className="h-64 bg-slate-800 rounded-xl border border-slate-700/50 w-full mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Two New Sections */}
      <BackOfficeProblem />
      <BackOfficeFeatures />

      <SiteFooter />
    </div>
  );
}