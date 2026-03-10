import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, ArrowRight, Calendar, Eye } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

export default function DemoSchoolChannel() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [branding, setBranding] = useState(null);

  const { data: content = [] } = useQuery({
    queryKey: ['demo-school-content'],
    queryFn: async () => {
      const allContent = await base44.asServiceRole.entities.DemoSchoolContent.filter(
        { publish_status: 'published' },
        '-publish_date',
        100
      );
      return allContent;
    }
  });

  useEffect(() => {
    const loadBranding = async () => {
      const brandingRecords = await base44.asServiceRole.entities.DemoSchoolBranding.list();
      if (brandingRecords.length > 0) {
        setBranding(brandingRecords[0]);
      }
    };
    loadBranding();
  }, []);

  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.content_type === selectedCategory);

  const featuredContent = content.find(item => item.featured);
  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'sports_highlight', label: 'Sports' },
    { id: 'student_spotlight', label: 'Student Spotlights' },
    { id: 'school_news', label: 'School News' },
    { id: 'event_story', label: 'Events' },
    { id: 'club_feature', label: 'Clubs' },
    { id: 'announcement', label: 'Announcements' }
  ];

  if (!branding) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="bg-white">
      <MarketingNav />

      {/* Hero */}
      <section 
        style={{
          background: `linear-gradient(135deg, ${branding.primary_color} 0%, ${branding.accent_color} 100%)`
        }}
        className="text-white py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: branding.secondary_color }}
            >
              🅷
            </div>
            <div>
              <h1 className="text-5xl font-bold">{branding.school_name}</h1>
              <p className="text-xl text-blue-100">{branding.short_description}</p>
            </div>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl">
            Welcome to North Valley High School's streaming media channel. This is a demo experience showing what your school could build with our platform.
          </p>
        </div>
      </section>

      {/* Featured Content */}
      {featuredContent && (
        <section className="bg-slate-50 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Featured Story</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-slate-200">
              <div className="grid md:grid-cols-2">
                <img 
                  src={featuredContent.thumbnail_url} 
                  alt={featuredContent.title}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: branding.accent_color }}
                    >
                      {featuredContent.content_type.replace('_', ' ').title()}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{featuredContent.title}</h3>
                  <p className="text-lg text-slate-600 mb-6">{featuredContent.summary}</p>
                  <div className="flex items-center gap-6 text-slate-500 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredContent.publish_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {featuredContent.view_count || 0} views
                    </div>
                  </div>
                  <a 
                    href={`/demo-school-story/${featuredContent.slug}`}
                    className="inline-flex items-center gap-2 font-bold text-white w-fit px-6 py-3 rounded-lg hover:opacity-90 transition"
                    style={{ backgroundColor: branding.primary_color }}
                  >
                    Read Full Story <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="bg-white py-8 px-4 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.id ? branding.primary_color : 'transparent'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">
            {selectedCategory === 'all' ? 'Latest Stories' : `${categories.find(c => c.id === selectedCategory)?.label}`}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {filteredContent.filter(item => !item.featured).map(item => (
              <a
                key={item.id}
                href={`/demo-school-story/${item.slug}`}
                className="group bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition"
              >
                <img 
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
                <div className="p-4">
                  <span 
                    className="inline-block px-2 py-1 rounded text-xs font-semibold text-white mb-2"
                    style={{ backgroundColor: branding.accent_color }}
                  >
                    {item.category}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3">{item.summary}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(item.publish_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {item.view_count || 0}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Info */}
      <section className="bg-slate-50 py-16 px-4 border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">This is a Fictional Demo School</h2>
          <p className="text-lg text-slate-600 mb-8">
            North Valley High School is a completely fictional school created to demonstrate what your school's streaming channel could look like. All content is AI-generated or stock photography to showcase the platform's capabilities.
          </p>
          <p className="text-slate-600 mb-8">
            This demo shows how you can automatically generate and publish professional school media content—from sports highlights to student spotlights, event coverage to announcements.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        style={{ backgroundColor: branding.primary_color }}
        className="text-white py-16 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build This for Your School?</h2>
          <p className="text-lg text-blue-100 mb-10">
            See how your school can create, moderate, and publish professional media content automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://calendly.com/bulldog-tv-sales" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition gap-2"
            >
              Book a Live Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a 
              href="/schooltv-deal-room"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition gap-2"
            >
              Back to Deal Room
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}