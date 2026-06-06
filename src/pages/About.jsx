import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import {
  ArrowRight, Play, Zap, Globe, Tv, Users, Shield, BarChart3,
  CheckCircle, Building2, GraduationCap, Heart, Code2, Cpu,
  Video, TrendingUp, Sparkles, ChevronRight, Star
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';
const HEADSHOT_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/c099addb0_headshot.png';
const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function About() {
  return (
    <div className="bg-slate-900 min-h-screen">
      <SEOHead 
        title="About New Tech Advertising | AI Marketing, Mason City IA"
        description="Rick Hesse founded New Tech Advertising to bring AI-powered marketing to North Iowa small businesses. HVAC, plumbing & restaurant specialists. Mason City, Iowa."
      />
      <MarketingNav />

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            About New Tech Advertising
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8">
            Building the Platforms That<br />
            <span className="text-blue-400">Power Modern Marketing</span>
          </h1>

          <div className="max-w-3xl mx-auto text-left space-y-5 text-slate-300 text-lg leading-relaxed mb-12">
            <p>Marketing has changed.</p>
            <p>
              For years businesses were told they needed complex strategies, expensive agencies, and endless marketing tools just to stay competitive.
            </p>
            <p className="font-semibold text-white">But technology has changed everything.</p>
            <p>
              Artificial intelligence, automation, and modern media platforms now allow businesses and organizations to do things that once required entire marketing departments.
            </p>
            <p className="text-blue-300 font-semibold text-xl">New Tech Advertising was built to make those tools accessible.</p>
            <p>
              We build platforms that help businesses, schools, and organizations create content, publish media, improve visibility, and connect with their communities using modern technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-lg shadow-blue-900/40">
              Work With Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to={createPageUrl('SchoolTVDealRoom')}
              className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition">
              <Play className="w-4 h-4 fill-current" /> See Our Platforms
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 py-4 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm font-medium">
            {['School Streaming TV', 'AI Website Rebuild', 'ADA Compliance', 'AI Marketing Platform', 'Video Production', 'Local SEO', 'Content Automation'].map(p => (
              <span key={p} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />{p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. MISSION ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Our Mission</div>
              <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                Our mission is simple
              </h2>
              <p className="text-slate-300 text-xl leading-relaxed mb-4 font-medium">
                Give organizations the technology they need to compete in a modern digital world.
              </p>
              <p className="text-slate-500 mb-2">Not complicated marketing strategies.</p>
              <p className="text-slate-500 mb-8">Not expensive agency retainers.</p>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Instead, we build systems that work automatically in the background — helping organizations accomplish more with less effort.
              </p>
              <p className="text-slate-300 font-semibold mt-6">The goal is not just marketing.</p>
              <p className="text-blue-400 font-bold text-lg">The goal is building long-term digital infrastructure.</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: BarChart3, label: 'Publish consistent content', desc: 'Automated publishing keeps your presence active without manual effort.' },
                { icon: Video, label: 'Create professional video and media', desc: 'AI-powered video production without a production team.' },
                { icon: Globe, label: 'Improve search visibility', desc: 'Programmatic SEO and local presence optimization built in.' },
                { icon: Zap, label: 'Automate repetitive marketing work', desc: 'Systems that handle the routine so you can focus on what matters.' },
                { icon: Users, label: 'Strengthen community relationships', desc: 'Storytelling platforms that connect you to the people you serve.' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{label}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FOUNDER STORY ────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">My Story</div>
            <h2 className="text-4xl font-extrabold text-white">The Man Behind the Mission</h2>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative grid md:grid-cols-3 gap-10 items-start">

              {/* Founder photo */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 blur opacity-40" />
                  <img
                    src={HEADSHOT_URL}
                    alt="Founder, New Tech Advertising"
                    className="relative w-44 h-52 object-cover object-top rounded-2xl border-2 border-blue-500/40 shadow-xl"
                  />
                </div>
                <img
                  src={LOGO_URL}
                  alt="New Tech Advertising"
                  className="h-7 w-auto object-contain mb-3 opacity-90"
                />
                <div className="text-white font-bold text-sm">Founder & CEO</div>
                <div className="text-blue-400 text-xs font-semibold">New Tech Advertising</div>
              </div>

              {/* Story */}
              <div className="md:col-span-2 space-y-5 text-slate-300 leading-relaxed">
                <p>
                  I grew up without a father. He left when I was four or five years old, and most of my memories from those early years are completely blacked out. What I do remember is the emptiness — a hollow space inside me that I didn't have a name for yet.
                </p>
                <p>
                  We lived in a small, cramped two-bedroom house. My mother raised four children entirely on her own, stretching government assistance and food programs to keep us alive. At school, the kids whose parents paid for their lunches carried white tickets. Mine was green. Standing in that lunch line holding that green ticket, I felt marked as different and less than everyone else.
                </p>
                <p>
                  By sixteen, I was sitting in a parked car with friends, getting high every day just to numb reality. But somewhere in that haze, a question kept echoing: <span className="italic text-slate-400">There has to be more to my life than this.</span>
                </p>
                <p>There was.</p>
                <p>
                  At seventeen, everything changed. I found faith, direction, and the first real sense of purpose I'd ever known. By nineteen I was married. By twenty, I was a father. By twenty-two, I had three children and a retail business selling waterbeds — a kid trying to figure out how to make payroll, fix a house, and hold a family together all at the same time.
                </p>
                <p>
                  The business went bankrupt. The marriage didn't survive. I found myself standing in the wreckage of everything I'd built, with three small children who needed a stable home.
                </p>
                <p>
                  So I rebuilt. I took a job selling television advertising and stayed with it for the next ten years. My car became my classroom — what I call my <span className="italic text-slate-400">windshield university.</span> I spent thousands of hours on Iowa highways listening to every personal development tape I could find, learning how to think clearly, communicate honestly, and become the kind of man my kids could count on.
                </p>
                <p>
                  I raised my children mostly on my own. I made mistakes — some I'm still working through with them. But I showed up. Every single day, I showed up.
                </p>
                <p>
                  Over more than a decade in advertising, I sat across the table from hundreds of small business owners. I saw the same struggle over and over: good people doing honest work, getting crushed by marketing costs they couldn't afford and technology they couldn't keep up with. I knew that frustration because I'd lived it myself at twenty years old.
                </p>
                <p>
                  In 2012, I started New Tech Advertising to do something about it. For over a decade, I've helped local businesses get their message out — learning every platform, every algorithm change, every new tool as it came along.
                </p>
                <p>
                  Then, a couple of years ago, I started researching artificial intelligence. I didn't see a scary trend or a gimmick. I saw the thing I'd been waiting for my entire career: a way to finally give the little guy a real chance. The tools that used to require entire marketing departments and massive budgets were suddenly accessible to a one-person shop on Main Street.
                </p>
                <p>
                  This year, it's all coming together. I've spent the past year working ten- to twelve-hour days mastering these tools — not because I'm running from poverty like I was in my twenties, but because I'm running toward something I've been preparing for my entire life.
                </p>
                <p>
                  Everything I went through — the broken home, the failed business, the years of selling, the solitude — brought me here. I know what it feels like to build something with nothing. I know what it costs to start over. And I know exactly how to package modern technology so a local business owner can actually use it, at a price they can actually afford.
                </p>
                <p className="text-white font-bold">
                  I'm nearly 68 years old. My heart is full. And I'm just getting started.
                </p>
                <p className="text-blue-400 font-semibold text-sm mt-4">
                  — Rick Hesse, Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PLATFORM APPROACH ────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Our Approach</div>
            <h2 className="text-4xl font-extrabold text-white mb-4">A Platform Approach — Not a Traditional Agency</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              New Tech Advertising is not a traditional marketing agency. We focus on building technology platforms that organizations can use to manage their own content, media, and digital presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              { icon: Cpu, name: 'AI-Powered Content Creation', desc: 'Systems that generate articles, videos, social posts, and more — automatically.' },
              { icon: Zap, name: 'Automated Publishing Workflows', desc: 'Set it up once. Content goes out consistently without manual intervention.' },
              { icon: Video, name: 'Video & Media Generation', desc: 'Broadcast-quality video produced from raw media or simple inputs.' },
              { icon: Globe, name: 'Search Visibility Optimization', desc: 'Local SEO, programmatic pages, and ongoing presence built into every platform.' },
              { icon: Users, name: 'Community Storytelling Platforms', desc: 'Channels that capture and share the stories happening in your organization.' },
              { icon: TrendingUp, name: 'Continuous Content Stream', desc: 'These systems produce a constant stream of content without needing a marketing team.' },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition group">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-white font-bold mb-2 text-sm">{name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
            <p className="text-white font-bold text-xl mb-2">
              These systems allow organizations to produce a continuous stream of content without needing a large marketing team.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. VIDEO FOCUS ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Video-First</div>
              <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                The Power of Video
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-4 font-medium">
                Video has become the most powerful form of communication.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                People engage with video more than any other type of content online. That's why the platforms we build emphasize video-first communication — giving every organization the ability to tell their story through the most compelling medium available.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Video allows organizations to communicate with their audiences in ways that traditional marketing cannot.
              </p>
              <div className="space-y-3">
                {[
                  'Video storytelling',
                  'Short-form media',
                  'Streaming channels',
                  'Visual content creation',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual block */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-3xl blur-2xl" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="text-slate-500 text-xs font-mono ml-2">AI Video Engine — Live</div>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { label: 'Source media uploaded', status: '✅ complete', color: 'text-green-400' },
                    { label: 'AI script generation', status: '✅ complete', color: 'text-green-400' },
                    { label: 'Voiceover synthesis', status: '✅ complete', color: 'text-green-400' },
                    { label: 'Caption generation', status: '⚡ rendering', color: 'text-blue-400' },
                    { label: 'Branding applied', status: '⏳ queued', color: 'text-slate-500' },
                    { label: 'Multi-platform publish', status: '⏳ queued', color: 'text-slate-500' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <span className="text-slate-300 text-sm">{row.label}</span>
                      <span className={`text-xs font-semibold ${row.color}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-600/10 border-t border-blue-500/20 px-6 py-4">
                  <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold">
                    <Video className="h-4 w-4" /> Video ready in ~4 minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5b. HELPING TELL STORIES ────────────────────────── */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Storytelling</div>
          <h2 className="text-4xl font-extrabold text-white mb-6">Helping Organizations Tell Their Stories</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            Every organization has stories worth sharing. Businesses serve their communities. Schools educate and inspire students. Local organizations create meaningful change.
          </p>
          <p className="text-white font-bold text-xl mb-4">The challenge is not the stories themselves.</p>
          <p className="text-blue-400 font-bold text-xl mb-10">The challenge is getting those stories seen.</p>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto">
            New Tech Advertising platforms help organizations turn everyday moments into powerful content that reaches their audience and strengthens their reputation.
          </p>
        </div>
      </section>

      {/* ── 6. INDUSTRIES ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Industries We Serve</div>
            <h2 className="text-4xl font-extrabold text-white mb-4">Built for organizations that want to modernize how they communicate</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
                label: 'Small and Mid-Sized Businesses',
                desc: 'Businesses that want modern marketing systems without hiring large agencies.',
              },
              {
                icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20',
                label: 'Schools and School Districts',
                desc: 'Schools using media platforms to highlight student achievements and connect with their communities.',
              },
              {
                icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20',
                label: 'Community Organizations',
                desc: 'Organizations that want to increase visibility and share their impact.',
              },
            ].map(({ icon: Icon, color, bg, label, desc }) => (
              <div key={label} className={`border rounded-2xl p-8 ${bg}`}>
                <Icon className={`h-8 w-8 ${color} mb-4`} />
                <h3 className="text-white font-bold text-lg mb-3">{label}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FUTURE OF MARKETING ──────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Looking Ahead</div>
            <h2 className="text-4xl font-extrabold text-white mb-6">The Future of Marketing</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We believe the future of marketing will be built on three foundations:
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              {['Automation', 'Video', 'Artificial Intelligence'].map(item => (
                <span key={item} className="bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold px-6 py-2 rounded-full text-lg">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-10 text-center mb-12">
            <p className="text-white text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              Organizations that embrace these tools will have a major advantage in the years ahead.
              New Tech Advertising exists to help businesses and organizations make that transition successfully.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. CLOSING CTA ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0D1F3C] via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src={LOGO_URL}
            alt="New Tech Advertising"
            className="h-10 w-auto object-contain mx-auto mb-8 opacity-90"
          />
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <Star className="h-4 w-4" /> Let's Build the Future Together
          </div>
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Technology should empower organizations — not overwhelm them.
          </h2>
          <p className="text-slate-400 text-xl mb-4 max-w-3xl mx-auto leading-relaxed">
            New Tech Advertising builds the systems that make modern marketing simpler, more powerful, and more effective.
          </p>
          <p className="text-slate-400 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            If you're interested in learning how these platforms can help your organization grow, connect with your audience, and share your story more effectively, we'd love to show you what's possible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-900/50">
              Book a Strategy Call <ArrowRight className="h-5 w-5" />
            </a>
            <a href={TRIAL_URL}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-10 py-4 rounded-xl text-lg transition">
              Start Free Trial
            </a>
          </div>

          <div className="flex flex-wrap gap-4 justify-center text-sm mt-8">
            {[
              { label: 'AI Website Rebuild', to: 'Rebuild' },
              { label: 'ADA Compliance', to: 'AdaAccessibility' },
              { label: 'School TV', to: 'SchoolTVDealRoom' },
              { label: 'Streaming TV', to: 'StreamingTV' },
              { label: 'Contact Us', to: 'Contact' },
            ].map(({ label, to }) => (
              <Link key={label} to={createPageUrl(to)}
                className="text-slate-500 hover:text-blue-400 transition flex items-center gap-1">
                {label} <ChevronRight className="h-3 w-3" />
              </Link>
            ))}
          </div>

          <p className="text-slate-600 text-sm mt-12 font-medium italic">
            New Tech Advertising — Building the platforms that power modern marketing.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}