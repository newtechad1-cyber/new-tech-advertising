import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { Play, ArrowRight, Check } from 'lucide-react';

export default function SchoolTVDemo() {
  return (
    <div className="bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">See SchoolTV in Action</h1>
          <p className="text-lg text-blue-100 mb-8">3-minute walkthrough showing how your school can build a streaming platform powered by student stories.</p>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-8">
            <div className="text-center">
              <Play className="h-20 w-20 text-blue-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-blue-200">3-minute demo video coming soon</p>
              <p className="text-sm text-slate-400 mt-2">In the meantime, schedule a live walkthrough with our team</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Student Upload Portal</h3>
              <p className="text-slate-300 text-sm">How students easily submit videos, photos, and stories for review.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Admin Review & Approval</h3>
              <p className="text-slate-300 text-sm">Moderating submissions and managing content safety before publishing.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">AI Video Generation</h3>
              <p className="text-slate-300 text-sm">Watch AI automatically create scripts, captions, and rendered videos in minutes.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Professional Publishing</h3>
              <p className="text-slate-300 text-sm">One-click publishing to your gallery, YouTube, social media, and website.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Analytics & Insights</h3>
              <p className="text-slate-300 text-sm">Track engagement, viewership, and community impact of each story.</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">School Branding</h3>
              <p className="text-slate-300 text-sm">Every video automatically branded with your school colors, logo, and identity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Students Submit Content</h3>
                <p className="text-slate-300">Students upload videos, photos, and descriptions through an easy portal. They tell the story.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <h3 className="font-bold text-lg mb-2">You Review & Approve</h3>
                <p className="text-slate-300">Your team reviews submissions, ensures they meet guidelines, and approves them for production.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h3 className="font-bold text-lg mb-2">AI Creates the Video</h3>
                <p className="text-slate-300">AI generates professional scripts, auto-edits footage, adds captions, music, and branding automatically.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">4</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Publish Everywhere</h3>
                <p className="text-slate-300">One-click publishing to your streaming gallery, YouTube, Facebook, Instagram, and website.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">5</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Track Engagement</h3>
                <p className="text-slate-300">View analytics on who's watching, how long they engage, and which stories resonate most.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Results */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Schools Are Seeing</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <p className="text-slate-300">Student submissions per school annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <p className="text-slate-300">Average monthly views per school</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">80%+</div>
              <p className="text-slate-300">Engagement rate on student-created videos</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-slate-200">Reduced video production time from weeks to hours</p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-slate-200">Increased student engagement and school pride</p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-slate-200">Professional quality videos without the expertise or cost</p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-slate-200">Consistent brand presence across all platforms</p>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-slate-200">Better recruitment and alumni engagement</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">How long does setup take?</h3>
              <p className="text-slate-300">Most schools are live within 2-3 weeks. We handle branding, student portal setup, and staff training.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">What if we don't have video production experience?</h3>
              <p className="text-slate-300">That's the point! The AI handles video production. Your team just approves submissions and the videos are made automatically.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Can we control what gets published?</h3>
              <p className="text-slate-300">Yes. Every submission goes through your review and approval process before it's used for video generation or publishing.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Does it work on mobile?</h3>
              <p className="text-slate-300">Yes. Students can submit from phones, tablets, or computers. Everything is mobile-friendly.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Can we publish to multiple platforms at once?</h3>
              <p className="text-slate-300">Absolutely. Publish to your school gallery, YouTube, Facebook, Instagram, and website simultaneously with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to See Your School's Streaming Platform?</h2>
          <p className="text-lg text-blue-100 mb-8">Get a live walkthrough from our team. We'll show you exactly how it works and answer all your questions.</p>
          <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition gap-2">
            Schedule a Demo <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-blue-200 text-sm mt-4">Live demos available Monday-Friday, 9am-5pm CT</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}