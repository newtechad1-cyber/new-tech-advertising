import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { 
  Search, Shield, Users, MessageCircle, FolderKanban, Layout,
  ArrowRight, CheckCircle2 
} from 'lucide-react';

export default function Services() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <SEOHead
        title="Business Growth Solutions | New Tech Advertising"
        description="Explore connected business growth solutions for visibility, trust, leads, customer relationships, operations, AI, and automation—built in the right order for your business."
      />
      <MarketingNav />

      {/* 1. Hero section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">
            Solutions Built Around Your Business
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Solve the Right Problem Before Adding Another Tool
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Most business owners are not struggling because they lack software, advertising options, or marketing ideas. They are struggling because the pieces of the business are disconnected, priorities are unclear, and too much work depends on the owner.
            <br className="hidden sm:block" />
            <br className="hidden sm:block" />
            NTA helps identify the real bottleneck and then connects the right solutions in the right order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/growth-conversation" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Start a Growth Conversation
            </Link>
            <Link to="/operating-system" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium">
              Explore the Digital Growth Office
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Start with the business problem */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Where Does Your Business Need Help Most?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Customers Cannot Find Us</h3>
              <p className="text-blue-400 text-sm font-medium mb-4 uppercase tracking-wider">Visibility</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Website improvements</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Search visibility</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Local listings</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Content</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Social presence</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Advertising</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">People Find Us but Do Not Choose Us</h3>
              <p className="text-indigo-400 text-sm font-medium mb-4 uppercase tracking-wider">Trust</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Clear messaging</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Trust-building content</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Reviews</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Business credibility</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Helpful customer information</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Better website experience</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Leads Are Not Being Followed Up</h3>
              <p className="text-emerald-400 text-sm font-medium mb-4 uppercase tracking-wider">Leads and Sales</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Lead capture</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> CRM organization</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Response systems</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Sales conversations</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Proposals</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Follow-up automation</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 mb-6 border border-rose-500/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Customers Do Not Stay Connected</h3>
              <p className="text-rose-400 text-sm font-medium mb-4 uppercase tracking-wider">Customer Relationships</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Reviews</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Referrals</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Ongoing communication</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Customer education</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Retention</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Relationship systems</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Too Much Depends on the Owner</h3>
              <p className="text-amber-400 text-sm font-medium mb-4 uppercase tracking-wider">Operations</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Business processes</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Team workflows</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Organized knowledge</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Repetitive-task automation</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Clear responsibilities</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Back-office systems</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">We Have Tools but No System</h3>
              <p className="text-cyan-400 text-sm font-medium mb-4 uppercase tracking-wider">Digital Growth Office</p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Technology organization</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Data connections</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> AI assistance</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Reporting</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> Business priorities</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" /> One connected operating environment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How the solutions connect */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            One Business. One Direction. Connected Solutions.
          </h2>
          <p className="text-xl text-slate-400 mb-16 leading-relaxed">
            AI and automation are here to support your system — not to replace the owner, your employees, or your customer relationships. Every piece connects logically to build your business.
          </p>
          
          <div className="flex flex-col gap-4 text-left">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Foundation</h3>
                <p className="text-slate-400">Website, search presence, listings, accessibility, and core business information.</p>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 ml-0 md:ml-8">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Visibility and Trust</h3>
                <p className="text-slate-400">Content, social publishing, reputation, education, and proof.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 ml-0 md:ml-16">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Leads and Relationships</h3>
                <p className="text-slate-400">Lead capture, CRM, follow-up, reviews, referrals, and retention.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 ml-0 md:ml-24">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold shrink-0">4</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Operations and Knowledge</h3>
                <p className="text-slate-400">Processes, customer records, scheduling, tasks, documents, and business expertise.</p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl flex items-start gap-4 ml-0 md:ml-32">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">5</div>
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">AI and Automation</h3>
                <p className="text-slate-300">Practical assistance connecting and supporting the other areas under human direction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Solution paths */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Choose the Place That Best Matches Your Situation
          </h2>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
            
            {/* Group 1 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                Build My Foundation
              </h3>
              <div className="space-y-4">
                <Link to="/services/website-rebuilds" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Website Design & Rebuilds</h4>
                  <p className="text-slate-400 text-sm mb-3">Modern, mobile-responsive websites built for speed, SEO, and conversions.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/AiSeo" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">AI Search Optimization</h4>
                  <p className="text-slate-400 text-sm mb-3">Get found in Google, Bing, and AI search engines by optimizing local visibility.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Explore <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/accessible-websites" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Website Accessibility (ADA)</h4>
                  <p className="text-slate-400 text-sm mb-3">Protect your business from ADA lawsuits and serve all customers.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/Free-Audit" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Free Visibility Audit</h4>
                  <p className="text-slate-400 text-sm mb-3">Identify exactly where your business stands in search and what to fix first.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">See How It Works <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>
            </div>

            {/* Group 2 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                Help Me Reach and Educate Customers
              </h3>
              <div className="space-y-4">
                <Link to="/services/social-media-management" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Social Media Management</h4>
                  <p className="text-slate-400 text-sm mb-3">Consistent, professional social media content across platforms, supported by AI.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/AiVideos" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">AI Video Production</h4>
                  <p className="text-slate-400 text-sm mb-3">Professional video content without the production costs for social and web.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Explore <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/AiAdvertising" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">AI Advertising</h4>
                  <p className="text-slate-400 text-sm mb-3">Targeted digital advertising across Search, Social, and Streaming TV.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">See How It Works <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>
            </div>

            {/* Group 3 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                Help Me Manage Leads and Relationships
              </h3>
              <div className="space-y-4">
                <Link to="/growth-conversation" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Growth Conversation</h4>
                  <p className="text-slate-400 text-sm mb-3">A guided discussion to clarify your lead flow and customer journey bottlenecks.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/relationship-builder" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Relationship Builder</h4>
                  <p className="text-slate-400 text-sm mb-3">Systems to follow up with leads, generate reviews, and foster long-term loyalty.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Explore <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>
            </div>

            {/* Group 4 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                Help Me Organize and Operate the Business
              </h3>
              <div className="space-y-4">
                <Link to="/operating-system" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">NTA Operating System™</h4>
                  <p className="text-slate-400 text-sm mb-3">The complete methodology behind building a connected, modern growth system.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Learn More <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/back-office-solutions" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Back-Office Solutions</h4>
                  <p className="text-slate-400 text-sm mb-3">Software to connect your tasks, documents, scheduling, and business knowledge.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Explore <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/business-score" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Business Score</h4>
                  <p className="text-slate-400 text-sm mb-3">Measure how your current operations and marketing stack up against industry standards.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">See How It Works <ArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/LocalBusinessMarketing" className="block bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors group">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Local Industry Solutions</h4>
                  <p className="text-slate-400 text-sm mb-3">Specialized approaches for contractors, restaurants, health practices, and more.</p>
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1">Explore <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Not every business starts in the same place */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            You Do Not Have to Build Everything at Once
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-left">
              <h3 className="text-xl font-bold text-white mb-4">Start With Clarity</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Growth Conversation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Business Score</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Gap identification</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> One immediate priority</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-left">
              <h3 className="text-xl font-bold text-white mb-4">Build the Essentials</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div> Foundation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div> Visibility</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div> Trust</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div> Lead and relationship systems</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-left">
              <h3 className="text-xl font-bold text-white mb-4">Connect and Expand</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div> Automation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div> AI support</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div> Business knowledge</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div> Back-office workflows</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div> Reporting and continuous improvement</li>
              </ul>
            </div>
          </div>
          
          <div className="inline-block bg-blue-900/20 border border-blue-500/30 text-blue-300 px-6 py-4 rounded-xl text-lg font-medium">
            We build the right system in the right order, based on the needs and readiness of the business.
          </div>
        </div>
      </section>

      {/* 6. Recommended starting points */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Not Sure Where to Begin?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/growth-conversation" className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors text-center group">
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">I Need to Understand What Is Wrong</h3>
              <p className="text-slate-400 text-sm mb-6">Clarify your bottlenecks and map out the exact obstacles standing in the way of predictable growth.</p>
              <span className="text-blue-400 font-medium text-sm flex items-center justify-center gap-1">Start <ArrowRight className="w-4 h-4" /></span>
            </Link>
            
            <Link to="/business-score" className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors text-center group">
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">I Want to Measure Where My Business Stands</h3>
              <p className="text-slate-400 text-sm mb-6">Take a quick assessment to grade your foundation, operations, and marketing health.</p>
              <span className="text-indigo-400 font-medium text-sm flex items-center justify-center gap-1">Measure <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link to="/operating-system" className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors text-center group">
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">I Want to See the Complete System</h3>
              <p className="text-slate-400 text-sm mb-6">Explore the full methodology and see how the NTA Digital Growth Office connects every piece.</p>
              <span className="text-purple-400 font-medium text-sm flex items-center justify-center gap-1">Explore <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Final call to action */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            The Best Solution Starts With the Right Conversation
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Before recommending a website, campaign, CRM, automation, or AI tool, NTA first works to understand the business, the owner, the customers, and the real obstacles to growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/growth-conversation" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Start Your Growth Conversation
            </Link>
            <Link to="/book-call" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium">
              Book a Call
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}