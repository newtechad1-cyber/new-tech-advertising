import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, ArrowRight, Play, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';

export default function TvVideo() {
  const scrollToContact = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDQwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xNCAzNmMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6bTQwIDBjLTIuMjEgMC00LTEuNzktNC00czEuNzktNCA0LTQgNCAxLjc5IDQgNC0xLjc5IDQtNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              TV Advertising Still Works.<br />
              <span className="text-blue-400">Now It Works Smarter.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              After a decade in broadcast television, New Tech Advertising brings the power of TV advertising into today's streaming, digital, and AI-driven world — with better targeting, clearer measurement, and less waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto"
              >
                Request a TV & Video Strategy Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToContact}
                className="border-2 border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-6 h-auto"
              >
                See If This Is Right for Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 text-center">
            Built by Someone Who Knows TV Advertising — From the Inside
          </h2>
          
          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700 space-y-6">
            <p className="text-xl leading-relaxed">
              Before founding New Tech Advertising, I spent <strong>10 years as an Account Executive at a local ABC television station.</strong>
            </p>
            
            <p className="text-xl leading-relaxed">
              I saw firsthand what TV advertising does better than any other medium — and where traditional TV falls short for growing businesses.
            </p>
            
            <p className="text-xl leading-relaxed">
              Today, we've taken the strengths of broadcast TV and combined them with modern streaming, digital video, and AI-assisted optimization.
            </p>
            
            <div className="text-center mt-12 pt-8 border-t-2 border-slate-200">
              <p className="text-2xl font-semibold text-slate-900">This isn't experimental advertising.</p>
              <p className="text-2xl font-semibold text-blue-600">It's evolved TV advertising.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12 text-center">
            The Problem With Traditional TV Advertising
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'You paid for broad audiences, not ideal customers',
              'You couldn\'t follow viewers across screens',
              'Measurement stopped at estimates and ratings',
              'Many businesses were priced out or locked into rigid schedules'
            ].map((problem, idx) => (
              <Card key={idx} className="p-6 bg-white border-2 border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-lg text-slate-700 font-medium">{problem}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <p className="text-xl text-center text-slate-600 mt-12 max-w-3xl mx-auto">
            Digital advertising promised precision — but lost the authority and impact of TV.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 text-center">
            Modern TV & Video Advertising — Without the Old Problems
          </h2>
          
          <p className="text-xl text-slate-700 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
            New Tech Advertising delivers TV-style presence across today's screens — streaming TV, digital video, and premium online placements — all connected into one intelligent system.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Play, title: 'The credibility and impact of TV' },
              { icon: Target, title: 'The precision of digital targeting' },
              { icon: Zap, title: 'AI-assisted optimization' },
              { icon: BarChart3, title: 'Human-led strategy and accountability' }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 text-center bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 hover:border-blue-300 transition-all">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-slate-900">{item.title}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center">
            How It Works
          </h2>
          
          <div className="space-y-12">
            {[
              {
                step: '1',
                title: 'Audience-First Planning',
                description: 'Identify who matters most and where they spend attention across streaming, video, and digital environments.'
              },
              {
                step: '2',
                title: 'TV & Video Visibility That Follows the Viewer',
                description: 'Your message appears across streaming TV platforms, premium video placements, and high-quality digital properties.'
              },
              {
                step: '3',
                title: 'AI-Assisted Optimization',
                description: 'Campaigns automatically shift budget toward what's performing best while reducing waste.'
              },
              {
                step: '4',
                title: 'Clear, Unified Reporting',
                description: 'Reporting connects awareness, engagement, and conversions so results make sense.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-lg text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 text-center">
            TV Didn't Die — It Moved
          </h2>
          
          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700 space-y-6 text-center">
            <p className="text-2xl font-semibold text-slate-900">
              People didn't stop watching TV.<br />
              They stopped watching it the same way.
            </p>
            
            <p className="text-xl leading-relaxed">
              Streaming and on-demand viewing replaced rigid schedules — and advertising finally caught up.
            </p>
            
            <p className="text-xl leading-relaxed font-semibold text-blue-600">
              Businesses that adapt gain smarter reach, better efficiency, and clearer accountability.
            </p>
          </div>
        </div>
      </section>

      {/* Qualification Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12 text-center">
            Who This Is For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Good Fit */}
            <Card className="p-8 bg-green-50 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                <Check className="h-7 w-7 text-green-600" />
                Good Fit
              </h3>
              <ul className="space-y-4">
                {[
                  'Businesses that value brand presence and credibility',
                  'Competitive or regional markets',
                  'Longer decision cycles',
                  'Businesses ready to invest in scalable growth'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Not a Fit */}
            <Card className="p-8 bg-red-50 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
                <X className="h-7 w-7 text-red-600" />
                Not a Fit
              </h3>
              <ul className="space-y-4">
                {[
                  'Short-term, urgent lead needs only',
                  'Very small or experimental budgets',
                  'Clients who want control over every placement'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          
          <p className="text-xl text-center text-slate-700 font-semibold italic">
            "We'll tell you honestly if this approach makes sense."
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12 text-center">
            Why Clients Trust New Tech Advertising
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              'Built on real broadcast TV experience',
              'Designed for today's streaming-first world',
              'Strategy-led, not automation-only',
              'Focused on outcomes, not hype'
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-slate-50 border-2 border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-lg text-slate-700 font-semibold">{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Modernize Your TV & Video Advertising?
          </h2>
          
          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="bg-white text-blue-600 hover:bg-slate-100 text-xl px-10 py-7 h-auto font-bold"
          >
            Request a TV & Video Strategy Review
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          
          <p className="text-slate-200 mt-8 text-lg">
            Enterprise-grade advertising technology.<br />
            Human strategy.<br />
            Measurable results.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6">
          <Card className="p-8 bg-white shadow-xl">
            <h3 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Request Your Strategy Review
            </h3>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              // Form submission logic here
              alert('Thank you! We will be in touch soon.');
            }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input type="text" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                <input type="text" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input type="tel" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tell us about your business</label>
                <textarea rows="4" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"></textarea>
              </div>
              
              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 h-auto">
                Submit Request
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}