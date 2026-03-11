import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, ArrowRight, Calendar, Eye, Tv, Star, ChevronRight, BookOpen, Trophy, Megaphone, Users, Radio } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

const SCHOOL = {
  name: 'North Valley High School',
  mascot: 'Falcons',
  tagline: 'Your School. Your Stories. Live on Air.',
  navLabel: 'NVHS Falcons TV',
  primaryColor: '#1B2A4A',
  accentColor: '#2563EB',
  silverColor: '#94A3B8',
};

const CATEGORIES = [
  { id: 'all',              label: 'All',           icon: Tv },
  { id: 'sports_highlight', label: 'Sports',        icon: Trophy },
  { id: 'school_news',      label: 'News',          icon: BookOpen },
  { id: 'student_spotlight',label: 'Spotlights',    icon: Star },
  { id: 'event_story',      label: 'Events',        icon: Calendar },
  { id: 'club_feature',     label: 'Clubs',         icon: Users },
  { id: 'announcement',     label: 'Announcements', icon: Megaphone },
];

const CATEGORY_COLORS = {
  sports_highlight:  'bg-orange-500',
  school_news:       'bg-blue-600',
  student_spotlight: 'bg-purple-600',
  event_story:       'bg-green-600',
  club_feature:      'bg-cyan-600',
  announcement:      'bg-red-600',
};

const CATEGORY_LABELS = {
  sports_highlight:  'Sports',
  school_news:       'News',
  student_spotlight: 'Spotlight',
  event_story:       'Event',
  club_feature:      'Club',
  announcement:      'Announcement',
};

function CategoryBadge({ type }) {
  const color = CATEGORY_COLORS[type] || 'bg-slate-600';
  const label = CATEGORY_LABELS[type] || type;
  return (
    <span className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide`}>
      {label}
    </span>
  );
}

function ContentCard({ item }) {
  return (
    <a
      href={`/demo-school-story/${item.slug}`}
      className="group flex-none w-72 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/30"
    >
      <div className="relative h-44 bg-slate-700 overflow-hidden">
        {item.thumbnail_url
          ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600"><Tv className="h-10 w-10 text-slate-500" /></div>
        }
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-white/90 rounded-full p-3 shadow-lg">
            <Play className="h-6 w-6 text-slate-900 fill-slate-900" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <CategoryBadge type={item.content_type} />
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-blue-300 transition mb-1.5">
          {item.title}
        </h4>
        <p className="text-slate-400 text-xs line-clamp-2 mb-3">{item.summary}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{item.publish_date ? new Date(item.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{item.view_count || 0}</span>
        </div>
      </div>
    </a>
  );
}

function ContentRow({ title, icon: Icon, items }) {
  if (!items.length) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4 px-4 md:px-0">
        <Icon className="h-5 w-5 text-blue-400" />
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <ChevronRight className="h-4 w-4 text-slate-500" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 md:px-0">
        {items.map(item => <ContentCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export default function DemoSchoolChannel() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['demo-school-content'],
    queryFn: () => base44.asServiceRole.entities.DemoSchoolContent.filter(
      { publish_status: 'published' }, '-publish_date', 100
    )
  });

  const featuredItem = content.find(i => i.featured) || content[0];
  const nonFeatured = content.filter(i => i.id !== featuredItem?.id);

  const filtered = selectedCategory === 'all'
    ? nonFeatured
    : nonFeatured.filter(i => i.content_type === selectedCategory);

  const byType = (type) => nonFeatured.filter(i => i.content_type === type).slice(0, 8);

  return (
    <div className="bg-slate-900 min-h-screen">
      <MarketingNav />

      {/* ── NETWORK HERO ─────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#0A1628] via-[#0D1F3C] to-slate-900 pt-6 pb-0 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, #2563EB 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1B2A4A 0%, transparent 50%)'}} />

        <div className="relative max-w-7xl mx-auto px-4">

          {/* Network bar */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              <Radio className="h-4 w-4 animate-pulse" />
              LIVE DEMO CHANNEL
            </div>
            <span className="text-slate-500 text-sm">North Valley High School · Falcons Media Network</span>
          </div>

          {/* Main hero layout */}
          <div className="grid lg:grid-cols-2 gap-10 items-center pb-16">
            {/* Left: Branding */}
            <div>
              {/* Logo */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-900/50 border border-blue-500/30">
                  <span className="text-white font-black text-2xl">NV</span>
                </div>
                <div>
                  <div className="text-blue-400 font-semibold text-sm tracking-widest uppercase">Falcons Media Network</div>
                  <div className="text-white font-bold text-lg">North Valley High School</div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
                Your School.<br />
                <span className="text-blue-400">Your Stories.</span><br />
                Live on Air.
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                The Falcons Media Network delivers sports highlights, student stories, school news, and events — all produced automatically with AI and broadcast to your entire community.
              </p>
              <div className="flex flex-wrap gap-3">
                {featuredItem && (
                  <a href={`/demo-school-story/${featuredItem.slug}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-900/40">
                    <Play className="h-5 w-5 fill-white" /> Watch Featured Story
                  </a>
                )}
                <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold transition">
                  Book a Demo <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/schooltv-deal-room"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 px-4 py-3 font-semibold transition text-sm">
                  Launch Your School Channel <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right: Featured story card */}
            {featuredItem && (
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-2xl" />
                <a href={`/demo-school-story/${featuredItem.slug}`}
                  className="group relative block bg-slate-800 rounded-2xl overflow-hidden border border-slate-600/50 hover:border-blue-500/50 transition shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    {featuredItem.thumbnail_url
                      ? <img src={featuredItem.thumbnail_url} alt={featuredItem.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center"><Tv className="h-16 w-16 text-blue-400" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 group-hover:bg-white rounded-full p-5 shadow-2xl transition transform group-hover:scale-110">
                        <Play className="h-8 w-8 text-slate-900 fill-slate-900" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full tracking-wide uppercase">⭐ Featured</span>
                      <CategoryBadge type={featuredItem.content_type} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-xl leading-snug mb-2 group-hover:text-blue-300 transition">{featuredItem.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{featuredItem.summary}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />
                        {featuredItem.publish_date ? new Date(featuredItem.publish_date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'}) : ''}
                      </span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{featuredItem.view_count || 0} views</span>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <div className="bg-slate-800/80 border-y border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-6 md:gap-10 text-sm text-slate-400">
          <div className="flex items-center gap-2"><Tv className="h-4 w-4 text-blue-400" /><span><strong className="text-white">{content.length}</strong> Published Stories</span></div>
          <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-orange-400" /><span><strong className="text-white">{byType('sports_highlight').length}</strong> Sports Highlights</span></div>
          <div className="flex items-center gap-2"><Star className="h-4 w-4 text-purple-400" /><span><strong className="text-white">{byType('student_spotlight').length}</strong> Student Spotlights</span></div>
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-400" /><span><strong className="text-white">{byType('school_news').length}</strong> News Stories</span></div>
          <div className="ml-auto hidden md:flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
            <Radio className="h-3 w-3 animate-pulse" /> AI-Powered Demo Channel
          </div>
        </div>
      </div>

      {/* ── CATEGORY FILTER ───────────────────────────── */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> Loading channel...</div>
          </div>
        )}

        {selectedCategory === 'all' ? (
          // Streaming rows view
          <>
            <ContentRow title="Latest Episodes" icon={Tv} items={nonFeatured.slice(0, 8)} />
            <ContentRow title="Sports Highlights" icon={Trophy} items={byType('sports_highlight')} />
            <ContentRow title="Student Spotlights" icon={Star} items={byType('student_spotlight')} />
            <ContentRow title="School News" icon={BookOpen} items={byType('school_news')} />
            <ContentRow title="Events & Activities" icon={Calendar} items={byType('event_story')} />
            <ContentRow title="Clubs & Organizations" icon={Users} items={byType('club_feature')} />
            <ContentRow title="Announcements" icon={Megaphone} items={byType('announcement')} />
          </>
        ) : (
          // Filtered grid view
          <div>
            <h2 className="text-white font-bold text-2xl mb-6">
              {CATEGORIES.find(c => c.id === selectedCategory)?.label}
              <span className="text-slate-500 font-normal text-base ml-3">{filtered.length} stories</span>
            </h2>
            {filtered.length === 0 && !isLoading && (
              <div className="text-center py-20 text-slate-500">No content in this category yet.</div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(item => (
                <a key={item.id} href={`/demo-school-story/${item.slug}`}
                  className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/30">
                  <div className="relative h-44 bg-slate-700 overflow-hidden">
                    {item.thumbnail_url
                      ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      : <div className="w-full h-full flex items-center justify-center"><Tv className="h-10 w-10 text-slate-600" /></div>
                    }
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="bg-white/90 rounded-full p-3"><Play className="h-6 w-6 text-slate-900 fill-slate-900" /></div>
                    </div>
                    <div className="absolute top-2 left-2"><CategoryBadge type={item.content_type} /></div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-blue-300 transition mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.publish_date ? new Date(item.publish_date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : ''}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{item.view_count || 0}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── DEMO DISCLAIMER ───────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-6 py-4 flex items-start gap-3 text-sm text-slate-500">
          <span className="text-lg mt-0.5">🏫</span>
          <p><strong className="text-slate-400">Demo Channel:</strong> North Valley High School is a completely fictional school created to show what your school's streaming channel could look like. All content is AI-generated to demonstrate the platform's capabilities — student names, stories, and events are illustrative only.</p>
        </div>
      </div>

      {/* ── BOTTOM CTA ────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0D1F3C] to-slate-900 border-t border-slate-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Radio className="h-4 w-4" /> Ready to Go Live?
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Want a Channel Like This<br />for Your School?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            We build, brand, and launch your school's streaming media network — powered by student submissions, AI production, and your community's stories. Setup in under 3 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/bulldog-tv-sales" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/50">
              Book a Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a href="/schooltv-deal-room"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
              <Tv className="h-5 w-5" /> Launch Your School Channel
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}