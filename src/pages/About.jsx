import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import {
  ArrowRight, Play, Zap, Globe, Tv, Users, Shield, BarChart3,
  CheckCircle, Building2, GraduationCap, Heart, Megaphone, Star,
  Code2, Cpu, Video, TrendingUp, Sparkles, ChevronRight
} from 'lucide-react';

const INDUSTRIES = [
  { icon: Building2, label: 'Local Businesses', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'AI marketing tools, websites, and local visibility for service businesses, retail, and professional practices.' },
  { icon: GraduationCap, label: 'Schools & Districts', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'Streaming TV networks, student media platforms, and AI content publishing for K–12 schools.' },
  { icon: Heart, label: 'Nonprofits', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', desc: 'Mission-driven storytelling, community visibility, and AI-powered communications for nonprofits.' },
  { icon: Megaphone, label: 'Marketing Agencies', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', desc: 'White-label AI content, reseller programs, and platform infrastructure for agencies scaling their clients.' },
  { icon: Users, label: 'Service Professionals', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', desc: 'Reputation management, lead generation, and community presence for medical, legal, and trade professionals.' },
  { icon: Globe, label: 'Communities & Events', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', desc: 'Event promotion, local awareness campaigns, and streaming media for organizations and community groups.' },
];

const PLATFORMS = [
  { icon: Tv, name: 'School TV', desc: 'Streaming media networks for K–12 schools powered by student submissions and AI video production.' },
  { icon: Code2, name: 'AI Website Rebuild', desc: 'ADA-compliant, SEO-ready websites rebuilt with AI content engines that keep your site fresh automatically.' },
  { icon: BarChart3, name: 'AI Marketing Platform', desc: 'Social media, video, blog, and email content generated and published automatically from a single dashboard.' },
  { icon: Shield, name: 'ADA Compliance', desc: 'Website accessibility auditing, remediation, and ongoing compliance monitoring to protect your business.' },
];

const FUTURE_POINTS = [
  { title: 'Every school has a streaming media network', desc: 'Student stories, sports highlights, and school news published automatically — community visibility built in.' },
  { title: 'Every business has an AI marketing engine', desc: 'Content, video, social, and SEO handled automatically so businesses can focus on what they do best.' },
  { title: 'Video replaces static content everywhere', desc: 'The next decade belongs to video-first communication. We build the infrastructure that makes it accessible.' },
  { title: 'AI handles the production — humans handle the strategy', desc: 'We put powerful AI tools into the hands of non-technical people without requiring a marketing degree.' },
];

export default function About() {
  React.useEffect(() => {
    document.title = 'About New Tech Advertising | AI-Powered Marketing Platforms';
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen">
      <MarketingNav />

      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 overflow-hidden pt-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Marketing Infrastructure
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Building the Platforms That<br />
            <span className="text-blue-400">Power Modern Marketing</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            New Tech Advertising develops AI-powered systems that help businesses, schools, and organizations create content, automate marketing, and connect with their communities.
          </p>
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

        {/* Platform strip */}
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

      {/* ── 2. MISSION ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Our Mission</div>
              <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                Make powerful marketing infrastructure accessible to everyone
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                For too long, the kind of marketing infrastructure that big companies use — streaming channels, AI content engines, automated publishing, SEO systems — has been out of reach for local businesses, schools, and community organizations.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                We're changing that. By building purpose-built platforms that run on AI and require no technical expertise, we give every organization the tools to build a real digital presence, connect with their community, and grow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '500+', label: 'Businesses Served', color: 'text-blue-400' },
                { number: '3', label: 'Active AI Platforms', color: 'text-purple-400' },
                { number: '100%', label: 'U.S.-Based Team', color: 'text-green-400' },
                { number: '∞', label: 'Content Potential', color: 'text-orange-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
                  <div className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.number}</div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FOUNDER STORY ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">The Story</div>
            <h2 className="text-4xl font-extrabold text-white">Built from the ground up</h2>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="text-5xl text-blue-500/30 font-black leading-none mb-6">"</div>
              <blockquote className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-10 font-medium">
                I started New Tech Advertising because I saw a clear gap: the businesses, schools, and organizations that needed marketing the most were the ones with the least access to the right tools. I wanted to build platforms that closed that gap — not just a marketing agency, but real technology infrastructure that works without a full-time marketing team.
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-lg">N</div>
                <div>
                  <div className="text-white font-bold">Founder, New Tech Advertising</div>
                  <div className="text-slate-500 text-sm">AI Marketing Infrastructure Builder</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: Zap, title: 'Started with a simple belief', desc: 'Every business deserves access to marketing tools that actually work — not just templates and advice.' },
              { icon: Cpu, title: 'Built AI into the foundation', desc: 'We didn\'t bolt AI on as a feature. We rebuilt our platforms from the ground up around AI production.' },
              { icon: TrendingUp, title: 'Scaled into multiple industries', desc: 'What started as local business marketing grew into streaming TV for schools, AI websites, and beyond.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <Icon className="h-6 w-6 text-blue-400 mb-3" />
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PLATFORM APPROACH ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">How We Build</div>
            <h2 className="text-4xl font-extrabold text-white mb-4">Platforms, not projects</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We don't build one-off websites or run campaigns in isolation. We build integrated platforms that keep working — generating content, publishing media, and growing presence automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PLATFORMS.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 transition group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600/30 transition">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{name}</h3>
                    <p className="text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                { label: 'AI-Generated Content', desc: 'Every platform produces content automatically — articles, videos, social posts, and more.' },
                { label: 'No Technical Skills Required', desc: 'Built for administrators, principals, and business owners — not developers.' },
                { label: 'Always-On Publishing', desc: 'Content is created and published on a schedule without manual intervention.' },
              ].map(item => (
                <div key={item.label}>
                  <CheckCircle className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-semibold mb-1">{item.label}</div>
                  <div className="text-slate-400 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VIDEO & MEDIA FOCUS ───────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Video-First</div>
              <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                Video is the language of the modern internet
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                We built our platforms around video because video is what drives engagement, builds trust, and creates community connection. Text-only marketing is no longer enough — and video production used to be expensive and technical.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Our AI systems automatically produce broadcast-quality video content from raw media, student submissions, or business inputs — no editor, no production team, no waiting weeks for a deliverable.
              </p>
              <div className="space-y-3">
                {[
                  'AI-generated video scripts and narration',
                  'Automated highlight reels and episode production',
                  'Multi-platform publishing in one click',
                  'Branded intros, captions, and music — automatic',
                  'School streaming channels with full content libraries',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual block */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-3xl blur-2xl" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" /></div>
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

      {/* ── 6. INDUSTRIES SERVED ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Industries</div>
            <h2 className="text-4xl font-extrabold text-white mb-4">Built for people with a community to serve</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our platforms are designed for organizations that need to communicate — consistently, professionally, and at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map(({ icon: Icon, label, color, bg, desc }) => (
              <div key={label} className={`border rounded-2xl p-6 ${bg} hover:scale-[1.01] transition`}>
                <Icon className={`h-7 w-7 ${color} mb-3`} />
                <h3 className="text-white font-bold text-lg mb-2">{label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FUTURE OF MARKETING ───────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Where We're Headed</div>
            <h2 className="text-4xl font-extrabold text-white mb-4">The future of marketing is automated, video-first, and community-centered</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We're not chasing trends. We're building the infrastructure for how organizations will communicate for the next decade.
            </p>
          </div>

          <div className="space-y-5">
            {FUTURE_POINTS.map((point, i) => (
              <div key={i} className="flex items-start gap-5 bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 rounded-2xl p-6 transition">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-black text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{point.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{point.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600 shrink-0 mt-1" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-white mb-2">We're already building it.</p>
            <p className="text-slate-400">School TV networks. AI website engines. Automated marketing platforms. Real technology, deployed today.</p>
          </div>
        </div>
      </section>

      {/* ── 8. CLOSING CTA ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0D1F3C] via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <Star className="h-4 w-4" /> Ready to Build Something Real?
          </div>
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Let's build your platform
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're a school looking for a streaming media network, a business that needs AI-powered marketing, or an organization that wants to connect with its community — we have a platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-900/50">
              Book a Strategy Call <ArrowRight className="h-5 w-5" />
            </a>
            <Link to={createPageUrl('SchoolTVDealRoom')}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-10 py-4 rounded-xl text-lg transition">
              <Tv className="h-5 w-5" /> See School TV Platform
            </Link>
          </div>

          {/* Quick nav */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            {[
              { label: 'AI Website Rebuild', to: 'Rebuild' },
              { label: 'ADA Compliance', to: 'AdaAccessibility' },
              { label: 'School TV', to: 'SchoolTVDealRoom' },
              { label: 'Contact Us', to: 'Contact' },
            ].map(({ label, to }) => (
              <Link key={label} to={createPageUrl(to)}
                className="text-slate-400 hover:text-blue-400 transition flex items-center gap-1">
                {label} <ChevronRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}