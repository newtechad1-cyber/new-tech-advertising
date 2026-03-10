import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { Play, Users, BarChart3, Shield, Zap, ArrowRight } from 'lucide-react';

export default function SchoolTV() {
  return (
    <div className="bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Your School's Own Streaming TV Network</h1>
          <p className="text-xl text-blue-100 mb-8">Let students create authentic stories. Control the narrative. Build community through video.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition">
              Schedule a Demo
            </a>
            <Link to={createPageUrl('SchoolTVDemo')} className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
              Watch 3-Min Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Built for Schools, By Educators</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-lg">
              <Users className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Student-Created Content</h3>
              <p className="text-slate-300">Empower students to tell their own stories. The platform guides them through easy uploads and submissions.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <Shield className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Admin Control</h3>
              <p className="text-slate-300">Review, approve, and moderate content before it goes live. Full transparency and safety guardrails.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <Zap className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">AI-Powered Production</h3>
              <p className="text-slate-300">Auto-generate captions, video scripts, and highlights. Reduce production time from hours to minutes.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <Play className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Beautiful Publishing</h3>
              <p className="text-slate-300">Automatic branded video rendering. Publish to your gallery, YouTube, or social in one click.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <BarChart3 className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Analytics & Insights</h3>
              <p className="text-slate-300">Track viewership, engagement, and which stories resonate most with your community.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <Users className="h-10 w-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Unified Platform</h3>
              <p className="text-slate-300">One dashboard for submissions, approvals, video creation, and publishing. No platform juggling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Schools Get */}
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Your School Gets</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">Branded Streaming Hub</h3>
                <p className="text-slate-300">A custom streaming platform with your school colors, logo, and branding throughout.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">Student Submission Portal</h3>
                <p className="text-slate-300">Easy-to-use portal where students upload videos, photos, and stories for review.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">Moderation & Admin Tools</h3>
                <p className="text-slate-300">Review submissions, manage content safety, approve before publishing, and manage permissions.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">AI Content Generation</h3>
                <p className="text-slate-300">Automatic video scripts, captions, highlights, and story generation from student submissions.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">Video Production & Rendering</h3>
                <p className="text-slate-300">Automated video creation with branded intros/outros, music, and professional quality output.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">Multi-Platform Publishing</h3>
                <p className="text-slate-300">Publish videos to your school gallery, YouTube, Facebook, Instagram, and website automatically.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
              <div>
                <h3 className="font-bold text-lg">Engagement Analytics</h3>
                <p className="text-slate-300">Track video views, viewer demographics, engagement rates, and community growth over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Sports Highlights</h3>
              <p className="text-slate-300">Turn game footage into professional highlight reels. Auto-generated captions, music, and graphics.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Student Stories & Spotlights</h3>
              <p className="text-slate-300">Feature student achievements, club activities, performances, and memorable moments.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Faculty Spotlights</h3>
              <p className="text-slate-300">Highlight teacher stories, career paths, and classroom innovations.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Event Recaps</h3>
              <p className="text-slate-300">Concerts, assemblies, competitions, and special events captured and shared instantly.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Yearbook & Memories</h3>
              <p className="text-slate-300">Video-based yearbooks that capture memories beyond photos.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Recruitment & Alumni</h3>
              <p className="text-slate-300">Showcase your school to prospective students and reconnect with alumni.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Launch Your School's Streaming Platform?</h2>
          <p className="text-xl text-blue-100 mb-8">See how other schools are building community and engagement through student-created video.</p>
          <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition gap-2">
            Schedule Your Demo <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}