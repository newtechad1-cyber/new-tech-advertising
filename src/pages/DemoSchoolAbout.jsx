import React from 'react';
import { ArrowRight } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

export default function DemoSchoolAbout() {
  return (
    <div className="bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About North Valley High School</h1>
          <p className="text-xl text-slate-300">This is a fictional demo school built to showcase the School Media Platform</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why We Built This Demo</h2>
          <p className="text-slate-700 mb-6">
            North Valley High School is a completely fictional school created to demonstrate the capabilities of the School Media Platform. Every detail—the school name, mascot, branding, and all content—is designed to show school administrators exactly what their own institution could build.
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">The Fictional School</h2>
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">North Valley High School</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Mascot:</strong> Falcons</li>
              <li><strong>Colors:</strong> Navy, Silver, and Accent Blue</li>
              <li><strong>Motto:</strong> "Soar Higher Every Day"</li>
              <li><strong>Tagline:</strong> "Where Excellence Takes Flight"</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">Demo Content</h2>
          <p className="text-slate-700 mb-6">
            All content published on the North Valley channel is <strong>AI-generated</strong> and designed to be school-safe and appropriate. We use:
          </p>
          <ul className="space-y-2 text-slate-700 mb-6">
            <li>✓ Fictional student names and scenarios</li>
            <li>✓ Stock photography and AI-generated visuals only</li>
            <li>✓ Realistic school activities (sports, academics, arts, community service)</li>
            <li>✓ Professional scripts and story structures</li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">What This Demonstrates</h2>
          <p className="text-slate-700 mb-6">
            By exploring the North Valley demo channel, you'll see:
          </p>
          <ul className="space-y-2 text-slate-700 mb-6">
            <li>📺 A branded streaming channel that feels authentic</li>
            <li>✨ Professional content across multiple categories (sports, academics, arts, announcements)</li>
            <li>🎯 Featured stories and categorized browsing</li>
            <li>📊 Engagement metrics (view counts, publish dates)</li>
            <li>⚡ How AI-generated content can be school-appropriate and compelling</li>
            <li>🔄 A continuously updated channel with fresh content</li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">How Real Schools Use the Platform</h2>
          <p className="text-slate-700 mb-6">
            Your school will use this platform differently from the demo:
          </p>
          <ul className="space-y-2 text-slate-700 mb-6">
            <li>✓ <strong>Real students</strong> submit authentic content (photos, videos, stories)</li>
            <li>✓ <strong>Your staff</strong> reviews and approves submissions before publishing</li>
            <li>✓ <strong>The system</strong> automatically generates professional videos from approved content</li>
            <li>✓ <strong>Your channel</strong> publishes to your streaming gallery, YouTube, social media, and website</li>
            <li>✓ <strong>Your community</strong> watches authentic stories from your school</li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">Fictional, But Realistic</h2>
          <p className="text-slate-700 mb-6">
            While North Valley is entirely fictional, the content it publishes reflects realistic school activities that every institution experiences:
          </p>
          <ul className="space-y-2 text-slate-700 mb-6">
            <li>Sports achievements and tournament coverage</li>
            <li>Student spotlights and academic excellence</li>
            <li>Club activities and student leadership</li>
            <li>Performing arts and special events</li>
            <li>Community service and school announcements</li>
            <li>Faculty spotlights and school spirit</li>
          </ul>

          <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-12">No Real Likenesses or Names</h2>
          <p className="text-slate-700 mb-6">
            To ensure complete privacy and accuracy, the demo uses:
          </p>
          <ul className="space-y-2 text-slate-700 mb-6">
            <li>✓ Only stock photography and AI-generated images</li>
            <li>✓ Completely fictional student and staff names</li>
            <li>✓ No references to real schools or districts</li>
            <li>✓ School-safe, positive, age-appropriate content throughout</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See Your Own School Channel?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Book a personalized demo and we'll show you exactly how your school can launch a streaming platform like North Valley's.
          </p>
          <a 
            href="https://calendly.com/bulldog-tv-sales" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition gap-2"
          >
            Book Your Demo <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}