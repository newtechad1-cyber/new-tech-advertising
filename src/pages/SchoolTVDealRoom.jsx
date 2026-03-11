import React from 'react';
import { Download, Play, Check, Shield, Users, Zap, BookOpen, BarChart3, ArrowRight, Search, TrendingUp, Star, Megaphone, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

export default function SchoolTVDealRoom() {
  return (
    <div className="bg-white">
      <MarketingNav />
      
      {/* Section 1: Welcome */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to the School Media Platform Demo</h1>
          <p className="text-xl text-slate-300">Everything you need to evaluate launching your school's streaming TV network.</p>
        </div>
      </section>

      {/* Section 2: 3-Minute Demo */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-6">
            <div className="text-center text-white">
              <Play className="h-20 w-20 text-blue-400 mx-auto mb-4" />
              <p className="text-lg font-semibold">3-minute platform demo video</p>
              <p className="text-sm text-slate-400 mt-2">Shows student submissions, admin moderation, and streaming TV channel</p>
            </div>
          </div>
          <p className="text-slate-700 text-center mb-6">
            This short video shows how students submit stories, administrators moderate content, and the platform turns school events into a streaming TV channel.
          </p>
          <div className="text-center">
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Book a Live Demo
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">How the Platform Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4 font-bold text-blue-600 text-xl">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Students Submit Stories</h3>
              <p className="text-slate-700 mb-4 text-sm leading-relaxed">Students upload:</p>
              <ul className="text-slate-600 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Photos</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Videos</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Event coverage</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> School announcements</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4 font-bold text-blue-600 text-xl">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Admin Moderation</h3>
              <p className="text-slate-700 mb-4 text-sm">Administrators review submissions before publishing.</p>
              <p className="text-slate-700 mb-3 text-sm font-semibold">Controls include:</p>
              <ul className="text-slate-600 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Student logins</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Moderation dashboard</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> AI safety detection</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Approval workflow</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4 font-bold text-blue-600 text-xl">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Produces Media</h3>
              <p className="text-slate-700 mb-4 text-sm">The system can automatically create:</p>
              <ul className="text-slate-600 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Highlight reels</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Sports clips</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Feature stories</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Announcements</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4 font-bold text-blue-600 text-xl">4</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Watches</h3>
              <p className="text-slate-700 mb-4 text-sm">Schools get their own streaming TV channel for:</p>
              <ul className="text-slate-600 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Sports highlights</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> School news</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Student stories</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span> Events</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Why Schools Use It */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Why Schools Use It</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Benefits */}
            <div>
              <div className="bg-blue-50 rounded-lg p-8">
                <Users className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Student Benefits</h3>
                <p className="text-slate-700 mb-4">Students gain experience in:</p>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Journalism</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Video production</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Storytelling</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Social media</li>
                </ul>
              </div>
            </div>

            {/* School Benefits */}
            <div>
              <div className="bg-blue-50 rounded-lg p-8">
                <Zap className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">School Benefits</h3>
                <p className="text-slate-700 mb-4">Schools promote:</p>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Student achievements</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Sports programs</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Arts programs</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Academic success</li>
                </ul>
              </div>
            </div>

            {/* Community Benefits */}
            <div>
              <div className="bg-blue-50 rounded-lg p-8">
                <BarChart3 className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Community Benefits</h3>
                <p className="text-slate-700 mb-4">Communities stay connected to:</p>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> School activities</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Events</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Local pride</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /> Student growth</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Safety & Moderation */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Safety and Moderation</h2>
          <div className="bg-white rounded-lg border border-slate-200 p-12">
            <p className="text-slate-700 text-center mb-12 text-lg font-semibold">Schools trust our platform because we prioritize safety at every step:</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Student Identity Login</h3>
                  <p className="text-slate-600 text-sm">Every student is authenticated. Full accountability for submissions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Upload Accountability</h3>
                  <p className="text-slate-600 text-sm">Every upload is tracked and logged for audit trails.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Admin Approval Before Publishing</h3>
                  <p className="text-slate-600 text-sm">No content goes live without administrator review and approval.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">AI Explicit-Content Detection</h3>
                  <p className="text-slate-600 text-sm">Automatic flagging of inappropriate content for admin review.</p>
                </div>
              </div>
              <div className="flex gap-4 md:col-span-2">
                <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Full Moderation Workflow</h3>
                  <p className="text-slate-600 text-sm">Multi-step approval process ensures only safe, appropriate content reaches your streaming channel.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Platform Overview */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-slate-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Student Portal</h3>
              <p className="text-slate-600 mb-4">Easy-to-use interface where students submit videos, photos, and stories for review and publication.</p>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• Mobile-friendly upload interface</li>
                <li>• Media organization and descriptions</li>
                <li>• Submission history and tracking</li>
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Admin Moderation</h3>
              <p className="text-slate-600 mb-4">Complete control over content with approval workflows and safety checks.</p>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• Review queue management</li>
                <li>• AI safety flagging</li>
                <li>• Approve, reject, or request changes</li>
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Video Creation</h3>
              <p className="text-slate-600 mb-4">Automatically produce professional videos from submitted content.</p>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• Auto-generated scripts and captions</li>
                <li>• Professional video editing</li>
                <li>• School branding applied automatically</li>
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Streaming TV Channel</h3>
              <p className="text-slate-600 mb-4">Your school's branded media hub accessible to students, families, and the community.</p>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• Beautiful, mobile-friendly viewer</li>
                <li>• Multi-platform publishing (YouTube, Facebook)</li>
                <li>• Engagement analytics and insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter School</h3>
              <p className="text-slate-600 mb-6">Perfect for schools getting started</p>
              <div className="text-4xl font-bold text-slate-900 mb-6">$2,500 <span className="text-lg text-slate-600">/year</span></div>
              <ul className="text-slate-600 space-y-2 text-sm mb-8">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Student portal</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Admin moderation</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> 100 AI videos/year</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Streaming channel</li>
              </ul>
              <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="block text-center bg-slate-100 text-slate-900 py-2 rounded font-semibold hover:bg-slate-200 transition">
                Get Started
              </a>
            </div>

            <div className="bg-blue-600 rounded-lg p-8 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-700 px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Growth School</h3>
              <p className="text-blue-100 mb-6">For schools scaling content production</p>
              <div className="text-4xl font-bold mb-6">$5,000 <span className="text-lg text-blue-100">/year</span></div>
              <ul className="text-blue-100 space-y-2 text-sm mb-8">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> Everything in Starter</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> 500 AI videos/year</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> Multi-platform publishing</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 flex-shrink-0 mt-0.5" /> Analytics dashboard</li>
              </ul>
              <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="block text-center bg-white text-blue-600 py-2 rounded font-semibold hover:bg-blue-50 transition">
                Get Started
              </a>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">District Pricing</h3>
              <p className="text-slate-600 mb-6">For multiple schools and districts</p>
              <div className="text-3xl font-bold text-slate-900 mb-6">Custom</div>
              <ul className="text-slate-600 space-y-2 text-sm mb-8">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Unlimited schools</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Volume discounts</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Dedicated support</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" /> Custom integrations</li>
              </ul>
              <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="block text-center bg-slate-100 text-slate-900 py-2 rounded font-semibold hover:bg-slate-200 transition">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: FAQs */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">How long does it take to launch?</h3>
              <p className="text-slate-600">Usually a few weeks. We handle all the setup: branding customization, student portal configuration, staff training, and initial content production.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Do students manage content?</h3>
              <p className="text-slate-600">Students submit content through our portal, but administrators have complete control over what gets published. Every submission is reviewed and approved before it's used for video production or publishing.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Is it safe?</h3>
              <p className="text-slate-600">Yes. All uploads require student login for accountability. Content goes through AI safety detection, then administrator review before publishing. Full moderation workflow ensures nothing inappropriate reaches your channel.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">What if we don't have video production experience?</h3>
              <p className="text-slate-600">That's the point! Our AI handles video production automatically. Your team just approves submissions, and the system produces professional videos. We also provide training and support.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Can we control what goes on our streaming channel?</h3>
              <p className="text-slate-600">Completely. Administrators review every submission and approve content before it's used. You have full control over what gets published to your streaming channel.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Does it work on mobile?</h3>
              <p className="text-slate-600">Yes. Students can submit from phones, tablets, or computers. The entire platform is mobile-friendly.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Can we publish to multiple platforms?</h3>
              <p className="text-slate-600">Yes. You can publish to your school streaming gallery, YouTube, Facebook, Instagram, and your website simultaneously with one click.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">What support do we get?</h3>
              <p className="text-slate-600">You get onboarding, training, ongoing support, and direct access to our team. We're here to help you succeed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: AI-Powered Community Visibility */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Search className="h-4 w-4" />
              New Feature
            </div>
            <h2 className="text-4xl font-bold mb-4">AI-Powered Community Visibility</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              School TV doesn't just stream content — it automatically turns your students' stories into SEO-friendly articles, videos, and updates that help your school appear in local search results and stay top-of-mind in the community.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="flex-1">
                <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">How It Works</div>
                <p className="text-slate-200 text-base leading-relaxed">
                  Every piece of student content — a sports recap, a club feature, a student spotlight — is automatically transformed by AI into a published article, video, and social update. These are indexed by search engines, shared across platforms, and tied directly to your school's online presence.
                </p>
                <p className="text-slate-400 text-sm mt-3">
                  Connected to our <span className="text-blue-400 font-semibold">AI Website Rebuild platform</span>, your school's site stays fresh with new, relevant content without your staff lifting a finger.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-xl px-8 py-6">
                <TrendingUp className="h-10 w-10 text-blue-400" />
                <div className="text-2xl font-bold text-white">Auto-Published</div>
                <div className="text-blue-300 text-sm text-center">SEO articles, videos &<br />community updates</div>
              </div>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Star className="h-7 w-7 text-yellow-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Highlight Student Achievements</h3>
              <p className="text-slate-400 text-sm">Every award, honor roll, and standout moment becomes a published story that families and the community can find and share online.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Heart className="h-7 w-7 text-pink-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Increase Parent Engagement</h3>
              <p className="text-slate-400 text-sm">Parents stay connected through real-time content from inside your school — published automatically to your site, social channels, and streaming platform.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Megaphone className="h-7 w-7 text-orange-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Promote Athletics & Events</h3>
              <p className="text-slate-400 text-sm">Game recaps, tournament highlights, and event previews are automatically formatted as SEO articles and shared to local audiences searching online.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Users className="h-7 w-7 text-cyan-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Improve Community Awareness</h3>
              <p className="text-slate-400 text-sm">Your school becomes a recognized presence in local search results, helping community members discover what's happening and feel connected.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Globe className="h-7 w-7 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Strengthen Online Presence</h3>
              <p className="text-slate-400 text-sm">Fresh, keyword-rich content published consistently — across your school site and streaming platform — builds long-term authority in local search.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <Search className="h-7 w-7 text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Show Up in Local Search</h3>
              <p className="text-slate-400 text-sm">When parents search "[your school] football" or "[your school] news," your school's content appears — automatically created from what students already submit.</p>
            </div>
          </div>

          {/* Connection callout */}
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-7 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-blue-300 font-bold text-sm uppercase tracking-widest mb-2">Powered by the AI Website Rebuild Platform</div>
              <p className="text-white text-base font-semibold mb-1">One ecosystem. Student content → streaming channel → school website → local search.</p>
              <p className="text-slate-400 text-sm">School TV plugs directly into our AI Website Rebuild engine, so approved content from your students automatically keeps your school's website fresh, visible, and ranking.</p>
            </div>
            <Link to={createPageUrl('Rebuild')}>
              <button className="shrink-0 bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition whitespace-nowrap flex items-center gap-2">
                Learn About AI Website Rebuild <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your School's Streaming TV Network</h2>
          <p className="text-lg text-blue-100 mb-10">See how to launch in your school in under 3 weeks.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition gap-2">
              Book a Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a href="/schooltv-demo" className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-500 transition gap-2">
              Watch Demo <Play className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 9.5: Live Demo School Example */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-slate-900">See a Live Example Channel</h2>
          <p className="text-center text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            This is North Valley High School—a completely fictional demo school built to show what your school's streaming channel could look like. All content is AI-generated to demonstrate the platform's capabilities.
          </p>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="bg-blue-900 p-8 md:w-1/2 flex flex-col justify-center text-white">
                <h3 className="text-3xl font-bold mb-4">North Valley High School</h3>
                <p className="text-blue-100 mb-6">
                  A fictional school demonstrating how your institution can automatically generate, moderate, and publish professional school media content.
                </p>
                <ul className="space-y-3 mb-8 text-blue-100">
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white flex-shrink-0" /> 6 AI-generated stories</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white flex-shrink-0" /> Featured sports highlights</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white flex-shrink-0" /> Student spotlights</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white flex-shrink-0" /> Event coverage & announcements</li>
                </ul>
                <a href="/demo-school-channel" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition w-fit">
                  Explore Demo Channel →
                </a>
              </div>
              <div className="md:w-1/2 bg-slate-200 min-h-64 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-blue-600 mx-auto mb-3" />
                  <p className="text-slate-700 font-semibold">Click to explore the live demo channel</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-2">📺 Streaming Channel</h4>
              <p className="text-slate-600 text-sm">Beautiful, branded media hub with featured stories and categorized content.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-2">🤖 AI-Generated Content</h4>
              <p className="text-slate-600 text-sm">All stories automatically created with scripts, visuals, and metadata.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-2">⚡ Fully Functional</h4>
              <p className="text-slate-600 text-sm">Demonstrates story details, view counts, categories, and user engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Sales Tools */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Resources for Your Decision</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <a href="#" className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition text-center">
              <Download className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Download Case Study</h3>
              <p className="text-slate-300 text-sm">See how schools have successfully launched their streaming platforms.</p>
            </a>
            <a href="#" className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition text-center">
              <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Launch Guide</h3>
              <p className="text-slate-300 text-sm">Step-by-step guide to launching your school's streaming TV network.</p>
            </a>
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer" className="bg-slate-800 rounded-lg p-8 hover:bg-slate-700 transition text-center">
              <Users className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Contact Sales</h3>
              <p className="text-slate-300 text-sm">Talk with our team about your school's specific needs.</p>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}