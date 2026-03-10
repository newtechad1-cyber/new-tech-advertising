import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Calendar, Eye, Share2, ArrowLeft } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

export default function DemoSchoolStoryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stories = await base44.asServiceRole.entities.DemoSchoolContent.filter(
          { slug, publish_status: 'published' }
        );
        if (stories.length > 0) {
          setStory(stories[0]);
          // Increment view count
          await base44.asServiceRole.entities.DemoSchoolContent.update(stories[0].id, {
            view_count: (stories[0].view_count || 0) + 1
          });
        }

        const brandingRecords = await base44.asServiceRole.entities.DemoSchoolBranding.list();
        if (brandingRecords.length > 0) {
          setBranding(brandingRecords[0]);
        }
      } catch (error) {
        console.error('Error loading story:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!story || !branding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Story not found</h1>
        <button
          onClick={() => navigate('/demo-school-channel')}
          className="text-blue-600 hover:underline"
        >
          Back to channel
        </button>
      </div>
    );
  }

  const relatedContent = [];

  return (
    <div className="bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/demo-school-channel')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Channel
          </button>
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: branding.accent_color }}
            >
              {story.category}
            </span>
            <span className="text-slate-600 text-sm">{story.fictional_school_name}</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">{story.title}</h1>
          <div className="flex items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {new Date(story.publish_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {story.view_count || 0} views
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {story.thumbnail_url && (
            <img 
              src={story.thumbnail_url}
              alt={story.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-slate-700 font-semibold mb-6">{story.summary}</p>
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-700">
              {story.script}
            </div>
          </div>

          {story.tags && (
            <div className="border-t border-slate-200 pt-8">
              <h3 className="font-bold text-slate-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {story.tags.split(',').map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Demo Info Box */}
      <section className="bg-blue-50 py-12 px-4 border-t border-blue-200">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">💡 This is a Demo School</h3>
            <p className="text-slate-700 mb-4">
              North Valley High School is a fictional school created to showcase the platform. This story, like all demo content, was AI-generated to demonstrate how your school can automatically create professional school media.
            </p>
            <p className="text-slate-700">
              With our platform, your school can submit real student and staff content, get it reviewed and approved, and have it automatically transformed into polished videos and stories.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        style={{ backgroundColor: branding.primary_color }}
        className="text-white py-16 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">See This for Your School</h2>
          <p className="text-lg text-blue-100 mb-8">
            Explore how your school can create, moderate, and publish professional media content.
          </p>
          <a 
            href="https://calendly.com/bulldog-tv-sales" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            Book a Live Demo
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}